// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  LOGIN_GOOGLE: '/auth/google',
  REGISTER: '/auth/register',
  
  // Symptoms
  SYMPTOMS: '/api/symptoms',
  SYMPTOM_SUGGESTIONS: '/api/symptoms/suggestions',
  ANALYZE_SYMPTOMS: '/api/symptoms/analyze',
  
  // Diseases
  DISEASES: '/api/diseases',
  DISEASE_CATEGORIES: '/api/diseases/categories',
  
  // Doctors
  DOCTORS: '/api/doctors',

  // Medical Records
  MEDICAL_RECORDS: '/api/medical-records',
  
  // ML
  ML_TRAIN: '/api/ml/train',
  ML_RETRAIN: '/api/ml/retrain',
  ML_PREDICT: '/api/ml/predict',
  ML_MODEL_INFO: '/api/ml/model-info',
  ML_ALGORITHMS: '/api/ml/algorithms',
  ML_STATS: '/api/ml/stats',
};

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  const user = localStorage.getItem('currentUser');
  if (user) {
    const userData = JSON.parse(user);
    return userData.token || null;
  }
  return null;
};

// Helper function to create headers
export const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};
