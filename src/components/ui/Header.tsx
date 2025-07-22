'use client';

import styled from 'styled-components';
import { Button } from './Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { useSettingsStore } from '@/store/useSettingsStore';

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
  
  @media (max-width: 768px) {
    padding: 1rem;
    flex-wrap: wrap;
    gap: 1rem;
  }
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
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    order: 3;
    width: 100%;
    justify-content: space-around;
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

const ControlsSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: flex-end;
  }
`;

const CustomizationDropdown = styled.div`
  position: relative;
`;

const DropdownButton = styled(Button)`
  font-size: 0.875rem;
`;

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  min-width: 250px;
  padding: 1rem;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
  z-index: 1000;
`;

const DropdownSection = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DropdownLabel = styled.label`
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ThemeButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const MusicButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const FontSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  
  const { theme, fontStyle, musicOption, setTheme, setFontStyle, setMusicOption } = useSettingsStore();

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

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && !(event.target as Element).closest('.customization-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

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
        {user && <NavLink href="/favorites">Favorites</NavLink>}
        {user && <NavLink href="/history">History</NavLink>}
      </Nav>

      <ControlsSection>
        <CustomizationDropdown className="customization-dropdown">
          <DropdownButton 
            variant="outline" 
            size="sm"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            Customization
          </DropdownButton>
          
          <DropdownMenu isOpen={dropdownOpen}>
            <DropdownSection>
              <DropdownLabel>Theme</DropdownLabel>
              <ThemeButtons>
                <Button
                  size="sm"
                  variant={theme === 'light' ? 'primary' : 'outline'}
                  onClick={() => setTheme('light')}
                >
                  ☀️ Light
                </Button>
                <Button
                  size="sm"
                  variant={theme === 'dark' ? 'primary' : 'outline'}
                  onClick={() => setTheme('dark')}
                >
                  🌙 Dark
                </Button>
              </ThemeButtons>
            </DropdownSection>

            <DropdownSection>
              <DropdownLabel>Font Style</DropdownLabel>
              <FontSelect 
                value={fontStyle} 
                onChange={(e) => setFontStyle(e.target.value as any)}
              >
                <option value="default">Default</option>
                <option value="comic">Comic Sans</option>
                <option value="elegant">Elegant (Georgia)</option>
                <option value="modern">Modern (Helvetica)</option>
              </FontSelect>
            </DropdownSection>

            <DropdownSection>
              <DropdownLabel>Background Music</DropdownLabel>
              <MusicButtons>
                <Button
                  size="sm"
                  variant={musicOption === 'bigwave' ? 'primary' : 'outline'}
                  onClick={() => setMusicOption('bigwave')}
                >
                  🏖️ Big Wave Beach
                </Button>
                <Button
                  size="sm"
                  variant={musicOption === 'chill' ? 'primary' : 'outline'}
                  onClick={() => setMusicOption('chill')}
                >
                  🎵 Chill Music
                </Button>
                <Button
                  size="sm"
                  variant={musicOption === 'none' ? 'primary' : 'outline'}
                  onClick={() => setMusicOption('none')}
                >
                  🔇 No Music
                </Button>
              </MusicButtons>
            </DropdownSection>
          </DropdownMenu>
        </CustomizationDropdown>

        <UserSection>
          {loading ? (
            <div>Loading...</div>
          ) : user ? (
            <>
              <UserAvatar>
                {getUserInitials(user.email || 'U')}
              </UserAvatar>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" size="sm" onClick={() => router.push('/auth/login')}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => router.push('/auth/signup')}>
                Sign Up
              </Button>
            </>
          )}
        </UserSection>
      </ControlsSection>
    </HeaderContainer>
  );
}