'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LinkButton } from '@/components/ui/link-button';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from '@/components/features/notifications/NotificationCenter';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { ThemeSwitcherCompact } from '@/components/features/theme';

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Public links - always visible
  const publicLinks = [
    { href: '/', label: 'Home' },
    { href: '/animals', label: 'Animals' },
    { href: '/territories', label: 'Map' },
    { href: '/report', label: 'Report' },
    { href: '/about', label: 'About' },
    { href: '/stories', label: 'Stories' },
    { href: '/events', label: 'Events' },
    { href: '/contact', label: 'Contact' },
    { href: '/donate', label: 'Donate' },
  ];

  // Authenticated user links
  const authLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/medical', label: 'Medical' },
    { href: '/emergency', label: 'Emergency' },
  ];

  // Admin only links
  const adminLinks =
    user?.role === 'admin' ? [{ href: '/admin/animals', label: 'Admin' }] : [];

  // Combine links based on auth state
  const navLinks = [
    ...publicLinks,
    ...(user ? [...authLinks, ...adminLinks] : []),
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-lg"
          >
            <Heart className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">CCF Animal Welfare</span>
            <span className="sm:hidden">CCF</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <LinkButton
                  key={link.href}
                  href={link.href}
                  variant={isActive(link.href) ? 'default' : 'ghost'}
                  size="sm"
                >
                  {link.label}
                </LinkButton>
              ))}
            </nav>

            {/* Auth Actions */}
            <div className="hidden md:flex items-center gap-2 ml-2">
              {/* Theme Switcher */}
              <ThemeSwitcherCompact />

              {/* Dark Mode Toggle */}
              <ThemeToggle />

              {user ? (
                <>
                  {/* Notification Center */}
                  <NotificationCenter />

                  {/* User Info & Logout */}
                  <div className="flex items-center gap-2 pl-2 border-l">
                    <span className="text-sm text-muted-foreground">
                      {user.name}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        await logout();
                        window.location.href = '/';
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <LinkButton href="/login" size="sm">
                  Login
                </LinkButton>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t"
          >
            <nav className="flex flex-col p-4 gap-2">
              {navLinks.map(link => (
                <LinkButton
                  key={link.href}
                  href={link.href}
                  variant={isActive(link.href) ? 'default' : 'ghost'}
                  className="justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </LinkButton>
              ))}

              {/* Mobile Auth Actions */}
              <div className="border-t pt-2 mt-2 space-y-2">
                {/* Theme Switcher for Mobile */}
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-muted-foreground">
                    Theme Style
                  </span>
                  <ThemeSwitcherCompact />
                </div>

                {/* Dark Mode Toggle for Mobile */}
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-sm text-muted-foreground">
                    Dark Mode
                  </span>
                  <ThemeToggle />
                </div>

                {user ? (
                  <>
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Logged in as {user.name}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      onClick={async () => {
                        await logout();
                        setMobileMenuOpen(false);
                        window.location.href = '/';
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <LinkButton
                    href="/login"
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </LinkButton>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
