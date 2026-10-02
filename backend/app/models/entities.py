from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="researcher") # public_user, researcher, institution_admin, policymaker, platform_admin
    organization = Column(String(255), default="National Institute of Rural Development")
    department = Column(String(255), default="Land Governance & Policy Cell")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    projects = relationship("ResearchProject", back_populates="lead_researcher")
    comments = relationship("ProjectComment", back_populates="user")
    scenarios = relationship("PolicyScenario", back_populates="creator")
    applications = relationship("GrantApplication", back_populates="applicant")

class ResearchResource(Base):
    __tablename__ = "research_resources"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False, index=True)
    abstract = Column(Text, nullable=False)
    resource_type = Column(String(50), nullable=False, index=True) # research_paper, policy_document, land_law, government_report, dataset, case_study, project_report
    domain = Column(String(100), nullable=False, index=True) # land_records, watershed_management, urban_expansion, climate_resilience, dispute_resolution, valuation, land_acquisition
    authors = Column(String(500), nullable=False)
    publication_year = Column(Integer, default=2026)
    organization = Column(String(255), default="Ministry of Rural Development, Government of India")
    file_name = Column(String(255), nullable=True)
    file_size_kb = Column(Integer, default=0)
    source_url = Column(String(1000), nullable=True)
    citation = Column(String(1000), nullable=True)
    is_sih_official = Column(Boolean, default=False)
    sih_doc_id = Column(String(50), nullable=True) # e.g. 26019, 26018, etc.
    extracted_text = Column(Text, nullable=True)
    keywords = Column(String(500), nullable=True)
    download_count = Column(Integer, default=0)
    view_count = Column(Integer, default=0)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class DatasetItem(Base):
    __tablename__ = "datasets"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False) # Cadastral Surveys, Satellite/Remote Sensing, Land Use & Land Cover, Land Acquisition, Dispute Records
    source_agency = Column(String(255), nullable=False) # MoRD/DoLR, Survey of India, ISRO/NRSC Bhuvan, Ministry of Agriculture
    file_format = Column(String(50), nullable=False) # PDF, GeoJSON, CSV, Shapefile, GeoTIFF
    record_count = Column(Integer, default=0)
    geographic_coverage = Column(String(100), default="National (Pan-India)")
    temporal_coverage = Column(String(100), default="2018 - 2026")
    fields_schema = Column(Text, nullable=True) # JSON string of fields
    validation_status = Column(String(50), default="VERIFIED") # VERIFIED, VALIDATED, ACTIVE
    integration_status = Column(String(50), default="FULLY_INTEGRATED") # FULLY_INTEGRATED, IMPORTED, API_LINKED
    is_sih_official = Column(Boolean, default=False)
    sih_file_code = Column(String(50), nullable=True)
    download_url = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ResearchProject(Base):
    __tablename__ = "research_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    summary = Column(Text, nullable=False)
    domain = Column(String(100), nullable=False)
    lead_researcher_id = Column(Integer, ForeignKey("users.id"))
    institution = Column(String(255), default="Centre for Land Governance & Policy")
    status = Column(String(50), default="active") # planning, active, review, completed
    budget_inr = Column(Float, default=0.0)
    target_state = Column(String(100), default="Pan-India")
    start_date = Column(String(50), nullable=True)
    end_date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    lead_researcher = relationship("User", back_populates="projects")
    objectives = relationship("ProjectObjective", back_populates="project", cascade="all, delete-orphan")
    tasks = relationship("ProjectTask", back_populates="project", cascade="all, delete-orphan")
    milestones = relationship("ProjectMilestone", back_populates="project", cascade="all, delete-orphan")
    comments = relationship("ProjectComment", back_populates="project", cascade="all, delete-orphan")

class ProjectObjective(Base):
    __tablename__ = "project_objectives"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id"))
    title = Column(String(500), nullable=False)
    is_completed = Column(Boolean, default=False)
    order_index = Column(Integer, default=0)
    
    project = relationship("ResearchProject", back_populates="objectives")

class ProjectTask(Base):
    __tablename__ = "project_tasks"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    assigned_to = Column(String(255), default="Team Lead")
    status = Column(String(50), default="todo") # todo, in_progress, completed
    priority = Column(String(50), default="medium") # low, medium, high
    due_date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("ResearchProject", back_populates="tasks")

class ProjectMilestone(Base):
    __tablename__ = "project_milestones"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id"))
    title = Column(String(255), nullable=False)
    due_date = Column(String(50), nullable=True)
    is_achieved = Column(Boolean, default=False)
    
    project = relationship("ResearchProject", back_populates="milestones")

class ProjectComment(Base):
    __tablename__ = "project_comments"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("research_projects.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("ResearchProject", back_populates="comments")
    user = relationship("User", back_populates="comments")

class PolicyScenario(Base):
    __tablename__ = "policy_scenarios"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    state = Column(String(100), default="National Average")
    base_year = Column(Integer, default=2024)
    target_year = Column(Integer, default=2035)
    
    # Policy levers
    urban_expansion_rate_pct = Column(Float, default=3.2)
    agri_land_protection_pct = Column(Float, default=85.0)
    forest_conservation_pct = Column(Float, default=95.0)
    industrial_corridor_hectares = Column(Float, default=15000.0)
    solar_renewable_hectares = Column(Float, default=12000.0)
    waterbody_buffer_meters = Column(Float, default=100.0)
    
    # Calculated outputs
    simulated_food_security_index = Column(Float, default=78.4)
    simulated_carbon_sink_mt = Column(Float, default=142.5)
    simulated_economic_output_cr = Column(Float, default=45000.0)
    simulated_dispute_risk_index = Column(Float, default=34.2)
    groundwater_stress_index = Column(Float, default=42.1)
    
    results_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    creator = relationship("User", back_populates="scenarios")

class GrantOpportunity(Base):
    __tablename__ = "grant_opportunities"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    organizer = Column(String(255), default="Ministry of Rural Development (DoLR)")
    opportunity_type = Column(String(100), default="Research Grant") # Research Grant, Hackathon, Pilot Project, Innovation Challenge
    funding_amount = Column(String(100), default="₹25,00,000")
    deadline = Column(String(50), default="2026-12-31")
    eligibility = Column(Text, nullable=False)
    description = Column(Text, nullable=False)
    focus_areas = Column(String(500), default="AI, GIS, Land Digitization, Dispute Reduction")
    status = Column(String(50), default="open") # open, reviewing, closed
    applicants_count = Column(Integer, default=12)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    applications = relationship("GrantApplication", back_populates="grant")

class GrantApplication(Base):
    __tablename__ = "grant_applications"
    
    id = Column(Integer, primary_key=True, index=True)
    grant_id = Column(Integer, ForeignKey("grant_opportunities.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    applicant_name = Column(String(255), nullable=False)
    institution = Column(String(255), nullable=False)
    proposal_title = Column(String(500), nullable=False)
    abstract = Column(Text, nullable=False)
    budget_requested = Column(String(100), nullable=False)
    status = Column(String(50), default="submitted") # submitted, under_review, shortlisted, awarded, rejected
    submission_date = Column(DateTime, default=datetime.utcnow)
    
    grant = relationship("GrantOpportunity", back_populates="applications")
    applicant = relationship("User", back_populates="applications")

class ExternalIntegration(Base):
    __tablename__ = "external_integrations"
    
    id = Column(Integer, primary_key=True, index=True)
    system_name = Column(String(255), nullable=False) # ISRO Bhuvan GIS, DILRMP National Land Records, Bhoomi / e-Dharti, PM Gati Shakti, e-Courts NJDG
    category = Column(String(100), nullable=False) # Geospatial, Land Cadastral, Infrastructure, Judicial
    description = Column(Text, nullable=False)
    endpoint_url = Column(String(500), nullable=False)
    status = Column(String(50), default="Active") # Active, Simulated/Mock, Maintenance
    is_simulated = Column(Boolean, default=True)
    auth_mode = Column(String(50), default="API Key / OAuth 2.0")
    last_sync = Column(String(50), default="Real-time / 10m ago")
    records_synced = Column(Integer, default=1420500)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    user_email = Column(String(255), default="system")
    action = Column(String(100), nullable=False)
    module = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    created_at = Column(DateTime, default=datetime.utcnow)
