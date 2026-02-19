const asyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const Video = require('../models/Video');

const uploadVideo = asyncHandler(async (req, res) => {
  const { title, description, tags } = req.body;
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  const video = await Video.create({
    title,
    description,
    filePath: `/uploads/videos/${req.file.filename}`,
    teacher: req.user._id,
    tags: tags ? tags.split(',').map(t => t.trim()) : []
  });
  res.status(201).json(video);
});

const listVideos = asyncHandler(async (req, res) => {
  const videos = await Video.find().populate('teacher', 'name email');
  res.json(videos);
});

const getVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id).populate('teacher', 'name email');
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }
  res.json(video);
});

const updateVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }
  if (String(video.teacher) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Forbidden');
  }
  const { title, description, tags } = req.body;
  if (title) video.title = title;
  if (description) video.description = description;
  if (tags) video.tags = tags.split(',').map(t => t.trim());
  await video.save();
  res.json(video);
});

const deleteVideo = asyncHandler(async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (!video) {
    res.status(404);
    throw new Error('Video not found');
  }
  if (String(video.teacher) !== String(req.user._id)) {
    res.status(403);
    throw new Error('Forbidden');
  }
  // remove file from disk if it exists
  try {
    const filePath = path.join(__dirname, '..', video.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.error('Failed to delete video file:', e);
  }
  await video.deleteOne();
  res.json({ message: 'Video removed' });
});

module.exports = { uploadVideo, listVideos, getVideo, updateVideo, deleteVideo };