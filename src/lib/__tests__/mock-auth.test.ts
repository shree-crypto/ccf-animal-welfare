import { describe, it, expect, beforeEach, vi } from 'vitest';
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

describe('MockAuthService', () => {
  let mockAuthService: MockAuthService;

  beforeEach(() => {
    mockAuthService = new MockAuthService();
    localStorageMock.clear();
    // Set NODE_ENV to development for tests
    vi.stubEnv('NODE_ENV', 'development');
  });

  describe('login', () => {
    it('should successfully login with admin credentials', async () => {
      const user = await mockAuthService.login('admin@ccf.dev', 'admin123');

      expect(user).toBeDefined();
      expect(user.email).toBe('admin@ccf.dev');
      expect(user.name).toBe('Admin User');
      expect(user.role).toBe('admin');
      expect(user.$id).toBe('mock-admin-id');
    });

    it('should successfully login with volunteer credentials', async () => {
      const user = await mockAuthService.login(
        'volunteer@ccf.dev',
        'volunteer123'
      );

      expect(user).toBeDefined();
      expect(user.email).toBe('volunteer@ccf.dev');
      expect(user.name).toBe('Volunteer User');
      expect(user.role).toBe('volunteer');
      expect(user.$id).toBe('mock-volunteer-id');
    });

    it('should successfully login with public user credentials', async () => {
      const user = await mockAuthService.login('user@ccf.dev', 'user123');

      expect(user).toBeDefined();
      expect(user.email).toBe('user@ccf.dev');
      expect(user.name).toBe('Public User');
      expect(user.role).toBe('public');
      expect(user.$id).toBe('mock-user-id');
    });

    it('should throw error for invalid email', async () => {
      await expect(
        mockAuthService.login('invalid@ccf.dev', 'password')
      ).rejects.toThrow('Not a mock user');
    });

    it('should throw error for invalid password', async () => {
      await expect(
        mockAuthService.login('admin@ccf.dev', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');
    });

    it('should store session in localStorage', async () => {
      await mockAuthService.login('admin@ccf.dev', 'admin123');

      const sessionData = localStorageMock.getItem('ccf_mock_session');
      expect(sessionData).toBeDefined();

      const user = JSON.parse(sessionData!);
      expect(user.email).toBe('admin@ccf.dev');
      expect(user.role).toBe('admin');
    });
  });

  describe('getCurrentUser', () => {
    it('should return null when no session exists', async () => {
      const user = await mockAuthService.getCurrentUser();
      expect(user).toBeNull();
    });

    it('should return user from session', async () => {
      await mockAuthService.login('volunteer@ccf.dev', 'volunteer123');

      const user = await mockAuthService.getCurrentUser();
      expect(user).toBeDefined();
      expect(user?.email).toBe('volunteer@ccf.dev');
      expect(user?.role).toBe('volunteer');
    });

    it('should return null for invalid session data', async () => {
      localStorageMock.setItem('ccf_mock_session', 'invalid json');

      const user = await mockAuthService.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('logout', () => {
    it('should remove session from localStorage', async () => {
      await mockAuthService.login('admin@ccf.dev', 'admin123');
      expect(localStorageMock.getItem('ccf_mock_session')).toBeDefined();

      await mockAuthService.logout();
      expect(localStorageMock.getItem('ccf_mock_session')).toBeNull();
    });

    it('should clear current user', async () => {
      await mockAuthService.login('admin@ccf.dev', 'admin123');
      await mockAuthService.logout();

      const user = await mockAuthService.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('register', () => {
    it('should create a new volunteer user', async () => {
      const user = await mockAuthService.register(
        'newuser@ccf.dev',
        'password123',
        'New User'
      );

      expect(user).toBeDefined();
      expect(user.email).toBe('newuser@ccf.dev');
      expect(user.name).toBe('New User');
      expect(user.role).toBe('volunteer');
    });

    it('should store new user session', async () => {
      await mockAuthService.register(
        'newuser@ccf.dev',
        'password123',
        'New User'
      );

      const sessionData = localStorageMock.getItem('ccf_mock_session');
      expect(sessionData).toBeDefined();

      const user = JSON.parse(sessionData!);
      expect(user.email).toBe('newuser@ccf.dev');
    });
  });

  describe('isAvailable', () => {
    it('should return true in development mode', () => {
      expect(mockAuthService.isAvailable()).toBe(true);
    });
  });
});
