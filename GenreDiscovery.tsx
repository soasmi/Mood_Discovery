import React, { useState, useEffect } from 'react';
import { useSpotify } from '../context/SpotifyContext';
import TrackCard from './TrackCard';
import SoundDeepDive from './SoundDeepDive';
import { genreMap } from '../data/mockData';

const GenreDiscovery = () => {
  const { tracks } = useSpotify();
  const [activeGenre, setActiveGenre] = useState('');
  const [relatedGenres, setRelatedGenres] = useState<string[]>([]);
  const [showDeepDive, setShowDeepDive] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  
  // Extract unique user genres from tracks
  const userGenres = [...new Set(tracks.flatMap(track => track.genres))].slice(0, 8);
  
  useEffect(() => {
    if (activeGenre && genreMap[activeGenre]) {
      setRelatedGenres(genreMap[activeGenre]);
    } else {
      setRelatedGenres([]);
    }
  }, [activeGenre]);

  const getGenreFilteredTracks = () => {
    return tracks.filter(track => {
      if (!activeGenre) return false;
      
      // For a real app, you'd have more sophisticated genre matching
      return track.genres.includes(activeGenre);
    }).slice(0, 4);
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
      <h3 className="text-xl font-bold mb-4">Your Favorite Genres</h3>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {userGenres.map(genre => (
          <button
            key={genre}
            onClick={() => setActiveGenre(activeGenre === genre ? '' : genre)}
            className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
              activeGenre === genre
                ? 'bg-green-500 text-black'
                : 'bg-neutral-700 hover:bg-neutral-600 text-white'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>
      
      {activeGenre && (
        <>
          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3">If you like {activeGenre}, try these:</h4>
            <div className="flex flex-wrap gap-2">
              {relatedGenres.map(genre => (
                <button
                  key={genre}
                  className="px-3 py-1.5 rounded-full text-sm bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-200"
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {getGenreFilteredTracks().map(track => (
              <TrackCard 
                key={track.id} 
                track={track} 
                onClick={() => openDeepDive(track)}
              />
            ))}
          </div>
        </>
      )}
      
      {showDeepDive && selectedTrack && (
        <SoundDeepDive track={selectedTrack} onClose={closeDeepDive} />
      )}
    </div>
  );
};

export default GenreDiscovery;
