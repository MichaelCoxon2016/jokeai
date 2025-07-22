import { Theme } from './theme';

export const lightTheme: Theme = {
  colors: {
    primary: '#0066ff',
    secondary: '#ff0088',
    background: '#ffffff',
    surface: '#f5f5f5',
    surfaceHover: '#eeeeee',
    text: '#1a1a1a',
    textSecondary: '#666666',
    textMuted: '#999999',
    border: '#dddddd',
    error: '#ff3333',
    success: '#00cc66',
    warning: '#ffaa00',
    info: '#00aaff',
  },
  fonts: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: 'Consolas, Monaco, "Courier New", monospace',
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    neon: '0 0 20px rgba(0, 102, 255, 0.3)',
    neonPink: '0 0 20px rgba(255, 0, 136, 0.3)',
    neonRainbow: '0 0 20px rgba(255, 0, 136, 0.4), 0 0 40px rgba(0, 255, 136, 0.3), 0 0 60px rgba(136, 0, 255, 0.2)',
  },
  animations: {
    rainbowPulse: `
      @keyframes rainbowPulse {
        0% { 
          color: #0066ff; 
          text-shadow: 0 0 10px #0066ff, 0 0 20px #0066ff;
        }
        50% { 
          color: #ff0088; 
          text-shadow: 0 0 10px #ff0088, 0 0 20px #ff0088;
        }
        100% { 
          color: #0066ff; 
          text-shadow: 0 0 10px #0066ff, 0 0 20px #0066ff;
        }
      }
    `,
    rainbowGlow: `
      @keyframes rainbowGlow {
        0%, 100% { 
          box-shadow: 0 0 20px rgba(0, 102, 255, 0.5);
        }
        50% { 
          box-shadow: 0 0 20px rgba(255, 0, 136, 0.5);
        }
      }
    `,
    spinningStar: `
      @keyframes spinningStar {
        0% { 
          transform: rotate(0deg);
          filter: drop-shadow(0 0 10px #0066ff);
        }
        100% { 
          transform: rotate(360deg);
          filter: drop-shadow(0 0 10px #0066ff);
        }
      }
    `,
  },
  transitions: {
    fast: '0.15s ease-in-out',
    normal: '0.3s ease-in-out',
    slow: '0.5s ease-in-out',
  },
  breakpoints: {
    xs: '480px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    xxl: '1536px',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};