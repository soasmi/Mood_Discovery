import React from 'react';
import { Play, Music } from 'lucide-react';
import { Track } from '../types';
import { useSpotify } from '../context/SpotifyContext';

interface TrackCardProps {
  track: Track;
  onClick: () => void;
}

const TrackCard = ({ track, onClick }: TrackCardProps) => {
  const { setCurrentTrack, currentTrack, isPlaying, setIsPlaying } = useSpotify();
  
  const isActive = currentTrack && currentTrack.id === track.id;
  
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isActive) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  return (
    <div 
      className="group relative rounded-md overflow-hidden bg-neutral-700/30 hover:bg-neutral-700/60 transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden">
        {track.coverUrl ? (
          <img 
            src={track.coverUrl} 
            alt={track.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-neutral-800 flex items-center justify-center">
            <Music size={40} className="text-neutral-500" />
          </div>
        )}
      </div>
      
      <button
        onClick={handlePlayClick}
        className="absolute top-2 right-2 w-10 h-10 rounded-full bg-green-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-105"
      >
        {isActive && isPlaying ? (
          <span className="w-3 h-3 bg-black rounded-sm" />
        ) : (
          <Play size={18} className="ml-1" />
        )}
      </button>
      
      {/* Energy and Mood Indicators */}
      <div className="absolute bottom-0 left-0 right-0 p-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="h-1 flex-1 bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500"
            style={{ width: `${track.energy * 100}%` }}
          />
        </div>
        <div className="h-1 flex-1 bg-neutral-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-purple-500"
            style={{ width: `${track.mood * 100}%` }}
          />
        </div>
      </div>
      
      <div className="p-3">
        <h4 className="font-medium truncate">{track.title}</h4>
        <p className="text-sm text-neutral-400 truncate">{track.artist}</p>
      </div>
    </div>
  );
};

export default TrackCard;
