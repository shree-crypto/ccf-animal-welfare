import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { SparklesCore } from '@/components/ui/sparkles';
import { ThemeProvider } from '@/contexts/ThemeContext';

describe('Aceternity Components Theme Conditional Rendering', () => {
  it('AnimatedGradient renders in custom theme', () => {
    const { container } = render(
      <ThemeProvider>
        <AnimatedGradient />
      </ThemeProvider>
    );

    // Should render gradient divs in custom theme (default)
    const gradientContainer = container.querySelector(
      '.absolute.inset-0.-z-10'
    );
    expect(gradientContainer).toBeTruthy();
  });

  it('BackgroundBeams renders in custom theme', () => {
    const { container } = render(
      <ThemeProvider>
        <BackgroundBeams />
      </ThemeProvider>
    );

    // Should render SVG in custom theme (default)
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('SparklesCore renders in custom theme', () => {
    const { container } = render(
      <ThemeProvider>
        <SparklesCore density={10} />
      </ThemeProvider>
    );

    // Should render SVG in custom theme (default)
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });
});
