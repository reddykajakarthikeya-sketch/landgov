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

export const TechnologyArchitecture: React.FC = () => {
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
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div>
          <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-purple-600" />
            <span>Suggested Components-Wise Technology Architecture</span>
          </h3>
          <p className="text-slate-500 mt-0.5">
            Architecture verified against MoRD/DoLR problem statements (26019, 26018, 26016, 25017, 26015)
          </p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search component or framework..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0a2540]"
          />
        </div>
      </div>

      {/* Technology Architecture Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#0a2540] text-white font-bold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5 w-48">System Component</th>
                <th className="px-4 py-3.5 w-52">Technology Stack</th>
                <th className="px-4 py-3.5">Purpose in Land Administration</th>
                <th className="px-4 py-3.5 w-44">Implementation Status</th>
                <th className="px-4 py-3.5 w-60">Future Integration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Loading technology matrix...
                  </td>
                </tr>
              ) : (
                filtered.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3.5 font-bold text-slate-900 align-top">
                      {row.component}
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <span className="inline-block px-2 py-0.5 rounded font-mono text-[11px] bg-slate-100 text-slate-800 font-semibold border border-slate-200">
                        {row.technology}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 leading-relaxed align-top">
                      {row.purpose}
                    </td>
                    <td className="px-4 py-3.5 align-top">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{row.implementation_status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 leading-relaxed align-top italic text-[11px]">
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
