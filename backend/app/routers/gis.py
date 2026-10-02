from fastapi import APIRouter
from app.services.gis_service import (
    get_all_states,
    get_state_by_id,
    get_watershed_points,
    get_infrastructure_projects
)

router = APIRouter(prefix="/gis", tags=["GIS Explorer"])

@router.get("/states")
def get_states():
    return {
        "status": "success",
        "data": get_all_states()
    }

@router.get("/states/{state_id}")
def get_state(state_id: str):
    state = get_state_by_id(state_id)
    if not state:
        return {"error": "State not found"}
    return state

@router.get("/watershed-interventions")
@router.get("/watershed-sites")
def get_watershed_sites():
    return {
        "source": "ISRO/NRSC Bhuvan & DoLR SRISHTI-DRISHTI 30m Satellite Interventions",
        "reference_problem": "MoRD Problem Statement 26015",
        "total_sites": len(get_watershed_points()),
        "data": get_watershed_points()
    }

@router.get("/infrastructure-delays")
@router.get("/infrastructure-projects")
def get_infrastructure():
    return {
        "source": "National Highway & Railway Land Acquisition Delay Risk Monitor",
        "reference_problems": "MoRD Problem Statements 26016 & 25017",
        "total_projects": len(get_infrastructure_projects()),
        "data": get_infrastructure_projects()
    }

@router.get("/layers")
def get_layers_manifest():
    return [
        {
            "id": "dilrmp_layer",
            "name": "DILRMP Land Record Digitization Index",
            "category": "Cadastral Governance",
            "default_enabled": True,
            "legend": [
                {"label": "> 95% Digitized", "color": "#15803d"},
                {"label": "85% - 95% Digitized", "color": "#eab308"},
                {"label": "< 85% Digitized", "color": "#ef4444"}
            ]
        },
        {
            "id": "watershed_layer",
            "name": "Bhuvan Watershed Interventions (30m Satellite)",
            "category": "Natural Resources (MoRD 26015)",
            "default_enabled": True,
            "legend": [
                {"label": "Contour Trenches & Farm Ponds", "color": "#0284c7"},
                {"label": "Check Dam Networks", "color": "#2563eb"},
                {"label": "Recharge Tanks", "color": "#4f46e5"}
            ]
        },
        {
            "id": "infra_delay_layer",
            "name": "Land Acquisition Delay Risk Markers",
            "category": "Infrastructure (MoRD 25017)",
            "default_enabled": True,
            "legend": [
                {"label": "Low Risk (< 30%)", "color": "#22c55e"},
                {"label": "Medium Risk (30% - 50%)", "color": "#f59e0b"},
                {"label": "High Risk (> 50%)", "color": "#dc2626"}
            ]
        },
        {
            "id": "climate_layer",
            "name": "Climate Vulnerability & Land Degradation",
            "category": "Environmental",
            "default_enabled": False,
            "legend": [
                {"label": "High Drought / Flood Vulnerability", "color": "#991b1b"},
                {"label": "Moderate Vulnerability", "color": "#ea580c"},
                {"label": "Low Vulnerability", "color": "#16a34a"}
            ]
        }
    ]
