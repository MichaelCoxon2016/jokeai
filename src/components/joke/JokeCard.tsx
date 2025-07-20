'use client';

import styled from 'styled-components';
import { Joke } from '@/types/joke';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { JokeService } from '@/lib/services/joke-service';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';
import { User } from '@supabase/supabase-js';

interface JokeCardProps {
  joke: Joke;
  onRatingChange?: (jokeId: string, newRating: number) => void;
  onFavoriteChange?: (jokeId: string, isFavorited: boolean) => void;
  showActions?: boolean;
}

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const JokeContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  white-space: pre-wrap;
`;

const JokeMetadata = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const Category = styled.span`
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.875rem;
  font-weight: 500;
`;

const ModelBadge = styled.span`
  background: ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
  font-family: ${({ theme }) => theme.fonts.mono};
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const RatingSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StarRating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const Star = styled.button.withConfig({
  shouldForwardProp: (prop) => !['filled', 'hover'].includes(prop)
})<{ filled: boolean; hover: boolean }>`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ filled, hover, theme }) => 
    filled || hover ? theme.colors.warning : theme.colors.textMuted};
  font-size: 1.25rem;
  transition: ${({ theme }) => theme.transitions.fast};
  padding: 0.25rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }
`;

const RatingText = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const FavoriteButton = styled(Button).withConfig({
  shouldForwardProp: (prop) => !['isFavorited'].includes(prop)
})<{ isFavorited: boolean }>`
  color: ${({ isFavorited, theme }) => 
    isFavorited ? theme.colors.secondary : theme.colors.textMuted};
`;

export function JokeCard({ 
  joke, 
  onRatingChange, 
  onFavoriteChange, 
  showActions = true 
}: JokeCardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRating, setUserRating] = useState(joke.user_rating || 0);
  const [isFavorited, setIsFavorited] = useState(joke.is_favorited || false);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const jokeService = new JokeService();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase.auth]);

  const handleRating = async (rating: number) => {
    if (!user || loading) return;

    setLoading(true);
    try {
      await jokeService.rateJoke(joke.id, user.id, rating);
      setUserRating(rating);
      onRatingChange?.(joke.id, rating);
    } catch (error) {
      console.error('Failed to rate joke:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!user || loading) return;

    setLoading(true);
    try {
      const newFavoriteStatus = await jokeService.toggleFavorite(joke.id, user.id);
      setIsFavorited(newFavoriteStatus);
      onFavoriteChange?.(joke.id, newFavoriteStatus);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <JokeContent>{joke.content}</JokeContent>
      
      <JokeMetadata>
        <Category>{joke.category}</Category>
        {joke.model_used && <ModelBadge>{joke.model_used}</ModelBadge>}
        <span style={{ fontSize: '0.875rem', color: '#888' }}>
          {formatDate(joke.created_at)}
        </span>
      </JokeMetadata>

      {showActions && (
        <Actions>
          <RatingSection>
            <StarRating>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  filled={star <= userRating}
                  hover={star <= hoverRating}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  disabled={!user || loading}
                >
                  ⭐
                </Star>
              ))}
            </StarRating>
            {joke.average_rating && (
              <RatingText>
                {joke.average_rating.toFixed(1)} ({joke.total_ratings} ratings)
              </RatingText>
            )}
          </RatingSection>

          {user && (
            <FavoriteButton
              variant="ghost"
              isFavorited={isFavorited}
              onClick={handleFavorite}
              disabled={loading}
            >
              {isFavorited ? '❤️' : '🤍'} {isFavorited ? 'Favorited' : 'Favorite'}
            </FavoriteButton>
          )}
        </Actions>
      )}
    </Card>
  );
}