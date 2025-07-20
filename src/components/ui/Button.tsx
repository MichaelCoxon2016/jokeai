'use client';

import styled from 'styled-components';
import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: ReactNode;
}

const StyledButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['variant', 'size', 'fullWidth', 'loading'].includes(prop)
})<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  position: relative;
  overflow: hidden;
  font-family: ${({ theme }) => theme.fonts.primary};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  ${({ size = 'md' }) => {
    switch (size) {
      case 'sm':
        return `
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          height: 2rem;
        `;
      case 'lg':
        return `
          padding: 0.75rem 1.5rem;
          font-size: 1.125rem;
          height: 3rem;
        `;
      default:
        return `
          padding: 0.625rem 1.25rem;
          font-size: 1rem;
          height: 2.5rem;
        `;
    }
  }}

  ${({ variant = 'primary', theme }) => {
    switch (variant) {
      case 'secondary':
        return `
          background: ${theme.colors.secondary};
          color: ${theme.colors.text};
          box-shadow: ${theme.shadows.neonPink};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.secondary}dd;
            box-shadow: ${theme.shadows.neonPink}, 0 0 30px rgba(255, 0, 136, 0.4);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: ${theme.colors.primary};
          border: 2px solid ${theme.colors.primary};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary}20;
            box-shadow: ${theme.shadows.neon};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.textSecondary};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.surfaceHover};
            color: ${theme.colors.text};
          }
        `;
      default:
        return `
          background: ${theme.colors.primary};
          color: ${theme.colors.background};
          box-shadow: ${theme.shadows.neon};
          animation: rainbowGlow 4s ease-in-out infinite;
          
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
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary}dd;
            animation-duration: 2s;
          }
        `;
    }
  }}

  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
`;

const LoadingSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export function Button({
  children,
  loading = false,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <StyledButton disabled={disabled || loading} {...props}>
      {loading && <LoadingSpinner />}
      {children}
    </StyledButton>
  );
}