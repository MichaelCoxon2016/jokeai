'use client';

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { JokeCard } from '@/components/joke/JokeCard';
import { Joke } from '@/types/joke';
import { createClient } from '@/lib/supabase/client';
import { JokeService } from '@/lib/services/joke-service';
import { useRouter } from 'next/navigation';
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

const JokesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const EmptyStateTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 2rem;
`;

const Loading = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Joke[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const jokeService = new JokeService(supabase);
    const checkAuthAndLoadFavorites = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login?next=/favorites');
        return;
      }

      try {
        const favoriteJokes = await jokeService.getUserFavorites(user.id);
        setFavorites(favoriteJokes);
      } catch (error) {
        console.error('Error loading favorites:', error);
        toast.error('Failed to load favorites');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadFavorites();
  }, [supabase, router]);

  const handleRatingChange = (jokeId: string, newRating: number) => {
    setFavorites(favorites.map(joke => 
      joke.id === jokeId ? { ...joke, user_rating: newRating } : joke
    ));
  };

  const handleFavoriteChange = (jokeId: string, isFavorited: boolean) => {
    if (!isFavorited) {
      setFavorites(favorites.filter(joke => joke.id !== jokeId));
      toast.success('Removed from favorites');
    }
  };

  if (loading) {
    return (
      <Container>
        <Loading>Loading your favorites...</Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Title>❤️ Your Favorites</Title>
      <Subtitle>All the jokes you&apos;ve loved</Subtitle>
      
      {favorites.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No favorites yet</EmptyStateTitle>
          <EmptyStateText>
            Start generating jokes and click the heart icon to save your favorites!
          </EmptyStateText>
        </EmptyState>
      ) : (
        <JokesGrid>
          {favorites.map((joke) => (
            <JokeCard
              key={joke.id}
              joke={joke}
              onRatingChange={handleRatingChange}
              onFavoriteChange={handleFavoriteChange}
            />
          ))}
        </JokesGrid>
      )}
    </Container>
  );
}