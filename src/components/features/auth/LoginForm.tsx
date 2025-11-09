'use client';

import { useState, forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { loginSchema, LoginFormData } from '@/lib/validations/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

export interface LoginFormRef {
  fillCredentials: (email: string, password: string) => void;
  submitForm?: () => void;
}

export const LoginForm = forwardRef<LoginFormRef, LoginFormProps>(
  ({ onSuccess, onSwitchToRegister }, ref) => {
    const { login } = useAuth();
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
      setIsLoading(true);
      setError('');

      try {
        await login(data.email, data.password);
        onSuccess?.();
      } catch (err: any) {
        setError(
          err.message || 'Failed to login. Please check your credentials.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
      fillCredentials: (email: string, password: string) => {
        setValue('email', email, { shouldValidate: true });
        setValue('password', password, { shouldValidate: true });
      },
      submitForm: () => {
        handleSubmit(onSubmit)();
      },
    }));

    return (
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription className="text-xs">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-3">
            {error && (
              <div className="p-2.5 text-xs text-red-600 bg-red-50 dark:bg-red-950 rounded-md border border-red-200 dark:border-red-800">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register('email')}
                disabled={isLoading}
                className="h-9 text-sm"
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
                className="h-9 text-sm"
              />
              {errors.password && (
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3 pt-2">
            <Button type="submit" className="w-full h-9 text-sm" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            {onSwitchToRegister && (
              <p className="text-xs text-center text-muted-foreground">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-primary hover:underline font-medium"
                >
                  Register here
                </button>
              </p>
            )}
          </CardFooter>
        </form>
      </Card>
    );
  }
);

LoginForm.displayName = 'LoginForm';
