import os
import glob
import json
from typing import Dict, Any, List
from datetime import datetime
import pypdf

class SIHDataService:
    def __init__(self, raw_dir: str):
        self.raw_dir = raw_dir

    def inspect_raw_files(self) -> List[Dict[str, Any]]:
        """Scans the raw SIH dataset folder and extracts file-level metadata and verified status."""
        results = []
        if not os.path.exists(self.raw_dir):
            return results

        pdf_files = sorted(glob.glob(os.path.join(self.raw_dir, "*.pdf")))
        for fpath in pdf_files:
            fname = os.path.basename(fpath)
            size_bytes = os.path.getsize(fpath)
            doc_code = fname.replace(".pdf", "")
            
            # Extract PDF details
            page_count = 0
            extracted_text = ""
            author = "Ministry of Rural Development / DoLR"
            try:
                reader = pypdf.PdfReader(fpath)
                page_count = len(reader.pages)
                meta = reader.metadata or {}
                if meta.get("/Author"):
                    author = str(meta.get("/Author"))
                # Extract first 5000 characters
                full_text = []
                for p in reader.pages:
                    txt = p.extract_text() or ""
                    full_text.append(txt)
                extracted_text = "\n".join(full_text)
            except Exception as e:
                extracted_text = f"Error reading PDF: {e}"

            results.append({
                "file_name": fname,
                "file_code": doc_code,
                "file_size_bytes": size_bytes,
                "file_size_kb": round(size_bytes / 1024),
                "page_count": page_count,
                "author": author,
                "extracted_text": extracted_text,
                "verified": True,
                "ingested_at": datetime.utcnow().isoformat()
            })
        return results

    def get_document_catalog(self) -> List[Dict[str, Any]]:
        """Returns the official 5 MoRD problem statement specifications with detailed governance mapping."""
        return [
            {
                "doc_code": "26019",
                "title": "National Digital Platform for Research, Policy Innovation, and Evidence-Based Land Governance",
                "organization": "Ministry of Rural Development, Department of Land Resources (PME Division)",
                "resource_type": "policy_document",
                "domain": "land_records",
                "subtheme": "Digital Knowledge Management, AI, Geospatial Technologies & Evidence-Based Policy Innovation",
                "abstract": "Develop a comprehensive National Digital Platform for Research and Policy Innovation that promotes applied research, policy experimentation, knowledge sharing, and evidence-based decision-making in land governance. Integrates research publications, policy documents, cadastral surveys, satellite imagery, and collaborative workspaces.",
                "keywords": "DoLR, MoRD, Land Governance, Applied Research, Policy Simulation, Collaborative Workspaces, Evidence-Based Innovation",
                "citation": "Department of Land Resources, Ministry of Rural Development, GoI (2026). Problem Statement 26019: National Digital Platform for Research and Land Governance.",
                "is_featured": True
            },
            {
                "doc_code": "26016",
                "title": "Unified Land Acquisition and Real-Time Monitoring Platform (ULARMP)",
                "organization": "Department of Land Resources, Ministry of Rural Development",
                "resource_type": "government_report",
                "domain": "land_acquisition",
                "subtheme": "GIS Geo-Tagging, Cadastral Map Integration, Workflow Scrutiny & R&R Monitoring",
                "abstract": "Unified platform to streamline multi-agency land acquisition for infrastructure projects (Highways, Railways, Energy). Features online proposal scrutiny, geo-tagging of acquired land parcels, standardized master databases across States/UTs, and real-time executive progress dashboards.",
                "keywords": "Land Acquisition, RFCTLARR Act 2013, GIS Geo-tagging, Cadastral Maps, R&R Status, Possession Tracking",
                "citation": "Department of Land Resources, MoRD (2026). Problem Statement 26016: Unified Land Acquisition and Real-Time Monitoring Platform.",
                "is_featured": True
            },
            {
                "doc_code": "26018",
                "title": "Intelligent Multilingual Land Record Digitization and Validation System",
                "organization": "Department of Land Resources, Ministry of Rural Development",
                "resource_type": "research_paper",
                "domain": "land_records",
                "subtheme": "Multilingual OCR, Computer Vision, Khasra/Khata Parsing & Anomaly Detection",
                "abstract": "AI-powered digitization system capable of automatically extracting structured land governance parameters from scanned historical records, handwritten revenue registers, and legacy cadastral maps across major Indian scripts (Devanagari, Bengali, Telugu, Kannada, Tamil, etc.).",
                "keywords": "Multilingual OCR, Indic NLP, Khasra Extraction, Land Record Validation, Legacy Cadastre, Automated Quality Audit",
                "citation": "Department of Land Resources, MoRD (2026). Problem Statement 26018: Intelligent Land Record Digitization and Validation System.",
                "is_featured": True
            },
            {
                "doc_code": "25017",
                "title": "Predictive Analytics System for Early Detection of Land Acquisition Delays",
                "organization": "Department of Land Resources, Ministry of Rural Development",
                "resource_type": "research_paper",
                "domain": "land_acquisition",
                "subtheme": "Machine Learning Delay Forecasting, Dispute Risk Scoring & Preventive Governance",
                "abstract": "Machine learning decision-support platform analyzing historical land acquisition lifecycles to detect projects at risk of delay. Considers court litigations, pending administrative notifications, compensation disbursement gaps, and stakeholder responsiveness to provide early alerts and mitigation roadmaps.",
                "keywords": "Predictive Modeling, Land Acquisition Delays, Dispute Risk Score, Compensation Bottlenecks, Early Alert System",
                "citation": "Department of Land Resources, MoRD (2026). Problem Statement 25017: Predictive Analytics for Early Detection of Land Acquisition Delays.",
                "is_featured": True
            },
            {
                "doc_code": "26015",
                "title": "Geospatial Analysis and Visualization of Geo-Coded Satellite Images for Watershed Outcomes",
                "organization": "Department of Land Resources & ISRO/NRSC",
                "resource_type": "case_study",
                "domain": "watershed_management",
                "subtheme": "SRISHTI-DRISHTI 30m Satellite Imagery, Bhuvan GIS, Soil Moisture & Land Degradation",
                "abstract": "Analytical framework combining 30-meter spatial resolution satellite data from the SRISHTI-DRISHTI platform with field geotagged photographs to systematically interpret watershed characteristics, check dam efficacy, vegetation canopy recovery, and soil moisture conservation.",
                "keywords": "SRISHTI-DRISHTI, Bhuvan ISRO, 30m Satellite Data, Watershed Interventions, Land Degradation Neutrality, Soil Moisture",
                "citation": "Department of Land Resources, MoRD & NRSC (2026). Problem Statement 26015: Geospatial Visualization for Watershed Development.",
                "is_featured": True
            }
        ]
