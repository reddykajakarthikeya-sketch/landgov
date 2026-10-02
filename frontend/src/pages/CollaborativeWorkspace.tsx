import React, { useState, useEffect } from 'react';
import { 
  Users2, 
  FolderPlus, 
  CheckSquare, 
  Square, 
  Clock, 
  MessageSquare, 
  Milestone, 
  Plus, 
  Building2, 
  AlertCircle, 
  Send,
  X,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { ResearchProject, ProjectTask } from '../types';
import { useAuth } from '../context/AuthContext';

export const CollaborativeWorkspace: React.FC = () => {
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-[#0a2540] flex items-center space-x-2">
            <Users2 className="w-4 h-4 text-blue-600" />
            <span>Collaborative Land Research & Policy Workspaces</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Database-backed project management for research consortia, universities, and DoLR cells
          </p>
        </div>
        <button
          onClick={() => setShowNewProjModal(true)}
          className="px-3.5 py-1.5 bg-[#0a2540] hover:bg-[#1e3a5f] text-white font-semibold rounded-md transition text-xs flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Research Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Active Projects ({projects.length})
            </span>
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {projects.map((p) => {
                const isSelected = p.id === selectedProjectId;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedProjectId(p.id)}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition ${
                      isSelected
                        ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                        : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-slate-500 text-[10px] uppercase">
                        {p.domain.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold capitalize">
                        {p.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 line-clamp-2 leading-snug">
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {p.summary}
                    </p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                      <span>Tasks: <strong>{p.completed_tasks || 0}/{p.tasks_count || 0}</strong></span>
                      <span>Target: {p.target_state}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Project Deep Dive */}
        <div className="lg:col-span-2 space-y-4">
          {projectDetail ? (
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-5 text-xs">
              {/* Project Header */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                  <span>Institution: <strong>{projectDetail.institution}</strong></span>
                  <span>Lead: <strong>{projectDetail.lead_researcher_name}</strong></span>
                </div>
                <h3 className="text-base font-bold text-[#0a2540] leading-snug">
                  {projectDetail.title}
                </h3>
                <p className="text-slate-600 mt-1.5 leading-relaxed">
                  {projectDetail.summary}
                </p>
              </div>

              {/* Research Objectives */}
              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                <span className="font-bold text-slate-800 text-xs">Research Objectives:</span>
                <div className="space-y-1.5">
                  {projectDetail.objectives?.map((obj) => (
                    <div key={obj.id} className="flex items-start space-x-2 text-[11px] text-slate-700">
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{obj.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Task Board */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                    <span>Project Tasks ({projectDetail.tasks?.length || 0})</span>
                  </span>
                  <button
                    onClick={() => setShowNewTaskModal(true)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] transition flex items-center space-x-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Task</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  {projectDetail.tasks?.map((t) => {
                    const isDone = t.status === 'completed';
                    return (
                      <div
                        key={t.id}
                        onClick={() => handleToggleTask(t.id)}
                        className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition ${
                          isDone ? 'bg-slate-50 border-slate-200 text-slate-400' : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5">
                          {isDone ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-400 shrink-0" />
                          )}
                          <span className={isDone ? 'line-through text-slate-500 font-medium' : 'font-semibold'}>
                            {t.title}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[10px]">
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium">
                            {t.assigned_to}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded uppercase font-bold text-[9px] ${
                            t.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
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
              <div className="space-y-2">
                <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                  <Milestone className="w-4 h-4 text-amber-600" />
                  <span>Project Milestones</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {projectDetail.milestones?.map((m) => (
                    <div
                      key={m.id}
                      className={`p-2.5 rounded-lg border text-[11px] ${
                        m.is_achieved ? 'bg-emerald-50/60 border-emerald-300 text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}
                    >
                      <p className="font-bold leading-tight">{m.title}</p>
                      <p className="text-[10px] mt-1 text-slate-500">Due: {m.due_date || 'TBD'}</p>
                      <span className={`inline-block mt-1 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                        m.is_achieved ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {m.is_achieved ? 'Delivered' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Discussion & Comments */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <span className="font-bold text-slate-800 text-xs flex items-center space-x-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  <span>Researcher Discussions ({projectDetail.comments?.length || 0})</span>
                </span>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {projectDetail.comments?.map((c) => (
                    <div key={c.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-slate-700">{c.user_name}</span>
                        <span>{new Date(c.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed">{c.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add comment form */}
                <form onSubmit={handlePostComment} className="flex items-center space-x-2 pt-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Contribute a research observation or review remark..."
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded text-xs focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0a2540]"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim()}
                    className="px-3 py-2 bg-[#0a2540] hover:bg-[#1e3a5f] disabled:opacity-40 text-white font-semibold rounded text-xs transition"
                  >
                    Post
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 bg-white rounded-lg border border-slate-200">
              Select a research project to inspect objectives and tasks.
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProjModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 text-xs space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-sm text-[#0a2540]">Create New Research Project</h3>
              <button onClick={() => setShowNewProjModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newProjForm.title}
                  onChange={(e) => setNewProjForm({ ...newProjForm, title: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  placeholder="e.g. AI-Assisted Boundary Polygonization for Bhu-naksha"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Executive Summary *</label>
                <textarea
                  required
                  rows={3}
                  value={newProjForm.summary}
                  onChange={(e) => setNewProjForm({ ...newProjForm, summary: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  placeholder="Outline the problem statement, data sources, and analytical scope..."
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Research Domain</label>
                  <select
                    value={newProjForm.domain}
                    onChange={(e) => setNewProjForm({ ...newProjForm, domain: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="land_records">Land Records & Cadastre</option>
                    <option value="watershed_management">Watershed Management</option>
                    <option value="land_acquisition">Land Acquisition</option>
                    <option value="urban_expansion">Urban Expansion</option>
                    <option value="dispute_resolution">Dispute Resolution</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target State / Scope</label>
                  <input
                    type="text"
                    value={newProjForm.target_state}
                    onChange={(e) => setNewProjForm({ ...newProjForm, target_state: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewProjModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0a2540] text-white font-semibold rounded hover:bg-[#1e3a5f]"
                >
                  Initialize Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 text-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-200">
              <h3 className="font-bold text-sm text-[#0a2540]">Add Project Task</h3>
              <button onClick={() => setShowNewTaskModal(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <form onSubmit={handleAddTask} className="space-y-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTaskForm.title}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  placeholder="e.g. Georeference 50 cadastral sheets for Varanasi"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Assigned Person</label>
                  <input
                    type="text"
                    value={newTaskForm.assigned_to}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, assigned_to: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newTaskForm.priority}
                    onChange={(e) => setNewTaskForm({ ...newTaskForm, priority: e.target.value })}
                    className="w-full px-2 py-1.5 border border-slate-300 rounded"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0a2540] text-white font-semibold rounded hover:bg-[#1e3a5f]"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
