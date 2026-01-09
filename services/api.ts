import { VideoData } from '../types';

const API_BASE_URL = '/api';

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export const videoAPI = {
  // Get all videos
  getAll: async (): Promise<VideoData[]> => {
    return apiRequest<VideoData[]>('/videos');
  },

  // Get single video by ID
  getById: async (id: string): Promise<VideoData> => {
    return apiRequest<VideoData>(`/videos/${id}`);
  },

  // Create new video
  create: async (video: Omit<VideoData, 'id'>): Promise<VideoData> => {
    return apiRequest<VideoData>('/videos', {
      method: 'POST',
      body: JSON.stringify(video),
    });
  },

  // Update existing video
  update: async (id: string, video: Partial<VideoData>): Promise<VideoData> => {
    return apiRequest<VideoData>(`/videos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(video),
    });
  },

  // Delete video
  delete: async (id: string): Promise<void> => {
    return apiRequest<void>(`/videos/${id}`, {
      method: 'DELETE',
    });
  },
};

// Health check
export const checkServerHealth = async (): Promise<boolean> => {
  try {
    await apiRequest('/health');
    return true;
  } catch {
    return false;
  }
};
