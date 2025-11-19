import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Disc, FastForward, Pause, Play, Rewind } from 'lucide-react';

const tracks = [
    { title: "Midnight City", artist: "M83 • Hurry Up", cover: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop" },
    { title: "Nightcall", artist: "Kavinsky • Drive", cover: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=300&auto=format&fit=crop" },
    { title: "Resonance", artist: "HOME • Odyssey", cover: "https://images.unsplash.com/photo-1504509546545-e000b4a62953?q=80&w=300&auto=format&fit=crop" }
];

const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [progress, setProgress] = useState(30);
  // Use a ref to hold the interval ID to avoid re-renders or type issues
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
    setProgress(0);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
    setProgress(0);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (isPlaying) {
        intervalRef.current = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    // Automatically go to next track but we need to handle state update carefully in interval
                    // For simplicity in this demo, we loop progress
                    return 0; 
                }
                return prev + 0.5;
            });
        }, 100);
    } else {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    }
    return () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };
  }, [isPlaying]);

  // Effect to reset progress when track changes manually
  useEffect(() => {
      // Optional: Trigger visual reset if needed
  }, [currentTrack]);

  return (
    <div className="h-full w-full flex flex-col justify-between p-6 relative overflow-hidden bg-transparent transition-colors duration-500">
      
      <div className="relative z-10 flex items-start justify-between">
        <div className={`p-2 bg-white/50 dark:bg-neutral-800/50 rounded-full shadow-sm border border-white/20 dark:border-neutral-700/50 backdrop-blur-md transition-colors ${isPlaying ? 'animate-spin-slow' : ''}`}>
            <Disc className="w-5 h-5 text-neutral-900 dark:text-white" />
        </div>
        <div className="flex gap-1 items-end h-6">
            {[1, 2, 3, 4, 5].map((i) => (
                <motion.div
                    key={i}
                    className="w-1 bg-neutral-900 dark:bg-white rounded-full"
                    animate={{
                        height: isPlaying ? [8, 24, 12, 20, 8] : 4,
                    }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.1,
                    }}
                />
            ))}
        </div>
      </div>

      <div className="relative z-10 space-y-4 mt-auto">
        <div className="flex gap-4 items-center">
            <motion.div 
                key={currentTrack}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border border-white/20 dark:border-neutral-700/50 group-hover:scale-105 transition-transform duration-500"
            >
                <img 
                    src={tracks[currentTrack].cover} 
                    alt="Album"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                />
            </motion.div>
            <div>
                <motion.h3 
                    key={`title-${currentTrack}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-neutral-900 dark:text-white font-bold text-lg leading-tight"
                >
                    {tracks[currentTrack].title}
                </motion.h3>
                <motion.p 
                    key={`artist-${currentTrack}`}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-neutral-500 dark:text-neutral-400 text-xs font-bold uppercase tracking-wider"
                >
                    {tracks[currentTrack].artist}
                </motion.p>
            </div>
        </div>

        <div className="space-y-2">
            {/* Progress Bar */}
            <div className="h-1 w-full bg-neutral-200/50 dark:bg-neutral-700/50 rounded-full overflow-hidden">
                <motion.div 
                    className="h-full bg-neutral-900 dark:bg-white"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: "linear" }}
                />
            </div>
            <div className="flex justify-between text-[10px] text-neutral-500 dark:text-neutral-400 font-mono font-medium">
                <span>{Math.floor((progress / 100) * 243 / 60)}:{String(Math.floor((progress / 100) * 243 % 60)).padStart(2, '0')}</span>
                <span>4:03</span>
            </div>
        </div>

        <div className="flex items-center justify-between pt-2 px-2">
             <button onClick={prevTrack} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"><Rewind size={20} fill="currentColor" /></button>
             
             <button 
                onClick={togglePlay} 
                className="relative group overflow-hidden h-10 w-10 flex items-center justify-center rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black shadow-lg hover:scale-110 transition-transform"
             >
                 <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
                <div className="relative z-20 flex items-center justify-center">
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                </div>
             </button>
             
             <button onClick={nextTrack} className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"><FastForward size={20} fill="currentColor" /></button>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;