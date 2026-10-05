import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  ChevronDown, 
  CheckCircle2, 
  LogIn, 
  LogOut, 
  Languages, 
  Menu, 
  X,
  Compass
} from 'lucide-react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { useTranslation } from '../../i18n';
import { UserRole } from '../../types';
import { LoginModal } from '../auth/LoginModal';

interface NavbarProps {
  onSearch?: (query: string) => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onToggleMobileMenu?: () => void;
  mobileMenuOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onSearch, 
  currentTab, 
  setCurrentTab,
  onToggleMobileMenu,
  mobileMenuOpen = false
}) => {
  const { user, switchRole, logout } = useAuth();
  const { t, language, setLanguage } = useTranslation();
  const [searchVal, setSearchVal] = useState('');
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchVal.trim()) {
      onSearch(searchVal.trim());
      setCurrentTab('repository');
      setShowSearchInput(false);
    }
  };

  const roleLabels: Record<UserRole, { titleKey: string; defaultTitle: string; color: string; bg: string; dot: string }> = {
    platform_admin: { titleKey: 'roles.platform_admin', defaultTitle: 'Platform Admin', color: 'text-[#F5F5F2]', bg: 'bg-white/10 border-white/20', dot: 'bg-[#B7E300]' },
    policymaker: { titleKey: 'roles.policymaker', defaultTitle: 'MoRD Policymaker', color: 'text-[#E5E7E3]', bg: 'bg-white/10 border-white/20', dot: 'bg-[#C5A46D]' },
    institution_admin: { titleKey: 'roles.institution_admin', defaultTitle: 'Institution Admin', color: 'text-[#E5E7E3]', bg: 'bg-white/10 border-white/20', dot: 'bg-[#78C8C8]' },
    researcher: { titleKey: 'roles.researcher', defaultTitle: 'Researcher', color: 'text-[#E5E7E3]', bg: 'bg-white/10 border-white/20', dot: 'bg-[#B7E300]' },
    public_user: { titleKey: 'roles.public_user', defaultTitle: 'Public / Citizen', color: 'text-[#A7ADA8]', bg: 'bg-white/5 border-white/10', dot: 'bg-[#6F7772]' },
  };

  const currentRoleInfo = user ? roleLabels[user.role] : roleLabels.public_user;
  const currentRoleTitle = t(currentRoleInfo.titleKey, currentRoleInfo.defaultTitle);

  return (
    <header className="sticky top-0 z-40 liquid-glass-elevated border-b border-white/10 shadow-xl backdrop-blur-2xl">
      {/* Top Government Masthead */}
      <div className="bg-[#101313] text-[#F2F4EF] px-3 sm:px-6 py-1.5 text-xs flex flex-wrap justify-between items-center gap-2 border-b border-white/10">
        <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] sm:text-xs">
          <span className="font-extrabold tracking-wider text-[#F5F5F2] flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7E300]" />
            <span>{language === 'hi' ? 'भारत सरकार' : 'GOVERNMENT OF INDIA'}</span>
          </span>
          <span className="text-[#6F7772] hidden sm:inline">|</span>
          <span className="text-[#A7ADA8] hidden sm:inline font-medium">
            {t('masthead.mord', 'Ministry of Rural Development')}
          </span>
          <span className="text-[#6F7772] hidden md:inline">|</span>
          <span className="text-[#6F7772] hidden md:inline">
            {t('masthead.dolr', 'Department of Land Resources (DoLR)')}
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 ml-auto">
          {/* SIH Status Badge with Acid Green Pulse */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-white/5 text-[#B7E300] px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-[#B7E300]/30 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B7E300] animate-pulse"></span>
            <span>{t('masthead.dataset_verified', 'SIH 2026 Problem 26019: MoRD Official Dataset Verified')}</span>
          </div>

          <span className="text-[#6F7772] hidden sm:inline">|</span>

          {/* Bilingual Language Switcher in Masthead */}
          <div className="flex items-center bg-black/40 rounded-full p-0.5 text-[11px] font-medium border border-white/10">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-3 py-0.5 rounded-full transition-all cursor-pointer font-semibold ${
                language === 'en'
                  ? 'bg-gradient-to-r from-[#F5F5F2] to-[#C7CBC7] text-[#080A0A] shadow-xs'
                  : 'text-[#A7ADA8] hover:text-[#F2F4EF]'
              }`}
              title="View in English"
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={`px-3 py-0.5 rounded-full transition-all cursor-pointer font-semibold ${
                language === 'hi'
                  ? 'bg-gradient-to-r from-[#F5F5F2] to-[#C7CBC7] text-[#080A0A] shadow-xs'
                  : 'text-[#A7ADA8] hover:text-[#F2F4EF]'
              }`}
              title="हिन्दी में देखें"
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Neo-Institutional Liquid Chrome */}
      <div className="max-w-7xl w-full mx-auto px-4 md:px-8 py-4 sm:py-5 flex items-center justify-between gap-4">
        {/* LEFT: Platform Logo / Name */}
        <div className="flex items-center space-x-3.5">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-full liquid-glass-pill text-[#F2F4EF] hover:text-[#B7E300] transition cursor-pointer"
              aria-label="Toggle Navigation Drawer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#C56A9A]" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <div 
            onClick={() => setCurrentTab('dashboard')} 
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-b from-[#212626] to-[#0D1010] border border-white/25 text-[#F5F5F2] flex items-center justify-center font-bold shadow-lg text-[10px] sm:text-xs leading-none text-center group-hover:border-[#B7E300]/60 transition">
              सत्यमेव<br/>जयते
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-sm sm:text-base font-bold tracking-tight text-[#F2F4EF] group-hover:text-white transition">
                  {t('nav.title', 'National Land Governance Platform')}
                </h1>
                <span className="hidden sm:inline-block text-[9px] font-mono px-1.5 py-0.2 rounded border border-[#B7E300]/40 text-[#B7E300] bg-[#B7E300]/10">
                  NEO-V2
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#A7ADA8] font-medium hidden sm:block">
                {t('nav.subtitle', 'Research, Policy Innovation & Evidence-Based Land Administration')}
              </p>
            </div>
          </div>
        </div>

        {/* CENTER: Main Navigation Links (Desktop) */}
        <nav className="hidden xl:flex items-center space-x-1 liquid-glass-pill px-3 py-1.5 border border-white/10">
          {[
            { id: 'dashboard', label: language === 'hi' ? 'डैशबोर्ड' : 'Dashboard' },
            { id: 'repository', label: language === 'hi' ? 'अनुसंधान' : 'Research' },
            { id: 'gis-explorer', label: language === 'hi' ? 'जीआईएस' : 'GIS Explorer' },
            { id: 'analytics', label: language === 'hi' ? 'नीति विश्लेषण' : 'Analytics' },
            { id: 'simulation', label: language === 'hi' ? 'सिमुलेशन' : 'Simulation' },
            { id: 'projects', label: language === 'hi' ? 'सहयोग' : 'Collaboration' },
            { id: 'ai-assistant', label: language === 'hi' ? 'एआई सहायक' : 'AI Assistant' }
          ].map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer flex items-center space-x-1.5 ${
                  isActive
                    ? 'bg-gradient-to-r from-white/15 to-white/5 text-[#F5F5F2] font-semibold border border-white/20 shadow-xs'
                    : 'text-[#A7ADA8] hover:text-[#F2F4EF] hover:bg-white/5'
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#B7E300]" />}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Search, Role Switcher & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Search Trigger */}
          <div className="relative">
            {showSearchInput ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  placeholder={language === 'hi' ? 'खोजें...' : 'Search...'}
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  autoFocus
                  className="w-36 sm:w-48 pl-3 pr-8 py-1.5 text-xs liquid-glass-input rounded-full text-[#F2F4EF] placeholder-[#6F7772] border border-white/20"
                />
                <button
                  type="button"
                  onClick={() => setShowSearchInput(false)}
                  className="absolute right-2 text-[#A7ADA8] hover:text-white text-xs cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearchInput(true)}
                className="p-2 text-[#A7ADA8] hover:text-[#F2F4EF] liquid-glass-pill rounded-full transition cursor-pointer"
                title="Search Repository"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Mobile Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
            className="md:hidden flex items-center space-x-1 px-2.5 py-1 rounded-full liquid-glass-pill text-xs font-semibold text-[#F2F4EF] hover:bg-white/10"
            title="Toggle Language (English / हिन्दी)"
          >
            <Languages className="w-3.5 h-3.5 text-[#B7E300]" />
            <span>{language === 'en' ? 'हिन्दी' : 'EN'}</span>
          </button>

          {/* Role Switcher Pill with Persona Indicator */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-3.5 py-1.5 rounded-full border text-xs font-semibold ${currentRoleInfo.bg} ${currentRoleInfo.color} hover:border-[#B7E300]/50 transition cursor-pointer backdrop-blur-md shadow-xs`}
              title="Click to switch persona and test RBAC"
            >
              <span className={`w-2 h-2 rounded-full ${currentRoleInfo.dot}`} />
              <ShieldCheck className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <span className="hidden sm:inline text-[#A7ADA8]">{t('nav.role', 'Role')}:</span>
              <span className="truncate max-w-[110px] sm:max-w-none text-[#F5F5F2]">{currentRoleTitle}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />
            </button>

            {/* Role Switch Dropdown */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 liquid-glass-elevated bg-[#151919]/95 rounded-2xl shadow-2xl border border-white/15 py-2.5 z-50 animate-in fade-in zoom-in-95 backdrop-blur-3xl text-[#F2F4EF]">
                <div className="px-3.5 py-2 border-b border-white/10">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#B7E300]">
                    {t('nav.switch_persona', 'Switch Test Persona (RBAC Demo)')}
                  </p>
                  <p className="text-[11px] text-[#A7ADA8] mt-0.5">
                    {t('nav.switch_persona_desc', 'Test role-based backend authorization for the 5 specified roles:')}
                  </p>
                </div>
                {(Object.keys(roleLabels) as UserRole[]).map((r) => {
                  const info = roleLabels[r];
                  const demoUser = DEMO_USERS[r];
                  const isCurrent = user?.role === r;
                  const title = t(info.titleKey, info.defaultTitle);
                  return (
                    <button
                      key={r}
                      onClick={() => {
                        switchRole(r);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-start justify-between hover:bg-white/5 transition cursor-pointer ${
                        isCurrent ? 'bg-white/10 font-bold' : ''
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`w-2 h-2 rounded-full ${info.dot}`} />
                          <span className="font-semibold text-[#F2F4EF]">{title}</span>
                        </div>
                        <p className="text-[10px] text-[#A7ADA8] pl-4">{demoUser.org}</p>
                      </div>
                      {isCurrent && <CheckCircle2 className="w-3.5 h-3.5 text-[#B7E300] shrink-0 mt-0.5" />}
                    </button>
                  );
                })}
                <div className="px-3.5 py-2 border-t border-white/10 flex justify-between">
                  <button
                    onClick={() => {
                      setShowRoleMenu(false);
                      setShowLoginModal(true);
                    }}
                    className="text-[11px] text-[#B7E300] font-bold hover:underline flex items-center space-x-1 cursor-pointer"
                  >
                    <LogIn className="w-3 h-3 text-[#B7E300]" />
                    <span>{t('nav.custom_login', 'Custom Login')}</span>
                  </button>
                  <span className="text-[10px] text-[#6F7772]">SIH 2026 Test Suite</span>
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="p-2 text-[#A7ADA8] hover:text-[#F2F4EF] liquid-glass-pill rounded-full transition relative cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#B7E300] rounded-full shadow-xs"></span>
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 liquid-glass-elevated bg-[#151919]/95 rounded-2xl shadow-2xl border border-white/15 p-3.5 z-50 text-xs backdrop-blur-3xl text-[#F2F4EF]">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 font-bold text-[#F5F5F2]">
                  <span>{t('nav.notifications', 'Recent Platform Updates')}</span>
                  <span className="text-[10px] text-[#B7E300] bg-[#B7E300]/15 px-2 py-0.5 rounded-full font-mono border border-[#B7E300]/30">{t('nav.dolr_feed', 'DoLR Feed')}</span>
                </div>
                <div className="divide-y divide-white/10 mt-2">
                  <div className="py-2.5">
                    <p className="font-semibold text-[#F2F4EF]">Official SIH Dataset Ingested</p>
                    <p className="text-[11px] text-[#A7ADA8] mt-0.5">5 MoRD policy PDFs (26019, 26018, 26016, 25017, 26015) parsed and indexed.</p>
                  </div>
                  <div className="py-2.5">
                    <p className="font-semibold text-[#F2F4EF]">DILRMP Q4 Sync Complete</p>
                    <p className="text-[11px] text-[#A7ADA8] mt-0.5">Computerization of RoR achieved in 97.8% of villages nationwide.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Info Capsule or Sign In Button */}
          {user ? (
            <div className="hidden lg:flex items-center space-x-2 pl-2 border-l border-white/10 text-xs">
              <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#F5F5F2] to-[#C7CBC7] text-[#080A0A] flex items-center justify-center font-bold text-xs shadow-md">
                {user.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
              <div className="text-left">
                <p className="font-bold text-[#F5F5F2] leading-none">{user.full_name}</p>
                <p className="text-[10px] text-[#A7ADA8] leading-tight truncate max-w-[130px]">{user.organization}</p>
              </div>
              <button
                onClick={logout}
                className="text-[#A7ADA8] hover:text-[#C56A9A] p-1 rounded-lg cursor-pointer transition"
                title={t('nav.sign_out', 'Sign Out')}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="btn-primary-cta"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{t('auth.login_title', 'Sign In')}</span>
            </button>
          )}
        </div>
      </div>

      {showLoginModal && (
        <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      )}
    </header>
  );
};
