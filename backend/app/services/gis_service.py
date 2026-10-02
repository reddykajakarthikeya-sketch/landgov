from typing import Dict, Any, List

# Coordinates and governance indicators for Indian States & UTs
INDIAN_STATES_DATA = [
    {
        "id": "AP",
        "name": "Andhra Pradesh",
        "lat": 15.9129,
        "lng": 79.7400,
        "dilrmp_ror_pct": 99.4,
        "cadastral_digitized_pct": 98.2,
        "modern_record_rooms_pct": 94.0,
        "dispute_index": 28.4,
        "climate_vulnerability": "Moderate (Coastal & Rayalaseema Drought)",
        "dominant_land_use": "Agricultural / Coastal Aquaculture",
        "active_research_count": 8,
        "watershed_interventions": 1420,
        "land_acquisition_delay_risk": "Low (22%)"
    },
    {
        "id": "KA",
        "name": "Karnataka",
        "lat": 15.3173,
        "lng": 75.7139,
        "dilrmp_ror_pct": 99.8,
        "cadastral_digitized_pct": 96.5,
        "modern_record_rooms_pct": 98.1,
        "dispute_index": 31.0,
        "climate_vulnerability": "High (North Karnataka Semi-Arid)",
        "dominant_land_use": "Agricultural & Tech Corridors",
        "active_research_count": 14,
        "watershed_interventions": 1890,
        "land_acquisition_delay_risk": "Medium (38%)"
    },
    {
        "id": "MH",
        "name": "Maharashtra",
        "lat": 19.7515,
        "lng": 75.7139,
        "dilrmp_ror_pct": 98.7,
        "cadastral_digitized_pct": 95.1,
        "modern_record_rooms_pct": 96.3,
        "dispute_index": 44.5,
        "climate_vulnerability": "Severe (Marathwada & Vidarbha Drought)",
        "dominant_land_use": "Rainfed Agri & Industrial Corridors",
        "active_research_count": 19,
        "watershed_interventions": 2650,
        "land_acquisition_delay_risk": "High (52%)"
    },
    {
        "id": "MP",
        "name": "Madhya Pradesh",
        "lat": 22.9734,
        "lng": 78.6569,
        "dilrmp_ror_pct": 99.1,
        "cadastral_digitized_pct": 94.8,
        "modern_record_rooms_pct": 92.5,
        "dispute_index": 36.2,
        "climate_vulnerability": "Moderate (Bundelkhand Drought)",
        "dominant_land_use": "Soybean/Wheat Agri & Forest Reserve",
        "active_research_count": 11,
        "watershed_interventions": 3120,
        "land_acquisition_delay_risk": "Medium (34%)"
    },
    {
        "id": "RJ",
        "name": "Rajasthan",
        "lat": 27.0238,
        "lng": 74.2179,
        "dilrmp_ror_pct": 97.5,
        "cadastral_digitized_pct": 91.2,
        "modern_record_rooms_pct": 88.0,
        "dispute_index": 39.8,
        "climate_vulnerability": "Severe (Thar Desert & Arid Agro-ecosystem)",
        "dominant_land_use": "Arid Grazing, Solar Parks & Pulses",
        "active_research_count": 10,
        "watershed_interventions": 2400,
        "land_acquisition_delay_risk": "Low (26%)"
    },
    {
        "id": "UP",
        "name": "Uttar Pradesh",
        "lat": 26.8467,
        "lng": 80.9462,
        "dilrmp_ror_pct": 99.5,
        "cadastral_digitized_pct": 97.4,
        "modern_record_rooms_pct": 95.0,
        "dispute_index": 62.1,
        "climate_vulnerability": "Moderate (Eastern Flood & Bundelkhand Arid)",
        "dominant_land_use": "Intensive Gangetic Agriculture & Expressways",
        "active_research_count": 22,
        "watershed_interventions": 2180,
        "land_acquisition_delay_risk": "High (58%)"
    },
    {
        "id": "GJ",
        "name": "Gujarat",
        "lat": 22.2587,
        "lng": 71.1924,
        "dilrmp_ror_pct": 99.9,
        "cadastral_digitized_pct": 98.9,
        "modern_record_rooms_pct": 99.0,
        "dispute_index": 25.3,
        "climate_vulnerability": "Moderate (Kutch Arid & Salinity)",
        "dominant_land_use": "Industrial Corridors, Ports & Cash Crops",
        "active_research_count": 13,
        "watershed_interventions": 1780,
        "land_acquisition_delay_risk": "Low (18%)"
    },
    {
        "id": "TN",
        "name": "Tamil Nadu",
        "lat": 11.1271,
        "lng": 78.6569,
        "dilrmp_ror_pct": 99.2,
        "cadastral_digitized_pct": 97.8,
        "modern_record_rooms_pct": 97.0,
        "dispute_index": 33.4,
        "climate_vulnerability": "High (Cauvery Delta Drought & Cyclones)",
        "dominant_land_use": "Intensive Agriculture & Manufacturing",
        "active_research_count": 16,
        "watershed_interventions": 1950,
        "land_acquisition_delay_risk": "Medium (31%)"
    },
    {
        "id": "WB",
        "name": "West Bengal",
        "lat": 22.9868,
        "lng": 87.8550,
        "dilrmp_ror_pct": 96.1,
        "cadastral_digitized_pct": 89.4,
        "modern_record_rooms_pct": 86.2,
        "dispute_index": 54.8,
        "climate_vulnerability": "Severe (Sundarbans Sea Level & Floods)",
        "dominant_land_use": "Paddy, Jute & High-Density Peri-Urban",
        "active_research_count": 12,
        "watershed_interventions": 1100,
        "land_acquisition_delay_risk": "High (64%)"
    },
    {
        "id": "OD",
        "name": "Odisha",
        "lat": 20.9517,
        "lng": 85.0985,
        "dilrmp_ror_pct": 98.3,
        "cadastral_digitized_pct": 93.6,
        "modern_record_rooms_pct": 91.0,
        "dispute_index": 38.6,
        "climate_vulnerability": "High (Coastal Cyclones & Tribal Land Tenures)",
        "dominant_land_use": "Forests, Minerals & Paddy Agriculture",
        "active_research_count": 15,
        "watershed_interventions": 2150,
        "land_acquisition_delay_risk": "Medium (41%)"
    },
    {
        "id": "TG",
        "name": "Telangana",
        "lat": 18.1124,
        "lng": 79.0193,
        "dilrmp_ror_pct": 99.9,
        "cadastral_digitized_pct": 98.0,
        "modern_record_rooms_pct": 97.5,
        "dispute_index": 29.1,
        "climate_vulnerability": "Moderate (Semi-Arid Deccan)",
        "dominant_land_use": "Dharani Integrated Cadastre & Cotton/Rice",
        "active_research_count": 11,
        "watershed_interventions": 1560,
        "land_acquisition_delay_risk": "Low (24%)"
    },
    {
        "id": "KL",
        "name": "Kerala",
        "lat": 10.8505,
        "lng": 76.2711,
        "dilrmp_ror_pct": 95.8,
        "cadastral_digitized_pct": 88.2,
        "modern_record_rooms_pct": 89.0,
        "dispute_index": 35.7,
        "climate_vulnerability": "Severe (Western Ghats Landslides & Floods)",
        "dominant_land_use": "Plantations, Wetlands & Continuous Urbanization",
        "active_research_count": 9,
        "watershed_interventions": 940,
        "land_acquisition_delay_risk": "High (62%)"
    },
    {
        "id": "BR",
        "name": "Bihar",
        "lat": 25.0961,
        "lng": 85.3131,
        "dilrmp_ror_pct": 94.2,
        "cadastral_digitized_pct": 82.5,
        "modern_record_rooms_pct": 80.4,
        "dispute_index": 68.4,
        "climate_vulnerability": "Severe (Annual North Bihar Flooding)",
        "dominant_land_use": "Fragmented Smallholder Gangetic Agriculture",
        "active_research_count": 14,
        "watershed_interventions": 1280,
        "land_acquisition_delay_risk": "High (69%)"
    },
    {
        "id": "AS",
        "name": "Assam",
        "lat": 26.2006,
        "lng": 92.9376,
        "dilrmp_ror_pct": 92.1,
        "cadastral_digitized_pct": 79.8,
        "modern_record_rooms_pct": 76.5,
        "dispute_index": 48.2,
        "climate_vulnerability": "Severe (Brahmaputra Bank Erosion & Floods)",
        "dominant_land_use": "Tea Estates, Floodplains & Biodiversity Reserves",
        "active_research_count": 8,
        "watershed_interventions": 890,
        "land_acquisition_delay_risk": "High (56%)"
    }
]

# Watershed points mapping to Problem Statement 26015 (SRISHTI-DRISHTI / Bhuvan)
WATERSHED_INTERVENTIONS_POINTS = [
    {
        "id": "W-AP-01",
        "name": "Chittoor Watershed Pilot W-04",
        "state": "Andhra Pradesh",
        "district": "Chittoor",
        "lat": 13.2172,
        "lng": 79.1003,
        "type": "Continuous Contour Trenches & Farm Ponds",
        "catchment_area_ha": 1250,
        "soil_moisture_gain_pct": 34.2,
        "vegetation_ndvi_change": "+0.18",
        "srishti_drishti_id": "SD-AP-2024-881",
        "status": "Monitored via 30m Satellite Data"
    },
    {
        "id": "W-MH-02",
        "name": "Ralegan Siddhi Sub-basin Micro Watershed",
        "state": "Maharashtra",
        "district": "Ahmednagar",
        "lat": 19.0330,
        "lng": 74.4500,
        "type": "Check Dam Network & Ridge Area Plantation",
        "catchment_area_ha": 2100,
        "soil_moisture_gain_pct": 42.5,
        "vegetation_ndvi_change": "+0.24",
        "srishti_drishti_id": "SD-MH-2023-104",
        "status": "Validated via Geo-tagged Field Photos"
    },
    {
        "id": "W-RJ-03",
        "name": "Luni Basin Recharge Zone 12",
        "state": "Rajasthan",
        "district": "Jodhpur",
        "lat": 26.2389,
        "lng": 73.0243,
        "type": "Percolation Tanks & Sand Dune Stabilization",
        "catchment_area_ha": 3400,
        "soil_moisture_gain_pct": 21.0,
        "vegetation_ndvi_change": "+0.11",
        "srishti_drishti_id": "SD-RJ-2024-419",
        "status": "Monitored via 30m Satellite Data"
    },
    {
        "id": "W-MP-04",
        "name": "Bundelkhand Drought Mitigation Basin",
        "state": "Madhya Pradesh",
        "district": "Tikamgarh",
        "lat": 24.7450,
        "lng": 78.8310,
        "type": "Traditional Chandela Tank Revitalization",
        "catchment_area_ha": 1800,
        "soil_moisture_gain_pct": 38.6,
        "vegetation_ndvi_change": "+0.21",
        "srishti_drishti_id": "SD-MP-2024-633",
        "status": "Bhuvan Integrated"
    },
    {
        "id": "W-KA-05",
        "name": "Kolar Semi-Arid Aquifer Rejuvenation",
        "state": "Karnataka",
        "district": "Kolar",
        "lat": 13.1367,
        "lng": 78.1291,
        "type": "Cascading Tank System & Sub-surface Dykes",
        "catchment_area_ha": 1650,
        "soil_moisture_gain_pct": 29.8,
        "vegetation_ndvi_change": "+0.16",
        "srishti_drishti_id": "SD-KA-2024-512",
        "status": "Validated via Geo-tagged Field Photos"
    }
]

# Land Acquisition & Infrastructure projects mapping to Problem Statement 26016 and 25017
INFRASTRUCTURE_LAND_PROJECTS = [
    {
        "id": "LA-NH-44",
        "name": "National Highway NH-44 Expansion (Nagpur-Hyderabad Section)",
        "agency": "NHAI",
        "state": "Maharashtra / Telangana",
        "lat": 20.1500,
        "lng": 78.8500,
        "total_land_required_ha": 840,
        "land_acquired_pct": 74.5,
        "delay_risk_score": 42.0,
        "delay_risk_category": "Medium Risk",
        "primary_bottleneck": "Delayed court valuation challenge in 3 talukas",
        "rfctlarr_status": "Section 19 Declaration Published"
    },
    {
        "id": "LA-DFCC-W",
        "name": "Western Dedicated Freight Corridor (Vadodara - JNPT Segment)",
        "agency": "DFCCIL",
        "state": "Gujarat / Maharashtra",
        "lat": 20.8000,
        "lng": 73.1000,
        "total_land_required_ha": 1420,
        "land_acquired_pct": 91.2,
        "delay_risk_score": 28.5,
        "delay_risk_category": "Low Risk",
        "primary_bottleneck": "Pending R&R housing handover in peri-urban cluster",
        "rfctlarr_status": "Section 38 Possession Handover Stage"
    },
    {
        "id": "LA-NICD-03",
        "name": "Delhi-Mumbai Industrial Corridor (Dholera SIR Node)",
        "agency": "NICDC",
        "state": "Gujarat",
        "lat": 22.2400,
        "lng": 72.1800,
        "total_land_required_ha": 4500,
        "land_acquired_pct": 98.4,
        "delay_risk_score": 14.0,
        "delay_risk_category": "Low Risk",
        "primary_bottleneck": "Minor environmental clearance verification",
        "rfctlarr_status": "Complete Cadastral Geo-Tagging"
    },
    {
        "id": "LA-BUL-01",
        "name": "Purvanchal Industrial Township Land Cluster",
        "agency": "UPEIDA",
        "state": "Uttar Pradesh",
        "lat": 26.2500,
        "lng": 82.0500,
        "total_land_required_ha": 620,
        "land_acquired_pct": 49.0,
        "delay_risk_score": 68.5,
        "delay_risk_category": "High Risk",
        "primary_bottleneck": "Co-parcenary inheritance title disputes in khasra entries",
        "rfctlarr_status": "Section 11 Preliminary Notification Contested"
    },
    {
        "id": "LA-BC-EXP",
        "name": "Bengaluru-Chennai Expressway (Hosakote - Sriperumbudur)",
        "agency": "NHAI",
        "state": "Karnataka / Tamil Nadu",
        "lat": 12.9800,
        "lng": 78.4500,
        "total_land_required_ha": 980,
        "land_acquired_pct": 86.4,
        "delay_risk_score": 35.0,
        "delay_risk_category": "Medium Risk",
        "primary_bottleneck": "Sub-division boundary alignment with cadastral maps",
        "rfctlarr_status": "Section 19 Declaration Finalized"
    }
]

def get_all_states():
    return INDIAN_STATES_DATA

def get_state_by_id(state_id: str):
    for s in INDIAN_STATES_DATA:
        if s["id"].lower() == state_id.lower() or s["name"].lower() == state_id.lower():
            return s
    return None

def get_watershed_points():
    return WATERSHED_INTERVENTIONS_POINTS

def get_infrastructure_projects():
    return INFRASTRUCTURE_LAND_PROJECTS
