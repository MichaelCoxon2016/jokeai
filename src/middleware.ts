import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  try {
    const supabase = await createServerClient();
    const { data: { session } } = await supabase.auth.getSession();

    // Protected routes that require authentication
    const protectedRoutes = ['/profile', '/favorites', '/history'];
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

    if (isProtectedRoute && !session) {
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Redirect authenticated users away from auth pages
    const authRoutes = ['/auth/login', '/auth/signup'];
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

    if (isAuthRoute && session) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};