import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark';
export type FontStyle = 'default' | 'comic' | 'elegant' | 'modern';
export type MusicOption = 'bigwave' | 'chill' | 'none';

interface SettingsState {
  theme: ThemeMode;
  fontStyle: FontStyle;
  musicOption: MusicOption;
  volume: number;
  
  // Actions
  setTheme: (theme: ThemeMode) => void;
  setFontStyle: (fontStyle: FontStyle) => void;
  setMusicOption: (musicOption: MusicOption) => void;
  setVolume: (volume: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      fontStyle: 'default',
      musicOption: 'bigwave',
      volume: 0.5,

      setTheme: (theme) => set({ theme }),
      setFontStyle: (fontStyle) => set({ fontStyle }),
      setMusicOption: (musicOption) => set({ musicOption }),
      setVolume: (volume) => set({ volume }),
    }),
    {
      name: 'settings-store',
    }
  )
);