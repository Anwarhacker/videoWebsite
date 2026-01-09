
import React from 'react';
import { VideoData } from '../types';

interface VideoDisplayProps {
  video: VideoData | null;
}

const VideoDisplay: React.FC<VideoDisplayProps> = ({ video }) => {
  const getEmbedUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      
      // YouTube - minimal UI
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        let videoId = '';
        if (urlObj.hostname.includes('youtu.be')) {
          videoId = urlObj.pathname.slice(1);
        } else if (urlObj.pathname.includes('/shorts/')) {
          videoId = urlObj.pathname.split('/shorts/')[1].split('?')[0];
        } else {
          videoId = urlObj.searchParams.get('v') || '';
        }
        // Parameters: modestbranding removes YouTube logo, rel=0 removes related videos
        return `https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`;
      }
      
      // Vimeo - clean player
      if (urlObj.hostname.includes('vimeo.com')) {
        const videoId = urlObj.pathname.split('/').filter(Boolean)[0];
        // Parameters: title=0 hides title, byline=0 hides author, portrait=0 hides user picture
        return `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`;
      }
      
      // Instagram - Note: Instagram embeds always show some UI, cannot be fully hidden
      if (urlObj.hostname.includes('instagram.com')) {
        let path = urlObj.pathname;
        if (path.includes('/reel/')) {
          path = path.replace('/reel/', '/p/');
        }
        // captionless=1 hides caption
        return `${urlObj.origin}${path}embed/captioned/?cr=1&v=14`;
      }
      
      // TikTok - minimal UI
      if (urlObj.hostname.includes('tiktok.com')) {
        const videoId = urlObj.pathname.split('/video/')[1]?.split('?')[0];
        if (videoId) {
          return `https://www.tiktok.com/embed/${videoId}`;
        }
      }
      
      // Facebook - minimal player
      if (urlObj.hostname.includes('facebook.com') || urlObj.hostname.includes('fb.watch')) {
        // show_text=false hides post text and comments
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=500&appId`;
      }
      
      // Dailymotion - clean player
      if (urlObj.hostname.includes('dailymotion.com') || urlObj.hostname.includes('dai.ly')) {
        let videoId = '';
        if (urlObj.hostname.includes('dai.ly')) {
          videoId = urlObj.pathname.slice(1);
        } else {
          videoId = urlObj.pathname.split('/video/')[1]?.split('_')[0] || '';
        }
        // ui-logo=0 hides logo, sharing-enable=0 hides sharing button
        return `https://www.dailymotion.com/embed/video/${videoId}?ui-logo=0&sharing-enable=0`;
      }
      
      // Twitch
      if (urlObj.hostname.includes('twitch.tv')) {
        const videoId = urlObj.pathname.split('/videos/')[1];
        if (videoId) {
          return `https://player.twitch.tv/?video=${videoId}&parent=${window.location.hostname}`;
        }
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

  if (!video) {
    return (
      <div className="w-full aspect-video bg-zinc-900 rounded-2xl sm:rounded-3xl flex items-center justify-center">
        <p className="text-zinc-600 text-sm sm:text-base">No video selected</p>
      </div>
    );
  }

  const embedUrl = getEmbedUrl(video.url);
  const isDirectVideo = embedUrl.match(/\.(mp4|webm|ogg)(\?.*)?$/i);

  return (
    <div className="relative w-full aspect-video rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-white/5 bg-black group">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none z-10" />
      {isDirectVideo ? (
        <video 
          controls 
          className="w-full h-full object-cover"
          src={embedUrl}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <iframe
          className="w-full h-full object-cover"
          src={embedUrl}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default VideoDisplay;
