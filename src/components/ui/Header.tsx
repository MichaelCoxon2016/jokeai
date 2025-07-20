'use client';

import styled from 'styled-components';
import { Button } from './Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: none;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.primary}dd;
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-weight: 500;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.background};
  font-weight: 600;
  font-size: 0.875rem;
`;

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const getUserInitials = (email: string) => {
    return email.split('@')[0].charAt(0).toUpperCase();
  };

  return (
    <HeaderContainer>
      <Logo href="/">
        😂 JokeAI
      </Logo>
      
      <Nav>
        <NavLink href="/">Generate</NavLink>
        <NavLink href="/jokes">Browse</NavLink>
        {user && <NavLink href="/favorites">Favorites</NavLink>}
        {user && <NavLink href="/history">History</NavLink>}
      </Nav>

      <UserSection>
        {loading ? (
          <div>Loading...</div>
        ) : user ? (
          <>
            <UserAvatar>
              {getUserInitials(user.email || 'U')}
            </UserAvatar>
            <Button variant="ghost" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={() => router.push('/auth/login')}>
              Sign In
            </Button>
            <Button onClick={() => router.push('/auth/signup')}>
              Sign Up
            </Button>
          </>
        )}
      </UserSection>
    </HeaderContainer>
  );
}