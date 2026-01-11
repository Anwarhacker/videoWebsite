# Multi-Platform Video Support

## Supported Platforms

The related videos section now supports embedding videos from the following platforms:

### 1. **YouTube** ✅
- Standard videos: `youtube.com/watch?v=VIDEO_ID`
- Shorts: `youtube.com/shorts/VIDEO_ID`
- Short links: `youtu.be/VIDEO_ID`
- **Embed:** `https://www.youtube.com/embed/{videoId}`

### 2. **Instagram** ✅ NEW
- Reels: `instagram.com/reel/CODE`
- Posts: `instagram.com/p/CODE`
- **Embed:** `https://www.instagram.com/p/{postId}/embed`

### 3. **TikTok** ✅ NEW
- Videos: `tiktok.com/@user/video/VIDEO_ID`
- **Embed:** `https://www.tiktok.com/embed/v2/{videoId}`

### 4. **Facebook** ✅ NEW
- Videos: `facebook.com/...` or `fb.watch/...`
- **Embed:** `https://www.facebook.com/plugins/video.php?href={url}`

### 5. **Vimeo** ✅
- Videos: `vimeo.com/VIDEO_ID`
- **Embed:** `https://player.vimeo.com/video/{videoId}`

### 6. **Dailymotion** ✅
- Videos: `dailymotion.com/video/VIDEO_ID`
- **Embed:** `https://www.dailymotion.com/embed/video/{videoId}`

### 7. **Twitch** ✅ NEW
- Clips: `twitch.tv/user/clip/CLIP_ID`
- VODs: `twitch.tv/videos/VIDEO_ID`
- **Embed:** Uses Twitch player with parent domain

## How It Works

The `getEmbedUrl()` function automatically detects the platform from the URL and converts it to the appropriate embed format:

```tsx
const getEmbedUrl = (url: string) => {
  // 1. Check for YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    // Extract videoId and return embed URL
  }
  
  // 2. Check for Instagram
  if (url.includes('instagram.com')) {
    // Extract post/reel code and return embed URL
  }
  
  // ... and so on for each platform
}
```

## Usage

Simply add any supported video URL to the `relatedVideos` array in the admin panel:

```json
{
  "relatedVideos": [
    {
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "title": "YouTube Video"
    },
    {
      "url": "https://www.instagram.com/reel/ABC123/",
      "title": "Instagram Reel"
    },
    {
      "url": "https://www.tiktok.com/@user/video/123456",
      "title": "TikTok Video"
    }
  ]
}
```

## Implementation Location

**File:** `pages/HomePage.tsx`  
**Function:** `getEmbedUrl()` (lines ~263-330)

## Platform-Specific Notes

### Instagram
- Both Reels (`/reel/`) and Posts (`/p/`) are supported
- Uses Instagram's embed endpoint which requires the post code

### TikTok
- Uses TikTok's v2 embed API
- Requires the video ID from the URL path

### Facebook
- Uses Facebook's video plugin
- URL is encoded and passed as a parameter
- Works with both `facebook.com` and `fb.watch` shortened URLs

### Twitch
- Requires `parent` parameter set to the current hostname
- Supports both clips and VODs

## Production Ready

All platforms are tested and work inline without redirecting users away from your site. Videos play embedded directly on the page!
