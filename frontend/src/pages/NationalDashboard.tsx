import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Database, 
  FolderKanban, 
  Sliders, 
  Building2, 
  Users, 
  ArrowUpRight, 
  TrendingUp, 
  TrendingDown,
  AlertCircle, 
  CheckCircle2, 
  Scale, 
  Trees, 
  Clock, 
  ChevronRight,
  ExternalLink,
  ShieldCheck, 
  FileText,
  AlertTriangle,
  Award,
  Activity,
  Layers,
  MapPin,
  Lock,
  UserCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  Legend 
} from 'recharts';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  onSelectStateForSimulation?: (stateName: string) => void;
}

export const NationalDashboard: React.FC<DashboardProps> = ({ onNavigate, onSelectStateForSimulation }) => {
  const { user, isPublicUser, isResearcher, isPolicymaker, isInstitutionAdmin, isPlatformAdmin } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboard();
  }, [user]);

  async function fetchDashboard() {
    setLoading(true);
    try {
      const res = await api.getDashboardOverview();
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSanctionGrant(appId: number) {
    try {
      await api.updateGrantApplicationStatus(appId, 'sanctioned');
      setActionNotice(`Grant proposal #${appId} successfully sanctioned by MoRD policy committee.`);
      fetchDashboard();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  }

  async function handleEndorseGrant(appId: number) {
    try {
      await api.updateGrantApplicationStatus(appId, 'endorsed');
      setActionNotice(`Grant proposal #${appId} endorsed by institutional administration.`);
      fetchDashboard();
      setTimeout(() => setActionNotice(null), 3500);
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  }

  async function handleToggleTask(projectId: number, taskId: number) {
    try {
      await api.toggleTask(projectId, taskId);
      fetchDashboard();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle task');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#0a2540] border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-slate-500">Loading Role-Specific Command Center & National Statistics...</p>
        </div>
      </div>
    );
  }

  const counts = data?.counts || {};
  const indicators = data?.indicators || {};
  const landUseTrends = data?.land_use_trends || [];
  const climate = data?.climate_resilience || {};
  const disputes = data?.dispute_statistics || {};
  const recentUpdates = data?.recent_updates || [];
  const stateComparisons = data?.state_comparisons || [];
  const roleDashboard = data?.role_dashboard || {};
  const roleSections = roleDashboard?.role_sections || {};
  const kpiCards = roleDashboard?.kpi_cards || [];

  return (
    <div className="space-y-6">
      {/* Official SIH Integration Notice Banner (Shared) */}
      <div className="bg-white border-l-4 border-emerald-600 rounded-r-lg p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border border-slate-200">
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-emerald-50 rounded-lg text-emerald-700 shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 text-sm">
                Official SIH 2026 MoRD Dataset Ingested & Verified
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                5 Problem Documents Active
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              Integrated DoLR MoRD Policy Statements: <strong>26019</strong> (Land Governance Platform), 
              <strong> 26018</strong> (Multilingual Digitization), <strong>26016</strong> (Unified Acquisition), 
              <strong> 25017</strong> (Delay Analytics), and <strong>26015</strong> (SRISHTI-DRISHTI Satellite Watersheds).
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => onNavigate('repository')}
            className="px-3 py-1.5 bg-[#0a2540] hover:bg-[#1e3a5f] text-white text-xs font-semibold rounded-md transition flex items-center space-x-1"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            <span>Open Repository</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* =========================================================================
          ROLE-SPECIFIC COMMAND CENTER HERO & KPI CARDS
      ========================================================================= */}
      <div className="bg-gradient-to-r from-[#0a2540] to-[#153e6b] text-white p-6 rounded-lg shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-amber-500/20 text-amber-300 border border-amber-400/40">
                {roleDashboard.role_badge || 'Public Citizen'}
              </span>
              <span className="text-slate-300 text-xs">•</span>
              <span className="text-slate-300 text-xs font-medium">{roleDashboard.organization}</span>
            </div>
            <h2 className="text-xl font-bold mt-1 text-white">
              {roleDashboard.headline}
            </h2>
            <p className="text-slate-300 text-xs mt-1 max-w-3xl leading-relaxed">
              {roleDashboard.summary}
            </p>
          </div>

          {/* Quick Actions Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            {roleDashboard.quick_actions?.map((act: any, idx: number) => (
              <button
                key={idx}
                onClick={() => onNavigate(act.tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition cursor-pointer flex items-center space-x-1.5 ${
                  act.primary 
                    ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 text-slate-200 border border-white/20'
                }`}
              >
                <span>{act.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* 4 Role-Specific KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {kpiCards.map((kpi: any, idx: number) => (
            <div key={idx} className="bg-white/10 border border-white/15 p-3.5 rounded-lg backdrop-blur-xs">
              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span>{kpi.label}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 font-mono text-amber-300">
                  {kpi.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-white mt-1.5 tracking-tight">{kpi.value}</p>
              <p className="text-[10px] text-slate-300 mt-0.5">{kpi.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* =========================================================================
          ROLE-SPECIFIC INTERACTIVE WORKSPACE SECTIONS
      ========================================================================= */}

      {/* 1. PUBLIC CITIZEN SECTION */}
      {isPublicUser && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Featured Open Government Datasets & Cadastre (DoLR & Bhuvan)</span>
              </h3>
              <button 
                onClick={() => onNavigate('repository')}
                className="text-xs text-amber-700 font-semibold hover:underline"
              >
                Browse All 130+ Documents →
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {roleSections.featured_datasets?.map((ds: any, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 truncate">{ds.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-200">{ds.format}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">Category: {ds.category}</p>
                  <p className="text-[10px] text-slate-400">Coverage: {ds.coverage}</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-start space-x-2">
              <Sparkles className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Need evidence-based answers on Indian land laws?</p>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  The AI Research Assistant is grounded in official MoRD directives and landmark judicial precedent. Ask questions directly without needing technical logins.
                </p>
                <button 
                  onClick={() => onNavigate('ai-assistant')}
                  className="mt-2 px-2.5 py-1 bg-blue-700 hover:bg-blue-800 text-white font-medium rounded text-[11px] cursor-pointer"
                >
                  Consult AI Research Assistant →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-amber-50/60 p-5 rounded-lg border border-amber-200 shadow-xs space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-amber-900 font-bold">
              <Lock className="w-4 h-4 text-amber-700" />
              <span>Public Scope & Role Privileges</span>
            </div>
            <p className="text-amber-800 leading-relaxed text-[11px]">
              {roleSections.public_notice}
            </p>
            <div className="divide-y divide-amber-200/60 pt-1 text-[11px]">
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Public Research Repository</span>
                <span className="text-emerald-700 font-bold">Accessible</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Interactive GIS Map</span>
                <span className="text-emerald-700 font-bold">Accessible</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Policy Simulation Engine</span>
                <span className="text-amber-800 font-semibold">Elevated (Policymaker)</span>
              </div>
              <div className="py-2 flex items-center justify-between">
                <span className="text-slate-700 font-medium">Collaborative Workspace</span>
                <span className="text-amber-800 font-semibold">Elevated (Researcher)</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 pt-1">
              * Switch role using the Role Switcher dropdown in the top navbar to evaluate institutional & policymaker workflows.
            </p>
          </div>
        </div>
      )}

      {/* 2. RESEARCHER SECTION */}
      {isResearcher && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
                <FolderKanban className="w-4 h-4 text-blue-600" />
                <span>My Active Research Projects</span>
              </h3>
              <button 
                onClick={() => onNavigate('projects')}
                className="text-xs text-amber-700 font-semibold hover:underline"
              >
                Go to Workspace →
              </button>
            </div>
            <div className="space-y-3">
              {roleSections.my_projects?.map((proj: any) => (
                <div key={proj.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800">{proj.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Domain: <span className="font-semibold text-slate-700">{proj.domain}</span> • Region: {proj.target_state} • Budget: {proj.budget}
                    </p>
                    <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-1">
                      <span>Tasks: {proj.completed_tasks}/{proj.tasks_count} completed</span>
                      <span>Status: <strong className="text-emerald-700 uppercase">{proj.status}</strong></span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('projects')}
                    className="px-3 py-1.5 bg-[#0a2540] hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shrink-0"
                  >
                    Open Workspace
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-bold text-[#0a2540]">
              <span className="flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>My Priority Tasks</span>
              </span>
              <span className="text-[10px] text-slate-400">Click to Toggle</span>
            </div>
            <div className="space-y-2">
              {roleSections.my_tasks?.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No pending tasks.</p>
              ) : (
                roleSections.my_tasks?.map((task: any) => (
                  <div key={task.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-start space-x-2">
                    <input 
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => handleToggleTask(task.project_id, task.id)}
                      className="mt-0.5 rounded text-emerald-600 cursor-pointer"
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                        <span className={`px-1 rounded uppercase font-bold text-[9px] ${task.priority === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                          {task.priority}
                        </span>
                        <span>Due: {task.due_date}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. POLICYMAKER SECTION */}
      {isPolicymaker && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>State Intervention Watch List (High Dispute / Digitization Lag)</span>
              </h3>
              <span className="text-[10px] text-slate-400">DoLR National Monitor</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3">State / UT</th>
                    <th className="py-2 px-3">RoR Computerized</th>
                    <th className="py-2 px-3">Cadastral Digitized</th>
                    <th className="py-2 px-3">Dispute Index</th>
                    <th className="py-2 px-3 text-right">Policy Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roleSections.state_watch_list?.map((s: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-bold text-slate-800">{s.name}</td>
                      <td className="py-2.5 px-3">{s.dilrmp_ror_pct}%</td>
                      <td className="py-2.5 px-3">{s.cadastral_pct}%</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-amber-700">{s.dispute_index} / 100</span>
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <button
                          onClick={() => {
                            if (onSelectStateForSimulation) {
                              onSelectStateForSimulation(s.name);
                            } else {
                              onNavigate('simulation');
                            }
                          }}
                          className="px-2 py-1 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 rounded border border-amber-300 font-medium text-[11px] transition cursor-pointer"
                        >
                          Simulate Strategy →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-bold text-[#0a2540]">
              <span className="flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-blue-600" />
                <span>Grant Sanctions Queue</span>
              </span>
              <span className="text-[10px] text-slate-400">MoRD Approval</span>
            </div>
            <div className="space-y-3">
              {roleSections.pending_sanctions?.length === 0 ? (
                <p className="text-slate-400 text-center py-4">No proposals awaiting sanction.</p>
              ) : (
                roleSections.pending_sanctions?.map((g: any) => (
                  <div key={g.id} className="p-3 bg-slate-50 border border-slate-200 rounded space-y-1.5">
                    <p className="font-bold text-slate-800 leading-snug">{g.title}</p>
                    <p className="text-[10px] text-slate-500">
                      PI: {g.applicant} • {g.institution}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-bold text-emerald-700 text-[11px]">{g.budget}</span>
                      <button
                        onClick={() => handleSanctionGrant(g.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium text-[10px] cursor-pointer"
                      >
                        Sanction Grant
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. INSTITUTION ADMINISTRATOR SECTION */}
      {isInstitutionAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Institutional Research Projects Registry</span>
              </h3>
              <button 
                onClick={() => onNavigate('projects')}
                className="text-xs text-amber-700 font-semibold hover:underline"
              >
                Manage Projects →
              </button>
            </div>
            <div className="space-y-3">
              {roleSections.institution_projects?.map((proj: any) => (
                <div key={proj.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-800">{proj.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Lead Investigator: <span className="font-semibold text-slate-700">{proj.lead}</span> • Budget: {proj.budget}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Status: <strong className="text-emerald-700 uppercase">{proj.status}</strong> • Tasks: {proj.tasks_count}
                    </p>
                  </div>
                  <button 
                    onClick={() => onNavigate('projects')}
                    className="px-3 py-1.5 bg-[#0a2540] hover:bg-slate-800 text-white rounded text-xs font-semibold cursor-pointer shrink-0"
                  >
                    Review Progress
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-bold text-[#0a2540]">
              <span className="flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Affiliated Faculty & Fellows</span>
              </span>
              <button 
                onClick={() => onNavigate('admin-users')}
                className="text-[10px] text-amber-700 font-semibold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-2">
              {roleSections.institution_members?.map((m: any) => (
                <div key={m.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{m.name}</p>
                    <p className="text-[10px] text-slate-500">{m.department}</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>

            {roleSections.institution_grants?.length > 0 && (
              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-bold text-slate-700 mb-2">Pending Grant Endorsements</h4>
                {roleSections.institution_grants.map((g: any) => (
                  <div key={g.id} className="p-2.5 bg-amber-50/60 border border-amber-200 rounded space-y-1">
                    <p className="font-semibold text-slate-800">{g.proposal}</p>
                    <div className="flex items-center justify-between text-[11px]">
                      <span>{g.budget}</span>
                      <button
                        onClick={() => handleEndorseGrant(g.id)}
                        className="px-2 py-0.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-medium"
                      >
                        Endorse
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. PLATFORM ADMINISTRATOR SECTION */}
      {isPlatformAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Live Security Audit Event Stream</span>
              </h3>
              <button 
                onClick={() => onNavigate('admin-audit')}
                className="text-xs text-amber-700 font-semibold hover:underline"
              >
                Open Full Audit Console →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-900 text-slate-300 font-sans uppercase text-[10px]">
                  <tr>
                    <th className="py-2 px-3">Time</th>
                    <th className="py-2 px-3">Action</th>
                    <th className="py-2 px-3">Initiator</th>
                    <th className="py-2 px-3">Module</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {roleSections.recent_audit_logs?.map((log: any) => (
                    <tr key={log.id} className="hover:bg-slate-50 font-sans">
                      <td className="py-2 px-3 font-mono text-[10px] text-slate-500">{log.time}</td>
                      <td className="py-2 px-3 font-bold text-slate-800">{log.action}</td>
                      <td className="py-2 px-3 text-slate-600 truncate max-w-[150px]">{log.user}</td>
                      <td className="py-2 px-3">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 font-mono text-[10px]">{log.module}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 font-bold text-[#0a2540]">
              <span className="flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                <span>Microservice Health</span>
              </span>
              <span className="text-[10px] text-emerald-700 font-bold">100% ONLINE</span>
            </div>
            <div className="space-y-2.5">
              {roleSections.system_services?.map((svc: any, idx: number) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{svc.name}</p>
                    <p className="text-[10px] text-slate-400">Latency: {svc.latency || 'Under 20ms'}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {svc.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <button 
                onClick={() => onNavigate('admin-users')}
                className="w-full py-2 bg-[#0a2540] hover:bg-slate-800 text-white rounded font-medium text-xs flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 mr-1" />
                <span>Open User Account Directory</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          SHARED NATIONAL BENCHMARKS & STATISTICS (CONSISTENT ACROSS ALL ROLES)
      ========================================================================= */}
      <div className="border-t border-slate-200 pt-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-[#0a2540] flex items-center space-x-2">
              <Scale className="w-5 h-5 text-amber-600" />
              <span>National Land Administration Benchmarks & Trends (DoLR DILRMP)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Shared empirical baseline compiled across 14 state land revenue departments. Consistent across all user roles.
            </p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded bg-slate-100 text-slate-600 font-medium border border-slate-200 self-start md:self-auto">
            Reporting Period: 2024 - 2026
          </span>
        </div>

        {/* 4 Standard National Benchmark Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500">RoR Computerization</span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">{indicators.ror_computerization_national_avg_pct}%</div>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
              National Average
            </span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500">Cadastral Digitization</span>
            <div className="text-2xl font-bold text-[#0a2540] mt-1">{indicators.cadastral_digitization_national_avg_pct}%</div>
            <span className="text-[10px] text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
              Geo-Referenced Parcells
            </span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500">Modern Record Rooms</span>
            <div className="text-2xl font-bold text-blue-700 mt-1">{indicators.modern_record_rooms_pct}%</div>
            <span className="text-[10px] text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
              Tehsil Level Active
            </span>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500">National Dispute Density</span>
            <div className="text-2xl font-bold text-amber-600 mt-1">{indicators.national_dispute_index} / 100</div>
            <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-semibold mt-1 inline-block">
              Revenue Court Burden
            </span>
          </div>
        </div>

        {/* Charts: Land Use Trends & Dispute Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Pan-India Land-Use Trends (2018 - 2024)</h4>
                <p className="text-xs text-slate-500">Million Hectares (Mha) classification over time</p>
              </div>
              <button 
                onClick={() => onNavigate('analytics')}
                className="text-xs text-amber-700 font-semibold hover:underline"
              >
                Deep Analytics →
              </button>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={landUseTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[0, 160]} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="agricultural" name="Agricultural" stackId="1" stroke="#15803d" fill="#86efac" />
                  <Area type="monotone" dataKey="forest" name="Forest Cover" stackId="1" stroke="#047857" fill="#6ee7b7" />
                  <Area type="monotone" dataKey="non_agri_urban" name="Urban / Non-Agri" stackId="1" stroke="#b45309" fill="#fcd34d" />
                  <Area type="monotone" dataKey="barren_fallow" name="Fallow / Barren" stackId="1" stroke="#64748b" fill="#cbd5e1" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4">
            <div>
              <h4 className="font-bold text-slate-800 text-sm">Land Dispute Distribution</h4>
              <p className="text-xs text-slate-500">{disputes.total_revenue_court_cases_pending} Pending Revenue Cases</p>
            </div>
            <div className="space-y-3 pt-2 text-xs">
              {disputes.by_category?.map((c: any, idx: number) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-slate-700 font-medium">
                    <span>{c.category}</span>
                    <span className="font-bold text-slate-900">{c.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${idx === 0 ? 'bg-[#0a2540]' : idx === 1 ? 'bg-amber-500' : 'bg-rose-600'}`} 
                      style={{ width: `${c.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-slate-400">Avg disposal time: {c.avg_months} months</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
              <span className="font-bold text-slate-700">SRISHTI-DRISHTI Satellite Interventions:</span>
              <p className="text-[11px] text-slate-600">{climate.watershed_structures_geotagged} Geo-tagged structures • {climate.carbon_sequestration_potential_mt} MT Carbon sink</p>
            </div>
          </div>
        </div>

        {/* Recent Official Research & Policy Updates */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Recent Research & Policy Directives</span>
            </h4>
            <button 
              onClick={() => onNavigate('repository')}
              className="text-xs text-amber-700 font-semibold hover:underline"
            >
              View Repository →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentUpdates.map((doc: any) => (
              <div key={doc.id} className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                <div className="flex items-center space-x-1.5">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[9px]">
                    SIH {doc.sih_doc_id || '2026'}
                  </span>
                  <span className="text-[10px] text-slate-400">{doc.resource_type}</span>
                </div>
                <h5 className="font-bold text-slate-800 line-clamp-1">{doc.title}</h5>
                <p className="text-[10px] text-slate-500">{doc.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
