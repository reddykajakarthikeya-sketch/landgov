import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  User as UserIcon, 
  X,
  Building2
} from 'lucide-react';
import { useAuth, DEMO_USERS } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, switchRole } = useAuth();
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
      setError('Please fill in both your official email address and password.');
      return;
    }

    setLoading(true);
    try {
      await login(email.trim(), password.trim());
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
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
    { role: 'policymaker', title: 'MoRD Policymaker', desc: 'Smt. Sunita Verma, IAS (PME Division)', color: 'border-amber-400 bg-amber-50 text-amber-900' },
    { role: 'researcher', title: 'Academic Researcher', desc: 'Dr. Priyanka Sengupta (IIT Delhi / NIRDPR)', color: 'border-emerald-400 bg-emerald-50 text-emerald-900' },
    { role: 'platform_admin', title: 'Platform Administrator', desc: 'Dr. Rajeshwar Sharma (DoLR IT Cell)', color: 'border-purple-400 bg-purple-50 text-purple-900' },
    { role: 'institution_admin', title: 'Institution Admin', desc: 'Prof. Anand K. Murthy (NIRDPR Director)', color: 'border-blue-400 bg-blue-50 text-blue-900' },
    { role: 'public_user', title: 'Public / Citizen', desc: 'Vikramaditya Deshmukh (Civil Society)', color: 'border-slate-300 bg-slate-50 text-slate-800' }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="bg-[#0a2540] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 font-bold flex items-center justify-center text-[10px]">
              सत्यमेव
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">National Land Governance Portal</h3>
              <p className="text-[10px] text-slate-300">Department of Land Resources (DoLR), MoRD</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-300 hover:text-white p-1 rounded transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 flex items-start space-x-2 text-[11px]">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Official Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  placeholder="e.g. researcher@iitd.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0a2540] text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0a2540] text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#0a2540] hover:bg-[#1e3a5f] disabled:opacity-50 text-white font-semibold rounded transition text-xs flex items-center justify-center space-x-1.5 shadow-xs"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Sign In to Portal</span>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block text-center">
              Or Fast-Track Demo Login (All 5 Roles)
            </span>

            <div className="space-y-1.5">
              {roleConfigs.map((cfg) => (
                <button
                  key={cfg.role}
                  type="button"
                  onClick={() => handleDemoLogin(cfg.role)}
                  className={`w-full p-2 rounded-lg border text-left flex items-center justify-between hover:shadow-xs transition ${cfg.color}`}
                >
                  <div>
                    <span className="font-bold text-[11px] block">{cfg.title}</span>
                    <span className="text-[10px] opacity-75 block">{cfg.desc}</span>
                  </div>
                  <span className="text-[10px] font-semibold underline">Select →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
