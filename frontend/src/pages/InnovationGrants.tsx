import React, { useState, useEffect } from 'react';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  FileText, 
  X
} from 'lucide-react';
import { api } from '../services/api';
import { GrantOpportunity } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import { Card3D } from '../components/ui/Card3D';

export const InnovationGrants: React.FC = () => {
  const { t, language } = useTranslation();
  const isHi = language === 'hi';
  const { user } = useAuth();
  const [grants, setGrants] = useState<GrantOpportunity[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Apply modal
  const [selectedGrant, setSelectedGrant] = useState<GrantOpportunity | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [applyForm, setApplyForm] = useState({
    applicant_name: user?.full_name || '',
    institution: user?.organization || 'National Institute of Rural Development',
    proposal_title: '',
    abstract: '',
    budget_requested: '₹25,00,000'
  });
  const [trackingNumber, setTrackingNumber] = useState<string | null>(null);

  useEffect(() => {
    loadGrants();
    loadMyApplications();
  }, []);

  async function loadGrants() {
    setLoading(true);
    try {
      const data = await api.getGrants();
      setGrants(data || []);
    } catch (err) {
      console.error('Failed to load grants:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadMyApplications() {
    try {
      const data = await api.getMyApplications();
      setMyApplications(data || []);
    } catch (err) {
      console.error('Failed to load my applications:', err);
    }
  }

  async function handleApplySubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedGrant) return;
    try {
      const res = await api.applyGrant(selectedGrant.id, applyForm);
      setTrackingNumber(res.tracking_number);
      loadMyApplications();
      loadGrants();
    } catch (err) {
      alert('Failed to submit application.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Banner in Liquid Glass */}
      <div className="liquid-glass p-5 rounded-2xl border border-white/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div>
          <h3 className="text-sm font-bold text-[#F2F4EF] flex items-center space-x-2">
            <Award className="w-5 h-5 text-[#B7E300]" />
            <span>{t('grants.title', isHi ? 'नवाचार अनुदान एवं अनुसंधान फेलोशिप' : 'Policy Innovation Grants & Research Fellowships')}</span>
          </h3>
          <p className="text-[#A7ADA8] mt-1">
            {t('grants.subtitle', isHi ? 'भूमि प्रशासन सुधार हेतु प्रतिस्पर्धी वित्तपोषण अवसर' : 'Competitive research funding for evidence-based land governance reforms')}
          </p>
        </div>
        <span className="text-[11px] px-3 py-1 rounded-full bg-[#B7E300]/10 text-[#B7E300] border border-[#B7E300]/30 font-semibold font-mono">
          Sample Opportunities Clearly Labelled
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grants Opportunities List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#A7ADA8]">
            <span className="font-bold text-[#F2F4EF]">{t('grants.grant_calls', isHi ? 'खुली अनुदान कॉल' : 'Open Grant Calls')} ({grants.length})</span>
            <span className="text-[#6F7772]">All proposals scrutinized under GFR 2017 research grant rules</span>
          </div>

          <div className="space-y-4">
            {grants.map((g) => (
              <Card3D
                key={g.id}
                maxTilt={3.5}
                className="liquid-glass-card rounded-2xl border border-white/10 p-5 shadow-sm space-y-3.5 text-xs text-[#F2F4EF] bg-[#151919]/60"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full font-bold bg-[#B7E300]/10 text-[#B7E300] border border-[#B7E300]/30 uppercase text-[10px] font-mono">
                    {g.opportunity_type}
                  </span>
                  <div className="flex items-center space-x-1.5 text-[#A7ADA8] text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-[#78C8C8]" />
                    <span>{t('grants.deadline', isHi ? 'अंतिम तिथि' : 'Deadline')}: <strong className="text-[#F2F4EF]">{g.deadline}</strong></span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#F2F4EF] leading-snug">
                    {g.title}
                  </h4>
                  <p className="text-[#A7ADA8] mt-1.5 leading-relaxed">
                    {g.description}
                  </p>
                </div>

                <div className="p-3 bg-white/[0.03] rounded-xl border border-white/10 space-y-1 text-[11px] text-[#A7ADA8]">
                  <p><strong className="text-[#F2F4EF]">{t('grants.eligibility', isHi ? 'पात्रता:' : 'Eligibility:')}</strong> {g.eligibility}</p>
                  <p><strong className="text-[#F2F4EF]">Focus Areas:</strong> {g.focus_areas}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div>
                    <span className="text-[11px] text-[#A7ADA8]">{t('grants.total_pool', isHi ? 'कुल निधि' : 'Total Pool')}:</span>
                    <p className="text-sm font-bold text-[#B7E300]">{g.funding_amount}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedGrant(g);
                      setShowApplyModal(true);
                      setTrackingNumber(null);
                    }}
                    className="btn-primary-cta px-4 py-2 text-xs flex items-center space-x-1 cursor-pointer font-medium"
                  >
                    <span>{t('grants.apply_button', isHi ? 'प्रस्ताव जमा करें' : 'Apply for Grant')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card3D>
            ))}
          </div>
        </div>

        {/* My Applications Tracker Sidebar */}
        <div className="space-y-4">
          <div className="liquid-glass p-5 rounded-2xl border border-white/10 shadow-sm space-y-3.5 text-xs bg-[#101313]/70">
            <h4 className="font-bold text-[#F2F4EF] flex items-center space-x-2 pb-3 border-b border-white/10">
              <FileText className="w-4 h-4 text-[#78C8C8]" />
              <span>{isHi ? "मेरे प्रस्तुत प्रस्ताव" : "My Submitted Applications"} ({myApplications.length})</span>
            </h4>

            {myApplications.length === 0 ? (
              <div className="p-6 text-center text-[#A7ADA8]">
                <Clock className="w-8 h-8 mx-auto mb-2 text-[#6F7772]" />
                <p>{isHi ? "अभी कोई सक्रिय प्रस्ताव जमा नहीं किया गया है।" : "No active grant proposals submitted yet."}</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {myApplications.map((app) => (
                  <div key={app.id} className="p-3 bg-white/[0.03] rounded-xl border border-white/10 space-y-1.5 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#F2F4EF] truncate max-w-[150px]">{app.proposal_title}</span>
                      <span className="px-2 py-0.5 rounded-full font-extrabold uppercase bg-[#B7E300]/10 text-[#B7E300] border border-[#B7E300]/30 text-[9px]">
                        {app.status}
                      </span>
                    </div>
                    <p className="text-[#A7ADA8] text-[10px]">{app.grant_title}</p>
                    <div className="flex justify-between pt-1.5 text-[10px] text-[#A7ADA8] border-t border-white/10">
                      <span>Budget: <strong className="text-[#B7E300]">{app.budget_requested}</strong></span>
                      <span className="text-[#6F7772]">{new Date(app.submission_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grant Application Modal */}
      {showApplyModal && selectedGrant && (
        <div className="fixed inset-0 z-50 bg-[#080A0A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="liquid-glass-elevated bg-[#101313]/95 text-[#F2F4EF] rounded-2xl shadow-xl max-w-lg w-full p-6 text-xs space-y-4 border border-white/15">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-[#F2F4EF]">{isHi ? "अनुदान प्रस्ताव प्रस्तुति" : "Grant Proposal Submission"}</h3>
              <button onClick={() => setShowApplyModal(false)}><X className="w-5 h-5 text-[#A7ADA8] hover:text-[#F2F4EF] cursor-pointer" /></button>
            </div>

            {trackingNumber ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-[#B7E300] mx-auto" />
                <h4 className="text-sm font-bold text-[#F2F4EF]">{isHi ? "प्रस्ताव सफलतापूर्वक पंजीकृत हुआ!" : "Proposal Registered Successfully!"}</h4>
                <div className="p-3 bg-white/5 rounded-xl font-mono text-xs font-bold text-[#B7E300] border border-white/10">
                  Tracking ID: {trackingNumber}
                </div>
                <p className="text-[#A7ADA8] text-[11px]">
                  Your application for "{selectedGrant.title}" is now queued for MoRD Technical Scrutiny.
                </p>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="btn-primary-cta px-5 py-2 text-xs cursor-pointer font-medium"
                >
                  {isHi ? "पोर्टल पर वापस लौटें" : "Return to Portal"}
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3.5">
                <div>
                  <span className="text-[#A7ADA8] text-[11px]">{isHi ? "चयनित अवसर:" : "Selected Opportunity:"}</span>
                  <p className="font-bold text-[#F2F4EF]">{selectedGrant.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "प्रमुख अन्वेषक" : "Principal Investigator"}</label>
                    <input
                      type="text"
                      required
                      value={applyForm.applicant_name}
                      onChange={(e) => setApplyForm({ ...applyForm, applicant_name: e.target.value })}
                      className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "मेजबान संस्थान" : "Host Institution"}</label>
                    <input
                      type="text"
                      required
                      value={applyForm.institution}
                      onChange={(e) => setApplyForm({ ...applyForm, institution: e.target.value })}
                      className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "अनुसंधान प्रस्ताव शीर्षक *" : "Research Proposal Title *"}</label>
                  <input
                    type="text"
                    required
                    value={applyForm.proposal_title}
                    onChange={(e) => setApplyForm({ ...applyForm, proposal_title: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                    placeholder="e.g. Econometric Impact of DILRMP RoR Computerization on Smallholder Credit"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "प्रस्ताव सार एवं कार्यप्रणाली *" : "Proposal Abstract & Methodology *"}</label>
                  <textarea
                    required
                    rows={4}
                    value={applyForm.abstract}
                    onChange={(e) => setApplyForm({ ...applyForm, abstract: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                    placeholder="Summarize research questions, required spatial datasets, and policy deliverables..."
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "अनुरोधित बजट परिव्यय" : "Budget Outlay Requested"}</label>
                  <input
                    type="text"
                    value={applyForm.budget_requested}
                    onChange={(e) => setApplyForm({ ...applyForm, budget_requested: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="btn-secondary-cta px-4 py-1.5 text-xs cursor-pointer"
                  >
                    {isHi ? "रद्द करें" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="btn-primary-cta px-5 py-1.5 text-xs cursor-pointer font-medium"
                  >
                    {isHi ? "आवेदन जमा करें" : "Submit Application"}
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
