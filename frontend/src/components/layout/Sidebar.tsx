import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Bot, 
  Map as MapIcon, 
  BarChart3, 
  Sliders, 
  Users2, 
  Award, 
  Database, 
  Compass, 
  Cpu, 
  Network,
  ShieldCheck, 
  FileCheck2,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  setCurrentTab, 
  isOpen = false, 
  onClose 
}) => {
  const { user, canAccessModule, isInstitutionAdmin } = useAuth();
  const { t } = useTranslation();

  const allSections = [
    {
      titleKey: 'nav.sections.core_platform',
      defaultTitle: 'CORE PLATFORM',
      items: [
        { id: 'dashboard', labelKey: 'nav.tabs.dashboard', defaultLabel: 'National Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'repository', labelKey: 'nav.tabs.repository', defaultLabel: 'Research Repository', icon: BookOpen, badge: '5 SIH' },
        { id: 'ai-assistant', labelKey: 'nav.tabs.ai_assistant', defaultLabel: 'AI Research Assistant', icon: Bot, badge: 'RAG' },
        { id: 'gis-explorer', labelKey: 'nav.tabs.gis_explorer', defaultLabel: 'GIS Explorer & Maps', icon: MapIcon, badge: '30m Sat' },
      ]
    },
    {
      titleKey: 'nav.sections.analytics_experimentation',
      defaultTitle: 'ANALYTICS & EXPERIMENTATION',
      items: [
        { id: 'analytics', labelKey: 'nav.tabs.analytics', defaultLabel: 'Policy Analytics', icon: BarChart3, badge: null },
        { id: 'simulation', labelKey: 'nav.tabs.simulation', defaultLabel: 'Policy Simulation Lab', icon: Sliders, badge: 'Transparent' },
      ]
    },
    {
      titleKey: 'nav.sections.collaboration_innovation',
      defaultTitle: 'COLLABORATION & INNOVATION',
      items: [
        { id: 'projects', labelKey: 'nav.tabs.projects', defaultLabel: 'Research Workspace', icon: Users2, badge: null },
        { id: 'grants', labelKey: 'nav.tabs.grants', defaultLabel: 'Innovation & Grants', icon: Award, badge: 'SIH 2026' },
      ]
    },
    {
      titleKey: 'nav.sections.data_governance',
      defaultTitle: 'DATA & SYSTEM GOVERNANCE',
      items: [
        { id: 'datasets', labelKey: 'nav.tabs.datasets', defaultLabel: 'Dataset Management', icon: Database, badge: 'Verified' },
        { id: 'scope-of-study', labelKey: 'nav.tabs.scope_of_study', defaultLabel: 'Scope of Study', icon: Compass, badge: null },
        { id: 'tech-stack', labelKey: 'nav.tabs.tech_stack', defaultLabel: 'Suggested Tech Stack', icon: Cpu, badge: 'DoLR' },
        { id: 'integrations', labelKey: 'nav.tabs.integrations', defaultLabel: 'API Integrations', icon: Network, badge: 'Bhuvan/NJDG' },
      ]
    },
    {
      titleKey: 'nav.sections.administration',
      defaultTitle: 'ADMINISTRATION',
      items: [
        { 
          id: 'admin-users', 
          labelKey: isInstitutionAdmin ? 'nav.tabs.admin_members' : 'nav.tabs.admin_users', 
          defaultLabel: isInstitutionAdmin ? 'Member Directory' : 'User Accounts & Roles', 
          icon: Users2, 
          badge: 'RBAC' 
        },
        { 
          id: 'admin-audit', 
          labelKey: 'nav.tabs.admin_audit', 
          defaultLabel: 'System Audit Logs', 
          icon: ShieldCheck, 
          badge: 'Security' 
        },
      ]
    }
  ];

  // Filter sections and items based on role access
  const navSections = allSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => canAccessModule(item.id))
    }))
    .filter(section => section.items.length > 0);

  const handleSelectTab = (id: string) => {
    setCurrentTab(id);
    if (onClose) onClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#101313]/90 liquid-glass border-r border-white/10 text-[#F2F4EF] backdrop-blur-2xl">
      {/* Sidebar Header / Status */}
      <div className="p-3.5 border-b border-white/10 bg-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-[11px] text-[#A7ADA8]">
          <FileCheck2 className="w-4 h-4 text-[#B7E300]" />
          <span className="font-semibold text-[#F2F4EF]">DoLR Status:</span>
          <span className="px-2 py-0.5 rounded-full bg-[#B7E300]/15 text-[#B7E300] font-bold border border-[#B7E300]/30 text-[10px]">
            {t('nav.verified', 'ACTIVE')}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1 text-[#A7ADA8] hover:text-[#F2F4EF] rounded cursor-pointer"
            aria-label="Close Sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.titleKey} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-[#6F7772] tracking-wider uppercase font-mono">
              {t(section.titleKey, section.defaultTitle)}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const itemLabel = t(item.labelKey, item.defaultLabel);
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-white/15 to-white/5 text-[#F5F5F2] font-semibold border border-white/15 shadow-xs'
                      : 'text-[#A7ADA8] hover:bg-white/5 hover:text-[#F2F4EF]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#B7E300]' : 'text-[#6F7772]'}`} />
                    <span className="truncate">{itemLabel}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded-full font-mono shrink-0 ml-1.5 ${
                        isActive
                          ? 'bg-[#B7E300] text-[#080A0A] font-bold'
                          : 'bg-white/5 text-[#B7E300] border border-[#B7E300]/30'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Active User Footer Info */}
      <div className="p-3.5 border-t border-white/10 bg-white/5 text-[11px]">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-white/10 text-[#F5F5F2] shrink-0 border border-white/10">
            <ShieldCheck className="w-4 h-4 text-[#B7E300]" />
          </div>
          <div className="truncate">
            <p className="text-[#F2F4EF] font-semibold truncate">{user?.full_name || 'Public Visitor'}</p>
            <p className="text-[10px] text-[#A7ADA8] capitalize">{user?.role ? t(`roles.${user.role}`, user.role.replace('_', ' ')) : t('roles.public_user', 'Public Citizen')}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col min-h-[calc(100vh-68px)] select-none relative z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div 
            onClick={onClose} 
            className="fixed inset-0 bg-[#080A0A]/70 backdrop-blur-md transition-opacity animate-in fade-in"
          />
          {/* Drawer */}
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
