export interface Joke {
  id: string;
  content: string;
  category: string;
  author_id?: string;
  created_at: string;
  updated_at: string;
  is_ai_generated: boolean;
  model_used?: string;
  prompt_used?: string;
  tags: string[];
  is_public: boolean;
  reported_count: number;
  average_rating?: number;
  total_ratings?: number;
  user_rating?: number;
  is_favorited?: boolean;
}

export interface JokeCategory {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
  is_active: boolean;
  created_at: string;
}

export interface JokeRating {
  id: string;
  joke_id: string;
  user_id: string;
  rating: number;
  created_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preferred_categories: string[];
  content_filter_level: 'low' | 'medium' | 'high';
  max_joke_length: number;
  favorite_models: string[];
  created_at: string;
  updated_at: string;
}

export interface JokeFavorite {
  id: string;
  joke_id: string;
  user_id: string;
  created_at: string;
}

export interface GenerationHistory {
  id: string;
  user_id: string;
  prompt: string;
  category: string;
  model_used: string;
  generated_joke_id?: string;
  generation_time_ms?: number;
  created_at: string;
}

export interface JokeGenerationRequest {
  prompt?: string;
  category: string;
  model?: string;
  max_length?: number;
  content_filter?: 'low' | 'medium' | 'high';
  creativity?: number;
  language?: 'en' | 'ru';
}

export interface JokeGenerationResponse {
  joke: Joke;
  generation_time_ms: number;
  model_used: string;
}

export interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  pricing: {
    prompt: string;
    completion: string;
  };
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type?: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens?: number;
  };
}