'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';

export function AuthDebug() {
  const { user, loading } = useAuth();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 p-4 max-w-sm bg-black/90 text-white text-xs z-50">
      <div className="font-bold mb-2">🔧 Auth Debug</div>
      <div className="space-y-1">
        <div>Loading: {loading ? '⏳ Yes' : '✅ No'}</div>
        <div>User: {user ? '✅ Logged in' : '❌ Not logged in'}</div>
        {user && (
          <>
            <div>Email: {user.email}</div>
            <div>Name: {user.name}</div>
            <div>Role: {user.role || 'none'}</div>
            <div>ID: {user.$id}</div>
          </>
        )}
        <div className="mt-2 pt-2 border-t border-white/20">
          <div>ENV: {process.env.NODE_ENV}</div>
          <div>
            LocalStorage:{' '}
            {typeof window !== 'undefined' && localStorage.getItem('ccf_mock_session')
              ? '✅ Has session'
              : '❌ No session'}
          </div>
        </div>
      </div>
    </Card>
  );
}
