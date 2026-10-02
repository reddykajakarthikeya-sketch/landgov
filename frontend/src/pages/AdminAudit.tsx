import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  Clock, 
  Terminal, 
  Filter, 
  Lock,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminAudit: React.FC = () => {
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
      <div className="bg-rose-50 border border-rose-200 rounded-lg p-6 text-center space-y-3">
        <Lock className="w-8 h-8 text-rose-600 mx-auto" />
        <h3 className="font-bold text-rose-900 text-sm">Access Restricted: Security Audit Logs</h3>
        <p className="text-xs text-rose-700 max-w-md mx-auto">
          System audit logs contain sensitive operational tracking data and are strictly restricted to verified Platform Administrators.
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
      <div className="bg-[#0a2540] text-white p-6 rounded-lg shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h2 className="text-xl font-bold">Immutable System Security & Audit Log Stream</h2>
          </div>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
            Cryptographically timestamped trail of platform mutations, authentication events, dataset validations, policy simulations, and grant sanction actions.
          </p>
        </div>
        <button 
          onClick={loadAuditLogs}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-600 flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Audit Stream</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search action, user, or event details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0a2540]"
          />
        </div>

        <div className="flex items-center space-x-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-600">Module:</span>
          <select
            value={moduleFilter}
            onChange={(e) => setModuleFilter(e.target.value)}
            className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-slate-50 focus:outline-none"
          >
            <option value="all">All Modules ({logs.length})</option>
            {modules.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-[#0a2540] border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No audit records found matching the query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-900 text-slate-300 font-sans uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Event Action</th>
                  <th className="py-3 px-4">Module</th>
                  <th className="py-3 px-4">Initiator</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4 text-right">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px]">
                {filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-4 text-slate-500 whitespace-nowrap">
                      {l.created_at}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-800">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px]">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-600">
                      {l.module}
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 font-sans">
                      {l.user_email}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 font-sans max-w-xs truncate" title={l.details}>
                      {l.details || '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-400">
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
