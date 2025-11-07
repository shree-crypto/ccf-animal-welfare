import { describe, it, expect } from 'vitest';
import { AuthService } from '../auth';

describe('AuthService', () => {
  const authService = new AuthService();

  describe('checkRole', () => {
    it('should allow admin to access admin resources', () => {
      const result = authService.checkRole('admin', 'admin');
      expect(result).toBe(true);
    });

    it('should allow admin to access volunteer resources', () => {
      const result = authService.checkRole('admin', 'volunteer');
      expect(result).toBe(true);
    });

    it('should allow admin to access public resources', () => {
      const result = authService.checkRole('admin', 'public');
      expect(result).toBe(true);
    });

    it('should allow volunteer to access volunteer resources', () => {
      const result = authService.checkRole('volunteer', 'volunteer');
      expect(result).toBe(true);
    });

    it('should allow volunteer to access public resources', () => {
      const result = authService.checkRole('volunteer', 'public');
      expect(result).toBe(true);
    });

    it('should not allow volunteer to access admin resources', () => {
      const result = authService.checkRole('volunteer', 'admin');
      expect(result).toBe(false);
    });

    it('should allow public to access public resources', () => {
      const result = authService.checkRole('public', 'public');
      expect(result).toBe(true);
    });

    it('should not allow public to access volunteer resources', () => {
      const result = authService.checkRole('public', 'volunteer');
      expect(result).toBe(false);
    });

    it('should not allow public to access admin resources', () => {
      const result = authService.checkRole('public', 'admin');
      expect(result).toBe(false);
    });
  });
});
