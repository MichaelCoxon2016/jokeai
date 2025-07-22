'use client';

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { JokeCard } from '@/components/joke/JokeCard';
import { Joke } from '@/types/joke';
import { createClient } from '@/lib/supabase/client';
import { JokeService } from '@/lib/services/joke-service';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: center;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const JokesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LoadMoreButton = styled.button`
  display: block;
  margin: 2rem auto;
  padding: 0.75rem 2rem;
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.background};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.primary}dd;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Loading = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const JOKES_PER_PAGE = 12;

export default function LibraryPage() {
  const [jokes, setJokes] = useState<Joke[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const supabase = createClient();
  const jokeService = new JokeService(supabase);

  useEffect(() => {
    loadJokes(true);
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  const loadCategories = async () => {
    try {
      const allCategories = await jokeService.getCategories();
      setCategories(['all', ...allCategories.map(cat => cat.name)]);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadJokes = async (reset = false) => {
    try {
      setLoading(reset);
      setLoadingMore(!reset);

      const newOffset = reset ? 0 : offset;
      const options = {
        category: selectedCategory === 'all' ? undefined : selectedCategory,
        limit: JOKES_PER_PAGE,
        offset: newOffset,
        includeRatings: true,
      };

      const newJokes = await jokeService.getJokes(options);
      
      if (reset) {
        setJokes(newJokes);
      } else {
        setJokes([...jokes, ...newJokes]);
      }
      
      setOffset(newOffset + JOKES_PER_PAGE);
      setHasMore(newJokes.length === JOKES_PER_PAGE);
    } catch (error) {
      console.error('Error loading jokes:', error);
      toast.error('Failed to load jokes');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleRatingChange = (jokeId: string, newRating: number) => {
    setJokes(jokes.map(joke => 
      joke.id === jokeId ? { ...joke, user_rating: newRating } : joke
    ));
  };

  const handleFavoriteChange = (jokeId: string, isFavorited: boolean) => {
    setJokes(jokes.map(joke => 
      joke.id === jokeId ? { ...joke, is_favorited: isFavorited } : joke
    ));
  };

  if (loading) {
    return (
      <Container>
        <Loading>Loading joke library...</Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Title>📚 Joke Library</Title>
      <Subtitle>Browse all jokes from our community</Subtitle>
      
      <FilterBar>
        <label>Category:</label>
        <FilterSelect 
          value={selectedCategory} 
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
            </option>
          ))}
        </FilterSelect>
      </FilterBar>
      
      <JokesGrid>
        {jokes.map((joke) => (
          <JokeCard
            key={joke.id}
            joke={joke}
            onRatingChange={handleRatingChange}
            onFavoriteChange={handleFavoriteChange}
          />
        ))}
      </JokesGrid>
      
      {hasMore && (
        <LoadMoreButton 
          onClick={() => loadJokes(false)} 
          disabled={loadingMore}
        >
          {loadingMore ? 'Loading...' : 'Load More'}
        </LoadMoreButton>
      )}
    </Container>
  );
}