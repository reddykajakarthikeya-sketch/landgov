import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
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
          <div className="bg-white rounded-2xl border border-red-200 p-8 shadow-sm text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4 border border-red-200">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access Module</h2>
            <p className="text-gray-600 mb-6 max-w-lg mx-auto">
              Your current role (<span className="font-semibold text-gray-800 capitalize">{user?.role?.replace('_', ' ') || 'Public User'}</span>) does not have authorization to view the <span className="font-semibold text-gray-800 uppercase">{currentTab}</span> workspace.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left max-w-md mx-auto mb-6 text-xs text-amber-900">
              <div className="font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                <LogIn className="w-4 h-4 text-amber-700" />
                Switch to an authorized role to test this module:
              </div>
              <ul className="list-disc pl-4 space-y-1 mt-1 text-amber-800">
                <li><strong>Researcher:</strong> Workspace, AI Assistant, Simulations</li>
                <li><strong>Policymaker:</strong> Simulation Lab, Grant Review, State Analytics</li>
                <li><strong>Institution Admin:</strong> Institutional Applications & Member Management</li>
                <li><strong>Platform Admin:</strong> Complete access including User Management & Audit Logs</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg inline-flex items-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Dashboard
              </button>
              <button
                onClick={() => login('admin@dolr.gov.in', 'Admin@1234')}
                className="px-4 py-2 text-sm font-medium text-white bg-navy-800 hover:bg-navy-900 rounded-lg shadow-sm transition-colors"
              >
                Switch to Platform Admin
              </button>
              <button
                onClick={() => login('policymaker@mord.gov.in', 'Admin@1234')}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-sm transition-colors"
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
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
