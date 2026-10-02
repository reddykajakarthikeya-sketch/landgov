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
  AlertCircle, 
  CheckCircle2, 
  Scale, 
  Trees, 
  Clock, 
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  FileText
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

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export const NationalDashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await api.getDashboardOverview();
        setData(res);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 border-4 border-[#0a2540] border-t-amber-500 rounded-full animate-spin"></div>
          <p className="text-xs font-medium text-slate-500">Loading National Land Governance Data...</p>
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

  return (
    <div className="space-y-6">
      {/* Official SIH Integration Notice Banner */}
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
            onClick={() => onNavigate('datasets')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md transition flex items-center space-x-1"
          >
            <Database className="w-3.5 h-3.5 mr-1" />
            <span>View Dataset Console</span>
          </button>
          <button
            onClick={() => onNavigate('repository')}
            className="px-3 py-1.5 bg-[#0a2540] hover:bg-[#1e3a5f] text-white text-xs font-semibold rounded-md transition flex items-center space-x-1"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1" />
            <span>Open Repository</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Research Publications', value: counts.research_publications, icon: BookOpen, color: 'text-blue-700', bg: 'bg-blue-50', tab: 'repository' },
          { label: 'Available Datasets', value: counts.available_datasets, icon: Database, color: 'text-emerald-700', bg: 'bg-emerald-50', tab: 'datasets' },
          { label: 'Active Projects', value: counts.active_projects, icon: FolderKanban, color: 'text-amber-700', bg: 'bg-amber-50', tab: 'projects' },
          { label: 'Policy Experiments', value: counts.policy_experiments, icon: Sliders, color: 'text-indigo-700', bg: 'bg-indigo-50', tab: 'simulation' },
          { label: 'Participating Institutes', value: counts.participating_institutions, icon: Building2, color: 'text-cyan-700', bg: 'bg-cyan-50', tab: 'scope-of-study' },
          { label: 'Registered Experts', value: counts.registered_experts, icon: Users, color: 'text-rose-700', bg: 'bg-rose-50', tab: 'projects' },
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx} 
              onClick={() => onNavigate(kpi.tab)}
              className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs hover:border-slate-300 hover:shadow-sm transition cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`p-2 rounded-md ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition" />
              </div>
              <p className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition">
                {kpi.value}
              </p>
              <p className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                {kpi.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* DILRMP National Land Modernization Progress Cards */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Digital India Land Records Modernization Programme (DILRMP) Benchmarks</span>
            </h3>
            <p className="text-xs text-slate-500">
              National status across 740+ districts under Department of Land Resources (DoLR), MoRD
            </p>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
            Source: DILRMP Master Database 2026
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-700">RoR Computerization</span>
              <span className="font-bold text-emerald-700">{indicators.ror_computerization_national_avg_pct}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${indicators.ror_computerization_national_avg_pct}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">97.8% of revenue villages computerized</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Cadastral Digitization</span>
              <span className="font-bold text-blue-700">{indicators.cadastral_digitization_national_avg_pct}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${indicators.cadastral_digitization_national_avg_pct}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">Spatial vectorization of revenue maps</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Modern Record Rooms</span>
              <span className="font-bold text-purple-700">{indicators.modern_record_rooms_pct}%</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${indicators.modern_record_rooms_pct}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">Tehsil-level digital archives deployed</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="font-semibold text-slate-700">Dispute Density Index</span>
              <span className="font-bold text-amber-700">{indicators.national_dispute_index} / 100</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${indicators.national_dispute_index}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1.5">Target: &lt; 20 with conclusive titling</p>
          </div>
        </div>
      </div>

      {/* Main Visualizations: Land Use Trends & State Comparisons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Land-Use Trends (2018-2024) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <span>Pan-India Land-Use & Land-Cover Shift (2018 - 2024)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Trends in Million Hectares (Mha) — Ministry of Agriculture & MoRD Statistics
              </p>
            </div>
            <button 
              onClick={() => onNavigate('analytics')}
              className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center space-x-1"
            >
              <span>Detailed Analytics</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={landUseTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="agriGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#15803d" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#15803d" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="forestGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="urbanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={[20, 150]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                  formatter={(val: any, name: any) => [`${val} Mha`, name]}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="agricultural" name="Agricultural Land" stroke="#15803d" fillOpacity={1} fill="url(#agriGrad)" />
                <Area type="monotone" dataKey="forest" name="Forest Cover" stroke="#0284c7" fillOpacity={1} fill="url(#forestGrad)" />
                <Area type="monotone" dataKey="non_agri_urban" name="Built-Up / Non-Agri" stroke="#d97706" fillOpacity={1} fill="url(#urbanGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 p-2 bg-slate-50 rounded text-[11px] text-slate-600 flex items-center justify-between">
            <span><strong>Policy Observation:</strong> Agricultural net area contracted by 2.5 Mha due to peri-urban sprawl.</span>
            <span className="text-amber-800 font-semibold cursor-pointer" onClick={() => onNavigate('simulation')}>Simulate 2035 Horizon →</span>
          </div>
        </div>

        {/* State-Wise DILRMP Comparison Chart */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>State DILRMP Digitization %</span>
              </h3>
              <button 
                onClick={() => onNavigate('gis-explorer')} 
                className="text-xs text-blue-700 font-semibold hover:underline"
              >
                Map View
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Top performing state cadastral digitization benchmarks
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stateComparisons.slice(0, 6)} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis type="number" domain={[70, 100]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={75} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                    formatter={(val: any) => [`${val}%`, 'Digitized']}
                  />
                  <Bar dataKey="cadastral_digitized_pct" fill="#0a2540" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 text-right pt-2 border-t border-slate-100">
            Click map for all 36 States & UTs
          </div>
        </div>
      </div>

      {/* Secondary Metrics: Climate Resilience & Dispute Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Climate & Watershed Metrics (Problem Statement 26015) */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
                <Trees className="w-4 h-4 text-emerald-600" />
                <span>Climate Resilience & Watershed Monitoring (MoRD 26015)</span>
              </h3>
              <p className="text-xs text-slate-500">
                Satellite spatial indicators derived from Bhuvan & SRISHTI-DRISHTI platform
              </p>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
              30m Satellite Ingested
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-slate-500 font-medium">Degradation Neutrality</p>
              <p className="text-lg font-bold text-slate-900 mt-1">{climate.land_degradation_neutrality_progress_pct}%</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Target: 100% by 2030 (SDG 15.3)</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-slate-500 font-medium">Soil Moisture Restoration</p>
              <p className="text-lg font-bold text-emerald-700 mt-1">{climate.soil_moisture_restoration_hectares}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Across rainfed agricultural basins</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-slate-500 font-medium">Geotagged Check Dams</p>
              <p className="text-lg font-bold text-blue-700 mt-1">{climate.watershed_structures_geotagged?.toLocaleString()}</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Verified on Bhuvan portal</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-slate-500 font-medium">Carbon Sink Potential</p>
              <p className="text-lg font-bold text-teal-700 mt-1">{climate.carbon_sequestration_potential_mt} MT</p>
              <p className="text-[10px] text-slate-400 mt-0.5">CO2 equivalent annual capacity</p>
            </div>
          </div>
        </div>

        {/* Dispute Resolution Statistics */}
        <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
                <Scale className="w-4 h-4 text-amber-600" />
                <span>Revenue Court Land Dispute Statistics</span>
              </h3>
              <p className="text-xs text-slate-500">
                Benchmarked litigation dockets from National Judicial Data Grid (NJDG)
              </p>
            </div>
            <button 
              onClick={() => onNavigate('analytics')} 
              className="text-xs text-blue-700 font-semibold hover:underline"
            >
              Analyze Trends
            </button>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center p-2.5 bg-amber-50/60 rounded border border-amber-200/60">
              <div>
                <p className="font-semibold text-amber-900">Total Pending Revenue Court Dockets</p>
                <p className="text-[10px] text-amber-700">Average resolution duration: {disputes.avg_disposal_time_months} months</p>
              </div>
              <span className="text-base font-extrabold text-amber-900">{disputes.total_revenue_court_cases_pending}</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-600">
                <span>Co-parcenary & Inheritance Partition Suits</span>
                <span className="font-bold">{disputes.title_and_inheritance_pct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-1.5 rounded-full" style={{ width: `${disputes.title_and_inheritance_pct}%` }}></div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                <span>Cadastral Boundary Encroachment & Survey Contests</span>
                <span className="font-bold">{disputes.boundary_and_encroachment_pct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${disputes.boundary_and_encroachment_pct}%` }}></div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-600 pt-1">
                <span>Statutory Land Acquisition Compensation Appeals</span>
                <span className="font-bold">{disputes.acquisition_compensation_appeals_pct}%</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-rose-600 h-1.5 rounded-full" style={{ width: `${disputes.acquisition_compensation_appeals_pct}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Research Publications and Policy Directives */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Recent Research & Policy Publications</span>
            </h3>
            <p className="text-xs text-slate-500">
              Access official MoRD problem statements and empirical studies from the repository
            </p>
          </div>
          <button 
            onClick={() => onNavigate('repository')}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 flex items-center space-x-1"
          >
            <span>Explore All Publications</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentUpdates.map((item: any) => (
            <div 
              key={item.id}
              onClick={() => onNavigate('repository')}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/80 px-2 rounded-md transition cursor-pointer group"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded bg-slate-100 text-slate-600 group-hover:bg-[#0a2540] group-hover:text-white transition shrink-0 mt-0.5">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                      {item.title}
                    </h4>
                    {item.is_sih_official && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold shrink-0">
                        Official SIH {item.sih_doc_id}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {item.organization} • {item.publication_year} • Type: <span className="capitalize">{item.resource_type.replace('_', ' ')}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <span className="text-xs text-blue-600 font-medium group-hover:underline">Read Document</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
