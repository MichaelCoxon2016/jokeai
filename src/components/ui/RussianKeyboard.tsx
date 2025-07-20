'use client';

import styled from 'styled-components';
import { useState, useRef, useEffect } from 'react';

interface RussianKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
  isVisible: boolean;
}

const KeyboardContainer = styled.div<{ isVisible: boolean }>`
  position: relative;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
  max-width: 100%;
  overflow-x: auto;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const KeyboardLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const KeyRow = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
  }
`;

const Key = styled.button<{ isSpecial?: boolean; isWide?: boolean }>`
  padding: 0.75rem 1rem;
  background: ${({ theme, isSpecial }) => 
    isSpecial ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, isSpecial }) => 
    isSpecial ? theme.colors.background : theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  min-width: ${({ isWide }) => (isWide ? '4rem' : '2.5rem')};
  
  &:hover {
    background: ${({ theme, isSpecial }) => 
      isSpecial ? `${theme.colors.primary}dd` : theme.colors.surfaceHover};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.sm};
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.5rem;
    font-size: 0.875rem;
    min-width: ${({ isWide }) => (isWide ? '3rem' : '2rem')};
  }
`;

const KeyboardTitle = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  text-align: center;
`;

export function RussianKeyboard({ onKeyPress, onBackspace, onSpace, isVisible }: RussianKeyboardProps) {
  const keyboardLayout = [
    ['й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ'],
    ['ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э'],
    ['я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю'],
  ];

  return (
    <KeyboardContainer isVisible={isVisible}>
      <KeyboardTitle>Русская клавиатура</KeyboardTitle>
      <KeyboardLayout>
        {keyboardLayout.map((row, rowIndex) => (
          <KeyRow key={rowIndex}>
            {row.map((letter) => (
              <Key
                key={letter}
                type="button"
                onClick={() => onKeyPress(letter)}
              >
                {letter}
              </Key>
            ))}
          </KeyRow>
        ))}
        <KeyRow>
          <Key
            type="button"
            isSpecial
            isWide
            onClick={onBackspace}
          >
            ⌫
          </Key>
          <Key
            type="button"
            isSpecial
            isWide
            onClick={onSpace}
            style={{ minWidth: '8rem' }}
          >
            Пробел
          </Key>
          <Key
            type="button"
            isSpecial
            onClick={() => onKeyPress('.')}
          >
            .
          </Key>
          <Key
            type="button"
            isSpecial
            onClick={() => onKeyPress(',')}
          >
            ,
          </Key>
        </KeyRow>
      </KeyboardLayout>
    </KeyboardContainer>
  );
}