import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  CircleMarker, 
  Popup, 
  Tooltip as LeafletTooltip 
} from 'react-leaflet';
import { 
  Layers, 
  Info, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Building2, 
  Droplet, 
  Truck, 
  ShieldCheck,
  X
} from 'lucide-react';
import { api } from '../services/api';

interface GISExplorerProps {
  onSelectStateForSimulation?: (stateName: string) => void;
  onSelectStateForAI?: (stateName: string) => void;
  onSelectStateForAnalytics?: (stateName: string) => void;
  initialSelectedState?: string | null;
}

export const GISExplorer: React.FC<GISExplorerProps> = ({
  onSelectStateForSimulation,
  onSelectStateForAI,
  onSelectStateForAnalytics,
  initialSelectedState
}) => {
  const [states, setStates] = useState<any[]>([]);
  const [watershedSites, setWatershedSites] = useState<any[]>([]);
  const [infraProjects, setInfraProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Layer toggles
  const [showDilrmp, setShowDilrmp] = useState(true);
  const [showWatershed, setShowWatershed] = useState(true);
  const [showInfraDelay, setShowInfraDelay] = useState(true);

  // Selected State Drawer
  const [selectedState, setSelectedState] = useState<any | null>(null);

  useEffect(() => {
    async function loadGisData() {
      try {
        const [statesRes, watershedRes, infraRes] = await Promise.all([
          api.getGisStates(),
          api.getWatershedSites(),
          api.getInfrastructureProjects()
        ]);
        setStates(statesRes.data || []);
        setWatershedSites(watershedRes.data || []);
        setInfraProjects(infraRes.data || []);
      } catch (err) {
        console.error('Failed to load GIS data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGisData();
  }, []);

  return (
    <div className="space-y-4">
      {/* Geospatial Provenance Notice Banner */}
      <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
            <Layers className="w-4 h-4" />
          </span>
          <div>
            <span className="font-bold text-slate-800">
              National Cadastral & Watershed Spatial Engine
            </span>
            <p className="text-[11px] text-slate-500">
              Integrates 30m Satellite Interventions (MoRD 26015), DILRMP State Master Index, and Acquisition Delay Markers (MoRD 25017).
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-slate-600 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200">
          <span>Projection: <strong>WGS 84 (EPSG:4326)</strong></span>
          <span>•</span>
          <span>Tiles: <strong>OpenStreetMap / Bhuvan Interoperable</strong></span>
        </div>
      </div>

      {/* Main Map Workspace with Layer Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Layer Controls & Legends Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-[#0a2540] flex items-center space-x-1.5">
                <Layers className="w-4 h-4 text-slate-500" />
                <span>Geospatial Layers</span>
              </span>
              <span className="text-[10px] text-slate-400">Interactive Toggles</span>
            </div>

            {/* Layer 1: DILRMP */}
            <div className="space-y-2 p-2.5 rounded-md bg-slate-50 border border-slate-200">
              <label className="flex items-center justify-between cursor-pointer select-none font-semibold text-slate-800">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span>State DILRMP Digitization</span>
                </span>
                <input
                  type="checkbox"
                  checked={showDilrmp}
                  onChange={(e) => setShowDilrmp(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </label>
              <p className="text-[10px] text-slate-500 leading-tight">
                Computerization of Records of Rights & Spatial Cadastre (DoLR Master).
              </p>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-slate-200/60 text-slate-500">
                <span>🟢 &gt; 95% Completed</span>
                <span>🟡 85-95%</span>
                <span>🔴 &lt; 85%</span>
              </div>
            </div>

            {/* Layer 2: Watershed Interventions (Problem 26015) */}
            <div className="space-y-2 p-2.5 rounded-md bg-slate-50 border border-slate-200">
              <label className="flex items-center justify-between cursor-pointer select-none font-semibold text-slate-800">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                  <span>Bhuvan 30m Watersheds</span>
                </span>
                <input
                  type="checkbox"
                  checked={showWatershed}
                  onChange={(e) => setShowWatershed(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <p className="text-[10px] text-slate-500 leading-tight">
                SRISHTI-DRISHTI Satellite Monitored Check Dams & Farm Ponds (MoRD 26015).
              </p>
              <div className="flex items-center space-x-2 text-[10px] text-blue-700">
                <Droplet className="w-3 h-3" />
                <span>Shows NDVI Gain & Soil Moisture</span>
              </div>
            </div>

            {/* Layer 3: Infrastructure Land Acquisition Delay (Problem 26016/25017) */}
            <div className="space-y-2 p-2.5 rounded-md bg-slate-50 border border-slate-200">
              <label className="flex items-center justify-between cursor-pointer select-none font-semibold text-slate-800">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-600"></span>
                  <span>Acquisition Delay Hotspots</span>
                </span>
                <input
                  type="checkbox"
                  checked={showInfraDelay}
                  onChange={(e) => setShowInfraDelay(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
              </label>
              <p className="text-[10px] text-slate-500 leading-tight">
                National Highway & Freight Corridor risk flags (MoRD 25017 & 26016).
              </p>
              <div className="flex items-center space-x-2 text-[10px] text-rose-700">
                <AlertTriangle className="w-3 h-3" />
                <span>Identifies Litigation Bottlenecks</span>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 leading-snug">
              <strong>Tip:</strong> Click on any state or point marker on the map to inspect full cadastral and hydrological indicators.
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="lg:col-span-3 bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden relative min-h-[560px]">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
              <div className="w-8 h-8 border-4 border-[#0a2540] border-t-amber-500 rounded-full animate-spin"></div>
            </div>
          ) : (
            <MapContainer
              center={[22.5937, 78.9629]}
              zoom={5}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '560px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* 1. DILRMP State Centroids Layer */}
              {showDilrmp && states.map((st) => {
                const color = st.cadastral_digitized_pct >= 95 ? '#15803d' : st.cadastral_digitized_pct >= 88 ? '#d97706' : '#dc2626';
                return (
                  <CircleMarker
                    key={st.id}
                    center={[st.lat, st.lng]}
                    radius={16}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: 0.5,
                      weight: 2
                    }}
                    eventHandlers={{
                      click: () => setSelectedState(st)
                    }}
                  >
                    <LeafletTooltip direction="top" offset={[0, -10]} opacity={0.9}>
                      <div className="text-xs font-sans">
                        <strong className="text-slate-900">{st.name}</strong><br/>
                        <span className="text-slate-600">Cadastre Digitized: {st.cadastral_digitized_pct}%</span>
                      </div>
                    </LeafletTooltip>
                    <Popup>
                      <div className="p-1 font-sans text-xs">
                        <h4 className="font-bold text-[#0a2540]">{st.name}</h4>
                        <p className="text-[11px] text-slate-600 mt-1">RoR Computerization: <strong>{st.dilrmp_ror_pct}%</strong></p>
                        <p className="text-[11px] text-slate-600">Cadastral Digitization: <strong>{st.cadastral_digitized_pct}%</strong></p>
                        <p className="text-[11px] text-slate-600">Dispute Density: <strong>{st.dispute_index} / 100</strong></p>
                        <button
                          onClick={() => setSelectedState(st)}
                          className="mt-2 w-full py-1 bg-[#0a2540] text-white rounded text-[10px] font-semibold"
                        >
                          View Full State Profile
                        </button>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}

              {/* 2. Watershed Interventions Layer (MoRD 26015) */}
              {showWatershed && watershedSites.map((site) => (
                <CircleMarker
                  key={site.id}
                  center={[site.lat, site.lng]}
                  radius={9}
                  pathOptions={{
                    color: '#0284c7',
                    fillColor: '#38bdf8',
                    fillOpacity: 0.9,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans text-xs max-w-xs">
                      <div className="flex items-center space-x-1 text-blue-700 font-bold">
                        <Droplet className="w-3.5 h-3.5" />
                        <span>Watershed Intervention (MoRD 26015)</span>
                      </div>
                      <h4 className="font-bold text-slate-900 mt-1">{site.name}</h4>
                      <p className="text-[11px] text-slate-500">{site.district}, {site.state}</p>
                      <div className="mt-1.5 p-1.5 bg-blue-50 rounded border border-blue-200 text-[10px] space-y-0.5">
                        <p>Structure: <strong>{site.type}</strong></p>
                        <p>Soil Moisture Gain: <strong className="text-emerald-700">+{site.soil_moisture_gain_pct}%</strong></p>
                        <p>Vegetation NDVI: <strong className="text-emerald-700">{site.vegetation_ndvi_change}</strong></p>
                        <p>Platform ID: <code>{site.srishti_drishti_id}</code></p>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {/* 3. Infrastructure Land Acquisition Delay Hotspots (MoRD 25017) */}
              {showInfraDelay && infraProjects.map((p) => {
                const color = p.delay_risk_score > 50 ? '#dc2626' : p.delay_risk_score > 30 ? '#d97706' : '#15803d';
                return (
                  <CircleMarker
                    key={p.id}
                    center={[p.lat, p.lng]}
                    radius={11}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: 0.85,
                      weight: 2
                    }}
                  >
                    <Popup>
                      <div className="p-1 font-sans text-xs max-w-xs">
                        <div className="flex items-center space-x-1 text-rose-700 font-bold">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Infrastructure Acquisition (MoRD 25017)</span>
                        </div>
                        <h4 className="font-bold text-slate-900 mt-1">{p.name}</h4>
                        <p className="text-[11px] text-slate-500">Agency: {p.agency} • {p.state}</p>
                        <div className="mt-1.5 p-1.5 bg-slate-50 rounded border border-slate-200 text-[10px] space-y-0.5">
                          <p>Required: <strong>{p.total_land_required_ha} ha</strong> | Acquired: <strong>{p.land_acquired_pct}%</strong></p>
                          <p>Delay Risk Score: <strong className={p.delay_risk_score > 50 ? 'text-rose-700' : 'text-amber-700'}>{p.delay_risk_score}% ({p.delay_risk_category})</strong></p>
                          <p className="text-slate-600">Bottleneck: {p.primary_bottleneck}</p>
                          <p className="text-slate-500">Statutory Status: <em>{p.rfctlarr_status}</em></p>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          )}

          {/* Selected State Side Drawer */}
          {selectedState && (
            <div className="absolute top-3 right-3 z-30 w-80 bg-white rounded-lg shadow-2xl border border-slate-300 p-4 text-xs animate-in slide-in-from-right-10">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <h3 className="font-bold text-sm text-[#0a2540]">{selectedState.name}</h3>
                <button 
                  onClick={() => setSelectedState(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3 space-y-3">
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">DILRMP RoR Computerization:</span>
                    <span className="font-bold text-emerald-700">{selectedState.dilrmp_ror_pct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Cadastral Digitization:</span>
                    <span className="font-bold text-blue-700">{selectedState.cadastral_digitized_pct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Modern Record Rooms:</span>
                    <span className="font-bold text-purple-700">{selectedState.modern_record_rooms_pct}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Litigation Dispute Index:</span>
                    <span className="font-bold text-amber-700">{selectedState.dispute_index} / 100</span>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1 text-[11px]">
                  <p><strong>Dominant Land Cover:</strong> {selectedState.dominant_land_use}</p>
                  <p><strong>Climate Vulnerability:</strong> {selectedState.climate_vulnerability}</p>
                  <p><strong>Watershed Interventions:</strong> {selectedState.watershed_interventions} sites</p>
                  <p><strong>Active Research Projects:</strong> {selectedState.active_research_count} active</p>
                </div>

                {/* Cross-Module Navigation Actions */}
                <div className="space-y-1.5 pt-1">
                  {onSelectStateForSimulation && (
                    <button
                      onClick={() => onSelectStateForSimulation(selectedState.name)}
                      className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded transition text-xs flex items-center justify-center space-x-1"
                    >
                      <span>Simulate Policy for {selectedState.name} →</span>
                    </button>
                  )}
                  {onSelectStateForAnalytics && (
                    <button
                      onClick={() => onSelectStateForAnalytics(selectedState.name)}
                      className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded transition text-xs flex items-center justify-center space-x-1"
                    >
                      <span>Explore in Analytics Matrix</span>
                    </button>
                  )}
                  {onSelectStateForAI && (
                    <button
                      onClick={() => onSelectStateForAI(selectedState.name)}
                      className="w-full py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-900 font-semibold rounded border border-blue-200 transition text-xs flex items-center justify-center space-x-1"
                    >
                      <span>Ask AI Assistant about {selectedState.name}</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setSelectedState(null)}
                  className="w-full py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded transition text-xs"
                >
                  Close Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
