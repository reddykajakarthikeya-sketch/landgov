import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Tag, 
  Copy, 
  Plus, 
  X, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchResource } from '../types';
import { useAuth } from '../context/AuthContext';

interface RepositoryProps {
  initialSearch?: string;
  onSelectDocForAI?: (docId: number) => void;
  onNavigateToAI?: () => void;
}

export const ResearchRepository: React.FC<RepositoryProps> = ({ 
  initialSearch = '', 
  onSelectDocForAI, 
  onNavigateToAI 
}) => {
  const { user } = useAuth();
  const [resources, setResources] = useState<ResearchResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [domainFilter, setDomainFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sihOnly, setSihOnly] = useState(false);
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Selected resource for modal preview
  const [selectedDoc, setSelectedDoc] = useState<any | null>(null);
  const [docLoading, setDocLoading] = useState(false);
  const [copiedCitation, setCopiedCitation] = useState(false);

  // Submit resource modal
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    title: '',
    abstract: '',
    resource_type: 'research_paper',
    domain: 'land_records',
    authors: '',
    publication_year: 2026,
    organization: user?.organization || 'National Institute of Rural Development',
    citation: '',
    keywords: ''
  });
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchResources();
  }, [search, domainFilter, typeFilter, sihOnly, sortBy, page]);

  async function fetchResources() {
    setLoading(true);
    try {
      const res = await api.getResources({
        search: search || undefined,
        domain: domainFilter || undefined,
        resource_type: typeFilter || undefined,
        is_sih_official: sihOnly ? true : undefined,
        sort_by: sortBy,
        page,
        limit: 9
      });
      setResources(res.items || []);
      setTotalPages(res.total_pages || 1);
      setTotalCount(res.total || 0);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenDoc(id: number) {
    setDocLoading(true);
    try {
      const detail = await api.getResourceDetail(id);
      setSelectedDoc(detail);
    } catch (err) {
      console.error('Failed to load document details:', err);
    } finally {
      setDocLoading(false);
    }
  }

  function handleCopyCitation(text: string) {
    navigator.clipboard.writeText(text);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await api.submitResource(submitForm);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setShowSubmitModal(false);
        fetchResources();
      }, 1500);
    } catch (err) {
      console.error('Submit error:', err);
      alert('Error submitting resource.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Controls & Search Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, abstract keywords, author, or government body..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0a2540] text-slate-800"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            {/* Domain Filter */}
            <select
              value={domainFilter}
              onChange={(e) => { setDomainFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0a2540]"
            >
              <option value="">All Research Domains</option>
              <option value="land_records">Land Records & Cadastre</option>
              <option value="watershed_management">Watershed & Satellite (26015)</option>
              <option value="land_acquisition">Land Acquisition (26016/25017)</option>
              <option value="urban_expansion">Urban Expansion & Zoning</option>
              <option value="dispute_resolution">Dispute Resolution & Courts</option>
              <option value="climate_resilience">Climate Resilience</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0a2540]"
            >
              <option value="">All Document Types</option>
              <option value="policy_document">Policy Documents</option>
              <option value="research_paper">Research Papers</option>
              <option value="government_report">Government Reports</option>
              <option value="case_study">Case Studies</option>
              <option value="land_law">Legal Acts & Directives</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0a2540]"
            >
              <option value="latest">Sort: Latest</option>
              <option value="views">Sort: Most Viewed</option>
              <option value="downloads">Sort: Most Downloaded</option>
              <option value="title">Sort: Title A-Z</option>
            </select>
          </div>
        </div>

        {/* SIH Official Toggle & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sihOnly}
                onChange={(e) => { setSihOnly(e.target.checked); setPage(1); }}
                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
              />
              <span className="font-semibold text-emerald-800 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Show Official SIH 2026 Documents Only</span>
              </span>
            </label>
            <span className="text-slate-400">|</span>
            <span className="text-slate-500">
              Showing <strong>{resources.length}</strong> of <strong>{totalCount}</strong> resources
            </span>
          </div>

          {/* Submit Resource Button (Protected by RBAC) */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-3 py-1.5 bg-[#0a2540] hover:bg-[#1e3a5f] text-white font-medium rounded-md transition flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Submit Resource</span>
          </button>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <div className="py-12 flex justify-center items-center">
          <div className="w-8 h-8 border-4 border-[#0a2540] border-t-amber-500 rounded-full animate-spin"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No resources found</h3>
          <p className="text-xs text-slate-500 mt-1">Try relaxing your search terms or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-lg border p-4 shadow-xs flex flex-col justify-between hover:shadow-md transition relative group ${
                item.is_sih_official ? 'border-emerald-300 ring-1 ring-emerald-400/30' : 'border-slate-200'
              }`}
            >
              <div>
                {/* Badges Header */}
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold bg-slate-100 text-slate-700 capitalize">
                    {item.resource_type.replace('_', ' ')}
                  </span>
                  {item.is_sih_official && (
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                      <span>SIH Doc {item.sih_doc_id}</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 
                  onClick={() => handleOpenDoc(item.id)}
                  className="text-sm font-bold text-[#0a2540] group-hover:text-blue-700 transition cursor-pointer line-clamp-2 leading-snug"
                >
                  {item.title}
                </h3>

                {/* Abstract snippet */}
                <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                  {item.abstract}
                </p>

                {/* Metadata tags */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap gap-1.5 text-[10px] text-slate-500">
                  <span className="flex items-center space-x-1 bg-slate-50 px-1.5 py-0.5 rounded">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span className="truncate max-w-[140px]">{item.organization}</span>
                  </span>
                  <span className="flex items-center space-x-1 bg-slate-50 px-1.5 py-0.5 rounded">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>{item.publication_year}</span>
                  </span>
                  <span className="bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-medium">
                    {item.domain.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 text-slate-400 text-[11px]">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{item.view_count}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Download className="w-3.5 h-3.5" />
                    <span>{item.download_count}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenDoc(item.id)}
                    className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded font-medium transition text-xs"
                  >
                    View Details
                  </button>
                  <a
                    href={`/api/repository/resources/${item.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1 text-blue-700 hover:bg-blue-50 rounded transition"
                    title="Download Official PDF"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-slate-200 text-xs">
          <p className="text-slate-500">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </p>
          <div className="flex items-center space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded border border-slate-300 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Document Detail Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-[#0a2540] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-sm">Official Document Dossier</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-slate-300 hover:text-white p-1 rounded transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200">
                <span className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">
                  {selectedDoc.organization}
                </span>
                {selectedDoc.is_sih_official && (
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 text-[11px]">
                    Verified SIH Problem Statement: {selectedDoc.sih_doc_id}
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold text-[#0a2540] leading-snug">
                {selectedDoc.title}
              </h2>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                <p className="font-semibold text-slate-700">Abstract / Executive Statement:</p>
                <p className="text-slate-600 leading-relaxed">{selectedDoc.abstract}</p>
              </div>

              {selectedDoc.extracted_text_preview && (
                <div className="space-y-1">
                  <p className="font-semibold text-slate-700">Extracted Policy / Technical Text:</p>
                  <div className="p-3 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                    {selectedDoc.extracted_text_preview}
                  </div>
                </div>
              )}

              {/* Citation Box */}
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-amber-900 text-[11px]">Official Citation</span>
                  <button
                    onClick={() => handleCopyCitation(selectedDoc.citation || selectedDoc.title)}
                    className="text-[10px] text-amber-800 font-medium hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCitation ? 'Copied!' : 'Copy Citation'}</span>
                  </button>
                </div>
                <p className="text-slate-700 italic text-[11px]">
                  {selectedDoc.citation || `${selectedDoc.organization} (${selectedDoc.publication_year}). ${selectedDoc.title}.`}
                </p>
              </div>

              {/* AI Assistant Quick Trigger */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-blue-700" />
                  <span className="font-semibold text-blue-900">Analyze this document with AI Assistant</span>
                </div>
                <button
                  onClick={() => {
                    if (onSelectDocForAI) onSelectDocForAI(selectedDoc.id);
                    if (onNavigateToAI) onNavigateToAI();
                    setSelectedDoc(null);
                  }}
                  className="px-3 py-1 bg-blue-700 hover:bg-blue-800 text-white rounded font-semibold text-[11px] transition"
                >
                  Launch AI Analysis
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Views: {selectedDoc.view_count} • Downloads: {selectedDoc.download_count}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-100 transition"
                >
                  Close
                </button>
                <a
                  href={`/api/repository/resources/${selectedDoc.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded bg-[#0a2540] hover:bg-[#1e3a5f] text-white font-semibold transition flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>Download Document</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resource Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="px-6 py-4 bg-[#0a2540] text-white flex items-center justify-between">
              <h3 className="font-bold text-sm">Submit Research / Policy Document</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">Resource Submitted Successfully</h4>
                <p className="text-xs text-slate-500">Document has been indexed in the national repository.</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={submitForm.title}
                    onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0a2540]"
                    placeholder="e.g. Empirical Study of Conclusive Land Titling in Rajasthan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Resource Type</label>
                    <select
                      value={submitForm.resource_type}
                      onChange={(e) => setSubmitForm({ ...submitForm, resource_type: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none"
                    >
                      <option value="research_paper">Research Paper</option>
                      <option value="policy_document">Policy Document</option>
                      <option value="government_report">Government Report</option>
                      <option value="case_study">Case Study</option>
                      <option value="land_law">Legal Act</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Research Domain</label>
                    <select
                      value={submitForm.domain}
                      onChange={(e) => setSubmitForm({ ...submitForm, domain: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none"
                    >
                      <option value="land_records">Land Records & Cadastre</option>
                      <option value="watershed_management">Watershed Management</option>
                      <option value="land_acquisition">Land Acquisition</option>
                      <option value="urban_expansion">Urban Expansion</option>
                      <option value="dispute_resolution">Dispute Resolution</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Authors & Contributors *</label>
                  <input
                    type="text"
                    required
                    value={submitForm.authors}
                    onChange={(e) => setSubmitForm({ ...submitForm, authors: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none"
                    placeholder="e.g. Dr. A. Sharma, Prof. K. Patel"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Executive Abstract *</label>
                  <textarea
                    required
                    rows={3}
                    value={submitForm.abstract}
                    onChange={(e) => setSubmitForm({ ...submitForm, abstract: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none"
                    placeholder="Provide a concise summary of the research methodology and policy conclusions..."
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Keywords (Comma-separated)</label>
                  <input
                    type="text"
                    value={submitForm.keywords}
                    onChange={(e) => setSubmitForm({ ...submitForm, keywords: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:outline-none"
                    placeholder="e.g. DILRMP, GIS, Khasra, Torrens Titling"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded bg-[#0a2540] hover:bg-[#1e3a5f] text-white font-semibold"
                  >
                    Submit to Repository
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
