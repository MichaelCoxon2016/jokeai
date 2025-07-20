import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { JokeService } from '@/lib/services/joke-service';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Get user for personalized data
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const jokeService = new JokeService();
    const jokes = await jokeService.getJokes({
      category,
      limit,
      offset,
      userId: user?.id,
      includeRatings: true,
    });

    return NextResponse.json({
      jokes,
      meta: {
        limit,
        offset,
        category,
      },
    });
  } catch (error) {
    console.error('Error fetching jokes:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}