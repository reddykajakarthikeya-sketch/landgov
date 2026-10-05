import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider, useTranslation } from './i18n';
import { Layout } from './components/layout/Layout';
import { NationalDashboard } from './pages/NationalDashboard';
import { ResearchRepository } from './pages/ResearchRepository';
import { AIAssistant } from './pages/AIAssistant';
import { GISExplorer } from './pages/GISExplorer';
import { PolicyAnalytics } from './pages/PolicyAnalytics';
import { PolicySimulationLab } from './pages/PolicySimulationLab';
import { CollaborativeWorkspace } from './pages/CollaborativeWorkspace';
import { InnovationGrants } from './pages/InnovationGrants';
import { DatasetManagement } from './pages/DatasetManagement';
import { ScopeOfStudy } from './pages/ScopeOfStudy';
import { TechnologyArchitecture } from './pages/TechnologyArchitecture';
import { APIIntegrations } from './pages/APIIntegrations';
import { AdminUsers } from './pages/AdminUsers';
import { AdminAudit } from './pages/AdminAudit';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';

export function AppContent() {
  const { user, canAccessModule, login } = useAuth();
  const { t } = useTranslation();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');
  const [targetDocForAI, setTargetDocForAI] = useState<number | undefined>(undefined);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [aiInitialQuery, setAiInitialQuery] = useState<string | null>(null);

  const handleGlobalSearch = (query: string) => {
    setGlobalSearch(query);
    setCurrentTab('repository');
  };

  const handleSelectDocForAI = (docId: number) => {
    setTargetDocForAI(docId);
  };

  const handleSelectStateForSimulation = (stateName: string) => {
    setSelectedState(stateName);
    setCurrentTab('simulation');
  };

  const handleSelectStateForAI = (stateName: string) => {
    setSelectedState(stateName);
    setAiInitialQuery(`What are the key land governance and watershed priorities for ${stateName} based on MoRD directives?`);
    setCurrentTab('ai-assistant');
  };

  const handleSelectStateForAnalytics = (stateName: string) => {
    setSelectedState(stateName);
    setCurrentTab('analytics');
  };

  const renderActiveModule = () => {
    // RBAC Route Guard: check if current user is allowed to access this module
    if (!canAccessModule(currentTab)) {
      return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
          <div className="bg-[#151919]/80 backdrop-blur-xl rounded-2xl border border-red-500/20 p-8 shadow-2xl text-center relative overflow-hidden">
            <div className="glass-specular-top" />
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/20">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#F2F4EF] mb-2">{t('common.restricted_access', 'Restricted Access Module')}</h2>
            <p className="text-[#A7ADA8] mb-6 max-w-lg mx-auto">
              {t('common.restricted_desc', 'Your current role does not have authorization to view this workspace.')} (<span className="font-semibold text-[#F2F4EF] capitalize">{user?.role ? t(`roles.${user.role}`, user.role.replace('_', ' ')) : t('roles.public_user', 'Public User')}</span>).
            </p>

            <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4 text-left max-w-md mx-auto mb-6 text-xs text-amber-200">
              <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
                <LogIn className="w-4 h-4 text-amber-400" />
                {t('common.switch_role_prompt', 'Switch to an authorized role to test this module:')}
              </div>
              <ul className="list-disc pl-4 space-y-1 mt-1 text-amber-200/80">
                <li><strong>{t('roles.researcher', 'Researcher')}:</strong> Workspace, AI Assistant, Simulations</li>
                <li><strong>{t('roles.policymaker', 'Policymaker')}:</strong> Simulation Lab, Grant Review, State Analytics</li>
                <li><strong>{t('roles.institution_admin', 'Institution Admin')}:</strong> Institutional Applications & Member Management</li>
                <li><strong>{t('roles.platform_admin', 'Platform Admin')}:</strong> Complete access including User Management & Audit Logs</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className="btn-secondary-cta px-4 py-2 text-xs inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" /> {t('common.return_dashboard', 'Return to Dashboard')}
              </button>
              <button
                onClick={() => login('admin@dolr.gov.in', 'Admin@1234')}
                className="btn-primary-cta px-4 py-2 text-xs shadow-md"
              >
                Switch to Platform Admin
              </button>
              <button
                onClick={() => login('policymaker@mord.gov.in', 'Admin@1234')}
                className="btn-secondary-cta px-4 py-2 text-xs"
              >
                Switch to Policymaker
              </button>
            </div>
          </div>
        </div>
      );
    }

    switch (currentTab) {
      case 'dashboard':
        return <NationalDashboard onNavigate={setCurrentTab} />;
      case 'repository':
        return (
          <ResearchRepository
            initialSearch={globalSearch}
            onSelectDocForAI={handleSelectDocForAI}
            onNavigateToAI={() => setCurrentTab('ai-assistant')}
          />
        );
      case 'ai-assistant':
        return <AIAssistant initialQuery={aiInitialQuery || undefined} />;
      case 'gis-explorer':
        return (
          <GISExplorer 
            initialSelectedState={selectedState}
            onSelectStateForSimulation={handleSelectStateForSimulation}
            onSelectStateForAI={handleSelectStateForAI}
            onSelectStateForAnalytics={handleSelectStateForAnalytics}
          />
        );
      case 'analytics':
        return (
          <PolicyAnalytics 
            initialFilterState={selectedState || undefined}
            initialTab={selectedState ? 'state_matrix' : 'land_use'}
          />
        );
      case 'simulation':
        return <PolicySimulationLab initialState={selectedState || undefined} />;
      case 'projects':
        return <CollaborativeWorkspace />;
      case 'grants':
        return <InnovationGrants />;
      case 'datasets':
        return <DatasetManagement />;
      case 'admin-users':
        return <AdminUsers />;
      case 'admin-audit':
        return <AdminAudit />;
      case 'scope-of-study':
        return <ScopeOfStudy />;
      case 'tech-stack':
        return <TechnologyArchitecture />;
      case 'integrations':
        return <APIIntegrations />;
      default:
        return <NationalDashboard onNavigate={setCurrentTab} />;
    }
  };

  return (
    <Layout
      currentTab={currentTab}
      setCurrentTab={setCurrentTab}
      onSearch={handleGlobalSearch}
    >
      {renderActiveModule()}
    </Layout>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
}
