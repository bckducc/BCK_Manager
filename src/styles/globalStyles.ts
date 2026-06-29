import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body,
  #root {
    width: 100%;
    height: 100%;
    min-width: 0;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: ${theme.colors.text};
    background-color: ${theme.colors.white};
    overflow-x: hidden;
    overscroll-behavior-y: none;
    -webkit-tap-highlight-color: transparent;
  }

  img,
  video,
  canvas,
  svg {
    max-width: 100%;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    cursor: pointer;
    touch-action: manipulation;
  }

  input,
  select,
  textarea {
    font-family: inherit;
    max-width: 100%;
  }

  @media (max-width: ${theme.breakpoints.mobile}) {
    body {
      font-size: 14px;
    }

    input,
    select,
    textarea {
      font-size: 16px;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${theme.colors.lightBg};
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.border};
    border-radius: ${theme.radius.sm};

    &:hover {
      background: ${theme.colors.textSecondary};
    }
  }
`;
