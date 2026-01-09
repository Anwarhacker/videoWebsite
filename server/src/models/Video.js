import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Video URL is required'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Video title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Video description is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  thumbnail: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Number,
    default: () => Date.now()
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Index for faster queries
videoSchema.index({ category: 1 });
videoSchema.index({ timestamp: -1 });

const Video = mongoose.model('Video', videoSchema);

export default Video;
