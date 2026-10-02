import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  User as UserIcon, 
  ChevronDown, 
  Building2, 
  ExternalLink,
  CheckCircle2,
  FileText,
  LogIn,
  LogOut
} from 'lucide-react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { LoginModal } from '../auth/LoginModal';

interface NavbarProps {
  onSearch?: (query: string) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch, currentTab, setCurrentTab }) => {
  const { user, switchRole, logout } = useAuth();
  const [searchVal, setSearchVal] = useState('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchVal.trim()) {
      onSearch(searchVal.trim());
      setCurrentTab('repository');
    }
  };

  const roleLabels: Record<UserRole, { title: string; color: string; bg: string }> = {
    platform_admin: { title: 'Platform Admin', color: 'text-purple-700', bg: 'bg-purple-50 border-purple-200' },
    policymaker: { title: 'MoRD Policymaker', color: 'text-amber-800', bg: 'bg-amber-50 border-amber-200' },
    institution_admin: { title: 'Institution Admin', color: 'text-blue-800', bg: 'bg-blue-50 border-blue-200' },
    researcher: { title: 'Researcher', color: 'text-emerald-800', bg: 'bg-emerald-50 border-emerald-200' },
    public_user: { title: 'Public / Citizen', color: 'text-slate-800', bg: 'bg-slate-100 border-slate-200' },
  };

  const currentRoleInfo = user ? roleLabels[user.role] : roleLabels.public_user;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Government Masthead */}
      <div className="bg-[#0a2540] text-white px-4 py-1.5 text-xs flex flex-wrap justify-between items-center border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <span className="font-semibold tracking-wide text-amber-400">भारत सरकार | GOVERNMENT OF INDIA</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-200">ग्रामीण विकास मंत्रालय | Ministry of Rural Development</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">भूमि संसाधन विभाग (DoLR)</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1.5 bg-emerald-950/80 text-emerald-300 px-2 py-0.5 rounded text-[11px] font-medium border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>SIH 2026 Problem 26019: MoRD Official Dataset Verified</span>
          </div>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">English / हिन्दी</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Brand & Emblem */}
        <div 
          onClick={() => setCurrentTab('dashboard')} 
          className="flex items-center space-x-3 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 rounded-full bg-amber-50 border-2 border-amber-600 flex items-center justify-center font-bold text-amber-700 shadow-xs text-xs tracking-tighter">
            सत्यमेव<br/>जयते
          </div>
          <div>
            <h1 className="text-base font-bold text-[#0a2540] leading-tight group-hover:text-amber-700 transition">
              National Land Governance Platform
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Research, Policy Innovation & Evidence-Based Land Administration (NDP-LG)
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search research papers, DILRMP data, land laws, policies..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2540] focus:border-transparent text-slate-800 placeholder-slate-400 transition"
            />
          </div>
        </form>

        {/* User Role Switcher & Profile Actions */}
        <div className="flex items-center space-x-3">
          {/* Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${currentRoleInfo.bg} ${currentRoleInfo.color} hover:shadow-xs transition`}
              title="Click to switch role and test permissions"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Role: {currentRoleInfo.title}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>

            {/* Role Switch Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-slate-100">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Switch Test Persona (RBAC Demo)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Test role-based backend authorization for the 5 specified roles:
                  </p>
                </div>
                {(Object.keys(roleLabels) as UserRole[]).map((r) => {
                  const info = roleLabels[r];
                  const demoUser = DEMO_USERS[r];
                  const isCurrent = user?.role === r;
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-start justify-between hover:bg-slate-50 transition ${
                        isCurrent ? 'bg-amber-50/60 font-semibold' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`w-2 h-2 rounded-full ${r === 'platform_admin' ? 'bg-purple-600' : r === 'policymaker' ? 'bg-amber-600' : 'bg-emerald-600'}`} />
                          <span className="font-medium text-slate-800">{info.title}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 pl-3.5">{demoUser.org}</p>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  );
                })}
                <div className="px-3 py-2 border-t border-slate-100 flex justify-between">
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      setShowLoginModal(true);
                    }}
                    className="text-[11px] text-blue-700 font-semibold hover:underline flex items-center space-x-1"
                  >
                    <LogIn className="w-3 h-3" />
                    <span>Custom Login</span>
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowRoleMenu(false);
                    }}
                    className="text-[11px] text-rose-600 font-semibold hover:underline flex items-center space-x-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 text-slate-600 hover:text-[#0a2540] hover:bg-slate-100 rounded-full transition relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full"></span>
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 p-3 z-50 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 font-semibold text-slate-700">
                  <span>Recent Platform Updates</span>
                  <span className="text-[10px] text-slate-400">DoLR Feed</span>
                </div>
                <div className="divide-y divide-slate-100 mt-2">
                  <div className="py-2">
                    <p className="font-medium text-slate-800">Official SIH Dataset Ingested</p>
                    <p className="text-[11px] text-slate-500">5 MoRD policy PDFs (26019, 26018, 26016, 25017, 26015) parsed and indexed.</p>
                  </div>
                  <div className="py-2">
                    <p className="font-medium text-slate-800">DILRMP Q4 Sync Complete</p>
                    <p className="text-[11px] text-slate-500">Computerization of RoR achieved in 97.8% of villages nationwide.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Info Capsule or Sign In Button */}
          {user ? (
            <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-slate-200 text-xs text-slate-700">
              <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                {user.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
              <div className="text-left">
                <p className="font-semibold text-slate-800 leading-none">{user.full_name}</p>
                <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[130px]">{user.organization}</p>
              </div>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-rose-600 p-1 rounded"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-3 py-1.5 bg-[#0a2540] text-white rounded-md text-xs font-semibold hover:bg-[#1e3a5f] transition flex items-center space-x-1"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={() => setCurrentTab('dashboard')}
      />
    </header>
  );
};
