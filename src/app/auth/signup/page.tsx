'use client';

import styled from 'styled-components';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const Container = styled.div`
  min-height: calc(100vh - 80px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 2rem;
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      toast.success('Account created! Please check your email to verify your account.');
      router.push('/auth/login');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Create Account</Title>
        <Subtitle>Join JokeAI and start generating laughs</Subtitle>
        
        <Form onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            helperText="Must be at least 6 characters"
          />
          
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            fullWidth
          />
          
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            fullWidth
          >
            Create Account
          </Button>
        </Form>
        
        <LinkText>
          Already have an account? <Link href="/auth/login">Sign in</Link>
        </LinkText>
      </Card>
    </Container>
  );
}