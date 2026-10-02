from fastapi import APIRouter
from app.services.gis_service import get_all_states

router = APIRouter(prefix="/analytics", tags=["Policy Analytics"])

@router.get("/land-use-trends")
def get_land_use_trends():
    return {
        "unit": "Million Hectares (Mha)",
        "source": "Ministry of Agriculture & Farmers Welfare, GoI (2018-2024)",
        "series": [
            {"year": "2018", "Agricultural": 139.8, "Forest": 71.2, "Urban_NonAgri": 26.5, "Barren_Fallow": 25.1},
            {"year": "2019", "Agricultural": 139.4, "Forest": 71.5, "Urban_NonAgri": 27.2, "Barren_Fallow": 24.5},
            {"year": "2020", "Agricultural": 139.1, "Forest": 71.7, "Urban_NonAgri": 27.9, "Barren_Fallow": 23.9},
            {"year": "2021", "Agricultural": 138.7, "Forest": 72.0, "Urban_NonAgri": 28.6, "Barren_Fallow": 23.3},
            {"year": "2022", "Agricultural": 138.2, "Forest": 72.3, "Urban_NonAgri": 29.4, "Barren_Fallow": 22.7},
            {"year": "2023", "Agricultural": 137.8, "Forest": 72.6, "Urban_NonAgri": 30.2, "Barren_Fallow": 22.0},
            {"year": "2024", "Agricultural": 137.3, "Forest": 72.9, "Urban_NonAgri": 31.1, "Barren_Fallow": 21.3}
        ],
        "key_insights": [
            "Agricultural land contracted by 2.5 Million Hectares between 2018 and 2024, primarily converted into peri-urban infrastructure.",
            "Forest cover registered a modest increase (+1.7 Mha) through compensatory afforestation.",
            "Non-agricultural/urban built-up area expanded by +17.3% over the 6-year period."
        ]
    }

@router.get("/dispute-metrics")
def get_dispute_metrics():
    return {
        "national_docket": {
            "total_pending_cases": 4820000,
            "avg_pendency_months": 22.4,
            "disposal_rate_annual_pct": 68.2
        },
        "by_category": [
            {"category": "Co-parcenary & Inheritance Partition", "percentage": 38.5, "avg_months": 31.2},
            {"category": "Cadastral Boundary Encroachment", "percentage": 24.0, "avg_months": 18.5},
            {"category": "Land Acquisition Compensation Dispute", "percentage": 19.5, "avg_months": 28.0},
            {"category": "Tenancy & Leasehold Contests", "percentage": 11.0, "avg_months": 14.8},
            {"category": "Mutation Record Inconsistencies", "percentage": 7.0, "avg_months": 8.4}
        ],
        "state_dispute_density": [
            {"state": "Bihar", "dispute_density_per_1000_parcels": 68.4},
            {"state": "Uttar Pradesh", "dispute_density_per_1000_parcels": 62.1},
            {"state": "West Bengal", "dispute_density_per_1000_parcels": 54.8},
            {"state": "Maharashtra", "dispute_density_per_1000_parcels": 44.5},
            {"state": "Rajasthan", "dispute_density_per_1000_parcels": 39.8},
            {"state": "Madhya Pradesh", "dispute_density_per_1000_parcels": 36.2},
            {"state": "Karnataka", "dispute_density_per_1000_parcels": 31.0},
            {"state": "Gujarat", "dispute_density_per_1000_parcels": 25.3}
        ]
    }

@router.get("/delay-risk-factors")
def get_delay_risk_factors():
    """Derived directly from MoRD Problem Statement 25017 (Predictive Analytics for Land Acquisition)"""
    return {
        "title": "Empirical Delay Risk Drivers in Land Acquisition (MoRD 25017)",
        "factors": [
            {"factor": "Court Stay Orders & Title Contests", "importance_weight": 0.32, "avg_delay_days": 420},
            {"factor": "Delayed Compensation Disbursement / Treasury Clearance", "importance_weight": 0.24, "avg_delay_days": 210},
            {"factor": "Incomplete Cadastral Map Georeferencing", "importance_weight": 0.18, "avg_delay_days": 180},
            {"factor": "Rehabilitation & Resettlement (R&R) Resistance", "importance_weight": 0.15, "avg_delay_days": 260},
            {"factor": "Inter-Departmental Notification Approvals", "importance_weight": 0.11, "avg_delay_days": 120}
        ],
        "stages_at_risk": [
            {"stage": "Section 11 Preliminary Notification", "avg_completion_days": 180, "target_days": 90},
            {"stage": "Section 15 Hearing of Objections", "avg_completion_days": 120, "target_days": 60},
            {"stage": "Section 19 Declaration Publication", "avg_completion_days": 240, "target_days": 120},
            {"stage": "Section 23 Enquiry and Award", "avg_completion_days": 310, "target_days": 180},
            {"stage": "Section 38 Taking Possession of Land", "avg_completion_days": 190, "target_days": 90}
        ]
    }
