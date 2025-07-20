'use client';

import styled from 'styled-components';
import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const InputWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => !['fullWidth'].includes(prop)
})<{ fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input.withConfig({
  shouldForwardProp: (prop) => !['hasLeftIcon', 'hasRightIcon', 'hasError'].includes(prop)
})<{ hasLeftIcon?: boolean; hasRightIcon?: boolean; hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem;
  padding-left: ${({ hasLeftIcon }) => hasLeftIcon ? '2.5rem' : '0.75rem'};
  padding-right: ${({ hasRightIcon }) => hasRightIcon ? '2.5rem' : '0.75rem'};
  background: ${({ theme }) => theme.colors.surface};
  border: 2px solid ${({ theme, hasError }) => hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.primary};
  transition: ${({ theme }) => theme.transitions.fast};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) => hasError ? theme.colors.error : theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme, hasError }) => hasError ? `${theme.colors.error}20` : `${theme.colors.primary}20`};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const IconContainer = styled.div<{ position: 'left' | 'right' }>`
  position: absolute;
  ${({ position }) => position}: 0.75rem;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textMuted};
  pointer-events: none;
`;

const HelperText = styled.p.withConfig({
  shouldForwardProp: (prop) => !['isError'].includes(prop)
})<{ isError?: boolean }>`
  font-size: 0.75rem;
  color: ${({ theme, isError }) => isError ? theme.colors.error : theme.colors.textMuted};
  margin: 0;
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, fullWidth, ...props }, ref) => {
    return (
      <InputWrapper fullWidth={fullWidth}>
        {label && <Label>{label}</Label>}
        <InputContainer>
          {leftIcon && <IconContainer position="left">{leftIcon}</IconContainer>}
          <StyledInput
            ref={ref}
            hasLeftIcon={!!leftIcon}
            hasRightIcon={!!rightIcon}
            hasError={!!error}
            {...props}
          />
          {rightIcon && <IconContainer position="right">{rightIcon}</IconContainer>}
        </InputContainer>
        {(error || helperText) && (
          <HelperText isError={!!error}>{error || helperText}</HelperText>
        )}
      </InputWrapper>
    );
  }
);

Input.displayName = 'Input';