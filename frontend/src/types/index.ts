export type UserRole = 
  | 'public_user' 
  | 'researcher' 
  | 'institution_admin' 
  | 'policymaker' 
  | 'platform_admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  organization: string;
  department: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ResearchResource {
  id: number;
  title: string;
  abstract: string;
  resource_type: string;
  domain: string;
  authors: string;
  publication_year: number;
  organization: string;
  file_name?: string;
  file_size_kb?: number;
  citation?: string;
  is_sih_official: boolean;
  sih_doc_id?: string;
  keywords?: string;
  download_count: number;
  view_count: number;
  is_featured: boolean;
  created_at: string;
}

export interface DatasetItem {
  id: number;
  name: string;
  description: string;
  category: string;
  source_agency: string;
  file_format: string;
  record_count: number;
  geographic_coverage: string;
  temporal_coverage: string;
  fields: string[];
  validation_status: 'VERIFIED' | 'VALIDATED' | 'ACTIVE' | string;
  integration_status: 'FULLY_INTEGRATED' | 'IMPORTED' | 'API_LINKED' | string;
  is_sih_official: boolean;
  sih_file_code?: string;
  import_date: string;
  preview_records?: any[];
}

export interface ProjectTask {
  id: number;
  title: string;
  description?: string;
  assigned_to: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
}

export interface ProjectMilestone {
  id: number;
  title: string;
  due_date?: string;
  is_achieved: boolean;
}

export interface ProjectComment {
  id: number;
  user_name: string;
  content: string;
  created_at: string;
}

export interface ResearchProject {
  id: number;
  title: string;
  summary: string;
  domain: string;
  institution: string;
  status: string;
  budget_inr: number;
  target_state: string;
  lead_researcher_name?: string;
  created_at: string;
  tasks_count?: number;
  completed_tasks?: number;
  milestones_count?: number;
  achieved_milestones?: number;
  objectives?: { id: number; title: string; is_completed: boolean }[];
  tasks?: ProjectTask[];
  milestones?: ProjectMilestone[];
  comments?: ProjectComment[];
}

export interface PolicyScenarioInputs {
  title: string;
  description?: string;
  state: string;
  base_year: number;
  target_year: number;
  urban_expansion_rate_pct: number;
  agri_land_protection_pct: number;
  forest_conservation_pct: number;
  industrial_corridor_hectares: number;
  solar_renewable_hectares: number;
  waterbody_buffer_meters: number;
}

export interface SimulationOutputs {
  simulated_food_security_index: number;
  simulated_carbon_sink_mt: number;
  simulated_economic_output_cr: number;
  simulated_dispute_risk_index: number;
  groundwater_stress_index: number;
  deltas_vs_baseline: {
    food_security_pct: number;
    carbon_sink_pct: number;
    economic_output_pct: number;
    dispute_risk_pct: number;
  };
  formulas: Record<string, string>;
  assumptions: string[];
  limitations: string[];
}

export interface GrantOpportunity {
  id: number;
  title: string;
  organizer: string;
  opportunity_type: string;
  funding_amount: string;
  deadline: string;
  eligibility: string;
  description: string;
  focus_areas: string;
  status: string;
  applicants_count: number;
}

export interface ExternalIntegration {
  id: number;
  system_name: string;
  category: string;
  description: string;
  endpoint_url: string;
  status: string;
  is_simulated: boolean;
  auth_mode: string;
  last_sync: string;
  records_synced: number;
}

export interface ScopeOfStudyItem {
  domain: string;
  research_questions: string;
  required_datasets: string;
  analytical_methods: string;
  expected_outputs: string;
}

export interface TechStackItem {
  component: string;
  technology: string;
  purpose: string;
  implementation_status: string;
  future_integration: string;
}
