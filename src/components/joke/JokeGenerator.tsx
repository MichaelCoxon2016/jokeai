'use client';

import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CategorySelector } from './CategorySelector';
import { JokeCard } from './JokeCard';
import { RussianKeyboard } from '@/components/ui/RussianKeyboard';
import { Joke } from '@/types/joke';
import { createClient } from '@/lib/supabase/client';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: 0.5rem;
  animation: rainbowPulse 3s ease-in-out infinite;
  
  @keyframes rainbowPulse {
    0% { 
      color: #ff0088; 
      text-shadow: 0 0 10px #ff0088, 0 0 20px #ff0088, 0 0 30px #ff0088;
    }
    16.66% { 
      color: #ff4400; 
      text-shadow: 0 0 10px #ff4400, 0 0 20px #ff4400, 0 0 30px #ff4400;
    }
    33.33% { 
      color: #ffaa00; 
      text-shadow: 0 0 10px #ffaa00, 0 0 20px #ffaa00, 0 0 30px #ffaa00;
    }
    50% { 
      color: #00ff88; 
      text-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 30px #00ff88;
    }
    66.66% { 
      color: #0088ff; 
      text-shadow: 0 0 10px #0088ff, 0 0 20px #0088ff, 0 0 30px #0088ff;
    }
    83.33% { 
      color: #8800ff; 
      text-shadow: 0 0 10px #8800ff, 0 0 20px #8800ff, 0 0 30px #8800ff;
    }
    100% { 
      color: #ff0088; 
      text-shadow: 0 0 10px #ff0088, 0 0 20px #ff0088, 0 0 30px #ff0088;
    }
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 2rem;
`;

const GeneratorForm = styled.form`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  margin-bottom: 2rem;
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const GenerateButton = styled(Button)`
  width: 100%;
  font-size: 1.1rem;
  font-weight: 600;
`;

const ResultsSection = styled.div`
  margin-top: 2rem;
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.error}20;
  color: ${({ theme }) => theme.colors.error};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-bottom: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.error}40;
`;


const AuthPrompt = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
`;

const LanguageToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const LanguageButton = styled.button.withConfig({
  shouldForwardProp: (prop) => prop !== 'active'
})<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ active, theme }) => 
    active ? `${theme.colors.primary}20` : theme.colors.surface};
  color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.text};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ active, theme }) => 
      active ? `${theme.colors.primary}30` : theme.colors.surfaceHover};
    border-color: ${({ theme }) => theme.colors.primary}80;
  }
`;

const LanguageLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
`;

export function JokeGenerator() {
  const [user, setUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('general');
  const [customPrompt, setCustomPrompt] = useState('');
  const [language, setLanguage] = useState<'en' | 'ru'>('en');
  const [generatedJoke, setGeneratedJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRussianKeyboard, setShowRussianKeyboard] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    setShowRussianKeyboard(language === 'ru');
  }, [language]);

  const handleKeyPress = (key: string) => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;
      const newValue = customPrompt.slice(0, start) + key + customPrompt.slice(end);
      setCustomPrompt(newValue);
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = inputRef.current.selectionEnd = start + 1;
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const handleBackspace = () => {
    if (inputRef.current) {
      const start = inputRef.current.selectionStart || 0;
      const end = inputRef.current.selectionEnd || 0;
      if (start === end && start > 0) {
        const newValue = customPrompt.slice(0, start - 1) + customPrompt.slice(end);
        setCustomPrompt(newValue);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.selectionStart = inputRef.current.selectionEnd = start - 1;
            inputRef.current.focus();
          }
        }, 0);
      } else if (start !== end) {
        const newValue = customPrompt.slice(0, start) + customPrompt.slice(end);
        setCustomPrompt(newValue);
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.selectionStart = inputRef.current.selectionEnd = start;
            inputRef.current.focus();
          }
        }, 0);
      }
    }
  };

  const handleSpace = () => {
    handleKeyPress(' ');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please sign in to generate jokes');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/jokes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          prompt: customPrompt.trim() || undefined,
          model: 'google/gemini-2.5-flash-lite-preview-06-17',
          creativity: 0.7,
          language: language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate joke');
      }

      const data = await response.json();
      setGeneratedJoke(data.joke);
      toast.success('Joke generated successfully!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate joke';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (jokeId: string, newRating: number) => {
    if (generatedJoke && generatedJoke.id === jokeId) {
      setGeneratedJoke({
        ...generatedJoke,
        user_rating: newRating,
      });
    }
  };

  const handleFavoriteChange = (jokeId: string, isFavorited: boolean) => {
    if (generatedJoke && generatedJoke.id === jokeId) {
      setGeneratedJoke({
        ...generatedJoke,
        is_favorited: isFavorited,
      });
    }
  };

  if (!user) {
    return (
      <Container>
        <Title>🎭 AI Joke Generator</Title>
        <Subtitle>Get personalized jokes powered by AI</Subtitle>
        
        <AuthPrompt>
          <h3 style={{ marginBottom: '1rem', color: '#fff' }}>
            Sign in to start generating jokes
          </h3>
          <p style={{ marginBottom: '1.5rem', color: '#ccc' }}>
            Create an account to generate unlimited jokes, save favorites, and track your history.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button onClick={() => window.location.href = '/auth/login'}>
              Sign In
            </Button>
            <Button variant="outline" onClick={() => window.location.href = '/auth/signup'}>
              Sign Up
            </Button>
          </div>
        </AuthPrompt>
      </Container>
    );
  }

  return (
    <Container>
      <Title>🎭 AI Joke Generator</Title>
      <Subtitle>Get personalized jokes powered by AI</Subtitle>
      
      <GeneratorForm onSubmit={handleSubmit}>
        <FormSection>
          <LanguageToggle>
            <LanguageLabel>Language:</LanguageLabel>
            <LanguageButton 
              type="button"
              active={language === 'en'} 
              onClick={() => setLanguage('en')}
            >
              🇬🇧 English
            </LanguageButton>
            <LanguageButton 
              type="button"
              active={language === 'ru'} 
              onClick={() => setLanguage('ru')}
            >
              🇷🇺 Русский
            </LanguageButton>
          </LanguageToggle>
        </FormSection>

        <FormSection>
          <CategorySelector 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            language={language}
          />
        </FormSection>

        <FormSection>
          <Input
            ref={inputRef}
            label={language === 'en' ? "Custom prompt (optional)" : "Пользовательский запрос (необязательно)"}
            placeholder={language === 'en' ? 
              "e.g., Tell me a joke about cats wearing hats..." : 
              "например, Расскажи анекдот про котов в шляпах..."
            }
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            helperText={language === 'en' ? 
              "Leave blank for a random joke in the selected category" : 
              "Оставьте пустым для случайного анекдота в выбранной категории"
            }
            fullWidth
          />
        </FormSection>

        <RussianKeyboard
          isVisible={showRussianKeyboard}
          onKeyPress={handleKeyPress}
          onBackspace={handleBackspace}
          onSpace={handleSpace}
        />

        <GenerateButton
          type="submit"
          loading={loading}
          disabled={loading}
        >
          {loading ? 
            (language === 'en' ? 'Generating...' : 'Генерация...') : 
            (language === 'en' ? '🎲 Generate Joke' : '🎲 Создать анекдот')
          }
        </GenerateButton>
      </GeneratorForm>

      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      {generatedJoke && (
        <ResultsSection>
          <JokeCard
            joke={generatedJoke}
            onRatingChange={handleRatingChange}
            onFavoriteChange={handleFavoriteChange}
          />
        </ResultsSection>
      )}
    </Container>
  );
}