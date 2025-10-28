# 🚗 Web-Based Car Showroom Management System

<div align="center">

![Car Showroom](https://img.shields.io/badge/Car-Showroom-blue?style=for-the-badge)
![Full Stack](https://img.shields.io/badge/Full-Stack-green?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**Elevate your car browsing experience with an interactive showroom featuring smooth animations and modern design!**

[🌟 Live Demo](https://web-carshowroom-system-git-main-kyubeys-projects-6700978a.vercel.app?_vercel_share=DplffY10O1fU1kgQngHps8PZGDV7dhsZ) • [📂 Repository](https://github.com/Kyubey-kub/Web-Based-Car-Showroom-Management-System) • [📧 Contact](mailto:your-email@example.com)

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

- **Interactive 3D Car Viewer**: Powered by Three.js for immersive car visualization
- **Dynamic Sliders**: Smooth carousel animations using Framer Motion
- **Advanced Filtering**: Search and filter cars by brand, model, price, and specifications
- **Responsive Charts**: Visual analytics with Chart.js and React-Chartjs-2
- **Real-time Validation**: Form validation using Validator.js
- **Smooth Animations**: Enhanced user interactions with Framer Motion
- **Modern UI Components**: Built with React and styled using Tailwind CSS

### ⚙️ Backend Features

- **RESTful API**: Well-structured API endpoints for all operations
- **JWT Authentication**: Secure user authentication and authorization
- **File Upload**: Image management using Multer
- **Email Notifications**: Automated emails via Nodemailer
- **Real-time Communication**: WebSocket support for live updates
- **Password Encryption**: Secure password hashing with Bcrypt.js
- **CORS Enabled**: Cross-origin resource sharing configured
- **MySQL Database**: Robust data persistence with MySQL2

### 🔒 Security Features

- Password hashing and salting
- JWT token-based authentication
- Input validation and sanitization
- SQL injection prevention
- CORS configuration
- Environment variable protection

---

## 🎬 Demo

### 🌐 Live Application

Visit our live demo: [Web Car Showroom System](https://web-carshowroom-system-git-main-kyubeys-projects-6700978a.vercel.app?_vercel_share=DplffY10O1fU1kgQngHps8PZGDV7dhsZ)

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
| **MySQL2** | ^3.x | Database Driver |
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
- **Date-fns**: Date manipulation

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.x or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **MySQL** (v8.x or higher) - [Download](https://www.mysql.com/)
- **Git** - [Download](https://git-scm.com/)
- **Modern Web Browser** (Chrome, Firefox, Safari, Edge)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Kyubey-kub/Web-Based-Car-Showroom-Management-System.git
cd Web-Based-Car-Showroom-Management-System
```

#### 2. Setup Database

Create a MySQL database and import the schema:

```sql
CREATE DATABASE car_showroom;
USE car_showroom;
-- Import your database schema here
```

#### 3. Configure Backend

```bash
# Navigate to backend directory
cd web-carshowroom-Backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configurations
nano .env
```

**Backend Environment Variables (.env):**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=car_showroom
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d

# Email Configuration (for Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

#### 4. Configure Frontend

```bash
# Navigate to frontend directory
cd ../web-carshowroom-Frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configurations
nano .env
```

**Frontend Environment Variables (.env):**

```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=ws://localhost:5000

# App Configuration
VITE_APP_NAME=Car Showroom System
VITE_APP_VERSION=1.0.0
```

#### 5. Start the Application

**Terminal 1 - Backend Server:**

```bash
cd web-carshowroom-Backend
npm run dev
```

**Terminal 2 - Frontend Application:**

```bash
cd web-carshowroom-Frontend
npm run dev
```

**Access the Application:**

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

---

## 📁 Project Structure

```
Web-Based-Car-Showroom-Management-System/
│
├── web-carshowroom-Backend/          # Backend Application
│   ├── src/
│   │   ├── config/                   # Configuration files
│   │   │   ├── database.ts           # Database connection
│   │   │   └── email.ts              # Email configuration
│   │   ├── controllers/              # Request handlers
│   │   │   ├── authController.ts     # Authentication logic
│   │   │   ├── carController.ts      # Car CRUD operations
│   │   │   └── userController.ts     # User management
│   │   ├── middleware/               # Custom middleware
│   │   │   ├── auth.ts               # Authentication middleware
│   │   │   ├── upload.ts             # File upload middleware
│   │   │   └── errorHandler.ts       # Error handling
│   │   ├── models/                   # Database models
│   │   │   ├── Car.ts                # Car model
│   │   │   └── User.ts               # User model
│   │   ├── routes/                   # API routes
│   │   │   ├── authRoutes.ts         # Authentication routes
│   │   │   ├── carRoutes.ts          # Car routes
│   │   │   └── userRoutes.ts         # User routes
│   │   ├── services/                 # Business logic
│   │   │   ├── authService.ts        # Auth services
│   │   │   ├── carService.ts         # Car services
│   │   │   └── emailService.ts       # Email services
│   │   ├── utils/                    # Utility functions
│   │   │   ├── validation.ts         # Input validation
│   │   │   └── helpers.ts            # Helper functions
│   │   ├── types/                    # TypeScript types
│   │   │   └── index.ts              # Type definitions
│   │   └── server.ts                 # Entry point
│   ├── uploads/                      # Uploaded files
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Example environment file
│   ├── package.json                  # Backend dependencies
│   └── tsconfig.json                 # TypeScript configuration
│
├── web-carshowroom-Frontend/         # Frontend Application
│   ├── public/                       # Static assets
│   │   ├── images/                   # Image files
│   │   └── index.html                # HTML template
│   ├── src/
│   │   ├── components/               # React components
│   │   │   ├── common/               # Reusable components
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Modal.tsx
│   │   │   ├── car/                  # Car-related components
│   │   │   │   ├── CarCard.tsx
│   │   │   │   ├── CarDetail.tsx
│   │   │   │   └── CarList.tsx
│   │   │   ├── layout/               # Layout components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Sidebar.tsx
│   │   │   └── 3d/                   # 3D components
│   │   │       └── CarViewer.tsx
│   │   ├── pages/                    # Page components
│   │   │   ├── Home.tsx              # Homepage
│   │   │   ├── CarShowroom.tsx       # Car listing
│   │   │   ├── CarDetails.tsx        # Car details
│   │   │   ├── Dashboard.tsx         # Admin dashboard
│   │   │   ├── Login.tsx             # Login page
│   │   │   └── Register.tsx          # Registration page
│   │   ├── hooks/                    # Custom React hooks
│   │   │   ├── useAuth.ts            # Authentication hook
│   │   │   ├── useCars.ts            # Car data hook
│   │   │   └── useWebSocket.ts       # WebSocket hook
│   │   ├── services/                 # API services
│   │   │   ├── api.ts                # Axios configuration
│   │   │   ├── authService.ts        # Auth API calls
│   │   │   └── carService.ts         # Car API calls
│   │   ├── context/                  # React Context
│   │   │   ├── AuthContext.tsx       # Auth state management
│   │   │   └── CarContext.tsx        # Car state management
│   │   ├── utils/                    # Utility functions
│   │   │   ├── validation.ts         # Form validation
│   │   │   └── formatters.ts         # Data formatters
│   │   ├── types/                    # TypeScript types
│   │   │   └── index.ts              # Type definitions
│   │   ├── styles/                   # Global styles
│   │   │   └── index.css             # Tailwind imports
│   │   ├── App.tsx                   # Root component
│   │   └── main.tsx                  # Entry point
│   ├── .env                          # Environment variables
│   ├── .env.example                  # Example environment file
│   ├── package.json                  # Frontend dependencies
│   ├── tailwind.config.js            # Tailwind configuration
│   ├── tsconfig.json                 # TypeScript configuration
│   └── vite.config.ts                # Vite configuration
│
├── .gitignore                        # Git ignore rules
├── LICENSE                           # MIT License
└── README.md                         # Project documentation
```

---

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
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

{
  "brand": "Toyota",
  "model": "Camry",
  "year": 2024,
  "price": 35000,
  "description": "...",
  "images": [File]
}
```

#### Update Car (Admin Only)
```http
PUT /api/cars/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "price": 33000,
  "description": "Updated description"
}
```

#### Delete Car (Admin Only)
```http
DELETE /api/cars/:id
Authorization: Bearer <token>
```

---

## 🧪 Testing

### Frontend Testing

```bash
cd web-carshowroom-Frontend

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run E2E tests (if configured)
npm run test:e2e
```

### Backend Testing

```bash
cd web-carshowroom-Backend

# Run unit tests
npm test

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

### Manual Testing

1. **User Registration**: Test user signup with various inputs
2. **User Login**: Verify authentication flow
3. **Car Listing**: Check car display and filtering
4. **Car Details**: Test car detail page functionality
5. **Admin Functions**: Verify CRUD operations (Admin only)
6. **Responsive Design**: Test on multiple devices
7. **Performance**: Check loading times and animations

---

## 🚢 Deployment

### Frontend Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
cd web-carshowroom-Frontend
vercel --prod
```

### Backend Deployment Options

#### Option 1: Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

#### Option 2: Heroku
```bash
# Install Heroku CLI
npm install -g heroku

# Login and deploy
heroku login
heroku create your-app-name
git push heroku main
```

#### Option 3: DigitalOcean App Platform
- Push code to GitHub
- Connect repository to DigitalOcean
- Configure environment variables
- Deploy

### Database Deployment

**Recommended Services:**
- AWS RDS
- Google Cloud SQL
- PlanetScale
- Railway (includes MySQL)
- Heroku Postgres (if using PostgreSQL)

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Web-Based-Car-Showroom-Management-System.git
   ```

2. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

3. **Commit Your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```

4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```

5. **Open a Pull Request**

### Coding Standards

- Follow TypeScript best practices
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation when needed
- Write tests for new features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Kyubey-kub

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## 👤 Author

**Kyubey-kub**

- GitHub: [@Kyubey-kub](https://github.com/Kyubey-kub)
- Email: your.email@example.com
- Portfolio: [Your Portfolio URL]

---

## 🙏 Acknowledgments

- **Three.js Community** - For excellent 3D graphics library
- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Vercel** - For seamless frontend deployment
- **Open Source Community** - For countless amazing libraries and tools
- **Car Enthusiasts** - For inspiration and feedback

---

## 📈 Roadmap

- [ ] Add dark/light theme toggle
- [ ] Implement advanced search with AI
- [ ] Add car comparison feature
- [ ] Integrate payment gateway
- [ ] Add customer reviews and ratings
- [ ] Implement test drive booking system
- [ ] Add multi-language support
- [ ] Create mobile app version
- [ ] Add augmented reality (AR) car preview
- [ ] Implement chatbot for customer support

---

## 🐛 Known Issues

- Initial 3D model load time can be slow on slower connections
- Some animations may lag on older mobile devices
- File upload size is limited to 5MB per image

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Kyubey-kub/Web-Based-Car-Showroom-Management-System/issues) page
2. Open a new issue with detailed information
3. Contact the author directly

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Kyubey-kub](https://github.com/Kyubey-kub)

[⬆ Back to Top](#-web-based-car-showroom-management-system)

</div>
