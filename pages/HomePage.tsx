
import React, { useState, useEffect, useMemo } from 'react';

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

  // Debug: Log current video to check if relatedVideos exists
  useEffect(() => {
    if (currentVideo) {
      console.log('Current Video Data:', currentVideo);
      console.log('Has Related Videos:', currentVideo.relatedVideos?.length || 0);
    }
  }, [currentVideo]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(59,130,246,0.5)]"></div>
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-black italic tracking-tighter text-white mb-2">
              TheVoice<span className="text-blue-500 shadow-blue-500/50">OfTruth</span>
            </h2>
            <p className="text-zinc-500 text-sm font-medium tracking-wide uppercase">Initializing Experience</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center px-2 sm:px-6 md:p-8 overflow-y-auto">
      {/* Error Message */}
      {error && (
        <div className="w-full max-w-6xl mb-4 p-4 bg-red-900/20 border border-red-500/50 rounded-xl">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-4 sm:mb-6 md:mb-8 mt-2 sm:mt-0">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
            TheVoice<span className="text-blue-500">OfTruth</span>
          </h1>
        </div>

      </header>

      {/* Category Filter Bar */}
      <div className="w-full max-w-6xl relative">
        {/* Gradient fade edges for scroll indication */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-3 sm:bottom-4 w-8 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10"></div>
        <div className="pointer-events-none absolute right-0 top-0 bottom-3 sm:bottom-4 w-8 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10"></div>
        
        <div className="flex gap-2 overflow-x-auto pb-3 mb-3 sm:pb-4 sm:mb-4 no-scrollbar scroll-smooth px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => changeCategory(cat)}
              className={`flex-shrink-0 whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all border touch-target ${
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
      <main className="w-full max-w-6xl flex flex-col gap-4 sm:gap-6 relative">
        
        {/* Video and Information Container - Side by side on large screens */}
        <div className="w-full flex flex-col lg:flex-row gap-4 sm:gap-6">
          
          {/* Video Section - 60% width on large screens */}
          <section className="w-full lg:w-[60%]">
            <VideoDisplay video={currentVideo} />
          </section>

          {/* Information Section - 40% width on large screens */}
          <section className="w-full lg:w-[40%] lg:relative">
            <InformationDisplay video={currentVideo} />
          </section>
          
        </div>

        {/* Related Videos Section - Full width below main video */}
        {currentVideo?.relatedVideos && currentVideo.relatedVideos.length > 0 && (
          <div className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Related Videos
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {currentVideo.relatedVideos.map((relatedVideo, index) => (
                <div 
                  key={index} 
                  className="bg-zinc-800/50 border border-white/5 rounded-xl overflow-hidden hover:border-white/10 hover:bg-zinc-800/70 transition-all group"
                >
                  {/* Thumbnail */}
                  <div className="w-full aspect-video bg-zinc-900 overflow-hidden">
                    {relatedVideo.thumbnail ? (
                      <img 
                        src={relatedVideo.thumbnail} 
                        alt={relatedVideo.title || `Related video ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="p-3 sm:p-4">
                    {relatedVideo.title && (
                      <h4 className="text-sm font-semibold text-white mb-2 line-clamp-2 min-h-[2.5rem]">
                        {relatedVideo.title}
                      </h4>
                    )}
                    <a 
                      href={relatedVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Watch Video
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation Controls - Below both on large screens */}
        <nav className="w-full flex items-center justify-between gap-4 py-2 px-1">
          <button
            onClick={handlePrev}
            className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-zinc-900 border border-white/5 text-white hover:bg-blue-600 hover:border-blue-400 transition-all shadow-xl active:scale-95 touch-target"
            aria-label="Previous video"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-1 flex flex-col items-center">
            <div className="px-4 py-1.5 bg-zinc-900 rounded-full border border-white/5 shadow-inner">
              <span className="text-sm font-bold text-zinc-400">
                {filteredVideos.length > 0 ? (currentIndex + 1) : 0} <span className="opacity-40">/</span> {filteredVideos.length}
              </span>
            </div>
            <div className="mt-2 h-1 w-24 sm:w-32 bg-zinc-900 rounded-full overflow-hidden">
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
