'use client';

import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { theme } from '@/styles/theme';
import { ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <StyledThemeProvider theme={theme}>
      {children}
    </StyledThemeProvider>
  );
}