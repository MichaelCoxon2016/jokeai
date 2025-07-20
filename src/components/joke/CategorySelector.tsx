'use client';

import styled from 'styled-components';
import { JokeCategory } from '@/types/joke';
import { useEffect, useState } from 'react';
import { JokeService } from '@/lib/services/joke-service';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  language?: 'en' | 'ru';
}

const Container = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
`;

const CategoryButton = styled.button<{ selected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border: 2px solid ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ selected, theme }) => 
    selected ? `${theme.colors.primary}20` : theme.colors.surface};
  color: ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.text};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  text-align: center;

  &:hover {
    background: ${({ selected, theme }) => 
      selected ? `${theme.colors.primary}30` : theme.colors.surfaceHover};
    border-color: ${({ selected, theme }) => 
      selected ? theme.colors.primary : theme.colors.primary}80;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}30;
  }
`;

const CategoryName = styled.span`
  flex: 1;
  text-transform: capitalize;
`;

const LoadingText = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.875rem;
  text-align: center;
  padding: 1rem;
`;

export function CategorySelector({ selectedCategory, onCategoryChange, language = 'en' }: CategorySelectorProps) {
  const [categories, setCategories] = useState<JokeCategory[]>([]);
  const [loading, setLoading] = useState(true);

  const getCategoryDisplayName = (categoryName: string): string => {
    const translations: Record<string, Record<string, string>> = {
      'general': { 'en': 'general', 'ru': 'общие' },
      'dad-jokes': { 'en': 'dad jokes', 'ru': 'папины анекдоты' },
      'programming': { 'en': 'programming', 'ru': 'программирование' },
      'animals': { 'en': 'animals', 'ru': 'животные' },
      'food': { 'en': 'food', 'ru': 'еда' },
      'workplace': { 'en': 'workplace', 'ru': 'работа' },
      'clean': { 'en': 'clean', 'ru': 'чистые' },
      'one-liners': { 'en': 'one-liners', 'ru': 'короткие' },
      'riddles': { 'en': 'riddles', 'ru': 'загадки' },
      'seasonal': { 'en': 'seasonal', 'ru': 'сезонные' },
    };
    
    return translations[categoryName]?.[language] || categoryName.replace('-', ' ');
  };

  useEffect(() => {
    const jokeService = new JokeService();
    
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await jokeService.getCategories();
        // Remove any potential duplicates by lowercase name
        const uniqueCategories = fetchedCategories.filter((category, index, self) =>
          index === self.findIndex((c) => c.name.toLowerCase() === category.name.toLowerCase())
        );
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <Container>
        <Label>{language === 'en' ? 'Category' : 'Категория'}</Label>
        <LoadingText>{language === 'en' ? 'Loading categories...' : 'Загрузка категорий...'}</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <Label>{language === 'en' ? 'Choose a category' : 'Выберите категорию'}</Label>
      <CategoryGrid>
        {categories.map((category) => (
          <CategoryButton
            key={category.id}
            selected={selectedCategory === category.name}
            onClick={() => onCategoryChange(category.name)}
          >
            <CategoryName>{getCategoryDisplayName(category.name)}</CategoryName>
          </CategoryButton>
        ))}
      </CategoryGrid>
    </Container>
  );
}