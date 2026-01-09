
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { VideoData } from '../types';
import VideoDisplay from '../components/VideoDisplay';
import InformationDisplay from '../components/InformationDisplay';
import { videoAPI } from '../services/api';

const INITIAL_VIDEOS: VideoData[] = [
  {
    id: '3',
    url: 'https://youtube.com/shorts/LyqEZT5vT1w?si=fLHloNhdy7qQPRXp',
    title: 'Futuristic Automotive Innovation',
    description: 'A striking look into modern automotive design and cutting-edge technology, showcasing the sleek lines and innovative features of next-generation transportation.',
    author: 'Tech Visions',
    tags: ['#future', '#technology', '#innovation', '#shorts'],
    category: 'Technology',
    timestamp: Date.now()
  },
  {
    id: '1',
    url: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ',
    title: 'Big Buck Bunny - Animated Short',
    description: 'A large and lovable rabbit deals with three tiny bullies, showing that kindness and cleverness can win the day in this classic animated story.',
    author: 'Blender Foundation',
    tags: ['#animation', '#shortfilm', '#blender'],
    category: 'Animation',
    timestamp: Date.now() - 1000000
  },
  {
    id: '2',
    url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    title: 'Costa Rica in 4K 60fps',
    description: 'Breathtaking cinematic visuals of the tropical rainforests, diverse wildlife, and stunning coastal views of Costa Rica.',
    author: 'Jacob + Katie Schwarz',
    tags: ['#nature', '#4k', '#travel'],
    category: 'Cinematography',
    timestamp: Date.now() - 500000
  }
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load videos from API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await videoAPI.getAll();
        
        // If no videos in DB, seed with initial data
        if (data.length === 0) {
          console.log('No videos found, seeding database...');
          for (const video of INITIAL_VIDEOS) {
            await videoAPI.create(video);
          }
          const seededData = await videoAPI.getAll();
          setVideos(seededData);
        } else {
          setVideos(data);
        }
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Make sure the backend server is running.');
        // Fallback to initial videos if API fails
        setVideos(INITIAL_VIDEOS);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Derived unique categories
  const categories = useMemo(() => {
    const unique = Array.from(new Set(videos.map(v => v.category)));
    return ['All', ...unique.sort()];
  }, [videos]);

  // Filtered videos based on selection
  const filteredVideos = useMemo(() => {
    if (selectedCategory === 'All') return videos;
    return videos.filter(v => v.category === selectedCategory);
  }, [videos, selectedCategory]);

  const handleNext = () => {
    if (filteredVideos.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % filteredVideos.length);
  };

  const handlePrev = () => {
    if (filteredVideos.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + filteredVideos.length) % filteredVideos.length);
  };

  const changeCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
  };

  const currentVideo = filteredVideos[currentIndex] || null;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center px-3 py-4 sm:p-6 md:p-8 overflow-y-auto">
      {/* Error Message */}
      {error && (
        <div className="w-full max-w-6xl mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-base sm:text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
            Focus<span className="text-blue-500">Hub</span>
          </h1>
        </div>
        {/* Admin Link Button */}
        <button
          onClick={() => navigate('/anwar')}
          className="group relative px-3 py-2 sm:px-6 sm:py-2.5 bg-white text-black font-bold text-sm sm:text-base rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 touch-target"
        >
          <span className="relative z-10 flex items-center gap-1 sm:gap-2">
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="hidden sm:inline">Admin</span>
          </span>
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
        </button>
      </header>

      {/* Category Filter Bar */}
      <div className="w-full max-w-6xl relative">
        {/* Gradient fade edges for scroll indication */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-3 sm:bottom-4 w-8 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10"></div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-3 sm:bottom-4 w-8 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10"></div>
        
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-3 sm:pb-4 sm:mb-4 no-scrollbar scroll-smooth">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => changeCategory(cat)}
              className={`flex-shrink-0 whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 rounded-full text-[11px] xs:text-xs sm:text-sm font-semibold transition-all border touch-target ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20 scale-105'
                  : 'bg-zinc-900 text-zinc-400 border-white/5 hover:border-white/20 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Experience Wrapper */}
      <main className="w-full max-w-6xl flex flex-col gap-3 sm:gap-4 md:gap-6 relative">
        
        {/* ROW 1: Video Card */}
        <section className="w-full">
          <VideoDisplay video={currentVideo} />
        </section>

        {/* INTERMEDIATE ROW: Navigation & Status */}
        <nav className="w-full flex items-center justify-between gap-2 sm:gap-4 py-2">
          <button
            onClick={handlePrev}
            className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-zinc-900 border border-white/5 text-white hover:bg-blue-600 hover:border-blue-400 transition-all shadow-xl active:scale-90 touch-target"
            aria-label="Previous video"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-1 flex flex-col items-center">
            <div className="px-3 py-1 sm:px-4 sm:py-1.5 bg-zinc-900 rounded-full border border-white/5 shadow-inner">
              <span className="text-xs sm:text-sm font-bold text-zinc-400">
                {filteredVideos.length > 0 ? (currentIndex + 1) : 0} <span className="opacity-40">/</span> {filteredVideos.length}
              </span>
            </div>
            <div className="hidden sm:block mt-2 h-1 w-24 sm:w-32 bg-zinc-900 rounded-full overflow-hidden">
               <div 
                  className="h-full bg-blue-500 transition-all duration-500 ease-out"
                  style={{ width: `${filteredVideos.length > 0 ? ((currentIndex + 1) / filteredVideos.length) * 100 : 0}%` }}
               />
            </div>
          </div>

          <button
            onClick={handleNext}
            className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-zinc-900 border border-white/5 text-white hover:bg-blue-600 hover:border-blue-400 transition-all shadow-xl active:scale-90 touch-target"
            aria-label="Next video"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>

        {/* ROW 2: Information Card */}
        <section className="w-full">
          <InformationDisplay video={currentVideo} />
        </section>

        {/* Bottom Decorative Element */}
        <div className="mt-4 sm:mt-6 md:mt-8 mb-4 flex justify-center opacity-30">
          <div className="w-1 h-1 rounded-full bg-zinc-700 mx-1"></div>
          <div className="w-1 h-1 rounded-full bg-zinc-700 mx-1"></div>
          <div className="w-1 h-1 rounded-full bg-zinc-700 mx-1"></div>
        </div>
      </main>

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[0%] -right-[10%] w-[30%] h-[30%] bg-indigo-900/10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
};

export default HomePage;
