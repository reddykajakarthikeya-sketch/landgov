import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  TrendingUp, 
  Calendar, 
  Download, 
  Scale, 
  AlertCircle, 
  Clock, 
  FileSpreadsheet,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { api } from '../services/api';

interface PolicyAnalyticsProps {
  initialTab?: 'land_use' | 'disputes' | 'acquisition_delays' | 'state_matrix';
  initialFilterState?: string;
}

export const PolicyAnalytics: React.FC<PolicyAnalyticsProps> = ({ 
  initialTab = 'land_use',
  initialFilterState
}) => {
  const [trends, setTrends] = useState<any>(null);
  const [disputes, setDisputes] = useState<any>(null);
  const [delayFactors, setDelayFactors] = useState<any>(null);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'land_use' | 'disputes' | 'acquisition_delays' | 'state_matrix'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [trendRes, disputeRes, delayRes, stateRes] = await Promise.all([
          api.getLandUseTrends(),
          api.getDisputeMetrics(),
          api.getDelayRiskFactors(),
          api.getGisStates()
        ]);
        setTrends(trendRes);
        setDisputes(disputeRes);
        setDelayFactors(delayRes);
        setStates(stateRes.data || []);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const COLORS = ['#0a2540', '#15803d', '#d97706', '#0284c7', '#dc2626'];

  function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (activeTab === 'land_use') {
      csvContent += "Year,Agricultural (Mha),Forest (Mha),Urban / Non-Agri (Mha),Barren / Fallow (Mha)\n";
      trends?.series?.forEach((row: any) => {
        csvContent += `${row.year},${row.Agricultural},${row.Forest},${row.Urban_NonAgri},${row.Barren_Fallow}\n`;
      });
    } else if (activeTab === 'disputes') {
      csvContent += "Category,Percentage,Average Resolution Months\n";
      disputes?.by_category?.forEach((row: any) => {
        csvContent += `"${row.category}",${row.percentage}%,${row.avg_months}\n`;
      });
    } else {
      csvContent += "State,RoR Computerization %,Cadastral Digitized %,Modern Record Rooms %,Dispute Index\n";
      states.forEach((row: any) => {
        csvContent += `"${row.name}",${row.dilrmp_ror_pct}%,${row.cadastral_digitized_pct}%,${row.modern_record_rooms_pct}%,${row.dispute_index}\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `land_governance_${activeTab}_analytics.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-[#0a2540] border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Filter and Export Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'land_use', label: 'Land-Use Change (2018-24)' },
            { id: 'disputes', label: 'Court Dispute Dockets' },
            { id: 'acquisition_delays', label: 'Delay Factors (MoRD 25017)' },
            { id: 'state_matrix', label: 'State Performance Matrix' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                activeTab === tab.id
                  ? 'bg-[#0a2540] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={exportCSV}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-md transition flex items-center space-x-1.5"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
          <span>Export CSV Report</span>
        </button>
      </div>

      {/* Tab 1: Land-Use Change */}
      {activeTab === 'land_use' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#0a2540]">
                  Comparative Land-Use Shifts Across India (2018 - 2024)
                </h3>
                <p className="text-xs text-slate-500">
                  Data source: Ministry of Agriculture & Farmers Welfare, Government of India
                </p>
              </div>
              <span className="text-[11px] px-2.5 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded font-medium">
                Unit: Million Hectares (Mha)
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends?.series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                    formatter={(val: any) => [`${val} Mha`]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Agricultural" fill="#15803d" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Forest" fill="#0284c7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Urban_NonAgri" fill="#d97706" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Barren_Fallow" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              {trends?.key_insights?.map((insight: string, idx: number) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="font-semibold text-slate-800">Finding #{idx + 1}</p>
                  <p className="text-slate-600 mt-1 leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dispute Dockets */}
      {activeTab === 'disputes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-[#0a2540] mb-1">
              Distribution of Land Disputes by Legal Category
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              NJDG Benchmarking across 4.82 Million pending revenue dockets
            </p>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={disputes?.by_category}
                    dataKey="percentage"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label={({ percent }: any) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {disputes?.by_category?.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                    formatter={(val: any, name: any) => [`${val}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 mt-2">
              {disputes?.by_category?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs p-1.5 rounded hover:bg-slate-50">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="text-slate-700">{item.category}</span>
                  </div>
                  <span className="font-bold text-slate-800">{item.percentage}% (Avg {item.avg_months} mo)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
            <h3 className="text-sm font-bold text-[#0a2540] mb-1">
              State Dispute Density (Cases per 1,000 Land Parcels)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Higher density indicates greater title uncertainty and presumptive titling friction
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={disputes?.state_dispute_density} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="state" tick={{ fontSize: 10 }} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                    formatter={(val: any) => [`${val} cases`, 'Per 1,000 Parcels']}
                  />
                  <Bar dataKey="dispute_density_per_1000_parcels" fill="#d97706" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Land Acquisition Delay Factors (MoRD 25017) */}
      {activeTab === 'acquisition_delays' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-rose-600" />
                  <span>Land Acquisition Delay Risk Drivers (MoRD Problem Statement 25017)</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Relative contribution to infrastructure project execution delays under RFCTLARR Act 2013
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-rose-50 text-rose-800 font-bold border border-rose-200">
                MoRD 25017 ML Model
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={delayFactors?.factors} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 10 }} domain={[0, 0.4]} />
                    <YAxis type="category" dataKey="factor" tick={{ fontSize: 9 }} width={120} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', fontSize: '11px', border: '1px solid #e2e8f0' }}
                      formatter={(val: any) => [`${(Number(val) * 100).toFixed(0)}%`, 'Weight']}
                    />
                    <Bar dataKey="importance_weight" fill="#dc2626" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Statutory Stage Duration Comparison (Days)</h4>
                <div className="space-y-2 text-xs">
                  {delayFactors?.stages_at_risk?.map((stg: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-50 rounded border border-slate-200 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-800">{stg.stage}</p>
                        <p className="text-[10px] text-slate-500">Statutory Target: {stg.target_days} days</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-rose-700">{stg.avg_completion_days} days</span>
                        <p className="text-[10px] text-rose-600 font-medium">+{stg.avg_completion_days - stg.target_days}d delay</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: State Performance Matrix */}
      {activeTab === 'state_matrix' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#0a2540]">
                All-India State Land Governance Performance Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Cross-sectional evaluation of DILRMP components, dispute rates, and risk indices
              </p>
            </div>
            <span className="text-xs text-slate-500">Total States Tracked: {states.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">State / UT</th>
                  <th className="px-4 py-3">RoR Computerized</th>
                  <th className="px-4 py-3">Cadastral Digitized</th>
                  <th className="px-4 py-3">Modern Record Rooms</th>
                  <th className="px-4 py-3">Dispute Index</th>
                  <th className="px-4 py-3">Watershed Interventions</th>
                  <th className="px-4 py-3">Delay Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {states.map((st) => (
                  <tr key={st.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-2.5 font-semibold text-slate-900">{st.name}</td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded font-medium bg-emerald-50 text-emerald-800">
                        {st.dilrmp_ror_pct}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded font-medium bg-blue-50 text-blue-800">
                        {st.cadastral_digitized_pct}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5">{st.modern_record_rooms_pct}%</td>
                    <td className="px-4 py-2.5">
                      <span className={`font-semibold ${st.dispute_index > 45 ? 'text-rose-700' : 'text-slate-700'}`}>
                        {st.dispute_index}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">{st.watershed_interventions.toLocaleString()}</td>
                    <td className="px-4 py-2.5">{st.land_acquisition_delay_risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
