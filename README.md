# National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance

**Smart India Hackathon (SIH) 2026**
**Ministry / Department:** Ministry of Rural Development (MoRD) / Department of Land Resources (DoLR), Government of India
**Theme:** Digital Knowledge Management, Artificial Intelligence, Geospatial Technologies & Evidence-Based Policy Innovation for Land Governance
**Problem Statements Integrated:** **26019** (Primary), **26018**, **26016**, **25017**, and **26015**

---

## 🏛️ Executive Overview
India's land administration ecosystem has traditionally been implementation-oriented, with limited institutional focus on applied research, empirical policy experimentation, and evidence-based innovation. 

The **National Digital Platform for Land Governance (NDP-LG)** integrates cadastral records, satellite imagery, legal dockets, and socio-economic datasets into a unified, secure, AI-enabled research and decision-support ecosystem.

---

## 🚀 Live Demonstration URLs
- **Public Live Tunnel (Zero-Password Shareable Link):** [https://patches-chairs-entrance-grove.trycloudflare.com](https://patches-chairs-entrance-grove.trycloudflare.com)
- **Local Frontend Web Portal:** [http://127.0.0.1:5173](http://127.0.0.1:5173)
- **Backend API Gateway:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive OpenAPI/Swagger Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Alternative API Reference (ReDoc):** [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

### 🧪 Automated SIH Demonstration Workflow Audit (100% Pass)
To execute the comprehensive automated audit verifying Steps 1-6 and the end-to-end sequential workflow:
```bash
python backend/tests/test_sih_demo_workflow.py
```
*(Audit report generated at [`SIH_DEMO_TEST_REPORT.md`](SIH_DEMO_TEST_REPORT.md))*

---

## 📂 Official SIH Dataset Integration
- **Official Google Drive Folder:** [https://drive.google.com/drive/folders/1ibmzWpl_nK7aBhQurs22R9kqh9fPAQwC](https://drive.google.com/drive/folders/1ibmzWpl_nK7aBhQurs22R9kqh9fPAQwC)
- **Status:** **VERIFIED & FULLY INTEGRATED**
- **Ingested Artifacts (Department of Land Resources):**
  1. `26019.pdf`: National Digital Platform for Research, Policy Innovation & Land Governance (Flagship Problem Statement & Technical Architecture)
  2. `26018.pdf`: Intelligent Multilingual Land Record Digitization and Validation System (Indic OCR & Khasra parsing)
  3. `26016.pdf`: Unified Land Acquisition & Real-Time Monitoring Platform (GIS geo-tagging & cadastral workflow)
  4. `25017.pdf`: Predictive Analytics System for Early Detection of Land Acquisition Delays (ML delay risk scoring)
  5. `26015.pdf`: Geospatial Analysis & Interpretation of Geo-Coded Satellite Images for Watershed Outcomes (SRISHTI-DRISHTI 30m Satellite Interventions)

---

## 👥 Role-Based Access Control (RBAC) & Test Accounts
The platform features an instant **Role Switcher** in the top navigation bar to test backend-enforced permissions across all 5 user classes:

| Role | Test Email | Password | Scope & Permissions |
| :--- | :--- | :--- | :--- |
| **Platform Admin** | `admin@dolr.gov.in` | `Admin@1234` | Full system governance, audit logs, dataset verification, user management |
| **MoRD Policymaker** | `policymaker@mord.gov.in` | `Admin@1234` | Policy simulations, national benchmarks, executive dashboards, grant approvals |
| **Institution Admin** | `institution@nirdpr.ac.in` | `Admin@1234` | Research project initiation, institutional consortia oversight, grant routing |
| **Researcher** | `researcher@iitd.ac.in` | `Admin@1234` | Resource submissions, AI research queries, collaborative workspaces, tasks |
| **Public User** | `citizen@public.org` | `Admin@1234` | Open access repository search, public DILRMP data preview, knowledge exploration |

---

## 🧩 Core Platform Modules
1. **National Dashboard:** High-level KPIs, DILRMP modernization benchmarks (97.8% RoR computerization, 93.0% cadastral digitization), Recharts land-use change trends (2018-2024), climate resilience metrics, and revenue dispute pendency.
2. **Research Repository:** Centralized repository with full-text search, domain/type filters, SIH official document toggle, modal document previews, citation generator, and PDF downloads.
3. **AI Research Assistant:** Grounded RAG engine providing document summarization, literature review outline drafting, research gap discovery, and dataset recommendation with verifiable citations.
4. **GIS Explorer & Cadastral Maps:** Interactive Leaflet map with multi-layer controls for DILRMP state status, Bhuvan SRISHTI-DRISHTI 30m watershed sites (MoRD 26015), and infrastructure acquisition delay markers (MoRD 25017/26016).
5. **Policy Analytics:** Time-series trends (Agricultural vs Built-up shift), pie charts of revenue dispute categories (Inheritance, Encroachment, Acquisition), delay stage analysis, and state performance matrix.
6. **Policy Simulation Lab:** Transparent rule-based decision-support engine with interactive sliders (Urban growth %, Agri protection %, Forest conservation %, Industrial corridors ha, Solar parks ha, Waterbody buffer m), explicit mathematical formulas, assumptions, and limitations.
7. **Collaborative Research Workspace:** Database-backed project management with objectives checklists, task assignment with real-time status toggling, milestones tracking, and discussion comments.
8. **Innovation & Grants Portal:** Research grants, hackathons (SIH 2026), pilot projects, online eligibility verification, application submission with automated tracking number generation (`DoLR-GR-XX-XXXX`).
9. **Dataset Management Console:** Mandatory 9-field inventory (Dataset name, Source, Format, Record count, Fields, Geographic coverage, Import date, Validation status, Integration status) with schema viewer and data previews.
10. **Scope of Study:** Dedicated searchable matrix containing Research domains, Fundamental research questions, Required datasets, Analytical methods, and Expected outputs.
11. **Suggested Tech Stack:** End-to-end technology architecture table mapping components, technologies, purpose, implementation statuses, and future roadmaps.
12. **API & System Integrations:** Gateway console managing connections with ISRO Bhuvan, DILRMP, NJDG e-Courts, and PM Gati Shakti with manual sync triggers and sandboxed simulation disclosure.

---

## 🛠️ Technology Architecture
- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, Recharts, Leaflet, React-Leaflet
- **Backend:** Python 3.14, FastAPI, Uvicorn, Pydantic v2, PyPDF
- **Database:** SQLAlchemy ORM with SQLite / PostgreSQL with PostGIS compatibility
- **Security:** JWT (JSON Web Tokens), Bcrypt password hashing, Role-Based Access Control (RBAC), Audit logging

---

## ⚡ How to Run the Application

### 1. Start Backend Server
```powershell
cd backend
python -m app.seed_data   # Seeds all database tables, users, and SIH documents
python run.py             # Launches server on http://127.0.0.1:8000
```

### 2. Start Frontend Client
```powershell
cd frontend
npm install               # Installs dependencies
npm run dev               # Launches Vite dev server on http://127.0.0.1:5173
```

### 3. Run Automated Test Suite
```powershell
cd backend
python tests/test_platform.py
```
