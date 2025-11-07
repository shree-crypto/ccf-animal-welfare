'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '@/lib/auth';
import { User, AuthContextType, UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        const role = await authService.getUserRole();
        setUser({ ...currentUser, role });
      }
    } catch (error) {
      console.error('Check user error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    await authService.login(email, password);
    await checkUser();
  }

  async function register(email: string, password: string, name: string) {
    await authService.register(email, password, name);
    await checkUser();
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  async function updateProfile(name: string) {
    await authService.updateProfile(name);
    await checkUser();
  }

  function checkRole(requiredRole: UserRole): boolean {
    if (!user || !user.role) return false;
    return authService.checkRole(user.role, requiredRole);
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
