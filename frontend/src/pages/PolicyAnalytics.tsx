import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Clock, 
  FileSpreadsheet
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
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { api } from '../services/api';
import { useTranslation } from '../i18n';
import { Card3D } from '../components/ui/Card3D';

interface PolicyAnalyticsProps {
  initialTab?: 'land_use' | 'disputes' | 'acquisition_delays' | 'state_matrix';
  initialFilterState?: string;
}

export const PolicyAnalytics: React.FC<PolicyAnalyticsProps> = ({ 
  initialTab = 'land_use',
  initialFilterState
}) => {
  const { t, language } = useTranslation();
  const isHi = language === 'hi';
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

  const COLORS = ['#34495E', '#6F947B', '#6F9994', '#C5A46D', '#B97872'];

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
        <div className="w-10 h-10 border-4 border-[#34495E]/20 border-t-[#34495E] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Filter and Export Bar */}
      <div className="liquid-glass p-4 rounded-2xl border border-white/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'land_use', label: isHi ? 'भूमि उपयोग परिवर्तन (2018-24)' : 'Land-Use Change (2018-24)' },
            { id: 'disputes', label: isHi ? 'अदालत विवाद डॉकेट्स' : 'Court Dispute Dockets' },
            { id: 'acquisition_delays', label: isHi ? 'विलंब कारक (MoRD 25017)' : 'Delay Factors (MoRD 25017)' },
            { id: 'state_matrix', label: isHi ? 'राज्य प्रदर्शन मैट्रिक्स' : 'State Performance Matrix' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-full font-medium transition cursor-pointer text-xs ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#F5F5F2] to-[#C7CBC7] text-[#080A0A] font-bold shadow-xs'
                  : 'bg-white/5 text-[#A7ADA8] hover:text-[#F2F4EF] hover:bg-white/10 border border-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={exportCSV}
          className="btn-primary-cta px-4 py-2 text-xs flex items-center space-x-1.5 cursor-pointer font-medium"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>{isHi ? "सीएसवी रिपोर्ट निर्यात करें" : "Export CSV Report"}</span>
        </button>
      </div>

      {/* Tab 1: Land-Use Change */}
      {activeTab === 'land_use' && (
        <div className="space-y-6">
          <div className="liquid-glass p-6 rounded-2xl border border-white/10 shadow-sm bg-[#101313]/70">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold text-[#F2F4EF]">
                  {isHi ? "भारत भर में तुलनात्मक भूमि-उपयोग बदलाव (2018 - 2024)" : "Comparative Land-Use Shifts Across India (2018 - 2024)"}
                </h3>
                <p className="text-xs text-[#A7ADA8] mt-0.5">
                  {isHi ? "डेटा स्रोत: कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार" : "Data source: Ministry of Agriculture & Farmers Welfare, Government of India"}
                </p>
              </div>
              <span className="text-[11px] px-3 py-1 bg-[#B7E300]/10 text-[#B7E300] border border-[#B7E300]/30 rounded-full font-semibold font-mono">
                Unit: Million Hectares (Mha)
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trends?.series} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#A7ADA8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#A7ADA8' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151919', borderRadius: '12px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.15)', color: '#F2F4EF', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
                    formatter={(val: any) => [`${val} Mha`]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', color: '#A7ADA8' }} />
                  <Bar dataKey="Agricultural" fill="#B7E300" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Forest" fill="#78C8C8" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Urban_NonAgri" fill="#C7CBC7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Barren_Fallow" fill="#6F7772" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              {trends?.key_insights?.map((insight: string, idx: number) => (
                <Card3D key={idx} maxTilt={5} className="p-3.5 liquid-glass-card rounded-xl border border-white/10 shadow-xs bg-[#151919]/60">
                  <p className="font-bold text-[#B7E300] font-mono">{isHi ? `निष्कर्ष #${idx + 1}` : `Finding #${idx + 1}`}</p>
                  <p className="text-[#A7ADA8] mt-1 leading-relaxed">{insight}</p>
                </Card3D>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Dispute Dockets */}
      {activeTab === 'disputes' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="liquid-glass p-5 rounded-2xl border border-white/10 shadow-sm bg-[#101313]/70">
            <h3 className="text-sm font-bold text-[#F2F4EF] mb-1">
              {isHi ? "कानूनी श्रेणी के अनुसार भूमि विवाद वितरण" : "Distribution of Land Disputes by Legal Category"}
            </h3>
            <p className="text-xs text-[#A7ADA8] mb-4">
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
                    contentStyle={{ backgroundColor: '#151919', borderRadius: '12px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.15)', color: '#F2F4EF', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
                    formatter={(val: any, name: any) => [`${val}%`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 mt-2">
              {disputes?.by_category?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                    <span className="text-[#F2F4EF]">{item.category}</span>
                  </div>
                  <span className="font-bold text-[#B7E300] font-mono">{item.percentage}% (Avg {item.avg_months} mo)</span>
                </div>
              ))}
            </div>
          </div>

          <div className="liquid-glass p-5 rounded-2xl border border-white/10 shadow-sm bg-[#101313]/70">
            <h3 className="text-sm font-bold text-[#F2F4EF] mb-1">
              {isHi ? "राज्य विवाद घनत्व (प्रति 1,000 पार्सल मामले)" : "State Dispute Density (Cases per 1,000 Land Parcels)"}
            </h3>
            <p className="text-xs text-[#A7ADA8] mb-4">
              Higher density indicates greater title uncertainty and presumptive titling friction
            </p>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={disputes?.state_dispute_density} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                  <XAxis dataKey="state" tick={{ fontSize: 10, fill: '#A7ADA8' }} angle={-25} textAnchor="end" />
                  <YAxis tick={{ fontSize: 10, fill: '#A7ADA8' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#151919', borderRadius: '12px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.15)', color: '#F2F4EF', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
                    formatter={(val: any) => [`${val} cases`, 'Per 1,000 Parcels']}
                  />
                  <Bar dataKey="dispute_density_per_1000_parcels" fill="#78C8C8" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Land Acquisition Delay Factors (MoRD 25017) */}
      {activeTab === 'acquisition_delays' && (
        <div className="space-y-6">
          <div className="liquid-glass p-6 rounded-2xl border border-white/10 shadow-sm bg-[#101313]/70">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-[#F2F4EF] flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#C56A9A]" />
                  <span>{isHi ? "भूमि अधिग्रहण विलंब जोखिम चालक (MoRD समस्या विवरण 25017)" : "Land Acquisition Delay Risk Drivers (MoRD Problem Statement 25017)"}</span>
                </h3>
                <p className="text-xs text-[#A7ADA8] mt-0.5">
                  Relative contribution to infrastructure project execution delays under RFCTLARR Act 2013
                </p>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-[#C56A9A]/15 text-[#C56A9A] font-bold border border-[#C56A9A]/30 font-mono">
                MoRD 25017 ML Model
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={delayFactors?.factors} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
                    <XAxis type="number" tick={{ fontSize: 10, fill: '#A7ADA8' }} domain={[0, 0.4]} />
                    <YAxis type="category" dataKey="factor" tick={{ fontSize: 9, fill: '#F2F4EF' }} width={120} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#151919', borderRadius: '12px', fontSize: '11px', border: '1px solid rgba(255,255,255,0.15)', color: '#F2F4EF', boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
                      formatter={(val: any) => [`${(Number(val) * 100).toFixed(0)}%`, 'Weight']}
                    />
                    <Bar dataKey="importance_weight" fill="#C56A9A" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-[#F2F4EF] mb-2">{isHi ? "वैधानिक चरण अवधि तुलना (दिन)" : "Statutory Stage Duration Comparison (Days)"}</h4>
                <div className="space-y-2 text-xs">
                  {delayFactors?.stages_at_risk?.map((stg: any, idx: number) => (
                    <div key={idx} className="p-3 bg-white/[0.03] rounded-xl border border-white/10 flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-[#F2F4EF]">{stg.stage}</p>
                        <p className="text-[10px] text-[#A7ADA8]">Statutory Target: {stg.target_days} days</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#C56A9A]">{stg.avg_completion_days} days</span>
                        <p className="text-[10px] text-[#C56A9A] font-medium font-mono">+{stg.avg_completion_days - stg.target_days}d delay</p>
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
        <div className="liquid-glass rounded-2xl border border-white/10 shadow-sm overflow-hidden bg-[#101313]/70">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#F2F4EF]">
                {isHi ? "अखिल भारतीय राज्य भूमि शासन प्रदर्शन मैट्रिक्स" : "All-India State Land Governance Performance Matrix"}
              </h3>
              <p className="text-xs text-[#A7ADA8] mt-0.5">
                Cross-sectional evaluation of DILRMP components, dispute rates, and risk indices
              </p>
            </div>
            <span className="text-xs text-[#B7E300] bg-[#B7E300]/10 px-3 py-1 rounded-full border border-[#B7E300]/30 font-semibold font-mono">
              Total States Tracked: {states.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-white/[0.03] text-[#F2F4EF] font-bold border-b border-white/10">
                <tr>
                  <th className="px-4 py-3.5">State / UT</th>
                  <th className="px-4 py-3.5">RoR Computerized</th>
                  <th className="px-4 py-3.5">Cadastral Digitized</th>
                  <th className="px-4 py-3.5">Modern Record Rooms</th>
                  <th className="px-4 py-3.5">Dispute Index</th>
                  <th className="px-4 py-3.5">Watershed Interventions</th>
                  <th className="px-4 py-3.5">Delay Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-[#A7ADA8]">
                {states.map((st) => (
                  <tr key={st.id} className="hover:bg-white/[0.03] transition">
                    <td className="px-4 py-3 font-semibold text-[#F2F4EF]">{st.name}</td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-[#B7E300]/10 text-[#B7E300] border border-[#B7E300]/30">
                        {st.dilrmp_ror_pct}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2.5 py-0.5 rounded-full font-bold bg-[#78C8C8]/10 text-[#78C8C8] border border-[#78C8C8]/30">
                        {st.cadastral_digitized_pct}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#F2F4EF]">{st.modern_record_rooms_pct}%</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold px-2 py-0.5 rounded-full ${st.dispute_index > 45 ? 'bg-[#C56A9A]/15 text-[#C56A9A] border border-[#C56A9A]/30' : 'bg-white/5 text-[#A7ADA8]'}`}>
                        {st.dispute_index}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#F2F4EF]">{st.watershed_interventions.toLocaleString()}</td>
                    <td className="px-4 py-3 font-medium text-[#C7CBC7]">{st.land_acquisition_delay_risk}</td>
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
