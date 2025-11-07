// src/server.ts
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import carRoutes from './routes/carRoutes';
import contactRoutes from './routes/contactRoutes';
import userRoutes from './routes/userRoutes';
import reportRoutes from './routes/reportRoutes';
import indexRoutes from './routes/index';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();

// === สร้างโฟลเดอร์ uploads ถ้ายังไม่มี ===
const uploadDir = process.env.UPLOAD_PATH || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// === CORS: ใช้จาก .env ===
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)
  .concat([
    'http://localhost:3000',
    'http://localhost:5173',
  ]);

app.use(
  cors({
    origin: (origin, callback) => {
      console.log(`[CORS] Request from: ${origin || 'no origin'}`);
      if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
        callback(null, true);
      } else {
        console.warn(`[CORS] Blocked: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);
app.options('*', cors());

// === Middleware ===
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(uploadDir));

// === Multer ===
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|pdf/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

// === Logging ===
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// === Health & Root ===
app.get('/health', (req, res) => {
  res.json({ status: 'OK', environment: process.env.NODE_ENV });
});

app.get('/', (req, res) => {
  res.json({
    message: 'Car Showroom API is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      cars: '/api/cars',
      contacts: '/api/contacts',
      users: '/api/users',
      reports: '/api/reports',
    },
  });
});

// === Routes ===
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// === 404 ===
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// === Error Handler ===
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  if (res.headersSent) return next(err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'Upload Error', message: err.message });
  }
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS Error', message: 'Origin not allowed' });
  }
  res.status(err.status || 500).json({
    error: err.name || 'Error',
    message: err.message || 'Internal Server Error',
  });
});

// === Start ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Frontend: ${process.env.FRONTEND_URL}`);
  console.log(`Backend: ${process.env.API_URL}`);
  console.log('='.repeat(50));
});

export default app;