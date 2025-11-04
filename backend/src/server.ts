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

dotenv.config();

const app = express();

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://web-carshowroom-frontend.vercel.app',
  'https://web-carshowroom-system.vercel.app',
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGINS
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || origin.includes('.vercel.app') || origin.includes('.up.railway.app')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) cb(null, true);
    else cb(new Error('เฉพาะไฟล์รูปภาพ (JPEG, JPG, PNG) และ PDF เท่านั้น'));
  },
});

// Logging
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health & Root
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date().toISOString() }));
app.get('/', (req, res) => res.json({ message: 'Car Showroom API is running', version: '1.0.0' }));

// Routes
app.use('/api', indexRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// 404 & Error
app.use((req: Request, res: Response) => res.status(404).json({ error: 'Not Found', path: req.path }));
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  if (err instanceof multer.MulterError) return res.status(400).json({ error: 'File Upload Error', message: err.message });
  if (err.message === 'Not allowed by CORS') return res.status(403).json({ error: 'CORS Error', message: err.message });
  res.status(err.status || 500).json({ error: err.name || 'Error', message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`Server running on port ${PORT}`);
  console.log(`API_URL: ${process.env.API_URL}`);
  console.log(`FRONTEND_URL: ${process.env.FRONTEND_URL}`);
  console.log('='.repeat(50));
});

export default app;