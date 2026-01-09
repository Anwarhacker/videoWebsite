
import React from 'react';
import { VideoData } from '../types';

interface VideoDisplayProps {
  video: VideoData | null;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ video }) => {
  if (!video) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-800 animate-pulse">
        <p className="text-zinc-500 font-medium text-lg">No video selected</p>
      </div>
    );
  }

  const getEmbedUrl = (url: string) => {
    try {
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let id = '';
        if (url.includes('v=')) {
          id = url.split('v=')[1].split('&')[0];
        } else if (url.includes('/shorts/')) {
          id = url.split('/shorts/')[1].split('?')[0].split('&')[0];
        } else {
          id = url.split('/').pop()?.split('?')[0] || '';
        }
        return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
      }
      if (url.includes('vimeo.com')) {
        const id = url.split('/').pop()?.split('?')[0];
        return `https://player.vimeo.com/video/${id}`;
      }
      return url;
    } catch (e) {
      return url;
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/5 bg-black group">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
      <iframe
        className="w-full h-full object-cover"
        src={getEmbedUrl(video.url)}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default VideoDisplay;
