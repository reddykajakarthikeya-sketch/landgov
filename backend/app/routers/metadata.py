from fastapi import APIRouter

router = APIRouter(prefix="/metadata", tags=["Platform Metadata & Frameworks"])

@router.get("/scope-of-study")
def get_scope_of_study():
    return [
        {
            "domain": "Sustainable Land-Use Planning",
            "research_questions": "How can multi-temporal satellite imagery and agricultural suitability matrices prevent irreversible fragmentation of prime cropland along rapid urbanization corridors?",
            "required_datasets": "DILRMP Cadastral Maps, Ministry of Agriculture 9-fold LULC time-series, Bhuvan Land Degradation Atlas",
            "analytical_methods": "Cellular Automata Urban Growth Modeling, Multi-Criteria Evaluation (MCE), Spatial Econometrics",
            "expected_outputs": "District-level Agricultural Land Preservation Zoning maps, Master Plan density compliance scorecards."
        },
        {
            "domain": "Climate Change & Watershed Resilience",
            "research_questions": "What is the quantitative impact of micro-watershed check dams on soil moisture retention and vegetation canopy recovery in drought-vulnerable agro-climatic zones?",
            "required_datasets": "SRISHTI-DRISHTI 30m multispectral satellite archive, Central Ground Water Board (CGWB) aquifer levels, IMD daily rainfall rasters",
            "analytical_methods": "Normalized Difference Vegetation Index (NDVI) differencing, Soil Water Assessment Tool (SWAT), Hydrological catchment modeling",
            "expected_outputs": "Empirical check dam efficacy indices, automated recharge heat maps, prioritized watershed intervention advisories (MoRD 26015)."
        },
        {
            "domain": "Urbanization & Infrastructure Land Acquisition",
            "research_questions": "Which administrative, legal, and financial factors best predict timeline delays and compensation escalation in statutory land acquisition under RFCTLARR Act 2013?",
            "required_datasets": "NHAI / DFCCIL Project Lifecycle Registry, District Collector Section 11/19 Gazette Notifications, State Treasury disbursement logs",
            "analytical_methods": "Survival Analysis, Gradient Boosted Decision Trees (XGBoost), Shapley Additive Explanations (SHAP) for bottleneck attribution",
            "expected_outputs": "Project delay probability risk score (0-100), automated early warning triggers, statutory milestone compliance dashboard (MoRD 25017 & 26016)."
        },
        {
            "domain": "Land Disputes & Title Security",
            "research_questions": "To what extent does computerization and spatial georeferencing of Records of Rights (RoR) de-escalate boundary litigation across Revenue Courts and High Courts?",
            "required_datasets": "National Judicial Data Grid (NJDG) revenue court dockets, DILRMP village-level modernization index, State Land Revenue mutation logs",
            "analytical_methods": "Difference-in-Differences (DiD) econometric estimation, Natural Language Processing for judgment classification, Cluster analysis",
            "expected_outputs": "Dispute density benchmarks per 1,000 parcels, legislative roadmap for transitioning from presumptive to conclusive guaranteed titling."
        },
        {
            "domain": "Geospatial Governance & AI Digitization",
            "research_questions": "How can Indic multilingual OCR and Vision Transformers be deployed to accurately extract landowner, khasra, and boundary geometries from damaged historical cadastral registers?",
            "required_datasets": "Historical scanned cadastral cloth maps (Bhu-naksha), 1950s Jamabandi registers, Indic language character corpora",
            "analytical_methods": "Convolutional Neural Networks (CNNs), Vision Transformers (ViT), Morphological edge detection, Vector polygonization algorithms",
            "expected_outputs": "Automated khasra polygon generation with >92% spatial fidelity, multilingual field extraction engine (MoRD 26018)."
        },
        {
            "domain": "Evidence-Based Policy Evaluation",
            "research_questions": "How do state-level tenancy reforms and digital lease registries influence smallholder credit access and capital investment in land improvement?",
            "required_datasets": "NABARD Rural Financial Inclusion Survey, State agricultural lease registrations, Reserve Bank of India priority sector lending data",
            "analytical_methods": "Propensity Score Matching (PSM), Fixed-effects panel regression, Policy Simulation Lab sensitivity tests",
            "expected_outputs": "Comparative state policy scorecards, model tenancy agreement templates, real-time fiscal and food security trade-off simulators."
        }
    ]

@router.get("/tech-stack")
def get_suggested_tech_stack():
    return [
        {
            "component": "Frontend Web Application",
            "technology": "React 19, TypeScript, Vite, Tailwind CSS",
            "purpose": "High-performance, responsive single-page application with modern component architecture and government design system tokens.",
            "implementation_status": "Implemented & Active",
            "future_integration": "Progressive Web App (PWA) offline mobile surveyor mode"
        },
        {
            "component": "Interactive GIS & Geospatial Maps",
            "technology": "Leaflet, React-Leaflet, OpenStreetMap, GeoJSON",
            "purpose": "Interactive spatial visualization of Indian state boundaries, watershed intervention coordinates, and infrastructure corridors.",
            "implementation_status": "Implemented & Active",
            "future_integration": "OGC WMS/WFS tile caching via GeoServer & Bhuvan API integration"
        },
        {
            "component": "Backend Web API Framework",
            "technology": "Python 3.14, FastAPI, Uvicorn, Pydantic v2",
            "purpose": "Asynchronous RESTful microservice layer with automated OpenAPI/Swagger documentation, schema validation, and high throughput.",
            "implementation_status": "Implemented & Active",
            "future_integration": "GraphQL federation endpoint for multi-state revenue registries"
        },
        {
            "component": "Relational & Geospatial Database",
            "technology": "PostgreSQL with PostGIS / SQLite with spatial metadata",
            "purpose": "ACID-compliant storage for users, research repositories, datasets, projects, scenarios, and spatial coordinates.",
            "implementation_status": "Implemented & Active",
            "future_integration": "PostGIS spatial index clustering (ST_Contains, ST_Intersects, ST_Buffer)"
        },
        {
            "component": "Authentication & RBAC",
            "technology": "JWT (JSON Web Tokens), Bcrypt, OAuth2 bearer",
            "purpose": "Secures all platform endpoints with backend-enforced permissions across 5 distinct roles.",
            "implementation_status": "Implemented & Active",
            "future_integration": "MeriPehchaan (National Single Sign-On / Jan Parichay) integration"
        },
        {
            "component": "AI Research Assistant & RAG",
            "technology": "Modular LLM integration (Gemini/OpenAI) + Grounded NLP Fallback",
            "purpose": "Retrieval-Augmented Generation for document summarization, literature review outline drafting, research gap discovery, and dataset recommendation.",
            "implementation_status": "Implemented & Active",
            "future_integration": "IndicTrans2 / Bhashini multilingual conversational voice interface"
        },
        {
            "component": "Data Analytics & Charting",
            "technology": "Recharts (React), Python analytical routines",
            "purpose": "Interactive time-series charts, dispute category bar graphs, delay factor distributions, and scenario comparative plots.",
            "implementation_status": "Implemented & Active",
            "future_integration": "Apache Superset embedded BI dashboards for executive monitoring"
        },
        {
            "component": "Policy Simulation Engine",
            "technology": "Deterministic Rule-Based Econometric & Ecological Model",
            "purpose": "Computes transparent trade-offs between agricultural land protection, urban expansion, dispute risk, and carbon sinks with explicit formulas.",
            "implementation_status": "Implemented & Active",
            "future_integration": "Agent-based land-market equilibrium simulations (Mesa/NetLogo)"
        },
        {
            "component": "Document Processing & OCR Pipeline",
            "technology": "PyPDF, text extraction, Indic text normalization",
            "purpose": "Extracts text, metadata, and tables from official MoRD policy and cadastral PDF documents.",
            "implementation_status": "Implemented & Active",
            "future_integration": "Tesseract Indic OCR + LayoutLM for handwritten cadastral registers (MoRD 26018)"
        },
        {
            "component": "External Government API Adapters",
            "technology": "RESTful Mock Adapters for ISRO Bhuvan, DILRMP, NJDG, PM Gati Shakti",
            "purpose": "Standardized interoperability layer enabling integration with national geospatial and land record portals.",
            "implementation_status": "Implemented & Active",
            "future_integration": "Live API gateway connected with National Data Sharing & Accessibility Portal"
        }
    ]
