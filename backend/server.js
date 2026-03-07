const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.ALLOWED_ORIGIN,          // your Vercel frontend URL
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.some(o => origin.startsWith(o))) cb(null, true);
    else cb(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

const authRoutes = require('./routes/auth');
const emailRoutes = require('./routes/email');

app.use('/api/auth', authRoutes);
app.use('/api', emailRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'AI Email Reply Generator API is running 🚀',
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

const PORT = process.env.PORT || 5000;

async function connectDB() {
  // Try primary URI first (local or Atlas from .env)
  if (process.env.MONGODB_URI && !process.env.MONGODB_URI.includes('127.0.0.1')) {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ MongoDB Atlas connected');
      return;
    } catch (err) {
      console.log('⚠️  Atlas connection failed, trying local...');
    }
  }

  // Try local MongoDB
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/emailgen');
    console.log('✅ Local MongoDB connected');
    return;
  } catch (err) {
    console.log('⚠️  Local MongoDB not found, starting in-memory server...');
  }

  // Fallback: in-memory MongoDB (development only)
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log('✅ In-memory MongoDB started (data resets on server restart)');
    console.log('💡 For persistent data: install MongoDB locally or add Atlas URI to .env');
  } catch (err) {
    console.error('❌ All DB options failed:', err.message);
  }
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

connectDB();


