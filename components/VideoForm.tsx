
import React, { useState } from 'react';
import { analyzeVideoWithGemini } from '../services/geminiService';
import { VideoData } from '../types';

interface VideoFormProps {
  onAdd: (video: Omit<VideoData, 'id'>) => Promise<VideoData>;
  onClose: () => void;
}

const VideoForm: React.FC<VideoFormProps> = ({ onAdd, onClose }) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    try {
      setIsAnalyzing(true);
      setError(null);
      
      const analysis = await analyzeVideoWithGemini(url, title);
      
      const newVideo: Omit<VideoData, 'id'> = {
        url,
        title: analysis.title,
        description: analysis.description,
        author: author || 'Guest Contributor',
        tags: analysis.tags,
        category: category.trim() || analysis.category,
        timestamp: Date.now(),
      };

      await onAdd(newVideo);
      onClose();
    } catch (err) {
      console.error('Error adding video:', err);
      setError(err instanceof Error ? err.message : 'Failed to add video');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6">Add New Video</h2>
        
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-500/50 rounded-xl">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-zinc-400 mb-1.5">Video URL</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/..."
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-black border border-zinc-800 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-zinc-400 mb-1.5">Initial Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Optional"
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-black border border-zinc-800 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-zinc-400 mb-1.5">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Tech"
                className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-black border border-zinc-800 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-zinc-400 mb-1.5">Your Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Username"
              className="w-full px-3 py-2.5 sm:px-4 sm:py-3 bg-black border border-zinc-800 rounded-xl text-sm sm:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          
          <div className="flex gap-3 sm:gap-4 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-zinc-800 text-zinc-300 text-sm sm:text-base font-semibold hover:bg-zinc-700 transition-colors touch-target"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="flex-1 px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center touch-target"
            >
              {isAnalyzing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span className="hidden xs:inline">AI Processing...</span>
                  <span className="xs:hidden">Processing...</span>
                </div>
              ) : 'Add Video'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VideoForm;
