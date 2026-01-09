
import React, { useState, useEffect, useMemo } from 'react';
import { VideoData } from './types';
import VideoDisplay from './components/VideoDisplay';
import InformationDisplay from './components/InformationDisplay';
import VideoForm from './components/VideoForm';

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

const App: React.FC = () => {
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Load initial videos or from local storage
  useEffect(() => {
    const saved = localStorage.getItem('curated_videos');
    if (saved) {
      setVideos(JSON.parse(saved));
    } else {
      setVideos(INITIAL_VIDEOS);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (videos.length > 0) {
      localStorage.setItem('curated_videos', JSON.stringify(videos));
    }
  }, [videos]);

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

  const addVideo = (newVideo: VideoData) => {
    setVideos((prev) => [newVideo, ...prev]);
    setSelectedCategory('All');
    setCurrentIndex(0);
  };

  const changeCategory = (cat: string) => {
    setSelectedCategory(cat);
    setCurrentIndex(0);
  };

  const currentVideo = filteredVideos[currentIndex] || null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center p-4 md:p-8 overflow-y-auto">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-xl md:text-2xl font-black tracking-tighter text-white uppercase italic">
            Focus<span className="text-blue-500">Hub</span>
          </h1>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="group relative px-6 py-2.5 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="text-lg">+</span> Add Content
          </span>
          <div className="absolute inset-0 bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
        </button>
      </header>

      {/* Category Filter Bar */}
      <div className="w-full max-w-6xl flex gap-2 overflow-x-auto pb-4 mb-4 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => changeCategory(cat)}
            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20'
                : 'bg-zinc-900 text-zinc-400 border-white/5 hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Experience Wrapper */}
      <main className="w-full max-w-6xl flex flex-col gap-6 relative">
        
        {/* ROW 1: Video Card */}
        <section className="w-full">
          <VideoDisplay video={currentVideo} />
        </section>

        {/* INTERMEDIATE ROW: Navigation & Status */}
        <nav className="w-full flex items-center justify-between gap-4 py-2">
          <button
            onClick={handlePrev}
            className="group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-zinc-900 border border-white/5 text-white hover:bg-blue-600 hover:border-blue-400 transition-all shadow-xl active:scale-90"
            aria-label="Previous video"
          >
            <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="flex-1 flex flex-col items-center">
            <div className="px-4 py-1.5 bg-zinc-900 rounded-full border border-white/5 shadow-inner">
              <span className="text-sm font-bold text-zinc-400">
                {filteredVideos.length > 0 ? (currentIndex + 1) : 0} <span className="opacity-40">/</span> {filteredVideos.length}
              </span>
            </div>
            <div className="hidden md:block mt-2 h-1 w-32 bg-zinc-900 rounded-full overflow-hidden">
               <div 
                  className="h-full bg-blue-500 transition-all duration-500 ease-out"
                  style={{ width: `${filteredVideos.length > 0 ? ((currentIndex + 1) / filteredVideos.length) * 100 : 0}%` }}
               />
            </div>
          </div>

          <button
            onClick={handleNext}
            className="group flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full bg-zinc-900 border border-white/5 text-white hover:bg-blue-600 hover:border-blue-400 transition-all shadow-xl active:scale-90"
            aria-label="Next video"
          >
            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </nav>

        {/* ROW 2: Information Card */}
        <section className="w-full">
          <InformationDisplay video={currentVideo} />
        </section>

        {/* Bottom Decorative Element */}
        <div className="mt-8 flex justify-center opacity-30">
          <div className="w-1 h-1 rounded-full bg-zinc-700 mx-1"></div>
          <div className="w-1 h-1 rounded-full bg-zinc-700 mx-1"></div>
          <div className="w-1 h-1 rounded-full bg-zinc-700 mx-1"></div>
        </div>
      </main>

      {/* Add Video Modal Overlay */}
      {isFormOpen && (
        <VideoForm 
          onAdd={addVideo} 
          onClose={() => setIsFormOpen(false)} 
        />
      )}

      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[0%] -right-[10%] w-[30%] h-[30%] bg-indigo-900/10 blur-[100px] rounded-full"></div>
      </div>
    </div>
  );
};

export default App;
