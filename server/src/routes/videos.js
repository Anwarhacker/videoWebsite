import express from 'express';
import {
  getAllVideos,
  getVideoById,
  createVideo,
  updateVideo,
  deleteVideo
} from '../controllers/videoController.js';

const router = express.Router();

// GET all videos
router.get('/', getAllVideos);

// GET single video
router.get('/:id', getVideoById);

// POST new video
router.post('/', createVideo);

// PUT update video
router.put('/:id', updateVideo);

// DELETE video
router.delete('/:id', deleteVideo);

export default router;
