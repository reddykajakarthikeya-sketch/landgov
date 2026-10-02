import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
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

export function AppContent() {
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
