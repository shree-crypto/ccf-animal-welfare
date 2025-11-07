import { account, teams } from './appwrite';
import { TEAM_IDS, ROLE_HIERARCHY } from './constants/teams';
import { UserRole } from '@/types/auth';
import { ID } from 'appwrite';
import { mockAuthService } from './mock-auth';

export class AuthService {
  /**
   * Register a new user
   */
  async register(email: string, password: string, name: string) {
    // Try mock auth first in development
    if (mockAuthService.isAvailable()) {
      try {
        const result = await mockAuthService.register(email, password, name);
        console.log('Mock registration successful:', result.email);
        return result;
      } catch (mockError) {
        console.log('Mock auth not applicable, trying real auth:', mockError);
      }
    }

    try {
      const user = await account.create(ID.unique(), email, password, name);
      // After registration, create a session
      await account.createEmailPasswordSession(email, password);
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string) {
    // Try mock auth first in development
    if (mockAuthService.isAvailable()) {
      try {
        const result = await mockAuthService.login(email, password);
        console.log('✅ Mock auth successful:', result.email);
        return result;
      } catch (mockError: any) {
        // If it's a mock user but wrong password, don't fall through to real auth
        if (mockError.message === 'Invalid credentials') {
          console.error('❌ Mock auth failed: Invalid password for mock user');
          throw mockError;
        }
        // Not a mock user, try real Appwrite
        console.log('ℹ️ Not a mock user, trying Appwrite auth...');
      }
    }

    try {
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Logout current user
   */
  async logout() {
    // Logout from mock auth if available
    if (mockAuthService.isAvailable()) {
      await mockAuthService.logout();
    }

    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout error:', error);
      // Don't throw error on logout
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    // Try mock auth first in development
    if (mockAuthService.isAvailable()) {
      const mockUser = await mockAuthService.getCurrentUser();
      if (mockUser) {
        return mockUser;
      }
    }

    try {
      const user = await account.get();
      return user;
    } catch (error) {
      return null;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(name: string) {
    try {
      const user = await account.updateName(name);
      return user;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Get user's role based on team membership
   */
  async getUserRole(): Promise<UserRole> {
    // Check if mock user has role
    if (mockAuthService.isAvailable()) {
      const mockUser = await mockAuthService.getCurrentUser();
      if (mockUser && 'role' in mockUser) {
        return mockUser.role as UserRole;
      }
    }

    try {
      const teamsList = await teams.list();
      
      // Check if user is in admin team
      const isAdmin = teamsList.teams.some(team => team.$id === TEAM_IDS.ADMIN);
      if (isAdmin) return 'admin';
      
      // Check if user is in volunteer team
      const isVolunteer = teamsList.teams.some(team => team.$id === TEAM_IDS.VOLUNTEER);
      if (isVolunteer) return 'volunteer';
      
      return 'public';
    } catch (error) {
      console.error('Get user role error:', error);
      return 'public';
    }
  }

  /**
   * Check if user has required role
   */
  checkRole(userRole: UserRole, requiredRole: UserRole): boolean {
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
  }
}

export const authService = new AuthService();
