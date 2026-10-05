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
import { useTranslation } from '../i18n';
import { Card3D } from '../components/ui/Card3D';

export const APIIntegrations: React.FC = () => {
  const { t, language } = useTranslation();
  const isHi = language === 'hi';
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
      <div className="bg-[#151919]/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs border border-white/10 relative overflow-hidden">
        <div className="glass-specular-top" />
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B7E300] animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#B7E300]">INTEROPERABILITY GATEWAYS</span>
          </div>
          <h3 className="text-base font-bold text-[#F2F4EF] flex items-center space-x-2">
            <Network className="w-4 h-4 text-[#78C8C8]" />
            <span>{t('integrations.title')}</span>
          </h3>
          <p className="text-[#A7ADA8] mt-1 leading-relaxed max-w-2xl">
            {t('integrations.subtitle')}
          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <a
            href="/docs"
            target="_blank"
            rel="noreferrer"
            className="btn-primary-cta px-4 py-2.5 text-xs inline-flex items-center gap-2 shadow-lg"
          >
            <Code2 className="w-3.5 h-3.5 text-black" />
            <span>{t('integrations.swagger_link')}</span>
            <ExternalLink className="w-3 h-3 text-black/70" />
          </a>
        </div>
      </div>

      {/* Disclosed Simulation Notice */}
      <div className="p-4 rounded-xl text-xs flex items-start space-x-3 border border-[#B7E300]/20 bg-[#B7E300]/5 text-[#F2F4EF]">
        <AlertCircle className="w-4 h-4 text-[#B7E300] shrink-0 mt-0.5" />
        <p className="leading-relaxed text-[#A7ADA8]">
          <strong className="text-[#B7E300]">{isHi ? 'अंतर-संचालनीयता प्रकटीकरण:' : 'Interoperability Disclosure:'}</strong> {isHi 
            ? 'सरकारी डेटा साझाकरण नियमों के अनुपालन में, बाह्य एंडपॉइंट सैंडबॉक्स एडेप्टर पाइपलाइन के माध्यम से संचालित होते हैं जो उत्पादन प्रतिक्रिया संरचना का अनुकरण करते हैं।'
            : 'In compliance with Government data sharing regulations, external endpoints operate via sandboxed adapter pipelines simulating production response structures where official department API credentials are restricted.'}
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((it) => (
          <Card3D
            key={it.id}
            maxTilt={3.5}
            className="bg-[#151919]/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 text-xs border border-white/10 relative overflow-hidden"
          >
            <div className="glass-specular-top" />
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-bold text-[#6F7772] text-[10px] uppercase tracking-wider font-mono">
                  {it.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-white/5 text-[#B7E300] border border-[#B7E300]/30">
                  {it.is_simulated ? (isHi ? 'सैंडबॉक्स्ड मॉक एडेप्टर' : 'Sandboxed Mock Adapter') : (isHi ? 'लाइव गेटवे' : 'Live Gateway')}
                </span>
              </div>

              <h4 className="text-base font-bold text-[#F2F4EF]">
                {it.system_name}
              </h4>
              <p className="text-[#A7ADA8] mt-1 leading-relaxed">
                {it.description}
              </p>

              <div className="mt-3.5 p-3 rounded-xl bg-black/40 space-y-1 font-mono text-[10px] border border-white/5">
                <div className="truncate">
                  <span className="text-[#6F7772] font-sans">{isHi ? 'एंडपॉइंट: ' : 'Endpoint: '}</span>
                  <span className="text-[#78C8C8]">{it.endpoint_url}</span>
                </div>
                <div>
                  <span className="text-[#6F7772] font-sans">{isHi ? 'प्रमाणीकरण: ' : 'Auth: '}</span>
                  <span className="text-[#B7E300]">{it.auth_mode}</span>
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px]">
              <div>
                <span className="text-[#6F7772] text-[10px]">{isHi ? 'सिंक किए गए रिकॉर्ड:' : 'Records Synced:'}</span>
                <p className="font-bold text-[#F2F4EF] text-sm font-mono">{it.records_synced.toLocaleString()}</p>
                <p className="text-[10px] text-[#6F7772] font-mono">{it.last_sync}</p>
              </div>

              <button
                disabled={syncingId === it.id}
                onClick={() => handleSync(it.id)}
                className="btn-secondary-cta px-3.5 py-2 text-xs flex items-center space-x-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingId === it.id ? 'animate-spin text-[#B7E300]' : 'text-[#A7ADA8]'}`} />
                <span>{syncingId === it.id ? (isHi ? 'सिंकिंग...' : 'Syncing...') : (isHi ? 'डेटा सिंक' : 'Sync Gateway')}</span>
              </button>
            </div>
          </Card3D>
        ))}
      </div>
    </div>
  );
};
