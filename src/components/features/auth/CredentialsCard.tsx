'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check, LogIn, MousePointerClick } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export type UserRole = 'admin' | 'volunteer' | 'public';

export interface CredentialInfo {
  role: UserRole;
  email: string;
  password: string;
  icon: string;
  title: string;
  description: string;
}

interface CredentialsCardProps {
  credential: CredentialInfo;
  className?: string;
  onAutoFill?: (credential: CredentialInfo) => void;
  onQuickLogin?: (credential: CredentialInfo) => void;
  isSelected?: boolean;
}

const roleColors = {
  admin: {
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
    text: 'text-red-900 dark:text-red-100',
    subtext: 'text-red-800 dark:text-red-200',
    description: 'text-red-700 dark:text-red-300',
    hover: 'hover:bg-red-100 dark:hover:bg-red-900',
  },
  volunteer: {
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800',
    text: 'text-green-900 dark:text-green-100',
    subtext: 'text-green-800 dark:text-green-200',
    description: 'text-green-700 dark:text-green-300',
    hover: 'hover:bg-green-100 dark:hover:bg-green-900',
  },
  public: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    text: 'text-blue-900 dark:text-blue-100',
    subtext: 'text-blue-800 dark:text-blue-200',
    description: 'text-blue-700 dark:text-blue-300',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900',
  },
};

export function CredentialsCard({
  credential,
  className,
  onAutoFill,
  onQuickLogin,
  isSelected = false,
}: CredentialsCardProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const colors = roleColors[credential.role];

  const copyToClipboard = async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      toast.success(`${fieldName} copied to clipboard`);

      // Reset after 2 seconds
      setTimeout(() => {
        setCopiedField(null);
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
      console.error('Copy failed:', error);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    text: string,
    fieldName: string
  ) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      copyToClipboard(text, fieldName);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }

    if (onAutoFill) {
      onAutoFill(credential);
      toast.success(`${credential.title} credentials filled in form`);
    }
  };

  const handleQuickLoginClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onQuickLogin) {
      onQuickLogin(credential);
      toast.success(`Logging in as ${credential.title}...`);
    }
  };

  return (
    <Card
      className={cn(
        colors.bg,
        colors.border,
        'rounded-lg transition-all duration-200 cursor-pointer border',
        onAutoFill && 'hover:shadow-md hover:scale-[1.01]',
        isSelected &&
          'ring-2 ring-offset-1 ring-primary shadow-lg scale-[1.01]',
        className
      )}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick(e as any);
        }
      }}
      aria-label={`${credential.title} - Click to auto-fill credentials`}
    >
      <CardContent className="p-3">
        {/* Header with icon, title, and selection indicator */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span
              className="text-xl"
              role="img"
              aria-label={`${credential.role} icon`}
            >
              {credential.icon}
            </span>
            <h3 className={cn('font-bold text-base', colors.text)}>
              {credential.title}
            </h3>
          </div>
          {isSelected && (
            <div className="flex items-center gap-1 text-[10px] font-medium text-primary animate-pulse">
              <Check className="h-3 w-3" />
              <span>Selected</span>
            </div>
          )}
          {!isSelected && onAutoFill && (
            <MousePointerClick
              className={cn('h-3 w-3 opacity-40', colors.text)}
            />
          )}
        </div>

        {/* Email field */}
        <div className="mb-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className={cn('text-[10px] font-medium mb-0.5', colors.description)}>
                Email
              </p>
              <p className={cn('text-xs font-mono truncate', colors.subtext)}>
                {credential.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={cn('h-7 w-7 p-0', colors.hover)}
              onClick={e => {
                e.stopPropagation();
                copyToClipboard(credential.email, 'Email');
              }}
              onKeyDown={e => {
                e.stopPropagation();
                handleKeyDown(e, credential.email, 'Email');
              }}
              aria-label={`Copy ${credential.role} email`}
            >
              {copiedField === 'Email' ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Password field */}
        <div className="mb-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className={cn('text-[10px] font-medium mb-0.5', colors.description)}>
                Password
              </p>
              <p className={cn('text-xs font-mono truncate', colors.subtext)}>
                {credential.password}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className={cn('h-7 w-7 p-0', colors.hover)}
              onClick={e => {
                e.stopPropagation();
                copyToClipboard(credential.password, 'Password');
              }}
              onKeyDown={e => {
                e.stopPropagation();
                handleKeyDown(e, credential.password, 'Password');
              }}
              aria-label={`Copy ${credential.role} password`}
            >
              {copiedField === 'Password' ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>

        {/* Description/Permissions */}
        <p
          className={cn(
            'text-[10px] mt-1.5 pt-1.5 border-t',
            colors.description,
            colors.border
          )}
        >
          {credential.description}
        </p>

        {/* Action buttons */}
        <div className="grid grid-cols-2 gap-1.5 mt-2">
          <Button
            variant="outline"
            size="sm"
            className={cn('w-full h-7 text-[10px]', colors.border, colors.hover)}
            onClick={e => {
              e.stopPropagation();
              const both = `${credential.email}\n${credential.password}`;
              copyToClipboard(both, 'Credentials');
            }}
            onKeyDown={e => {
              e.stopPropagation();
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const both = `${credential.email}\n${credential.password}`;
                copyToClipboard(both, 'Credentials');
              }
            }}
            aria-label={`Copy both ${credential.role} credentials`}
          >
            <Copy className="h-2.5 w-2.5 mr-1" />
            Copy
          </Button>

          {onQuickLogin && (
            <Button
              size="sm"
              className={cn(
                'w-full h-7 text-[10px] font-semibold',
                credential.role === 'admin' &&
                  'bg-red-600 hover:bg-red-700 text-white',
                credential.role === 'volunteer' &&
                  'bg-green-600 hover:bg-green-700 text-white',
                credential.role === 'public' &&
                  'bg-blue-600 hover:bg-blue-700 text-white'
              )}
              onClick={handleQuickLoginClick}
              onKeyDown={e => {
                e.stopPropagation();
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleQuickLoginClick(e as any);
                }
              }}
              aria-label={`Quick login as ${credential.role}`}
            >
              <LogIn className="h-2.5 w-2.5 mr-1" />
              Login
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
