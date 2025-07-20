'use client';

import { Toaster } from 'react-hot-toast';
import { theme } from '@/styles/theme';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: theme.colors.surface,
          color: theme.colors.text,
          border: `1px solid ${theme.colors.border}`,
          borderRadius: theme.borderRadius.md,
          fontSize: '0.875rem',
        },
        success: {
          iconTheme: {
            primary: theme.colors.success,
            secondary: theme.colors.surface,
          },
        },
        error: {
          iconTheme: {
            primary: theme.colors.error,
            secondary: theme.colors.surface,
          },
        },
      }}
    />
  );
}