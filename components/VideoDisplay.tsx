import React, { useEffect, useRef, useState } from 'react';
import { VideoData } from '../types';

interface VideoDisplayProps {
  video: VideoData | null;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ video }) => {
  const [loadInstagram, setLoadInstagram] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const instaRef = useRef<HTMLDivElement>(null);

  // Reset loading state when video changes
  useEffect(() => {
    setIsVideoLoading(true);
  }, [video?.url]);

  const isInstagram = (url: string) => url.includes('instagram.com');

  const isPortraitVideo = (url: string) =>
    url.includes('/shorts/') ||
    url.includes('instagram.com/reel') ||
    url.includes('tiktok.com');

  // Convert regular URLs to embed URLs
  const getEmbedUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);

      // YouTube
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let videoId = '';
        if (urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1);
        } else if (urlObj.pathname.includes('/shorts/')) {
          videoId = urlObj.pathname.split('/shorts/')[1].split('?')[0];
        } else {
          videoId = urlObj.searchParams.get('v') || '';
        }
        return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&controls=1&iv_load_policy=3`;
      }

      // Vimeo
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').filter(Boolean)[0];
        return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`;
      }

      // TikTok
      if (urlObj.hostname.includes('tiktok.com')) {
        const videoId = urlObj.pathname.split('/video/')[1]?.split('?')[0];
        if (videoId) {
          return `https://www.tiktok.com/embed/v2/${videoId}?description=0&music_info=0`;
        }
      }

      // Facebook
      if (urlObj.hostname.includes('facebook.com') || urlObj.hostname.includes('fb.watch')) {
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
      }

      // Dailymotion
      if (urlObj.hostname.includes('dailymotion.com') || urlObj.hostname.includes('dai.ly')) {
        const videoId = urlObj.hostname.includes('dai.ly')
          ? urlObj.pathname.slice(1)
          : urlObj.pathname.split('/video/')[1]?.split('_')[0];
        return `https://www.dailymotion.com/embed/video/${videoId}?ui-logo=0`;
      }

      // Direct video files
      if (url.match(/\.(mp4|webm|ogg)(\?.*)?$/i)) {
        return url;
      }

      return url;
    } catch {
      return url;
    }
  };

  // Load Instagram embed script when needed
  useEffect(() => {
    if (!loadInstagram || !isInstagram(video?.url || '')) return;

    if (!(window as any).instgrm) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        (window as any).instgrm.Embeds.process();
      };
      document.body.appendChild(script);
    } else {
      (window as any).instgrm.Embeds.process();
    }
  }, [loadInstagram, video]);

  if (!video) {
    return (
      <div className="w-full aspect-video bg-zinc-900 rounded-2xl flex items-center justify-center">
        <p className="text-zinc-600">No video selected</p>
      </div>
    );
  }

  const portrait = isPortraitVideo(video.url);

  return (
    <div
      className={`relative w-full ${
        portrait ? 'aspect-[9/16] max-w-[85%] sm:max-w-sm lg:max-w-md mx-auto' : 'aspect-video'
      } bg-black rounded-2xl overflow-hidden shadow-2xl`}
    >
      {/* ================= INSTAGRAM ================= */}
      {isInstagram(video.url) ? (
        loadInstagram ? (
          /* Inline Instagram embed */
          <div
            ref={instaRef}
            className="w-full h-full flex items-center justify-center bg-black"
          >
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={video.url}
              data-instgrm-version="14"
              style={{
                width: '100%',
                height: '100%',
                margin: 0,
              }}
            ></blockquote>
          </div>
        ) : (
          /* Preview Card */
          <button
            onClick={() => setLoadInstagram(true)}
            className="w-full h-full flex flex-col items-center justify-center bg-black text-white relative group"
          >
            {video.thumbnail ? (
              <>
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </>
            ) : null}
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <p className="text-sm font-medium opacity-90 drop-shadow-md">Play Instagram video</p>
            </div>
          </button>
        )
      ) : (
        /* ================= OTHER PLATFORMS ================= */
        <div className="relative w-full h-full bg-black">
          {isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10 bg-zinc-900">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
          <iframe
            className="w-full h-full object-contain bg-black"
            src={getEmbedUrl(video.url)}
            title={video.title}
            scrolling="no"
            onLoad={() => setIsVideoLoading(false)}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default VideoDisplay;
