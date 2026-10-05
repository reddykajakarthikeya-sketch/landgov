import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';

export const AdminAudit: React.FC = () => {
  const { t, language } = useTranslation();
  const isHi = language === 'hi';
  const { user, isPlatformAdmin } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('all');

  useEffect(() => {
    loadAuditLogs();
  }, [user]);

  async function loadAuditLogs() {
    setLoading(true);
    try {
      const data = await api.getAuditLogs(100);
      setLogs(data || []);
    } catch (err: any) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  }

  if (!isPlatformAdmin) {
    return (
      <div className="liquid-glass border border-[#C56A9A]/40 bg-[#C56A9A]/10 rounded-2xl p-8 text-center space-y-3">
        <Lock className="w-10 h-10 text-[#C56A9A] mx-auto" />
        <h3 className="font-bold text-[#C56A9A] text-sm">{isHi ? "पहुंच प्रतिबंधित: सुरक्षा ऑडिट लॉग" : "Access Restricted: Security Audit Logs"}</h3>
        <p className="text-xs text-[#A7ADA8] max-w-md mx-auto">
          {isHi 
            ? "सिस्टम ऑडिट लॉग में संवेदनशील परिचालन ट्रैकिंग डेटा शामिल है और यह केवल सत्यापित प्लेटफ़ॉर्म प्रशासकों तक ही सीमित है।"
            : "System audit logs contain sensitive operational tracking data and are strictly restricted to verified Platform Administrators."}
        </p>
      </div>
    );
  }

  const filteredLogs = logs.filter(l => {
    const matchesSearch = 
      l.action?.toLowerCase().includes(search.toLowerCase()) ||
      l.user_email?.toLowerCase().includes(search.toLowerCase()) ||
      l.details?.toLowerCase().includes(search.toLowerCase());
    const matchesModule = moduleFilter === 'all' || l.module === moduleFilter;
    return matchesSearch && matchesModule;
  });

  const modules = Array.from(new Set(logs.map(l => l.module).filter(Boolean)));

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="liquid-glass p-6 rounded-2xl border border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#101313]/70">
        <div>
          <div className="flex items-center space-x-3">
            <span className="p-2.5 bg-white/5 text-[#B7E300] rounded-xl border border-white/10">
              <ShieldCheck className="w-6 h-6 text-[#B7E300]" />
            </span>
            <h2 className="text-xl font-bold text-[#F2F4EF]">{isHi ? "अपरिवर्तनीय सिस्टम सुरक्षा एवं ऑडिट लॉग स्ट्रीम" : "Immutable System Security & Audit Log Stream"}</h2>
          </div>
          <p className="text-[#A7ADA8] text-xs mt-2 max-w-2xl leading-relaxed">
            Cryptographically timestamped trail of platform mutations, authentication events, dataset validations, policy simulations, and grant sanction actions.
          </p>
        </div>
        <button 
          onClick={loadAuditLogs}
          className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-xs text-[#F2F4EF] rounded-xl border border-white/10 flex items-center space-x-2 cursor-pointer self-start md:self-auto transition shadow-xs font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{isHi ? "ऑडिट स्ट्रीम ताज़ा करें" : "Refresh Audit Stream"}</span>
        </button>
      </div>

      {/* Filters */}
      <div className="liquid-glass p-4 rounded-2xl border border-white/10 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between bg-[#101313]/70">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-[#A7ADA8]" />
          <input
            type="text"
            placeholder={isHi ? "कार्रवाई, उपयोगकर्ता या विवरण खोजें..." : "Search action, user, or event details..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-[#A7ADA8]">{isHi ? "मॉड्यूल:" : "Module:"}</span>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-xs border border-white/10 rounded-xl px-3 py-2 bg-[#151919] text-[#F2F4EF] focus:outline-none focus:border-[#B7E300]/50"
          >
            <option value="all">{isHi ? "सभी मॉड्यूल" : "All Modules"} ({logs.length})</option>
            {modules.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="liquid-glass rounded-2xl border border-white/10 shadow-sm overflow-hidden bg-[#101313]/70">
        {loading ? (
          <div className="p-16 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-white/10 border-t-[#B7E300] rounded-full animate-spin"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-[#A7ADA8] text-xs">
            {isHi ? "कोई ऑडिट रिकॉर्ड नहीं मिला।" : "No audit records found matching the query."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-white/[0.03] text-[#F2F4EF] font-sans uppercase text-[10px] tracking-wider border-b border-white/10 font-mono">
                <tr>
                  <th className="py-3.5 px-4">{isHi ? "समय-मुहर" : "Timestamp"}</th>
                  <th className="py-3.5 px-4">{isHi ? "घटना कार्रवाई" : "Event Action"}</th>
                  <th className="py-3.5 px-4">{isHi ? "मॉड्यूल" : "Module"}</th>
                  <th className="py-3.5 px-4">{isHi ? "प्रारंभकर्ता" : "Initiator"}</th>
                  <th className="py-3.5 px-4">{isHi ? "विवरण" : "Details"}</th>
                  <th className="py-3.5 px-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-[11px] text-[#A7ADA8]">
                {filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-white/[0.03] transition">
                    <td className="py-3 px-4 text-[#A7ADA8] whitespace-nowrap">
                      {l.created_at}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#B7E300]">
                      <span className="px-2 py-0.5 rounded-full bg-[#B7E300]/10 border border-[#B7E300]/30 text-[10px]">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#78C8C8]">
                      {l.module}
                    </td>
                    <td className="py-3 px-4 text-[#F2F4EF] font-sans font-medium">
                      {l.user_email}
                    </td>
                    <td className="py-3 px-4 text-[#A7ADA8] font-sans max-w-xs truncate" title={l.details}>
                      {l.details || '—'}
                    </td>
                    <td className="py-3 px-4 text-right text-[#6F7772]">
                      {l.ip_address || '127.0.0.1'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
