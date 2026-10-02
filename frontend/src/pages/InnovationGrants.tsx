import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Calendar, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Send, 
  FileText, 
  Building2, 
  Users, 
  X,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { api } from '../services/api';
import { GrantOpportunity } from '../types';
import { useAuth } from '../context/AuthContext';

export const InnovationGrants: React.FC = () => {
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
      {/* Banner */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div>
          <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-600" />
            <span>National Innovation & Research Grants Portal</span>
          </h3>
          <p className="text-slate-500 mt-0.5">
            Funding opportunities for academia, startups, and policy scholars under MoRD & AICTE (SIH 2026)
          </p>
        </div>
        <span className="text-[11px] px-2.5 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
          Sample Opportunities Clearly Labelled
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grants Opportunities List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-slate-800">Open Competitions & Grants ({grants.length})</span>
            <span>All proposals scrutinized under GFR 2017 research grant rules</span>
          </div>

          <div className="space-y-3">
            {grants.map((g) => (
              <div
                key={g.id}
                className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition space-y-3 text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="px-2 py-0.5 rounded font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase text-[10px]">
                    {g.opportunity_type}
                  </span>
                  <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Deadline: <strong>{g.deadline}</strong></span>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-[#0a2540] leading-snug">
                    {g.title}
                  </h4>
                  <p className="text-slate-600 mt-1 leading-relaxed">
                    {g.description}
                  </p>
                </div>

                <div className="p-2.5 bg-slate-50 rounded border border-slate-200 space-y-1 text-[11px]">
                  <p><strong>Eligibility:</strong> {g.eligibility}</p>
                  <p><strong>Focus Areas:</strong> {g.focus_areas}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-500">Funding Outlay:</span>
                    <p className="text-sm font-bold text-emerald-700">{g.funding_amount}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedGrant(g);
                      setShowApplyModal(true);
                      setTrackingNumber(null);
                    }}
                    className="px-4 py-1.5 bg-[#0a2540] hover:bg-[#1e3a5f] text-white font-semibold rounded-md transition text-xs flex items-center space-x-1"
                  >
                    <span>Apply for Grant</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Applications Tracker Sidebar */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-[#0a2540] flex items-center space-x-1.5 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>My Submitted Applications ({myApplications.length})</span>
            </h4>

            {myApplications.length === 0 ? (
              <div className="p-6 text-center text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p>No active grant proposals submitted yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {myApplications.map((app) => (
                  <div key={app.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 text-[11px]">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 truncate max-w-[150px]">{app.proposal_title}</span>
                      <span className="px-1.5 py-0.2 rounded font-extrabold uppercase bg-emerald-100 text-emerald-800 text-[9px]">
                        {app.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[10px]">{app.grant_title}</p>
                    <div className="flex justify-between pt-1 text-[10px] text-slate-400 border-t border-slate-200/60">
                      <span>Budget: {app.budget_requested}</span>
                      <span>{new Date(app.submission_date).toLocaleDateString()}</span>
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-sm text-[#0a2540]">Grant Proposal Submission</h3>
              <button onClick={() => setShowApplyModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>

            {trackingNumber ? (
              <div className="p-6 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800">Proposal Registered Successfully!</h4>
                <div className="p-3 bg-slate-100 rounded font-mono text-xs font-bold text-[#0a2540]">
                  Tracking ID: {trackingNumber}
                </div>
                <p className="text-slate-500 text-[11px]">
                  Your application for "{selectedGrant.title}" is now queued for MoRD Technical Scrutiny.
                </p>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 bg-[#0a2540] text-white rounded font-semibold text-xs"
                >
                  Return to Portal
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3">
                <div>
                  <span className="text-slate-500 text-[11px]">Selected Opportunity:</span>
                  <p className="font-bold text-slate-900">{selectedGrant.title}</p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Principal Investigator</label>
                    <input
                      type="text"
                      required
                      value={applyForm.applicant_name}
                      onChange={(e) => setApplyForm({ ...applyForm, applicant_name: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Host Institution</label>
                    <input
                      type="text"
                      required
                      value={applyForm.institution}
                      onChange={(e) => setApplyForm({ ...applyForm, institution: e.target.value })}
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Research Proposal Title *</label>
                  <input
                    type="text"
                    required
                    value={applyForm.proposal_title}
                    onChange={(e) => setApplyForm({ ...applyForm, proposal_title: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    placeholder="e.g. Econometric Impact of DILRMP RoR Computerization on Smallholder Credit"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Proposal Abstract & Methodology *</label>
                  <textarea
                    required
                    rows={4}
                    value={applyForm.abstract}
                    onChange={(e) => setApplyForm({ ...applyForm, abstract: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                    placeholder="Summarize research questions, required spatial datasets, and policy deliverables..."
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Budget Outlay Requested</label>
                  <input
                    type="text"
                    value={applyForm.budget_requested}
                    onChange={(e) => setApplyForm({ ...applyForm, budget_requested: e.target.value })}
                    className="w-full px-2.5 py-1.5 border border-slate-300 rounded"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowApplyModal(false)}
                    className="px-3 py-1.5 border border-slate-300 rounded text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#0a2540] text-white font-semibold rounded hover:bg-[#1e3a5f]"
                  >
                    Submit Application
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
