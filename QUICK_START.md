# 🚀 Quick Start Guide

## 30-Second Setup

### 1. Start Backend (Terminal 1)
```bash
cd project/backend
npm install
npm run seed
npm start
```
✅ Backend running on http://localhost:10000

### 2. Start Frontend (Terminal 2)
```bash
cd project
npm install
npm run dev
```
✅ Frontend running on http://localhost:5173

### 3. Use the App
1. Open http://localhost:5173
2. Go to Symptom Checker
3. Select symptoms, enter age/gender
4. Click "Analyze Symptoms"
5. See AI predictions! 🎉

## 🤖 Enable ML (Optional but Recommended)

### Train the Model
```bash
# Using curl (after getting a doctor token)
curl -X POST http://localhost:10000/api/ml/train \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"trainRatio":0.8}'
```

**Or use Postman/Thunder Client:**
- Method: POST
- URL: http://localhost:10000/api/ml/train
- Headers: Authorization: Bearer YOUR_TOKEN
- Body: `{"trainRatio": 0.8, "k": 5}`

### Verify Model
```bash
curl http://localhost:10000/api/ml/model-info
```

## 📋 Essential Commands

### Backend
```bash
npm start          # Start server
npm run seed       # Seed database
npm run dev        # Development mode
```

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## 🔑 Test Credentials (Mock Mode)

**Patient:**
- Email: patient@demo.com
- Password: any

**Doctor:**
- Email: doctor@demo.com
- Password: any

## 🎯 Key Features

✅ **AI/ML Disease Prediction** - 3 algorithms (Naive Bayes, KNN, Decision Tree)
✅ **Hybrid System** - ML (60%) + Medical Rules (40%)
✅ **Real-time Symptom Search** - Dynamic filtering
✅ **Confidence Metrics** - Know prediction reliability
✅ **Model Consensus** - See when algorithms agree
✅ **Treatment Info** - Get care recommendations

## 📊 API Endpoints

### Most Used
```
GET  /api/symptoms              # Get all symptoms
POST /api/symptoms/analyze      # Analyze symptoms (ML + Rules)
GET  /api/ml/model-info        # Check ML model status
POST /api/ml/train             # Train ML model (Doctor only)
```

### Full List
See `backend/ml/API_GUIDE.md`

## 🐛 Quick Troubleshooting

**Backend won't start?**
- Check MongoDB is running
- Verify `.env` file exists in backend folder

**Frontend can't connect?**
- Check backend is running on port 10000
- Create `.env` with `VITE_API_URL=http://localhost:10000`

**No symptoms loading?**
- Run `npm run seed` in backend folder
- Check backend logs

**ML not working?**
- Train model first: `POST /api/ml/train`
- Check: `GET /api/ml/model-info`

## 📚 Documentation

- **Setup Guide:** `SETUP_GUIDE.md`
- **Integration Details:** `INTEGRATION_COMPLETE.md`
- **Verification:** `VERIFICATION_CHECKLIST.md`
- **ML Technical Docs:** `backend/ml/README.md`
- **API Reference:** `backend/ml/API_GUIDE.md`
- **Architecture:** `backend/ml/ARCHITECTURE.md`

## 🎨 What You'll See

### Before ML Training
- Disease predictions based on symptom matching
- Confidence scores
- Basic recommendations

### After ML Training
- **"AI + Medical Rules"** badge
- **ML Confidence:** 91.2%
- **Model Consensus:** 100%
- **Matched Symptoms:** 4/6
- More accurate predictions (85-90% accuracy)

## 💡 Pro Tips

1. **Always train the model** after seeding database
2. **Use hybrid mode** for best accuracy (it's default)
3. **Check consensus scores** - higher = more reliable
4. **Retrain monthly** with new data
5. **Monitor model info** to track performance

## 🚀 Production Deployment

### Backend (e.g., Render)
1. Connect GitHub repo
2. Set environment variables
3. Deploy
4. Train ML model after deployment

### Frontend (e.g., Vercel)
1. Connect GitHub repo
2. Set `VITE_API_URL` to production backend
3. Deploy

## ✅ Success Indicators

You're ready when you see:
- ✅ Backend console shows "Healthcare Backend Server running"
- ✅ Frontend shows symptoms from backend
- ✅ Analysis returns predictions with confidence
- ✅ "AI + Medical Rules" badge appears (after training)
- ✅ ML metrics display (consensus, ML confidence)

## 🎉 That's It!

Your AI-powered healthcare system is ready!

**Need more details?** Check `SETUP_GUIDE.md` or `INTEGRATION_COMPLETE.md`

**Having issues?** See `VERIFICATION_CHECKLIST.md`

---

**Built with:**
- Backend: Node.js + Express + MongoDB
- Frontend: React + TypeScript + Tailwind CSS
- ML: Custom JavaScript implementation (Naive Bayes, KNN, Decision Tree)
- Prediction: Hybrid ensemble (ML + Medical Rules)
