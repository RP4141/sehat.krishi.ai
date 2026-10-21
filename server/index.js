import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';

import aiRoutes from './routes/ai.js';
import weatherRoutes from './routes/weather.js';
import mandiRoutes from './routes/mandi.js';
import schemesRoutes from './routes/schemes.js';
import farmRoutes from './routes/farm.js';
import authRoutes from './routes/auth.js';
import feedbackRoutes from './routes/feedback.js';
import adminRoutes from './routes/admin.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/mandi', mandiRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/farm', farmRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/admin', adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'SEHAT-KRISHI AI Backend',
    timestamp: new Date().toISOString(),
    version: '2.0.0-production'
  });
});

// Serve frontend build if dist folder exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// For SPA routing fallback if dist exists
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // If client not built yet, return informative status
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>SEHAT-KRISHI AI API</title></head>
          <body style="font-family: sans-serif; padding: 40px; background: #F0FDF4; color: #166534;">
            <h1>🌾 SEHAT-KRISHI AI Backend Running</h1>
            <p>API is active on port ${config.port}. For the multi-page frontend, run <code>npm run dev</code> or <code>npm run build</code>.</p>
          </body>
        </html>
      `);
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({
    success: false,
    error: 'SERVER_ERROR',
    message: err.message || 'An unexpected server error occurred.'
  });
});

const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`🌾 SEHAT-KRISHI AI Backend running at http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
