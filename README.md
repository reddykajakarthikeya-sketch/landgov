# LandGov

### National Digital Platform for Research, Policy Innovation & Evidence-Based Land Governance
**Smart India Hackathon (SIH 2026) — Problem Statement 26019**  
**Nodal Ministry:** Ministry of Rural Development (MoRD) / Department of Land Resources (DoLR), Government of India  
**Integrated Directives:** MoRD Problem Statements **26019** (Primary), **26018**, **26016**, **25017**, and **26015**

---

## 1. Project Overview

India's land governance system has historically focused on routine administrative implementation, with limited capacity for applied empirical research, predictive analytics, and data-backed policy experimentation. 

**LandGov** is an enterprise-grade national digital gateway that unites spatial cadastre, satellite remote sensing, revenue court jurisprudence, and socio-economic datasets into an evidence-based decision-support and research platform.

---

## 2. Problem Statement

Under SIH Problem Statement **26019**, the Ministry of Rural Development (Department of Land Resources) identified critical systemic gaps:
- **Fragmented Data Silos:** Cadastral records, revenue courts (NJDG), satellite interventions (ISRO Bhuvan), and infrastructure corridors (PM Gati Shakti) operate independently without interoperable interfaces.
- **Absence of Empirical Simulation:** Policy formulation lacks interactive econometric and environmental modeling tools to simulate the consequences of land-use transitions before enactment.
- **Academic-Policy Disconnect:** Peer-reviewed land governance research and grassroots institutional studies rarely inform national directives in real time.
- **Language Barriers:** National data portals lack deep, native bilingual parity in Indic languages, restricting state and district-level adoption.

---

## 3. Proposed Solution

LandGov bridges academic research, spatial data, and governance through a unified, secure, AI-powered platform:
1. **Evidence-Based Repository:** Centralized repository for research papers, MoRD policy briefs, and verified datasets with instant PDF text extraction and citation retrieval.
2. **Transparent Policy Simulation Lab:** Rule-based econometric engine that models the multi-factor impacts of urbanization rates, agricultural protection thresholds, and forest buffers on food security, carbon sinks, and dispute density.
3. **Multi-Layer Dark GIS Engine:** Interactive Leaflet GIS mapping 14 Indian states, DILRMP cadastral digitization benchmarks, Bhuvan 30m watershed interventions (MoRD 26015), and infrastructure delay hotspots (MoRD 25017).
4. **Grounded AI Research Assistant:** Zero-hallucination Retrieval-Augmented Generation (RAG) providing verifiable citations from official MoRD statutory documents.
5. **Role-Based Collaboration & Consortia:** Scoped workspaces for Researchers, Policymakers, Institution Admins, Platform Admins, and Citizens.
6. **Neo-Institutional Liquid Chrome Design:** Aesthetic marrying institutional authority with liquid glass depth, 3D mouse perspective interactions, and complete English/Hindi bilingual parity.

---

## 4. Key Features

- **National KPI Dashboard:** Live benchmarks across DILRMP (97.8% RoR computerization, 93.0% cadastral digitization), time-series land use transitions, and revenue court dispute distributions.
- **Interactive GIS Cadastral Explorer:** Dynamic vector boundaries, satellite layer filters, and state profile drawers with direct cross-module action buttons.
- **Bilingual Translation System:** 100% translation parity across 18 namespaces and 259 keys (`en.json` & `hi.json`) with persistent user preference and `Noto Sans Devanagari` typography.
- **AI Research Assistant:** Multi-mode assistant (*Evidence-Based Q&A*, *Paper Summarizer*, *Lit Review Drafter*, *Research Gap Finder*, *Dataset Recommender*) with primary source citations.
- **Policy Simulation Lab:** 6 adjustable policy levers recalculating econometric projections in real time with transparent mathematical formulas and scenario saving.
- **Collaborative Research Workspace:** Consortium task management, objective checklists, milestone tracking, and researcher discussion feeds.
- **Innovation & Research Grants:** Digital grant application workflow with automated tracking codes (`DoLR-GR-XX-XXXX`) and status routing.
- **Immutable Cryptographic Audit Trails:** Administrative logging of all system actions (logins, queries, downloads, mutations) with timestamps and client metadata.

---

## 5. System Workflow

```
                                  +-----------------------------+
                                  |   Public / Authenticated    |
                                  |      User Entry Point       |
                                  +--------------+--------------+
                                                 |
                                                 v
                                  +-----------------------------+
                                  |     Vite + React Client     |
                                  |   (Bilingual / Liquid UI)   |
                                  +--------------+--------------+
                                                 |
                       +-------------------------+-------------------------+
                       |                                                   |
                       v                                                   v
        +-----------------------------+                     +-----------------------------+
        |     FastAPI REST Gateway    |                     |     Interactive Leaflet     |
        |  (JWT Auth & RBAC Security) |                     |      Geospatial Engine      |
        +--------------+--------------+                     +--------------+--------------+
                       |                                                   |
       +---------------+---------------+                                   |
       |               |               |                                   |
       v               v               v                                   |
+-------------+ +-------------+ +-------------+                            |
| AI Grounded | | Simulation  | | SQLite /    |<---------------------------+
| RAG Service | | Rule Engine | | PostgreSQL  |
+-------------+ +-------------+ +-------------+
       |
       v
+-------------+
| Official    |
| MoRD PDFs   |
+-------------+
```

---

## 6. Technology Stack

### Frontend Client
- **Framework:** React 19, TypeScript
- **Bundler & Tooling:** Vite v8.3.2, `@tailwindcss/vite`
- **Styling & Design System:** Tailwind CSS v4, custom Neo-Institutional Liquid Chrome tokens
- **Data Visualization:** Recharts (Responsive Area, Bar, Pie charts)
- **Geospatial Mapping:** Leaflet, React-Leaflet (Dark inverted geospatial tiles)
- **Icons & Motion:** Lucide React, hardware-accelerated 3D mouse perspective transforms (`Card3D.tsx`)
- **Typography:** `Instrument Serif`, `Syne`, `Inter`, `Noto Sans Devanagari`

### Backend API
- **Framework:** Python 3.14, FastAPI, Starlette
- **Server:** Uvicorn ASGI
- **Data Validation & Serialization:** Pydantic v2
- **Document Ingestion:** PyPDF (text extraction & indexing)
- **Authentication & Security:** Python-Jose (JWT), Passlib / Bcrypt

### Database & Storage
- **ORM:** SQLAlchemy
- **Database Engine:** SQLite (local development / demo) with PostgreSQL / PostGIS compatibility
- **Data Seeding:** Built-in automated ingestion script for official MoRD datasets

---

## 7. Project Structure

```
national-land-governance-platform/
├── backend/
│   ├── app/
│   │   ├── models/            # SQLAlchemy database entities
│   │   ├── routers/           # FastAPI modular API routers
│   │   │   ├── auth.py        # Authentication & RBAC endpoints
│   │   │   ├── dashboard.py   # National KPIs & time-series data
│   │   │   ├── repository.py  # Research publications & downloads
│   │   │   ├── ai_assistant.py# Grounded AI research assistant
│   │   │   ├── gis.py         # Geospatial states & layers
│   │   │   ├── simulation.py  # Econometric simulation calculation
│   │   │   ├── analytics.py   # Land-use and litigation analytics
│   │   │   ├── projects.py    # Collaborative workspaces & tasks
│   │   │   ├── grants.py      # Innovation grants & applications
│   │   │   └── datasets.py    # Dataset inventory & schemas
│   │   ├── services/          # Core domain business logic
│   │   │   ├── ai_service.py  # RAG search & grounding engine
│   │   │   ├── gis_service.py # Spatial data handling
│   │   │   └── simulation_engine.py # Mathematical formula solver
│   │   ├── config.py          # Environment settings & secrets
│   │   ├── database.py        # Database session management
│   │   ├── main.py            # FastAPI application factory
│   │   ├── schemas.py         # Pydantic request/response schemas
│   │   └── seed_data.py       # Official dataset seeding script
│   ├── raw_dataset/           # Official MoRD problem statement PDFs
│   ├── tests/                 # Automated pytest test suites
│   ├── requirements.txt       # Python dependencies
│   └── run.py                 # Backend launch script
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI & layout components
│   │   │   ├── auth/          # LoginModal with 1-click RBAC switcher
│   │   │   ├── layout/        # Navbar, Sidebar, Layout, Footer
│   │   │   └── ui/            # Card3D perspective tilt component
│   │   ├── context/           # React AuthContext (JWT & roles)
│   │   ├── i18n/              # LanguageContext & translations
│   │   │   ├── en.json        # English translation strings (259 keys)
│   │   │   └── hi.json        # Hindi translation strings (259 keys)
│   │   ├── pages/             # All 14 platform pages
│   │   ├── services/          # Axios API service client
│   │   ├── types/             # TypeScript domain definitions
│   │   ├── App.tsx            # Main application router & guards
│   │   ├── index.css          # Design system & dark liquid chrome tokens
│   │   └── main.tsx           # React DOM root entry
│   ├── package.json           # Frontend dependencies & scripts
│   ├── vite.config.ts         # Vite server & API proxy configuration
│   └── index.html             # HTML entry & font declarations
├── .env.example               # Environment variables template
├── .gitignore                 # Production Git ignore rules
├── run_app.py                 # Unified full-stack launch script
├── FINAL_QA_AUDIT_REPORT.md   # Comprehensive QA audit documentation
└── README.md                  # Project documentation
```

---

## 8. Installation Instructions

### Prerequisites
- **Python:** 3.10 or higher (Python 3.14 verified)
- **Node.js:** 18.0 or higher (Node.js 20+ recommended)
- **npm:** 9.0 or higher
- **Git**

### Clone Repository
```bash
git clone <repository-url>
cd national-land-governance-platform
```

### Backend Setup
```bash
cd backend
python -m venv venv

# Windows PowerShell:
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### Frontend Setup
```bash
cd ../frontend
npm install
```

---

## 9. Environment Variables

Create a `.env` file in the project root or backend folder based on `.env.example`:

```env
# Platform Meta
PROJECT_NAME="National Digital Platform for Land Governance"
VERSION="1.0.0"

# Database Configuration (Defaults to local SQLite if omitted)
# DATABASE_URL="postgresql://user:password@localhost:5432/landgov"
DATABASE_URL=""

# JWT Security
SECRET_KEY="sih-mord-dolr-land-governance-secret-key-2026-secure-token"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Optional Live LLM Keys (Falls back to Grounded Domain Heuristic Engine if omitted)
OPENAI_API_KEY=""
GEMINI_API_KEY=""
```

---

## 10. Running the Project Locally

### Option A: Unified Launcher (Recommended)
From the project root:
```bash
python run_app.py
```
*To also launch a public Cloudflare tunnel, run:*
```bash
python run_app.py --share
```

### Option B: Running Services Separately

**1. Launch Backend:**
```bash
cd backend
python run.py
```
*API will run at `http://127.0.0.1:8000` (Swagger docs at `/docs`).*

**2. Launch Frontend:**
```bash
cd frontend
npm run dev
```
*Web application will run at `http://localhost:5173`.*

---

## 11. Build Instructions

### Building Frontend for Production
```bash
cd frontend
npm run build
```
*Build artifacts are written to `frontend/dist/` in < 600ms.*

### Running Automated Test Verification
Run all automated test suites to verify integrity:
```bash
# Bilingual Parity, 3D Cards & Layout Responsiveness
python -m pytest backend/tests/test_bilingual_ui_audit.py -v

# Role-Based Access Control (RBAC) Permissions
python -m pytest backend/tests/test_role_dashboards.py -v

# End-to-End SIH 9-Phase Workflow
python backend/tests/test_sih_demo_workflow.py

# Core API Platform Tests
python -m pytest backend/tests/test_platform.py -v
```

---

## 12. Deployment Guide

### Architecture Overview
- **Frontend:** Hosted on **GitHub Pages** at `https://reddykajakarthikeya-sketch.github.io/landgov/` via GitHub Actions (`.github/workflows/deploy-frontend.yml`).
- **Backend:** Hosted on **Render** (or any container PaaS) running FastAPI with Uvicorn ASGI on `0.0.0.0:$PORT`.
- **Database:** Production-ready for **PostgreSQL** (with automated fallback to SQLite for local development).
- **Local Dev:** `npm run dev` (Vite) + `python run.py` (FastAPI), with automatic local reverse proxying.

### 1. Frontend: GitHub Pages Setup
1. In your GitHub repository, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.
3. Under **Settings → Secrets and variables → Actions → Variables**, add:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://landgov-backend.onrender.com`).
4. On every push to `main` (or via manual trigger in **Actions → Deploy Frontend to GitHub Pages**), the frontend will build and deploy automatically to:
   `https://reddykajakarthikeya-sketch.github.io/landgov/`

### 2. Backend: Render Deployment Setup
1. Create a **New Web Service** on [Render](https://render.com) connected to this repository (or use the provided `render.yaml`).
2. Set configuration:
   - **Root Directory:** `backend`
   - **Environment:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `python -m app.seed_data && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add Environment Variables in Render:
   - `PYTHON_VERSION`: `3.11.8`
   - `SECRET_KEY`: Set a secure random string (e.g. `openssl rand -hex 32`).
   - `FRONTEND_URL`: `https://reddykajakarthikeya-sketch.github.io`
   - `CORS_ORIGINS`: `https://reddykajakarthikeya-sketch.github.io,https://reddykajakarthikeya-sketch.github.io/landgov,http://localhost:5173,http://127.0.0.1:5173`
   - `DATABASE_URL`: *(Optional)* Your PostgreSQL connection string (e.g. `postgresql://user:pass@host:5432/landgov`). If omitted, uses local SQLite database.

### 3. Key Environment Variables Reference
| Variable | Scope | Description | Example Value |
| :--- | :--- | :--- | :--- |
| `VITE_API_URL` | Frontend | Deployed backend URL (used by Vite at build time) | `https://landgov-backend.onrender.com` |
| `FRONTEND_URL` | Backend | Allowed production frontend origin for CORS | `https://reddykajakarthikeya-sketch.github.io` |
| `CORS_ORIGINS` | Backend | Comma-separated list of allowed CORS origins | `https://reddykajakarthikeya-sketch.github.io,http://localhost:5173` |
| `DATABASE_URL` | Backend | PostgreSQL / SQLite database connection URL | `postgresql://user:pass@host:5432/landgov` |
| `SECRET_KEY` | Backend | Cryptographic secret for signing JWT auth tokens | Secure 64-char random hexadecimal string |

---

## 12. Pre-Seeded Demonstration Accounts

All accounts use the unified demonstration password: **`Admin@1234`**

| Role | Test Email | Demonstration Persona | Scope & Privileges |
| :--- | :--- | :--- | :--- |
| **Platform Administrator** | `admin@dolr.gov.in` | Dr. Rajeshwar Sharma (DoLR IT Cell) | Apex system governance, user directory status, cryptographic audit logs |
| **MoRD Policymaker** | `policymaker@mord.gov.in` | Smt. Sunita Verma, IAS (PME Division) | Decision consoles, policy simulations, state benchmarks, grant approvals |
| **Institution Administrator** | `institution@nirdpr.ac.in` | Prof. Anand K. Murthy (Director, NIRDPR) | Member directory, institutional consortia oversight, collaborative workspace |
| **Academic Researcher** | `researcher@iitd.ac.in` | Dr. Priyanka Sengupta (IIT Delhi) | Literature reviews, AI research queries, collaborative tasks, grant drafting |
| **Public Citizen** | `citizen@public.org` | Vikramaditya Deshmukh (Civil Society) | Open repository search, public DILRMP data preview, knowledge exploration |

*(Note: Users can also click any role directly in the login modal for instant one-click demonstration).*

---

## 13. Team Information

- **Project:** LandGov (National Digital Platform for Land Governance)
- **Competition:** Smart India Hackathon (SIH 2026)
- **Problem Statement ID:** 26019
- **Organization / Ministry:** Department of Land Resources (DoLR), Ministry of Rural Development (MoRD)
- **Lead Developer:**
Karthikeya
Pragnay 
Cherisma 
Priya 
Anvitha 
Harshit 
(`karthikeya@gmail.com`)
