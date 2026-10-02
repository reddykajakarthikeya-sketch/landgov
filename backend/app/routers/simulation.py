import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.entities import PolicyScenario, User, AuditLog
from app.schemas import PolicyScenarioCreate, PolicyScenarioResponse
from app.services.simulation_engine import PolicySimulationEngine
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/simulation", tags=["Policy Simulation Lab"])

@router.post("/calculate")
def run_simulation_calculation(params: PolicyScenarioCreate):
    results = PolicySimulationEngine.calculate_scenario(
        state=params.state,
        base_year=params.base_year,
        target_year=params.target_year,
        urban_expansion_rate_pct=params.urban_expansion_rate_pct,
        agri_land_protection_pct=params.agri_land_protection_pct,
        forest_conservation_pct=params.forest_conservation_pct,
        industrial_corridor_hectares=params.industrial_corridor_hectares,
        solar_renewable_hectares=params.solar_renewable_hectares,
        waterbody_buffer_meters=params.waterbody_buffer_meters
    )
    return {
        "inputs": params.dict(),
        "outputs": results
    }

@router.post("/scenarios", status_code=201)
def save_scenario(
    scenario_in: PolicyScenarioCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["researcher", "institution_admin", "policymaker", "platform_admin"]))
):

    calc = PolicySimulationEngine.calculate_scenario(
        state=scenario_in.state,
        base_year=scenario_in.base_year,
        target_year=scenario_in.target_year,
        urban_expansion_rate_pct=scenario_in.urban_expansion_rate_pct,
        agri_land_protection_pct=scenario_in.agri_land_protection_pct,
        forest_conservation_pct=scenario_in.forest_conservation_pct,
        industrial_corridor_hectares=scenario_in.industrial_corridor_hectares,
        solar_renewable_hectares=scenario_in.solar_renewable_hectares,
        waterbody_buffer_meters=scenario_in.waterbody_buffer_meters
    )
    
    scenario = PolicyScenario(
        user_id=current_user.id if current_user else None,
        title=scenario_in.title,
        description=scenario_in.description,
        state=scenario_in.state,
        base_year=scenario_in.base_year,
        target_year=scenario_in.target_year,
        urban_expansion_rate_pct=scenario_in.urban_expansion_rate_pct,
        agri_land_protection_pct=scenario_in.agri_land_protection_pct,
        forest_conservation_pct=scenario_in.forest_conservation_pct,
        industrial_corridor_hectares=scenario_in.industrial_corridor_hectares,
        solar_renewable_hectares=scenario_in.solar_renewable_hectares,
        waterbody_buffer_meters=scenario_in.waterbody_buffer_meters,
        simulated_food_security_index=calc["simulated_food_security_index"],
        simulated_carbon_sink_mt=calc["simulated_carbon_sink_mt"],
        simulated_economic_output_cr=calc["simulated_economic_output_cr"],
        simulated_dispute_risk_index=calc["simulated_dispute_risk_index"],
        groundwater_stress_index=calc["groundwater_stress_index"],
        results_json=json.dumps(calc)
    )
    db.add(scenario)
    db.commit()
    db.refresh(scenario)
    
    return {
        "message": "Policy scenario saved successfully",
        "id": scenario.id,
        "title": scenario.title,
        "outputs": calc
    }

@router.get("/scenarios")
def list_scenarios(
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    query = db.query(PolicyScenario)
    if current_user:
        if current_user.role in ["policymaker", "platform_admin"]:
            # Government officials & Admins see all policy scenarios
            pass
        elif current_user.role in ["researcher", "institution_admin"]:
            # Researchers see their own scenarios plus national benchmarks
            query = query.filter((PolicyScenario.user_id == current_user.id) | (PolicyScenario.user_id == None))
        elif current_user.role == "public_user":
            # Public user only sees national benchmarks
            query = query.filter(PolicyScenario.user_id == None)

    scenarios = query.order_by(PolicyScenario.created_at.desc()).limit(20).all()
    results = []
    for s in scenarios:
        results.append({
            "id": s.id,
            "title": s.title,
            "description": s.description,
            "state": s.state,
            "base_year": s.base_year,
            "target_year": s.target_year,
            "urban_expansion_rate_pct": s.urban_expansion_rate_pct,
            "agri_land_protection_pct": s.agri_land_protection_pct,
            "forest_conservation_pct": s.forest_conservation_pct,
            "industrial_corridor_hectares": s.industrial_corridor_hectares,
            "solar_renewable_hectares": s.solar_renewable_hectares,
            "waterbody_buffer_meters": s.waterbody_buffer_meters,
            "simulated_food_security_index": s.simulated_food_security_index,
            "simulated_carbon_sink_mt": s.simulated_carbon_sink_mt,
            "simulated_economic_output_cr": s.simulated_economic_output_cr,
            "simulated_dispute_risk_index": s.simulated_dispute_risk_index,
            "groundwater_stress_index": s.groundwater_stress_index,
            "created_at": s.created_at.isoformat()
        })
    return results
