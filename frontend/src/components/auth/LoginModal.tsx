import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  AlertCircle, 
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, switchRole } = useAuth();
  const { t, language } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validation for empty fields
    if (!email.trim() || !password.trim()) {
      setError(t('auth.empty_fields_err', 'Please enter both official email address and password.'));
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password.trim());
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || t('auth.invalid_creds_err', 'Invalid credentials. Please verify your email and password.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDemoLogin(role: UserRole) {
    setError(null);
    setLoading(true);
    try {
      await switchRole(role);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError('Failed to switch demo persona.');
    } finally {
      setLoading(false);
    }
  }

  const roleConfigs: { role: UserRole; title: string; desc: string; color: string }[] = [
    { 
      role: 'policymaker', 
      title: t('roles.policymaker', 'MoRD Policymaker'), 
      desc: language === 'hi' ? 'श्रीमती सुनीता वर्मा, आईएएस (नीति प्रभाग)' : 'Smt. Sunita Verma, IAS (PME Division)', 
      color: 'border-[#B7E300]/30 bg-[#B7E300]/10 hover:bg-[#B7E300]/15 text-[#F2F4EF]' 
    },
    { 
      role: 'researcher', 
      title: t('roles.researcher', 'Academic Researcher'), 
      desc: language === 'hi' ? 'डॉ. प्रियंका सेनगुप्ता (आईआईटी दिल्ली / एनआईआरडीपीआर)' : 'Dr. Priyanka Sengupta (IIT Delhi / NIRDPR)', 
      color: 'border-[#78C8C8]/30 bg-[#78C8C8]/10 hover:bg-[#78C8C8]/15 text-[#F2F4EF]' 
    },
    { 
      role: 'platform_admin', 
      title: t('roles.platform_admin', 'Platform Administrator'), 
      desc: language === 'hi' ? 'डॉ. राजेश्वर शर्मा (DoLR आईटी सेल)' : 'Dr. Rajeshwar Sharma (DoLR IT Cell)', 
      color: 'border-white/20 bg-white/5 hover:bg-white/10 text-[#F2F4EF]' 
    },
    { 
      role: 'institution_admin', 
      title: t('roles.institution_admin', 'Institution Admin'), 
      desc: language === 'hi' ? 'प्रो. आनंद के. मूर्ति (एनआईआरडीपीआर निदेशक)' : 'Prof. Anand K. Murthy (NIRDPR Director)', 
      color: 'border-[#C7CBC7]/30 bg-[#C7CBC7]/10 hover:bg-[#C7CBC7]/15 text-[#F2F4EF]' 
    },
    { 
      role: 'public_user', 
      title: t('roles.public_user', 'Public / Citizen'), 
      desc: language === 'hi' ? 'विक्रमादित्य देशमुख (नागरिक समाज)' : 'Vikramaditya Deshmukh (Civil Society)', 
      color: 'border-white/10 bg-white/[0.02] hover:bg-white/5 text-[#A7ADA8]' 
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#080A0A]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="liquid-glass-elevated max-w-md w-full rounded-2xl overflow-hidden shadow-2xl border border-white/15 bg-[#101313]/95 animate-in fade-in zoom-in-95 text-[#F2F4EF]">
        {/* Header */}
        <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-white/10 text-[#F2F4EF] font-bold flex items-center justify-center text-[10px] border border-white/20 shadow-sm font-mono">
              सत्यमेव
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight text-[#F2F4EF]">{t('auth.login_title', 'Secure Role-Based Access')}</h3>
              <p className="text-[10px] text-[#A7ADA8] mt-0.5">{t('auth.login_subtitle', 'Authenticate with official credentials or select demo role')}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-[#A7ADA8] hover:text-[#F2F4EF] p-1 rounded-lg hover:bg-white/5 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-[#C56A9A]/15 border border-[#C56A9A]/30 rounded-xl text-[#C56A9A] flex items-start space-x-2 text-[11px] backdrop-blur-sm">
              <AlertCircle className="w-4 h-4 text-[#C56A9A] shrink-0 mt-0.5" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="font-semibold text-[#A7ADA8] block mb-1">
                {t('auth.official_email', 'Official Email Address')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#B7E300] absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder="e.g. researcher@iitd.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] text-xs border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-[#A7ADA8] block mb-1">
                {t('auth.password', 'Password')}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#78C8C8] absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] text-xs border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary-cta w-full py-2.5 disabled:opacity-50 text-[#080A0A] font-bold rounded-xl transition text-xs flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>{t('auth.login_button', 'Sign In')}</span>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-3 border-t border-white/10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#F2F4EF] block text-center font-mono">
              {t('auth.switch_persona_title', 'Instant Demonstration Personas (One-Click RBAC)')}
            </span>

            <div className="space-y-1.5">
              {roleConfigs.map((cfg) => (
                <button
                  key={cfg.role}
                  type="button"
                  onClick={() => handleDemoLogin(cfg.role)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between hover:shadow-sm transition cursor-pointer ${cfg.color}`}
                >
                  <div>
                    <span className="font-bold text-[11px] block">{cfg.title}</span>
                    <span className="text-[10px] opacity-80 block">{cfg.desc}</span>
                  </div>
                  <span className="text-[10px] font-semibold underline shrink-0 ml-2">
                    {language === 'hi' ? 'चुनें →' : 'Select →'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
