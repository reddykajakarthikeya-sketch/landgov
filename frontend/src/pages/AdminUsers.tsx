import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Mail, 
  CheckCircle2, 
  RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from '../i18n';

export const AdminUsers: React.FC = () => {
  const { t, language } = useTranslation();
  const isHi = language === 'hi';
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
    platform_admin: { label: isHi ? 'प्लेटफ़ॉर्म व्यवस्थापक' : 'Platform Admin', color: 'bg-white/10 text-[#F2F4EF] border-white/20' },
    policymaker: { label: isHi ? 'नीति निर्माता (MoRD)' : 'MoRD Policymaker', color: 'bg-[#B7E300]/10 text-[#B7E300] border-[#B7E300]/30' },
    institution_admin: { label: isHi ? 'संस्थान प्रशासक' : 'Institution Admin', color: 'bg-[#78C8C8]/10 text-[#78C8C8] border-[#78C8C8]/30' },
    researcher: { label: isHi ? 'शोधकर्ता' : 'Researcher', color: 'bg-[#C7CBC7]/15 text-[#F2F4EF] border-white/20' },
    public_user: { label: isHi ? 'नागरिक / सार्वजनिक' : 'Public Citizen', color: 'bg-white/5 text-[#A7ADA8] border-white/10' },
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="liquid-glass p-6 rounded-2xl border border-white/10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#101313]/70">
        <div>
          <div className="flex items-center space-x-3">
            <span className="p-2.5 bg-white/5 text-[#B7E300] rounded-xl border border-white/10">
              <Users className="w-6 h-6 text-[#B7E300]" />
            </span>
            <h2 className="text-xl font-bold text-[#F2F4EF]">
              {isInstitutionAdmin 
                ? (isHi ? `संस्थागत निर्देशिका — ${user?.organization}` : `Institutional Directory — ${user?.organization}`)
                : (isHi ? 'राष्ट्रीय उपयोगकर्ता निर्देशिका एवं आरबीएसी नियंत्रण' : 'National User Directory & Role-Based Access Control')}
            </h2>
          </div>
          <p className="text-[#A7ADA8] text-xs mt-2 max-w-2xl leading-relaxed">
            {isInstitutionAdmin 
              ? 'Manage affiliated researchers, fellows, and faculty members belonging to your institution.'
              : 'Enforce enterprise security policies, manage RBAC role assignments, and review active user credentials across all 5 authorized stakeholder classes.'}
          </p>
        </div>
        <button 
          onClick={loadUsers}
          className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-xs text-[#F2F4EF] rounded-xl border border-white/10 flex items-center space-x-2 cursor-pointer self-start md:self-auto transition shadow-xs font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{isHi ? "निर्देशिका ताज़ा करें" : "Refresh Directory"}</span>
        </button>
      </div>

      {actionSuccess && (
        <div className="p-4 bg-[#B7E300]/10 border border-[#B7E300]/30 rounded-2xl text-[#B7E300] text-xs flex items-center space-x-2 shadow-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#B7E300] shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Filters & Search */}
      <div className="liquid-glass p-4 rounded-2xl border border-white/10 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between bg-[#101313]/70">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-2.5 text-[#A7ADA8]" />
          <input
            type="text"
            placeholder={isHi ? "नाम, ईमेल या संस्था द्वारा खोजें..." : "Search by name, email, or institution..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs bg-white/[0.04] rounded-xl text-[#F2F4EF] placeholder-[#A7ADA8] border border-white/10 focus:outline-none focus:border-[#B7E300]/50"
          />
        </div>

        {isPlatformAdmin && (
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs font-semibold text-[#A7ADA8]">{isHi ? "भूमिका फ़िल्टर:" : "Filter Role:"}</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs border border-white/10 rounded-xl px-3 py-2 bg-[#151919] text-[#F2F4EF] focus:outline-none focus:border-[#B7E300]/50"
            >
              <option value="all">{isHi ? "सभी भूमिकाएँ" : "All Roles"} ({users.length})</option>
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
      <div className="liquid-glass rounded-2xl border border-white/10 shadow-sm overflow-hidden bg-[#101313]/70">
        {loading ? (
          <div className="p-16 flex justify-center items-center">
            <div className="w-10 h-10 border-4 border-white/10 border-t-[#B7E300] rounded-full animate-spin"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-[#A7ADA8] text-xs">
            {isHi ? "कोई पंजीकृत उपयोगकर्ता नहीं मिला।" : "No registered users found matching the query."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] text-[#F2F4EF] font-semibold border-b border-white/10 uppercase text-[10px] tracking-wider font-mono">
                <tr>
                  <th className="py-3.5 px-4">{isHi ? "उपयोगकर्ता विवरण" : "User Details"}</th>
                  <th className="py-3.5 px-4">{isHi ? "भूमिका" : "Role"}</th>
                  <th className="py-3.5 px-4">{isHi ? "संस्थान / विभाग" : "Institution / Department"}</th>
                  <th className="py-3.5 px-4">{isHi ? "स्थिति" : "Status"}</th>
                  <th className="py-3.5 px-4">{isHi ? "पंजीकरण तिथि" : "Registered Date"}</th>
                  {isPlatformAdmin && <th className="py-3.5 px-4 text-right">{isHi ? "कार्रवाई" : "Actions"}</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-[#A7ADA8]">
                {filteredUsers.map((u) => {
                  const roleStyle = roleBadges[u.role] || { label: u.role, color: 'bg-white/5 text-[#A7ADA8] border-white/10' };
                  return (
                    <tr key={u.id} className="hover:bg-white/[0.03] transition">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#F2F4EF]">{u.full_name}</div>
                        <div className="text-[11px] text-[#A7ADA8] flex items-center space-x-1.5 mt-0.5">
                          <Mail className="w-3 h-3 text-[#78C8C8]" />
                          <span>{u.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${roleStyle.color}`}>
                          {roleStyle.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-[#F2F4EF] font-medium">{u.organization || 'General Public'}</div>
                        <div className="text-[10px] text-[#A7ADA8]">{u.department || 'N/A'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${u.is_active ? 'bg-[#B7E300]/10 text-[#B7E300] border border-[#B7E300]/30' : 'bg-[#C56A9A]/15 text-[#C56A9A] border border-[#C56A9A]/30'}`}>
                          {u.is_active ? (isHi ? 'सक्रिय' : 'ACTIVE') : (isHi ? 'निष्क्रिय' : 'DEACTIVATED')}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#A7ADA8]">
                        {u.created_at}
                      </td>
                      {isPlatformAdmin && (
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleToggleStatus(u.id)}
                            className={`px-3.5 py-1 rounded-full text-[10px] font-semibold transition cursor-pointer border shadow-xs ${
                              u.is_active 
                                ? 'bg-[#C56A9A]/15 text-[#C56A9A] hover:bg-[#C56A9A]/25 border-[#C56A9A]/40'
                                : 'bg-[#B7E300]/10 text-[#B7E300] hover:bg-[#B7E300]/20 border-[#B7E300]/30'
                            }`}
                          >
                            {u.is_active ? (isHi ? 'निष्क्रिय करें' : 'Deactivate') : (isHi ? 'सक्रिय करें' : 'Activate')}
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
