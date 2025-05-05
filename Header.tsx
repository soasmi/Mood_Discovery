import React, { useState, useEffect } from 'react';
import { Menu, Search, User, BellRing } from 'lucide-react';
import { useSpotify } from '../context/SpotifyContext';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentTrack, isPlaying } = useSpotify();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300 ${
        isScrolled
          ? 'bg-neutral-900/95 backdrop-blur-md shadow-md'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="md:hidden mr-4">
            <button className="text-white p-1">
              <Menu size={24} />
            </button>
          </div>
          
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white">Mood Discovery</h1>
          </div>
        </div>

        {/* Search bar */}
        <div className="hidden md:flex items-center bg-neutral-800/50 rounded-full px-3 py-1.5 flex-1 max-w-md mx-4">
          <Search size={18} className="text-neutral-400 mr-2" />
          <input
            type="text"
            placeholder="Search for songs, artists, or moods..."
            className="bg-transparent outline-none text-white w-full text-sm"
          />
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          <button className="md:hidden text-white">
            <Search size={24} />
          </button>
          
          <button className="text-white hidden md:block">
            <BellRing size={20} />
          </button>
          
          <button className="p-0.5 rounded-full bg-green-500 text-white">
            <User size={20} />
          </button>
        </div>
      </div>

      {/* Mini player - only visible when track is selected */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 p-3 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-12 h-12 object-cover rounded mr-3"
            />
            <div>
              <h4 className="text-sm font-medium">{currentTrack.title}</h4>
              <p className="text-xs text-neutral-400">{currentTrack.artist}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white">
              {isPlaying ? (
                <span className="w-3 h-3 bg-black rounded-sm" />
              ) : (
                <span className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-black border-b-[6px] border-b-transparent ml-0.5" />
              )}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
