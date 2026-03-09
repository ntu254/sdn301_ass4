# 🚀 QUICK DEPLOY GUIDE - Assignment 4

## TÓM TẮT NHANH - 5 PHÚT DEPLOY

### 1️⃣ SETUP MONGODB ATLAS (2 phút)

```
1. Đăng ký MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. Tạo Cluster Free (M0)
3. Database Access → Create user (lưu username/password)
4. Network Access → Add IP: 0.0.0.0/0
5. Connect → Copy connection string
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/quiz_app
```

### 2️⃣ DEPLOY BACKEND - RENDER (2 phút)

```
1. Đăng ký Render: https://render.com
2. New → Web Service → Connect Git hoặc upload code
3. Settings:
   - Name: ass4-quiz-backend
   - Build: npm install
   - Start: npm start
4. Environment Variables:
   MONGO_URI=mongodb+srv://...
   JWT_SECRET=your_secret_key_min_32_chars
   JWT_EXPIRES_IN=7d
   NODE_ENV=production
5. Deploy → Copy URL: https://ass4-quiz-backend.onrender.com
```

### 3️⃣ DEPLOY FRONTEND - VERCEL (1 phút)

```
1. Đăng ký Vercel: https://vercel.com
2. Import Git repository hoặc drag & drop folder frontend
3. Settings:
   - Framework: Vite
   - Root: frontend
   - Build: npm run build
   - Output: dist
4. Environment Variable:
   VITE_API_URL=https://ass4-quiz-backend.onrender.com/api
5. Deploy → Copy URL: https://ass4-quiz-frontend.vercel.app
```

### 4️⃣ SEED DATABASE

```bash
# Cách 1: Render Shell
Vào Render Dashboard → Service → Shell
npm run seed

# Cách 2: Local với MongoDB Atlas
cd backend
# Update .env với MONGO_URI từ Atlas
npm run seed
```

### 5️⃣ TEST

```
1. Mở frontend URL
2. Login: admin@example.com / 123456
3. Test CRUD quizzes và questions
4. Logout → Login: user@example.com / 123456
5. Test làm quiz
```

---

## 🔥 ALTERNATIVE - RAILWAY (Dễ hơn)

### Backend + Database cùng lúc:

```
1. Đăng ký Railway: https://railway.app
2. New Project → Deploy from GitHub
3. Add MongoDB plugin (auto setup!)
4. Add env variables (Railway tự set MONGO_URI)
5. Done!
```

---

## ⚡ FASTEST WAY - ALL IN ONE

### Sử dụng Railway cho FULL STACK:

```bash
# Cài Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy backend
cd backend
railway init
railway up
railway variables set JWT_SECRET=your_secret_key

# Deploy frontend
cd ../frontend
railway init
railway up
railway variables set VITE_API_URL=https://your-backend-url.railway.app/api
```

---

## 📋 CHECKLIST 5 PHÚT

- [ ] MongoDB Atlas cluster đã tạo (30s)
- [ ] Backend deployed (Render/Railway) (1 phút)
- [ ] Frontend deployed (Vercel/Netlify) (30s)
- [ ] Environment variables đã set (30s)
- [ ] Database đã seed (30s)
- [ ] Test login & features (2 phút)

---

## 🆘 FIX LỖI NHANH

### Backend không chạy:

```bash
# Check logs
# Render: Dashboard → Service → Logs
# Railway: Dashboard → Deployments → View Logs

# Common issues:
- Missing env vars → Add lại
- MongoDB connection → Check IP whitelist 0.0.0.0/0
- Port binding → Railway auto, Render dùng process.env.PORT
```

### Frontend không connect backend:

```bash
# Check VITE_API_URL
# Must include /api at the end
# Must be HTTPS for production

# Rebuild sau khi change env:
vercel --prod
# hoặc trigger redeploy on dashboard
```

### CORS error:

```javascript
// backend/src/app.js
app.use(
  cors({
    origin: ["http://localhost:5173", "https://your-frontend.vercel.app"],
  }),
);
```

---

## 💰 FREE TIER LIMITS

| Service       | Limit           | Note                        |
| ------------- | --------------- | --------------------------- |
| MongoDB Atlas | 512MB           | Đủ cho assignment           |
| Render        | 750h/month      | Sleep sau 15 min không dùng |
| Vercel        | 100GB bandwidth | Unlimited deployments       |
| Railway       | $5 credit/month | ~500 hours                  |

---

## 🎓 TIPS CHO ĐIỂM CAO

1. ✅ Custom domain (optional nhưng pro)
2. ✅ HTTPS everywhere
3. ✅ Error handling tốt
4. ✅ Loading states trong UI
5. ✅ Responsive design
6. ✅ Sample data đầy đủ
7. ✅ README rõ ràng
8. ✅ Git commits có ý nghĩa

---

## 📞 SUPPORT

Chi tiết đầy đủ: [DEPLOYMENT.md](./DEPLOYMENT.md)

Good luck! 🎉
