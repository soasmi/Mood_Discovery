import React from 'react';
import { X, Music, Headphones, Activity, Clock, Share2, Plus } from 'lucide-react';
import { Track } from '../types';
import { useSpotify } from '../context/SpotifyContext';

interface SoundDeepDiveProps {
  track: Track;
  onClose: () => void;
}

const SoundDeepDive = ({ track, onClose }: SoundDeepDiveProps) => {
  const { setCurrentTrack, setIsPlaying } = useSpotify();
  
  const playTrack = () => {
    setCurrentTrack(track);
    setIsPlaying(true);
    // In a real app, this would actually play the track
  };
  
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="relative bg-neutral-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto animate-fadeIn">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white"
        >
          <X size={24} />
        </button>
        
        <div className="md:flex p-6">
          <div className="md:w-1/3 mb-6 md:mb-0 md:pr-6">
            {track.coverUrl ? (
              <img 
                src={track.coverUrl} 
                alt={track.title} 
                className="w-full aspect-square object-cover rounded-md shadow-xl"
              />
            ) : (
              <div className="w-full aspect-square bg-neutral-800 flex items-center justify-center rounded-md">
                <Music size={64} className="text-neutral-600" />
              </div>
            )}
            
            <div className="mt-4">
              <h2 className="text-2xl font-bold">{track.title}</h2>
              <p className="text-neutral-400">{track.artist}</p>
              <p className="text-sm text-neutral-500">{track.album} • {formatDuration(track.duration)}</p>
            </div>
            
            <div className="flex mt-6 space-x-2">
              <button
                onClick={playTrack}
                className="flex-1 py-2 rounded-full bg-green-500 text-black font-medium hover:bg-green-400 transition"
              >
                Play
              </button>
              <button className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition">
                <Share2 size={20} className="text-white" />
              </button>
              <button className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 transition">
                <Plus size={20} className="text-white" />
              </button>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Headphones className="mr-2" /> Sound Characteristics
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {Object.entries(track.features).map(([key, value]) => (
                <div key={key} className="bg-neutral-800/50 p-4 rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-neutral-400 capitalize">{key}</span>
                    <span className="text-sm font-medium">{Math.round(value * 100)}%</span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getColorForAttribute(key)}`}
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="bg-neutral-800/50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-400">Energy</span>
                  <span className="text-sm font-medium">{Math.round(track.energy * 100)}%</span>
                </div>
                <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500"
                    style={{ width: `${track.energy * 100}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-neutral-800/50 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-neutral-400">Mood</span>
                  <span className="text-sm font-medium">{Math.round(track.mood * 100)}%</span>
                </div>
                <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500"
                    style={{ width: `${track.mood * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Activity className="mr-2" /> Mood Analysis
              </h3>
              <p className="text-neutral-300 mb-4">
                This {track.energy < 0.5 ? 'relaxed' : 'energetic'} track has a 
                {track.mood < 0.3 ? ' dark' : track.mood > 0.7 ? ' very uplifting' : ' balanced'} emotional tone.
                {track.features.acousticness > 0.7 ? ' It features organic acoustic elements.' : ''}
                {track.features.danceability > 0.7 ? ' Has a strong groove that makes you want to move.' : ''}
              </p>
              
              <div className="bg-neutral-800/50 p-4 rounded-md">
                <h4 className="font-medium mb-2">Perfect for:</h4>
                <div className="flex flex-wrap gap-2">
                  {getMoodTags(track).map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-neutral-700 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Clock className="mr-2" /> When to Listen
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['Morning', 'Afternoon', 'Evening', 'Night'].map((time) => (
                  <div 
                    key={time} 
                    className={`p-3 rounded-md text-center ${isGoodTimeToListen(track, time.toLowerCase()) 
                      ? 'bg-green-500/20 border border-green-500/30' 
                      : 'bg-neutral-800/30'}`}
                  >
                    <span className={isGoodTimeToListen(track, time.toLowerCase()) 
                      ? 'text-green-400' 
                      : 'text-neutral-500'}
                    >
                      {time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getColorForAttribute = (attribute: string): string => {
  const colors = {
    danceability: 'bg-pink-500',
    tempo: 'bg-red-500',
    valence: 'bg-yellow-500',
    acousticness: 'bg-blue-500',
    instrumentalness: 'bg-indigo-500',
  };
  
  return colors[attribute as keyof typeof colors] || 'bg-gray-500';
};

const getMoodTags = (track: Track): string[] => {
  const tags = [];
  
  if (track.energy < 0.3) tags.push('Relaxation');
  if (track.energy > 0.7) tags.push('Workout');
  if (track.mood < 0.3) tags.push('Reflection');
  if (track.mood > 0.7) tags.push('Uplifting');
  if (track.features.danceability > 0.7) tags.push('Dancing');
  if (track.features.acousticness > 0.7) tags.push('Focus');
  if (track.features.instrumentalness > 0.7) tags.push('Study');
  if (track.features.tempo > 120) tags.push('Running');
  
  // Add some fallbacks if we don't have many tags
  if (tags.length < 3) {
    if (!tags.includes('Chilling')) tags.push('Chilling');
    if (!tags.includes('Background')) tags.push('Background');
  }
  
  return tags;
};

const isGoodTimeToListen = (track: Track, time: string): boolean => {
  switch (time) {
    case 'morning':
      return track.energy > 0.5 && track.mood > 0.6;
    case 'afternoon':
      return track.energy > 0.4 && track.mood > 0.4;
    case 'evening':
      return track.energy < 0.6 && track.mood > 0.3;
    case 'night':
      return track.energy < 0.5;
    default:
      return true;
  }
};

export default SoundDeepDive;
