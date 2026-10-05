import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Save, 
  CheckCircle2, 
  Info, 
  Scale, 
  Trees, 
  Wheat, 
  Factory 
} from 'lucide-react';
import { api } from '../services/api';
import { PolicyScenarioInputs, SimulationOutputs } from '../types';
import { useTranslation } from '../i18n';
import { Card3D } from '../components/ui/Card3D';

interface PolicySimulationLabProps {
  initialState?: string;
}

export const PolicySimulationLab: React.FC<PolicySimulationLabProps> = ({ initialState }) => {
  const { t, language } = useTranslation();
  const isHi = language === 'hi';
  const [inputs, setInputs] = useState<PolicyScenarioInputs>({
    title: 'Balanced Agri-Industrial Growth 2035',
    description: 'Balancing highway corridor development with strict prime agricultural land preservation.',
    state: initialState && initialState !== 'All India' ? initialState : 'National Average',
    base_year: 2024,
    target_year: 2035,
    urban_expansion_rate_pct: 3.2,
    agri_land_protection_pct: 85.0,
    forest_conservation_pct: 95.0,
    industrial_corridor_hectares: 15000.0,
    solar_renewable_hectares: 12000.0,
    waterbody_buffer_meters: 100.0
  });

  const [outputs, setOutputs] = useState<SimulationOutputs | null>(null);
  const [loading, setLoading] = useState(false);
  const [savedScenarios, setSavedScenarios] = useState<any[]>([]);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (initialState && initialState !== 'All India' && initialState !== 'National Average') {
      setInputs(prev => ({
        ...prev,
        state: initialState,
        title: `${initialState} Sustainable Growth Strategy 2035`
      }));
    }
  }, [initialState]);

  // Recalculate on input changes
  useEffect(() => {
    runCalculation();
  }, [
    inputs.state,
    inputs.base_year,
    inputs.target_year,
    inputs.urban_expansion_rate_pct,
    inputs.agri_land_protection_pct,
    inputs.forest_conservation_pct,
    inputs.industrial_corridor_hectares,
    inputs.solar_renewable_hectares,
    inputs.waterbody_buffer_meters
  ]);

  useEffect(() => {
    loadSavedScenarios();
  }, []);

  async function loadSavedScenarios() {
    try {
      const res = await api.getSavedScenarios();
      setSavedScenarios(res || []);
    } catch (err) {
      console.error('Failed to load saved scenarios:', err);
    }
  }

  async function runCalculation() {
    setLoading(true);
    try {
      const res = await api.calculateSimulation(inputs);
      setOutputs(res.outputs);
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    try {
      await api.saveScenario(inputs);
      setSaveSuccess(true);
      loadSavedScenarios();
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      alert('Failed to save scenario.');
    }
  }

  const handleLoadScenario = (sc: any) => {
    setInputs({
      title: sc.title,
      description: sc.description || '',
      state: sc.state || 'National Average',
      base_year: sc.base_year || 2024,
      target_year: sc.target_year || 2035,
      urban_expansion_rate_pct: sc.urban_expansion_rate_pct ?? 3.2,
      agri_land_protection_pct: sc.agri_land_protection_pct ?? 85.0,
      forest_conservation_pct: sc.forest_conservation_pct ?? 95.0,
      industrial_corridor_hectares: sc.industrial_corridor_hectares ?? 15000.0,
      solar_renewable_hectares: sc.solar_renewable_hectares ?? 12000.0,
      waterbody_buffer_meters: sc.waterbody_buffer_meters ?? 100.0
    });
  };

  return (
    <div className="space-y-6">
      {/* Transparency & Model Limitation Disclaimer */}
      <div className="liquid-glass border border-white/10 border-l-4 border-l-[#B7E300] p-4 rounded-2xl shadow-md flex items-start space-x-3 text-xs bg-[#B7E300]/5">
        <Info className="w-5 h-5 text-[#B7E300] shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-[#F2F4EF] text-sm">
            {isHi ? "पारदर्शी नियम-आधारित सिमुलेशन इंजन (मूल्यांकन मॉडल)" : "Transparent Rule-Based Simulation Engine (Evaluation Model)"}
          </h4>
          <p className="text-[#A7ADA8] mt-1 leading-relaxed">
            {isHi 
              ? "सभी अर्थमितीय, विवाद जोखिम और पारिस्थितिक सूत्र नीचे स्पष्ट रूप से प्रस्तुत किए गए हैं। ये गणनाएं नीतिगत प्रयोगों हेतु तुलनात्मक निर्णय-समर्थन अनुमान के रूप में कार्य करती हैं।"
              : "All econometric, dispute risk, and ecological formulas are explicitly presented below. These calculations serve as comparative decision-support projections for policy experimentation and do not represent statutory land appraisal forecasts."}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column (Sliders & Parameters) */}
        <div className="lg:col-span-1 liquid-glass p-5 rounded-2xl border border-white/10 shadow-md space-y-4 text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <span className="font-bold text-[#F2F4EF] flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#B7E300]" />
              <span>{isHi ? "नीतिगत उत्तोलक एवं इनपुट" : "Policy Levers & Inputs"}</span>
            </span>
            <span className="text-[10px] text-[#B7E300] bg-[#B7E300]/10 border border-[#B7E300]/30 px-2 py-0.5 rounded-full font-mono">{isHi ? "इंटरएक्टिव" : "Interactive"}</span>
          </div>

          <div>
            <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "परिदृश्य शीर्षक" : "Scenario Title"}</label>
            <input
              type="text"
              value={inputs.title}
              onChange={(e) => setInputs({ ...inputs, title: e.target.value })}
              className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] font-medium placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "भौगोलिक फोकस" : "Geographic Focus"}</label>
              <select
                value={inputs.state}
                onChange={(e) => setInputs({ ...inputs, state: e.target.value })}
                className="w-full px-2.5 py-2 bg-[#151919] border border-white/10 rounded-xl font-medium text-[#F2F4EF] focus:outline-none focus:border-[#B7E300]/50"
              >
                <option value="National Average">{isHi ? "अखिल भारतीय औसत" : "Pan-India Average"}</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "क्षितिज वर्ष" : "Horizon Year"}</label>
              <select
                value={inputs.target_year}
                onChange={(e) => setInputs({ ...inputs, target_year: Number(e.target.value) })}
                className="w-full px-2.5 py-2 bg-[#151919] border border-white/10 rounded-xl font-medium text-[#F2F4EF] focus:outline-none focus:border-[#B7E300]/50"
              >
                <option value={2030}>2030 (6 Years)</option>
                <option value={2035}>2035 (11 Years)</option>
                <option value={2040}>2040 (16 Years)</option>
              </select>
            </div>
          </div>

          {/* Slider 1: Urban Expansion */}
          <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex justify-between items-center">
              <span className="font-medium text-[#A7ADA8]">{isHi ? "शहरी विस्तार दर:" : "Urban Expansion Rate:"}</span>
              <span className="font-bold text-[#F2F4EF]">{inputs.urban_expansion_rate_pct}% / yr</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={7.0}
              step={0.1}
              value={inputs.urban_expansion_rate_pct}
              onChange={(e) => setInputs({ ...inputs, urban_expansion_rate_pct: parseFloat(e.target.value) })}
              className="w-full accent-[#B7E300] cursor-pointer"
            />
            <p className="text-[10px] text-[#6F7772]">{isHi ? "आधाररेखा राष्ट्रीय प्रवृत्ति: 3.2% वार्षिक" : "Baseline national trend: 3.2% annually"}</p>
          </div>

          {/* Slider 2: Agricultural Land Protection */}
          <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex justify-between items-center">
              <span className="font-medium text-[#A7ADA8]">{isHi ? "कृषि भूमि संरक्षण लक्ष्य:" : "Agri Land Protection Target:"}</span>
              <span className="font-bold text-[#B7E300]">{inputs.agri_land_protection_pct}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              step={1}
              value={inputs.agri_land_protection_pct}
              onChange={(e) => setInputs({ ...inputs, agri_land_protection_pct: parseFloat(e.target.value) })}
              className="w-full accent-[#B7E300] cursor-pointer"
            />
            <p className="text-[10px] text-[#6F7772]">{isHi ? "बहु-फसली कृषि भूमि को गैर-कृषि ज़ोनिंग से बचाता है" : "Protects multi-cropped farmland from non-agri zoning"}</p>
          </div>

          {/* Slider 3: Forest Conservation */}
          <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex justify-between items-center">
              <span className="font-medium text-[#A7ADA8]">{isHi ? "वन संरक्षण सीमा:" : "Forest Conservation Threshold:"}</span>
              <span className="font-bold text-[#78C8C8]">{inputs.forest_conservation_pct}%</span>
            </div>
            <input
              type="range"
              min={70}
              max={100}
              step={1}
              value={inputs.forest_conservation_pct}
              onChange={(e) => setInputs({ ...inputs, forest_conservation_pct: parseFloat(e.target.value) })}
              className="w-full accent-[#78C8C8] cursor-pointer"
            />
          </div>

          {/* Slider 4: Industrial Land Corridor Allocation */}
          <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex justify-between items-center">
              <span className="font-medium text-[#A7ADA8]">{isHi ? "औद्योगिक कॉरिडोर भूमि:" : "Industrial Corridor Land:"}</span>
              <span className="font-bold text-[#F2F4EF]">{inputs.industrial_corridor_hectares.toLocaleString()} ha</span>
            </div>
            <input
              type="range"
              min={2000}
              max={50000}
              step={1000}
              value={inputs.industrial_corridor_hectares}
              onChange={(e) => setInputs({ ...inputs, industrial_corridor_hectares: parseFloat(e.target.value) })}
              className="w-full accent-[#C7CBC7] cursor-pointer"
            />
          </div>

          {/* Slider 5: Solar & Renewable Energy */}
          <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex justify-between items-center">
              <span className="font-medium text-[#A7ADA8]">{isHi ? "सौर एवं नवीकरणीय ऊर्जा पार्क:" : "Solar & Renewable Parks:"}</span>
              <span className="font-bold text-[#B7E300]">{inputs.solar_renewable_hectares.toLocaleString()} ha</span>
            </div>
            <input
              type="range"
              min={1000}
              max={30000}
              step={500}
              value={inputs.solar_renewable_hectares}
              onChange={(e) => setInputs({ ...inputs, solar_renewable_hectares: parseFloat(e.target.value) })}
              className="w-full accent-[#B7E300] cursor-pointer"
            />
          </div>

          {/* Slider 6: Waterbody Buffer Strip */}
          <div className="space-y-1.5 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div className="flex justify-between items-center">
              <span className="font-medium text-[#A7ADA8]">{isHi ? "जल निकाय बफर अनुपालन:" : "Waterbody Buffer Compliance:"}</span>
              <span className="font-bold text-[#78C8C8]">{inputs.waterbody_buffer_meters} {isHi ? "मीटर" : "meters"}</span>
            </div>
            <input
              type="range"
              min={20}
              max={250}
              step={10}
              value={inputs.waterbody_buffer_meters}
              onChange={(e) => setInputs({ ...inputs, waterbody_buffer_meters: parseFloat(e.target.value) })}
              className="w-full accent-[#78C8C8] cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="btn-primary-cta w-full py-2.5 text-xs flex items-center justify-center space-x-1.5 cursor-pointer font-medium"
            >
              <Save className="w-4 h-4" />
              <span>{saveSuccess ? (isHi ? 'परिदृश्य सहेजा गया!' : 'Saved Scenario!') : (isHi ? 'परिदृश्य सहेजें' : 'Save Scenario')}</span>
            </button>
          </div>
        </div>

        {/* Results & Mathematical Provenance Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Key Simulation Outputs Grid with 3D Tilt */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
            {/* 1. Food Security Index */}
            <Card3D maxTilt={3} className="liquid-glass-card p-4 rounded-2xl border border-white/10 bg-[#151919]/60">
              <div className="flex items-center justify-between text-xs text-[#A7ADA8]">
                <span>{isHi ? 'खाद्य सुरक्षा लचीलापन' : 'Food Security Index'}</span>
                <Wheat className="w-4 h-4 text-[#B7E300]" />
              </div>
              <p className="text-2xl font-bold text-[#F2F4EF] mt-1">
                {outputs?.simulated_food_security_index} <span className="text-xs font-normal text-[#A7ADA8]">/ 100</span>
              </p>
              <p className={`text-[11px] font-semibold mt-1 ${
                (outputs?.deltas_vs_baseline?.food_security_pct || 0) >= 0 ? 'text-[#B7E300]' : 'text-[#C56A9A]'
              }`}>
                {(outputs?.deltas_vs_baseline?.food_security_pct || 0) >= 0 ? '+' : ''}
                {outputs?.deltas_vs_baseline?.food_security_pct}% {isHi ? 'आधाररेखा से' : 'vs Baseline'}
              </p>
            </Card3D>

            {/* 2. Carbon Sink MT */}
            <Card3D maxTilt={3} className="liquid-glass-card p-4 rounded-2xl border border-white/10 bg-[#151919]/60">
              <div className="flex items-center justify-between text-xs text-[#A7ADA8]">
                <span>{isHi ? 'कार्बन सिंक क्षमता' : 'Carbon Sink Potential'}</span>
                <Trees className="w-4 h-4 text-[#78C8C8]" />
              </div>
              <p className="text-2xl font-bold text-[#F2F4EF] mt-1">
                {outputs?.simulated_carbon_sink_mt} <span className="text-xs font-normal text-[#A7ADA8]">MT</span>
              </p>
              <p className={`text-[11px] font-semibold mt-1 ${
                (outputs?.deltas_vs_baseline?.carbon_sink_pct || 0) >= 0 ? 'text-[#78C8C8]' : 'text-[#C56A9A]'
              }`}>
                {(outputs?.deltas_vs_baseline?.carbon_sink_pct || 0) >= 0 ? '+' : ''}
                {outputs?.deltas_vs_baseline?.carbon_sink_pct}% {isHi ? 'आधाररेखा से' : 'vs Baseline'}
              </p>
            </Card3D>

            {/* 3. Economic Gross Output */}
            <Card3D maxTilt={3} className="liquid-glass-card p-4 rounded-2xl border border-white/10 bg-[#151919]/60">
              <div className="flex items-center justify-between text-xs text-[#A7ADA8]">
                <span>{isHi ? 'आर्थिक उत्पादन' : 'Economic Output'}</span>
                <Factory className="w-4 h-4 text-[#C7CBC7]" />
              </div>
              <p className="text-2xl font-bold text-[#F2F4EF] mt-1">
                ₹{Math.round((outputs?.simulated_economic_output_cr || 0) / 1000)}k <span className="text-xs font-normal text-[#A7ADA8]">Cr</span>
              </p>
              <p className="text-[11px] font-semibold text-[#B7E300] mt-1">
                +{outputs?.deltas_vs_baseline?.economic_output_pct}% {isHi ? 'औद्योगिक संवर्धन' : 'Industrial Boost'}
              </p>
            </Card3D>

            {/* 4. Dispute Risk Index */}
            <Card3D maxTilt={3} className="liquid-glass-card p-4 rounded-2xl border border-white/10 bg-[#151919]/60">
              <div className="flex items-center justify-between text-xs text-[#A7ADA8]">
                <span>{isHi ? 'भूमि विवाद जोखिम' : 'Dispute Risk Probability'}</span>
                <Scale className="w-4 h-4 text-[#C56A9A]" />
              </div>
              <p className="text-2xl font-bold text-[#F2F4EF] mt-1">
                {outputs?.simulated_dispute_risk_index} <span className="text-xs font-normal text-[#A7ADA8]">/ 100</span>
              </p>
              <p className={`text-[11px] font-semibold mt-1 ${
                (outputs?.deltas_vs_baseline?.dispute_risk_pct || 0) <= 0 ? 'text-[#B7E300]' : 'text-[#C56A9A]'
              }`}>
                {(outputs?.deltas_vs_baseline?.dispute_risk_pct || 0) >= 0 ? '+' : ''}
                {outputs?.deltas_vs_baseline?.dispute_risk_pct}% {isHi ? 'आधाररेखा से' : 'vs Baseline'}
              </p>
            </Card3D>

            {/* 5. Groundwater Extraction Stress */}
            <Card3D maxTilt={2} className="liquid-glass-card p-4 rounded-2xl border border-white/10 bg-[#151919]/60 col-span-2 md:col-span-2">
              <div className="flex items-center justify-between text-xs text-[#A7ADA8]">
                <span>{isHi ? 'भूजल निष्कर्षण तनाव सूचकांक' : 'Aquifer Groundwater Stress Index'}</span>
                <span className="font-bold text-[#F2F4EF]">{outputs?.groundwater_stress_index} / 100</span>
              </div>
              <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden mt-2">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    (outputs?.groundwater_stress_index || 0) > 70 ? 'bg-[#C56A9A]' : (outputs?.groundwater_stress_index || 0) > 40 ? 'bg-[#78C8C8]' : 'bg-[#B7E300]'
                  }`}
                  style={{ width: `${outputs?.groundwater_stress_index || 0}%` }}
                />
              </div>
              <p className="text-[10px] text-[#A7ADA8] mt-2 font-mono">
                {isHi 
                  ? `तटीय बफर अनुपालन द्वारा शमित (${inputs.waterbody_buffer_meters}मी बफर लागू)।` 
                  : `Mitigated by riparian buffer strip compliance (${inputs.waterbody_buffer_meters}m buffer applied).`}
              </p>
            </Card3D>
          </div>

          {/* Explicit Formulas & Assumptions Card */}
          <div className="liquid-glass p-5 rounded-2xl border border-white/10 shadow-md space-y-3.5 text-xs">
            <h4 className="font-bold text-[#F2F4EF] text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-[#B7E300]" />
              <span>{isHi ? "पारदर्शी मॉडल समीकरण और गुणांक" : "Transparent Model Equations & Coefficients"}</span>
            </h4>

            <div className="space-y-1.5 font-mono text-[11px] bg-black/40 text-[#F2F4EF] p-3.5 rounded-xl overflow-x-auto border border-white/10">
              <p><span className="text-[#B7E300] font-bold">Food_Security =</span> {outputs?.formulas?.food_security_model}</p>
              <p><span className="text-[#78C8C8] font-bold">Carbon_Sink =</span> {outputs?.formulas?.carbon_sink_model}</p>
              <p><span className="text-[#C7CBC7] font-bold">Economic_GDP =</span> {outputs?.formulas?.economic_impact_model}</p>
              <p><span className="text-[#C56A9A] font-bold">Dispute_Risk =</span> {outputs?.formulas?.dispute_risk_model}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <p className="font-bold text-[#F2F4EF]">{isHi ? "मॉडल मान्यताएं:" : "Model Assumptions:"}</p>
                <ul className="list-disc pl-4 text-[#A7ADA8] space-y-0.5 text-[11px]">
                  {outputs?.assumptions?.map((ass, i) => (
                    <li key={i}>{ass}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1 p-3 rounded-xl bg-white/[0.03] border border-white/10">
                <p className="font-bold text-[#78C8C8]">{isHi ? "पद्धतिगत सीमाएं:" : "Methodological Limitations:"}</p>
                <ul className="list-disc pl-4 text-[#A7ADA8] space-y-0.5 text-[11px]">
                  {outputs?.limitations?.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Saved Scenarios History */}
          {savedScenarios.length > 0 && (
            <div className="liquid-glass p-5 rounded-2xl border border-white/10 shadow-md text-xs space-y-3">
              <h4 className="font-bold text-[#F2F4EF]">{isHi ? "सहेजी गई परिदृश्य लाइब्रेरी" : "Saved Scenario Library"} ({savedScenarios.length})</h4>
              <div className="divide-y divide-white/10 max-h-44 overflow-y-auto">
                {savedScenarios.map((sc) => (
                  <div key={sc.id} className="py-2.5 flex items-center justify-between text-[#A7ADA8]">
                    <div>
                      <p className="font-semibold text-[#F2F4EF]">{sc.title}</p>
                      <p className="text-[10px] text-[#A7ADA8]">{isHi ? "क्षेत्र:" : "Region:"} {sc.state} • {isHi ? "लक्ष्य वर्ष:" : "Target Year:"} {sc.target_year}</p>
                    </div>
                    <div className="flex items-center space-x-3 text-[11px]">
                      <span>{isHi ? "खाद्य सुरक्षा:" : "Food Sec:"} <strong className="text-[#F2F4EF]">{sc.simulated_food_security_index}</strong></span>
                      <span>{isHi ? "कार्बन:" : "Carbon:"} <strong className="text-[#F2F4EF]">{sc.simulated_carbon_sink_mt} MT</strong></span>
                      <span>{isHi ? "विवाद:" : "Dispute:"} <strong className="text-[#F2F4EF]">{sc.simulated_dispute_risk_index}</strong></span>
                      <button
                        onClick={() => handleLoadScenario(sc)}
                        className="btn-secondary-cta px-3 py-1 text-[10px] cursor-pointer"
                      >
                        {isHi ? "पुनः खोलें" : "Reopen"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
