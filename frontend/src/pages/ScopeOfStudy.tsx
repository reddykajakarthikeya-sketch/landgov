import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Search, 
  BookOpen, 
  Download, 
  Layers, 
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../services/api';
import { ScopeOfStudyItem } from '../types';
import { useTranslation } from '../i18n';

export const ScopeOfStudy: React.FC = () => {
  const { t, language } = useTranslation();
  const isHi = language === 'hi';
  const [items, setItems] = useState<ScopeOfStudyItem[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getScopeOfStudy();
        setItems(data || []);
      } catch (err) {
        console.error('Failed to load scope of study:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = items.filter(it => 
    it.domain.toLowerCase().includes(search.toLowerCase()) ||
    it.research_questions.toLowerCase().includes(search.toLowerCase()) ||
    it.required_datasets.toLowerCase().includes(search.toLowerCase()) ||
    it.analytical_methods.toLowerCase().includes(search.toLowerCase()) ||
    it.expected_outputs.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Context Banner */}
      <div className="bg-[#151919]/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs border border-white/10 relative overflow-hidden">
        <div className="glass-specular-top" />
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B7E300] animate-pulse"></span>
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#B7E300]">RESEARCH FRAMEWORK</span>
          </div>
          <h3 className="text-base font-bold text-[#F2F4EF] flex items-center space-x-2">
            <Compass className="w-4 h-4 text-[#78C8C8]" />
            <span>{t('scope_of_study.title')}</span>
          </h3>
          <p className="text-[#A7ADA8] mt-1 leading-relaxed max-w-2xl">
            {t('scope_of_study.subtitle')}
          </p>
        </div>
        <div className="relative w-full sm:w-72 shrink-0">
          <Search className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-[#6F7772]" />
          <input
            type="text"
            placeholder={t('scope_of_study.search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-[#F2F4EF] placeholder-[#6F7772] focus:outline-none focus:border-[#B7E300]/50"
          />
        </div>
      </div>

      {/* Scope of Study Table */}
      <div className="bg-[#151919]/70 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/10 relative">
        <div className="glass-specular-top" />
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-black/40 text-[#6F7772] font-mono uppercase text-[10px] tracking-wider border-b border-white/10">
              <tr>
                <th className="px-5 py-3.5 w-44">{t('scope_of_study.domain')}</th>
                <th className="px-5 py-3.5">{t('scope_of_study.research_questions')}</th>
                <th className="px-5 py-3.5 w-60">{t('scope_of_study.required_datasets')}</th>
                <th className="px-5 py-3.5 w-56">{t('scope_of_study.analytical_methods')}</th>
                <th className="px-5 py-3.5 w-64">{t('scope_of_study.expected_outputs')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-[#A7ADA8] bg-transparent">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#6F7772] font-medium">
                    {isHi ? 'अध्ययन का दायरा लोड हो रहा है...' : 'Loading Scope of Study...'}
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#6F7772]">
                    {isHi ? 'कोई मेल खाने वाला दायरा नहीं मिला।' : 'No matching scope of study items found.'}
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition">
                    <td className="px-5 py-4 font-bold text-[#F2F4EF] align-top">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-white/5 text-[#B7E300] border border-[#B7E300]/30 font-mono text-[11px]">
                        {row.domain}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-medium text-[#F2F4EF] leading-relaxed align-top">
                      {row.research_questions}
                    </td>
                    <td className="px-5 py-4 text-[#A7ADA8] leading-relaxed align-top">
                      <span className="font-mono text-[10px] text-[#78C8C8] uppercase tracking-wider block mb-0.5">{isHi ? 'डेटासेट:' : 'Datasets:'}</span>
                      {row.required_datasets}
                    </td>
                    <td className="px-5 py-4 text-[#A7ADA8] leading-relaxed align-top font-mono text-[11px]">
                      {row.analytical_methods}
                    </td>
                    <td className="px-5 py-4 text-[#F2F4EF] leading-relaxed align-top">
                      <span className="font-mono text-[10px] text-[#B7E300] uppercase tracking-wider block mb-0.5">{isHi ? 'परिणाम:' : 'Deliverable:'}</span>
                      {row.expected_outputs}
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
