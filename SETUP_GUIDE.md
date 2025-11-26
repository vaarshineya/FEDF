# Healthcare Disease Prediction System - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd project/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   # Copy from backend folder
   PORT=10000
   MONGODB_URI=mongodb://localhost:27017/healthcare
   JWT_SECRET=your-secret-key-here
   NODE_ENV=development
   ```

4. **Seed the database (optional but recommended):**
   ```bash
   npm run seed
   ```

5. **Start the backend server:**
   ```bash
   npm start
   ```

   The backend will run on `http://localhost:10000`

### Frontend Setup

1. **Navigate to project root:**
   ```bash
   cd project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file in project root:**
   ```bash
   VITE_API_URL=http://localhost:10000
   ```

4. **Start the frontend:**
   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:5173`

## 🤖 ML Model Setup

### First-Time Training

After starting the backend, you need to train the ML model:

1. **Login as a doctor** (or create a doctor account)
   - Email: `doctor@demo.com`
   - Password: (any password for mock)

2. **Train the model via API:**
   ```bash
   POST http://localhost:10000/api/ml/train
   Authorization: Bearer YOUR_TOKEN
   Content-Type: application/json

   {
     "trainRatio": 0.8,
     "k": 5,
     "distanceMetric": "euclidean"
   }
   ```

   Or use the frontend (if you implement an admin panel)

3. **Verify model is trained:**
   ```bash
   GET http://localhost:10000/api/ml/model-info
   ```

## 📊 Testing the System

### 1. Test Backend Health
```bash
curl http://localhost:10000/health
```

### 2. Get Symptoms
```bash
curl http://localhost:10000/api/symptoms
```

### 3. Analyze Symptoms (requires authentication)
```bash
curl -X POST http://localhost:10000/api/symptoms/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "symptomIds": ["symptom_id_1", "symptom_id_2"],
    "age": 35,
    "gender": "male"
  }'
```

## 🔧 Configuration

### Backend Configuration (`backend/.env`)
```env
PORT=10000
MONGODB_URI=mongodb://localhost:27017/healthcare
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

### Frontend Configuration (`.env`)
```env
VITE_API_URL=http://localhost:10000
```

## 📁 Project Structure

```
project/
├── backend/                    # Backend API
│   ├── ml/                    # ML algorithms and services
│   │   ├── algorithms/        # NaiveBayes, KNN, DecisionTree, Ensemble
│   │   ├── services/          # MLTrainingService
│   │   ├── utils/             # Data preprocessing
│   │   └── models/            # Trained models (generated)
│   ├── models/                # MongoDB models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── middleware/            # Auth middleware
│   └── server.js              # Entry point
├── src/                       # Frontend React app
│   ├── components/            # React components
│   ├── contexts/              # React contexts (Auth)
│   ├── services/              # API service
│   └── config/                # Configuration
└── package.json               # Frontend dependencies
```

## 🎯 Features

### Backend Features
✅ User authentication (JWT)
✅ Symptom management
✅ Disease database
✅ Medical records
✅ **ML-powered disease prediction**
✅ **Hybrid prediction (ML + Rules)**
✅ **3 ML algorithms (Naive Bayes, KNN, Decision Tree)**
✅ **Ensemble model with weighted voting**
✅ Model training and retraining
✅ Model persistence
✅ Comprehensive API documentation

### Frontend Features
✅ User registration and login
✅ Symptom checker with real-time search
✅ **AI-powered disease predictions**
✅ **ML confidence scores and consensus**
✅ **Hybrid prediction indicators**
✅ Responsive design
✅ Error handling with fallbacks
✅ Loading states

## 🔐 Authentication

### Mock Users (for development)
- **Patient:**
  - Email: `patient@demo.com`
  - Password: any

- **Doctor:**
  - Email: `doctor@demo.com`
  - Password: any

### Real Authentication
When backend is connected, use the registration endpoint:
```bash
POST http://localhost:10000/api/auth/register
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe",
  "role": "patient"
}
```

## 🧪 Development Mode

The system works in two modes:

### 1. **With Backend** (Full ML Features)
- Real API calls
- ML predictions
- Database persistence
- Full authentication

### 2. **Without Backend** (Mock Mode)
- Automatic fallback to mock data
- Frontend works standalone
- No ML features
- Local storage auth

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Symptoms
- `GET /api/symptoms` - Get all symptoms
- `GET /api/symptoms/suggestions?q=term` - Search symptoms
- `POST /api/symptoms/analyze` - Analyze symptoms (ML + Rules)

### Diseases
- `GET /api/diseases` - Get all diseases
- `GET /api/diseases/categories` - Get categories

### ML
- `POST /api/ml/train` - Train model (Doctor only)
- `POST /api/ml/retrain` - Retrain model (Doctor only)
- `GET /api/ml/model-info` - Get model status
- `GET /api/ml/algorithms` - Get algorithm info
- `POST /api/ml/predict` - Pure ML prediction

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists
- Check port 10000 is not in use

### Frontend can't connect to backend
- Verify backend is running on port 10000
- Check `VITE_API_URL` in `.env`
- Check browser console for CORS errors

### ML predictions not working
- Train the model first: `POST /api/ml/train`
- Check model exists: `GET /api/ml/model-info`
- Verify you're authenticated

### Symptoms not loading
- Check backend is running
- Seed the database: `npm run seed` (in backend folder)
- Check network tab in browser devtools

## 📚 Documentation

- **ML Implementation:** `backend/ml/README.md`
- **API Guide:** `backend/ml/API_GUIDE.md`
- **Architecture:** `backend/ml/ARCHITECTURE.md`
- **Implementation Summary:** `backend/ml/IMPLEMENTATION_SUMMARY.md`

## 🚀 Deployment

### Backend Deployment (e.g., Render, Heroku)
1. Set environment variables
2. Connect MongoDB Atlas
3. Deploy backend
4. Train ML model after deployment

### Frontend Deployment (e.g., Vercel, Netlify)
1. Set `VITE_API_URL` to production backend URL
2. Build: `npm run build`
3. Deploy `dist` folder

## 💡 Tips

1. **Always train the model first** before using ML predictions
2. **Use hybrid mode** for best accuracy (default)
3. **Retrain monthly** with new data for improved accuracy
4. **Monitor model info** to check if retraining is needed
5. **Check consensus scores** - higher is more reliable

## 🎉 You're Ready!

Your healthcare disease prediction system with AI/ML is now set up and ready to use!

For questions or issues, refer to the documentation in `backend/ml/` folder.
