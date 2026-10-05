import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from '../../i18n';

interface LayoutProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onSearch?: (query: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ currentTab, setCurrentTab, onSearch, children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, language } = useTranslation();

  const getTabMeta = (tab: string) => {
    switch (tab) {
      case 'dashboard':
        return {
          title: language === 'hi' ? 'राष्ट्रीय भूमि शासन परिदृश्य' : 'National Land Governance Overview',
          subtitle: language === 'hi' 
            ? 'अनुसंधान प्रकाशनों, डीआईएलआरएमपी आधुनिकीकरण, भूमि उपयोग प्रवृत्तियों और विवाद समाधान मेट्रिक्स का समग्र विश्लेषण।'
            : 'High-level synthesis of research publications, DILRMP modernization, land-use trends, and dispute resolution metrics.'
        };
      case 'repository':
        return {
          title: t('repository.title', 'Centralized Land Governance Research Repository'),
          subtitle: t('repository.subtitle', 'Peer-reviewed research papers, official MoRD policy documents, cadastral surveys, legal acts, and case studies.')
        };
      case 'ai-assistant':
        return {
          title: t('ai.title', 'AI Research & Policy Assistant'),
          subtitle: t('ai.subtitle', 'Evidence-grounded assistant for paper summarization, citation finding, literature review outlining, and dataset recommendations.')
        };
      case 'gis-explorer':
        return {
          title: t('gis.title', 'Interactive India Geospatial & Cadastral Explorer'),
          subtitle: t('gis.subtitle', 'Multi-layer spatial explorer featuring state DILRMP progress, Bhuvan 30m watershed sites (26015), and infrastructure delay markers.')
        };
      case 'analytics':
        return {
          title: language === 'hi' ? 'नीति एवं स्थानिक विश्लेषण कार्यक्षेत्र' : 'Policy & Spatial Analytics Workspace',
          subtitle: language === 'hi'
            ? 'भूमि उपयोग बदलाव (2018-2024), राजस्व न्यायालय लंबित मामलों और अधिग्रहण देरी के कारकों पर मात्रात्मक अंतर्दृष्टि।'
            : 'Quantitative insights on land-use transitions (2018-2024), revenue court litigation pendency, and acquisition delay factors.'
        };
      case 'simulation':
        return {
          title: t('simulation.title', 'Transparent Policy Simulation Lab'),
          subtitle: t('simulation.subtitle', 'Rule-based decision-support scenario builder with explicit formulas for testing agricultural preservation and urban expansion trade-offs.')
        };
      case 'projects':
        return {
          title: t('workspace.title', 'Collaborative Research & Innovation Workspace'),
          subtitle: t('workspace.subtitle', 'Database-backed project lifecycle tracking, milestone delivery, task assignments, and multi-institutional discussion.')
        };
      case 'grants':
        return {
          title: t('grants.title', 'National Innovation Challenges & Research Grants Portal'),
          subtitle: t('grants.subtitle', 'Funding opportunities, hackathons (SIH 2026), pilot projects, online eligibility verification, and grant application tracking.')
        };
      case 'datasets':
        return {
          title: t('datasets.title', 'Dataset Management & Provenance Console'),
          subtitle: t('datasets.subtitle', 'Comprehensive inventory of official SIH MoRD datasets, DILRMP master records, satellite archives, schemas, and verification statuses.')
        };
      case 'scope-of-study':
        return {
          title: language === 'hi' ? 'अध्ययन का दायरा एवं अनुसंधान रूपरेखा' : 'Scope of Study & Research Framework',
          subtitle: language === 'hi'
            ? 'भूमि शासन अनुसंधान डोमेन, मौलिक अनुसंधान प्रश्नों, पद्धतियों और अपेक्षित परिणामों का विस्तृत मैट्रिक्स।'
            : 'Exhaustive matrix of land governance research domains, fundamental research questions, methodologies, and expected outputs.'
        };
      case 'tech-stack':
        return {
          title: language === 'hi' ? 'घटक-वार सुझाया गया तकनीकी ढांचा' : 'Suggested Components-Wise Technology Architecture',
          subtitle: language === 'hi'
            ? 'घटकों, सॉफ्टवेयर फ्रेमवर्क, उद्देश्य और कार्यान्वयन रोडमैप का संपूर्ण तकनीकी मानचित्रण।'
            : 'End-to-end technological stack mapping components, software frameworks, purpose, and implementation roadmap.'
        };
      case 'integrations':
        return {
          title: language === 'hi' ? 'सरकारी प्रणालियां एवं बाह्य एपीआई एकीकरण' : 'Government Systems & External API Integrations',
          subtitle: language === 'hi'
            ? 'इसरो भुवन जीआईएस, डीआईएलआरएमपी भूमि भूकर, राष्ट्रीय न्यायिक डेटा ग्रिड और पीएम गति शक्ति को जोड़ने वाला गेटवे।'
            : 'Interoperability gateway connecting ISRO Bhuvan GIS, DILRMP Land Cadastre, National Judicial Data Grid, and PM Gati Shakti.'
        };
      case 'admin-users':
        return {
          title: t('admin.users_title', 'User Accounts & Role Management'),
          subtitle: t('admin.users_subtitle', 'Review, activate, and manage platform users, academic researchers, and institutional affiliations.')
        };
      case 'admin-audit':
        return {
          title: t('admin.audit_title', 'Security & Activity Audit Log Stream'),
          subtitle: t('admin.audit_subtitle', 'Immutable security audit trail capturing user authentication, role changes, dataset downloads, and scenario calculations.')
        };
      default:
        return {
          title: language === 'hi' ? 'राष्ट्रीय भूमि शासन मंच' : 'National Land Governance Platform',
          subtitle: t('masthead.dolr', 'Department of Land Resources (DoLR), Government of India')
        };
    }
  };

  const currentMeta = getTabMeta(currentTab);
  const tabLabelKey = `nav.tabs.${currentTab.replace('-', '_')}`;
  const displayTabName = t(tabLabelKey, currentTab.replace('-', ' '));

  return (
    <div className="min-h-screen flex flex-col liquid-canvas text-[#F2F4EF] font-sans relative overflow-x-hidden selection:bg-[#B7E300]/25 selection:text-[#F2F4EF]">
      {/* Subtle Noise Texture Overlay */}
      <div className="noise-overlay" />

      {/* Subtle, Liquid Chrome & Deep Metallic Ambient Light Shapes */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#B7E300]/5 blur-[150px] ambient-orb-1" />
        <div className="absolute top-[20%] -right-40 w-[650px] h-[650px] rounded-full bg-[#78C8C8]/4 blur-[160px] ambient-orb-2" />
        <div className="absolute top-[60%] -left-32 w-[550px] h-[550px] rounded-full bg-[#829B8D]/4 blur-[140px] ambient-orb-1" />
        <div className="absolute -bottom-32 right-[15%] w-[600px] h-[600px] rounded-full bg-[#C56A9A]/3 blur-[150px] ambient-orb-2" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          onSearch={onSearch}
          onToggleMobileMenu={() => setMobileMenuOpen(prev => !prev)}
          mobileMenuOpen={mobileMenuOpen}
        />

        <div className="flex flex-1 relative">
          <Sidebar 
            currentTab={currentTab} 
            setCurrentTab={setCurrentTab} 
            isOpen={mobileMenuOpen}
            onClose={() => setMobileMenuOpen(false)}
          />

          <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
            {/* Liquid-Glass Breadcrumb & Section Header */}
            <div className="liquid-glass border-b border-white/10 px-3 sm:px-6 md:px-8 py-4 backdrop-blur-xl shadow-xs">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center space-x-2 text-xs text-[#A7ADA8] mb-1.5 overflow-x-auto whitespace-nowrap">
                  <button 
                    onClick={() => setCurrentTab('dashboard')} 
                    className="flex items-center space-x-1.5 hover:text-[#B7E300] transition cursor-pointer text-[#A7ADA8]"
                  >
                    <Home className="w-3.5 h-3.5 text-[#B7E300]" />
                    <span>{t('nav.portal_home', 'Portal Home')}</span>
                  </button>
                  <ChevronRight className="w-3 h-3 text-white/20 shrink-0" />
                  <span className="font-semibold text-[#F2F4EF] capitalize truncate max-w-[200px] sm:max-w-none">
                    {displayTabName}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="font-editorial text-2xl sm:text-3xl font-normal text-[#F2F4EF] tracking-tight">
                      {currentMeta.title}
                    </h2>
                    <p className="text-xs text-[#A7ADA8] mt-1 max-w-3xl leading-relaxed">
                      {currentMeta.subtitle}
                    </p>
                  </div>

                  {/* Verified SIH dataset indicator tag */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-mono font-medium liquid-glass-pill text-[#B7E300] border border-[#B7E300]/30 shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B7E300] mr-2 animate-pulse"></span>
                      {t('nav.official_sih_connected', 'Official SIH Dataset Connected')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Module Content Area */}
            <div className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
              {children}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};
