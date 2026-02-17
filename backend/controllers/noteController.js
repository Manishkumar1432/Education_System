const asyncHandler = require('express-async-handler');
const Note = require('../models/Note');
const {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

// S3 Client with region-specific endpoint
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  endpoint: `https://s3.${process.env.AWS_REGION}.amazonaws.com`, // ← region-specific endpoint
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: false, // virtual-hosted style
});

// 🔹 CREATE NOTE
const cloudinary = require("../utils/cloudinary");
const streamifier = require("streamifier");

const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags } = req.body;
  console.log(title,content,tags);
  
  let fileUrl = null;

  if (req.file) {
    const uploadFromBuffer = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            resource_type: "auto", // Important for PDF
            folder: "notes_uploads",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await uploadFromBuffer();
    fileUrl = result.secure_url;
  }
console.log(fileUrl);

  const note = await Note.create({
    title,
    content,
    filePath: fileUrl,
    teacher: req.user._id,
    tags: tags ? tags.split(",").map((t) => t.trim()) : [],
  });

  res.status(201).json(note);
});

module.exports = { createNote };


// 🔹 GET ALL NOTES
const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find().populate('teacher', 'name');
  res.json(notes);
});

// 🔹 GET SINGLE NOTE
const getNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id).populate('teacher', 'name');
  if (!note) {
    res.status(404);
    throw new Error('Note not found');
  }
  res.json(note);
});

// 🔹 UPDATE NOTE
const updateNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) throw new Error('Note not found');
  if (String(note.teacher) !== String(req.user._id)) throw new Error('Forbidden');

  const { title, content, tags } = req.body;
  if (title) note.title = title;
  if (content) note.content = content;
  if (tags) note.tags = tags.split(',').map(t => t.trim());

  await note.save();
  res.json(note);
});

// 🔹 DELETE NOTE + S3 PDF
const deleteNote = asyncHandler(async (req, res) => {
  const note = await Note.findById(req.params.id);
  if (!note) throw new Error('Note not found');
  if (String(note.teacher) !== String(req.user._id)) throw new Error('Forbidden');

  if (note.filePath) {
    const url = new URL(note.filePath);
    const fileName = url.pathname.split('/').pop();

    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName
    }));
  }

  await note.deleteOne();
  res.json({ message: 'Note removed successfully' });
});

module.exports = {
  createNote,
  getNotes,
  getNote,
  updateNote,
  deleteNote,
};
