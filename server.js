const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 5001;

mongoose.set('strictQuery', false);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/social-media-task';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));


const submissionSchema = new mongoose.Schema({
  name: String,
  socialMediaHandle: String,
  images: [String],
});

const Submission = mongoose.model('Submission', submissionSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.post('/api/submissions', upload.array('images', 5), async (req, res) => {
  try {
    const { name, socialMediaHandle } = req.body;
    const images = req.files.map(file => `/uploads/${file.filename}`);

    const newSubmission = new Submission({
      name,
      socialMediaHandle,
      images,
    });

    await newSubmission.save();
    res.status(201).json({ message: 'Submission successful' });
  } catch (error) {
    console.error('Error creating submission:', error);
    res.status(500).json({ message: 'Error creating submission' });
  }
});

app.get('/api/submissions', async (req, res) => {
  try {
    const submissions = await Submission.find();
    const updatedSubmissions = submissions.map(sub => ({
      ...sub._doc,
      images: sub.images.map(img => img.replace('http://localhost:5001', ''))
    }));
    res.json(updatedSubmissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Error fetching submissions' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});