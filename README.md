# 🚗 Web-Based Car Showroom Management System

<div align="center">

![Car Showroom](https://img.shields.io/badge/Car-Showroom-blue?style=for-the-badge)
![Full Stack](https://img.shields.io/badge/Full-Stack-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**Elevate your car browsing experience with an interactive showroom featuring smooth animations and modern design!**

[🌟 Live Demo](https://web-carshowroom-system-git-main-kyubeys-projects-6700978a.vercel.app?_vercel_share=DplffY10O1fU1kgQngHps8PZGDV7dhsZ) • [📂 Repository](https://github.com/Kyubey-kub/Web-Based-Car-Showroom-Management-System) • [📧 Contact](mailto:somprasongwasuwid@gmail.com)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Technologies Used](#-technologies-used)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)

---

## 🎯 Overview

**Web-Based Car Showroom Management System** is a comprehensive full-stack web application designed to revolutionize the online car browsing and management experience. This platform combines elegant UI/UX design with powerful backend functionality to create an immersive digital showroom environment.

### Why This Project?

This application addresses the growing need for digital transformation in the automotive retail industry by providing:

- **Enhanced User Experience**: Intuitive interface with smooth animations and transitions
- **Comprehensive Management**: Complete CRUD operations for car inventory
- **Real-time Updates**: Live data synchronization across all users
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices
- **Scalable Architecture**: Built with modern technologies for easy expansion

---

## ✨ Features

### 🎨 Frontend Features

- **Interactive 3D Car Viewer**: Powered by Three.js for immersive car visualization with Lamborghini Veneno model
- **Dynamic Sliders**: Smooth carousel animations using Framer Motion
- **Advanced Filtering**: Search and filter cars by brand, model, price, and specifications
- **Responsive Charts**: Visual analytics with Chart.js and React-Chartjs-2
- **Real-time Validation**: Form validation using Validator.js
- **Smooth Animations**: Enhanced user interactions with Framer Motion
- **Modern UI Components**: Built with React and styled using Tailwind CSS
- **User Dashboard**: Personal booking management and car browsing history
- **Admin Panel**: Comprehensive management interface for inventory and users
- **Review System**: Customer reviews and ratings for cars

### ⚙️ Backend Features

- **RESTful API**: Well-structured API endpoints for all operations
- **JWT Authentication**: Secure user authentication and authorization
- **File Upload**: Image management using Multer
- **Email Notifications**: Automated emails via Nodemailer
- **Real-time Communication**: WebSocket support for live updates
- **Password Encryption**: Secure password hashing with Bcrypt.js
- **CORS Enabled**: Cross-origin resource sharing configured
- **PostgreSQL Database**: Robust data persistence with PostgreSQL via Neon
- **Booking System**: Complete booking management with status tracking
- **Contact Management**: Handle customer inquiries and feedback
- **Report Generation**: Generate comprehensive reports for business insights
- **Brand Management**: Organize cars by manufacturer brands

### 🔒 Security Features

- Password hashing and salting
- JWT token-based authentication
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Environment variable protection
- Role-based access control (Admin/User)

---

## 🎬 Demo

### 🌐 Live Application

Visit our live demo: [Web Car Showroom System](https://web-carshowroom-system-git-main-kyubeys-projects-6700878a.vercel.app?_vercel_share=DplffY10O1fU1kgQngHps8PZGDV7dhsZ)

### 📸 Screenshots

> Add your application screenshots here

---

## 🛠 Technologies Used

### Frontend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | ^18.x | UI Component Library |
| **TypeScript** | ^5.x | Type-safe JavaScript |
| **Vite** | ^5.x | Build Tool & Dev Server |
| **Tailwind CSS** | ^3.x | Utility-first CSS Framework |
| **Three.js** | ^0.x | 3D Graphics Library |
| **React Three Fiber** | ^8.x | React Renderer for Three.js |
| **Framer Motion** | ^11.x | Animation Library |
| **Chart.js** | ^4.x | Data Visualization |
| **Axios** | ^1.x | HTTP Client |
| **React Router** | ^6.x | Client-side Routing |

### Backend Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | ^18.x | Runtime Environment |
| **Express** | ^4.x | Web Framework |
| **TypeScript** | ^5.x | Type-safe JavaScript |
| **pg (node-postgres)** | ^8.x | PostgreSQL Database Driver |
| **JWT** | ^9.x | Authentication |
| **Bcrypt.js** | ^2.x | Password Hashing |
| **Multer** | ^1.x | File Upload |
| **Nodemailer** | ^6.x | Email Service |
| **WebSocket (ws)** | ^8.x | Real-time Communication |
| **CORS** | ^2.x | Cross-Origin Resource Sharing |
| **Validator** | ^13.x | Data Validation |
| **Dotenv** | ^16.x | Environment Variables |

### Development Tools

- **ESLint**: Code linting and quality
- **Nodemon**: Auto-restart development server
- **ts-node**: TypeScript execution
- **PostCSS**: CSS processing
- **Yarn**: Alternative package manager

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Kyubey-kub/Web-Based-Car-Showroom-Management-System.git
cd Web-Based-Car-Showroom-Management-System
```

#### 2. Setup PostgreSQL Database (Neon)

1. **Create Neon Account**: Go to [Neon.tech](https://neon.tech/) and sign up
2. **Create New Project**: 
   - Click "New Project"
   - Name: `car-showroom`
   - Region: Choose closest to your users (e.g., AWS US East, EU West)
3. **Get Connection String**: 
   - Copy the connection string (it looks like: `postgresql://user:password@host.neon.tech/dbname?sslmode=require`)
4. **Import Database Schema**:

```bash
# Install PostgreSQL client (if not installed)
# For macOS
brew install postgresql

# For Ubuntu/Debian
sudo apt-get install postgresql-client

# Connect to your Neon database
psql "postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# In psql prompt, import schema
\i backend/db/schema.sql

# Or directly from command line
psql "postgresql://user:password@host.neon.tech/dbname?sslmode=require" < backend/db/schema.sql
```

**Note**: Update `backend/db/schema.sql` to use PostgreSQL syntax instead of MySQL syntax.

#### 3. Configure Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file in backend/src directory
cp src/.env.example src/.env

# Edit .env with your configurations
nano src/.env
```

**Backend Environment Variables (backend/src/.env):**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# PostgreSQL Database Configuration (Neon)
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require
# Alternative individual variables
DB_HOST=host.neon.tech
DB_USER=your_neon_username
DB_PASSWORD=your_neon_password
DB_NAME=car_showroom
DB_PORT=5432
DB_SSL=true

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters_long
JWT_EXPIRE=7d

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=../uploads
```

#### 4. Configure Frontend

```bash
# Navigate to frontend directory from root
cd ../frontend

# Install dependencies
npm install
# or
yarn install

# Create .env file
cp .env.example .env

# Edit .env with your configurations
nano .env
```

**Frontend Environment Variables (frontend/.env):**

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=ws://localhost:5000

# App Configuration
VITE_APP_NAME=Car Showroom System
VITE_APP_VERSION=1.0.0
```

**Production Environment Variables (frontend/.env.production):**

```env
# API Configuration for Production
VITE_API_URL=https://your-render-backend.onrender.com/api
VITE_SOCKET_URL=wss://your-render-backend.onrender.com

# App Configuration
VITE_APP_NAME=Car Showroom System
VITE_APP_VERSION=1.0.0
```

#### 5. Update Database Connection Code

**Update `backend/src/config/db.ts` for PostgreSQL:**

```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  // Alternative configuration
  // host: process.env.DB_HOST,
  // user: process.env.DB_USER,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  // port: parseInt(process.env.DB_PORT || '5432'),
  // ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL database:', err.stack);
  } else {
    console.log('✅ Connected to PostgreSQL database (Neon)');
    release();
  }
});

export default pool;
```

**Update queries to use PostgreSQL syntax ($1, $2 instead of ?):**

```typescript
// MySQL style (OLD)
const [rows] = await connection.execute('SELECT * FROM cars WHERE id = ?', [id]);

// PostgreSQL style (NEW)
const result = await pool.query('SELECT * FROM cars WHERE id = $1', [id]);
const rows = result.rows;
```

#### 6. Start the Application

**Terminal 1 - Backend Server:**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend Application:**

```bash
cd frontend
npm run dev
# or
yarn dev
```

**Access the Application:**

- Frontend: `http://localhost:5173` (Vite default port)
- Backend API: `http://localhost:5000`

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

The project is configured for Vercel deployment with `vercel.json`:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
cd frontend
vercel --prod
```

**Important Notes:**
- Ensure `.env.production` is properly configured
- Update `VITE_API_URL` to point to your Render backend URL
- Vercel automatically builds from the `dist` folder
- Make sure all environment variables are set in Vercel dashboard

### Backend Deployment (Render)

#### Step-by-Step Render Deployment:

1. **Push Code to GitHub** (if not already done)
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

2. **Create Render Account**
   - Go to [Render.com](https://render.com/)
   - Sign up with GitHub

3. **Create Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository: `Web-Based-Car-Showroom-Management-System`

4. **Configure Service Settings**
   - **Name**: `car-showroom-backend` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for better performance)

5. **Environment Variables** (Click "Advanced" → "Add Environment Variable")

Add all these variables:

```env
NODE_ENV=production
PORT=5000

# PostgreSQL (Neon) - Use your connection string
DATABASE_URL=postgresql://user:password@host.neon.tech/dbname?sslmode=require

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
JWT_EXPIRE=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# CORS (Update after Vercel deployment)
CORS_ORIGIN=https://your-vercel-app.vercel.app

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=/tmp/uploads
```

6. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (usually 2-5 minutes)
   - Your backend will be available at: `https://your-app-name.onrender.com`

7. **Update Frontend Environment Variables**
   - Go to Vercel Dashboard
   - Update `VITE_API_URL` to: `https://your-app-name.onrender.com/api`
   - Redeploy frontend

#### Render Configuration File (Optional)

Create `render.yaml` in root directory:

```yaml
services:
  - type: web
    name: car-showroom-backend
    env: node
    region: oregon
    plan: free
    buildCommand: cd backend && npm install && npm run build
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ORIGIN
        sync: false
```

### Database Setup (Neon PostgreSQL)

#### Already Created in Step 2, but here's additional info:

**Neon Benefits:**
- ✅ Serverless PostgreSQL
- ✅ Automatic scaling
- ✅ Generous free tier (3 GB storage)
- ✅ Instant database branching
- ✅ Built-in connection pooling
- ✅ No cold starts

**Neon Dashboard:**
1. **Monitor Usage**: Track queries, storage, and connections
2. **Database Branches**: Create dev/staging branches
3. **Connection Pooling**: Enable for better performance
4. **Backups**: Automatic point-in-time recovery

**Connection String Format:**
```
postgresql://username:password@ep-xxx-xxx.region.aws.neon.tech/dbname?sslmode=require
```

### Post-Deployment Checklist

#### Backend (Render):
- [ ] Service is running without errors
- [ ] Database connection successful
- [ ] Environment variables are set correctly
- [ ] API endpoints are accessible
- [ ] Health check endpoint works (`/api/health`)
- [ ] CORS is configured for frontend domain
- [ ] Logs show no critical errors

#### Frontend (Vercel):
- [ ] Build successful
- [ ] Environment variables configured
- [ ] API calls work correctly
- [ ] 3D models load properly
- [ ] All pages render correctly
- [ ] Authentication works
- [ ] File uploads work

#### Database (Neon):
- [ ] Schema imported successfully
- [ ] Tables created correctly
- [ ] Indexes are in place
- [ ] Connection pooling enabled
- [ ] SSL connection verified

### Monitoring and Maintenance

**Render Monitoring:**
- View logs in Render dashboard
- Set up health check endpoint
- Enable auto-deploy from GitHub
- Monitor resource usage

**Neon Monitoring:**
- Track query performance
- Monitor storage usage
- Review connection stats
- Set up usage alerts

### Troubleshooting Deployment Issues

**Common Render Issues:**

1. **Build Fails**
   - Check Node.js version compatibility
   - Verify all dependencies in package.json
   - Check build logs for specific errors

2. **Database Connection Fails**
   - Verify DATABASE_URL is correct
   - Ensure SSL is enabled: `?sslmode=require`
   - Check Neon database is active

3. **App Crashes After Deploy**
   - Check start command is correct
   - Verify all required env variables are set
   - Review application logs

4. **CORS Errors**
   - Update CORS_ORIGIN with Vercel URL
   - Redeploy after changing env variables

**Common Neon Issues:**

1. **Connection Timeout**
   - Enable connection pooling
   - Check network settings
   - Verify SSL configuration

2. **Query Performance**
   - Add indexes to frequently queried columns
   - Use prepared statements
   - Enable query caching

### Cost Estimation

**Free Tier (Perfect for Development/Portfolio):**
- **Render**: 750 hours/month free (services sleep after 15 min inactivity)
- **Neon**: 3 GB storage, unlimited compute hours
- **Vercel**: Unlimited bandwidth for personal projects
- **Total**: $0/month

**Paid Plans (For Production):**
- **Render Starter**: $7/month (no sleep, better performance)
- **Neon Pro**: $19/month (10 GB, enhanced features)
- **Vercel Pro**: $20/month (priority builds, analytics)
- **Total**: ~$46/month for production-ready setup

---

## 📡 API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production: https://your-render-backend.onrender.com/api
```

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Get Current User

```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Car Endpoints

#### Get All Cars

```http
GET /api/cars?page=1&limit=10&brand=Toyota&minPrice=20000&maxPrice=50000
```

#### Get Single Car

```http
GET /api/cars/:id
```

#### Create Car (Admin Only)

```http
POST /api/cars
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Update Car (Admin Only)

```http
PUT /api/cars/:id
Authorization: Bearer <token>
```

#### Delete Car (Admin Only)

```http
DELETE /api/cars/:id
Authorization: Bearer <token>
```

---

## 🔍 PostgreSQL Migration Notes

### Key Differences from MySQL

**1. Syntax Changes:**
```sql
-- MySQL
SELECT * FROM cars WHERE id = ?;
AUTO_INCREMENT

-- PostgreSQL
SELECT * FROM cars WHERE id = $1;
SERIAL or GENERATED ALWAYS AS IDENTITY
```

**2. Data Types:**
```sql
-- MySQL: TINYINT, TEXT
-- PostgreSQL: SMALLINT, TEXT (similar)

-- MySQL: DATETIME
-- PostgreSQL: TIMESTAMP or TIMESTAMPTZ (with timezone)
```

**3. String Concatenation:**
```sql
-- MySQL
SELECT CONCAT(first_name, ' ', last_name)

-- PostgreSQL
SELECT first_name || ' ' || last_name
```

**4. Limit/Offset:**
```sql
-- MySQL
SELECT * FROM cars LIMIT 10 OFFSET 20;

-- PostgreSQL (same syntax, but more features)
SELECT * FROM cars LIMIT 10 OFFSET 20;
```

### Update SQL Schema for PostgreSQL

Create `backend/db/schema_postgresql.sql`:

```sql
-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars Table
CREATE TABLE IF NOT EXISTS cars (
  id SERIAL PRIMARY KEY,
  brand VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  images TEXT,
  specifications JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts Table
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subject VARCHAR(200),
  message TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews Table
CREATE TABLE IF NOT EXISTS reviews (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  car_id INTEGER REFERENCES cars(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Brands Table
CREATE TABLE IF NOT EXISTS brands (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  logo_url VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_cars_brand ON cars(brand);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_car ON bookings(car_id);
CREATE INDEX idx_reviews_car ON reviews(car_id);

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cars_updated_at
  BEFORE UPDATE ON cars
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

### 1. Fork the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Web-Based-Car-Showroom-Management-System.git
cd Web-Based-Car-Showroom-Management-System
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/AmazingFeature
```

### 3. Make Your Changes

- Follow the existing code style
- Add comments for complex logic
- Update documentation if needed
- Write tests for new features

### 4. Commit Your Changes

```bash
git add .
git commit -m 'feat: Add some AmazingFeature'
```

### 5. Push to the Branch

```bash
git push origin feature/AmazingFeature
```

### 6. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Kyubey-kub (Somprasong Wasuwid)**

- [![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Kyubey-kub)
- [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/somprasong-wasuwid-271b64350/)
- [![Portfolio](https://img.shields.io/badge/Portfolio-FF5722?style=for-the-badge&logo=todoist&logoColor=white)](https://imaginative-dusk-9f95ff.netlify.app/#home)
- [![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:somprasongwasuwid@gmail.com)

---

## 🙏 Acknowledgments

- **Render** - For excellent backend hosting platform
- **Neon** - For serverless PostgreSQL database
- **Vercel** - For seamless frontend deployment
- **Three.js Community** - For 3D graphics library
- **React Team** - For the amazing framework
- **Open Source Community** - For countless amazing libraries

---

<div align="center">

**⭐ If you found this project helpful, please consider giving it a star!**

**💖 Thank you for visiting!**

Made with ❤️ by [Kyubey-kub](https://github.com/Kyubey-kub)

**Last Updated:** November 2024

[⬆ Back to Top](#-web-based-car-showroom-management-system)

</div>
