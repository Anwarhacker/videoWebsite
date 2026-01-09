
import React from 'react';
import { VideoData } from '../types';

interface InformationDisplayProps {
  video: VideoData | null;
}

const InformationDisplay: React.FC<InformationDisplayProps> = ({ video }) => {
  if (!video) return null;

  return (
    <div className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-xl sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 sm:gap-6">
        <div className="flex-1 space-y-3 sm:space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="inline-block mr-2 sm:mr-3 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-blue-500/10 text-blue-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest rounded-full border border-blue-500/20">
              {video.category}
            </span>
            <span className="text-zinc-500 text-[10px] sm:text-xs">
              Added {new Date(video.timestamp).toLocaleDateString()}
            </span>
          </div>
          
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-white leading-tight">
            {video.title}
          </h2>
          
          <p className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-3xl">
            {video.description}
          </p>

          <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1 sm:pt-2">
            {video.tags.map((tag, idx) => (
              <span key={idx} className="inline-block mr-1.5 sm:mr-2 text-xs sm:text-sm text-zinc-500 hover:text-white transition-colors cursor-pointer">
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>

        <div className="md:w-48 shrink-0 flex flex-col items-start md:items-end justify-center">
          <div className="text-zinc-500 text-xs sm:text-sm mb-1 uppercase tracking-tighter">Curated By</div>
          <div className="text-white text-sm sm:text-base font-semibold flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs">
              {video.author.charAt(0)}
            </div>
            {video.author}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InformationDisplay;
