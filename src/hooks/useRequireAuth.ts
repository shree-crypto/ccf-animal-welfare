'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

/**
 * Hook to require authentication and optionally a specific role
 * Redirects to login if not authenticated or unauthorized if insufficient role
 */
export function useRequireAuth(requiredRole?: UserRole) {
  const { user, loading, checkRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push(`/login?redirect=${window.location.pathname}`);
      } else if (requiredRole && !checkRole(requiredRole)) {
        router.push('/unauthorized');
      }
    }
  }, [user, loading, requiredRole, checkRole, router]);

  return { user, loading };
}
