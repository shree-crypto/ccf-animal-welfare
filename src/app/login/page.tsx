'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { RegisterForm } from '@/components/features/auth/RegisterForm';
import { AuthDebug } from '@/components/features/auth/AuthDebug';

function LoginContent() {
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSuccess = () => {
    const redirect = searchParams.get('redirect') || '/dashboard';
    router.push(redirect);
  };

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-4">
        {isDev && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-semibold text-blue-900 mb-2">🔧 Development Mode</p>
            <p className="text-blue-800 mb-2">Use these credentials to test:</p>
            <div className="space-y-1 text-blue-700">
              <p><strong>Admin:</strong> admin@ccf.dev / admin123</p>
              <p><strong>Volunteer:</strong> volunteer@ccf.dev / volunteer123</p>
              <p><strong>Public:</strong> user@ccf.dev / user123</p>
            </div>
          </div>
        )}
        
        {showRegister ? (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">Loading...</div>
        </div>
      }>
        <LoginContent />
      </Suspense>
      <AuthDebug />
    </>
  );
}
