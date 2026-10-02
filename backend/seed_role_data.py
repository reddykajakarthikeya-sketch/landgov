from app.database import SessionLocal
from app.models.entities import (
    User,
    ResearchProject,
    ProjectObjective,
    ProjectTask,
    ProjectMilestone,
    ProjectComment,
    PolicyScenario,
    GrantOpportunity,
    GrantApplication,
    AuditLog
)
from app.auth import get_password_hash
import json
from datetime import datetime

def seed_rich_role_data():
    db = SessionLocal()
    print("--- Seeding/Enhancing Role-Specific Data ---")
    pw = get_password_hash("Admin@1234")

    # 1. Ensure affiliated users for NIRDPR and IIT Delhi
    extra_users = [
        {
            "email": "faculty.nirdpr@nirdpr.ac.in",
            "full_name": "Dr. K. V. Ramanathan",
            "role": "researcher",
            "organization": "National Institute of Rural Development & PR",
            "department": "Department of Watershed Management & Geospatial Studies"
        },
        {
            "email": "scholar.iitd@iitd.ac.in",
            "full_name": "Aarav Sharma",
            "role": "researcher",
            "organization": "Indian Institute of Technology Delhi",
            "department": "School of Public Policy"
        }
    ]

    for u_data in extra_users:
        existing = db.query(User).filter(User.email == u_data["email"]).first()
        if not existing:
            new_u = User(
                email=u_data["email"],
                hashed_password=pw,
                full_name=u_data["full_name"],
                role=u_data["role"],
                organization=u_data["organization"],
                department=u_data["department"],
                is_active=True
            )
            db.add(new_u)
            print(f"Added member: {u_data['email']}")

    db.commit()

    # Get user references
    admin_user = db.query(User).filter(User.role == "platform_admin").first()
    policy_user = db.query(User).filter(User.role == "policymaker").first()
    inst_user = db.query(User).filter(User.role == "institution_admin").first()
    researcher_user = db.query(User).filter(User.email == "researcher@iitd.ac.in").first()
    nirdpr_faculty = db.query(User).filter(User.email == "faculty.nirdpr@nirdpr.ac.in").first() or inst_user

    # 2. Seed NIRDPR Institutional Project
    existing_p = db.query(ResearchProject).filter(ResearchProject.title.ilike("%SRISHTI-DRISHTI%")).first()
    if not existing_p:
        nirdpr_proj = ResearchProject(
            title="SRISHTI-DRISHTI Watershed Monitoring & Soil Moisture Geo-Tagging",
            summary="Field evaluation and geospatial validation of check dam effectiveness and soil moisture retention using 30m satellite data across drought-prone districts of Andhra Pradesh and Telangana.",
            domain="watershed_management",
            lead_researcher_id=nirdpr_faculty.id,
            institution="National Institute of Rural Development & PR",
            budget_inr=2800000.0,
            target_state="Andhra Pradesh & Telangana",
            status="active"
        )
        db.add(nirdpr_proj)
        db.flush()

        db.add(ProjectObjective(project_id=nirdpr_proj.id, title="Georeference 120 check dams in Rayalaseema basin", order_index=0))
        db.add(ProjectObjective(project_id=nirdpr_proj.id, title="Correlate Sentinel-2 & Bhuvan NDVI changes with ground moisture", order_index=1))
        db.add(ProjectTask(project_id=nirdpr_proj.id, title="Field GPS validation in Anantapur district", assigned_to="Field Fellow", status="in_progress", priority="high", due_date="2026-11-15"))
        db.add(ProjectTask(project_id=nirdpr_proj.id, title="Spectral reflectance calibration pipeline", assigned_to="GIS Specialist", status="completed", priority="medium", due_date="2026-09-30"))
        db.add(ProjectMilestone(project_id=nirdpr_proj.id, title="Interim Catchment Hydrology Report", due_date="2026-10-30", is_achieved=True))
        print("Added NIRDPR Institutional Research Project.")

    # 3. Seed Grant Applications
    grants = db.query(GrantOpportunity).all()
    if grants and db.query(GrantApplication).count() == 0:
        app1 = GrantApplication(
            grant_id=grants[0].id,
            user_id=researcher_user.id,
            applicant_name=researcher_user.full_name,
            institution=researcher_user.organization,
            proposal_title="AI-Enabled Conclusive Titling & Boundary Dispute Prevention Framework",
            abstract="Applying spatial graph neural networks to detect cadastre boundary anomalies before land mutation registration occurs.",
            budget_requested="₹32,50,000",
            status="under_review"
        )
        app2 = GrantApplication(
            grant_id=grants[1].id if len(grants) > 1 else grants[0].id,
            user_id=nirdpr_faculty.id,
            applicant_name=nirdpr_faculty.full_name,
            institution=nirdpr_faculty.organization,
            proposal_title="Community Geospatial Monitoring for Village Common Land & Watersheds",
            abstract="Empowering Gram Panchayats with mobile Bhuvan mapping tools for rapid verification of village common land and check dams.",
            budget_requested="₹18,00,000",
            status="submitted"
        )
        db.add(app1)
        db.add(app2)
        print("Added initial Grant Applications.")

    # 4. Link policy scenarios to users
    scenarios = db.query(PolicyScenario).all()
    if scenarios:
        for idx, sc in enumerate(scenarios):
            if idx % 2 == 0 and policy_user:
                sc.user_id = policy_user.id
            elif researcher_user:
                sc.user_id = researcher_user.id
        print("Linked policy scenarios to policymakers and researchers.")

    # 5. Add representative audit logs
    if db.query(AuditLog).count() < 10:
        db.add(AuditLog(user_id=admin_user.id, user_email=admin_user.email, action="SYSTEM_INITIALIZATION", module="Core", details="National Platform core services started"))
        db.add(AuditLog(user_id=policy_user.id, user_email=policy_user.email, action="POLICY_SIMULATION_EXECUTED", module="Simulation", details="Executed balanced urbanization scenario for Maharashtra"))
        db.add(AuditLog(user_id=researcher_user.id, user_email=researcher_user.email, action="PROJECT_MILESTONE_UPDATED", module="Workspace", details="Marked milestone completed for Khasra digitization"))
        db.add(AuditLog(user_id=inst_user.id, user_email=inst_user.email, action="GRANT_APPLICATION_REVIEWED", module="Grants", details="Institutional endorsement provided for NIRDPR watershed proposal"))

    db.commit()
    db.close()
    print("--- Role Data Enhancement Complete ---")

if __name__ == "__main__":
    seed_rich_role_data()
