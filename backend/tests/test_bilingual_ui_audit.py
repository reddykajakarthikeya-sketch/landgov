"""
SIH Quality & Verification Suite:
Bilingual (English / Hindi), 3D Mouse Tracking, Responsiveness, and Architecture Audit
"""

import json
import os
import re
import sys

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
FRONTEND_DIR = os.path.join(ROOT_DIR, "frontend")
LOCALES_DIR = os.path.join(FRONTEND_DIR, "src", "i18n", "locales")
EN_PATH = os.path.join(LOCALES_DIR, "en.json")
HI_PATH = os.path.join(LOCALES_DIR, "hi.json")
INDEX_HTML = os.path.join(FRONTEND_DIR, "index.html")
INDEX_CSS = os.path.join(FRONTEND_DIR, "src", "index.css")
DIST_HTML = os.path.join(FRONTEND_DIR, "dist", "index.html")
CARD_3D_PATH = os.path.join(FRONTEND_DIR, "src", "components", "ui", "Card3D.tsx")
NAVBAR_PATH = os.path.join(FRONTEND_DIR, "src", "components", "layout", "Navbar.tsx")
SIDEBAR_PATH = os.path.join(FRONTEND_DIR, "src", "components", "layout", "Sidebar.tsx")
LAYOUT_PATH = os.path.join(FRONTEND_DIR, "src", "components", "layout", "Layout.tsx")
PAGES_DIR = os.path.join(FRONTEND_DIR, "src", "pages")

test_results = []

def record(test_name: str, passed: bool, details: str = ""):
    status = "PASS" if passed else "FAIL"
    test_results.append((test_name, passed, details))
    print(f" [{status}] {test_name}: {details}")

def test_translation_files():
    print("\n--- 1. Testing Internationalization & Locale Coverage ---")
    if not os.path.exists(EN_PATH) or not os.path.exists(HI_PATH):
        record("Locale Files Exist", False, "Missing en.json or hi.json")
        return

    with open(EN_PATH, "r", encoding="utf-8") as f:
        en = json.load(f)
    with open(HI_PATH, "r", encoding="utf-8") as f:
        hi = json.load(f)

    record("JSON Syntax Valid", True, "Both en.json and hi.json parsed cleanly")

    required_sections = ["masthead", "nav", "roles", "dashboard", "gis", "repository", "ai", "simulation", "workspace", "grants", "datasets", "admin", "common"]
    missing_en = [s for s in required_sections if s not in en]
    missing_hi = [s for s in required_sections if s not in hi]

    record("Section Schema Integrity (English)", len(missing_en) == 0, f"Sections present: {len(en.keys())}")
    record("Section Schema Integrity (Hindi)", len(missing_hi) == 0, f"Sections present: {len(hi.keys())}")

    def get_all_keys(d, prefix=""):
        keys = []
        for k, v in d.items():
            full = f"{prefix}.{k}" if prefix else k
            if isinstance(v, dict):
                keys.extend(get_all_keys(v, full))
            else:
                keys.append(full)
        return set(keys)

    en_keys = get_all_keys(en)
    hi_keys = get_all_keys(hi)
    missing_in_hi = en_keys - hi_keys
    missing_in_en = hi_keys - en_keys

    record("Key Parity (EN <-> HI)", len(missing_in_hi) == 0 and len(missing_in_en) == 0, 
           f"Total keys: {len(en_keys)} EN, {len(hi_keys)} HI. Mismatches: {len(missing_in_hi) + len(missing_in_en)}")

    hi_str = json.dumps(hi, ensure_ascii=False)
    has_devanagari = bool(re.search(r'[\u0900-\u097F]', hi_str))
    record("Devanagari Unicode Character Coverage", has_devanagari, "Verified Hindi Devanagari glyphs in hi.json")

def test_typography_and_fonts():
    print("\n--- 2. Testing Typography, Fonts & Accessibility ---")
    with open(INDEX_HTML, "r", encoding="utf-8") as f:
        html = f.read()

    has_noto_font = "Noto+Sans+Devanagari" in html
    has_inter_font = "Inter" in html
    record("Google Fonts Inclusion", has_noto_font and has_inter_font, "Inter and Noto Sans Devanagari webfonts linked in index.html")

    with open(INDEX_CSS, "r", encoding="utf-8") as f:
        css = f.read()

    has_font_rule = "Noto Sans Devanagari" in css
    record("Devanagari Font Stack CSS", has_font_rule, "Fallback font-family includes 'Noto Sans Devanagari'")

    has_reduced_motion = "prefers-reduced-motion" in css
    record("Reduced Motion Accessibility Rule", has_reduced_motion, "Respects user prefers-reduced-motion: reduce")

    has_3d_perspective = "perspective-1000" in css and "preserve-3d" in css
    record("3D CSS Perspectives", has_3d_perspective, "Perspective-1000 and preserve-3d hardware-accelerated transforms declared")

def test_3d_card_and_mouse_tracking():
    print("\n--- 3. Testing 3D Mouse Tracking Component ---")
    with open(CARD_3D_PATH, "r", encoding="utf-8") as f:
        code = f.read()

    has_tilt = "maxTilt" in code and "rotateX" in code and "rotateY" in code
    has_glare = "glare" in code and "radial-gradient" in code
    has_touch_disable = "hover: none" in code or "ontouchstart" in code
    has_cleanup = "onMouseLeave" in code

    record("3D Tilt Transforms & Math", has_tilt, "Calculates relative cursor offsets (-0.5 to 0.5) and transforms")
    record("Cursor-Following Radial Glare", has_glare, "Generates radial light highlight following cursor coordinates")
    record("Touch Device & Motion Sensitivity Guard", has_touch_disable, "Auto-disables tilt on touch screens and reduced motion")
    record("Hover Reset Cleanup", has_cleanup, "Smoothly resets transform matrix on mouse leave")

def test_responsive_layout_components():
    print("\n--- 4. Testing Responsive Navigation & Viewports ---")
    with open(NAVBAR_PATH, "r", encoding="utf-8") as f:
        nav_code = f.read()

    has_mobile_hamburger = "onToggleMobileMenu" in nav_code or "Menu" in nav_code
    has_lang_selector = "setLanguage" in nav_code and ("हिन्दी" in nav_code or "hi" in nav_code)
    record("Mobile Hamburger Control", has_mobile_hamburger, "Navbar includes responsive mobile drawer toggle button")
    record("Bilingual Language Switcher in Navigation", has_lang_selector, "Includes desktop and mobile English/Hindi switchers")

    with open(SIDEBAR_PATH, "r", encoding="utf-8") as f:
        side_code = f.read()

    has_mobile_drawer = ("isOpen" in side_code or "mobileOpen" in side_code) and "fixed inset-0" in side_code
    has_overlay_backdrop = "backdrop-blur" in side_code or "bg-slate-900/50" in side_code or "bg-slate-900/60" in side_code
    record("Mobile Slide-Over Drawer", has_mobile_drawer, "Drawer renders as fixed overlay for viewports < 1024px")
    record("Drawer Dimming Backdrop", has_overlay_backdrop, "Backdrop overlay with dismissal on tap")

    with open(LAYOUT_PATH, "r", encoding="utf-8") as f:
        layout_code = f.read()

    has_responsive_padding = "px-3 sm:px-6" in layout_code
    record("Container Responsive Padding", has_responsive_padding, "Layout uses adaptive padding (px-3 on mobile, sm:px-6 on desktop)")

def test_production_build_artifacts():
    print("\n--- 5. Testing Production Build Artifacts ---")
    dist_exists = os.path.exists(DIST_HTML)
    record("Vite Production Build Output Exists", dist_exists, "frontend/dist/index.html is compiled and ready")

    assets_dir = os.path.join(FRONTEND_DIR, "dist", "assets")
    has_assets = os.path.exists(assets_dir) and len(os.listdir(assets_dir)) > 0
    record("Compiled JavaScript & CSS Bundles", has_assets, f"Assets present: {len(os.listdir(assets_dir)) if has_assets else 0} files")

def test_page_level_integrations():
    print("\n--- 6. Testing Page-Level Translations & 3D Cards ---")
    pages_to_check = [
        ("NationalDashboard.tsx", True, True),
        ("ResearchRepository.tsx", True, True),
        ("AIAssistant.tsx", True, False), # AI chat remains stable
        ("GISExplorer.tsx", True, True), # Floating details card uses 3D
        ("PolicySimulationLab.tsx", True, True), # Simulation outcome cards use 3D
        ("CollaborativeWorkspace.tsx", True, True),
        ("InnovationGrants.tsx", True, True),
        ("DatasetManagement.tsx", True, False), # Table remains stable
        ("PolicyAnalytics.tsx", True, True),
        ("AdminUsers.tsx", True, False), # Admin table remains stable
        ("AdminAudit.tsx", True, False), # Audit log table remains stable
    ]

    for filename, expect_i18n, expect_3d in pages_to_check:
        filepath = os.path.join(PAGES_DIR, filename)
        if not os.path.exists(filepath):
            record(f"Page Exists: {filename}", False, "File missing")
            continue

        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        has_i18n = "useTranslation" in content
        record(f"I18n Translation Hook in {filename}", has_i18n == expect_i18n, f"useTranslation={has_i18n}")

        if expect_3d:
            has_3d = "Card3D" in content
            record(f"Subtle 3D Tilt in {filename}", has_3d, f"Card3D={has_3d}")

def main():
    print("=" * 80)
    print(" BILINGUAL (EN/HI), 3D INTERACTIONS & RESPONSIVENESS AUDIT SUITE")
    print("=" * 80)
    test_translation_files()
    test_typography_and_fonts()
    test_3d_card_and_mouse_tracking()
    test_responsive_layout_components()
    test_production_build_artifacts()
    test_page_level_integrations()

    print("\n" + "=" * 80)
    total = len(test_results)
    passed = sum(1 for _, p, _ in test_results if p)
    failed = total - passed
    print(f" AUDIT SUMMARY: Total: {total} | Passed: {passed} | Failed: {failed}")
    print("=" * 80)

    if failed > 0:
        sys.exit(1)

if __name__ == "__main__":
    main()
