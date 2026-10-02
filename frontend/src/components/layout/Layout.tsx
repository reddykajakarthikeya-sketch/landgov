import React from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ChevronRight, Home } from 'lucide-react';

interface LayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSearch?: (query: string) => void;
  children: React.ReactNode;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'National Land Governance Overview',
    subtitle: 'High-level synthesis of research publications, DILRMP modernization, land-use trends, and dispute resolution metrics.'
  },
  repository: {
    title: 'Centralized Land Governance Research Repository',
    subtitle: 'Peer-reviewed research papers, official MoRD policy documents, cadastral surveys, legal acts, and case studies.'
  },
  'ai-assistant': {
    title: 'AI Research & Policy Assistant',
    subtitle: 'Evidence-grounded assistant for paper summarization, citation finding, literature review outlining, and dataset recommendations.'
  },
  'gis-explorer': {
    title: 'Interactive India Geospatial & Cadastral Explorer',
    subtitle: 'Multi-layer spatial explorer featuring state DILRMP progress, Bhuvan 30m watershed sites (26015), and infrastructure delay markers.'
  },
  analytics: {
    title: 'Policy & Spatial Analytics Workspace',
    subtitle: 'Quantitative insights on land-use transitions (2018-2024), revenue court litigation pendency, and acquisition delay factors.'
  },
  simulation: {
    title: 'Transparent Policy Simulation Lab',
    subtitle: 'Rule-based decision-support scenario builder with explicit formulas for testing agricultural preservation and urban expansion trade-offs.'
  },
  projects: {
    title: 'Collaborative Research & Innovation Workspace',
    subtitle: 'Database-backed project lifecycle tracking, milestone delivery, task assignments, and multi-institutional discussion.'
  },
  grants: {
    title: 'National Innovation Challenges & Research Grants Portal',
    subtitle: 'Funding opportunities, hackathons (SIH 2026), pilot projects, online eligibility verification, and grant application tracking.'
  },
  datasets: {
    title: 'Dataset Management & Provenance Console',
    subtitle: 'Comprehensive inventory of official SIH MoRD datasets, DILRMP master records, satellite archives, schemas, and verification statuses.'
  },
  'scope-of-study': {
    title: 'Scope of Study & Research Framework',
    subtitle: 'Exhaustive matrix of land governance research domains, fundamental research questions, methodologies, and expected outputs.'
  },
  'tech-stack': {
    title: 'Suggested Components-Wise Technology Architecture',
    subtitle: 'End-to-end technological stack mapping components, software frameworks, purpose, and implementation roadmap.'
  },
  integrations: {
    title: 'Government Systems & External API Integrations',
    subtitle: 'Interoperability gateway connecting ISRO Bhuvan GIS, DILRMP Land Cadastre, National Judicial Data Grid, and PM Gati Shakti.'
  }
};

export const Layout: React.FC<LayoutProps> = ({ currentTab, setCurrentTab, onSearch, children }) => {
  const currentMeta = TAB_TITLES[currentTab] || {
    title: 'Land Governance Platform',
    subtitle: 'Department of Land Resources (DoLR), Government of India'
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} onSearch={onSearch} />

      <div className="flex flex-1">
        <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Breadcrumb & Section Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center space-x-2 text-xs text-slate-500 mb-1">
              <button 
                onClick={() => setCurrentTab('dashboard')} 
                className="flex items-center space-x-1 hover:text-[#0a2540] transition"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Portal Home</span>
              </button>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="font-medium text-slate-800 capitalize">
                {currentTab.replace('-', ' ')}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-[#0a2540] tracking-tight">
                  {currentMeta.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentMeta.subtitle}
                </p>
              </div>

              {/* Verified SIH dataset indicator tag */}
              <div className="flex items-center space-x-2 shrink-0">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Official SIH Dataset Connected
                </span>
              </div>
            </div>
          </div>

          {/* Module Content */}
          <div className="flex-1 p-6 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};
