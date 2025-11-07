import { UserRole } from '@/types/auth';

interface MockUser {
  $id: string;
  email: string;
  name: string;
  role: UserRole;
}

const MOCK_USERS: Record<string, { password: string; user: MockUser }> = {
  'admin@ccf.dev': {
    password: 'admin123',
    user: {
      $id: 'mock-admin-id',
      email: 'admin@ccf.dev',
      name: 'Admin User',
      role: 'admin',
    },
  },
  'volunteer@ccf.dev': {
    password: 'volunteer123',
    user: {
      $id: 'mock-volunteer-id',
      email: 'volunteer@ccf.dev',
      name: 'Volunteer User',
      role: 'volunteer',
    },
  },
  'user@ccf.dev': {
    password: 'user123',
    user: {
      $id: 'mock-user-id',
      email: 'user@ccf.dev',
      name: 'Public User',
      role: 'public',
    },
  },
};

const MOCK_SESSION_KEY = 'ccf_mock_session';

export class MockAuthService {
  /**
   * Check if we're in development mode
   */
  private isDevelopment(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  /**
   * Mock login
   */
  async login(email: string, password: string): Promise<MockUser> {
    if (!this.isDevelopment()) {
      throw new Error('Mock authentication only available in development');
    }

    const mockUser = MOCK_USERS[email];
    if (!mockUser || mockUser.password !== password) {
      throw new Error('Invalid credentials');
    }

    // Store session in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(mockUser.user));
    }

    return mockUser.user;
  }

  /**
   * Mock register
   */
  async register(email: string, password: string, name: string): Promise<MockUser> {
    if (!this.isDevelopment()) {
      throw new Error('Mock authentication only available in development');
    }

    // For mock, just create a volunteer user
    const newUser: MockUser = {
      $id: `mock-${Date.now()}`,
      email,
      name,
      role: 'volunteer',
    };

    // Store session in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(newUser));
    }

    return newUser;
  }

  /**
   * Mock logout
   */
  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(MOCK_SESSION_KEY);
    }
  }

  /**
   * Get current mock user
   */
  async getCurrentUser(): Promise<MockUser | null> {
    if (!this.isDevelopment()) {
      return null;
    }

    if (typeof window === 'undefined') {
      return null;
    }

    const sessionData = localStorage.getItem(MOCK_SESSION_KEY);
    if (!sessionData) {
      return null;
    }

    try {
      return JSON.parse(sessionData);
    } catch {
      return null;
    }
  }

  /**
   * Check if mock auth is available
   */
  isAvailable(): boolean {
    return this.isDevelopment();
  }
}

export const mockAuthService = new MockAuthService();
