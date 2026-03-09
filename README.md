# Assignment 4 - Full-stack Quiz Application

Full-stack quiz application với Node.js (Express + MongoDB) backend và React (Redux) frontend.

## 📁 Project Structure

- `backend/`: Node.js + Express + MongoDB API
- `frontend/`: React + Redux + React Router + Bootstrap 5 client

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
copy .env.example .env
# Update MONGO_URI and JWT_SECRET in .env
npm install
npm run seed    # Seed demo data
npm run dev     # Start dev server on port 5000
```

### 2. Frontend Setup

```bash
cd frontend
copy .env.example .env
npm install
npm run dev     # Start Vite dev server on port 5173
```

## 🔑 Demo Accounts (after seed)

- **Admin:** admin@example.com / 123456
- **User:** user@example.com / 123456

## ✨ Features

### Authentication & Authorization

- ✅ User signup, login, logout
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin vs Regular User)

### For Regular Users

- ✅ View available quizzes
- ✅ Take quizzes with multiple choice questions
- ✅ Submit answers and get score
- ✅ View quiz results

### For Admin Users

- ✅ **Manage Quizzes:** Create, Read, Update, Delete quizzes
- ✅ **Manage Questions:** Create, Read, Update, Delete questions
- ✅ Assign questions to quizzes
- ✅ View all quiz statistics

### Technical Stack

- **Backend:** Express.js, Mongoose, JWT, bcrypt
- **Frontend:** React 19, Redux Toolkit, React Router, Bootstrap 5, Axios
- **Database:** MongoDB
- **State Management:** Redux with async thunks
- **Styling:** Bootstrap 5

## 🌐 Deployment

Xem hướng dẫn deploy chi tiết tại: **[DEPLOYMENT.md](./DEPLOYMENT.md)**

Quick summary:

- Backend: Deploy lên Render/Railway với MongoDB Atlas
- Frontend: Deploy lên Vercel/Netlify
- Full CI/CD automation với GitHub

## 📂 Project Structure Details

```
backend/
├── src/
│   ├── config/         # Database config
│   ├── controllers/    # Route handlers
│   ├── middlewares/    # Auth, error handling
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   ├── app.js          # Express app
│   ├── server.js       # Server entry point
│   └── seed.js         # Database seeder
├── .env.example
└── package.json

frontend/
├── src/
│   ├── api/            # API client
│   ├── app/            # Redux store
│   ├── components/     # Reusable components
│   ├── features/       # Redux slices
│   ├── pages/          # Page components
│   ├── App.jsx
│   └── main.jsx
├── .env.example
└── package.json
```

## 🔧 Development Commands

### Backend

```bash
npm run dev      # Start with nodemon
npm start        # Start production
npm run seed     # Seed database
```

### Frontend

```bash
npm run dev      # Start Vite dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🐛 Troubleshooting

**Backend không kết nối MongoDB:**

- Check MongoDB đang chạy: `mongod --version`
- Verify MONGO_URI trong `.env`

**Frontend không gọi được API:**

- Check backend đang chạy trên port 5000
- Verify VITE_API_URL trong `.env`
- Check CORS configuration trong backend

**JWT errors:**

- Verify JWT_SECRET được set trong `.env`
- Check token expiration

## 📝 API Documentation

### Authentication Endpoints

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `POST /api/auth/logout` - Logout (protected)

### Quiz Endpoints (Protected)

- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes/:id/submit` - Submit quiz answers
- `POST /api/quizzes` - Create quiz (admin only)
- `PUT /api/quizzes/:id` - Update quiz (admin only)
- `DELETE /api/quizzes/:id` - Delete quiz (admin only)

### Question Endpoints (Admin Only)

- `GET /api/questions` - Get all questions
- `POST /api/questions` - Create question
- `PUT /api/questions/:id` - Update question
- `DELETE /api/questions/:id` - Delete question

## 🎯 Assignment Requirements Completed

✅ Express Server setup
✅ MongoDB with Mongoose models
✅ API endpoints for CRUD operations
✅ Validation and error handling
✅ React frontend with Redux
✅ Client-side routing with React Router
✅ Authentication (login, logout, signup)
✅ Role-based authorization
✅ Quiz display and interaction
✅ Bootstrap 5 styling

## 📸 Screenshots

See assignment instructions for expected UI screenshots.

## 🤝 Contributing

This is an assignment project. No contributions needed.

## 📄 License

Educational purpose only.
