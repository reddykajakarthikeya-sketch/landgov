import React, { useState, useEffect } from 'react';
import { 
  Network, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  Key, 
  Database,
  Code2
} from 'lucide-react';
import { api } from '../services/api';
import { ExternalIntegration } from '../types';

export const APIIntegrations: React.FC = () => {
  const [integrations, setIntegrations] = useState<ExternalIntegration[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<number | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  async function loadIntegrations() {
    setLoading(true);
    try {
      const data = await api.getIntegrations();
      setIntegrations(data || []);
    } catch (err) {
      console.error('Failed to load integrations:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSync(id: number) {
    setSyncingId(id);
    try {
      await api.syncIntegration(id);
      await loadIntegrations();
    } catch (err) {
      alert('Sync failed.');
    } finally {
      setSyncingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Banner & OpenAPI Docs Link */}
      <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div>
          <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
            <Network className="w-4 h-4 text-blue-600" />
            <span>Government Systems Interoperability & API Gateway</span>
          </h3>
          <p className="text-slate-500 mt-0.5">
            Standardized data exchange with ISRO Bhuvan, DILRMP, NJDG e-Courts, and PM Gati Shakti
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <a
            href="http://127.0.0.1:8000/docs"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-[#0a2540] hover:bg-[#1e3a5f] text-white font-semibold rounded-md transition flex items-center space-x-1"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>OpenAPI / Swagger Docs</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      </div>

      {/* Disclosed Simulation Notice */}
      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start space-x-2">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Interoperability Disclosure:</strong> In compliance with Government data sharing regulations, 
          external endpoints operate via sandboxed adapter pipelines simulating production response structures 
          where official department API credentials are restricted.
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((it) => (
          <div
            key={it.id}
            className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-3 text-xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-semibold text-slate-500 text-[10px] uppercase tracking-wider">
                  {it.category}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                  {it.is_simulated ? 'Sandboxed Mock Adapter' : 'Live Gateway'}
                </span>
              </div>

              <h4 className="text-sm font-bold text-[#0a2540]">
                {it.system_name}
              </h4>
              <p className="text-slate-600 mt-1 leading-relaxed">
                {it.description}
              </p>

              <div className="mt-3 p-2 bg-slate-50 rounded border border-slate-200 space-y-1 font-mono text-[10px] text-slate-700">
                <div className="truncate">
                  <span className="text-slate-400">Endpoint: </span>{it.endpoint_url}
                </div>
                <div>
                  <span className="text-slate-400">Auth: </span>{it.auth_mode}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-slate-400 text-[10px]">Records Synced:</span>
                <p className="font-bold text-slate-900">{it.records_synced.toLocaleString()}</p>
                <p className="text-[10px] text-slate-500">{it.last_sync}</p>
              </div>

              <button
                disabled={syncingId === it.id}
                onClick={() => handleSync(it.id)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded transition flex items-center space-x-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingId === it.id ? 'animate-spin text-blue-600' : ''}`} />
                <span>{syncingId === it.id ? 'Syncing...' : 'Sync Gateway'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
