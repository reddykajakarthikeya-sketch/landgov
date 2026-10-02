import urllib.request
import json
import urllib.parse

BASE_URL = "http://127.0.0.1:8000/api"

def test_api():
    print("=== Testing National Land Governance Platform APIs ===")
    
    # 1. Health check
    req = urllib.request.urlopen(f"{BASE_URL}/health")
    health = json.loads(req.read().decode())
    assert health["status"] == "healthy"
    print(" [PASS] Health check verified:", health["platform"])

    # 2. Auth Login (test all 5 roles)
    roles_to_test = [
        ("admin@dolr.gov.in", "platform_admin"),
        ("policymaker@mord.gov.in", "policymaker"),
        ("institution@nirdpr.ac.in", "institution_admin"),
        ("researcher@iitd.ac.in", "researcher"),
        ("citizen@public.org", "public_user"),
    ]
    tokens = {}
    for email, expected_role in roles_to_test:
        login_data = json.dumps({"email": email, "password": "Admin@1234"}).encode()
        login_req = urllib.request.Request(
            f"{BASE_URL}/auth/login",
            data=login_data,
            headers={"Content-Type": "application/json"}
        )
        res = urllib.request.urlopen(login_req)
        body = json.loads(res.read().decode())
        assert body["role"] == expected_role
        tokens[expected_role] = body["access_token"]
        print(f" [PASS] Authenticated role '{expected_role}' with token")

    # 3. Dashboard Overview
    req = urllib.request.urlopen(f"{BASE_URL}/dashboard/overview")
    dash = json.loads(req.read().decode())
    assert "counts" in dash
    assert dash["indicators"]["sih_dataset_status"] == "VERIFIED & INTEGRATED"
    print(f" [PASS] Dashboard overview verified. Publications: {dash['counts']['research_publications']}, Datasets: {dash['counts']['available_datasets']}")

    # 4. Research Repository (Search & Filter)
    req = urllib.request.urlopen(f"{BASE_URL}/repository/resources?is_sih_official=true")
    repo = json.loads(req.read().decode())
    assert len(repo["items"]) >= 5
    print(f" [PASS] SIH official documents found in repository: {len(repo['items'])}")

    # 5. AI Research Assistant (Grounded RAG Query)
    ai_data = json.dumps({
        "query": "Summarize MoRD Problem Statement 26019 on Land Governance",
        "mode": "summarize"
    }).encode()
    ai_req = urllib.request.Request(
        f"{BASE_URL}/ai/query",
        data=ai_data,
        headers={"Content-Type": "application/json"}
    )
    ai_res = json.loads(urllib.request.urlopen(ai_req).read().decode())
    assert len(ai_res["answer"]) > 50
    assert len(ai_res["sources"]) > 0
    print(f" [PASS] AI Research Assistant grounded response generated with {len(ai_res['sources'])} verifiable citations")

    # 6. GIS Endpoints
    req = urllib.request.urlopen(f"{BASE_URL}/gis/states")
    states = json.loads(req.read().decode())
    assert len(states["data"]) >= 10
    
    req2 = urllib.request.urlopen(f"{BASE_URL}/gis/watershed-sites")
    ws = json.loads(req2.read().decode())
    assert ws["total_sites"] >= 5
    print(f" [PASS] GIS layers verified: {len(states['data'])} states, {ws['total_sites']} Bhuvan watershed sites")

    # 7. Policy Simulation Lab Calculation
    sim_data = json.dumps({
        "title": "Test Scenario 2035",
        "state": "National Average",
        "base_year": 2024,
        "target_year": 2035,
        "urban_expansion_rate_pct": 3.5,
        "agri_land_protection_pct": 85.0,
        "forest_conservation_pct": 95.0,
        "industrial_corridor_hectares": 15000.0,
        "solar_renewable_hectares": 12000.0,
        "waterbody_buffer_meters": 100.0
    }).encode()
    sim_req = urllib.request.Request(
        f"{BASE_URL}/simulation/calculate",
        data=sim_data,
        headers={"Content-Type": "application/json"}
    )
    sim_res = json.loads(urllib.request.urlopen(sim_req).read().decode())
    outputs = sim_res["outputs"]
    assert "simulated_food_security_index" in outputs
    assert "formulas" in outputs
    print(f" [PASS] Simulation Engine calculated: Food Security {outputs['simulated_food_security_index']}, Carbon Sink {outputs['simulated_carbon_sink_mt']} MT")

    # 8. Project Task Toggle
    toggle_req = urllib.request.Request(
        f"{BASE_URL}/projects/1/tasks/1/toggle",
        data=b"{}",
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {tokens['researcher']}"}
    )
    toggle_res = json.loads(urllib.request.urlopen(toggle_req).read().decode())
    print(" [PASS] Project task status toggled:", toggle_res["new_status"])

    # 9. Dataset Management & Preview
    req = urllib.request.urlopen(f"{BASE_URL}/datasets")
    datasets = json.loads(req.read().decode())
    assert len(datasets) >= 5
    
    req_det = urllib.request.urlopen(f"{BASE_URL}/datasets/1")
    det = json.loads(req_det.read().decode())
    assert "preview_records" in det
    print(f" [PASS] Dataset Management verified: {len(datasets)} master datasets with schema preview")

    print("\nALL VERIFICATION TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_api()
