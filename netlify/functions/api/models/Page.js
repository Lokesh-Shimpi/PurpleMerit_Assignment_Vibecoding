const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  id: { type: String, required: true },
  type: { type: String, enum: ['hero', 'features', 'gallery', 'contact'] },
  visible: { type: Boolean, default: true },
  content: { type: mongoose.Schema.Types.Mixed }
}, { _id: false });

const pageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    index: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  theme: {
    type: String,
    default: 'default',
  },
  sections: [sectionSchema],
  viewCount: {
    type: Number,
    default: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Page', pageSchema);
