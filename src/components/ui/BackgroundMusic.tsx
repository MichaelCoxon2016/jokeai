'use client';

import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

const MusicControls = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  gap: 10px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 10px 15px;
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const MusicButton = styled.button.withConfig({
  shouldForwardProp: (prop) => !['isPlaying'].includes(prop)
})<{ isPlaying?: boolean }>`
  background: none;
  border: none;
  color: ${({ theme, isPlaying }) => isPlaying ? theme.colors.primary : theme.colors.text};
  cursor: pointer;
  font-size: 18px;
  padding: 5px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surfaceHover};
  }

  &:active {
    transform: scale(0.95);
  }
`;

const VolumeSlider = styled.input`
  width: 60px;
  height: 4px;
  background: ${({ theme }) => theme.colors.border};
  border-radius: 2px;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    border: none;
    cursor: pointer;
  }
`;

const MusicLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.loop = true;

    const handleUserInteraction = () => {
      setHasUserInteracted(true);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [volume]);

  useEffect(() => {
    if (hasUserInteracted && audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [hasUserInteracted]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/music/background.mp3"
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <MusicControls>
        <MusicButton
          onClick={togglePlayPause}
          isPlaying={isPlaying}
          title={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </MusicButton>
        
        <VolumeSlider
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          title="Volume"
        />
        
        <MusicLabel>🎵</MusicLabel>
      </MusicControls>
    </>
  );
}