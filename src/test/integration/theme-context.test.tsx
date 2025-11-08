import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext';
import { THEME_CONFIGS } from '@/types/theme';

// Test component that uses the theme context
function ThemeConsumer() {
  const { theme, config, setTheme } = useTheme();

  return (
    <div>
      <div data-testid="current-theme">{theme}</div>
      <div data-testid="theme-name">{config.name}</div>
      <div data-testid="gradients-enabled">
        {config.effects.gradients.toString()}
      </div>
      <button onClick={() => setTheme('default')}>Switch to Default</button>
      <button onClick={() => setTheme('custom')}>Switch to Custom</button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    // Clean up
    localStorage.clear();
  });

  it('should provide default custom theme', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
    });

    expect(screen.getByTestId('theme-name')).toHaveTextContent(
      'CampusPaws Custom'
    );
    expect(screen.getByTestId('gradients-enabled')).toHaveTextContent('true');
  });

  it('should load theme from localStorage', async () => {
    localStorage.setItem('campuspaws-theme', 'default');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('default');
    });

    expect(screen.getByTestId('theme-name')).toHaveTextContent('Clean Default');
    expect(screen.getByTestId('gradients-enabled')).toHaveTextContent('false');
  });

  it('should persist theme changes to localStorage', async () => {
    const { rerender } = render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
    });

    // Switch to default theme
    const defaultButton = screen.getByText('Switch to Default');
    defaultButton.click();

    await waitFor(() => {
      expect(localStorage.getItem('campuspaws-theme')).toBe('default');
    });

    expect(screen.getByTestId('current-theme')).toHaveTextContent('default');
  });

  it('should provide correct theme config', async () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('custom');
    });

    const customConfig = THEME_CONFIGS.custom;
    expect(screen.getByTestId('theme-name')).toHaveTextContent(
      customConfig.name
    );
    expect(screen.getByTestId('gradients-enabled')).toHaveTextContent(
      customConfig.effects.gradients.toString()
    );
  });

  it('should throw error when useTheme is used outside provider', () => {
    // Suppress console.error for this test
    const originalError = console.error;
    console.error = () => {};

    expect(() => {
      render(<ThemeConsumer />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    console.error = originalError;
  });
});
