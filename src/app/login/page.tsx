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
    console.log('🎉 Login successful, redirecting to:', redirect);
    // Use window.location to force a full page reload and re-initialize AuthContext
    window.location.href = redirect;
  };

  const isDev = process.env.NODE_ENV === 'development';

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        {isDev && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-1 shadow-lg">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🔧</span>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                  Development Mode - Mock Login
                </h3>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Use these test credentials to explore different user roles:
              </p>
              
              <div className="space-y-3">
                <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">👑</span>
                    <p className="font-bold text-red-900 dark:text-red-100">Admin Account</p>
                  </div>
                  <p className="text-sm text-red-800 dark:text-red-200 font-mono">
                    admin@ccf.dev / admin123
                  </p>
                  <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                    Full access to all features
                  </p>
                </div>
                
                <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">🤝</span>
                    <p className="font-bold text-green-900 dark:text-green-100">Volunteer Account</p>
                  </div>
                  <p className="text-sm text-green-800 dark:text-green-200 font-mono">
                    volunteer@ccf.dev / volunteer123
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300 mt-1">
                    Access to tasks, medical records, dashboard
                  </p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">👤</span>
                    <p className="font-bold text-blue-900 dark:text-blue-100">Public Account</p>
                  </div>
                  <p className="text-sm text-blue-800 dark:text-blue-200 font-mono">
                    user@ccf.dev / user123
                  </p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                    Limited access to public features only
                  </p>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  💡 <strong>Tip:</strong> Click on any credential to copy it to clipboard
                </p>
              </div>
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
