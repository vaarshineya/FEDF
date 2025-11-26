import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import symptomRoutes from './routes/symptoms.js';
import diseaseRoutes from './routes/diseases.js';
import medicalRecordRoutes from './routes/medicalRecords.js';
import mlRoutes from './routes/ml.js';

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'healthcare-backend',
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/ml', mlRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Healthcare Disease Prediction API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      symptoms: '/api/symptoms',
      diseases: '/api/diseases',
      medicalRecords: '/api/medical-records',
      ml: '/api/ml'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`\n🚀 Healthcare Backend Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
  console.log(`💊 Health check: http://localhost:${PORT}/health\n`);
});
