import React, { useState, useEffect } from 'react';
import { 
  Users2, 
  FolderPlus, 
  CheckSquare, 
  Square, 
  MessageSquare, 
  Milestone, 
  Plus, 
  Send,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchProject, ProjectTask } from '../types';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';
import { Card3D } from '../components/ui/Card3D';

export const CollaborativeWorkspace: React.FC = () => {
  const { t, language } = useTranslation();
  const isHi = language === 'hi';
  const { user } = useAuth();
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projectDetail, setProjectDetail] = useState<ResearchProject | null>(null);
  const [loading, setLoading] = useState(true);

  // New Project Modal
  const [showNewProjModal, setShowNewProjModal] = useState(false);
  const [newProjForm, setNewProjForm] = useState({
    title: '',
    summary: '',
    domain: 'land_records',
    institution: user?.organization || 'National Institute of Rural Development',
    budget_inr: 2500000,
    target_state: 'Pan-India'
  });

  // New Task Modal
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    description: '',
    assigned_to: 'Principal Investigator',
    priority: 'medium',
    due_date: '2026-08-30'
  });

  // Comment input
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadProjectDetail(selectedProjectId);
    }
  }, [selectedProjectId]);

  async function loadProjects() {
    setLoading(true);
    try {
      const data = await api.getProjects();
      setProjects(data || []);
      if (data && data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(data[0].id);
      }
    } catch (err) {
      console.error('Failed to load projects:', err);
    } finally {
      setLoading(false);
    }
  }

  async function loadProjectDetail(id: number) {
    try {
      const detail = await api.getProjectDetail(id);
      setProjectDetail(detail);
    } catch (err) {
      console.error('Failed to load project details:', err);
    }
  }

  async function handleToggleTask(taskId: number) {
    if (!selectedProjectId) return;
    try {
      await api.toggleTask(selectedProjectId, taskId);
      loadProjectDetail(selectedProjectId);
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  }

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.createProject(newProjForm);
      setShowNewProjModal(false);
      await loadProjects();
      setSelectedProjectId(res.id);
    } catch (err) {
      alert('Failed to create project.');
    }
  }

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProjectId) return;
    try {
      await api.addTask(selectedProjectId, newTaskForm);
      setShowNewTaskModal(false);
      setNewTaskForm({
        title: '',
        description: '',
        assigned_to: 'Team Member',
        priority: 'medium',
        due_date: '2026-08-30'
      });
      loadProjectDetail(selectedProjectId);
    } catch (err) {
      alert('Failed to add task.');
    }
  }

  async function handlePostComment(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProjectId || !commentText.trim()) return;
    try {
      await api.addComment(selectedProjectId, commentText.trim());
      setCommentText('');
      loadProjectDetail(selectedProjectId);
    } catch (err) {
      alert('Failed to post comment.');
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 liquid-glass p-5 rounded-2xl border border-white/10 shadow-sm">
        <div>
          <h3 className="text-sm font-bold text-[#F2F4EF] flex items-center space-x-2">
            <Users2 className="w-5 h-5 text-[#B7E300]" />
            <span>{t('workspace.title', isHi ? 'सहयोगी अनुसंधान कार्यक्षेत्र' : 'Collaborative Research Workspace')}</span>
          </h3>
          <p className="text-xs text-[#A7ADA8] mt-1">
            {t('workspace.subtitle', isHi ? 'संस्थानों में संयुक्त अध्ययन, माइलस्टोन और कार्य प्रबंधन' : 'Multi-institutional research tasks, milestones, and peer discussions')}
          </p>
        </div>
        <button
          onClick={() => setShowNewProjModal(true)}
          className="btn-primary-cta px-4 py-2 text-xs flex items-center space-x-2 self-start sm:self-auto cursor-pointer font-medium"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>{t('workspace.new_project', isHi ? 'नया अनुसंधान प्रोजेक्ट' : 'New Project')}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <div className="liquid-glass p-4 rounded-2xl border border-white/10 shadow-sm">
            <span className="text-xs font-bold text-[#F2F4EF] uppercase tracking-wider block mb-3 font-mono">
              {t('workspace.active_projects', isHi ? 'सक्रिय अनुसंधान परियोजनाएं' : 'Active Research Projects')} ({projects.length})
            </span>
            <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
              {projects.map((p) => {
                const isSelected = p.id === selectedProjectId;
                return (
                  <Card3D
                    key={p.id}
                    maxTilt={4}
                    onClick={() => setSelectedProjectId(p.id)}
                    className={`p-4 rounded-xl border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'bg-[#151919] border-[#B7E300]/50 shadow-md ring-1 ring-[#B7E300]/30'
                        : 'liquid-glass-card border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-semibold text-[#A7ADA8] text-[10px] uppercase font-mono">
                        {p.domain.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#B7E300]/10 text-[#B7E300] font-bold capitalize border border-[#B7E300]/30">
                        {p.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-[#F2F4EF] line-clamp-2 leading-snug">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-[#A7ADA8] mt-1.5 line-clamp-2 leading-relaxed">
                      {p.summary}
                    </p>
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-[#A7ADA8]">
                      <span>Tasks: <strong className="text-[#F2F4EF]">{p.completed_tasks || 0}/{p.tasks_count || 0}</strong></span>
                      <span className="text-[#78C8C8] font-semibold font-mono">{p.target_state}</span>
                    </div>
                  </Card3D>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Project Deep Dive */}
        <div className="lg:col-span-2 space-y-4">
          {projectDetail ? (
            <div className="liquid-glass p-6 rounded-2xl border border-white/10 shadow-sm space-y-5 text-xs bg-[#101313]/70">
              {/* Project Header */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-[#A7ADA8] mb-1.5">
                  <span>Institution: <strong className="text-[#B7E300]">{projectDetail.institution}</strong></span>
                  <span>Lead: <strong className="text-[#F2F4EF]">{projectDetail.lead_researcher_name}</strong></span>
                </div>
                <h3 className="text-base font-bold text-[#F2F4EF] leading-snug">
                  {projectDetail.title}
                </h3>
                <p className="text-[#A7ADA8] mt-2 leading-relaxed">
                  {projectDetail.summary}
                </p>
              </div>

              {/* Research Objectives */}
              <div className="p-4 bg-white/[0.03] rounded-xl border border-white/10 space-y-2">
                <span className="font-bold text-[#F2F4EF] text-xs">{isHi ? "अनुसंधान उद्देश्य:" : "Research Objectives:"}</span>
                <div className="space-y-2">
                  {projectDetail.objectives?.map((obj) => (
                    <div key={obj.id} className="flex items-start space-x-2 text-[11px] text-[#F2F4EF]">
                      <CheckSquare className="w-4 h-4 text-[#B7E300] shrink-0 mt-0.5" />
                      <span>{obj.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Board */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#F2F4EF] text-xs flex items-center space-x-2">
                    <CheckSquare className="w-4 h-4 text-[#B7E300]" />
                    <span>{isHi ? "परियोजना कार्य" : "Project Tasks"} ({projectDetail.tasks?.length || 0})</span>
                  </span>
                  <button
                    onClick={() => setShowNewTaskModal(true)}
                    className="btn-secondary-cta px-3 py-1 text-[11px] flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isHi ? "कार्य जोड़ें" : "Add Task"}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {projectDetail.tasks?.map((t) => {
                    const isDone = t.status === 'completed';
                    return (
                      <div
                        key={t.id}
                        onClick={() => handleToggleTask(t.id)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                          isDone 
                            ? 'bg-white/[0.02] border-white/5 text-[#6F7772]' 
                            : 'liquid-glass-card border-white/10 text-[#F2F4EF] hover:border-[#B7E300]/40'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-[#B7E300] shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-[#A7ADA8] shrink-0" />
                          )}
                          <span className={isDone ? 'line-through text-[#6F7772] font-medium' : 'font-semibold text-[#F2F4EF]'}>
                            {t.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px]">
                          <span className="bg-white/5 text-[#F2F4EF] px-2.5 py-0.5 rounded-full font-medium border border-white/10 font-mono">
                            {t.assigned_to}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full uppercase font-bold text-[9px] ${
                            t.priority === 'high' ? 'bg-[#C56A9A]/15 text-[#C56A9A] border border-[#C56A9A]/30' : 'bg-[#B7E300]/10 text-[#B7E300] border border-[#B7E300]/30'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Milestones Tracker */}
              <div className="space-y-2.5">
                <span className="font-bold text-[#F2F4EF] text-xs flex items-center space-x-2">
                  <Milestone className="w-4 h-4 text-[#78C8C8]" />
                  <span>{isHi ? "परियोजना मील के पत्थर" : "Project Milestones"}</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {projectDetail.milestones?.map((m) => (
                    <div
                      key={m.id}
                      className={`p-3 rounded-xl border text-[11px] ${
                        m.is_achieved 
                          ? 'bg-[#B7E300]/10 border-[#B7E300]/30 text-[#F2F4EF]' 
                          : 'bg-white/[0.03] border-white/10 text-[#F2F4EF]'
                      }`}
                    >
                      <p className="font-bold leading-tight text-[#F2F4EF]">{m.title}</p>
                      <p className="text-[10px] mt-1.5 text-[#A7ADA8]">Due: {m.due_date || 'TBD'}</p>
                      <span className={`inline-block mt-2 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        m.is_achieved ? 'bg-[#B7E300]/20 text-[#B7E300] border border-[#B7E300]/40' : 'bg-white/5 text-[#A7ADA8]'
                      }`}>
                        {m.is_achieved ? (isHi ? 'पूर्ण' : 'Delivered') : (isHi ? 'लंबित' : 'Pending')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discussion & Comments */}
              <div className="space-y-3 pt-3 border-t border-white/10">
                <span className="font-bold text-[#F2F4EF] text-xs flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-[#B7E300]" />
                  <span>{isHi ? "शोधकर्ता चर्चाएं" : "Researcher Discussions"} ({projectDetail.comments?.length || 0})</span>
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {projectDetail.comments?.map((c) => (
                    <div key={c.id} className="p-3 bg-white/[0.03] rounded-xl border border-white/10">
                      <div className="flex items-center justify-between text-[10px] text-[#A7ADA8] mb-1">
                        <span className="font-bold text-[#B7E300]">{c.user_name}</span>
                        <span className="text-[#6F7772]">{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[#F2F4EF] text-xs leading-relaxed">{c.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add comment form */}
                <form onSubmit={handlePostComment} className="flex items-center space-x-2 pt-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder={isHi ? "एक शोध अवलोकन या समीक्षा टिप्पणी लिखें..." : "Contribute a research observation or review remark..."}
                    className="flex-1 px-4 py-2 bg-white/[0.04] rounded-full text-xs text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="btn-primary-cta px-5 py-2 disabled:opacity-40 text-xs cursor-pointer font-medium"
                  >
                    {isHi ? "टिप्पणी भेजें" : "Post"}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-16 text-center text-[#A7ADA8] liquid-glass rounded-2xl border border-white/10">
              {isHi ? "उद्देश्यों और कार्यों के निरीक्षण हेतु एक शोध परियोजना चुनें।" : "Select a research project to inspect objectives and tasks."}
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjModal && (
        <div className="fixed inset-0 z-50 bg-[#080A0A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="liquid-glass-elevated bg-[#101313]/95 text-[#F2F4EF] rounded-2xl shadow-xl max-w-lg w-full p-6 text-xs space-y-4 border border-white/15">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-[#F2F4EF]">{isHi ? "नया अनुसंधान प्रोजेक्ट बनाएं" : "Create New Research Project"}</h3>
              <button onClick={() => setShowNewProjModal(false)}><X className="w-5 h-5 text-[#A7ADA8] hover:text-[#F2F4EF] cursor-pointer" /></button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-3.5">
              <div>
                <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "प्रोजेक्ट शीर्षक *" : "Project Title *"}</label>
                <input
                  type="text"
                  required
                  value={newProjForm.title}
                  onChange={(e) => setNewProjForm({ ...newProjForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                  placeholder="e.g. AI-Assisted Boundary Polygonization for Bhu-naksha"
                />
              </div>
              <div>
                <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "कार्यकारी सारांश *" : "Executive Summary *"}</label>
                <textarea
                  required
                  rows={3}
                  value={newProjForm.summary}
                  onChange={(e) => setNewProjForm({ ...newProjForm, summary: e.target.value })}
                  className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                  placeholder="Outline the problem statement, data sources, and analytical scope..."
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "अनुसंधान डोमेन" : "Research Domain"}</label>
                  <select
                    value={newProjForm.domain}
                    onChange={(e) => setNewProjForm({ ...newProjForm, domain: e.target.value })}
                    className="w-full px-3 py-2 bg-[#151919] border border-white/10 rounded-xl text-[#F2F4EF] focus:outline-none focus:border-[#B7E300]/50"
                  >
                    <option value="land_records">{isHi ? "भू-अभिलेख और कैडस्ट्रे" : "Land Records & Cadastre"}</option>
                    <option value="watershed_management">{isHi ? "जलसंभर प्रबंधन" : "Watershed Management"}</option>
                    <option value="land_acquisition">{isHi ? "भूमि अधिग्रहण" : "Land Acquisition"}</option>
                    <option value="urban_expansion">{isHi ? "शहरी विस्तार" : "Urban Expansion"}</option>
                    <option value="dispute_resolution">{isHi ? "विवाद निवारण" : "Dispute Resolution"}</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "लक्षित राज्य / दायरा" : "Target State / Scope"}</label>
                  <input
                    type="text"
                    value={newProjForm.target_state}
                    onChange={(e) => setNewProjForm({ ...newProjForm, target_state: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewProjModal(false)}
                  className="btn-secondary-cta px-4 py-1.5 text-xs cursor-pointer"
                >
                  {isHi ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="btn-primary-cta px-5 py-1.5 text-xs cursor-pointer font-medium"
                >
                  {isHi ? "कार्यक्षेत्र प्रारंभ करें" : "Initialize Workspace"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-[#080A0A]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="liquid-glass-elevated bg-[#101313]/95 text-[#F2F4EF] rounded-2xl shadow-xl max-w-md w-full p-5 text-xs space-y-3.5 border border-white/15">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <h3 className="font-bold text-sm text-[#F2F4EF]">{isHi ? "परियोजना कार्य जोड़ें" : "Add Project Task"}</h3>
              <button onClick={() => setShowNewTaskModal(false)}><X className="w-5 h-5 text-[#A7ADA8] hover:text-[#F2F4EF] cursor-pointer" /></button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "कार्य शीर्षक *" : "Task Title *"}</label>
                <input
                  type="text"
                  required
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                  placeholder="e.g. Georeference 50 cadastral sheets for Varanasi"
                />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "आवंटित व्यक्ति" : "Assigned Person"}</label>
                  <input
                    type="text"
                    value={newTaskForm.assigned_to}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, assigned_to: e.target.value })}
                    className="w-full px-3 py-2 bg-white/[0.04] rounded-xl text-[#F2F4EF] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#A7ADA8] block mb-1">{isHi ? "प्राथमिकता" : "Priority"}</label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 bg-[#151919] border border-white/10 rounded-xl text-[#F2F4EF] focus:outline-none focus:border-[#B7E300]/50"
                  >
                    <option value="low">{isHi ? "निम्न" : "Low"}</option>
                    <option value="medium">{isHi ? "मध्यम" : "Medium"}</option>
                    <option value="high">{isHi ? "उच्च" : "High"}</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="btn-secondary-cta px-4 py-1.5 text-xs cursor-pointer"
                >
                  {isHi ? "रद्द करें" : "Cancel"}
                </button>
                <button
                  type="submit"
                  className="btn-primary-cta px-5 py-1.5 text-xs cursor-pointer font-medium"
                >
                  {isHi ? "कार्य बनाएं" : "Create Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
