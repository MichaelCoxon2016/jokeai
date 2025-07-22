'use client';

import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ReactNode, useEffect } from 'react';
import { theme as darkTheme } from '@/styles/theme';
import { lightTheme } from '@/styles/lightTheme';
import { createGlobalStyle } from 'styled-components';
import { useSettingsStore } from '@/store/useSettingsStore';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.primary};
    line-height: 1.6;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }
`;

const fontMap = {
  default: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  comic: '"Comic Sans MS", "Comic Sans", cursive',
  elegant: 'Georgia, "Times New Roman", serif',
  modern: 'Helvetica, Arial, sans-serif'
};

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { theme: themeMode, fontStyle } = useSettingsStore();
  
  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;
  const themedTheme = {
    ...currentTheme,
    fonts: {
      ...currentTheme.fonts,
      primary: fontMap[fontStyle] || fontMap.default,
    }
  };

  useEffect(() => {
    // Apply theme class to body for global styles
    document.body.className = themeMode;
  }, [themeMode]);

  return (
    <StyledThemeProvider theme={themedTheme}>
      <GlobalStyles />
      {children}
    </StyledThemeProvider>
  );
}