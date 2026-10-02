from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

# Token & Auth
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    full_name: str
    organization: str
    email: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None

class UserBase(BaseModel):
    email: str
    full_name: str
    role: str = "researcher"
    organization: str = "National Institute of Rural Development"
    department: str = "Land Governance & Policy Cell"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Research Resource
class ResearchResourceBase(BaseModel):
    title: str
    abstract: str
    resource_type: str
    domain: str
    authors: str
    publication_year: int = 2026
    organization: str = "Ministry of Rural Development, Government of India"
    file_name: Optional[str] = None
    file_size_kb: Optional[int] = 0
    source_url: Optional[str] = None
    citation: Optional[str] = None
    is_sih_official: bool = False
    sih_doc_id: Optional[str] = None
    keywords: Optional[str] = None
    is_featured: bool = False

class ResearchResourceCreate(ResearchResourceBase):
    pass

class ResearchResourceResponse(ResearchResourceBase):
    id: int
    download_count: int
    view_count: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Datasets
class DatasetItemResponse(BaseModel):
    id: int
    name: str
    description: str
    category: str
    source_agency: str
    file_format: str
    record_count: int
    geographic_coverage: str
    temporal_coverage: str
    fields_schema: Optional[str] = None
    validation_status: str
    integration_status: str
    is_sih_official: bool
    sih_file_code: Optional[str] = None
    download_url: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Projects & Tasks
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    assigned_to: str = "Team Lead"
    status: str = "todo"
    priority: str = "medium"
    due_date: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    project_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class ObjectiveBase(BaseModel):
    title: str
    is_completed: bool = False
    order_index: int = 0

class ObjectiveCreate(ObjectiveBase):
    pass

class ObjectiveResponse(ObjectiveBase):
    id: int
    project_id: int
    
    class Config:
        from_attributes = True

class MilestoneBase(BaseModel):
    title: str
    due_date: Optional[str] = None
    is_achieved: bool = False

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneResponse(MilestoneBase):
    id: int
    project_id: int
    
    class Config:
        from_attributes = True

class CommentCreate(BaseModel):
    content: str

class CommentResponse(BaseModel):
    id: int
    project_id: int
    user_id: Optional[int] = None
    user_name: Optional[str] = "Researcher"
    content: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class ResearchProjectCreate(BaseModel):
    title: str
    summary: str
    domain: str
    institution: str = "Centre for Land Governance & Policy"
    budget_inr: float = 0.0
    target_state: str = "Pan-India"
    start_date: Optional[str] = "2026-04-01"
    end_date: Optional[str] = "2027-03-31"

class ResearchProjectResponse(BaseModel):
    id: int
    title: str
    summary: str
    domain: str
    institution: str
    status: str
    budget_inr: float
    target_state: str
    start_date: Optional[str]
    end_date: Optional[str]
    created_at: datetime
    objectives: List[ObjectiveResponse] = []
    tasks: List[TaskResponse] = []
    milestones: List[MilestoneResponse] = []
    comments: List[CommentResponse] = []
    
    class Config:
        from_attributes = True

# Policy Simulation
class PolicyScenarioCreate(BaseModel):
    title: str
    description: Optional[str] = None
    state: str = "National Average"
    base_year: int = 2024
    target_year: int = 2035
    urban_expansion_rate_pct: float = 3.2
    agri_land_protection_pct: float = 85.0
    forest_conservation_pct: float = 95.0
    industrial_corridor_hectares: float = 15000.0
    solar_renewable_hectares: float = 12000.0
    waterbody_buffer_meters: float = 100.0

class PolicyScenarioResponse(PolicyScenarioCreate):
    id: int
    simulated_food_security_index: float
    simulated_carbon_sink_mt: float
    simulated_economic_output_cr: float
    simulated_dispute_risk_index: float
    groundwater_stress_index: float
    results_json: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

# Grants
class GrantApplicationCreate(BaseModel):
    applicant_name: str
    institution: str
    proposal_title: str
    abstract: str
    budget_requested: str

class GrantOpportunityResponse(BaseModel):
    id: int
    title: str
    organizer: str
    opportunity_type: str
    funding_amount: str
    deadline: str
    eligibility: str
    description: str
    focus_areas: str
    status: str
    applicants_count: int
    
    class Config:
        from_attributes = True

# AI Assistant
class AIQueryRequest(BaseModel):
    query: str
    mode: str = "chat" # chat, summarize, literature_review, gap_analysis, dataset_recommendation
    document_id: Optional[int] = None
    context_filters: Optional[Dict[str, Any]] = None

class AIQueryResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]
    confidence: float
    mode_executed: str
    is_fallback: bool
    suggestions: List[str]
