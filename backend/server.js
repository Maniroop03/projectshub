const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Writable uploads folder for Vercel vs Local
const uploadDir = process.env.VERCEL 
  ? path.join('/tmp', 'uploads')
  : path.join(__dirname, 'uploads');

// Static uploads folder (support both paths)
app.use('/uploads', express.static(uploadDir));
app.use('/api/uploads', express.static(uploadDir));

// MongoDB Connection Helper (with caching for serverless)
let cachedDbConnection = null;
const connectDB = async () => {
  if (cachedDbConnection && mongoose.connection.readyState === 1) {
    return cachedDbConnection;
  }
  console.log('Connecting to MongoDB...');
  cachedDbConnection = await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ Connected to MongoDB');
  return cachedDbConnection;
};

// DB connection middleware — MUST be registered BEFORE routes
// so that every request has a live MongoDB connection
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    res.status(500).json({ error: 'Database connection error: ' + err.message });
  }
});

// Routes (registered after DB middleware)
app.use('/api/groups', require('./routes/groups'));
app.use('/api/guides', require('./routes/guides'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/whatsapp', require('./routes/whatsapp'));

// Health check
app.get('/', (req, res) => res.json({ message: 'Student Project API is running.' }));

// Start local server if run directly (not via require)
if (require.main === module || !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  connectDB()
    .then(() => {
      app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    })
    .catch((err) => {
      console.error('❌ Failed to start local server:', err.message);
    });
}

module.exports = app;

