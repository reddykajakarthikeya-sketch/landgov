import requests
import json
import sys

BASE_URL = "http://127.0.0.1:8000"

def get_token(email, password):
    res = requests.post(f"{BASE_URL}/api/auth/login", json={"email": email, "password": password})
    if res.status_code == 200:
        return res.json().get("access_token")
    return None

def test_role_dashboards():
    print("=" * 70)
    print("RUNNING COMPREHENSIVE ROLE-BASED DASHBOARD & RBAC TEST SUITE")
    print("=" * 70)

    # 1. Login all roles
    tokens = {
        "public": None,
        "researcher": get_token("researcher@iitd.ac.in", "Admin@1234"),
        "policymaker": get_token("policymaker@mord.gov.in", "Admin@1234"),
        "institution_admin": get_token("institution@nirdpr.ac.in", "Admin@1234"),
        "platform_admin": get_token("admin@dolr.gov.in", "Admin@1234"),
    }

    for role, tok in tokens.items():
        if role != "public":
            assert tok is not None, f"Failed to authenticate {role}"
            print(f"[OK] Authenticated as {role}")

    # 2. Test Dashboard Overview for each role
    dashboards = {}
    for role, tok in tokens.items():
        headers = {"Authorization": f"Bearer {tok}"} if tok else {}
        res = requests.get(f"{BASE_URL}/api/dashboard/overview", headers=headers)
        assert res.status_code == 200, f"Dashboard overview failed for {role}: {res.status_code}"
        data = res.json()
        dashboards[role] = data
        rd = data.get("role_dashboard", {})
        cards = rd.get("kpi_cards", [])
        actions = rd.get("quick_actions", [])
        print(f"\n[OK] {role.upper()} Dashboard:")
        print(f"     Role Badge:     {rd.get('role_badge')}")
        print(f"     Role Headline:  {rd.get('headline')}")
        print(f"     KPI Cards:      {len(cards)}")
        for c in cards:
            print(f"       - {c.get('label')}: {c.get('value')} ({c.get('detail')})")
        print(f"     Quick Actions:  {len(actions)}")
        assert len(cards) == 4, f"Expected 4 cards for {role}, got {len(cards)}"
        assert len(actions) == 4, f"Expected 4 quick actions for {role}, got {len(actions)}"
        expected_role_str = "public_user" if role == "public" else role
        assert rd.get("role") == expected_role_str

    # 3. Test Consistency of Shared National Metrics across all 5 roles
    print("\n" + "-" * 70)
    print("Verifying Shared National Indicators Consistency across all 5 roles...")
    ref_counts = dashboards["public"]["counts"]
    ref_states = dashboards["public"]["state_comparisons"]
    for role in ["researcher", "policymaker", "institution_admin", "platform_admin"]:
        curr_counts = dashboards[role]["counts"]
        curr_states = dashboards[role]["state_comparisons"]
        assert curr_counts["research_publications"] == ref_counts["research_publications"], f"Publications mismatch in {role}"
        assert curr_counts["available_datasets"] == ref_counts["available_datasets"], f"Datasets mismatch in {role}"
        assert curr_counts["participating_institutions"] == ref_counts["participating_institutions"], f"Institutions mismatch in {role}"
        assert len(curr_states) == len(ref_states), f"State comparisons count mismatch in {role}"
        print(f"     [CONSISTENT] {role.ljust(18)}: counts & state metrics match Public dashboard exactly.")

    # 4. Role-Specific Data Integrity in role_sections
    print("\n" + "-" * 70)
    print("Verifying Role-Specific Data Integrity in role_sections...")
    
    # Public
    pub_sec = dashboards["public"]["role_dashboard"]["role_sections"]
    assert "public_notice" in pub_sec, "Public missing public_notice"
    assert "restricted_modules" in pub_sec, "Public missing restricted_modules"
    print(f"     [OK] Public: {len(pub_sec.get('restricted_modules', []))} restricted modules identified.")

    # Researcher
    res_sec = dashboards["researcher"]["role_dashboard"]["role_sections"]
    assert "my_projects" in res_sec, "Researcher missing my_projects"
    assert "my_tasks" in res_sec, "Researcher missing my_tasks"
    print(f"     [OK] Researcher: {len(res_sec['my_projects'])} personal projects & {len(res_sec['my_tasks'])} assigned tasks loaded.")

    # Policymaker
    pol_sec = dashboards["policymaker"]["role_dashboard"]["role_sections"]
    assert "state_watch_list" in pol_sec, "Policymaker missing state_watch_list"
    assert "corridor_delays" in pol_sec, "Policymaker missing corridor_delays"
    assert "pending_sanctions" in pol_sec, "Policymaker missing pending_sanctions"
    print(f"     [OK] Policymaker: {len(pol_sec['corridor_delays'])} corridor bottlenecks & {len(pol_sec['pending_sanctions'])} grant sanction requests in queue.")

    # Institution Admin
    inst_sec = dashboards["institution_admin"]["role_dashboard"]["role_sections"]
    assert "institution_projects" in inst_sec, "Institution Admin missing institution_projects"
    assert "institution_members" in inst_sec, "Institution Admin missing institution_members"
    print(f"     [OK] Institution Admin: {len(inst_sec['institution_projects'])} institutional projects & {len(inst_sec['institution_members'])} affiliated faculty/scholars.")

    # Platform Admin
    adm_sec = dashboards["platform_admin"]["role_dashboard"]["role_sections"]
    assert "system_services" in adm_sec, "Platform Admin missing system_services"
    assert "recent_audit_logs" in adm_sec, "Platform Admin missing recent_audit_logs"
    print(f"     [OK] Platform Admin: {len(adm_sec['system_services'])} monitored microservices & {len(adm_sec['recent_audit_logs'])} recent security audit records.")

    # 5. Test Backend RBAC & Permission Enforcement
    print("\n" + "-" * 70)
    print("Testing Backend RBAC & Authorization Boundaries (HTTP 401/403 Guards)...")

    # A. Public User Restrictions
    pub_headers = {}
    r = requests.get(f"{BASE_URL}/api/auth/users", headers=pub_headers)
    assert r.status_code in [401, 403], f"Public accessed /api/auth/users: {r.status_code}"
    r = requests.get(f"{BASE_URL}/api/auth/audit-logs", headers=pub_headers)
    assert r.status_code in [401, 403], f"Public accessed /api/auth/audit-logs: {r.status_code}"
    r = requests.post(f"{BASE_URL}/api/projects", json={"title": "Unauthorized Project"}, headers=pub_headers)
    assert r.status_code in [401, 403], f"Public created project: {r.status_code}"
    r = requests.post(f"{BASE_URL}/api/simulation/scenarios", json={"title": "Unauthorized Scenario"}, headers=pub_headers)
    assert r.status_code in [401, 403], f"Public created scenario: {r.status_code}"
    print("     [SECURED] Public user blocked from user administration, audit logs, project creation, and simulation lab.")

    # B. Researcher Boundaries
    res_headers = {"Authorization": f"Bearer {tokens['researcher']}"}
    r = requests.get(f"{BASE_URL}/api/auth/users", headers=res_headers)
    assert r.status_code == 403, f"Researcher accessed /api/auth/users: {r.status_code}"
    r = requests.get(f"{BASE_URL}/api/auth/audit-logs", headers=res_headers)
    assert r.status_code == 403, f"Researcher accessed /api/auth/audit-logs: {r.status_code}"
    r = requests.get(f"{BASE_URL}/api/grants/admin/applications", headers=res_headers)
    assert r.status_code == 403, f"Researcher accessed grant admin: {r.status_code}"
    r = requests.get(f"{BASE_URL}/api/projects", headers=res_headers)
    assert r.status_code == 200, "Researcher could not access their projects"
    print("     [SECURED] Researcher strictly restricted from user admin, audit logs, and grant sanctions queue.")

    # C. Policymaker Boundaries
    pol_headers = {"Authorization": f"Bearer {tokens['policymaker']}"}
    r = requests.get(f"{BASE_URL}/api/auth/users", headers=pol_headers)
    assert r.status_code == 403, f"Policymaker accessed user management: {r.status_code}"
    r = requests.get(f"{BASE_URL}/api/auth/audit-logs", headers=pol_headers)
    assert r.status_code == 403, f"Policymaker accessed audit logs: {r.status_code}"
    r = requests.get(f"{BASE_URL}/api/grants/admin/applications", headers=pol_headers)
    assert r.status_code == 200, f"Policymaker could not access grant sanction queue: {r.status_code}"
    print("     [SECURED] Policymaker authorized for grant sanctions queue; restricted from user management and security audit logs.")

    # D. Institution Admin Scope
    inst_headers = {"Authorization": f"Bearer {tokens['institution_admin']}"}
    r = requests.get(f"{BASE_URL}/api/auth/audit-logs", headers=inst_headers)
    assert r.status_code == 403, f"Institution Admin accessed system audit logs: {r.status_code}"
    r = requests.get(f"{BASE_URL}/api/auth/users", headers=inst_headers)
    assert r.status_code == 200, f"Institution Admin could not view institution users: {r.status_code}"
    inst_users = r.json()
    for u in inst_users:
        assert "NIRDPR" in u["organization"] or "National Institute" in u["organization"], f"Leaked user {u['email']} from {u['organization']} to institution admin"
    print(f"     [SECURED] Institution Admin scoped strictly to their institution ({len(inst_users)} users visible, 0 cross-institution leakage).")

    # E. Platform Admin Apex Access
    admin_headers = {"Authorization": f"Bearer {tokens['platform_admin']}"}
    r = requests.get(f"{BASE_URL}/api/auth/users", headers=admin_headers)
    assert r.status_code == 200, "Platform admin could not get all users"
    all_users = r.json()
    assert len(all_users) >= 5, "Platform admin did not receive all users"
    
    r = requests.get(f"{BASE_URL}/api/auth/audit-logs", headers=admin_headers)
    assert r.status_code == 200, "Platform admin could not get audit logs"
    audit_logs = r.json()
    assert len(audit_logs) > 0, "No audit logs returned for admin"
    print(f"     [SECURED] Platform Admin has apex governance visibility: {len(all_users)} total users across all institutions, {len(audit_logs)} security audit logs.")

    print("\n" + "=" * 70)
    print("ALL 5 ROLE-BASED DASHBOARDS & RBAC SECURITY TESTS PASSED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    test_role_dashboards()
