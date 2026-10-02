import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Search, 
  Building2, 
  Mail, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';

export const AdminUsers: React.FC = () => {
  const { user, isPlatformAdmin, isInstitutionAdmin } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, [user]);

  async function loadUsers() {
    setLoading(true);
    try {
      const data = await api.getUsers();
      setUsers(data || []);
    } catch (err: any) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStatus(userId: number) {
    if (!isPlatformAdmin) {
      alert('Only Platform Administrators can alter user account authorization status.');
      return;
    }
    try {
      const res = await api.toggleUserStatus(userId);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: res.is_active } : u));
      setActionSuccess(res.message);
      setTimeout(() => setActionSuccess(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Operation failed');
    }
  }

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.organization?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleBadges: Record<string, { label: string; color: string }> = {
    platform_admin: { label: 'Platform Admin', color: 'bg-purple-100 text-purple-800 border-purple-200' },
    policymaker: { label: 'MoRD Policymaker', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    institution_admin: { label: 'Institution Admin', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    researcher: { label: 'Researcher', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    public_user: { label: 'Public Citizen', color: 'bg-slate-100 text-slate-800 border-slate-200' },
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0a2540] text-white p-6 rounded-lg shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-amber-400" />
            <h2 className="text-xl font-bold">
              {isInstitutionAdmin ? `Institutional Directory — ${user?.organization}` : 'National User Directory & Role-Based Access Control'}
            </h2>
          </div>
          <p className="text-slate-300 text-xs mt-1 max-w-2xl leading-relaxed">
            {isInstitutionAdmin 
              ? 'Manage affiliated researchers, fellows, and faculty members belonging to your institution.'
              : 'Enforce enterprise security policies, manage RBAC role assignments, and review active user credentials across all 5 authorized stakeholder classes.'}
          </p>
        </div>
        <button 
          onClick={loadUsers}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded border border-slate-600 flex items-center space-x-1.5 cursor-pointer self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Directory</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-emerald-800 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, or institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0a2540]"
          />
        </div>

        {isPlatformAdmin && (
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-slate-600">Filter Role:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs border border-slate-300 rounded px-2.5 py-1.5 bg-slate-50 focus:outline-none"
            >
              <option value="all">All Roles ({users.length})</option>
              <option value="platform_admin">Platform Admin</option>
              <option value="policymaker">MoRD Policymaker</option>
              <option value="institution_admin">Institution Admin</option>
              <option value="researcher">Researcher</option>
              <option value="public_user">Public Citizen</option>
            </select>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center items-center">
            <div className="w-8 h-8 border-4 border-[#0a2540] border-t-amber-500 rounded-full animate-spin"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            No registered users found matching the query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Institution / Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                  {isPlatformAdmin && <th className="py-3 px-4 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => {
                  const roleStyle = roleBadges[u.role] || { label: u.role, color: 'bg-slate-100 text-slate-700' };
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-800">{u.full_name}</div>
                        <div className="text-[11px] text-slate-400 flex items-center space-x-1 mt-0.5">
                          <Mail className="w-3 h-3" />
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${roleStyle.color}`}>
                          {roleStyle.label}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-700 font-medium">{u.organization || 'General Public'}</div>
                        <div className="text-[10px] text-slate-400">{u.department || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.is_active ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                          {u.is_active ? 'ACTIVE' : 'DEACTIVATED'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {u.created_at}
                      </td>
                      {isPlatformAdmin && (
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            className={`px-2.5 py-1 rounded text-[11px] font-semibold transition cursor-pointer ${
                              u.is_active 
                                ? 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                            }`}
                          >
                            {u.is_active ? 'Deactivate' : 'Activate'}
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
