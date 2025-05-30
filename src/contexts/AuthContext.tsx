
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  role: 'seeker' | 'host' | 'admin';
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: 'seeker' | 'host') => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SAMPLE_USERS = {
  'seeker@example.com': { password: 'seeker123', role: 'seeker' as const, name: 'John Seeker' },
  'host@example.com': { password: 'host123', role: 'host' as const, name: 'Sarah Host' },
  'admin@parkdriveway.com': { password: 'admin123', role: 'admin' as const, name: 'Park Admin' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('parkdriveway_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const userData = SAMPLE_USERS[email as keyof typeof SAMPLE_USERS];
    
    if (userData && userData.password === password) {
      const user = {
        email,
        role: userData.role,
        name: userData.name
      };
      setUser(user);
      localStorage.setItem('parkdriveway_user', JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('parkdriveway_user');
  };

  const switchRole = (role: 'seeker' | 'host') => {
    if (user && user.role !== 'admin') {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      localStorage.setItem('parkdriveway_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
