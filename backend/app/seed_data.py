import os
import json
from datetime import datetime
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.entities import (
    User,
    ResearchResource,
    DatasetItem,
    ResearchProject,
    ProjectObjective,
    ProjectTask,
    ProjectMilestone,
    ProjectComment,
    PolicyScenario,
    GrantOpportunity,
    GrantApplication,
    ExternalIntegration,
    AuditLog
)
from app.auth import get_password_hash
from app.services.sih_data_service import SIHDataService
from app.config import settings

def seed_database():
    print("Creating all database tables...")
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    
    # 1. Seed Users
    if db.query(User).count() == 0:
        print("Seeding test users for all 5 roles...")
        users_data = [
            {
                "email": "admin@dolr.gov.in",
                "full_name": "Dr. Rajeshwar Sharma",
                "role": "platform_admin",
                "organization": "Department of Land Resources (DoLR), MoRD",
                "department": "National Land Records Modernization Division"
            },
            {
                "email": "policymaker@mord.gov.in",
                "full_name": "Smt. Sunita Verma, IAS",
                "role": "policymaker",
                "organization": "Ministry of Rural Development, GoI",
                "department": "Policy, Monitoring & Evaluation (PME) Division"
            },
            {
                "email": "institution@nirdpr.ac.in",
                "full_name": "Prof. Anand K. Murthy",
                "role": "institution_admin",
                "organization": "National Institute of Rural Development & PR",
                "department": "Centre for Natural Resource Management"
            },
            {
                "email": "researcher@iitd.ac.in",
                "full_name": "Dr. Priyanka Sengupta",
                "role": "researcher",
                "organization": "Indian Institute of Technology Delhi",
                "department": "School of Public Policy & Geospatial Sciences"
            },
            {
                "email": "citizen@public.org",
                "full_name": "Vikramaditya Deshmukh",
                "role": "public_user",
                "organization": "Land Rights & Farmers Collective",
                "department": "Civil Society Outreach"
            }
        ]
        
        default_pw = get_password_hash("Admin@1234")
        for u in users_data:
            user = User(
                email=u["email"],
                hashed_password=default_pw,
                full_name=u["full_name"],
                role=u["role"],
                organization=u["organization"],
                department=u["department"],
                is_active=True
            )
            db.add(user)
        db.commit()
        print("Users seeded successfully.")

    # 2. Ingest SIH Official Documents & Additional Land Governance Literature
    if db.query(ResearchResource).count() == 0:
        print("Ingesting official SIH MoRD policy documents from raw dataset...")
        sih_service = SIHDataService(settings.SIH_RAW_DATASET_DIR)
        raw_files = sih_service.inspect_raw_files()
        raw_map = {item["file_code"]: item for item in raw_files}
        
        official_docs = sih_service.get_document_catalog()
        for doc in official_docs:
            code = doc["doc_code"]
            raw_info = raw_map.get(code, {})
            
            res = ResearchResource(
                title=doc["title"],
                abstract=doc["abstract"],
                resource_type=doc["resource_type"],
                domain=doc["domain"],
                authors=doc["organization"],
                publication_year=2026,
                organization=doc["organization"],
                file_name=f"{code}.pdf",
                file_size_kb=raw_info.get("file_size_kb", 250),
                citation=doc["citation"],
                is_sih_official=True,
                sih_doc_id=code,
                extracted_text=raw_info.get("extracted_text", "")[:4000],
                keywords=doc["keywords"],
                download_count=184,
                view_count=892,
                is_featured=True
            )
            db.add(res)
            
        # Additional benchmark publications
        additional_resources = [
            {
                "title": "Digital India Land Records Modernization Programme (DILRMP): 2024 Impact Assessment Report",
                "abstract": "Comprehensive national evaluation of the computerization of Records of Rights (RoR), digitization of cadastral maps, and setting up of Modern Land Record Rooms across 740+ districts in India.",
                "resource_type": "government_report",
                "domain": "land_records",
                "authors": "PME Division, Department of Land Resources",
                "publication_year": 2024,
                "organization": "Department of Land Resources, MoRD",
                "file_name": "dilrmp_national_report_2024.pdf",
                "file_size_kb": 3450,
                "citation": "Department of Land Resources (2024). DILRMP National Impact & State-Wise Progress Assessment. New Delhi.",
                "keywords": "DILRMP, RoR, Cadastral Maps, Modern Record Rooms, Bhoomi, Revenue Administration",
                "is_featured": True
            },
            {
                "title": "Land Acquisition, Rehabilitation and Resettlement Act 2013: A Decade of Judicial and Implementation Analysis",
                "abstract": "Empirical examination of over 1,200 land acquisition proceedings for highways, dedicated freight corridors, and power transmission, analyzing bottlenecks under Section 11 and Section 19 notifications.",
                "resource_type": "research_paper",
                "domain": "land_acquisition",
                "authors": "Prof. S. R. Ramanathan, Dr. Ananya Sen",
                "publication_year": 2025,
                "organization": "Centre for Policy Research & National Law School of India",
                "file_name": "rfctlarr_decade_review_2025.pdf",
                "file_size_kb": 1820,
                "citation": "Ramanathan, S.R., & Sen, A. (2025). The RFCTLARR Act 2013: Judicial Precedents, Bottlenecks and Reform Pathways. Journal of Indian Land Economics, 14(2), 112-148.",
                "keywords": "RFCTLARR 2013, Land Acquisition Delays, Compensation Disputes, SIA Studies, Infrastructure Planning",
                "is_featured": True
            },
            {
                "title": "Satellite-Derived Soil Moisture and NDVI Dynamics Under National Watershed Development Projects",
                "abstract": "Evaluation of micro-watershed interventions using multi-temporal 30-meter multispectral data from the SRISHTI-DRISHTI platform. Analyzes groundwater recharge and vegetation index improvement across semi-arid regions.",
                "resource_type": "research_paper",
                "domain": "watershed_management",
                "authors": "Dr. K. Venkatesh, Dr. M. G. Rao",
                "publication_year": 2025,
                "organization": "National Remote Sensing Centre (NRSC), ISRO",
                "file_name": "nrsc_watershed_satellite_evaluation.pdf",
                "file_size_kb": 2980,
                "citation": "Venkatesh, K., & Rao, M.G. (2025). Spatial Monitoring of Watershed Health Using 30m Satellite Remote Sensing. Indian Journal of Remote Sensing, 53(1), 45-63.",
                "keywords": "SRISHTI-DRISHTI, NRSC Bhuvan, NDVI, Soil Moisture, Watershed Management, Check Dams",
                "is_featured": False
            },
            {
                "title": "Resolution of Agricultural Land Title Disputes in Revenue Courts: Policy Roadmap for Conclusive Land Titling",
                "abstract": "Analysis of pending land dispute dockets across State Revenue Courts and High Courts. Proposes institutional transition mechanisms from presumptive titling to guaranteed conclusive titling in India.",
                "resource_type": "policy_document",
                "domain": "dispute_resolution",
                "authors": "Law Commission & NITI Aayog Joint Taskforce",
                "publication_year": 2024,
                "organization": "NITI Aayog, Government of India",
                "file_name": "niti_conclusive_land_titling.pdf",
                "file_size_kb": 1540,
                "citation": "NITI Aayog (2024). Model Land Titling Act & Conclusive Titling Transition Framework. Policy Brief No. 41.",
                "keywords": "Conclusive Titling, Land Disputes, Revenue Courts, Torrens Title System, Title Insurance",
                "is_featured": False
            },
            {
                "title": "Peri-Urban Agricultural Land Conversion and Food Security: Multi-Scenario Spatial Modeling",
                "abstract": "Investigates the conversion of prime agricultural tracts into industrial and residential layouts along metropolitan transport corridors. Provides econometric trade-off models for master plan zoning.",
                "resource_type": "research_paper",
                "domain": "urban_expansion",
                "authors": "Dr. P. Sengupta, Dr. R. K. Nair",
                "publication_year": 2025,
                "organization": "IIT Delhi & School of Planning and Architecture",
                "file_name": "periurban_conversion_modeling.pdf",
                "file_size_kb": 2240,
                "citation": "Sengupta, P., & Nair, R.K. (2025). Peri-Urban Land Dynamics and Food Security Vulnerability in India. Land Use Policy Review, 89, 104-122.",
                "keywords": "Urban Expansion, Prime Agricultural Land, Food Security, Spatial Zoning, Master Planning",
                "is_featured": False
            }
        ]
        
        for item in additional_resources:
            res = ResearchResource(
                title=item["title"],
                abstract=item["abstract"],
                resource_type=item["resource_type"],
                domain=item["domain"],
                authors=item["authors"],
                publication_year=item["publication_year"],
                organization=item["organization"],
                file_name=item["file_name"],
                file_size_kb=item["file_size_kb"],
                citation=item["citation"],
                keywords=item["keywords"],
                is_sih_official=False,
                download_count=120,
                view_count=510,
                is_featured=item["is_featured"]
            )
            db.add(res)
        db.commit()
        print("Research resources seeded successfully.")

    # 3. Seed Datasets
    if db.query(DatasetItem).count() == 0:
        print("Seeding verified Land Governance datasets...")
        datasets_list = [
            {
                "name": "Official MoRD SIH Problem Specification & Technical Archive",
                "description": "The official 5 problem statements and technical architecture specifications released by the Department of Land Resources (DoLR), MoRD: 26019, 26018, 26016, 25017, and 26015.",
                "category": "Policy Directives & Specifications",
                "source_agency": "Ministry of Rural Development / DoLR",
                "file_format": "PDF / Structured Text",
                "record_count": 5,
                "geographic_coverage": "National (Pan-India)",
                "temporal_coverage": "2026",
                "fields_schema": json.dumps(["doc_code", "title", "organization", "subtheme", "background", "problem_statement", "expected_solution", "technical_components"]),
                "validation_status": "VERIFIED",
                "integration_status": "FULLY_INTEGRATED",
                "is_sih_official": True,
                "sih_file_code": "SIH-2026-MoRD-PKG"
            },
            {
                "name": "DILRMP National Land Records Modernization Master Dataset",
                "description": "State-wise and district-wise status of Computerization of Records of Rights (RoR), Cadastral Map Digitization, Modern Record Rooms, and Sub-Registrar Office integration across all 36 States and UTs.",
                "category": "Cadastral Surveys & Land Records",
                "source_agency": "Department of Land Resources (DoLR)",
                "file_format": "CSV / GeoJSON",
                "record_count": 765,
                "geographic_coverage": "All 36 States and Union Territories",
                "temporal_coverage": "2018 - 2026",
                "fields_schema": json.dumps(["state_code", "state_name", "district_name", "ror_computerized_pct", "cadastral_digitized_pct", "sub_registrar_integrated", "modern_record_rooms_active", "last_updated"]),
                "validation_status": "VERIFIED",
                "integration_status": "FULLY_INTEGRATED",
                "is_sih_official": False
            },
            {
                "name": "SRISHTI-DRISHTI Bhuvan 30m Satellite Watershed Archive",
                "description": "Geospatial database of watershed interventions, check dams, and micro-catchment water bodies monitored via 30m multispectral satellite imagery on the Bhuvan platform.",
                "category": "Satellite & Remote Sensing",
                "source_agency": "National Remote Sensing Centre (NRSC) / ISRO & DoLR",
                "file_format": "GeoJSON / Shapefile",
                "record_count": 18450,
                "geographic_coverage": "18 Rainfed Agro-ecological States",
                "temporal_coverage": "2020 - 2026",
                "fields_schema": json.dumps(["watershed_id", "state", "district", "latitude", "longitude", "intervention_type", "catchment_ha", "ndvi_delta", "soil_moisture_gain_pct", "satellite_resolution_m"]),
                "validation_status": "VERIFIED",
                "integration_status": "FULLY_INTEGRATED",
                "is_sih_official": False
            },
            {
                "name": "National Land Acquisition Projects & Delay Risk Database",
                "description": "Tracks major infrastructure land acquisition proceedings under the RFCTLARR Act 2013 across National Highways, Railways, Industrial Corridors, and Green Energy parks with delay risk scores.",
                "category": "Land Acquisition & Infrastructure",
                "source_agency": "NHAI, MoRTH, DFCCIL & DoLR Scrutiny Cell",
                "file_format": "CSV / REST API",
                "record_count": 1240,
                "geographic_coverage": "Pan-India",
                "temporal_coverage": "2021 - 2026",
                "fields_schema": json.dumps(["project_id", "project_name", "implementing_agency", "state", "required_hectares", "acquired_pct", "delay_risk_score", "bottleneck_type", "litigation_flag", "rr_award_status"]),
                "validation_status": "VERIFIED",
                "integration_status": "FULLY_INTEGRATED",
                "is_sih_official": False
            },
            {
                "name": "All-India Revenue Court Land Dispute Density Register",
                "description": "Benchmarked statistics on pending land disputes across Tehsildar, Sub-Divisional Magistrate, Collector, and High Court dockets categorised by title contest, partition, and compensation appeals.",
                "category": "Dispute Records & Judicial",
                "source_agency": "National Judicial Data Grid (NJDG) & State Land Revenue Departments",
                "file_format": "CSV",
                "record_count": 5280,
                "geographic_coverage": "District Granularity (Pan-India)",
                "temporal_coverage": "2019 - 2026",
                "fields_schema": json.dumps(["district_code", "district_name", "state", "pending_disputes_count", "avg_disposal_months", "partition_suits_pct", "title_inheritance_pct", "dispute_density_per_1000_parcels"]),
                "validation_status": "VALIDATED",
                "integration_status": "API_LINKED",
                "is_sih_official": False
            }
        ]
        
        for d in datasets_list:
            ds = DatasetItem(
                name=d["name"],
                description=d["description"],
                category=d["category"],
                source_agency=d["source_agency"],
                file_format=d["file_format"],
                record_count=d["record_count"],
                geographic_coverage=d["geographic_coverage"],
                temporal_coverage=d["temporal_coverage"],
                fields_schema=d["fields_schema"],
                validation_status=d["validation_status"],
                integration_status=d["integration_status"],
                is_sih_official=d["is_sih_official"],
                sih_file_code=d.get("sih_file_code")
            )
            db.add(ds)
        db.commit()
        print("Datasets seeded successfully.")

    # 4. Seed Collaborative Research Projects
    if db.query(ResearchProject).count() == 0:
        print("Seeding collaborative research projects...")
        lead_user = db.query(User).filter(User.role == "researcher").first()
        uid = lead_user.id if lead_user else 1

        projects_data = [
            {
                "title": "AI-Powered Khasra Extraction & Cadastral Vectorization from Historical Revenue Maps",
                "summary": "Developing open-source Indic OCR and vision-transformer pipelines to convert degraded 1950s cadastral cloth maps and handwritten revenue registers into georeferenced spatial shapefiles (Aligned with MoRD Problem 26018).",
                "domain": "land_records",
                "institution": "IIT Delhi & National Informatics Centre",
                "budget_inr": 2800000.0,
                "target_state": "Uttar Pradesh & Bihar",
                "objectives": [
                    "Benchmark Indic OCR models across Devanagari and Kaithi scripts",
                    "Develop automated boundary polygonization from scanned cadastral maps",
                    "Conduct pilot field validation in 10 villages of Varanasi and Gaya"
                ],
                "tasks": [
                    {"title": "Collect 200 high-resolution historical revenue maps", "assigned_to": "Field Surveyor", "status": "completed", "priority": "high", "due_date": "2026-05-15"},
                    {"title": "Train Vision Transformer for boundary edge detection", "assigned_to": "AI Research Associate", "status": "in_progress", "priority": "high", "due_date": "2026-07-30"},
                    {"title": "Build web-based annotation and review tool for Patwaris", "assigned_to": "Full Stack Dev", "status": "todo", "priority": "medium", "due_date": "2026-09-15"}
                ],
                "milestones": [
                    {"title": "Dataset Ingestion & Pre-processing Completed", "due_date": "2026-05-30", "is_achieved": True},
                    {"title": "Model Prototype Accuracy > 90% Achieved", "due_date": "2026-08-30", "is_achieved": False},
                    {"title": "Field Pilot & Policy Brief Submission", "due_date": "2026-11-15", "is_achieved": False}
                ],
                "comments": [
                    {"user_name": "Dr. Priyanka Sengupta", "content": "Initial OCR baseline shows 86% character accuracy on Devanagari numerals. Fine-tuning on revenue vocabulary ongoing."}
                ]
            },
            {
                "title": "Predictive Modeling of Infrastructure Land Acquisition Delays & Compensation Bottlenecks",
                "summary": "Building machine learning risk scoring models for national highway and freight corridor land acquisitions to forecast delays at the Section 11/19 stages (Aligned with MoRD Problem 25017 & 26016).",
                "domain": "land_acquisition",
                "institution": "National Law School of India University & DoLR",
                "budget_inr": 3500000.0,
                "target_state": "Maharashtra, Gujarat & Karnataka",
                "objectives": [
                    "Synthesize historical acquisition timeline records across 80 highway projects",
                    "Identify key statistical drivers of High Court stay orders and compensation litigation",
                    "Deploy an early-alert dashboard for District Collectors and Project Directors"
                ],
                "tasks": [
                    {"title": "Normalize RFCTLARR timeline data from 2018-2024", "assigned_to": "Data Analyst", "status": "completed", "priority": "high", "due_date": "2026-06-01"},
                    {"title": "Develop Gradient Boosted delay probability classifier", "assigned_to": "ML Engineer", "status": "in_progress", "priority": "high", "due_date": "2026-08-15"}
                ],
                "milestones": [
                    {"title": "Historical Case Registry Compiled (1,200 cases)", "due_date": "2026-06-15", "is_achieved": True},
                    {"title": "Algorithm Validation with NHAI Project Officers", "due_date": "2026-09-30", "is_achieved": False}
                ],
                "comments": [
                    {"user_name": "Smt. Sunita Verma, IAS", "content": "The delay prediction model should specifically incorporate inheritance partition suits as a distinct delay factor."}
                ]
            }
        ]

        for p in projects_data:
            proj = ResearchProject(
                title=p["title"],
                summary=p["summary"],
                domain=p["domain"],
                lead_researcher_id=uid,
                institution=p["institution"],
                budget_inr=p["budget_inr"],
                target_state=p["target_state"],
                status="active"
            )
            db.add(proj)
            db.flush()
            
            for idx, obj_title in enumerate(p["objectives"]):
                db.add(ProjectObjective(project_id=proj.id, title=obj_title, order_index=idx))
            
            for t in p["tasks"]:
                db.add(ProjectTask(
                    project_id=proj.id,
                    title=t["title"],
                    assigned_to=t["assigned_to"],
                    status=t["status"],
                    priority=t["priority"],
                    due_date=t["due_date"]
                ))
                
            for m in p["milestones"]:
                db.add(ProjectMilestone(
                    project_id=proj.id,
                    title=m["title"],
                    due_date=m["due_date"],
                    is_achieved=m["is_achieved"]
                ))
                
            for c in p["comments"]:
                db.add(ProjectComment(
                    project_id=proj.id,
                    user_id=uid,
                    content=c["content"]
                ))
        db.commit()
        print("Research projects seeded successfully.")

    # 5. Seed Grants & Innovation Opportunities
    if db.query(GrantOpportunity).count() == 0:
        print("Seeding Innovation Grants & Hackathon Opportunities...")
        grants = [
            {
                "title": "National Land Governance Policy Innovation Fellowship 2026",
                "organizer": "Department of Land Resources (DoLR), MoRD",
                "opportunity_type": "Research Grant",
                "funding_amount": "₹35,00,000 per project",
                "deadline": "2026-11-30",
                "eligibility": "Accredited Universities, IITs, IIMs, Central Research Institutes, and registered public policy think tanks.",
                "description": "Supporting empirical field studies on land titling, peri-urban spatial planning, and natural resource tenure security. Up to 10 projects will be funded across 5 thematic areas.",
                "focus_areas": "Conclusive Titling, AI Cadastral Digitization, Watershed Remote Sensing, Women Land Ownership"
            },
            {
                "title": "Smart India Hackathon 2026: MoRD Intelligent Land Digitization Challenge",
                "organizer": "Ministry of Rural Development & AICTE",
                "opportunity_type": "Hackathon",
                "funding_amount": "₹1,00,000 cash prize + Incubation support",
                "deadline": "2026-10-31",
                "eligibility": "Undergraduate and postgraduate engineering, design, and policy student teams across India.",
                "description": "Design an open-source, AI-powered system for automated extraction and validation of historical land records and geo-coded satellite imagery.",
                "focus_areas": "Multilingual OCR, Computer Vision, GIS Web Applications, Transparent Policy Simulation"
            },
            {
                "title": "Geospatial Watershed Innovation Pilot Fund (SRISHTI-DRISHTI)",
                "organizer": "DoLR & National Remote Sensing Centre (ISRO)",
                "opportunity_type": "Pilot Project",
                "funding_amount": "₹50,00,000",
                "deadline": "2026-12-15",
                "eligibility": "Agri-tech startups, geospatial enterprises, and academic consortiums working with State Watershed Departments.",
                "description": "Deploying 30m satellite data interpretation pipelines for automated check dam condition assessment and soil moisture tracking across drought-vulnerable districts.",
                "focus_areas": "Bhuvan Integration, 30m Satellite Analytics, Automated Check Dam Health Score"
            }
        ]
        for g in grants:
            db.add(GrantOpportunity(
                title=g["title"],
                organizer=g["organizer"],
                opportunity_type=g["opportunity_type"],
                funding_amount=g["funding_amount"],
                deadline=g["deadline"],
                eligibility=g["eligibility"],
                description=g["description"],
                focus_areas=g["focus_areas"],
                status="open",
                applicants_count=18
            ))
        db.commit()
        print("Grants seeded successfully.")

    # 6. Seed External Integrations
    if db.query(ExternalIntegration).count() == 0:
        print("Seeding External System Integrations...")
        integrations = [
            {
                "system_name": "ISRO Bhuvan GIS & SRISHTI-DRISHTI Platform",
                "category": "Geospatial / Remote Sensing",
                "description": "Integrates 30-meter multispectral satellite imagery and Bhuvan national geospatial base maps for watershed and land-use monitoring.",
                "endpoint_url": "https://bhuvan.nrsc.gov.in/api/v2/wms/srishti_drishti",
                "status": "Active",
                "is_simulated": True,
                "auth_mode": "ISRO NRSC API Token",
                "last_sync": "Synchronized (15m ago)",
                "records_synced": 184500
            },
            {
                "system_name": "DILRMP Central Land Records Integration Hub",
                "category": "Land Cadastre & RoR",
                "description": "Aggregates real-time computerized Records of Rights (RoRs) and cadastral parcel boundaries across 36 State revenue databases.",
                "endpoint_url": "https://dilrmp.gov.in/api/v1/national_ror_sync",
                "status": "Active",
                "is_simulated": True,
                "auth_mode": "National Data Sharing & Accessibility Portal (NDSAP) Token",
                "last_sync": "Synchronized (3m ago)",
                "records_synced": 2490000
            },
            {
                "system_name": "National Judicial Data Grid (NJDG) Land Litigation Tracker",
                "category": "Judicial / Dispute Resolution",
                "description": "Fetches ongoing land ownership dispute case proceedings, pending stay orders, and revenue appeals across District & High Courts.",
                "endpoint_url": "https://njdg.ecourts.gov.in/api/v2/revenue_cases",
                "status": "Active",
                "is_simulated": True,
                "auth_mode": "e-Courts National Gateway OAuth 2.0",
                "last_sync": "Synchronized (1h ago)",
                "records_synced": 512400
            },
            {
                "system_name": "PM Gati Shakti National Master Plan (NMP) Portal",
                "category": "Infrastructure Planning",
                "description": "Cross-verifies proposed highway and railway land parcels with environmental clearances, wildlife sanctuaries, and revenue cadastre.",
                "endpoint_url": "https://gatishakti.bisp.gov.in/api/v1/spatial_overlay",
                "status": "Active",
                "is_simulated": True,
                "auth_mode": "BISAG-N Enterprise Key",
                "last_sync": "Synchronized (25m ago)",
                "records_synced": 89200
            }
        ]
        for it in integrations:
            db.add(ExternalIntegration(
                system_name=it["system_name"],
                category=it["category"],
                description=it["description"],
                endpoint_url=it["endpoint_url"],
                status=it["status"],
                is_simulated=it["is_simulated"],
                auth_mode=it["auth_mode"],
                last_sync=it["last_sync"],
                records_synced=it["records_synced"]
            ))
        db.commit()
        print("External integrations seeded successfully.")

    db.close()
    print("Database seeding completed.")

if __name__ == "__main__":
    seed_database()
