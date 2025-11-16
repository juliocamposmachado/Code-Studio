import React, { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, VolumeIcon } from './icons';

export const RadioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const streamUrl = 'http://82.145.41.50/stream.mp3?ipport=82.145.41.50_16784';

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Audio play failed:", error);
          setIsPlaying(false);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    if (audioElement) {
        audioElement.addEventListener('pause', handlePause);
        audioElement.addEventListener('play', handlePlay);

        return () => {
            audioElement.removeEventListener('pause', handlePause);
            audioElement.removeEventListener('play', handlePlay);
        };
    }
  }, []);

  return (
    <div className="flex items-center group space-x-2">
      <audio ref={audioRef} src={streamUrl} preload="none"></audio>
      <button onClick={togglePlayPause} className="text-white hover:text-gray-300 transition-colors focus:outline-none" title={isPlaying ? 'Pausar Rádio' : 'Tocar Rádio'}>
        {isPlaying ? <PauseIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
      </button>
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
         <VolumeIcon className="w-4 h-4 text-white" />
         <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-400"
            title={`Volume: ${Math.round(volume * 100)}%`}
         />
      </div>
    </div>
  );
};
