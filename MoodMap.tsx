import React, { useState, useEffect, useRef } from 'react';
import { useSpotify } from '../context/SpotifyContext';
import TrackCard from './TrackCard';
import SoundDeepDive from './SoundDeepDive';

const MoodMap = () => {
  const { tracks, moodSettings, updateMoodSettings } = useSpotify();
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [filteredTracks, setFilteredTracks] = useState(tracks);
  const mapRef = useRef(null);
  
  useEffect(() => {
    // Filter tracks based on current mood settings
    // In a real app, this would be more sophisticated with thresholds, etc.
    setFilteredTracks(
      tracks.filter(track => {
        const energyDiff = Math.abs(track.energy - moodSettings.energy);
        const moodDiff = Math.abs(track.mood - moodSettings.mood);
        
        // Only include tracks that are somewhat close to the current mood settings
        return energyDiff < 0.3 && moodDiff < 0.3;
      })
    );
  }, [tracks, moodSettings]);

  const handleMapClick = (e) => {
    if (!mapRef.current) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = 1 - (e.clientY - rect.top) / rect.height; // Invert Y to match our coordinate system
    
    updateMoodSettings({
      energy: x,
      mood: y,
    });
  };

  const openDeepDive = (track) => {
    setSelectedTrack(track);
    setShowDeepDive(true);
  };

  const closeDeepDive = () => {
    setShowDeepDive(false);
  };

  return (
    <div className="bg-neutral-800/50 rounded-lg p-6 backdrop-blur-sm">
      <div
        ref={mapRef}
        className="relative w-full h-96 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-lg mb-6 cursor-pointer"
        onClick={handleMapClick}
      >
        {/* Mood map axes */}
        <div className="absolute inset-0 flex flex-col justify-between text-xs text-neutral-400 p-4">
          <div className="self-end">Uplifting</div>
          <div className="self-start">Dark</div>
        </div>
        
        <div className="absolute inset-0 flex justify-between items-center text-xs text-neutral-400 p-4">
          <div className="self-center -rotate-90">Calm</div>
          <div className="self-center -rotate-90">Energetic</div>
        </div>
        
        {/* Current cursor position */}
        <div
          className="absolute w-6 h-6 rounded-full bg-green-500 shadow-lg shadow-green-500/30 transform -translate-x-1/2 -translate-y-1/2 z-20 ring-4 ring-green-500/20 transition-all duration-300"
          style={{
            left: `${moodSettings.energy * 100}%`,
            top: `${(1 - moodSettings.mood) * 100}%`,
          }}
        />
        
        {/* Tracks position markers */}
        {tracks.map((track) => (
          <button
            key={track.id}
            className="absolute w-3 h-3 rounded-full bg-white/70 hover:bg-white hover:scale-150 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 z-10"
            style={{
              left: `${track.energy * 100}%`,
              top: `${(1 - track.mood) * 100}%`,
              opacity: filteredTracks.includes(track) ? 1 : 0.3,
            }}
            onClick={(e) => {
              e.stopPropagation();
              openDeepDive(track);
            }}
          />
        ))}
      </div>
      
      <h3 className="text-xl font-bold mb-4">Tracks for Your Mood</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredTracks.slice(0, 8).map((track) => (
          <TrackCard
            key={track.id}
            track={track}
            onClick={() => openDeepDive(track)}
          />
        ))}
      </div>
      
      {showDeepDive && selectedTrack && (
        <SoundDeepDive track={selectedTrack} onClose={closeDeepDive} />
      )}
    </div>
  );
};

export default MoodMap;
