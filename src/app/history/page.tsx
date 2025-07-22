'use client';

import styled from 'styled-components';
import { useEffect, useState } from 'react';
import { GenerationHistory } from '@/types/joke';
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

const HistoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const HistoryCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const HistoryPrompt = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const HistoryMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const CategoryBadge = styled.span`
  background: ${({ theme }) => theme.colors.primary}20;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.25rem 0.75rem;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 0.75rem;
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
`;

const Loading = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export default function HistoryPage() {
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const jokeService = new JokeService(supabase);
    const checkAuthAndLoadHistory = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login?next=/history');
        return;
      }

      try {
        const userHistory = await jokeService.getUserGenerationHistory(user.id, 50);
        setHistory(userHistory);
      } catch (error) {
        console.error('Error loading history:', error);
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndLoadHistory();
  }, [supabase, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <Container>
        <Loading>Loading your history...</Loading>
      </Container>
    );
  }

  return (
    <Container>
      <Title>📜 Generation History</Title>
      <Subtitle>Your recent joke generation activity</Subtitle>
      
      {history.length === 0 ? (
        <EmptyState>
          <EmptyStateTitle>No history yet</EmptyStateTitle>
          <EmptyStateText>
            Start generating jokes to see your history here!
          </EmptyStateText>
        </EmptyState>
      ) : (
        <HistoryGrid>
          {history.map((item) => (
            <HistoryCard key={item.id}>
              <HistoryPrompt>{item.prompt}</HistoryPrompt>
              <HistoryMeta>
                <CategoryBadge>{item.category}</CategoryBadge>
                <ModelBadge>{item.model_used.split('/').pop()}</ModelBadge>
                <span>{formatDate(item.created_at)}</span>
                {item.generation_time_ms && (
                  <span>{(item.generation_time_ms / 1000).toFixed(1)}s</span>
                )}
              </HistoryMeta>
            </HistoryCard>
          ))}
        </HistoryGrid>
      )}
    </Container>
  );
}