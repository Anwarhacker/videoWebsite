
import React from 'react';
import { VideoData } from '../types';

interface InformationDisplayProps {
  video: VideoData | null;
}

const InformationDisplay: React.FC<InformationDisplayProps> = ({ video }) => {
  if (!video) return null;

  return (
    <div className="w-full bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest rounded-full border border-blue-500/20">
              {video.category}
            </span>
            <span className="text-zinc-500 text-xs">
              Added {new Date(video.timestamp).toLocaleDateString()}
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
            {video.title}
          </h2>
          
          <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl">
            {video.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {video.tags.map((tag, idx) => (
              <span key={idx} className="text-sm text-zinc-500 hover:text-white transition-colors cursor-pointer">
                {tag.startsWith('#') ? tag : `#${tag}`}
              </span>
            ))}
          </div>
        </div>

        <div className="md:w-48 shrink-0 flex flex-col items-start md:items-end justify-center">
          <div className="text-zinc-500 text-sm mb-1 uppercase tracking-tighter">Curated By</div>
          <div className="text-white font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-xs">
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
