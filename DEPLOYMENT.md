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
