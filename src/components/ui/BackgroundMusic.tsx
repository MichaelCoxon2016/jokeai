'use client';

import { useEffect, useRef } from 'react';
import { useSettingsStore } from '@/store/useSettingsStore';

export function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { musicOption, volume } = useSettingsStore();

  useEffect(() => {
    // Clean up previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Handle no music option
    if (musicOption === 'none') {
      return;
    }

    // Set up new audio based on selection
    const musicFile = musicOption === 'bigwave' ? '/music/background.mp3' : '/music/chill.mp3';
    audioRef.current = new Audio(musicFile);
    audioRef.current.loop = true;
    audioRef.current.volume = volume;

    // Try to play the music after user interaction
    const playMusic = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(error => {
          console.error('Failed to play audio:', error);
        });
      }
    };

    // Wait for user interaction before playing
    const handleUserInteraction = () => {
      playMusic();
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);

    // Clean up on unmount or music change
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
    };
  }, [musicOption, volume]);

  // This component is now invisible - music is controlled from the header
  return null;
}