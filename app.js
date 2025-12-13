import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import productRoutes from './routes/productRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// JSON Logger middleware
app.use((req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = {
      code: res.statusCode,
      method: req.method,
      host: req.hostname,
      path: req.originalUrl,
      duration: duration,
      contentLength: res.get('content-length') || null
    };
    console.log(JSON.stringify(log));
  });

  next();
});

// Serve static files from public directory
app.use(express.static(join(__dirname, 'public')));

// Routes
app.use('/api', productRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`
  });
});

// Error handling middleware
const errorHandler = (err, req, res) => {
  console.error('Error:', err.message);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
};

app.use(errorHandler);

export default app;
