'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';

const StarBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
`;

const Star = styled.div<{ size: number; left: number; top: number; delay: number }>`
  position: absolute;
  left: ${({ left }) => left}%;
  top: ${({ top }) => top}%;
  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
  opacity: 0.8;
  animation: spinningStar 4s linear infinite;
  animation-delay: ${({ delay }) => delay}s;
  
  @keyframes spinningStar {
    0% { 
      transform: rotate(0deg);
      filter: drop-shadow(0 0 10px #ff0088);
    }
    16.66% { 
      filter: drop-shadow(0 0 10px #ff4400);
    }
    33.33% { 
      filter: drop-shadow(0 0 10px #ffaa00);
    }
    50% { 
      filter: drop-shadow(0 0 10px #00ff88);
    }
    66.66% { 
      filter: drop-shadow(0 0 10px #0088ff);
    }
    83.33% { 
      filter: drop-shadow(0 0 10px #8800ff);
    }
    100% { 
      transform: rotate(360deg);
      filter: drop-shadow(0 0 10px #ff0088);
    }
  }
  
  &::before {
    content: '✦';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: ${({ size }) => size}px;
    color: #ff0088;
  }
`;

interface StarData {
  id: number;
  size: number;
  left: number;
  top: number;
  delay: number;
}

export function RainbowStarBackground() {
  const [stars, setStars] = useState<StarData[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Generate stars only on client side to avoid hydration mismatch
    const generatedStars = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      size: Math.random() * 30 + 20,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 4,
    }));
    
    setStars(generatedStars);
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <StarBackground>
      {stars.map((star) => (
        <Star
          key={star.id}
          size={star.size}
          left={star.left}
          top={star.top}
          delay={star.delay}
        />
      ))}
    </StarBackground>
  );
}