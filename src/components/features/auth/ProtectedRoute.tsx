'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackUrl?: string;
}

export function ProtectedRoute({
  children,
  requiredRole = 'volunteer',
  fallbackUrl = '/login',
}: ProtectedRouteProps) {
  const { user, loading, checkRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not authenticated, redirect to login
        router.push(`${fallbackUrl}?redirect=${window.location.pathname}`);
      } else if (requiredRole && !checkRole(requiredRole)) {
        // Authenticated but doesn't have required role
        router.push('/unauthorized');
      }
    }
  }, [user, loading, requiredRole, checkRole, router, fallbackUrl]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user || (requiredRole && !checkRole(requiredRole))) {
    return null;
  }

  // User is authenticated and has required role
  return <>{children}</>;
}
