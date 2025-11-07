'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { authService } from '@/lib/auth';
import { User, AuthContextType, UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkUser = useCallback(async () => {
    try {
      console.log('🔍 Checking user...');
      const currentUser = await authService.getCurrentUser();
      console.log('👤 Current user:', currentUser?.email || 'none');
      
      if (currentUser) {
        const role = await authService.getUserRole();
        console.log('🎭 User role:', role);
        setUser({ ...currentUser, role });
        console.log('✅ User set in context:', currentUser.email, role);
      } else {
        console.log('❌ No user found');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Check user error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  const login = useCallback(async (email: string, password: string) => {
    console.log('🔐 Attempting login for:', email);
    await authService.login(email, password);
    console.log('✅ Login successful, checking user...');
    await checkUser();
  }, [checkUser]);

  const register = useCallback(async (email: string, password: string, name: string) => {
    await authService.register(email, password, name);
    await checkUser();
  }, [checkUser]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (name: string) => {
    await authService.updateProfile(name);
    await checkUser();
  }, [checkUser]);

  const checkRole = useCallback((requiredRole: UserRole): boolean => {
    if (!user || !user.role) return false;
    return authService.checkRole(user.role, requiredRole);
  }, [user]);

  const value: AuthContextType = useMemo(() => ({
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    checkRole,
  }), [user, loading, login, register, logout, updateProfile, checkRole]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
