
export interface RelatedVideo {
  url: string;
  title?: string;
  thumbnail?: string;
}

export interface VideoData {
  id: string;
  url: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  category: string;
  thumbnail?: string;
  relatedVideos?: RelatedVideo[];
  timestamp: number;
}

export interface GeminiAnalysisResponse {
  title: string;
  description: string;
  tags: string[];
  category: string;
}
