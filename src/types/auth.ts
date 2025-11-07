import { Models } from 'appwrite';

export type UserRole = 'public' | 'volunteer' | 'admin';

export interface User extends Models.User<Models.Preferences> {
  role?: UserRole;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (name: string) => Promise<void>;
  checkRole: (requiredRole: UserRole) => boolean;
}
