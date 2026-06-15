import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

import authRouter from './routes/auth';
import bookingsRouter from './routes/bookings';
import portfolioRouter from './routes/portfolio';
import blogsRouter from './routes/blogs';
import packagesRouter from './routes/packages';
import testimonialsRouter from './routes/testimonials';
import analyticsRouter from './routes/analytics';
import portalRouter from './routes/portal';
import { authenticateJWT, requireAdmin } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Serve local static file uploads
const uploadsDir = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Routes mapping
app.use('/api/auth', authRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/blogs', blogsRouter);
app.use('/api/packages', packagesRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/analytics', analyticsRouter);
app.use('/api/portal', portalRouter);

// Local file upload endpoint (Base64) - Admin only
app.post('/api/upload', authenticateJWT as any, requireAdmin as any, (req, res) => {
  const { name, base64 } = req.body;
  if (!name || !base64) {
    return res.status(400).json({ error: 'Name and base64 data are required' });
  }

  try {
    const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
    const buffer = Buffer.from(base64Data, 'base64');
    
    const filename = `${Date.now()}-${name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filepath = path.join(uploadsDir, filename);
    
    fs.writeFileSync(filepath, buffer);

    return res.json({ url: `http://localhost:5000/uploads/${filename}` });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to upload file' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`[Shutter Stories API] running on http://localhost:${PORT}`);
});
