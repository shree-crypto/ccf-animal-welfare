import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { ThemeSwitcher } from '@/components/features/theme/ThemeSwitcher';

// Test component that displays theme state
function ThemeDisplay() {
  const { theme, config } = useTheme();

  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="theme-name">{config.name}</div>
      <div data-testid="gradients-enabled">
        {config.effects.gradients.toString()}
      </div>
      <div data-testid="animations-enabled">
        {config.effects.animations.toString()}
      </div>
      <div data-testid="aceternity-enabled">
        {config.effects.aceternity.toString()}
      </div>
    </div>
  );
}

describe('Theme Switching - Comprehensive Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('Persistence across page reloads', () => {
    it('should persist custom theme selection', async () => {
      const { unmount } = render(
        <ThemeProvider>
          <ThemeDisplay />
          <ThemeSwitcher />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
      });

      // Verify localStorage
      expect(localStorage.getItem('campuspaws-theme')).toBe('custom');

      // Unmount to simulate page unload
      unmount();

      // Remount to simulate page reload
      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
      });
    });

    it('should persist default theme selection', async () => {
      // Set default theme in localStorage
      localStorage.setItem('campuspaws-theme', 'default');

      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent(
          'default'
        );
      });

      expect(screen.getByTestId('theme-name')).toHaveTextContent(
        'Clean Default'
      );
      expect(screen.getByTestId('gradients-enabled')).toHaveTextContent(
        'false'
      );
    });

    it('should handle invalid localStorage values gracefully', async () => {
      localStorage.setItem('campuspaws-theme', 'invalid-theme');

      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      await waitFor(() => {
        // Should fall back to default custom theme
        expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
      });
    });
  });

  describe('Theme switching functionality', () => {
    it('should switch from custom to default theme', async () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="current-theme">{theme}</div>
            <button onClick={() => setTheme('default')}>
              Switch to Default
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
      });

      fireEvent.click(screen.getByText('Switch to Default'));

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent(
          'default'
        );
      });

      expect(localStorage.getItem('campuspaws-theme')).toBe('default');
    });

    it('should switch from default to custom theme', async () => {
      localStorage.setItem('campuspaws-theme', 'default');

      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="current-theme">{theme}</div>
            <button onClick={() => setTheme('custom')}>Switch to Custom</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent(
          'default'
        );
      });

      fireEvent.click(screen.getByText('Switch to Custom'));

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
      });

      expect(localStorage.getItem('campuspaws-theme')).toBe('custom');
    });

    it('should apply data-theme attribute to document root', async () => {
      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe(
          'custom'
        );
      });
    });

    it('should update data-theme attribute when theme changes', async () => {
      const TestComponent = () => {
        const { setTheme } = useTheme();
        return (
          <button onClick={() => setTheme('default')}>Switch to Default</button>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe(
          'custom'
        );
      });

      fireEvent.click(screen.getByText('Switch to Default'));

      await waitFor(() => {
        expect(document.documentElement.getAttribute('data-theme')).toBe(
          'default'
        );
      });
    });
  });

  describe('Theme configuration', () => {
    it('should provide correct custom theme config', async () => {
      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('theme-name')).toHaveTextContent(
          'CampusPaws Custom'
        );
        expect(screen.getByTestId('gradients-enabled')).toHaveTextContent(
          'true'
        );
        expect(screen.getByTestId('animations-enabled')).toHaveTextContent(
          'true'
        );
        expect(screen.getByTestId('aceternity-enabled')).toHaveTextContent(
          'true'
        );
      });
    });

    it('should provide correct default theme config', async () => {
      localStorage.setItem('campuspaws-theme', 'default');

      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('theme-name')).toHaveTextContent(
          'Clean Default'
        );
        expect(screen.getByTestId('gradients-enabled')).toHaveTextContent(
          'false'
        );
        expect(screen.getByTestId('animations-enabled')).toHaveTextContent(
          'false'
        );
        expect(screen.getByTestId('aceternity-enabled')).toHaveTextContent(
          'false'
        );
      });
    });
  });

  describe('Dark mode compatibility', () => {
    it('should work with dark mode class on document', async () => {
      document.documentElement.classList.add('dark');

      render(
        <ThemeProvider>
          <ThemeDisplay />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
      });

      // Both dark class and data-theme should coexist
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(document.documentElement.getAttribute('data-theme')).toBe(
        'custom'
      );

      document.documentElement.classList.remove('dark');
    });

    it('should maintain theme when dark mode is toggled', async () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return (
          <div>
            <div data-testid="current-theme">{theme}</div>
            <button
              onClick={() => document.documentElement.classList.toggle('dark')}
            >
              Toggle Dark Mode
            </button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
      });

      fireEvent.click(screen.getByText('Toggle Dark Mode'));

      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
      });

      document.documentElement.classList.remove('dark');
    });
  });

  describe('Multiple theme switches', () => {
    it('should handle rapid theme switching', async () => {
      const TestComponent = () => {
        const { theme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="current-theme">{theme}</div>
            <button onClick={() => setTheme('default')}>Default</button>
            <button onClick={() => setTheme('custom')}>Custom</button>
          </div>
        );
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
      });

      // Rapid switching
      fireEvent.click(screen.getByText('Default'));
      fireEvent.click(screen.getByText('Custom'));
      fireEvent.click(screen.getByText('Default'));
      fireEvent.click(screen.getByText('Custom'));

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
      });

      expect(localStorage.getItem('campuspaws-theme')).toBe('custom');
    });
  });

  describe('Performance and optimization', () => {
    it('should not cause unnecessary re-renders', async () => {
      let renderCount = 0;

      const TestComponent = () => {
        const { theme } = useTheme();
        renderCount++;
        return <div data-testid="current-theme">{theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
      });

      const initialRenderCount = renderCount;

      // Wait a bit to ensure no additional renders
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(renderCount).toBe(initialRenderCount);
    });
  });
});
