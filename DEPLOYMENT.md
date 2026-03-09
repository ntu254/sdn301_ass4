# 🚀 Hướng Dẫn Deploy Assignment 4

Hướng dẫn deploy full-stack quiz application lên production.

## 📋 Yêu Cầu

- Node.js 16+ và npm
- MongoDB (local hoặc MongoDB Atlas)
- Git
- Hosting service (Render, Railway, Vercel, Netlify, etc.)

---

## 🗄️ PHẦN 1: DEPLOY BACKEND

### Option 1: Deploy lên Render (Miễn phí)

#### Bước 1: Chuẩn bị Backend

1. Đảm bảo file `package.json` có scripts:

```json
"scripts": {
  "start": "node src/server.js",
  "dev": "nodemon src/server.js",
  "seed": "node src/seed.js"
}
```

2. Tạo file `.gitignore` trong folder `backend`:

```
node_modules/
.env
.DS_Store
```

#### Bước 2: Setup MongoDB Atlas (Database Cloud)

1. Truy cập: https://www.mongodb.com/cloud/atlas
2. Tạo tài khoản miễn phí (Free Tier - M0)
3. Tạo một Cluster mới
4. Trong **Database Access**, tạo user với password
5. Trong **Network Access**, thêm IP: `0.0.0.0/0` (allow all)
6. Click **Connect** → **Connect your application**
7. Copy connection string, ví dụ:

```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/quiz_app?retryWrites=true&w=majority
```

#### Bước 3: Deploy Backend lên Render

1. Truy cập: https://render.com
2. Đăng ký tài khoản và đăng nhập
3. Click **New +** → **Web Service**
4. Connect với GitHub/GitLab hoặc deploy từ Git repository
5. Cấu hình:
   - **Name**: `ass4-quiz-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

6. Thêm **Environment Variables**:

   ```
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/quiz_app?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   ```

7. Click **Create Web Service**
8. Đợi deploy xong, copy URL backend (ví dụ: `https://ass4-quiz-backend.onrender.com`)

#### Bước 4: Seed Database (Optional)

Sau khi backend đã chạy, seed data bằng cách:

1. Vào Render Dashboard → Your Service → **Shell**
2. Chạy lệnh: `npm run seed`

Hoặc chạy local với MongoDB Atlas:

```bash
cd backend
# Update .env với MONGO_URI từ Atlas
npm run seed
```

---

### Option 2: Deploy Backend lên Railway

1. Truy cập: https://railway.app
2. Sign up với GitHub
3. Click **New Project** → **Deploy from GitHub repo**
4. Chọn repository và folder `backend`
5. Thêm MongoDB plugin hoặc dùng MongoDB Atlas
6. Thêm environment variables tương tự Option 1
7. Deploy tự động

---

## 🌐 PHẦN 2: DEPLOY FRONTEND

### Option 1: Deploy lên Vercel (Khuyên dùng cho Vite)

#### Bước 1: Chuẩn bị Frontend

1. Update file `.env` hoặc `.env.production`:

```env
VITE_API_URL=https://ass4-quiz-backend.onrender.com/api
```

2. Tạo file `.gitignore` trong folder `frontend`:

```
node_modules/
dist/
.env.local
.DS_Store
```

3. Đảm bảo `package.json` có:

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

#### Bước 2: Deploy lên Vercel

**Cách 1: Dùng Vercel CLI**

```bash
cd frontend
npm install -g vercel
vercel login
vercel
```

Khi được hỏi:

- Set up and deploy: `Y`
- Which scope: chọn account của bạn
- Link to existing project: `N`
- Project name: `ass4-quiz-frontend`
- In which directory: `./`
- Override settings: `N`

Sau đó thêm environment variable:

```bash
vercel env add VITE_API_URL production
# Nhập: https://ass4-quiz-backend.onrender.com/api
```

Deploy production:

```bash
vercel --prod
```

**Cách 2: Dùng Vercel Dashboard**

1. Truy cập: https://vercel.com
2. Sign up với GitHub
3. Click **Add New** → **Project**
4. Import repository của bạn
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Thêm Environment Variables:
   ```
   VITE_API_URL=https://ass4-quiz-backend.onrender.com/api
   ```
7. Click **Deploy**

---

### Option 2: Deploy Frontend lên Netlify

#### Bước 1: Build Frontend

```bash
cd frontend
npm run build
```

#### Bước 2: Tạo file `netlify.toml` trong folder `frontend`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### Bước 3: Deploy

**Cách 1: Netlify CLI**

```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

**Cách 2: Netlify Dashboard**

1. Truy cập: https://netlify.com
2. Drag & drop folder `dist` vào
3. Hoặc connect GitHub repository

Thêm Environment Variables trong **Site settings** → **Environment variables**:

```
VITE_API_URL=https://ass4-quiz-backend.onrender.com/api
```

---

## 🎯 PHẦN 2B: DEPLOY FULL-STACK TRÊN VERCEL (CẢ BACKEND & FRONTEND)

> **⚡ KHUYÊN DÙNG**: Đây là cách deploy ĐƠN GIẢN NHẤT - cả backend và frontend trong 1 project!

### Ưu điểm deploy full-stack trên Vercel:

- ✅ Chỉ cần 1 project, 1 domain
- ✅ Backend chạy dạng Serverless Functions (auto-scale)
- ✅ Free tier cực hào phóng (100GB bandwidth/month)
- ✅ HTTPS tự động
- ✅ Deploy nhanh (<1 phút)
- ✅ GitHub integration (auto deploy khi push)

### Hạn chế cần biết:

- ⚠️ Function timeout: 10s (Hobby), 60s (Pro)
- ⚠️ Cold start cho serverless functions
- ⚠️ Cần cấu trúc lại code một chút

---

### Bước 1: Cấu trúc lại Project

Tạo cấu trúc monorepo như sau:

```
Ass4/
├── api/                    # Backend API (Serverless Functions)
│   ├── index.js           # Main entry point
│   └── routes/            # Các routes
├── frontend/              # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
├── shared/                # Code dùng chung (optional)
│   ├── models/
│   └── utils/
├── vercel.json            # Vercel configuration
└── package.json           # Root package.json
```

---

### Bước 2: Chuyển Backend thành Serverless Functions

#### 2.1: Tạo file `api/index.js`:

```javascript
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

// Import routes
const authRoutes = require("../backend/src/routes/authRoutes");
const quizRoutes = require("../backend/src/routes/quizRoutes");
const questionRoutes = require("../backend/src/routes/questionRoutes");
const { notFound, errorHandler } = require("../backend/src/middlewares/error");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection với connection pooling cho serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  const connection = await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
  });

  cachedDb = connection;
  return connection;
}

// Connect to DB before handling request
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed" });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Backend is running on Vercel" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/questions", questionRoutes);

// Error handlers
app.use(notFound);
app.use(errorHandler);

// Export for Vercel
module.exports = app;
```

#### 2.2: Hoặc tạo file `api/[...all].js` (Catch-all route):

```javascript
// api/[...all].js
const app = require("./index");

module.exports = async (req, res) => {
  return app(req, res);
};
```

---

### Bước 3: Tạo file `vercel.json` ở root project:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Hoặc config đơn giản hơn:**

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "devCommand": "cd frontend && npm run dev",
  "installCommand": "npm install --prefix backend && npm install --prefix frontend",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ],
  "functions": {
    "api/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

---

### Bước 4: Update Frontend API URL

**frontend/.env.production:**

```env
VITE_API_URL=/api
```

Hoặc:

```env
VITE_API_URL=https://your-app.vercel.app/api
```

**frontend/src/api/client.js:**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

---

### Bước 5: Tạo `package.json` ở root (nếu chưa có):

```json
{
  "name": "ass4-fullstack",
  "version": "1.0.0",
  "scripts": {
    "install:backend": "cd backend && npm install",
    "install:frontend": "cd frontend && npm install",
    "install:all": "npm run install:backend && npm run install:frontend",
    "dev:backend": "cd backend && npm run dev",
    "dev:frontend": "cd frontend && npm run dev",
    "build": "cd frontend && npm run build",
    "vercel-build": "npm run build"
  },
  "dependencies": {
    "express": "^5.1.0",
    "mongoose": "^8.16.5",
    "cors": "^2.8.5",
    "dotenv": "^17.2.3",
    "bcryptjs": "^3.0.3",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0"
  }
}
```

---

### Bước 6: Deploy lên Vercel

#### Option A: Vercel Dashboard (Dễ nhất)

1. Truy cập: https://vercel.com
2. Sign up/Login với GitHub
3. Click **"Add New"** → **"Project"**
4. Import GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (để trống hoặc root)
   - **Build Command**: `npm run vercel-build` hoặc để mặc định
   - **Output Directory**: `frontend/dist`

6. **Environment Variables** - Thêm các biến:

   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/quiz_app
   JWT_SECRET=your_super_secret_key_here
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
   VITE_API_URL=/api
   ```

7. Click **"Deploy"**
8. Đợi 1-2 phút → Done! ✅

#### Option B: Vercel CLI

```bash
# Cài Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy từ root folder
vercel

# Deploy production
vercel --prod
```

Thêm environment variables:

```bash
vercel env add MONGO_URI production
vercel env add JWT_SECRET production
vercel env add JWT_EXPIRES_IN production
vercel env add NODE_ENV production
```

---

### Bước 7: Seed Database

Sau khi deploy xong:

**Option 1: Dùng Vercel CLI**

```bash
vercel env pull .env.local
cd backend
node src/seed.js
```

**Option 2: Chạy local với MongoDB Atlas**

```bash
cd backend
# Update .env với MONGO_URI production
npm run seed
```

**Option 3: Tạo API endpoint để seed**

```javascript
// api/seed.js (admin only, xóa sau khi dùng)
const connectDB = require("../backend/src/config/db");
const User = require("../backend/src/models/User");
// ... import models

module.exports = async (req, res) => {
  try {
    await connectDB();
    // ... seed logic
    res.json({ message: "Seeded successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

Truy cập: `https://your-app.vercel.app/api/seed`

---

### Bước 8: Test Deployment

1. Frontend: `https://your-app.vercel.app`
2. Backend API: `https://your-app.vercel.app/api/health`
3. Login: `https://your-app.vercel.app/login`

Test API:

```bash
curl https://your-app.vercel.app/api/health
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
```

---

### 🔧 Troubleshooting Vercel Full-Stack

#### Problem 1: API Routes không hoạt động

**Giải pháp:**

- Check `vercel.json` routes configuration
- Ensure API files are in `/api` folder
- Check function logs in Vercel dashboard

#### Problem 2: MongoDB Connection Timeout

**Giải pháp:**

```javascript
// Optimize connection for serverless
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  maxPoolSize: 10,
  minPoolSize: 5,
});
```

#### Problem 3: Cold Start chậm

**Giải pháp:**

- Dùng connection pooling
- Cache database connection
- Minimize dependencies
- Use Vercel Pro ($20/month) cho faster cold starts

#### Problem 4: Function Timeout (10s limit)

**Giải pháp:**

- Optimize database queries
- Add indexes to MongoDB
- Use Vercel Pro for 60s timeout
- Break long operations into smaller functions

---

### 💡 Tips cho Vercel Deployment

1. **Optimize MongoDB Connection:**

```javascript
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```

2. **Environment Variables:**
   - Never commit sensitive data
   - Use Vercel Environment Variables
   - Different vars for Preview vs Production

3. **Auto Deploy:**
   - Push to `main` branch → auto deploy production
   - Push to other branches → preview deployments
   - Pull requests → automatic preview URLs

4. **Custom Domain:**
   - Vercel Dashboard → Settings → Domains
   - Add your domain (free SSL included)

5. **Monitoring:**
   - Check function logs in Vercel Dashboard
   - Use Vercel Analytics (optional)
   - Monitor MongoDB Atlas metrics

---

### 📊 Vercel Full-Stack vs Separate Deployment

| Feature        | Vercel Full-Stack    | Separate (Render + Vercel) |
| -------------- | -------------------- | -------------------------- |
| Setup Time     | ⚡ 5 phút            | 🕐 10-15 phút              |
| Cost           | 💰 Free              | 💰 Free                    |
| Maintenance    | ✅ Dễ                | 🔧 Phức tạp hơn            |
| Performance    | ⚡ Fast (CDN)        | 🚀 Depends                 |
| Scalability    | 📈 Auto              | 📊 Limited on free         |
| Cold Start     | ❄️ ~1-2s             | ❄️ Render ~30s             |
| Function Limit | ⏱️ 10s (Hobby)       | ⏱️ No limit                |
| Best For       | 🎯 Small-Medium apps | 🎯 Long-running tasks      |

---

## 🔒 PHẦN 3: BẢO MẬT & TỐI ƯU

### 1. CORS Configuration (Backend)

Update `backend/src/app.js`:

```javascript
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://ass4-quiz-frontend.vercel.app",
      "https://your-custom-domain.com",
    ],
    credentials: true,
  }),
);
```

### 2. Environment Variables Best Practices

**Backend:**

- ❌ KHÔNG commit file `.env` lên Git
- ✅ Tạo `.env.example` với giá trị mẫu
- ✅ Dùng JWT_SECRET phức tạp (ít nhất 32 ký tự)
- ✅ Set NODE_ENV=production

**Frontend:**

- ✅ Prefix environment variables với `VITE_`
- ✅ Không lưu sensitive data trong frontend
- ✅ Sử dụng `.env.production` cho production

### 3. Database Optimization

- Tạo indexes cho các field thường query:

```javascript
// In models
userSchema.index({ email: 1 });
quizSchema.index({ createdBy: 1 });
questionSchema.index({ quiz: 1 });
```

---

## ✅ KIỂM TRA SAU KHI DEPLOY

### Backend Health Check:

```bash
curl https://ass4-quiz-backend.onrender.com/api/health
```

Response:

```json
{ "message": "Backend is running" }
```

### Test API Endpoints:

**1. Signup:**

```bash
curl -X POST https://ass4-quiz-backend.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"123456"}'
```

**2. Login:**

```bash
curl -X POST https://ass4-quiz-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"123456"}'
```

**3. Get Quizzes (với token):**

```bash
curl https://ass4-quiz-backend.onrender.com/api/quizzes \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Frontend Check:

1. Mở `https://your-frontend-url.vercel.app`
2. Test đăng ký, đăng nhập
3. Test làm quiz
4. Test admin features

---

## 🐛 TROUBLESHOOTING

### Problem 1: CORS Error

**Triệu chứng:** `Access-Control-Allow-Origin` error

**Giải pháp:**

- Kiểm tra backend CORS config
- Thêm frontend URL vào whitelist
- Đảm bảo dùng HTTPS cho cả backend và frontend

### Problem 2: Environment Variables Không Hoạt Động

**Giải pháp:**

- Restart service sau khi thêm env vars
- Check prefix `VITE_` cho frontend
- Rebuild frontend sau khi thay đổi env

### Problem 3: MongoDB Connection Failed

**Giải pháp:**

- Check MongoDB Atlas IP whitelist (0.0.0.0/0)
- Verify connection string format
- Check username/password có ký tự đặc biệt → encode URL

### Problem 4: Backend Sleep (Render Free Tier)

**Triệu chứng:** Request đầu tiên chậm (~30s)

**Giải pháp:**

- Render free tier sleep sau 15 phút không dùng
- Dùng cron job để ping mỗi 10 phút:
  - https://cron-job.org
  - Ping URL: `https://your-backend.onrender.com/api/health`

---

## 📊 MONITORING & LOGS

### Backend Logs (Render):

1. Vào Render Dashboard
2. Click vào service
3. Tab **Logs** để xem real-time logs

### Frontend Logs (Vercel):

1. Vào Vercel Dashboard
2. Click vào project
3. Tab **Deployments** → Click vào deployment → **Functions** logs

---

## 🔄 CI/CD AUTO DEPLOY

### Setup Auto Deploy:

1. **Backend (Render):**
   - Connected với GitHub
   - Mỗi lần push lên `main` branch → auto deploy

2. **Frontend (Vercel):**
   - Connected với GitHub
   - Mỗi lần push → auto build & deploy
   - Preview deployments cho pull requests

### Branch Strategy:

```
main (production)
  ↑
develop (staging)
  ↑
feature/xyz (development)
```

---

## 📝 DEMO ACCOUNTS

Sau khi seed database production:

- **Admin:** admin@example.com / 123456
- **User:** user@example.com / 123456

---

## 🎯 CHECKLIST TRƯỚC KHI SUBMIT

- [ ] Backend deployed và chạy ổn định
- [ ] Frontend deployed và kết nối được với backend
- [ ] Database có sample data (quizzes, questions, users)
- [ ] Test đăng ký user mới
- [ ] Test đăng nhập (admin & user)
- [ ] Test user thường làm quiz
- [ ] Test admin CRUD questions
- [ ] Test admin CRUD quizzes
- [ ] Test quiz submission và scoring
- [ ] Tất cả environment variables đúng
- [ ] CORS configured đúng
- [ ] Không có sensitive data trong code

---

## 📱 CUSTOM DOMAIN (Optional)

### Setup Custom Domain cho Frontend:

**Vercel:**

1. Domains → Add Domain
2. Nhập domain của bạn (ví dụ: quizapp.com)
3. Update DNS records theo hướng dẫn

**Netlify:**

1. Domain settings → Add custom domain
2. Follow DNS configuration

### Setup Custom Domain cho Backend:

**Render:**

1. Settings → Custom Domain
2. Add domain (ví dụ: api.quizapp.com)
3. Update DNS CNAME record

---

## 🔗 USEFUL LINKS

- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Render: https://render.com
- Vercel: https://vercel.com
- Netlify: https://netlify.com
- Railway: https://railway.app

---

## 💡 TIPS

1. **Free Tier Limits:**
   - Render: 750 hours/month (sleep sau 15 min)
   - Vercel: 100GB bandwidth/month
   - MongoDB Atlas: 512MB storage

2. **Cost Optimization:**
   - Dùng CDN cho static assets
   - Optimize images
   - Enable gzip compression
   - Minimize bundle size

3. **Security:**
   - Dùng HTTPS cho tất cả connections
   - Validate inputs
   - Rate limiting
   - JWT token expiration
   - Helmet.js cho security headers

---

Chúc bạn deploy thành công! 🎉
