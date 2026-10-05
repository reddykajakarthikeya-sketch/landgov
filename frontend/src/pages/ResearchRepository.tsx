import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  FileText, 
  Download, 
  Eye, 
  Calendar, 
  Building2, 
  CheckCircle2, 
  Copy, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchResource } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import { Card3D } from '../components/ui/Card3D';

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
  const { t, language } = useTranslation();
  const isHi = language === 'hi';
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
      {/* Controls & Search Filter Bar in Liquid Glass */}
      <div className="liquid-glass p-5 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#B7E300]" />
            <input
              type="text"
              placeholder={isHi ? "शीर्षक, अमूर्त, लेखक या विभाग द्वारा खोजें..." : "Search by title, abstract keywords, author, or government body..."}
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-12 py-2.5 text-xs bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-2.5 text-[#A7ADA8] hover:text-[#F2F4EF] text-xs px-2 py-0.5 rounded bg-white/10"
              >
                {isHi ? "हटाएं" : "Clear"}
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            {/* Domain Filter */}
            <select
              value={domainFilter}
              onChange={(e) => { setDomainFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-xs bg-[#151919] border border-white/10 rounded-xl text-[#F2F4EF] focus:outline-none focus:border-[#B7E300]/50"
            >
              <option value="">{isHi ? "सभी अनुसंधान डोमेन" : "All Research Domains"}</option>
              <option value="land_records">{isHi ? "भू-अभिलेख और कैडस्ट्रे" : "Land Records & Cadastre"}</option>
              <option value="watershed_management">{isHi ? "जलसंभर एवं उपग्रह (26015)" : "Watershed & Satellite (26015)"}</option>
              <option value="land_acquisition">{isHi ? "भूमि अधिग्रहण (26016/25017)" : "Land Acquisition (26016/25017)"}</option>
              <option value="urban_expansion">{isHi ? "शहरी विस्तार एवं ज़ोनिंग" : "Urban Expansion & Zoning"}</option>
              <option value="dispute_resolution">{isHi ? "विवाद निवारण एवं न्यायालय" : "Dispute Resolution & Courts"}</option>
              <option value="climate_resilience">{isHi ? "जलवायु लचीलापन" : "Climate Resilience"}</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 text-xs bg-[#151919] border border-white/10 rounded-xl text-[#F2F4EF] focus:outline-none focus:border-[#B7E300]/50"
            >
              <option value="">{isHi ? "सभी दस्तावेज़ प्रकार" : "All Document Types"}</option>
              <option value="policy_document">{isHi ? "नीति दस्तावेज़" : "Policy Documents"}</option>
              <option value="research_paper">{isHi ? "शोध पत्र" : "Research Papers"}</option>
              <option value="government_report">{isHi ? "सरकारी रिपोर्टें" : "Government Reports"}</option>
              <option value="case_study">{isHi ? "केस स्टडीज" : "Case Studies"}</option>
              <option value="land_law">{isHi ? "कानूनी अधिनियम एवं निर्देश" : "Legal Acts & Directives"}</option>
            </select>

            {/* Sort Filter */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 text-xs bg-[#151919] border border-white/10 rounded-xl text-[#F2F4EF] focus:outline-none focus:border-[#B7E300]/50"
            >
              <option value="latest">{isHi ? "क्रम: नवीनतम" : "Sort: Latest"}</option>
              <option value="views">{isHi ? "क्रम: सर्वाधिक देखे गए" : "Sort: Most Viewed"}</option>
              <option value="downloads">{isHi ? "क्रम: सर्वाधिक डाउनलोड" : "Sort: Most Downloaded"}</option>
              <option value="title">{isHi ? "क्रम: शीर्षक अ-ज्ञ" : "Sort: Title A-Z"}</option>
            </select>
          </div>
        </div>

        {/* SIH Official Toggle & Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/10 text-xs">
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sihOnly}
                onChange={(e) => { setSihOnly(e.target.checked); setPage(1); }}
                className="rounded border-white/20 text-[#B7E300] focus:ring-[#B7E300] h-4 w-4 bg-white/5"
              />
              <span className="font-semibold text-[#B7E300] flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#B7E300]" />
                <span>{isHi ? "केवल आधिकारिक SIH 2026 दस्तावेज़ दिखाएं" : "Show Official SIH 2026 Documents Only"}</span>
              </span>
            </label>
            <span className="text-white/20">|</span>
            <span className="text-[#A7ADA8]">
              {isHi ? "कुल " : "Showing "}
              <strong className="text-[#F2F4EF]">{resources.length}</strong>
              {isHi ? " में से " : " of "}
              <strong className="text-[#F2F4EF]">{totalCount}</strong>
              {isHi ? " संसाधन" : " resources"}
            </span>
          </div>

          {/* Submit Resource Button */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="btn-primary-cta px-4 py-2 text-xs flex items-center space-x-1.5 cursor-pointer font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isHi ? "नया संसाधन जमा करें" : "Submit Resource"}</span>
          </button>
        </div>
      </div>

      {/* Resource Cards Grid */}
      {loading ? (
        <div className="py-16 flex justify-center items-center">
          <div className="w-10 h-10 border-4 border-white/10 border-t-[#B7E300] rounded-full animate-spin"></div>
        </div>
      ) : resources.length === 0 ? (
        <div className="liquid-glass rounded-2xl border border-white/10 p-12 text-center">
          <BookOpen className="w-12 h-12 text-[#78C8C8]/60 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#F2F4EF]">{isHi ? "कोई संसाधन नहीं मिला" : "No resources found"}</h3>
          <p className="text-xs text-[#A7ADA8] mt-1">{isHi ? "कृपया अपने खोज शब्द या फ़िल्टर बदलकर पुनः प्रयास करें।" : "Try relaxing your search terms or filters."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((item) => (
            <Card3D
              key={item.id}
              maxTilt={3.5}
              className={`liquid-glass-card rounded-2xl border p-5 flex flex-col justify-between relative group ${
                item.is_sih_official ? 'border-[#B7E300]/40 ring-1 ring-[#B7E300]/20' : 'border-white/10'
              }`}
            >
              <div>
                {/* Badges Header */}
                <div className="flex items-center justify-between gap-1 mb-2.5">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-white/5 text-[#A7ADA8] capitalize border border-white/10">
                    {item.resource_type.replace('_', ' ')}
                  </span>
                  {item.is_sih_official && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-[#B7E300]/10 text-[#B7E300] border border-[#B7E300]/30 flex items-center space-x-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#B7E300] animate-pulse"></span>
                      <span>SIH Doc {item.sih_doc_id}</span>
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 
                  onClick={() => handleOpenDoc(item.id)}
                  className="text-sm font-bold text-[#F2F4EF] group-hover:text-[#B7E300] transition cursor-pointer line-clamp-2 leading-snug"
                >
                  {item.title}
                </h3>

                {/* Abstract snippet */}
                <p className="text-xs text-[#A7ADA8] mt-2.5 line-clamp-3 leading-relaxed">
                  {item.abstract}
                </p>

                {/* Metadata tags */}
                <div className="mt-3.5 pt-3 border-t border-white/10 flex flex-wrap gap-1.5 text-[10px] text-[#A7ADA8]">
                  <span className="flex items-center space-x-1 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/10">
                    <Building2 className="w-3 h-3 text-[#78C8C8]" />
                    <span className="truncate max-w-[140px] text-[#F2F4EF]">{item.organization}</span>
                  </span>
                  <span className="flex items-center space-x-1 bg-white/[0.04] px-2 py-0.5 rounded-md border border-white/10">
                    <Calendar className="w-3 h-3 text-[#C7CBC7]" />
                    <span className="text-[#F2F4EF]">{item.publication_year}</span>
                  </span>
                  <span className="bg-white/5 text-[#78C8C8] px-2 py-0.5 rounded-md font-medium border border-[#78C8C8]/20">
                    {item.domain.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 text-[#6F7772] text-[11px]">
                  <span className="flex items-center space-x-1">
                    <Eye className="w-3.5 h-3.5 text-[#6F7772]" />
                    <span>{item.view_count}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Download className="w-3.5 h-3.5 text-[#6F7772]" />
                    <span>{item.download_count}</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenDoc(item.id)}
                    className="btn-secondary-cta px-3 py-1 text-xs cursor-pointer"
                  >
                    {t('repository.view_doc', isHi ? 'विवरण देखें' : 'View Details')}
                  </button>
                  <a
                    href={`/api/repository/resources/${item.id}/download`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-[#F2F4EF] hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition flex items-center justify-center cursor-pointer"
                    title={t('repository.download_pdf', isHi ? 'पीडीएफ डाउनलोड करें' : 'Download PDF')}
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </Card3D>
          ))}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between liquid-glass px-5 py-3 rounded-2xl border border-white/10 text-xs text-[#A7ADA8]">
          <p>
            {isHi ? "पृष्ठ " : "Page "}
            <strong className="text-[#F2F4EF]">{page}</strong>
            {isHi ? " कुल " : " of "}
            <strong className="text-[#F2F4EF]">{totalPages}</strong>
          </p>
          <div className="flex items-center space-x-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition text-[#F2F4EF]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 transition text-[#F2F4EF]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Document Detail Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-[#080A0A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="liquid-glass-elevated rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-white/15 text-[#F2F4EF] bg-[#101313]/95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-[#B7E300]" />
                <h3 className="font-bold text-sm text-[#F2F4EF]">{isHi ? "आधिकारिक दस्तावेज़ डॉसियर" : "Official Document Dossier"}</h3>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-[#A7ADA8] hover:text-[#F2F4EF] p-1 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#F2F4EF]">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                <span className="font-semibold text-[#A7ADA8] uppercase tracking-wider text-[10px]">
                  {selectedDoc.organization}
                </span>
                {selectedDoc.is_sih_official && (
                  <span className="px-2.5 py-0.5 rounded-full bg-[#B7E300]/10 text-[#B7E300] font-bold border border-[#B7E300]/30 text-[11px]">
                    Verified SIH Problem Statement: {selectedDoc.sih_doc_id}
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold text-[#F2F4EF] leading-snug">
                {selectedDoc.title}
              </h2>

              <div className="p-4 bg-white/[0.03] rounded-xl border border-white/10 space-y-1.5">
                <p className="font-semibold text-[#B7E300]">{isHi ? "सार / कार्यकारी वक्तव्य:" : "Abstract / Executive Statement:"}</p>
                <p className="text-[#A7ADA8] leading-relaxed">{selectedDoc.abstract}</p>
              </div>

              {selectedDoc.extracted_text_preview && (
                <div className="space-y-1.5">
                  <p className="font-semibold text-[#78C8C8]">{isHi ? "निकाला गया नीतिगत / तकनीकी पाठ:" : "Extracted Policy / Technical Text:"}</p>
                  <div className="p-3.5 bg-black/40 text-[#F2F4EF] font-mono text-[11px] rounded-xl max-h-48 overflow-y-auto whitespace-pre-wrap leading-relaxed border border-white/10">
                    {selectedDoc.extracted_text_preview}
                  </div>
                </div>
              )}

              {/* Citation Box */}
              <div className="p-3.5 bg-white/[0.02] border border-white/10 rounded-xl">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-[#C7CBC7] text-[11px]">{isHi ? "आधिकारिक उद्धरण" : "Official Citation"}</span>
                  <button
                    onClick={() => handleCopyCitation(selectedDoc.citation || selectedDoc.title)}
                    className="text-[10px] text-[#B7E300] hover:underline flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCitation ? (isHi ? 'कॉपी किया गया!' : 'Copied!') : (isHi ? 'उद्धरण कॉपी करें' : 'Copy Citation')}</span>
                  </button>
                </div>
                <p className="text-[#A7ADA8] italic text-[11px]">
                  {selectedDoc.citation || `${selectedDoc.organization} (${selectedDoc.publication_year}). ${selectedDoc.title}.`}
                </p>
              </div>

              {/* AI Assistant Quick Trigger */}
              <div className="p-3.5 bg-[#B7E300]/5 border border-[#B7E300]/20 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <Sparkles className="w-4 h-4 text-[#B7E300]" />
                  <span className="font-semibold text-[#F2F4EF]">{isHi ? "इस दस्तावेज़ का AI सहायक से विश्लेषण करें" : "Analyze this document with AI Assistant"}</span>
                </div>
                <button
                  onClick={() => {
                    if (onSelectDocForAI) onSelectDocForAI(selectedDoc.id);
                    if (onNavigateToAI) onNavigateToAI();
                    setSelectedDoc(null);
                  }}
                  className="btn-primary-cta px-4 py-1.5 text-xs cursor-pointer font-medium"
                >
                  {isHi ? "AI विश्लेषण प्रारंभ करें" : "Launch AI Analysis"}
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-white/[0.02] border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#6F7772]">
                {isHi ? "दृश्य: " : "Views: "}{selectedDoc.view_count} • {isHi ? "डाउनलोड: " : "Downloads: "}{selectedDoc.download_count}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="btn-secondary-cta px-3.5 py-1.5 text-xs cursor-pointer"
                >
                  {isHi ? "बंद करें" : "Close"}
                </button>
                <a
                  href={`/api/repository/resources/${selectedDoc.id}/download`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-primary-cta px-4 py-1.5 text-xs flex items-center space-x-1 cursor-pointer font-medium"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>{isHi ? "दस्तावेज़ डाउनलोड करें" : "Download Document"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resource Submission Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-[#080A0A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="liquid-glass-elevated rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-white/15 text-[#F2F4EF] bg-[#101313]/95">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="font-bold text-sm text-[#F2F4EF]">{isHi ? "शोध / नीति दस्तावेज़ जमा करें" : "Submit Research / Policy Document"}</h3>
              <button onClick={() => setShowSubmitModal(false)} className="text-[#A7ADA8] hover:text-[#F2F4EF]">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="p-8 text-center space-y-2">
                <CheckCircle2 className="w-12 h-12 text-[#B7E300] mx-auto" />
                <h4 className="text-sm font-bold text-[#F2F4EF]">{isHi ? "संसाधन सफलतापूर्वक जमा किया गया" : "Resource Submitted Successfully"}</h4>
                <p className="text-xs text-[#A7ADA8]">{isHi ? "दस्तावेज़ राष्ट्रीय रिपॉजिटरी में अनुक्रमित कर दिया गया है।" : "Document has been indexed in the national repository."}</p>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-3.5 text-xs text-[#F2F4EF]">
                <div>
                  <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "दस्तावेज़ शीर्षक *" : "Document Title *"}</label>
                  <input
                    type="text"
                    required
                    value={submitForm.title}
                    onChange={(e) => setSubmitForm({ ...submitForm, title: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                    placeholder="e.g. Empirical Study of Conclusive Land Titling in Rajasthan"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "संसाधन प्रकार" : "Resource Type"}</label>
                    <select
                      value={submitForm.resource_type}
                      onChange={(e) => setSubmitForm({ ...submitForm, resource_type: e.target.value })}
                      className="w-full px-3 py-2 bg-[#151919] border border-white/10 rounded-xl text-[#F2F4EF] focus:outline-none"
                    >
                      <option value="research_paper">{isHi ? "शोध पत्र" : "Research Paper"}</option>
                      <option value="policy_document">{isHi ? "नीति दस्तावेज़" : "Policy Document"}</option>
                      <option value="government_report">{isHi ? "सरकारी रिपोर्ट" : "Government Report"}</option>
                      <option value="case_study">{isHi ? "केस स्टडी" : "Case Study"}</option>
                      <option value="land_law">{isHi ? "कानूनी अधिनियम" : "Legal Act"}</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "शोध डोमेन" : "Research Domain"}</label>
                    <select
                      value={submitForm.domain}
                      onChange={(e) => setSubmitForm({ ...submitForm, domain: e.target.value })}
                      className="w-full px-3 py-2 bg-[#151919] border border-white/10 rounded-xl text-[#F2F4EF] focus:outline-none"
                    >
                      <option value="land_records">{isHi ? "भू-अभिलेख और कैडस्ट्रे" : "Land Records & Cadastre"}</option>
                      <option value="watershed_management">{isHi ? "जलसंभर प्रबंधन" : "Watershed Management"}</option>
                      <option value="land_acquisition">{isHi ? "भूमि अधिग्रहण" : "Land Acquisition"}</option>
                      <option value="urban_expansion">{isHi ? "शहरी विस्तार" : "Urban Expansion"}</option>
                      <option value="dispute_resolution">{isHi ? "विवाद निवारण" : "Dispute Resolution"}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "लेखक एवं योगदानकर्ता *" : "Authors & Contributors *"}</label>
                  <input
                    type="text"
                    required
                    value={submitForm.authors}
                    onChange={(e) => setSubmitForm({ ...submitForm, authors: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                    placeholder="e.g. Dr. A. Sharma, Prof. K. Patel"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "कार्यकारी सार *" : "Executive Abstract *"}</label>
                  <textarea
                    required
                    rows={3}
                    value={submitForm.abstract}
                    onChange={(e) => setSubmitForm({ ...submitForm, abstract: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                    placeholder="Provide a concise summary of the research methodology and policy conclusions..."
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "कीवर्ड (अल्पविराम से अलग)" : "Keywords (Comma-separated)"}</label>
                  <input
                    type="text"
                    value={submitForm.keywords}
                    onChange={(e) => setSubmitForm({ ...submitForm, keywords: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                    placeholder="e.g. DILRMP, GIS, Khasra, Torrens Titling"
                  />
                </div>

                <div className="pt-3 border-t border-white/10 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowSubmitModal(false)}
                    className="btn-secondary-cta px-4 py-1.5 text-xs cursor-pointer"
                  >
                    {isHi ? "रद्द करें" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-cta px-5 py-1.5 text-xs cursor-pointer font-medium"
                  >
                    {isHi ? "रिपॉजिटरी में जमा करें" : "Submit to Repository"}
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
