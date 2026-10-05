import { 
  ResearchResource, 
  DatasetItem, 
  ResearchProject, 
  PolicyScenarioInputs, 
  SimulationOutputs, 
  GrantOpportunity, 
  ExternalIntegration, 
  ScopeOfStudyItem, 
  TechStackItem,
  UserRole
} from '../types';

// Centralized environment-driven API Base Configuration
// In development: defaults to '/api' (proxied via Vite dev server to local FastAPI)
// In production: uses import.meta.env.VITE_API_URL (e.g., https://landgov-backend.onrender.com)
const RAW_API_URL = (import.meta.env.VITE_API_URL || '').trim();
const API_BASE = RAW_API_URL
  ? (RAW_API_URL.endsWith('/api') ? RAW_API_URL : `${RAW_API_URL.replace(/\/+$/, '')}/api`)
  : '/api';

export function getApiBaseUrl(): string {
  return API_BASE;
}

export function getDocsUrl(): string {
  if (RAW_API_URL) {
    const root = RAW_API_URL.replace(/\/api\/?$/, '');
    return `${root}/docs`;
  }
  return '/docs';
}

function buildUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${API_BASE}${cleanEndpoint}`;
}

function buildUrlObject(endpoint: string): URL {
  const full = buildUrl(endpoint);
  if (full.startsWith('http://') || full.startsWith('https://')) {
    return new URL(full);
  }
  return new URL(full, window.location.origin);
}

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  getDocsUrl,
  getApiBaseUrl,

  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  },

  async register(data: { email: string; password: string; full_name: string; role: UserRole; organization?: string; department?: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) return null;
    return res.json();
  },

  // Dashboard
  async getDashboardOverview() {
    const res = await fetch(`${API_BASE}/dashboard/overview`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Repository
  async getResources(params?: { search?: string; domain?: string; resource_type?: string; is_sih_official?: boolean; sort_by?: string; page?: number; limit?: number }) {
    const url = buildUrlObject('/repository/resources');
    if (params) {
      if (params.search) url.searchParams.set('search', params.search);
      if (params.domain) url.searchParams.set('domain', params.domain);
      if (params.resource_type) url.searchParams.set('resource_type', params.resource_type);
      if (params.is_sih_official !== undefined) url.searchParams.set('is_sih_official', String(params.is_sih_official));
      if (params.sort_by) url.searchParams.set('sort_by', params.sort_by);
      if (params.page) url.searchParams.set('page', String(params.page));
      if (params.limit) url.searchParams.set('limit', String(params.limit));
    }
    const res = await fetch(url.toString());
    return res.json();
  },

  async getResourceDetail(id: number): Promise<ResearchResource> {
    const res = await fetch(`${API_BASE}/repository/resources/${id}`);
    if (!res.ok) throw new Error('Resource not found');
    return res.json();
  },

  async submitResource(data: any) {
    const res = await fetch(`${API_BASE}/repository/resources`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error('Failed to submit resource');
    return res.json();
  },

  // AI Assistant
  async askAI(query: string, mode: string = 'chat', document_id?: number) {
    const res = await fetch(`${API_BASE}/ai/query`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, mode, document_id })
    });
    return res.json();
  },

  // GIS
  async getGisStates() {
    const res = await fetch(`${API_BASE}/gis/states`);
    return res.json();
  },

  async getWatershedSites() {
    const res = await fetch(`${API_BASE}/gis/watershed-sites`);
    return res.json();
  },

  async getInfrastructureProjects() {
    const res = await fetch(`${API_BASE}/gis/infrastructure-projects`);
    return res.json();
  },

  async getGisLayers() {
    const res = await fetch(`${API_BASE}/gis/layers`);
    return res.json();
  },

  // Analytics
  async getLandUseTrends() {
    const res = await fetch(`${API_BASE}/analytics/land-use-trends`);
    return res.json();
  },

  async getDisputeMetrics() {
    const res = await fetch(`${API_BASE}/analytics/dispute-metrics`);
    return res.json();
  },

  async getDelayRiskFactors() {
    const res = await fetch(`${API_BASE}/analytics/delay-risk-factors`);
    return res.json();
  },

  // Policy Simulation
  async calculateSimulation(params: PolicyScenarioInputs) {
    const res = await fetch(`${API_BASE}/simulation/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return res.json();
  },

  async saveScenario(params: PolicyScenarioInputs) {
    const res = await fetch(`${API_BASE}/simulation/scenarios`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params)
    });
    return res.json();
  },

  async getSavedScenarios() {
    const res = await fetch(`${API_BASE}/simulation/scenarios`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Projects
  async getProjects(): Promise<ResearchProject[]> {
    const res = await fetch(`${API_BASE}/projects`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async getProjectDetail(id: number): Promise<ResearchProject> {
    const res = await fetch(`${API_BASE}/projects/${id}`);
    return res.json();
  },

  async createProject(data: any) {
    const res = await fetch(`${API_BASE}/projects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async addTask(projectId: number, task: any) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(task)
    });
    return res.json();
  },

  async toggleTask(projectId: number, taskId: number) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/tasks/${taskId}/toggle`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  async addComment(projectId: number, content: string) {
    const res = await fetch(`${API_BASE}/projects/${projectId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    return res.json();
  },

  // Grants
  async getGrants(): Promise<GrantOpportunity[]> {
    const res = await fetch(`${API_BASE}/grants`);
    return res.json();
  },

  async applyGrant(grantId: number, data: any) {
    const res = await fetch(`${API_BASE}/grants/${grantId}/apply`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return res.json();
  },

  async getMyApplications() {
    const res = await fetch(`${API_BASE}/grants/my/applications`, {
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Datasets
  async getDatasets(category?: string): Promise<DatasetItem[]> {
    const url = category ? `${API_BASE}/datasets?category=${encodeURIComponent(category)}` : `${API_BASE}/datasets`;
    const res = await fetch(url);
    return res.json();
  },

  async getDatasetDetail(id: number): Promise<DatasetItem> {
    const res = await fetch(`${API_BASE}/datasets/${id}`);
    return res.json();
  },

  // Integrations
  async getIntegrations(): Promise<ExternalIntegration[]> {
    const res = await fetch(`${API_BASE}/integrations`);
    return res.json();
  },

  async syncIntegration(id: number) {
    const res = await fetch(`${API_BASE}/integrations/${id}/sync`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return res.json();
  },

  // Metadata
  async getScopeOfStudy(): Promise<ScopeOfStudyItem[]> {
    const res = await fetch(`${API_BASE}/metadata/scope-of-study`);
    return res.json();
  },

  async getTechStack(): Promise<TechStackItem[]> {
    const res = await fetch(`${API_BASE}/metadata/tech-stack`);
    return res.json();
  },

  // Role Management & Administration
  async getUsers() {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch users' }));
      throw new Error(err.detail || 'Access denied');
    }
    return res.json();
  },

  async toggleUserStatus(userId: number) {
    const res = await fetch(`${API_BASE}/auth/users/${userId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to update user status' }));
      throw new Error(err.detail || 'Operation failed');
    }
    return res.json();
  },

  async getAuditLogs(limit: number = 50) {
    const res = await fetch(`${API_BASE}/auth/audit-logs?limit=${limit}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch audit logs' }));
      throw new Error(err.detail || 'Access denied');
    }
    return res.json();
  },

  async getAdminGrantApplications() {
    const res = await fetch(`${API_BASE}/grants/admin/applications`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to fetch grant applications' }));
      throw new Error(err.detail || 'Access denied');
    }
    return res.json();
  },

  async updateGrantApplicationStatus(appId: number, status: string) {
    const res = await fetch(`${API_BASE}/grants/applications/${appId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Failed to update grant status' }));
      throw new Error(err.detail || 'Operation failed');
    }
    return res.json();
  },

  async sanctionGrant(grantId: number) {
    return this.updateGrantApplicationStatus(grantId, 'sanctioned');
  },

  async endorseGrant(grantId: number) {
    return this.updateGrantApplicationStatus(grantId, 'endorsed');
  }
};
