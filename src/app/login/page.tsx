'use client';

import { useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LoginForm } from '@/components/features/auth/LoginForm';
import { RegisterForm } from '@/components/features/auth/RegisterForm';
import { AuthDebug } from '@/components/features/auth/AuthDebug';
import { CredentialsCard, DevModeBanner, type CredentialInfo } from '@/components/features/auth';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { isDevelopmentMode } from '@/lib/utils/env';

const mockCredentials: CredentialInfo[] = [
  {
    role: 'admin',
    email: 'admin@ccf.dev',
    password: 'admin123',
    icon: '👑',
    title: 'Admin Account',
    description: 'Full access to all features',
  },
  {
    role: 'volunteer',
    email: 'volunteer@ccf.dev',
    password: 'volunteer123',
    icon: '🤝',
    title: 'Volunteer Account',
    description: 'Access to tasks, medical records, dashboard',
  },
  {
    role: 'public',
    email: 'user@ccf.dev',
    password: 'user123',
    icon: '👤',
    title: 'Public Account',
    description: 'Limited access to public features only',
  },
];

function LoginContent() {
  const [showRegister, setShowRegister] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<string | null>(null);
  const [showCredentials, setShowCredentials] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { config } = useTheme();
  const loginFormRef = useRef<{ fillCredentials: (email: string, password: string) => void; submitForm?: () => void }>(null);

  const handleSuccess = () => {
    const redirect = searchParams.get('redirect') || '/dashboard';
    console.log('🎉 Login successful, redirecting to:', redirect);
    // Use window.location to force a full page reload and re-initialize AuthContext
    window.location.href = redirect;
  };

  const handleAutoFill = (credential: CredentialInfo) => {
    setSelectedCredential(credential.role);
    loginFormRef.current?.fillCredentials(credential.email, credential.password);
    
    // Reset selection after animation
    setTimeout(() => {
      setSelectedCredential(null);
    }, 1000);
  };

  const handleQuickLogin = async (credential: CredentialInfo) => {
    setSelectedCredential(credential.role);
    loginFormRef.current?.fillCredentials(credential.email, credential.password);
    
    // Trigger form submission after a brief delay to show the fill animation
    setTimeout(() => {
      loginFormRef.current?.submitForm?.();
    }, 300);
  };

  const isDev = isDevelopmentMode();

  return (
    <>
      {/* Development Mode Banner */}
      {isDev && (
        <DevModeBanner
          onToggleCredentials={setShowCredentials}
          showCredentials={showCredentials}
        />
      )}

      <div className={cn(
        "flex items-center justify-center min-h-screen px-4 py-8",
        isDev && "pt-24", // Add padding when banner is visible
        config.effects.gradients
          ? "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900"
          : "bg-background"
      )}>
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Credentials Section - Now more prominent */}
            {isDev && showCredentials && (
            <div className={cn(
              "rounded-xl p-1 shadow-2xl order-2 lg:order-1",
              config.effects.gradients
                ? "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"
                : "bg-primary"
            )}>
              <div className="bg-card rounded-lg p-6 lg:p-8 h-full">
                {/* Prominent Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 mb-4">
                    <span className="text-3xl">🔧</span>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    Test Credentials
                  </h2>
                  <p className="text-muted-foreground text-sm lg:text-base">
                    Quick access to demo accounts for testing
                  </p>
                </div>
                
                {/* Credentials Cards with better spacing */}
                <div className="space-y-4 mb-6">
                  {mockCredentials.map((credential) => (
                    <CredentialsCard
                      key={credential.role}
                      credential={credential}
                      onAutoFill={handleAutoFill}
                      onQuickLogin={handleQuickLogin}
                      isSelected={selectedCredential === credential.role}
                    />
                  ))}
                </div>
                
                {/* Enhanced Tips Section */}
                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-base">💡</span>
                    <p>
                      <strong className="text-foreground">Auto-Fill:</strong> Click a card to fill the login form
                    </p>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-base">⚡</span>
                    <p>
                      <strong className="text-foreground">Quick Login:</strong> Use the login button for instant access
                    </p>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="text-base">📋</span>
                    <p>
                      <strong className="text-foreground">Copy:</strong> Use copy buttons for individual fields
                    </p>
                  </div>
                </div>
              </div>
            </div>
            )}
            
            {/* Login Form Section */}
            <div className="order-1 lg:order-2">
              {showRegister ? (
                <RegisterForm
                  onSuccess={handleSuccess}
                  onSwitchToLogin={() => setShowRegister(false)}
                />
              ) : (
                <LoginForm
                  ref={loginFormRef}
                  onSuccess={handleSuccess}
                  onSwitchToRegister={() => setShowRegister(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
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
