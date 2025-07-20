import { createClient } from '@/lib/supabase/client';
import { Joke, JokeCategory, JokeRating, UserPreferences, GenerationHistory } from '@/types/joke';
import { SupabaseClient } from '@supabase/supabase-js';

export class JokeService {
  private supabase: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createClient();
  }

  async getJokes(options: {
    category?: string;
    limit?: number;
    offset?: number;
    userId?: string;
    includeRatings?: boolean;
  } = {}): Promise<Joke[]> {
    const { category, limit = 20, offset = 0, userId, includeRatings = true } = options;

    let query = this.supabase
      .from('jokes')
      .select(`
        *,
        ${includeRatings ? `
          joke_ratings!inner (
            rating
          ),
          joke_favorites!left (
            user_id
          )
        ` : ''}
      `)
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Failed to fetch jokes: ${error.message}`);
    }

    return data?.map((joke: any) => ({
      ...joke,
      average_rating: joke.joke_ratings?.length 
        ? joke.joke_ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / joke.joke_ratings.length
        : undefined,
      total_ratings: joke.joke_ratings?.length || 0,
      is_favorited: userId ? joke.joke_favorites?.some((f: any) => f.user_id === userId) : false,
    })) || [];
  }

  async getJokeById(id: string, userId?: string): Promise<Joke | null> {
    const { data, error } = await this.supabase
      .from('jokes')
      .select(`
        *,
        joke_ratings (
          rating,
          user_id
        ),
        joke_favorites (
          user_id
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(`Failed to fetch joke: ${error.message}`);
    }

    if (!data) return null;

    const ratings = data.joke_ratings || [];
    const userRating = userId ? ratings.find((r: any) => r.user_id === userId)?.rating : undefined;
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / ratings.length
      : undefined;

    return {
      ...data,
      average_rating: averageRating,
      total_ratings: ratings.length,
      user_rating: userRating,
      is_favorited: userId ? data.joke_favorites?.some((f: any) => f.user_id === userId) : false,
    };
  }

  async createJoke(joke: Omit<Joke, 'id' | 'created_at' | 'updated_at' | 'reported_count'>): Promise<Joke> {
    const { data, error } = await this.supabase
      .from('jokes')
      .insert([joke])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create joke: ${error.message}`);
    }

    return data;
  }

  async rateJoke(jokeId: string, userId: string, rating: number): Promise<JokeRating> {
    const { data, error } = await this.supabase
      .from('joke_ratings')
      .upsert({
        joke_id: jokeId,
        user_id: userId,
        rating,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to rate joke: ${error.message}`);
    }

    return data;
  }

  async toggleFavorite(jokeId: string, userId: string): Promise<boolean> {
    const { data: existing } = await this.supabase
      .from('joke_favorites')
      .select('id')
      .eq('joke_id', jokeId)
      .eq('user_id', userId)
      .single();

    if (existing) {
      const { error } = await this.supabase
        .from('joke_favorites')
        .delete()
        .eq('id', existing.id);

      if (error) {
        throw new Error(`Failed to remove favorite: ${error.message}`);
      }
      return false;
    } else {
      const { error } = await this.supabase
        .from('joke_favorites')
        .insert({
          joke_id: jokeId,
          user_id: userId,
        });

      if (error) {
        throw new Error(`Failed to add favorite: ${error.message}`);
      }
      return true;
    }
  }

  async getCategories(): Promise<JokeCategory[]> {
    const { data, error } = await this.supabase
      .from('joke_categories')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }

    return data || [];
  }

  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await this.supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch user preferences: ${error.message}`);
    }

    return data;
  }

  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    const { data, error } = await this.supabase
      .from('user_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update user preferences: ${error.message}`);
    }

    return data;
  }

  async saveGenerationHistory(history: Omit<GenerationHistory, 'id' | 'created_at'>): Promise<GenerationHistory> {
    const { data, error } = await this.supabase
      .from('generation_history')
      .insert([history])
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save generation history: ${error.message}`);
    }

    return data;
  }

  async getUserFavorites(userId: string, limit = 20, offset = 0): Promise<Joke[]> {
    const { data, error } = await this.supabase
      .from('joke_favorites')
      .select(`
        jokes (
          *,
          joke_ratings (
            rating
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch user favorites: ${error.message}`);
    }

    return data?.map((item: any) => ({
      ...item.jokes,
      average_rating: item.jokes.joke_ratings?.length 
        ? item.jokes.joke_ratings.reduce((sum: number, r: any) => sum + r.rating, 0) / item.jokes.joke_ratings.length
        : undefined,
      total_ratings: item.jokes.joke_ratings?.length || 0,
      is_favorited: true,
    })) || [];
  }

  async getUserGenerationHistory(userId: string, limit = 20, offset = 0): Promise<GenerationHistory[]> {
    const { data, error } = await this.supabase
      .from('generation_history')
      .select(`
        *,
        jokes (
          id,
          content,
          category
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(`Failed to fetch generation history: ${error.message}`);
    }

    return data || [];
  }
}