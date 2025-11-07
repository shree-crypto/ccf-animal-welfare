import { UserRole, User } from '@/types/auth';

// Create a mock user that matches the Appwrite User structure
const createMockUser = (id: string, email: string, name: string, role: UserRole): User => {
  const now = new Date().toISOString();
  return {
    $id: id,
    $createdAt: now,
    $updatedAt: now,
    name,
    registration: now,
    status: true,
    labels: [],
    passwordUpdate: now,
    email,
    phone: '',
    emailVerification: false,
    phoneVerification: false,
    mfa: false,
    prefs: {},
    targets: [],
    accessedAt: now,
    role,
  };
};

const MOCK_USERS: Record<string, { password: string; user: User }> = {
  'admin@ccf.dev': {
    password: 'admin123',
    user: createMockUser('mock-admin-id', 'admin@ccf.dev', 'Admin User', 'admin'),
  },
  'volunteer@ccf.dev': {
    password: 'volunteer123',
    user: createMockUser('mock-volunteer-id', 'volunteer@ccf.dev', 'Volunteer User', 'volunteer'),
  },
  'user@ccf.dev': {
    password: 'user123',
    user: createMockUser('mock-user-id', 'user@ccf.dev', 'Public User', 'public'),
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
  async login(email: string, password: string): Promise<User> {
    if (!this.isDevelopment()) {
      throw new Error('Mock authentication only available in development');
    }

    const mockUser = MOCK_USERS[email];
    
    // If email is not a mock user, throw a different error
    if (!mockUser) {
      throw new Error('Not a mock user');
    }
    
    // If password is wrong, throw invalid credentials
    if (mockUser.password !== password) {
      throw new Error('Invalid credentials');
    }

    // Store session in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem(MOCK_SESSION_KEY, JSON.stringify(mockUser.user));
      console.log('Mock user logged in:', email);
    }

    return mockUser.user;
  }

  /**
   * Mock register
   */
  async register(email: string, password: string, name: string): Promise<User> {
    if (!this.isDevelopment()) {
      throw new Error('Mock authentication only available in development');
    }

    // For mock, just create a volunteer user
    const newUser = createMockUser(`mock-${Date.now()}`, email, name, 'volunteer');

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
  async getCurrentUser(): Promise<User | null> {
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
      return JSON.parse(sessionData) as User;
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
