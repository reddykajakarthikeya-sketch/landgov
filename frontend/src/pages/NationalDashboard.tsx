import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  MapPin, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Users, 
  Sliders, 
  FileText, 
  Layers, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  AlertTriangle, 
  Clock, 
  Activity, 
  FolderKanban, 
  Scale, 
  ExternalLink,
  Compass,
  Globe
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { Card3D } from '../components/ui/Card3D';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';

interface NationalDashboardProps {
  onNavigate: (tab: string) => void;
  onSelectStateForSimulation?: (stateName: string) => void;
}

export const NationalDashboard: React.FC<NationalDashboardProps> = ({ 
  onNavigate, 
  onSelectStateForSimulation 
}) => {
  const { user, isPolicymaker, isResearcher, isInstitutionAdmin, isPlatformAdmin, isPublicUser } = useAuth();
  const { t, language } = useTranslation();
  const isHi = language === 'hi';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    loadDashboard();
  }, [user]);

  async function loadDashboard() {
    setLoading(true);
    try {
      const overview = await api.getDashboardOverview();
      setData(overview);
    } catch (err) {
      console.error('Failed to load dashboard overview:', err);
    } finally {
      setLoading(false);
    }
  }

  // Interactive handler for Policymaker to sanction grants
  async function handleSanctionGrant(grantId: number) {
    try {
      await api.sanctionGrant(grantId);
      setActionNotice(isHi ? 'अनुदान प्रस्ताव स्वीकृत एवं डीओएलआर निधि से संवितरित किया गया!' : 'Grant proposal approved and sanctioned under DoLR budget allocation!');
      setTimeout(() => setActionNotice(null), 4000);
      loadDashboard();
    } catch (err) {
      console.error('Failed to sanction grant:', err);
      alert('Error updating grant status.');
    }
  }

  // Interactive handler for Researcher to toggle task
  async function handleToggleTask(projectId: number, taskId: number) {
    try {
      await api.toggleTask(projectId, taskId);
      loadDashboard();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  }

  // Interactive handler for Institution Admin to endorse grant
  async function handleEndorseGrant(grantId: number) {
    try {
      await api.endorseGrant(grantId);
      setActionNotice(isHi ? 'संस्थागत अनुशंसा दर्ज की गई एवं राष्ट्रीय समीक्षा को अग्रेषित की गई।' : 'Institutional endorsement submitted & forwarded to national review.');
      setTimeout(() => setActionNotice(null), 4000);
      loadDashboard();
    } catch (err) {
      console.error('Failed to endorse grant:', err);
      alert('Error endorsing grant.');
    }
  }

  // Translation helpers for role-specific dynamic headlines & summaries
  const getRoleBadge = (badge: string) => {
    if (!isHi) return badge;
    const map: Record<string, string> = {
      'Public Citizen': 'सार्वजनिक नागरिक',
      'Academic Researcher': 'अकादमिक शोधकर्ता',
      'Government Policymaker': 'सरकारी नीति निर्माता',
      'Institution Admin': 'संस्थान प्रशासक',
      'Platform Administrator': 'प्लेटफ़ॉर्म प्रशासक'
    };
    return map[badge] || badge;
  };

  const getRoleHeadline = (headline: string) => {
    if (!isHi) return headline;
    if (headline.includes('Public Citizen & Open Land Knowledge Portal')) {
      return 'सार्वजनिक नागरिक एवं खुला भूमि ज्ञान पोर्टल';
    }
    if (headline.includes('Research Workspace')) {
      return 'शोध कार्यक्षेत्र — डॉ. प्रियंका सेनगुप्ता';
    }
    if (headline.includes('Executive Policy Decision Console')) {
      return 'कार्यकारी नीति निर्णय कंसोल — श्रीमती सुनीता वर्मा, आईएएस';
    }
    if (headline.includes('Institutional Governance Console')) {
      return 'संस्थागत शासन कंसोल — राष्ट्रीय ग्रामीण विकास संस्थान';
    }
    if (headline.includes('National Platform Administration & Security Console')) {
      return 'राष्ट्रीय प्लेटफ़ॉर्म प्रशासन एवं सुरक्षा कंसोल — डॉ. राजेश्वर शर्मा';
    }
    return headline;
  };

  const getRoleSummary = (summary: string) => {
    if (!isHi) return summary;
    if (summary.includes('Explore official land administration publications')) {
      return 'ग्रामीण विकास मंत्रालय द्वारा प्रकाशित आधिकारिक भूमि प्रशासन प्रकाशनों, राष्ट्रीय भूकर प्रगति और खुले भू-स्थानिक डेटा का अन्वेषण करें।';
    }
    if (summary.includes('Manage ongoing land tenure studies')) {
      return 'चल रहे भूमि स्वामित्व अध्ययनों का प्रबंधन करें, डीआईएलआरएमपी 30मी उपग्रह परतों का विश्लेषण करें, और अनुमोदित अनुसंधान अनुदानों की प्रगति ट्रैक करें।';
    }
    if (summary.includes('Monitor national cadastral modernization targets')) {
      return 'राष्ट्रीय भूकर आधुनिकीकरण लक्ष्यों की निगरानी करें, उच्च विवाद वाले राज्यों की पहचान करें, और पारदर्शी परिदृश्य सिमुलेशन का मूल्यांकन करें।';
    }
    if (summary.includes('Oversee institutional land governance research initiatives')) {
      return 'संस्थागत भूमि शासन अनुसंधान पहलों की निगरानी करें, संकाय अनुदानों को मंजूरी दें, और एनआईआरडीपीआर कंसोर्टियम माइलस्टोन्स की समीक्षा करें।';
    }
    if (summary.includes('Apex system governance')) {
      return 'शीर्ष प्रणाली शासन: 5 उपयोगकर्ता भूमिकाओं में पहुंच प्रबंधित करें, एपीआई एकीकरण की निगरानी करें, और अपरिवर्तनीय सुरक्षा ऑडिट की पुष्टि करें।';
    }
    return summary;
  };

  const getQuickActionLabel = (act: any) => {
    if (!isHi) return act.label;
    const map: Record<string, string> = {
      'Search Research Repository': 'अनुसंधान संग्रह खोजें',
      'Explore India GIS Map': 'भारत जीआईएस मानचित्र देखें',
      'Consult AI Research Assistant': 'एआई अनुसंधान सहायक से पूछें',
      'Review Scope of Study': 'अध्ययन का दायरा समीक्षा करें',
      'Create New Research Project': 'नया अनुसंधान प्रोजेक्ट बनाएं',
      'Run Policy Simulation Lab': 'नीति सिमुलेशन लैब चलाएं',
      'Apply for SIH Innovation Grant': 'एसआईएच इनोवेशन अनुदान हेतु आवेदन करें',
      'Inspect GIS Spatial Map': 'जीआईएस स्थानिक मानचित्र का निरीक्षण करें',
      'Inspect State Watchlist': 'राज्य निगरानी सूची का निरीक्षण करें',
      'Open Simulation Sandbox': 'सिमुलेशन सैंडबॉक्स खोलें',
      'Review Grant Applications': 'अनुदान आवेदनों की समीक्षा करें',
      'Examine Acquisition Corridors': 'अधिग्रहण कॉरिडोर का परीक्षण करें',
      'Manage Institutional Projects': 'संस्थागत परियोजनाओं का प्रबंधन करें',
      'Endorse Grant Proposals': 'अनुदान प्रस्तावों का अनुमोदन करें',
      'View Faculty Directory': 'संकाय निर्देशिका देखें',
      'Track Research Milestones': 'शोध मील के पत्थर ट्रैक करें',
      'Manage User Accounts': 'उपयोगकर्ता खाते प्रबंधित करें',
      'View System Audit Logs': 'सिस्टम ऑडिट लॉग देखें',
      'Verify SIH Dataset Integrity': 'एसआईएच डेटासेट अखंडता सत्यापित करें',
      'Check Microservice Health': 'माइक्रोसर्विस स्थिति जांचें'
    };
    return map[act.label] || act.label;
  };

  const translateKpiLabel = (lbl: string) => {
    if (!isHi) return lbl;
    const map: Record<string, string> = {
      'Open Research Documents': 'खुले अनुसंधान दस्तावेज़',
      'National RoR Digitization': 'राष्ट्रीय आरओआर डिजिटलीकरण',
      'Cadastral Geo-Referencing': 'भूकर भू-संदर्भन',
      'Open Spatial Datasets': 'खुले स्थानिक डेटासेट',
      'My Research Projects': 'मेरी अनुसंधान परियोजनाएं',
      'Pending Project Tasks': 'लंबित परियोजना कार्य',
      'Grant Proposals Submitted': 'प्रस्तुत अनुदान प्रस्ताव',
      'Saved Policy Scenarios': 'सहेजे गए नीति परिदृश्य',
      'State Intervention Hotspots': 'राज्य हस्तक्षेप हॉटस्पॉट',
      'Acquisition Delay Corridors': 'अधिग्रहण विलंब कॉरिडोर',
      'Pending Grant Sanctions': 'लंबित अनुदान स्वीकृतियां',
      'Active Policy Scenarios': 'सक्रिय नीति परिदृश्य',
      'Institutional Projects': 'संस्थागत परियोजनाएं',
      'Affiliated Members': 'संबद्ध सदस्य',
      'Institutional Grant Proposals': 'संस्थागत अनुदान प्रस्ताव',
      'Consortium Progress': 'कंसोर्टियम प्रगति',
      'Total Registered Users': 'कुल पंजीकृत उपयोगकर्ता',
      'Verified Datasets': 'सत्यापित डेटासेट',
      'Security Audit Events': 'सुरक्षा ऑडिट घटनाएं',
      'System Gateway Health': 'सिस्टम गेटवे स्वास्थ्य'
    };
    return map[lbl] || lbl;
  };

  const translateKpiTrend = (trend: string) => {
    if (!isHi) return trend;
    const map: Record<string, string> = {
      '+5 SIH 2026': '+5 एसआईएच 2026',
      'Active DILRMP': 'सक्रिय डीआईएलआरएमपी',
      '+12.4% YoY': '+12.4% वार्षिक',
      '100% Verified': '100% सत्यापित',
      '1 Grant Sanctioned': '1 अनुदान स्वीकृत',
      '2 Due This Month': '2 इस माह देय',
      'Under Review': 'समीक्षाधीन',
      'Rule-Engine Persisted': 'नियम-इंजन सहेजा गया',
      'High Priority': 'उच्च प्राथमिकता',
      'Critical Bottlenecks': 'गंभीर अड़चनें',
      'Sanction Required': 'स्वीकृति आवश्यक',
      'Interactive Engine': 'इंटरएक्टिव इंजन',
      'NIRDPR Consortium': 'एनआईआरडीपीआर कंसोर्टियम',
      'Faculty & Fellows': 'संकाय एवं अध्येता',
      '1 Endorsement Pending': '1 अनुमोदन लंबित',
      'Milestone Target': 'माइलस्टोन लक्ष्य',
      '5 System Roles': '5 प्रणाली भूमिकाएं',
      'MoRD SIH Verified': 'एमओआरडी एसआईएच सत्यापित',
      'Zero Security Breaches': 'शून्य सुरक्षा उल्लंघन',
      'All APIs Online': 'सभी एपीआई ऑनलाइन'
    };
    return map[trend] || trend;
  };

  const translateKpiSub = (sub: string) => {
    if (!isHi) return sub;
    const map: Record<string, string> = {
      'DoLR Revenue Monitor': 'डीओएलआर राजस्व निगरानी',
      'DILRMP Target': 'डीआईएलआरएमपी लक्ष्य',
      'Updated Daily': 'दैनिक अद्यतन',
      'MoRD Sanctioned': 'एमओआरडी स्वीकृत',
      'Peer-Reviewed': 'सहकर्मी-समीक्षित',
      'Dept. of Land Resources': 'भूमि संसाधन विभाग',
      'Across 4 Departments': '4 विभागों में',
      'MoRD Pilot Call': 'एमओआरडी पायलट कॉल',
      'Direct Research Aid': 'प्रत्यक्ष शोध सहायता',
      'Across 5 Roles': '5 भूमिकाओं में',
      'Immutable Ledger': 'अपरिवर्तनीय लेजर',
      'ISRO & NJDG Connectors': 'इसरो एवं एनजेडीजी कनेक्टर्स',
      'Peer-Reviewed Open Access': 'सहकर्मी-समीक्षित ओपन एक्सेस',
      'DoLR Problem Statements': 'डीओएलआर समस्या विवरण',
      'All States & UTs': 'सभी राज्य एवं केंद्र शासित प्रदेश',
      'ISRO Bhuvan & Cadastral': 'इसरो भुवन एवं भूकर'
    };
    return map[sub] || sub;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="liquid-glass-elevated p-8 rounded-3xl flex flex-col items-center space-y-3 shadow-2xl border border-white/10 bg-[#151919]/90">
          <div className="w-10 h-10 border-4 border-white/20 border-t-[#B7E300] rounded-full animate-spin"></div>
          <p className="text-xs font-mono text-[#F2F4EF]">
            {isHi ? 'भूमिका-विशिष्ट कमांड सेंटर एवं राष्ट्रीय आंकड़े लोड हो रहे हैं...' : 'INITIALIZING NEO-INSTITUTIONAL COMMAND CONSOLE...'}
          </p>
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
    <div className="space-y-8">
      {/* =========================================================================
          1. NEO-INSTITUTIONAL ASYMMETRIC HERO (LIQUID CHROME × TOPOGRAPHIC TERRAIN)
      ========================================================================= */}
      <section className="relative pt-6 pb-4 md:pt-10 md:pb-8 animate-editorial-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Asymmetric Editorial Hierarchy */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Overline with Acid Green Dot */}
            <div className="inline-flex items-center space-x-2.5 px-3 py-1 rounded-full liquid-glass-pill text-[11px] font-mono text-[#F2F4EF] border border-white/15">
              <span className="w-2 h-2 rounded-full bg-[#B7E300] animate-pulse"></span>
              <span className="font-syne font-bold uppercase tracking-widest text-[#B7E300]">
                {language === 'hi' ? 'राष्ट्रीय डिजिटल मंच' : 'NATIONAL DIGITAL PLATFORM'}
              </span>
              <span className="text-[#6F7772]">/</span>
              <span className="text-[#A7ADA8] text-[10px]">
                {isHi ? 'ग्रामीण विकास मंत्रालय • भारत सरकार' : 'MoRD • DoLR GOVT OF INDIA'}
              </span>
            </div>

            {/* Major Hero Headline */}
            <h1 className="hero-editorial-heading chromatic-hover">
              {isHi ? (
                <>
                  बेहतर भूमि भविष्य हेतु<br />
                  <span className="chrome-text italic">अनुसंधान एवं नीति बुद्धिमत्ता</span>
                </>
              ) : (
                <>
                  Research for<br />
                  <span className="chrome-text italic font-serif">a Better Land Future</span>
                </>
              )}
            </h1>

            {/* Subtitle Statement */}
            <p className="text-sm md:text-base text-[#A7ADA8] max-w-xl leading-relaxed font-normal">
              {isHi
                ? 'अनुसंधान, नीति नवाचार और साक्ष्य-आधारित भूमि प्रशासन के लिए एक एकीकृत राष्ट्रीय मंच। बहु-राज्य कैडस्ट्रल रिकॉर्ड और पारदर्शी सिमुलेशन मॉडल।'
                : 'A unified platform for research, policy innovation, and evidence-based land governance. Unifying multi-state cadastral records and transparent mathematical simulations.'}
            </p>

            {/* Controlled Action Controls */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('repository')}
                className="btn-hero-cta text-xs sm:text-sm"
              >
                <span>{isHi ? 'मंच का अन्वेषण करें' : 'EXPLORE PLATFORM'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('gis-explorer')}
                className="btn-secondary-cta py-4 px-7 text-xs sm:text-sm"
              >
                <Compass className="w-4 h-4 text-[#B7E300]" />
                <span>{isHi ? 'जीआईएस भू-स्थानिक मानचित्र' : 'LEARN MORE'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: Major Liquid Chrome Landform Visual (Topographic Terrain Object) */}
          <div className="lg:col-span-5 relative">
            <Card3D maxTilt={6} className="liquid-glass-elevated rounded-3xl p-6 border border-white/20 shadow-2xl relative overflow-hidden group">
              <div className="glass-specular-top" />

              {/* Header Telemetry */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10 text-[10px] font-mono">
                <span className="text-[#A7ADA8] flex items-center space-x-1.5">
                  <Globe className="w-3.5 h-3.5 text-[#B7E300]" />
                  <span>TOPOGRAPHIC TERRAIN CADASTRAL DATA</span>
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#B7E300]/15 text-[#B7E300] font-bold border border-[#B7E300]/30">
                  22.5937° N, 78.9629° E
                </span>
              </div>

              {/* Realistic Liquid-Chrome Landform / Contour SVG Visualization */}
              <div className="relative h-60 w-full my-3 flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-b from-[#101313] to-[#080A0A] border border-white/10">
                {/* Radial Iridescent Specular Light */}
                <div className="absolute inset-0 bg-radial from-white/10 via-transparent to-transparent pointer-events-none" />

                <svg viewBox="0 0 400 240" className="w-full h-full p-2" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="chromeTerrain1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#F5F5F2" stopOpacity="0.9" />
                      <stop offset="30%" stopColor="#C7CBC7" stopOpacity="0.75" />
                      <stop offset="60%" stopColor="#747A76" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#929792" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="chromeTerrain2" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#E5E7E3" stopOpacity="0.6" />
                      <stop offset="45%" stopColor="#747A76" stopOpacity="0.3" />
                      <stop offset="80%" stopColor="#B7E300" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#F5F5F2" stopOpacity="0.8" />
                    </linearGradient>
                    <linearGradient id="acidGlow" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#B7E300" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="#B7E300" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#78C8C8" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>

                  {/* Flowing Cadastral Contour Elevation Curves */}
                  <path d="M 20 200 C 90 140, 160 210, 220 160 C 280 110, 330 180, 380 150 L 380 230 L 20 230 Z" fill="url(#chromeTerrain1)" opacity="0.45" />
                  <path d="M 20 180 C 80 120, 140 170, 210 130 C 280 90, 320 150, 380 120" stroke="url(#chromeTerrain1)" strokeWidth="1.5" strokeDasharray="3 3" />
                  
                  <path d="M 30 160 C 100 80, 170 150, 240 90 C 310 40, 340 120, 370 80 L 370 230 L 30 230 Z" fill="url(#chromeTerrain2)" opacity="0.35" />
                  <path d="M 30 140 C 110 60, 180 130, 250 70 C 310 30, 350 100, 370 60" stroke="#F5F5F2" strokeWidth="2" />
                  
                  <path d="M 50 110 C 120 40, 190 90, 260 50 C 320 15, 345 60, 360 40" stroke="url(#acidGlow)" strokeWidth="2.5" />
                  <circle cx="260" cy="50" r="5" fill="#B7E300" />
                  <circle cx="260" cy="50" r="10" stroke="#B7E300" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" />

                  {/* Elevation Readout Markers */}
                  <text x="275" y="55" fill="#F2F4EF" fontSize="9" fontFamily="monospace">ELEV: +640m</text>
                  <text x="45" y="195" fill="#A7ADA8" fontSize="8" fontFamily="monospace">SECTOR: CADASTRAL-NORTH</text>
                  <text x="260" y="215" fill="#B7E300" fontSize="8" fontFamily="monospace">● DILRMP 14-STATES SYNC</text>
                </svg>

                {/* Subtle Iridescent Chrome Floating Pill */}
                <div className="absolute bottom-3 left-3 bg-[#080A0A]/85 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[10px] text-[#F2F4EF] font-mono flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B7E300]" />
                  <span>SRISHTI-DRISHTI 30M TOPOGRAPHY</span>
                </div>
              </div>

              {/* Bottom Real-time Telemetry Bar */}
              <div className="flex items-center justify-between text-[11px] pt-1 text-[#A7ADA8]">
                <span>RoR Computerization: <strong className="text-[#F2F4EF]">97.8%</strong></span>
                <span className="text-[#B7E300] font-mono font-bold">+12.4% YoY</span>
                <span>Active Parcels: <strong className="text-[#F2F4EF]">6.4 Lakh</strong></span>
              </div>
            </Card3D>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. ACID MARQUEE STRIP (EDITORIAL EXPERIMENTAL DIVIDER)
      ========================================================================= */}
      <div className="w-full overflow-hidden py-3 border-y border-white/10 bg-[#101313]/60 backdrop-blur-md select-none">
        <div className="acid-marquee-track text-xs font-mono tracking-widest text-[#A7ADA8] uppercase">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center space-x-6 mx-4">
              <span className="text-[#F2F4EF] font-bold">LAND</span>
              <span className="text-[#B7E300]">◆</span>
              <span>RESEARCH</span>
              <span className="text-[#B7E300]">◆</span>
              <span className="text-[#F2F4EF] font-bold">POLICY</span>
              <span className="text-[#B7E300]">◆</span>
              <span>DATA</span>
              <span className="text-[#B7E300]">◆</span>
              <span className="text-[#F2F4EF] font-bold">GOVERNANCE</span>
              <span className="text-[#B7E300]">◆</span>
              <span>GIS</span>
              <span className="text-[#B7E300]">◆</span>
              <span className="text-[#F2F4EF] font-bold">EVIDENCE</span>
              <span className="text-[#B7E300]">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* =========================================================================
          3. FLOATING GLASS DATASET VERIFICATION BANNER
      ========================================================================= */}
      <div className="liquid-glass rounded-2xl p-4 md:p-5 border border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden backdrop-blur-xl bg-[#151919]/70">
        <div className="glass-specular-top" />
        <div className="flex items-start space-x-3.5 relative z-10">
          <div className="p-2.5 bg-[#B7E300]/15 text-[#B7E300] rounded-full shrink-0 border border-[#B7E300]/30 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-[#B7E300]" />
          </div>
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="font-bold text-[#F5F5F2] text-sm md:text-base">
                {t('dashboard_roles.sih_verified_title')}
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full liquid-glass-pill text-[#B7E300] font-bold font-mono border border-[#B7E300]/40 bg-[#B7E300]/10 shadow-xs">
                {t('dashboard_roles.sih_verified_docs')}
              </span>
            </div>
            <p className="text-xs text-[#A7ADA8] mt-0.5 leading-relaxed max-w-3xl">
              {t('dashboard_roles.sih_verified_desc')}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 shrink-0 relative z-10">
          <button
            onClick={() => onNavigate('repository')}
            className="btn-secondary-cta text-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#B7E300]" />
            <span>{t('dashboard_roles.open_repository')}</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 liquid-glass-pill bg-[#B7E300]/15 border border-[#B7E300]/40 rounded-2xl text-[#F2F4EF] text-xs flex items-center space-x-2.5 backdrop-blur-xl shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#B7E300] shrink-0" />
          <span className="font-semibold">{actionNotice}</span>
        </div>
      )}

      {/* =========================================================================
          4. EXECUTIVE POLICY CONSOLE / ROLE WORKSPACE
      ========================================================================= */}
      <div className="liquid-glass-elevated text-[#F2F4EF] p-6 md:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden border border-white/15 backdrop-blur-2xl bg-[#151919]/80">
        <div className="glass-specular-top" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold font-mono tracking-wider uppercase liquid-glass-pill text-[#B7E300] border border-[#B7E300]/30 bg-[#B7E300]/10">
                {getRoleBadge(roleDashboard.role_badge)}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[#A7ADA8] text-xs font-medium">
                {isHi ? (isPolicymaker ? 'भूमि संसाधन विभाग, ग्रामीण विकास मंत्रालय' : isResearcher ? 'भारतीय प्रौद्योगिकी संस्थान दिल्ली' : isInstitutionAdmin ? 'राष्ट्रीय ग्रामीण विकास एवं पंचायती राज संस्थान' : isPlatformAdmin ? 'राष्ट्रीय सूचना विज्ञान केंद्र' : 'सार्वजनिक नागरिक अनुसंधान पोर्टल') : (roleDashboard.organization || 'Government of India')}
              </span>
            </div>
            <h2 className="text-xl md:text-3xl font-bold mt-2 text-[#F5F5F2] tracking-tight">
              {getRoleHeadline(roleDashboard.headline)}
            </h2>
            <p className="text-[#A7ADA8] text-xs md:text-sm mt-1.5 max-w-4xl leading-relaxed">
              {getRoleSummary(roleDashboard.summary)}
            </p>
          </div>

          {/* Quick Actions Shortcuts with liquid chrome buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto relative z-10">
            {roleDashboard.quick_actions?.map((act: any, idx: number) => (
              <button
                key={idx}
                onClick={() => onNavigate(act.tab)}
                className={act.primary ? "btn-primary-cta text-xs" : "btn-secondary-cta text-xs"}
              >
                <span>{getQuickActionLabel(act)}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>

        {/* 4 TRANSLUCENT FLOATING KPI CARDS WITH 3D MOUSE TRACKING */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2 relative z-10">
          {kpiCards.map((kpi: any, idx: number) => (
            <Card3D 
              key={idx} 
              className="liquid-glass-card p-4 md:p-5 rounded-2xl border border-white/10 hover:border-[#B7E300]/40 shadow-md backdrop-blur-xl" 
              maxTilt={4.5}
            >
              <div className="glass-specular-top" />
              <div className="flex items-center justify-between text-[11px] text-[#A7ADA8]">
                <span className="truncate pr-1 font-medium">{translateKpiLabel(kpi.label)}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full liquid-glass-pill font-mono text-[#B7E300] border border-[#B7E300]/30 bg-[#B7E300]/10 shrink-0 font-medium">
                  {translateKpiTrend(kpi.trend)}
                </span>
              </div>
              <p className="text-2xl md:text-3xl font-extrabold text-[#F5F5F2] mt-2.5 tracking-tight font-syne">{kpi.value}</p>
              <p className="text-[11px] text-[#6F7772] mt-1 truncate">{translateKpiSub(kpi.sub)}</p>
            </Card3D>
          ))}
        </div>
      </div>

      {/* =========================================================================
          5. ROLE-SPECIFIC INTERACTIVE WORKSPACE SECTIONS
      ========================================================================= */}

      {/* 1. PUBLIC CITIZEN SECTION */}
      {isPublicUser && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 liquid-glass p-6 rounded-3xl shadow-xl space-y-4 border border-white/10 bg-[#151919]/70">
            <div className="glass-specular-top" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-[#F5F5F2] flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-[#B7E300]" />
                <span>{t('dashboard_roles.featured_open_datasets')}</span>
              </h3>
              <button 
                onClick={() => onNavigate('repository')}
                className="text-xs text-[#B7E300] font-bold hover:underline cursor-pointer"
              >
                {t('dashboard_roles.browse_all_docs')}
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roleSections.featured_datasets?.map((ds: any, idx: number) => (
                <div key={idx} className="liquid-glass-card p-4 rounded-xl text-xs space-y-1.5 border border-white/10">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#F2F4EF] truncate">{ds.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md font-mono text-[#B7E300] border border-[#B7E300]/30 bg-[#B7E300]/10">{ds.format}</span>
                  </div>
                  <p className="text-[11px] text-[#A7ADA8]">
                    {isHi ? 'श्रेणी' : 'Category'}: {ds.category}
                  </p>
                  <p className="text-[10px] text-[#6F7772]">
                    {isHi ? 'कवरेज' : 'Coverage'}: {ds.coverage}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 liquid-glass-card rounded-2xl text-xs text-[#F2F4EF] flex items-start space-x-3 border border-[#B7E300]/30 bg-[#B7E300]/5">
              <Sparkles className="w-5 h-5 text-[#B7E300] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#F5F5F2] text-sm">{t('dashboard_roles.need_answers_title')}</p>
                <p className="text-[11px] text-[#A7ADA8] mt-1 leading-relaxed">
                  {t('dashboard_roles.need_answers_desc')}
                </p>
                <button 
                  onClick={() => onNavigate('ai-assistant')}
                  className="btn-primary-cta text-[11px] mt-3"
                >
                  {t('dashboard_roles.consult_ai')}
                </button>
              </div>
            </div>
          </div>

          <div className="liquid-glass border border-white/10 p-6 rounded-3xl shadow-xl space-y-4 text-xs bg-[#151919]/70">
            <div className="glass-specular-top" />
            <div className="flex items-center space-x-2 text-[#F5F5F2] font-bold text-sm">
              <Lock className="w-4 h-4 text-[#B7E300]" />
              <span>{isHi ? 'सार्वजनिक दायरा एवं भूमिका विशेषाधिकार' : 'Public Scope & Role Privileges'}</span>
            </div>
            <p className="text-[#A7ADA8] leading-relaxed text-[11px]">
              {isHi 
                ? 'सार्वजनिक अतिथि के रूप में, आप 130+ शोध पत्रों, राष्ट्रीय संकेतकों और सार्वजनिक जीआईएस परतों तक पहुंच सकते हैं। नीति सिमुलेशन और अनुसंधान कार्यक्षेत्र के लिए संबंधित भूमिका पर स्विच करें।'
                : (roleSections.public_notice || 'As a public visitor, you have unrestricted access to open research papers, national DILRMP indicators, and open GIS layers. Switch personas to test restricted workflows.')}
            </p>
            <div className="divide-y divide-white/10 pt-1 text-[11px]">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#F2F4EF] font-medium">{isHi ? 'सार्वजनिक अनुसंधान रिपॉजिटरी' : 'Public Research Repository'}</span>
                <span className="text-[#B7E300] font-bold">{isHi ? 'सुलभ' : 'Accessible'}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#F2F4EF] font-medium">{isHi ? 'इंटरैक्टिव जीआईएस मानचित्र' : 'Interactive GIS Map'}</span>
                <span className="text-[#B7E300] font-bold">{isHi ? 'सुलभ' : 'Accessible'}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#F2F4EF] font-medium">{isHi ? 'नीति सिमुलेशन इंजन' : 'Policy Simulation Engine'}</span>
                <span className="text-[#C5A46D] font-bold">{isHi ? 'उच्च अधिकार (नीति निर्माता)' : 'Elevated (Policymaker)'}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-[#F2F4EF] font-medium">{isHi ? 'सहयोगी कार्यक्षेत्र' : 'Collaborative Workspace'}</span>
                <span className="text-[#C5A46D] font-bold">{isHi ? 'उच्च अधिकार (शोधकर्ता)' : 'Elevated (Researcher)'}</span>
              </div>
            </div>
            <p className="text-[10px] text-[#6F7772] pt-1 leading-normal font-mono">
              {isHi 
                ? '* शीर्ष नेविगेशन बार में भूमिका चयनकर्ता का उपयोग करके संस्थागत एवं नीति निर्माता कार्यप्रवाह का परीक्षण करें।'
                : '* Switch role using the Role Switcher dropdown in the top navbar to evaluate institutional & policymaker workflows.'}
            </p>
          </div>
        </div>
      )}

      {/* 2. RESEARCHER SECTION */}
      {isResearcher && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 liquid-glass p-6 rounded-3xl shadow-xl space-y-4 border border-white/10 bg-[#151919]/70">
            <div className="glass-specular-top" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-[#F5F5F2] flex items-center space-x-2">
                <FolderKanban className="w-4 h-4 text-[#B7E300]" />
                <span>{isHi ? 'मेरी सक्रिय अनुसंधान परियोजनाएं' : 'My Active Research Projects'}</span>
              </h3>
              <button 
                onClick={() => onNavigate('projects')}
                className="text-xs text-[#B7E300] font-bold hover:underline cursor-pointer"
              >
                {isHi ? 'कार्यक्षेत्र पर जाएं →' : 'Go to Workspace →'}
              </button>
            </div>
            <div className="space-y-3">
              {roleSections.my_projects?.map((proj: any) => (
                <div key={proj.id} className="liquid-glass-card p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs border border-white/10">
                  <div>
                    <h4 className="font-bold text-[#F5F5F2] text-sm">{proj.title}</h4>
                    <p className="text-[11px] text-[#A7ADA8] mt-1">
                      {isHi ? 'डोमेन' : 'Domain'}: <span className="font-semibold text-[#F2F4EF]">{proj.domain}</span> • {isHi ? 'क्षेत्र' : 'Region'}: {proj.target_state} • {isHi ? 'बजट' : 'Budget'}: {proj.budget}
                    </p>
                    <div className="flex items-center space-x-3 text-[10px] text-[#6F7772] mt-1.5 font-mono">
                      <span>{isHi ? `कार्य: ${proj.completed_tasks}/${proj.tasks_count} पूर्ण` : `Tasks: ${proj.completed_tasks}/${proj.tasks_count} completed`}</span>
                      <span>{isHi ? 'स्थिति: ' : 'Status: '}<strong className="text-[#B7E300] uppercase">{proj.status}</strong></span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onNavigate('projects')}
                    className="btn-secondary-cta text-xs shrink-0"
                  >
                    {isHi ? 'कार्यक्षेत्र खोलें' : 'Open Workspace'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="liquid-glass p-6 rounded-3xl shadow-xl space-y-4 text-xs border border-white/10 bg-[#151919]/70">
            <div className="glass-specular-top" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10 font-bold text-[#F5F5F2]">
              <span className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-[#C5A46D]" />
                <span>{t('dashboard_roles.my_tasks_title')}</span>
              </span>
              <span className="text-[10px] text-[#6F7772] font-mono">{t('dashboard_roles.click_to_toggle')}</span>
            </div>
            <div className="space-y-2.5">
              {roleSections.my_tasks?.length === 0 ? (
                <p className="text-[#6F7772] text-center py-4">{t('dashboard_roles.no_pending_tasks')}</p>
              ) : (
                roleSections.my_tasks?.map((task: any) => (
                  <div key={task.id} className="liquid-glass-card p-3 rounded-xl flex items-start space-x-3 border border-white/10">
                    <input 
                      type="checkbox"
                      checked={task.status === 'completed'}
                      onChange={() => handleToggleTask(task.project_id, task.id)}
                      className="mt-0.5 rounded text-[#B7E300] cursor-pointer accent-[#B7E300]"
                    />
                    <div className="flex-1">
                      <p className={`font-semibold ${task.status === 'completed' ? 'line-through text-[#6F7772]' : 'text-[#F2F4EF]'}`}>
                        {task.title}
                      </p>
                      <div className="flex items-center space-x-2 text-[10px] text-[#A7ADA8] mt-1 font-mono">
                        <span className={`px-2 py-0.5 rounded-full uppercase font-bold text-[9px] ${task.priority === 'high' ? 'bg-[#C56A9A]/15 text-[#C56A9A] border border-[#C56A9A]/30' : 'liquid-glass-pill text-[#A7ADA8] border border-white/10'}`}>
                          {task.priority}
                        </span>
                        <span>{t('dashboard_roles.due_date')} {task.due_date}</span>
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
          <div className="md:col-span-2 liquid-glass p-6 rounded-3xl shadow-xl space-y-4 border border-white/10 bg-[#151919]/70">
            <div className="glass-specular-top" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-[#F5F5F2] flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-[#B7E300]" />
                <span>{t('dashboard_roles.state_watchlist_title')}</span>
              </h3>
              <span className="text-[10px] text-[#A7ADA8] font-mono">{t('dashboard_roles.state_watchlist_monitor')}</span>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5 text-[#A7ADA8] uppercase text-[10px] border-b border-white/10 font-mono">
                  <tr>
                    <th className="py-3 px-3.5 font-bold text-[#F5F5F2]">{t('dashboard_roles.state_name')}</th>
                    <th className="py-3 px-3 font-semibold">{t('dashboard_roles.ror_comp')}</th>
                    <th className="py-3 px-3 font-semibold">{t('dashboard_roles.cadastral_comp')}</th>
                    <th className="py-3 px-3 font-semibold">{t('dashboard_roles.dispute_index')}</th>
                    <th className="py-3 px-3.5 text-right font-semibold">{t('dashboard_roles.policy_action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-transparent text-[#F2F4EF]">
                  {roleSections.state_watch_list?.map((s: any, idx: number) => (
                    <tr key={idx} className="hover:bg-white/5 transition">
                      <td className="py-3 px-3.5 font-bold text-[#F5F5F2]">{s.name}</td>
                      <td className="py-3 px-3 font-semibold text-[#A7ADA8]">{s.dilrmp_ror_pct}%</td>
                      <td className="py-3 px-3 font-semibold text-[#A7ADA8]">{s.cadastral_pct}%</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-[#B7E300] font-mono">{s.dispute_index} / 100</span>
                      </td>
                      <td className="py-3 px-3.5 text-right">
                        <button
                          onClick={() => {
                            if (onSelectStateForSimulation) {
                              onSelectStateForSimulation(s.name);
                            } else {
                              onNavigate('simulation');
                            }
                          }}
                          className="btn-secondary-cta py-1 px-3 text-[11px] cursor-pointer"
                        >
                          {t('dashboard_roles.simulate_strategy')}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="liquid-glass p-6 rounded-3xl shadow-xl space-y-4 text-xs border border-white/10 bg-[#151919]/70">
            <div className="glass-specular-top" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10 font-bold text-[#F5F5F2]">
              <span className="flex items-center space-x-2">
                <Award className="w-4 h-4 text-[#B7E300]" />
                <span>{t('dashboard_roles.grant_queue_title')}</span>
              </span>
              <span className="text-[10px] text-[#A7ADA8] font-mono">{t('dashboard_roles.grant_approval')}</span>
            </div>
            <div className="space-y-3">
              {roleSections.pending_sanctions?.length === 0 ? (
                <p className="text-[#6F7772] text-center py-4">{t('dashboard_roles.no_grants_pending')}</p>
              ) : (
                roleSections.pending_sanctions?.map((g: any) => (
                  <div key={g.id} className="liquid-glass-card p-4 rounded-xl space-y-2 border border-white/10">
                    <p className="font-bold text-[#F5F5F2] leading-snug">{g.title}</p>
                    <p className="text-[10px] text-[#A7ADA8]">
                      PI: {g.applicant} • {g.institution}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-bold text-[#B7E300] text-xs font-mono">{g.budget}</span>
                      <button
                        onClick={() => handleSanctionGrant(g.id)}
                        className="btn-primary-cta py-1 px-3.5 text-[10px] cursor-pointer"
                      >
                        {t('dashboard_roles.sanction_button')}
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
          <div className="md:col-span-2 liquid-glass p-6 rounded-3xl shadow-xl space-y-4 border border-white/10 bg-[#151919]/70">
            <div className="glass-specular-top" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-[#F5F5F2] flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-[#B7E300]" />
                <span>{isHi ? 'संस्थागत अनुसंधान परियोजना रजिस्ट्री' : 'Institutional Research Projects Registry'}</span>
              </h3>
              <button 
                onClick={() => onNavigate('projects')}
                className="text-xs text-[#B7E300] font-bold hover:underline cursor-pointer"
              >
                {isHi ? 'परियोजना प्रबंधन →' : 'Manage Projects →'}
              </button>
            </div>
            <div className="space-y-3">
              {roleSections.institution_projects?.map((proj: any) => (
                <div key={proj.id} className="liquid-glass-card p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs border border-white/10">
                  <div>
                    <h4 className="font-bold text-[#F5F5F2] text-sm">{proj.title}</h4>
                    <p className="text-[11px] text-[#A7ADA8] mt-1">
                      {isHi ? 'प्रमुख अन्वेषक' : 'Lead Investigator'}: <span className="font-semibold text-[#F2F4EF]">{proj.lead}</span> • {isHi ? 'बजट' : 'Budget'}: {proj.budget}
                    </p>
                    <p className="text-[10px] text-[#6F7772] mt-0.5 font-mono">
                      {isHi ? 'स्थिति' : 'Status'}: <strong className="text-[#B7E300] uppercase">{proj.status}</strong> • {isHi ? 'कार्य' : 'Tasks'}: {proj.tasks_count}
                    </p>
                  </div>
                  <button 
                    onClick={() => onNavigate('projects')}
                    className="btn-secondary-cta py-1.5 px-4 text-xs shrink-0 cursor-pointer"
                  >
                    {isHi ? 'प्रगति समीक्षा' : 'Review Progress'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="liquid-glass p-6 rounded-3xl shadow-xl space-y-4 text-xs border border-white/10 bg-[#151919]/70">
            <div className="glass-specular-top" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10 font-bold text-[#F5F5F2]">
              <span className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#B7E300]" />
                <span>{isHi ? 'संबद्ध संकाय एवं शोध अध्येता' : 'Affiliated Faculty & Fellows'}</span>
              </span>
              <button 
                onClick={() => onNavigate('admin-users')}
                className="text-[10px] text-[#B7E300] font-bold hover:underline cursor-pointer"
              >
                {t('common.view_all')}
              </button>
            </div>
            <div className="space-y-2.5">
              {roleSections.institution_members?.map((m: any) => (
                <div key={m.id} className="liquid-glass-card p-3 rounded-xl flex items-center justify-between border border-white/10">
                  <div>
                    <p className="font-semibold text-[#F5F5F2]">{m.name}</p>
                    <p className="text-[10px] text-[#A7ADA8]">{m.department}</p>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-mono text-[#F5F5F2] font-bold border border-white/15 bg-white/5">
                    {m.role}
                  </span>
                </div>
              ))}
            </div>

            {roleSections.institution_grants?.length > 0 && (
              <div className="pt-3 border-t border-white/10">
                <h4 className="font-bold text-[#F5F5F2] mb-2">{isHi ? 'लंबित अनुदान अनुमोदन' : 'Pending Grant Endorsements'}</h4>
                {roleSections.institution_grants.map((g: any) => (
                  <div key={g.id} className="p-3 liquid-glass-card rounded-xl space-y-1.5 border border-white/10">
                    <p className="font-semibold text-[#F2F4EF]">{g.proposal}</p>
                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="font-bold text-[#B7E300] font-mono">{g.budget}</span>
                      <button
                        onClick={() => handleEndorseGrant(g.id)}
                        className="btn-primary-cta py-1 px-3.5 text-[10px] cursor-pointer"
                      >
                        {isHi ? 'अनुमोदन करें' : 'Endorse'}
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
          <div className="md:col-span-2 liquid-glass p-6 rounded-3xl shadow-xl space-y-4 border border-white/10 bg-[#151919]/70">
            <div className="glass-specular-top" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-[#F5F5F2] flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#B7E300]" />
                <span>{t('dashboard_roles.recent_security_audit')}</span>
              </h3>
              <button 
                onClick={() => onNavigate('admin-audit')}
                className="text-xs text-[#B7E300] font-bold hover:underline cursor-pointer"
              >
                {t('dashboard_roles.view_full_audit')}
              </button>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-white/5 text-[#A7ADA8] uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="py-3 px-3.5">{t('admin.event_time')}</th>
                    <th className="py-3 px-3">{t('admin.action')}</th>
                    <th className="py-3 px-3">{t('admin.actor')}</th>
                    <th className="py-3 px-3.5">{t('admin.module')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-transparent text-[11px] text-[#F2F4EF]">
                  {roleSections.recent_audit_logs?.map((log: any) => (
                    <tr key={log.id} className="hover:bg-white/5 font-sans transition">
                      <td className="py-2.5 px-3.5 font-mono text-[10px] text-[#6F7772]">{log.time}</td>
                      <td className="py-2.5 px-3 font-bold text-[#F5F5F2]">{log.action}</td>
                      <td className="py-2.5 px-3 text-[#A7ADA8] truncate max-w-[150px]">{log.user}</td>
                      <td className="py-2.5 px-3.5">
                        <span className="px-2 py-0.5 rounded-full font-mono text-[10px] text-[#B7E300] border border-[#B7E300]/30 bg-[#B7E300]/10">{log.module}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="liquid-glass p-6 rounded-3xl shadow-xl space-y-4 text-xs border border-white/10 bg-[#151919]/70">
            <div className="glass-specular-top" />
            <div className="flex items-center justify-between pb-3 border-b border-white/10 font-bold text-[#F5F5F2]">
              <span className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#B7E300]" />
                <span>{t('dashboard_roles.active_microservices')}</span>
              </span>
              <span className="text-[10px] text-[#B7E300] font-bold px-2.5 py-0.5 rounded-full liquid-glass-pill border border-[#B7E300]/40 bg-[#B7E300]/10 font-mono">
                100% ONLINE
              </span>
            </div>
            <div className="space-y-2.5">
              {roleSections.system_services?.map((svc: any, idx: number) => (
                <div key={idx} className="liquid-glass-card p-3 rounded-xl flex items-center justify-between border border-white/10">
                  <div>
                    <p className="font-semibold text-[#F5F5F2]">{svc.name}</p>
                    <p className="text-[10px] text-[#6F7772] font-mono">
                      {isHi ? 'विलंबता' : 'Latency'}: {svc.latency || 'Under 20ms'}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono text-[#B7E300] border border-[#B7E300]/30 bg-[#B7E300]/10">
                    {svc.status}
                  </span>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <button 
                onClick={() => onNavigate('admin-users')}
                className="btn-secondary-cta w-full py-2.5 text-xs flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-[#B7E300]" />
                <span>{isHi ? 'उपयोगकर्ता खाता निर्देशिका खोलें' : 'Open User Account Directory'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. SHARED NATIONAL BENCHMARKS & STATISTICS
      ========================================================================= */}
      <div className="border-t border-white/10 pt-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h3 className="font-editorial text-2xl md:text-3xl font-normal text-[#F5F5F2] flex items-center space-x-2.5">
              <Scale className="w-5 h-5 text-[#B7E300]" />
              <span>{isHi ? 'राष्ट्रीय भूमि प्रशासन मानक एवं प्रवृत्तियां (डीओएलआर डीआईएलआरएमपी)' : 'National Land Administration Benchmarks & Trends (DoLR DILRMP)'}</span>
            </h3>
            <p className="text-xs text-[#A7ADA8] mt-0.5">
              {isHi 
                ? '14 राज्य भूमि राजस्व विभागों में संकलित साझा अनुभवजन्य आधाररेखा। सभी उपयोगकर्ता भूमिकाओं में सुसंगत।'
                : 'Shared empirical baseline compiled across 14 state land revenue departments. Consistent across all user roles.'}
            </p>
          </div>
          <span className="text-[11px] px-3.5 py-1 rounded-full liquid-glass-pill text-[#B7E300] font-mono font-bold border border-[#B7E300]/30 self-start md:self-auto bg-white/5">
            {isHi ? 'रिपोर्टिंग अवधि: 2024 - 2026' : 'Reporting Period: 2024 - 2026'}
          </span>
        </div>

        {/* 4 Standard National Benchmark Indicators with 3D Tilt */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card3D className="liquid-glass-card p-5 rounded-2xl border border-white/10 hover:border-[#B7E300]/50 shadow-lg" maxTilt={4}>
            <div className="glass-specular-top" />
            <span className="text-xs text-[#A7ADA8] font-semibold">{isHi ? 'आरओआर कंप्यूटरीकरण' : 'RoR Computerization'}</span>
            <div className="text-3xl font-black text-[#F5F5F2] mt-1.5 font-syne">{indicators.ror_computerization_national_avg_pct}%</div>
            <span className="text-[10px] text-[#B7E300] liquid-glass-pill px-2.5 py-0.5 rounded-full font-mono font-bold mt-2 inline-block border border-[#B7E300]/40 bg-[#B7E300]/10">
              {isHi ? 'राष्ट्रीय औसत' : 'National Average'}
            </span>
          </Card3D>
          <Card3D className="liquid-glass-card p-5 rounded-2xl border border-white/10 hover:border-[#78C8C8]/50 shadow-lg" maxTilt={4}>
            <div className="glass-specular-top" />
            <span className="text-xs text-[#A7ADA8] font-semibold">{isHi ? 'भूकर मानचित्र डिजिटलीकरण' : 'Cadastral Digitization'}</span>
            <div className="text-3xl font-black text-[#78C8C8] mt-1.5 font-syne">{indicators.cadastral_digitization_national_avg_pct}%</div>
            <span className="text-[10px] text-[#78C8C8] liquid-glass-pill px-2.5 py-0.5 rounded-full font-mono font-bold mt-2 inline-block border border-[#78C8C8]/40 bg-[#78C8C8]/10">
              {isHi ? 'भू-संदर्भित भूखंड' : 'Geo-Referenced Parcels'}
            </span>
          </Card3D>
          <Card3D className="liquid-glass-card p-5 rounded-2xl border border-white/10 hover:border-white/40 shadow-lg" maxTilt={4}>
            <div className="glass-specular-top" />
            <span className="text-xs text-[#A7ADA8] font-semibold">{isHi ? 'आधुनिक रिकॉर्ड रूम' : 'Modern Record Rooms'}</span>
            <div className="text-3xl font-black text-[#F5F5F2] mt-1.5 font-syne">{indicators.modern_record_rooms_pct}%</div>
            <span className="text-[10px] text-[#E5E7E3] liquid-glass-pill px-2.5 py-0.5 rounded-full font-mono font-bold mt-2 inline-block border border-white/20 bg-white/5">
              {isHi ? 'तहसील स्तर पर सक्रिय' : 'Tehsil Level Active'}
            </span>
          </Card3D>
          <Card3D className="liquid-glass-card p-5 rounded-2xl border border-white/10 hover:border-[#C56A9A]/50 shadow-lg" maxTilt={4}>
            <div className="glass-specular-top" />
            <span className="text-xs text-[#A7ADA8] font-semibold">{isHi ? 'राष्ट्रीय विवाद घनत्व' : 'National Dispute Density'}</span>
            <div className="text-3xl font-black text-[#C56A9A] mt-1.5 font-syne">{indicators.national_dispute_index} / 100</div>
            <span className="text-[10px] text-[#C56A9A] liquid-glass-pill px-2.5 py-0.5 rounded-full font-mono font-bold mt-2 inline-block border border-[#C56A9A]/40 bg-[#C56A9A]/10">
              {isHi ? 'राजस्व न्यायालय भार' : 'Revenue Court Burden'}
            </span>
          </Card3D>
        </div>

        {/* Charts: Land Use Trends & Dispute Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 liquid-glass p-6 rounded-3xl shadow-xl space-y-4 border border-white/10 bg-[#151919]/70">
            <div className="glass-specular-top" />
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-extrabold text-[#F5F5F2] text-sm md:text-base">
                  {isHi ? 'अखिल भारतीय भूमि-उपयोग प्रवृत्तियां (2018 - 2024)' : 'Pan-India Land-Use Trends (2018 - 2024)'}
                </h4>
                <p className="text-xs text-[#6F7772] font-mono">
                  {isHi ? 'समय के साथ मिलियन हेक्टेयर (Mha) वर्गीकरण' : 'Million Hectares (Mha) classification over time'}
                </p>
              </div>
              <button 
                onClick={() => onNavigate('analytics')}
                className="text-xs text-[#B7E300] font-mono font-bold hover:underline cursor-pointer"
              >
                {isHi ? 'गहन विश्लेषण →' : 'Deep Analytics →'}
              </button>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={landUseTrends} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255, 255, 255, 0.08)" />
                  <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#A7ADA8' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#A7ADA8' }} domain={[0, 160]} />
                  <Tooltip contentStyle={{ backgroundColor: '#151919', borderColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '0.75rem', color: '#F2F4EF', boxShadow: '0 8px 30px rgba(0,0,0,0.6)' }} />
                  <Legend />
                  <Area type="monotone" dataKey="agricultural" name={isHi ? 'कृषि भूमि' : 'Agricultural'} stackId="1" stroke="#B7E300" fill="#B7E300" fillOpacity={0.65} />
                  <Area type="monotone" dataKey="forest" name={isHi ? 'वन आवरण' : 'Forest Cover'} stackId="1" stroke="#829B8D" fill="#829B8D" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="non_agri_urban" name={isHi ? 'शहरी / गैर-कृषि' : 'Urban / Non-Agri'} stackId="1" stroke="#F5F5F2" fill="#F5F5F2" fillOpacity={0.5} />
                  <Area type="monotone" dataKey="barren_fallow" name={isHi ? 'परती / बंजर' : 'Fallow / Barren'} stackId="1" stroke="#747A76" fill="#747A76" fillOpacity={0.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="liquid-glass p-6 rounded-3xl shadow-xl space-y-4 border border-white/10 bg-[#151919]/70">
            <div className="glass-specular-top" />
            <div>
              <h4 className="font-extrabold text-[#F5F5F2] text-sm md:text-base">
                {isHi ? 'भूमि विवाद वितरण एवं निपटान' : 'Land Dispute Distribution'}
              </h4>
              <p className="text-xs text-[#A7ADA8]">
                {disputes.total_revenue_court_cases_pending} {isHi ? 'लंबित राजस्व न्यायालय मामले' : 'Pending Revenue Cases'}
              </p>
            </div>
            <div className="space-y-3.5 pt-2 text-xs">
              {disputes.by_category?.map((c: any, idx: number) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-[#F2F4EF] font-semibold">
                    <span>{isHi ? (c.category === 'Title & Ownership' ? 'स्वामित्व एवं शीर्षक' : c.category === 'Boundary & Demarcation' ? 'सीमा एवं सीमांकन' : c.category === 'Inheritance & Succession' ? 'उत्तराधिकार एवं वसीयत' : c.category) : c.category}</span>
                    <span className="font-mono text-[#B7E300] font-bold">{c.percentage}%</span>
                  </div>
                  <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden border border-white/10">
                    <div 
                      className={`h-full rounded-full ${idx === 0 ? 'bg-[#B7E300]' : idx === 1 ? 'bg-[#78C8C8]' : 'bg-[#C56A9A]'}`} 
                      style={{ width: `${c.percentage}%` }}
                    ></div>
                  </div>
                  <p className="text-[10px] text-[#6F7772] font-mono">
                    {isHi ? 'औसत निपटान समय' : 'Avg disposal time'}: {c.avg_months} {isHi ? 'महीने' : 'months'}
                  </p>
                </div>
              ))}
            </div>
            <div className="p-4 liquid-glass-card rounded-2xl text-xs space-y-1 border border-[#B7E300]/30 bg-[#B7E300]/10">
              <span className="font-bold text-[#F5F5F2] flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#B7E300]" />
                <span>{isHi ? 'सृष्टि-दृष्टि उपग्रह हस्तक्षेप:' : 'SRISHTI-DRISHTI Satellite Interventions:'}</span>
              </span>
              <p className="text-[11px] text-[#A7ADA8]">
                {climate.watershed_structures_geotagged} {isHi ? 'भू-टैग संरचनाएं' : 'Geo-tagged structures'} • {climate.carbon_sequestration_potential_mt} {isHi ? 'एमटी कार्बन सिंक' : 'MT Carbon sink'}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Official Research & Policy Updates */}
        <div className="liquid-glass p-6 rounded-3xl shadow-xl space-y-4 border border-white/10 bg-[#151919]/70">
          <div className="glass-specular-top" />
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <h4 className="font-extrabold text-[#F5F5F2] text-sm md:text-base flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-[#B7E300]" />
              <span>{isHi ? 'नवीनतम अनुसंधान एवं नीति निर्देश' : 'Recent Research & Policy Directives'}</span>
            </h4>
            <button 
              onClick={() => onNavigate('repository')}
              className="text-xs text-[#B7E300] font-mono font-bold hover:underline cursor-pointer"
            >
              {isHi ? 'रिपॉजिटरी देखें →' : 'View Repository →'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentUpdates.map((doc: any) => (
              <div key={doc.id} className="liquid-glass-card p-4 rounded-xl text-xs space-y-1.5 border border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full font-mono text-[#B7E300] font-bold text-[9px] border border-[#B7E300]/30 bg-[#B7E300]/10">
                    SIH {doc.sih_doc_id || '2026'}
                  </span>
                  <span className="text-[10px] text-[#6F7772] uppercase font-mono">{doc.resource_type}</span>
                </div>
                <h5 className="font-bold text-[#F2F4EF] line-clamp-1">{doc.title}</h5>
                <p className="text-[10px] text-[#A7ADA8]">{doc.organization}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
