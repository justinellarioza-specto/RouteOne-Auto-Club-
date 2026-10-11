import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, ThemeConfig } from '../types';

export const THEMES: Record<ThemeMode, ThemeConfig> = {
  'circuit-dark': {
    id: 'circuit-dark',
    name: 'Circuit Dark',
    description: 'High-contrast nocturnal circuit aesthetic with carbon black surfaces and racing red accents',
    cssVariables: {
      '--theme-name': 'Circuit Dark',
      '--black': '#050607',
      '--carbon': '#0B0D0E',
      '--surface': '#111415',
      '--surface-light': '#181B1C',
      '--white': '#F4F3EF',
      '--muted': '#85898A',
      '--faint': '#45494A',
      '--border': 'rgba(255, 255, 255, 0.10)',
      '--racing-red': '#D71920',
      '--champagne': '#C9B37E',
      '--silver': '#AEB4B5',
      '--bg-body': '#070809',
      '--bg-container': '#0B0D0E',
      '--bg-surface': '#111415',
      '--bg-surface-elevated': '#151718',
      '--bg-card': '#111314',
      '--text-primary': '#F4F3EF',
      '--text-secondary': '#AEB4B5',
      '--text-muted': '#85898A',
      '--text-faint': '#505251',
      '--border-subtle': 'rgba(255, 255, 255, 0.08)',
      '--border-strong': 'rgba(255, 255, 255, 0.18)',
      '--grid-color': 'rgba(255, 255, 255, 0.015)',
    },
  },
  'garage-light': {
    id: 'garage-light',
    name: 'Garage Light',
    description: 'Crisp atelier showroom aesthetic with studio slate surfaces and high-contrast typography',
    cssVariables: {
      '--theme-name': 'Garage Light',
      '--black': '#F6F7F5',
      '--carbon': '#EBEDE8',
      '--surface': '#FFFFFF',
      '--surface-light': '#E2E5DF',
      '--white': '#101214',
      '--muted': '#565C62',
      '--faint': '#8C9399',
      '--border': 'rgba(16, 18, 20, 0.12)',
      '--racing-red': '#D71920',
      '--champagne': '#9C7D2B',
      '--silver': '#454C52',
      '--bg-body': '#E2E5DF',
      '--bg-container': '#F6F7F5',
      '--bg-surface': '#FFFFFF',
      '--bg-surface-elevated': '#EBEDE8',
      '--bg-card': '#FFFFFF',
      '--text-primary': '#101214',
      '--text-secondary': '#2B3035',
      '--text-muted': '#565C62',
      '--text-faint': '#7F878D',
      '--border-subtle': 'rgba(16, 18, 20, 0.10)',
      '--border-strong': 'rgba(16, 18, 20, 0.22)',
      '--grid-color': 'rgba(0, 0, 0, 0.035)',
    },
  },
};

interface ThemeContextType {
  theme: ThemeMode;
  themeConfig: ThemeConfig;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  isGarageLight: boolean;
  isCircuitDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'routeone_theme_mode';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored === 'garage-light' || stored === 'circuit-dark') {
        return stored;
      }
    }
    return 'garage-light';
  });

  // Apply theme and update CSS variables dynamically
  useEffect(() => {
    const config = THEMES[theme];
    const root = document.documentElement;

    // 1. Update data-theme attribute on root element
    root.setAttribute('data-theme', theme);

    // 2. Dynamically update CSS variables directly on root inline style
    Object.entries(config.cssVariables).forEach(([varName, value]) => {
      root.style.setProperty(varName, String(value));
    });

    // 3. Persist selection to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors in restricted iframe environments
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'circuit-dark' ? 'garage-light' : 'circuit-dark'));
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const themeConfig = THEMES[theme];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeConfig,
        toggleTheme,
        setTheme,
        isGarageLight: theme === 'garage-light',
        isCircuitDark: theme === 'circuit-dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
