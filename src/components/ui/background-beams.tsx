'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

/**
 * BackgroundBeams - Aceternity UI component
 *
 * Displays animated gradient beams in the background.
 * Only renders when custom theme is active (config.effects.aceternity === true).
 *
 * @param className - Optional additional CSS classes
 * @returns Animated beam background or null if disabled
 */
export const BackgroundBeams = ({ className }: { className?: string }) => {
  const { config } = useTheme();

  // Only show in custom theme
  if (!config.effects.aceternity) {
    return null;
  }

  const paths = [
    'M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875',
    'M-373 -197C-373 -197 -305 208 159 335C623 462 691 867 691 867',
    'M-366 -205C-366 -205 -298 200 166 327C630 454 698 859 698 859',
  ];

  return (
    <div
      className={cn(
        'absolute inset-0 z-0 flex items-center justify-center overflow-hidden',
        className
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {paths.map((path, index) => (
          <motion.path
            key={`path-${index}`}
            d={path}
            stroke={`url(#linearGradient-${index})`}
            strokeOpacity="0.4"
            strokeWidth="0.5"
          />
        ))}
        <defs>
          {paths.map((_, index) => (
            <motion.linearGradient
              id={`linearGradient-${index}`}
              key={`gradient-${index}`}
              initial={{
                x1: '0%',
                x2: '0%',
                y1: '0%',
                y2: '0%',
              }}
              animate={{
                x1: ['0%', '100%'],
                x2: ['0%', '95%'],
                y1: ['0%', '100%'],
                y2: ['0%', `${93 + index * 1}%`],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                ease: 'linear',
                repeat: Infinity,
                repeatType: 'loop',
              }}
            >
              <stop stopColor="#A78BFA" stopOpacity="0"></stop>
              <stop stopColor="#A78BFA"></stop>
              <stop offset="32.5%" stopColor="#EC4899"></stop>
              <stop offset="100%" stopColor="#F472B6" stopOpacity="0"></stop>
            </motion.linearGradient>
          ))}
        </defs>
      </svg>
    </div>
  );
};
