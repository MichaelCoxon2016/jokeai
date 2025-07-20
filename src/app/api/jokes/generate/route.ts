import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { OpenRouterClient } from '@/lib/openrouter/client';
import { JokeService } from '@/lib/services/joke-service';
import { JokeGenerationRequest } from '@/types/joke';

export async function POST(request: NextRequest) {
  try {
    const body: JokeGenerationRequest = await request.json();
    const { category, prompt, model = 'google/gemini-2.5-flash', content_filter = 'medium', creativity = 0.7, language = 'en' } = body;

    // Validate required fields
    if (!category) {
      return NextResponse.json(
        { error: 'Category is required' },
        { status: 400 }
      );
    }

    // Check authentication
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get OpenRouter API key
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured' },
        { status: 500 }
      );
    }

    // Generate joke using OpenRouter
    const openRouterClient = new OpenRouterClient(openRouterApiKey);
    const { content, model: usedModel, generationTime } = await openRouterClient.generateJoke(
      prompt || '',
      category,
      model,
      500, // max tokens
      content_filter,
      creativity,
      language
    );

    // Save joke to database
    const jokeService = new JokeService(supabase);
    const joke = await jokeService.createJoke({
      content,
      category,
      author_id: user.id,
      is_ai_generated: true,
      model_used: usedModel,
      prompt_used: prompt || undefined,
      tags: [category],
      is_public: true,
    });

    // Save generation history
    await jokeService.saveGenerationHistory({
      user_id: user.id,
      prompt: prompt || `Generate a ${category} joke`,
      category,
      model_used: usedModel,
      generated_joke_id: joke.id,
      generation_time_ms: generationTime,
    });

    return NextResponse.json({
      joke,
      generation_time_ms: generationTime,
      model_used: usedModel,
    });
  } catch (error) {
    console.error('Error generating joke:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    const statusCode = errorMessage.includes('OpenRouter') ? 503 : 500;
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}