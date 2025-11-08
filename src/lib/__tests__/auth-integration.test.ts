import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuthService } from '../auth';
import { MockAuthService } from '../mock-auth';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(global, 'localStorage', {
  value: localStorageMock,
});

describe('AuthService Integration with MockAuth', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    localStorageMock.clear();
    vi.stubEnv('NODE_ENV', 'development');
  });

  describe('login flow', () => {
    it('should successfully login admin user and retrieve role', async () => {
      // Login
      const loginResult = await authService.login('admin@ccf.dev', 'admin123');
      expect(loginResult).toBeDefined();

      // Get current user
      const currentUser = await authService.getCurrentUser();
      expect(currentUser).toBeDefined();
      expect(currentUser?.email).toBe('admin@ccf.dev');

      // Get user role
      const role = await authService.getUserRole();
      expect(role).toBe('admin');
    });

    it('should successfully login volunteer user and retrieve role', async () => {
      await authService.login('volunteer@ccf.dev', 'volunteer123');
      
      const currentUser = await authService.getCurrentUser();
      expect(currentUser?.email).toBe('volunteer@ccf.dev');

      const role = await authService.getUserRole();
      expect(role).toBe('volunteer');
    });

    it('should successfully login public user and retrieve role', async () => {
      await authService.login('user@ccf.dev', 'user123');
      
      const currentUser = await authService.getCurrentUser();
      expect(currentUser?.email).toBe('user@ccf.dev');

      const role = await authService.getUserRole();
      expect(role).toBe('public');
    });

    it('should reject invalid credentials', async () => {
      await expect(
        authService.login('admin@ccf.dev', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('role checking', () => {
    it('should correctly check admin has admin access', async () => {
      await authService.login('admin@ccf.dev', 'admin123');
      const role = await authService.getUserRole();
      
      expect(authService.checkRole(role, 'admin')).toBe(true);
      expect(authService.checkRole(role, 'volunteer')).toBe(true);
      expect(authService.checkRole(role, 'public')).toBe(true);
    });

    it('should correctly check volunteer has volunteer access', async () => {
      await authService.login('volunteer@ccf.dev', 'volunteer123');
      const role = await authService.getUserRole();
      
      expect(authService.checkRole(role, 'admin')).toBe(false);
      expect(authService.checkRole(role, 'volunteer')).toBe(true);
      expect(authService.checkRole(role, 'public')).toBe(true);
    });

    it('should correctly check public has only public access', async () => {
      await authService.login('user@ccf.dev', 'user123');
      const role = await authService.getUserRole();
      
      expect(authService.checkRole(role, 'admin')).toBe(false);
      expect(authService.checkRole(role, 'volunteer')).toBe(false);
      expect(authService.checkRole(role, 'public')).toBe(true);
    });
  });

  describe('session persistence', () => {
    it('should persist session across page reloads', async () => {
      // Login
      await authService.login('admin@ccf.dev', 'admin123');
      
      // Simulate page reload by creating new service instance
      const newAuthService = new AuthService();
      
      // Should still have user
      const currentUser = await newAuthService.getCurrentUser();
      expect(currentUser).toBeDefined();
      expect(currentUser?.email).toBe('admin@ccf.dev');
      
      const role = await newAuthService.getUserRole();
      expect(role).toBe('admin');
    });

    it('should clear session on logout', async () => {
      // Login
      await authService.login('volunteer@ccf.dev', 'volunteer123');
      expect(await authService.getCurrentUser()).toBeDefined();
      
      // Logout
      await authService.logout();
      
      // Should not have user
      const currentUser = await authService.getCurrentUser();
      expect(currentUser).toBeNull();
    });
  });

  describe('registration', () => {
    it('should register new user as volunteer', async () => {
      const newUser = await authService.register(
        'newuser@example.com',
        'password123',
        'New User'
      );
      
      expect(newUser).toBeDefined();
      expect(newUser.email).toBe('newuser@example.com');
      expect(newUser.name).toBe('New User');
      
      // Should be logged in after registration
      const currentUser = await authService.getCurrentUser();
      expect(currentUser?.email).toBe('newuser@example.com');
      
      // Should have volunteer role
      const role = await authService.getUserRole();
      expect(role).toBe('volunteer');
    });
  });
});
