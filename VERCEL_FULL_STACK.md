# 🚀 Deploy Full-Stack lên Vercel - Quick Guide

**Deploy CẢ backend + frontend trên 1 project Vercel duy nhất!**

## ⚡ TÓM TẮT 5 PHÚT

### 1️⃣ Setup MongoDB Atlas (2 phút)

```
1. https://mongodb.com/cloud/atlas → Sign up
2. Create Free Cluster (M0)
3. Database Access → Create user + password
4. Network Access → Add IP: 0.0.0.0/0
5. Connect → Copy connection string:
   mongodb+srv://user:pass@cluster.mongodb.net/quiz_app
```

### 2️⃣ Tạo vercel.json

Tạo file `vercel.json` ở root project:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/server.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "backend/src/server.js" },
    { "src": "/(.*)", "dest": "frontend/$1" }
  ]
}
```

### 3️⃣ Update Backend (Serverless-ready)

**backend/src/app.js** - Export app thay vì listen:

```javascript
// ... existing code ...

// REMOVE hoặc comment dòng này:
// app.listen(PORT, ...);

// THÊM export cho Vercel:
module.exports = app;
```

**backend/src/server.js** - Tạo handler cho Vercel:

```javascript
require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// Cache MongoDB connection cho serverless
let cachedDb = null;

const connectDatabase = async () => {
  if (cachedDb) {
    return cachedDb;
  }

  await connectDB();
  cachedDb = true;
  return cachedDb;
};

// Vercel serverless handler
module.exports = async (req, res) => {
  try {
    await connectDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({ message: "Database connection failed" });
  }
};

// Local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server running on port ${PORT}`);
  });
}
```

### 4️⃣ Update Frontend API URL

**frontend/.env.production:**

```env
VITE_API_URL=/api
```

**frontend/src/api/client.js:** (Nếu chưa có baseURL dynamic)

```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
});
```

### 5️⃣ Deploy trên Vercel

**Cách 1: Vercel Dashboard (Dễ nhất)**

```
1. https://vercel.com → Sign up với GitHub
2. New Project → Import repository
3. Framework: Vite
4. Root Directory: ./ (leave empty)
5. Environment Variables:
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret_32_chars_min
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
6. Deploy! ✅
```

**Cách 2: Vercel CLI**

```bash
npm install -g vercel
vercel login
vercel        # Deploy preview
vercel --prod # Deploy production
```

### 6️⃣ Seed Database

```bash
# Option 1: Local với production MongoDB
cd backend
# Copy MONGO_URI từ Vercel vào .env
npm run seed

# Option 2: Tạo seed endpoint (xóa sau khi dùng)
# Tạo file api/seed.js → deploy → visit /api/seed
```

### 7️⃣ Test

```
✅ Frontend: https://your-app.vercel.app
✅ Backend: https://your-app.vercel.app/api/health
✅ Login: admin@example.com / 123456
```

---

## 📁 CẤU TRÚC FILE CHO VERCEL

```
Ass4/
├── backend/
│   ├── src/
│   │   ├── app.js          # ← Export app thay vì listen
│   │   ├── server.js       # ← Handler cho Vercel
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   └── package.json
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── .env.production     # ← VITE_API_URL=/api
├── vercel.json             # ← Vercel config
└── package.json            # ← Root package (optional)
```

---

## 🔧 VERCEL.JSON - CẤU HÌNH ĐƠN GIẢN

**Option 1: Config đầy đủ**

```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/server.js",
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
      "dest": "backend/src/server.js"
    },
    {
      "handle": "filesystem"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/index.html"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Option 2: Config tối giản (Khuyên dùng)**

```json
{
  "version": 2,
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/backend/src/server.js"
    }
  ],
  "functions": {
    "backend/src/**/*.js": {
      "memory": 1024,
      "maxDuration": 10
    }
  }
}
```

---

## 🔥 BACKEND CHANGES - Chi tiết

### File: backend/src/app.js

**TRƯỚC:**

```javascript
const app = express();
// ... middleware and routes ...

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
```

**SAU:**

```javascript
const app = express();
// ... middleware and routes ...

// Export for Vercel serverless
module.exports = app;
```

### File: backend/src/server.js (TẠO MỚI hoặc MODIFY)

```javascript
require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

// MongoDB connection với caching cho serverless
let cachedConnection = null;

async function connectDB() {
  if (cachedConnection) {
    console.log("Using cached database connection");
    return cachedConnection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    });

    cachedConnection = conn;
    console.log("New database connection established");
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

// Vercel Serverless Handler
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Local development server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Local server running on http://localhost:${PORT}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start server:", error);
      process.exit(1);
    });
}
```

---

## 🆘 TROUBLESHOOTING

### ❌ API Routes trả về 404

**Nguyên nhân:** Routes config sai hoặc backend file path sai

**Fix:**

```json
// vercel.json - check đúng path
{
  "routes": [{ "src": "/api/(.*)", "dest": "backend/src/server.js" }]
}
```

### ❌ MongoDB Connection Error

**Nguyên nhân:** Connection string sai hoặc IP whitelist

**Fix:**

1. MongoDB Atlas → Network Access → Add IP: `0.0.0.0/0`
2. Check MONGO_URI format:
   ```
   mongodb+srv://user:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
   ```
3. Special characters trong password → encode URL

### ❌ Environment Variables không hoạt động

**Fix:**

1. Vercel Dashboard → Settings → Environment Variables
2. Add lại các variables
3. Redeploy: `vercel --prod` hoặc trigger trên dashboard

### ❌ Frontend không connect Backend

**Fix:**

```env
# frontend/.env.production
VITE_API_URL=/api  # ← Relative path, không cần domain
```

### ❌ CORS Error

**Fix:**

```javascript
// backend/src/app.js
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-app.vercel.app",
      process.env.FRONTEND_URL,
    ],
    credentials: true,
  }),
);
```

### ❌ Function Timeout (10s limit)

**Nguyên nhân:** Query MongoDB quá chậm

**Fix:**

1. Add indexes:
   ```javascript
   userSchema.index({ email: 1 });
   quizSchema.index({ createdBy: 1 });
   ```
2. Optimize queries:
   ```javascript
   .select('field1 field2') // Only select needed fields
   .lean() // Return plain JS objects
   ```
3. Upgrade to Vercel Pro ($20/month) → 60s timeout

---

## ✅ CHECKLIST DEPLOY

- [ ] MongoDB Atlas setup xong
- [ ] `vercel.json` đã tạo
- [ ] Backend `app.js` export app
- [ ] Backend `server.js` có Vercel handler
- [ ] Frontend `.env.production` set `VITE_API_URL=/api`
- [ ] Push code lên GitHub
- [ ] Vercel connected với GitHub repo
- [ ] Environment variables đã set trên Vercel
- [ ] Deploy thành công
- [ ] Database đã seed
- [ ] Test login works
- [ ] Test admin CRUD works
- [ ] Test user quiz works

---

## 💰 PRICING

| Plan  | Cost      | Bandwidth   | Functions | Timeout |
| ----- | --------- | ----------- | --------- | ------- |
| Hobby | FREE      | 100GB/month | Unlimited | 10s     |
| Pro   | $20/month | 1TB/month   | Unlimited | 60s     |

**Kết luận:** Free tier ĐỦ cho assignment! 🎉

---

## 🔗 Links Hữu Ích

- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas: https://mongodb.com/cloud/atlas
- Vercel + Express: https://vercel.com/guides/using-express-with-vercel
- Troubleshooting: https://vercel.com/docs/functions/troubleshooting

---

## 🎯 TÓM LẠI

**3 bước chính:**

1. Tạo `vercel.json` + modify backend cho serverless
2. Deploy lên Vercel + set env variables
3. Seed database + test

**Thời gian:** ~10 phút

**Kết quả:** 1 URL duy nhất cho cả frontend + backend! 🚀

---

Good luck! 🎉
