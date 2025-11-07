'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { RegisterForm } from '@/components/features/auth/RegisterForm';

function LoginContent() {
  const [showRegister, setShowRegister] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSuccess = () => {
    const redirect = searchParams.get('redirect') || '/dashboard';
    router.push(redirect);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
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
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">Loading...</div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
