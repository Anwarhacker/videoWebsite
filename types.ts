
export interface VideoData {
  id: string;
  url: string;
  title: string;
  description: string;
  author: string;
  tags: string[];
  category: string;
  thumbnail?: string;
  timestamp: number;
}

export interface GeminiAnalysisResponse {
  title: string;
  description: string;
  tags: string[];
  category: string;
}
