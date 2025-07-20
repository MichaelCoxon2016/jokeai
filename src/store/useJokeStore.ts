import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Joke, JokeCategory } from '@/types/joke';

interface JokeState {
  recentJokes: Joke[];
  favoriteJokes: Joke[];
  categories: JokeCategory[];
  selectedCategory: string;
  userPreferences: {
    contentFilter: 'low' | 'medium' | 'high';
    preferredModels: string[];
    maxJokeLength: number;
  };
  
  // Actions
  addRecentJoke: (joke: Joke) => void;
  updateJoke: (jokeId: string, updates: Partial<Joke>) => void;
  setCategories: (categories: JokeCategory[]) => void;
  setSelectedCategory: (category: string) => void;
  updateUserPreferences: (preferences: Partial<JokeState['userPreferences']>) => void;
  clearRecentJokes: () => void;
}

export const useJokeStore = create<JokeState>()(
  persist(
    (set, get) => ({
      recentJokes: [],
      favoriteJokes: [],
      categories: [],
      selectedCategory: 'general',
      userPreferences: {
        contentFilter: 'medium',
        preferredModels: ['anthropic/claude-3-haiku'],
        maxJokeLength: 500,
      },

      addRecentJoke: (joke) => {
        set((state) => ({
          recentJokes: [joke, ...state.recentJokes.slice(0, 49)], // Keep last 50 jokes
        }));
      },

      updateJoke: (jokeId, updates) => {
        set((state) => ({
          recentJokes: state.recentJokes.map((joke) =>
            joke.id === jokeId ? { ...joke, ...updates } : joke
          ),
          favoriteJokes: state.favoriteJokes.map((joke) =>
            joke.id === jokeId ? { ...joke, ...updates } : joke
          ),
        }));
      },

      setCategories: (categories) => {
        set({ categories });
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
      },

      updateUserPreferences: (preferences) => {
        set((state) => ({
          userPreferences: { ...state.userPreferences, ...preferences },
        }));
      },

      clearRecentJokes: () => {
        set({ recentJokes: [] });
      },
    }),
    {
      name: 'joke-store',
      partialize: (state) => ({
        recentJokes: state.recentJokes,
        selectedCategory: state.selectedCategory,
        userPreferences: state.userPreferences,
      }),
    }
  )
);