'use client';

import { ProtectedRoute } from '@/components/features/auth/ProtectedRoute';
import { ProfileForm } from '@/components/features/auth/ProfileForm';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <ProtectedRoute requiredRole="volunteer">
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-8">
        <div className="w-full max-w-md space-y-4">
          <ProfileForm />
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full"
          >
            Logout
          </Button>
        </div>
      </div>
    </ProtectedRoute>
  );
}
