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

export const ScopeOfStudy: React.FC = () => {
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
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <span>National Scope of Study & Research Taxonomy</span>
          </h3>
          <p className="text-slate-500 mt-0.5">
            Prescribed framework for academic consortia and DoLR research chairs across 6 core domains
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search domain, methodology, datasets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0a2540]"
          />
        </div>
      </div>

      {/* Scope of Study Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0a2540] text-white font-bold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5 w-44">Research Domain</th>
                <th className="px-4 py-3.5">Research Questions</th>
                <th className="px-4 py-3.5 w-60">Required Datasets</th>
                <th className="px-4 py-3.5 w-56">Analytical Methods</th>
                <th className="px-4 py-3.5 w-64">Expected Policy Outputs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Loading Scope of Study...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No matching scope of study items found.
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5 font-bold text-slate-900 align-top">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-semibold text-[11px]">
                        {row.domain}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-800 leading-relaxed align-top">
                      {row.research_questions}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 leading-relaxed align-top">
                      <span className="font-semibold text-slate-700">Datasets:</span><br/>
                      {row.required_datasets}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 leading-relaxed align-top font-mono text-[11px]">
                      {row.analytical_methods}
                    </td>
                    <td className="px-4 py-3.5 text-slate-800 leading-relaxed align-top">
                      <span className="font-bold text-emerald-800 block mb-0.5">Deliverable:</span>
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
