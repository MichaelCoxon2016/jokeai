export const theme = {
  colors: {
    primary: '#00ff88',
    secondary: '#ff0088',
    background: '#0a0a0a',
    surface: '#1a1a1a',
    surfaceHover: '#2a2a2a',
    text: '#ffffff',
    textSecondary: '#cccccc',
    textMuted: '#888888',
    border: '#333333',
    error: '#ff4444',
    success: '#00ff88',
    warning: '#ffaa00',
    info: '#0088ff',
  },
  fonts: {
    primary: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    mono: 'JetBrains Mono, Monaco, monospace',
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
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    neon: '0 0 20px rgba(0, 255, 136, 0.3)',
    neonPink: '0 0 20px rgba(255, 0, 136, 0.3)',
    neonRainbow: '0 0 20px rgba(255, 0, 136, 0.4), 0 0 40px rgba(0, 255, 136, 0.3), 0 0 60px rgba(136, 0, 255, 0.2)',
  },
  animations: {
    rainbowPulse: `
      @keyframes rainbowPulse {
        0% { 
          color: #ff0088; 
          text-shadow: 0 0 10px #ff0088, 0 0 20px #ff0088, 0 0 30px #ff0088;
        }
        16.66% { 
          color: #ff4400; 
          text-shadow: 0 0 10px #ff4400, 0 0 20px #ff4400, 0 0 30px #ff4400;
        }
        33.33% { 
          color: #ffaa00; 
          text-shadow: 0 0 10px #ffaa00, 0 0 20px #ffaa00, 0 0 30px #ffaa00;
        }
        50% { 
          color: #00ff88; 
          text-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88;
        }
        66.66% { 
          color: #0088ff; 
          text-shadow: 0 0 10px #0088ff, 0 0 20px #0088ff, 0 0 30px #0088ff;
        }
        83.33% { 
          color: #8800ff; 
          text-shadow: 0 0 10px #8800ff, 0 0 20px #8800ff, 0 0 30px #8800ff;
        }
        100% { 
          color: #ff0088; 
          text-shadow: 0 0 10px #ff0088, 0 0 20px #ff0088, 0 0 30px #ff0088;
        }
      }
    `,
    rainbowGlow: `
      @keyframes rainbowGlow {
        0% { 
          box-shadow: 0 0 20px rgba(255, 0, 136, 0.6), 0 0 40px rgba(255, 0, 136, 0.4);
        }
        16.66% { 
          box-shadow: 0 0 20px rgba(255, 68, 0, 0.6), 0 0 40px rgba(255, 68, 0, 0.4);
        }
        33.33% { 
          box-shadow: 0 0 20px rgba(255, 170, 0, 0.6), 0 0 40px rgba(255, 170, 0, 0.4);
        }
        50% { 
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.6), 0 0 40px rgba(0, 255, 136, 0.4);
        }
        66.66% { 
          box-shadow: 0 0 20px rgba(0, 136, 255, 0.6), 0 0 40px rgba(0, 136, 255, 0.4);
        }
        83.33% { 
          box-shadow: 0 0 20px rgba(136, 0, 255, 0.6), 0 0 40px rgba(136, 0, 255, 0.4);
        }
        100% { 
          box-shadow: 0 0 20px rgba(255, 0, 136, 0.6), 0 0 40px rgba(255, 0, 136, 0.4);
        }
      }
    `,
    spinningStar: `
      @keyframes spinningStar {
        0% { 
          transform: rotate(0deg);
          filter: drop-shadow(0 0 10px #ff0088);
        }
        16.66% { 
          filter: drop-shadow(0 0 10px #ff4400);
        }
        33.33% { 
          filter: drop-shadow(0 0 10px #ffaa00);
        }
        50% { 
          filter: drop-shadow(0 0 10px #00ff88);
        }
        66.66% { 
          filter: drop-shadow(0 0 10px #0088ff);
        }
        83.33% { 
          filter: drop-shadow(0 0 10px #8800ff);
        }
        100% { 
          transform: rotate(360deg);
          filter: drop-shadow(0 0 10px #ff0088);
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
}

export type Theme = typeof theme