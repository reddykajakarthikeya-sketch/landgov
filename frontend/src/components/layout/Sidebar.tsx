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
  FileCheck2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { user } = useAuth();

  const navSections = [
    {
      title: 'CORE PLATFORM',
      items: [
        { id: 'dashboard', label: 'National Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'repository', label: 'Research Repository', icon: BookOpen, badge: '5 SIH' },
        { id: 'ai-assistant', label: 'AI Research Assistant', icon: Bot, badge: 'RAG' },
        { id: 'gis-explorer', label: 'GIS Explorer & Maps', icon: MapIcon, badge: '30m Sat' },
      ]
    },
    {
      title: 'ANALYTICS & EXPERIMENTATION',
      items: [
        { id: 'analytics', label: 'Policy Analytics', icon: BarChart3, badge: null },
        { id: 'simulation', label: 'Policy Simulation Lab', icon: Sliders, badge: 'Transparent' },
      ]
    },
    {
      title: 'COLLABORATION & INNOVATION',
      items: [
        { id: 'projects', label: 'Research Workspace', icon: Users2, badge: null },
        { id: 'grants', label: 'Innovation & Grants', icon: Award, badge: 'SIH 2026' },
      ]
    },
    {
      title: 'DATA & SYSTEM GOVERNANCE',
      items: [
        { id: 'datasets', label: 'Dataset Management', icon: Database, badge: 'Verified' },
        { id: 'scope-of-study', label: 'Scope of Study', icon: Compass, badge: null },
        { id: 'tech-stack', label: 'Suggested Tech Stack', icon: Cpu, badge: 'DoLR' },
        { id: 'integrations', label: 'API Integrations', icon: Network, badge: 'Bhuvan/NJDG' },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-68px)] border-r border-slate-800 select-none">
      {/* Sidebar Header / Status */}
      <div className="p-3 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <FileCheck2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300">DoLR Dataset Status:</span>
          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-800 text-[10px]">
            ACTIVE
          </span>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-3 px-2 space-y-4 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <p className="px-3 text-[10px] font-bold text-slate-400 tracking-wider uppercase">
              {section.title}
            </p>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition ${
                    isActive
                      ? 'bg-amber-600 text-white font-semibold shadow-xs'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                        isActive
                          ? 'bg-amber-700/80 text-amber-100'
                          : 'bg-slate-800 text-amber-400 border border-slate-700'
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
      <div className="p-3 border-t border-slate-800 bg-slate-950/40 text-[11px]">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="truncate">
            <p className="text-slate-200 font-medium truncate">{user?.full_name}</p>
            <p className="text-[10px] text-slate-400 capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
