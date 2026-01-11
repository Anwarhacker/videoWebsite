import Video from '../models/Video.js';

// @desc    Get all videos
// @route   GET /api/videos
// @access  Public
export const getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ timestamp: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching videos', error: error.message });
  }
};

// @desc    Get single video by ID
// @route   GET /api/videos/:id
// @access  Public
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching video', error: error.message });
  }
};

// @desc    Create new video
// @route   POST /api/videos
// @access  Public
export const createVideo = async (req, res) => {
  try {
    const { url, title, description, author, tags, category, thumbnail, relatedVideos } = req.body;

    // Validation
    if (!url || !title || !description || !author || !category) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: url, title, description, author, category' 
      });
    }

    const video = await Video.create({
      url,
      title,
      description,
      author,
      tags: tags || [],
      category,
      thumbnail,
      relatedVideos: relatedVideos || [],
      timestamp: Date.now()
    });

    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ message: 'Error creating video', error: error.message });
  }
};

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Public
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedVideo);
  } catch (error) {
    res.status(400).json({ message: 'Error updating video', error: error.message });
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Public
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await Video.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Video deleted successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting video', error: error.message });
  }
};
