import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Track, MoodSettings } from '../types';
import { mockTracks } from '../data/mockData';

interface SpotifyContextType {
  tracks: Track[];
  currentTrack: Track | null;
  moodSettings: MoodSettings;
  isPlaying: boolean;
  setCurrentTrack: (track: Track | null) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  updateMoodSettings: (settings: Partial<MoodSettings>) => void;
  openDeepDive: (track: Track) => void;
}

const SpotifyContext = createContext<SpotifyContextType | undefined>(undefined);

export const SpotifyProvider = ({ children }: { children: ReactNode }) => {
  const [tracks] = useState<Track[]>(mockTracks);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [moodSettings, setMoodSettings] = useState<MoodSettings>({
    energy: 0.5,
    mood: 0.5,
    timeOfDay: 'afternoon',
  });

  const updateMoodSettings = (settings: Partial<MoodSettings>) => {
    setMoodSettings({ ...moodSettings, ...settings });
  };

  const openDeepDive = (track: Track) => {
    setCurrentTrack(track);
    // Will be implemented with modal logic
  };

  return (
    <SpotifyContext.Provider
      value={{
        tracks,
        currentTrack,
        moodSettings,
        isPlaying,
        setCurrentTrack,
        setIsPlaying,
        updateMoodSettings,
        openDeepDive,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};

export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (context === undefined) {
    throw new Error('useSpotify must be used within a SpotifyProvider');
  }
  return context;
};
