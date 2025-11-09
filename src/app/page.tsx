'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';
import { ImpactDashboardContainer } from '@/components/features/impact';
import {
  Heart,
  Users,
  MapPin,
  Sparkles,
  PawPrint,
  Calendar,
  DollarSign,
  BookOpen,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export default function Home() {
  const { config } = useTheme();

  return (
    <div
      className={cn(
        'min-h-screen relative overflow-hidden',
        config.effects.gradients
          ? 'bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900'
          : 'bg-background'
      )}
    >
      <AnimatedGradient />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-32 px-4">
        <BackgroundBeams className="opacity-40" />
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8 max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-sm shadow-lg',
                config.effects.gradients
                  ? 'bg-gradient-to-r from-pink-200/80 to-purple-200/80 dark:from-pink-900/50 dark:to-purple-900/50'
                  : 'bg-muted'
              )}
            >
              <PawPrint className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              <span
                className={cn(
                  'text-sm font-bold',
                  config.effects.gradients
                    ? 'text-purple-900 dark:text-purple-100'
                    : 'text-foreground'
                )}
              >
                IIT Roorkee's Animal Welfare Initiative
              </span>
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </motion.div>

            <h1 className="text-6xl md:text-8xl font-black tracking-tight">
              <span
                className={cn(
                  config.effects.gradients
                    ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent'
                    : 'text-foreground'
                )}
              >
                Committee for
              </span>
              <br />
              <span
                className={cn(
                  config.effects.gradients
                    ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent'
                    : 'text-foreground'
                )}
              >
                Campus Fauna
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
              Caring for the animals of IIT Roorkee with{' '}
              <span className="font-bold text-pink-600 dark:text-pink-400">
                compassion
              </span>
              ,{' '}
              <span className="font-bold text-purple-600 dark:text-purple-400">
                dedication
              </span>
              , and{' '}
              <span className="font-bold text-blue-600 dark:text-blue-400">
                love
              </span>
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
            >
              <Button
                asChild
                size="lg"
                className={cn(
                  'text-lg px-8 py-6 rounded-xl',
                  config.effects.gradients
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg shadow-purple-500/50'
                    : ''
                )}
              >
                <Link href="/animals">
                  <Heart className="h-6 w-6 mr-2 fill-current" />
                  Meet Our Animals
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className={cn(
                  'text-lg px-8 py-6 rounded-xl backdrop-blur-sm',
                  config.effects.gradients
                    ? 'border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                    : ''
                )}
              >
                <Link href="/login">
                  <Users className="h-6 w-6 mr-2" />
                  Volunteer Login
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section with Bento Grid */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className={cn(
                'text-4xl md:text-5xl font-bold mb-4',
                config.effects.gradients
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
                  : 'text-foreground'
              )}
            >
              What We Do
            </h2>
            <p className="text-lg text-muted-foreground">
              Making a difference, one paw at a time
            </p>
          </motion.div>

          <BentoGrid className="max-w-7xl mx-auto">
            <BentoGridItem
              title="Animal Care"
              description="Providing daily care, feeding, and medical attention to campus animals with love and dedication"
              header={
                <div
                  className={cn(
                    'flex h-full w-full items-center justify-center rounded-lg',
                    config.effects.gradients
                      ? 'bg-gradient-to-br from-pink-200 to-rose-200 dark:from-pink-900/30 dark:to-rose-900/30'
                      : 'bg-muted'
                  )}
                >
                  <Heart className="h-20 w-20 text-pink-600 dark:text-pink-400" />
                </div>
              }
              icon={
                <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
              }
              className={cn(
                'md:col-span-1 backdrop-blur-sm border-2',
                config.effects.gradients
                  ? 'bg-gradient-to-br from-pink-100/80 to-rose-100/80 dark:from-pink-900/20 dark:to-rose-900/20 border-pink-200 dark:border-pink-800'
                  : 'bg-card border-border'
              )}
            />
            <BentoGridItem
              title="Volunteer Network"
              description="Coordinating dedicated volunteers to ensure consistent animal welfare across campus"
              header={
                <div
                  className={cn(
                    'flex h-full w-full items-center justify-center rounded-lg',
                    config.effects.gradients
                      ? 'bg-gradient-to-br from-purple-200 to-indigo-200 dark:from-purple-900/30 dark:to-indigo-900/30'
                      : 'bg-muted'
                  )}
                >
                  <Users className="h-20 w-20 text-purple-600 dark:text-purple-400" />
                </div>
              }
              icon={
                <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              }
              className={cn(
                'md:col-span-1 backdrop-blur-sm border-2',
                config.effects.gradients
                  ? 'bg-gradient-to-br from-purple-100/80 to-indigo-100/80 dark:from-purple-900/20 dark:to-indigo-900/20 border-purple-200 dark:border-purple-800'
                  : 'bg-card border-border'
              )}
            />
            <BentoGridItem
              title="Territory Management"
              description="Tracking animal locations and territories to provide better care and monitoring"
              header={
                <div
                  className={cn(
                    'flex h-full w-full items-center justify-center rounded-lg',
                    config.effects.gradients
                      ? 'bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-900/30 dark:to-cyan-900/30'
                      : 'bg-muted'
                  )}
                >
                  <MapPin className="h-20 w-20 text-blue-600 dark:text-blue-400" />
                </div>
              }
              icon={
                <MapPin className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              }
              className={cn(
                'md:col-span-1 backdrop-blur-sm border-2',
                config.effects.gradients
                  ? 'bg-gradient-to-br from-blue-100/80 to-cyan-100/80 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800'
                  : 'bg-card border-border'
              )}
            />
          </BentoGrid>
        </div>
      </section>

      {/* Impact Dashboard Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <ImpactDashboardContainer />
          </motion.div>
        </div>
      </section>

      {/* Quick Links Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2
              className={cn(
                'text-4xl md:text-5xl font-bold mb-4',
                config.effects.gradients
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                  : 'text-foreground'
              )}
            >
              Get Involved
            </h2>
            <p className="text-lg text-muted-foreground">
              Discover ways to support our mission
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                href: '/about',
                title: 'Our Mission',
                desc: 'Learn about our values and what drives us',
                icon: BookOpen,
                gradient: 'from-pink-400 to-rose-400',
              },
              {
                href: '/stories',
                title: 'Success Stories',
                desc: 'Read inspiring tales of rescue and recovery',
                icon: Heart,
                gradient: 'from-purple-400 to-indigo-400',
              },
              {
                href: '/events',
                title: 'Events',
                desc: 'Join our volunteer activities and campaigns',
                icon: Calendar,
                gradient: 'from-blue-400 to-cyan-400',
              },
              {
                href: '/donate',
                title: 'Donate',
                desc: 'Support our cause with your contribution',
                icon: DollarSign,
                gradient: 'from-orange-400 to-amber-400',
              },
            ].map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <Link href={item.href} className="group block h-full">
                  <div
                    className={cn(
                      'p-8 rounded-2xl backdrop-blur-sm border-2 hover:shadow-2xl transition-all duration-300 h-full',
                      config.effects.gradients
                        ? 'bg-white/70 dark:bg-gray-900/70 border-transparent hover:border-purple-300 dark:hover:border-purple-700'
                        : 'bg-card border-border hover:border-primary'
                    )}
                  >
                    <div
                      className={cn(
                        'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 group-hover:scale-110 transition-transform shadow-lg',
                        config.effects.gradients
                          ? `bg-gradient-to-br ${item.gradient}`
                          : 'bg-primary'
                      )}
                    >
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3
                      className={cn(
                        'text-2xl font-bold mb-3 transition-all',
                        config.effects.gradients
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-pink-600 group-hover:to-purple-600'
                          : 'text-foreground'
                      )}
                    >
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-4 relative z-10 overflow-hidden">
        {config.effects.gradients && (
          <div className="absolute inset-0 bg-gradient-to-r from-pink-300/20 via-purple-300/20 to-blue-300/20 backdrop-blur-3xl" />
        )}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto text-center space-y-8 relative z-10"
        >
          <div
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-full backdrop-blur-sm shadow-lg mb-4',
              config.effects.gradients
                ? 'bg-gradient-to-r from-pink-200/80 to-purple-200/80 dark:from-pink-900/50 dark:to-purple-900/50'
                : 'bg-muted'
            )}
          >
            <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <span
              className={cn(
                'text-sm font-bold',
                config.effects.gradients
                  ? 'text-purple-900 dark:text-purple-100'
                  : 'text-foreground'
              )}
            >
              Be Part of Something Beautiful
            </span>
          </div>

          <h2
            className={cn(
              'text-5xl md:text-6xl font-black',
              config.effects.gradients
                ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent'
                : 'text-foreground'
            )}
          >
            Join Our Mission
          </h2>

          <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Help us make a difference in the lives of campus animals. Every
            contribution, big or small, creates ripples of positive change.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Button
              asChild
              size="lg"
              className={cn(
                'text-lg px-8 py-6 rounded-xl',
                config.effects.gradients
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg shadow-purple-500/50'
                  : ''
              )}
            >
              <Link href="/contact">
                <Users className="h-6 w-6 mr-2" />
                Become a Volunteer
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className={cn(
                'text-lg px-8 py-6 rounded-xl backdrop-blur-sm',
                config.effects.gradients
                  ? 'border-2 border-purple-300 dark:border-purple-700 hover:bg-purple-100 dark:hover:bg-purple-900/50'
                  : ''
              )}
            >
              <Link href="/animals">
                <PawPrint className="h-6 w-6 mr-2" />
                Explore Animal Profiles
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
}
