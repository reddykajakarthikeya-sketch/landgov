import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => Promise<void>;
  isPublicUser: boolean;
  isResearcher: boolean;
  isPolicymaker: boolean;
  isInstitutionAdmin: boolean;
  isPlatformAdmin: boolean;
  canAccessModule: (moduleTab: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Quick test credentials for each of the 5 roles
export const DEMO_USERS: Record<UserRole, { email: string; name: string; org: string; dept: string }> = {
  platform_admin: {
    email: 'admin@dolr.gov.in',
    name: 'Dr. Rajeshwar Sharma',
    org: 'Department of Land Resources (DoLR), MoRD',
    dept: 'National Land Records Modernization Division'
  },
  policymaker: {
    email: 'policymaker@mord.gov.in',
    name: 'Smt. Sunita Verma, IAS',
    org: 'Ministry of Rural Development, GoI',
    dept: 'Policy, Monitoring & Evaluation Division'
  },
  institution_admin: {
    email: 'institution@nirdpr.ac.in',
    name: 'Prof. Anand K. Murthy',
    org: 'National Institute of Rural Development & PR',
    dept: 'Centre for Natural Resource Management'
  },
  researcher: {
    email: 'researcher@iitd.ac.in',
    name: 'Dr. Priyanka Sengupta',
    org: 'Indian Institute of Technology Delhi',
    dept: 'School of Public Policy & Geospatial Sciences'
  },
  public_user: {
    email: 'citizen@public.org',
    name: 'Vikramaditya Deshmukh',
    org: 'Land Rights & Farmers Collective',
    dept: 'Civil Society Outreach'
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const profile = await api.getMe();
          if (profile) {
            setUser(profile);
          } else {
            // Default to researcher demo if token expired
            await switchRole('researcher');
          }
        } catch {
          await switchRole('researcher');
        }
      } else {
        // Automatically start logged in as Researcher for instant hackathon evaluation
        await switchRole('researcher');
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email: string, password: string = 'Admin@1234') => {
    setIsLoading(true);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setUser({
        id: 1,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        organization: data.organization,
        department: 'Land Governance & Policy Cell'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await api.register(data);
      localStorage.setItem('token', res.access_token);
      setToken(res.access_token);
      setUser({
        id: 1,
        email: res.email,
        full_name: res.full_name,
        role: res.role,
        organization: res.organization,
        department: 'Land Governance'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const switchRole = async (targetRole: UserRole) => {
    setIsLoading(true);
    const demo = DEMO_USERS[targetRole];
    try {
      const data = await api.login(demo.email, 'Admin@1234');
      localStorage.setItem('token', data.access_token);
      setToken(data.access_token);
      setUser({
        id: targetRole === 'platform_admin' ? 1 : 2,
        email: data.email,
        full_name: data.full_name,
        role: data.role,
        organization: data.organization,
        department: demo.dept
      });
    } catch {
      // Local fallback in case backend is offline
      setUser({
        id: 1,
        email: demo.email,
        full_name: demo.name,
        role: targetRole,
        organization: demo.org,
        department: demo.dept
      });
    } finally {
      setIsLoading(false);
    }
  };

  const role = user?.role || 'public_user';
  const isPublicUser = role === 'public_user';
  const isResearcher = role === 'researcher';
  const isPolicymaker = role === 'policymaker';
  const isInstitutionAdmin = role === 'institution_admin';
  const isPlatformAdmin = role === 'platform_admin';

  const canAccessModule = (tab: string): boolean => {
    if (isPlatformAdmin) return true;
    if (isPolicymaker) {
      return !['admin-audit'].includes(tab);
    }
    if (isInstitutionAdmin) {
      return ['dashboard', 'repository', 'ai-assistant', 'gis-explorer', 'analytics', 'simulation', 'projects', 'grants', 'scope-of-study', 'tech-stack', 'admin-users'].includes(tab);
    }
    if (isResearcher) {
      return ['dashboard', 'repository', 'ai-assistant', 'gis-explorer', 'analytics', 'simulation', 'projects', 'grants', 'scope-of-study', 'tech-stack'].includes(tab);
    }
    // public_user
    return ['dashboard', 'repository', 'ai-assistant', 'gis-explorer', 'scope-of-study', 'tech-stack'].includes(tab);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        switchRole,
        isPublicUser,
        isResearcher,
        isPolicymaker,
        isInstitutionAdmin,
        isPlatformAdmin,
        canAccessModule
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
