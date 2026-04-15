/**
 * Theme configuration for styled-components
 * Centralized design tokens for the entire app
 */

export const theme = {
  colors: {
    primary: '#3498db',
    primaryDark: '#2980b9',
    primaryLight: '#5dade2',

    success: '#27ae60',
    successLight: '#d4edda',
    successDark: '#1e8449',

    danger: '#e74c3c',
    dangerLight: '#f8d7da',
    dangerDark: '#c0392b',

    warning: '#f39c12',
    warningLight: '#fff3cd',
    warningDark: '#d68910',

    info: '#16a085',
    infoLight: '#d1ecf1',
    infoDark: '#0c5460',

    dark: '#2c3e50',
    darkSecondary: '#34495e',
    light: '#ecf0f1',
    lightBg: '#f8f9fa',
    border: '#bdc3c7',
    borderLight: '#e9ecef',
    text: '#2c3e50',
    textSecondary: '#7f8c8d',
    white: '#ffffff',
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
  },

  // Border radius
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  },

  // Font sizes
  fontSize: {
    sm: '0.85rem',
    base: '1rem',
    lg: '1.1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
  },

  // Font weights
  fontWeight: {
    normal: 400,
    semibold: 600,
    bold: 700,
  },

  // Shadows
  shadow: {
    sm: '0 1px 3px rgba(0, 0, 0, 0.1)',
    md: '0 2px 4px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },

  // Transitions
  transition: {
    fast: '0.2s',
    base: '0.3s',
    slow: '0.5s',
  },

  // Z-index
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
  },

  // Breakpoints
  breakpoints: {
    mobile: '640px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1400px',
  },
};

export type ThemeType = typeof theme;
