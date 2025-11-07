'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import NotificationCenter from '@/components/features/notifications/NotificationCenter';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const pathname = usePathname();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/animals', label: 'Animals' },
    { href: '/about', label: 'About' },
    { href: '/stories', label: 'Stories' },
    { href: '/events', label: 'Events' },
    { href: '/contact', label: 'Contact' },
    { href: '/donate', label: 'Donate' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/login', label: 'Login' },
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
          <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
            <Heart className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">CCF Animal Welfare</span>
            <span className="sm:hidden">CCF</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-2">
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant={isActive(link.href) ? 'default' : 'ghost'}
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </nav>

            {/* Notification Center - Only show for authenticated users */}
            {user && (
              <div className="hidden md:block">
                <NotificationCenter />
              </div>
            )}

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
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  asChild
                  variant={isActive(link.href) ? 'default' : 'ghost'}
                  className="justify-start"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
