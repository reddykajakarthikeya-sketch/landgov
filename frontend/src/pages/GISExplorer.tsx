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
  AlertTriangle, 
  Droplet, 
  Truck, 
  X,
  Compass,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { useTranslation } from '../i18n';
import { Card3D } from '../components/ui/Card3D';

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
  const { t, language } = useTranslation();
  const isHi = language === 'hi';
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
    <div className="space-y-5">
      {/* Geospatial Provenance Notice Banner */}
      <div className="liquid-glass border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs bg-[#151919]/70 backdrop-blur-xl">
        <div className="flex items-center space-x-3">
          <span className="p-2 bg-[#B7E300]/15 text-[#B7E300] rounded-xl border border-[#B7E300]/30 shadow-xs">
            <Compass className="w-5 h-5 text-[#B7E300]" />
          </span>
          <div>
            <span className="font-bold text-[#F5F5F2] text-sm flex items-center space-x-2">
              <span>{isHi ? "राष्ट्रीय भूकर एवं वाटरशेड स्थानिक इंजन" : "National Cadastral & Watershed Spatial Engine"}</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#B7E300]/10 text-[#B7E300] border border-[#B7E300]/30">LIVE GIS</span>
            </span>
            <p className="text-[11px] text-[#A7ADA8] mt-0.5">
              {isHi 
                ? "30मी उपग्रह हस्तक्षेप (MoRD 26015), DILRMP राज्य मास्टर इंडेक्स और भूमि अधिग्रहण विलंब मार्कर (MoRD 25017) एकीकृत।" 
                : "Integrates 30m Satellite Interventions (MoRD 26015), DILRMP State Master Index, and Acquisition Delay Markers (MoRD 25017)."}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3 text-[11px] text-[#A7ADA8] bg-white/5 px-3.5 py-1.5 rounded-xl border border-white/10 font-mono">
          <span>Projection: <strong className="text-[#F2F4EF]">WGS 84 (EPSG:4326)</strong></span>
          <span className="text-white/20">•</span>
          <span>Tiles: <strong className="text-[#B7E300]">Dark Geospatial Topography</strong></span>
        </div>
      </div>

      {/* Main Map Workspace with Layer Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Layer Controls & Legends Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="liquid-glass p-5 rounded-2xl border border-white/10 shadow-xl space-y-4 text-xs bg-[#151919]/80">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="font-bold text-[#F5F5F2] flex items-center space-x-2 font-syne">
                <Layers className="w-4 h-4 text-[#B7E300]" />
                <span>{isHi ? "स्थानिक परतें" : "Geospatial Layers"}</span>
              </span>
              <span className="text-[10px] text-[#B7E300] bg-[#B7E300]/10 border border-[#B7E300]/30 px-2 py-0.5 rounded-full font-mono">{isHi ? "इंटरएक्टिव" : "Interactive"}</span>
            </div>

            {/* Layer 1: DILRMP */}
            <div className="space-y-2 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <label className="flex items-center justify-between cursor-pointer select-none font-semibold text-[#F2F4EF]">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B7E300] shadow-xs"></span>
                  <span>{isHi ? "राज्य DILRMP डिजिटलीकरण" : "State DILRMP Digitization"}</span>
                </span>
                <input
                  type="checkbox"
                  checked={showDilrmp}
                  onChange={(e) => setShowDilrmp(e.target.checked)}
                  className="rounded border-white/20 text-[#B7E300] focus:ring-[#B7E300] h-4 w-4 bg-white/10 accent-[#B7E300]"
                />
              </label>
              <p className="text-[10px] text-[#A7ADA8] leading-tight">
                {isHi ? "अधिकार अभिलेख (RoR) एवं कैडस्ट्रल मानचित्र कंप्यूटरीकरण।" : "Computerization of Records of Rights & Spatial Cadastre (DoLR Master)."}
              </p>
              <div className="flex items-center justify-between text-[10px] pt-2 border-t border-white/10 font-mono">
                <span className="text-[#B7E300] font-semibold">🟢 &gt; 95%</span>
                <span className="text-[#78C8C8] font-semibold">🟡 85-95%</span>
                <span className="text-[#C56A9A] font-semibold">🔴 &lt; 85%</span>
              </div>
            </div>

            {/* Layer 2: Watershed Interventions (Problem 26015) */}
            <div className="space-y-2 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <label className="flex items-center justify-between cursor-pointer select-none font-semibold text-[#F2F4EF]">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#78C8C8]"></span>
                  <span>{isHi ? "भुवन 30मी वाटरशेड्स" : "Bhuvan 30m Watersheds"}</span>
                </span>
                <input
                  type="checkbox"
                  checked={showWatershed}
                  onChange={(e) => setShowWatershed(e.target.checked)}
                  className="rounded border-white/20 text-[#78C8C8] focus:ring-[#78C8C8] h-4 w-4 bg-white/10 accent-[#78C8C8]"
                />
              </label>
              <p className="text-[10px] text-[#A7ADA8] leading-tight">
                {isHi ? "सृष्टि-दृष्टि उपग्रह द्वारा चेकडैम एवं खेत तालाब निगरानी (MoRD 26015)।" : "SRISHTI-DRISHTI Satellite Monitored Check Dams & Farm Ponds (MoRD 26015)."}
              </p>
              <div className="flex items-center space-x-2 text-[10px] text-[#78C8C8] pt-1 font-semibold font-mono">
                <Droplet className="w-3 h-3 text-[#78C8C8]" />
                <span>{isHi ? "NDVI वृद्धि और मृदा नमी" : "Shows NDVI Gain & Soil Moisture"}</span>
              </div>
            </div>

            {/* Layer 3: Infrastructure Land Acquisition Delay (Problem 26016/25017) */}
            <div className="space-y-2 p-3.5 rounded-xl bg-white/5 border border-white/10">
              <label className="flex items-center justify-between cursor-pointer select-none font-semibold text-[#F2F4EF]">
                <span className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C56A9A]"></span>
                  <span>{isHi ? "भूमि अधिग्रहण विलंब हॉटस्पॉट्स" : "Acquisition Delay Hotspots"}</span>
                </span>
                <input
                  type="checkbox"
                  checked={showInfraDelay}
                  onChange={(e) => setShowInfraDelay(e.target.checked)}
                  className="rounded border-white/20 text-[#C56A9A] focus:ring-[#C56A9A] h-4 w-4 bg-white/10 accent-[#C56A9A]"
                />
              </label>
              <p className="text-[10px] text-[#A7ADA8] leading-tight">
                {isHi ? "राष्ट्रीय राजमार्ग एवं फ्रेट कॉरिडोर जोखिम मार्कर (MoRD 25017 & 26016)।" : "National Highway & Freight Corridor risk flags (MoRD 25017 & 26016)."}
              </p>
              <div className="flex items-center space-x-2 text-[10px] text-[#C56A9A] pt-1 font-semibold font-mono">
                <AlertTriangle className="w-3 h-3 text-[#C56A9A]" />
                <span>{isHi ? "मुकदमेबाजी बाधाओं की पहचान" : "Identifies Litigation Bottlenecks"}</span>
              </div>
            </div>

            <div className="p-3 bg-[#B7E300]/10 border border-[#B7E300]/20 rounded-xl text-[11px] text-[#F2F4EF] leading-relaxed">
              <strong className="text-[#B7E300]">{isHi ? "सुझाव:" : "Tip:"}</strong> {isHi ? "पूर्ण भूकर और जल विज्ञान संकेतकों के निरीक्षण हेतु मानचित्र पर किसी भी राज्य या मार्कर पर क्लिक करें।" : "Click on any state or point marker on the map to inspect full cadastral and hydrological indicators."}
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="lg:col-span-3 liquid-glass rounded-2xl border border-white/15 shadow-2xl overflow-hidden relative min-h-[580px] dark-map-tiles">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[#080A0A]/85 z-20">
              <div className="w-10 h-10 border-4 border-white/20 border-t-[#B7E300] rounded-full animate-spin"></div>
            </div>
          ) : (
            <MapContainer
              center={[22.5937, 78.9629]}
              zoom={5}
              scrollWheelZoom={true}
              style={{ width: '100%', height: '580px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* 1. DILRMP State Centroids Layer */}
              {showDilrmp && states.map((st) => {
                const color = st.cadastral_digitized_pct >= 95 ? '#B7E300' : st.cadastral_digitized_pct >= 88 ? '#78C8C8' : '#C56A9A';
                return (
                  <CircleMarker
                    key={st.id}
                    center={[st.lat, st.lng]}
                    radius={16}
                    pathOptions={{
                      color: color,
                      fillColor: color,
                      fillOpacity: 0.65,
                      weight: 2
                    }}
                    eventHandlers={{
                      click: () => setSelectedState(st)
                    }}
                  >
                    <LeafletTooltip direction="top" offset={[0, -10]} opacity={0.95}>
                      <div className="text-xs font-sans p-1">
                        <strong className="text-[#29332F]">{st.name}</strong><br/>
                        <span className="text-[#78827D]">Cadastre Digitized: {st.cadastral_digitized_pct}%</span>
                      </div>
                    </LeafletTooltip>
                    <Popup>
                      <div className="p-1 font-sans text-xs">
                        <h4 className="font-bold text-[#F2F4EF]">{st.name}</h4>
                        <p className="text-[11px] text-[#A7ADA8] mt-1">RoR Computerization: <strong className="text-[#B7E300]">{st.dilrmp_ror_pct}%</strong></p>
                        <p className="text-[11px] text-[#A7ADA8]">Cadastral Digitization: <strong className="text-[#78C8C8]">{st.cadastral_digitized_pct}%</strong></p>
                        <p className="text-[11px] text-[#A7ADA8]">Dispute Density: <strong className="text-[#C56A9A]">{st.dispute_index} / 100</strong></p>
                        <button
                          onClick={() => setSelectedState(st)}
                          className="mt-2 w-full py-1.5 btn-primary-cta text-[10px] cursor-pointer"
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
                    color: '#78C8C8',
                    fillColor: '#829B8D',
                    fillOpacity: 0.85,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="p-1 font-sans text-xs max-w-xs text-[#F2F4EF]">
                      <div className="flex items-center space-x-1 text-[#78C8C8] font-bold">
                        <Droplet className="w-3.5 h-3.5" />
                        <span>Watershed Intervention (MoRD 26015)</span>
                      </div>
                      <h4 className="font-bold text-[#F2F4EF] mt-1">{site.name}</h4>
                      <p className="text-[11px] text-[#A7ADA8]">{site.district}, {site.state}</p>
                      <div className="mt-1.5 p-1.5 bg-black/40 rounded-lg border border-white/10 text-[10px] space-y-0.5 text-[#A7ADA8]">
                        <p>Structure: <strong className="text-[#F2F4EF]">{site.type}</strong></p>
                        <p>Soil Moisture Gain: <strong className="text-[#B7E300]">+{site.soil_moisture_gain_pct}%</strong></p>
                        <p>Vegetation NDVI: <strong className="text-[#B7E300]">{site.vegetation_ndvi_change}</strong></p>
                        <p>Platform ID: <code className="text-[#78C8C8] font-mono">{site.srishti_drishti_id}</code></p>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {/* 3. Infrastructure Land Acquisition Delay Hotspots (MoRD 25017) */}
              {showInfraDelay && infraProjects.map((p) => {
                const color = p.delay_risk_score > 50 ? '#C56A9A' : p.delay_risk_score > 30 ? '#C5A46D' : '#B7E300';
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
                      <div className="p-1 font-sans text-xs max-w-xs text-[#F2F4EF]">
                        <div className="flex items-center space-x-1 text-[#C56A9A] font-bold">
                          <Truck className="w-3.5 h-3.5" />
                          <span>Infrastructure Acquisition (MoRD 25017)</span>
                        </div>
                        <h4 className="font-bold text-[#F2F4EF] mt-1">{p.name}</h4>
                        <p className="text-[11px] text-[#A7ADA8]">Agency: {p.agency} • {p.state}</p>
                        <div className="mt-1.5 p-1.5 bg-black/40 rounded-lg border border-white/10 text-[10px] space-y-0.5 text-[#A7ADA8]">
                          <p>Required: <strong className="text-[#F2F4EF]">{p.total_land_required_ha} ha</strong> | Acquired: <strong className="text-[#B7E300]">{p.land_acquired_pct}%</strong></p>
                          <p>Delay Risk Score: <strong className={p.delay_risk_score > 50 ? 'text-[#C56A9A]' : 'text-[#B7E300]'}>{p.delay_risk_score}% ({p.delay_risk_category})</strong></p>
                          <p className="text-[#A7ADA8]">Bottleneck: <span className="text-[#F2F4EF]">{p.primary_bottleneck}</span></p>
                          <p className="text-[#6F7772]">Statutory Status: <em>{p.rfctlarr_status}</em></p>
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
                );
              })}
            </MapContainer>
          )}

          {/* Selected State Side Drawer in Dark Liquid Glass */}
          {selectedState && (
            <Card3D maxTilt={2.5} className="absolute bottom-2 sm:bottom-auto sm:top-4 inset-x-2 sm:inset-x-auto sm:right-4 sm:w-88 liquid-glass-elevated bg-[#151919]/95 rounded-2xl shadow-2xl border border-white/20 p-5 text-xs z-30 max-h-[75vh] overflow-y-auto animate-in slide-in-from-bottom sm:slide-in-from-right-10 text-[#F2F4EF]">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="font-bold text-base text-[#F5F5F2]">{selectedState.name}</h3>
                <button 
                  onClick={() => setSelectedState(null)}
                  className="p-1.5 text-[#A7ADA8] hover:text-white rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-3.5 space-y-3.5">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[#A7ADA8]">{isHi ? 'आरओआर कंप्यूटरीकरण:' : 'DILRMP RoR Computerization:'}</span>
                    <span className="font-bold text-[#B7E300] px-2 py-0.5 rounded font-mono bg-[#B7E300]/15 border border-[#B7E300]/30">{selectedState.dilrmp_ror_pct}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#A7ADA8]">{isHi ? 'भूकर डिजिटलीकरण:' : 'Cadastral Digitization:'}</span>
                    <span className="font-bold text-[#78C8C8] px-2 py-0.5 rounded font-mono bg-[#78C8C8]/15 border border-[#78C8C8]/30">{selectedState.cadastral_digitized_pct}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#A7ADA8]">{isHi ? 'आधुनिक रिकॉर्ड रूम:' : 'Modern Record Rooms:'}</span>
                    <span className="font-bold text-[#F5F5F2] px-2 py-0.5 rounded font-mono bg-white/10 border border-white/20">{selectedState.modern_record_rooms_pct}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#A7ADA8]">{isHi ? 'विवाद तीव्रता सूचकांक:' : 'Litigation Dispute Index:'}</span>
                    <span className="font-bold text-[#C56A9A] px-2 py-0.5 rounded font-mono bg-[#C56A9A]/15 border border-[#C56A9A]/30">{selectedState.dispute_index} / 100</span>
                  </div>
                </div>

                <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 space-y-1.5 text-[11px] text-[#A7ADA8]">
                  <p><strong className="text-[#F2F4EF]">{isHi ? 'प्रमुख भूमि उपयोग:' : 'Dominant Land Cover:'}</strong> {selectedState.dominant_land_use}</p>
                  <p><strong className="text-[#F2F4EF]">{isHi ? 'जलवायु सुभेद्यता:' : 'Climate Vulnerability:'}</strong> {selectedState.climate_vulnerability}</p>
                  <p><strong className="text-[#F2F4EF]">{isHi ? 'वाटरशेड स्थल:' : 'Watershed Interventions:'}</strong> {selectedState.watershed_interventions} sites</p>
                  <p><strong className="text-[#F2F4EF]">{isHi ? 'सक्रिय अनुसंधान:' : 'Active Research Projects:'}</strong> {selectedState.active_research_count} active</p>
                </div>

                {/* Cross-Module Navigation Actions */}
                <div className="space-y-2 pt-1">
                  {onSelectStateForSimulation && (
                    <button
                      onClick={() => onSelectStateForSimulation(selectedState.name)}
                      className="btn-primary-cta w-full py-2.5 text-xs flex items-center justify-center space-x-1.5 cursor-pointer"
                    >
                      <span>{isHi ? `${selectedState.name} हेतु नीति सिमुलेशन चलाएं →` : `Simulate Policy for ${selectedState.name} →`}</span>
                    </button>
                  )}
                  {onSelectStateForAnalytics && (
                    <button
                      onClick={() => onSelectStateForAnalytics(selectedState.name)}
                      className="btn-secondary-cta w-full py-2 text-xs flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>{isHi ? 'विश्लेषण मैट्रिक्स में देखें' : 'Explore in Analytics Matrix'}</span>
                    </button>
                  )}
                  {onSelectStateForAI && (
                    <button
                      onClick={() => onSelectStateForAI(selectedState.name)}
                      className="btn-secondary-cta w-full py-2 text-xs flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>{isHi ? `${selectedState.name} पर एआई से पूछें` : `Ask AI Assistant about ${selectedState.name}`}</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setSelectedState(null)}
                  className="btn-secondary-cta w-full py-2 text-xs cursor-pointer"
                >
                  {isHi ? 'प्रोफ़ाइल बंद करें' : 'Close Profile'}
                </button>
              </div>
            </Card3D>
          )}
        </div>
      </div>
    </div>
  );
};
