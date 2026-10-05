import React, { useState, useEffect } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Layers, 
  Database, 
  Server, 
  ShieldCheck, 
  ExternalLink, 
  Search, 
  Clock 
} from 'lucide-react';
import { api } from '../services/api';
import { TechStackItem } from '../types';
import { useTranslation } from '../i18n';

export const TechnologyArchitecture: React.FC = () => {
  const { t, language } = useTranslation();
  const isHi = language === 'hi';
  const [items, setItems] = useState<TechStackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    async function loadTech() {
      try {
        const data = await api.getTechStack();
        setItems(data || []);
      } catch (err) {
        console.error('Failed to load tech stack:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTech();
  }, []);

  const filtered = items.filter(it => 
    it.component.toLowerCase().includes(filterText.toLowerCase()) ||
    it.technology.toLowerCase().includes(filterText.toLowerCase()) ||
    it.purpose.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#151919]/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs border border-white/10 relative overflow-hidden">
        <div className="glass-specular-top" />
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B7E300] animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#B7E300]">SYSTEM ARCHITECTURE</span>
          </div>
          <h3 className="text-base font-bold text-[#F2F4EF] flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#78C8C8]" />
            <span>{t('tech_stack.title')}</span>
          </h3>
          <p className="text-[#A7ADA8] mt-1 leading-relaxed max-w-2xl">
            {t('tech_stack.subtitle')}
          </p>
        </div>
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-[#6F7772]" />
          <input
            type="text"
            placeholder={t('tech_stack.search_placeholder')}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-[#F2F4EF] placeholder-[#6F7772] focus:outline-none focus:border-[#B7E300]/50"
          />
        </div>
      </div>

      {/* Technology Architecture Table */}
      <div className="bg-[#151919]/70 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/10 relative">
        <div className="glass-specular-top" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-black/40 text-[#6F7772] font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5 w-48">{t('tech_stack.component')}</th>
                <th className="px-5 py-3.5 w-52">{t('tech_stack.technology')}</th>
                <th className="px-5 py-3.5">{t('tech_stack.purpose')}</th>
                <th className="px-5 py-3.5 w-44">{t('tech_stack.status')}</th>
                <th className="px-5 py-3.5 w-60">{isHi ? 'भविष्य का एकीकरण' : 'Future Integration'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#A7ADA8] bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#6F7772] font-medium">
                    {isHi ? 'तकनीकी ढांचा लोड हो रहा है...' : 'Loading technology matrix...'}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#6F7772]">
                    {isHi ? 'कोई मेल खाने वाला घटक नहीं मिला।' : 'No matching component found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="px-5 py-4 font-bold text-[#F2F4EF] align-top">
                      {row.component}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="inline-block px-2.5 py-1 rounded-lg font-mono text-[11px] bg-white/5 text-[#78C8C8] border border-white/10 font-bold">
                        {row.technology}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#A7ADA8] leading-relaxed align-top">
                      {row.purpose}
                    </td>
                    <td className="px-5 py-4 align-top">
                      <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold font-mono bg-white/5 text-[#B7E300] border border-[#B7E300]/30">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#B7E300]" />
                        <span>{row.implementation_status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[#6F7772] leading-relaxed align-top italic text-[11px]">
                      {row.future_integration}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
