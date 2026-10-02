import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  HelpCircle, 
  Save, 
  Download, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Info, 
  RefreshCw,
  TrendingUp,
  Scale,
  Trees,
  Wheat,
  Factory
} from 'lucide-react';
import { api } from '../services/api';
import { PolicyScenarioInputs, SimulationOutputs } from '../types';

interface PolicySimulationLabProps {
  initialState?: string;
}

export const PolicySimulationLab: React.FC<PolicySimulationLabProps> = ({ initialState }) => {
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
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg shadow-xs flex items-start space-x-3 text-xs border border-amber-200">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-amber-900 text-sm">
            Transparent Rule-Based Simulation Engine (MVP Evaluation)
          </h4>
          <p className="text-amber-800 mt-0.5 leading-relaxed">
            All econometric, dispute risk, and ecological formulas are explicitly presented below.
            These calculations serve as comparative decision-support projections for policy experimentation
            and do not represent statutory land appraisal forecasts.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Column (Sliders & Parameters) */}
        <div className="lg:col-span-1 bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-[#0a2540] flex items-center space-x-1.5">
              <Sliders className="w-4 h-4 text-slate-500" />
              <span>Policy Levers & Inputs</span>
            </span>
            <span className="text-[10px] text-slate-400">Interactive</span>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Scenario Title</label>
            <input
              type="text"
              value={inputs.title}
              onChange={(e) => setInputs({ ...inputs, title: e.target.value })}
              className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Geographic Focus</label>
              <select
                value={inputs.state}
                onChange={(e) => setInputs({ ...inputs, state: e.target.value })}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-800"
              >
                <option value="National Average">Pan-India Average</option>
                <option value="Uttar Pradesh">Uttar Pradesh</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Gujarat">Gujarat</option>
                <option value="Rajasthan">Rajasthan</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Horizon Year</label>
              <select
                value={inputs.target_year}
                onChange={(e) => setInputs({ ...inputs, target_year: Number(e.target.value) })}
                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-300 rounded font-medium text-slate-800"
              >
                <option value={2030}>2030 (6 Years)</option>
                <option value={2035}>2035 (11 Years)</option>
                <option value={2040}>2040 (16 Years)</option>
              </select>
            </div>
          </div>

          {/* Slider 1: Urban Expansion */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Urban Expansion Rate:</span>
              <span className="font-bold text-amber-700">{inputs.urban_expansion_rate_pct}% / yr</span>
            </div>
            <input
              type="range"
              min={1.0}
              max={7.0}
              step={0.1}
              value={inputs.urban_expansion_rate_pct}
              onChange={(e) => setInputs({ ...inputs, urban_expansion_rate_pct: parseFloat(e.target.value) })}
              className="w-full accent-[#0a2540] cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">Baseline national trend: 3.2% annually</p>
          </div>

          {/* Slider 2: Agricultural Land Protection */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Agri Land Protection Target:</span>
              <span className="font-bold text-emerald-700">{inputs.agri_land_protection_pct}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={100}
              step={1}
              value={inputs.agri_land_protection_pct}
              onChange={(e) => setInputs({ ...inputs, agri_land_protection_pct: parseFloat(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <p className="text-[10px] text-slate-400">Protects multi-cropped farmland from non-agri zoning</p>
          </div>

          {/* Slider 3: Forest Conservation */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Forest Conservation Threshold:</span>
              <span className="font-bold text-blue-700">{inputs.forest_conservation_pct}%</span>
            </div>
            <input
              type="range"
              min={70}
              max={100}
              step={1}
              value={inputs.forest_conservation_pct}
              onChange={(e) => setInputs({ ...inputs, forest_conservation_pct: parseFloat(e.target.value) })}
              className="w-full accent-blue-600 cursor-pointer"
            />
          </div>

          {/* Slider 4: Industrial Land Corridor Allocation */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Industrial Corridor Land:</span>
              <span className="font-bold text-slate-900">{inputs.industrial_corridor_hectares.toLocaleString()} ha</span>
            </div>
            <input
              type="range"
              min={2000}
              max={50000}
              step={1000}
              value={inputs.industrial_corridor_hectares}
              onChange={(e) => setInputs({ ...inputs, industrial_corridor_hectares: parseFloat(e.target.value) })}
              className="w-full accent-purple-600 cursor-pointer"
            />
          </div>

          {/* Slider 5: Solar & Renewable Energy */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Solar & Renewable Parks:</span>
              <span className="font-bold text-amber-600">{inputs.solar_renewable_hectares.toLocaleString()} ha</span>
            </div>
            <input
              type="range"
              min={1000}
              max={30000}
              step={500}
              value={inputs.solar_renewable_hectares}
              onChange={(e) => setInputs({ ...inputs, solar_renewable_hectares: parseFloat(e.target.value) })}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Slider 6: Waterbody Buffer Strip */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="font-medium text-slate-700">Waterbody Buffer Compliance:</span>
              <span className="font-bold text-teal-700">{inputs.waterbody_buffer_meters} meters</span>
            </div>
            <input
              type="range"
              min={20}
              max={250}
              step={10}
              value={inputs.waterbody_buffer_meters}
              onChange={(e) => setInputs({ ...inputs, waterbody_buffer_meters: parseFloat(e.target.value) })}
              className="w-full accent-teal-600 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex-1 py-2 bg-[#0a2540] hover:bg-[#1e3a5f] text-white font-semibold rounded transition flex items-center justify-center space-x-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saveSuccess ? 'Saved Scenario!' : 'Save Scenario'}</span>
            </button>
          </div>
        </div>

        {/* Results & Mathematical Provenance Column */}
        <div className="lg:col-span-2 space-y-4">
          {/* Key Simulation Outputs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {/* 1. Food Security Index */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Food Security Index</span>
                <Wheat className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {outputs?.simulated_food_security_index} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </p>
              <p className={`text-[11px] font-semibold mt-1 ${
                (outputs?.deltas_vs_baseline?.food_security_pct || 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {(outputs?.deltas_vs_baseline?.food_security_pct || 0) >= 0 ? '+' : ''}
                {outputs?.deltas_vs_baseline?.food_security_pct}% vs Baseline
              </p>
            </div>

            {/* 2. Carbon Sink MT */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Carbon Sink Potential</span>
                <Trees className="w-4 h-4 text-teal-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {outputs?.simulated_carbon_sink_mt} <span className="text-xs font-normal text-slate-400">MT</span>
              </p>
              <p className={`text-[11px] font-semibold mt-1 ${
                (outputs?.deltas_vs_baseline?.carbon_sink_pct || 0) >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {(outputs?.deltas_vs_baseline?.carbon_sink_pct || 0) >= 0 ? '+' : ''}
                {outputs?.deltas_vs_baseline?.carbon_sink_pct}% vs Baseline
              </p>
            </div>

            {/* 3. Economic Gross Output */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Economic Output</span>
                <Factory className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                ₹{Math.round((outputs?.simulated_economic_output_cr || 0) / 1000)}k <span className="text-xs font-normal text-slate-400">Cr</span>
              </p>
              <p className="text-[11px] font-semibold text-emerald-700 mt-1">
                +{outputs?.deltas_vs_baseline?.economic_output_pct}% Industrial Boost
              </p>
            </div>

            {/* 4. Dispute Risk Index */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Dispute Risk Probability</span>
                <Scale className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {outputs?.simulated_dispute_risk_index} <span className="text-xs font-normal text-slate-400">/ 100</span>
              </p>
              <p className={`text-[11px] font-semibold mt-1 ${
                (outputs?.deltas_vs_baseline?.dispute_risk_pct || 0) <= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {(outputs?.deltas_vs_baseline?.dispute_risk_pct || 0) >= 0 ? '+' : ''}
                {outputs?.deltas_vs_baseline?.dispute_risk_pct}% vs Baseline
              </p>
            </div>

            {/* 5. Groundwater Extraction Stress */}
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs col-span-2 md:col-span-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Aquifer Groundwater Stress Index</span>
                <span className="font-bold text-slate-800">{outputs?.groundwater_stress_index} / 100</span>
              </div>
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mt-2">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    (outputs?.groundwater_stress_index || 0) > 60 ? 'bg-rose-600' : (outputs?.groundwater_stress_index || 0) > 40 ? 'bg-amber-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${outputs?.groundwater_stress_index}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5">
                Mitigated by riparian buffer strip compliance ({inputs.waterbody_buffer_meters}m buffer applied).
              </p>
            </div>
          </div>

          {/* Explicit Formulas & Assumptions Card */}
          <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-[#0a2540] text-sm flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Transparent Model Equations & Coefficients</span>
            </h4>

            <div className="space-y-1.5 font-mono text-[11px] bg-slate-900 text-slate-200 p-3 rounded-lg overflow-x-auto">
              <p><span className="text-amber-400">Food_Security =</span> {outputs?.formulas?.food_security_model}</p>
              <p><span className="text-teal-400">Carbon_Sink =</span> {outputs?.formulas?.carbon_sink_model}</p>
              <p><span className="text-blue-400">Economic_GDP =</span> {outputs?.formulas?.economic_impact_model}</p>
              <p><span className="text-rose-400">Dispute_Risk =</span> {outputs?.formulas?.dispute_risk_model}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              <div className="space-y-1">
                <p className="font-bold text-slate-700">Model Assumptions:</p>
                <ul className="list-disc pl-4 text-slate-600 space-y-0.5 text-[11px]">
                  {outputs?.assumptions?.map((ass, i) => (
                    <li key={i}>{ass}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-1">
                <p className="font-bold text-slate-700">Methodological Limitations:</p>
                <ul className="list-disc pl-4 text-slate-600 space-y-0.5 text-[11px]">
                  {outputs?.limitations?.map((lim, i) => (
                    <li key={i}>{lim}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Saved Scenarios History */}
          {savedScenarios.length > 0 && (
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs text-xs space-y-2">
              <h4 className="font-bold text-slate-800">Saved Scenario Library ({savedScenarios.length})</h4>
              <div className="divide-y divide-slate-100 max-h-40 overflow-y-auto">
                {savedScenarios.map((sc) => (
                  <div key={sc.id} className="py-2 flex items-center justify-between text-slate-600">
                    <div>
                      <p className="font-semibold text-slate-800">{sc.title}</p>
                      <p className="text-[10px] text-slate-400">Region: {sc.state} • Target Year: {sc.target_year}</p>
                    </div>
                    <div className="flex items-center space-x-3 text-[11px]">
                      <span>Food Sec: <strong>{sc.simulated_food_security_index}</strong></span>
                      <span>Carbon: <strong>{sc.simulated_carbon_sink_mt} MT</strong></span>
                      <span>Dispute: <strong>{sc.simulated_dispute_risk_index}</strong></span>
                      <button
                        onClick={() => handleLoadScenario(sc)}
                        className="px-2 py-1 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-800 rounded border border-amber-300 font-medium transition cursor-pointer text-[10px]"
                      >
                        Reopen
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
