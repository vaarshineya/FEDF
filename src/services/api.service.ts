import { API_BASE_URL, API_ENDPOINTS, getHeaders } from '../config/api';

// Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: 'patient' | 'doctor';
}

export interface GoogleLoginData {
  uid: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor';
  photoURL?: string;
}

export interface SymptomAnalysisRequest {
  symptomIds: string[];
  age: number;
  gender: string;
}

export interface DiseasePrediction {
  diseaseId: string;
  name: string;
  description: string;
  category: string;
  confidence: number;
  confidenceLevel: string;
  mlConfidence?: number;
  ruleConfidence?: number;
  consensus?: number;
  predictionMethod?: string;
  matchedSymptoms?: number;
  totalSymptoms?: number;
  urgency: string;
  whenToSeekCare: string;
  treatment?: string;
  prevention?: string;
}

export interface Symptom {
  _id: string;
  name: string;
  category: string;
  severity: string;
  description?: string;
  commonNames?: string[];
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Auth APIs
  async login(credentials: LoginCredentials) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async loginWithGoogle(googleData: GoogleLoginData) {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.LOGIN_GOOGLE}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(googleData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Google login failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }

  async register(data: RegisterData) {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.REGISTER}`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    return response.json();
  }

  // Symptom APIs
  async getSymptoms(search?: string, category?: string): Promise<Symptom[]> {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);

    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.SYMPTOMS}?${params.toString()}`,
      {
        headers: getHeaders(false),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch symptoms');
    }

    return response.json();
  }

  async getSymptomSuggestions(query: string, limit = 10): Promise<Symptom[]> {
    const params = new URLSearchParams({ q: query, limit: limit.toString() });

    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.SYMPTOM_SUGGESTIONS}?${params.toString()}`,
      {
        headers: getHeaders(false),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch symptom suggestions');
    }

    return response.json();
  }

  async analyzeSymptoms(data: SymptomAnalysisRequest): Promise<{
    predictions: DiseasePrediction[];
    recordId: string | null;
    message: string;
  }> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.ANALYZE_SYMPTOMS}`, {
      method: 'POST',
      headers: getHeaders(false), // Changed to false - no auth required
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to analyze symptoms');
    }

    return response.json();
  }

  // Disease APIs
  async getDiseases(search?: string, category?: string) {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (category) params.append('category', category);

    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.DISEASES}?${params.toString()}`,
      {
        headers: getHeaders(false),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch diseases');
    }

    return response.json();
  }

  async getDiseaseCategories(): Promise<string[]> {
    const response = await fetch(
      `${this.baseUrl}${API_ENDPOINTS.DISEASE_CATEGORIES}`,
      {
        headers: getHeaders(false),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch disease categories');
    }

    return response.json();
  }

  // ML APIs
  async getMLModelInfo() {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.ML_MODEL_INFO}`, {
      headers: getHeaders(false),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ML model info');
    }

    return response.json();
  }

  async getMLAlgorithms() {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.ML_ALGORITHMS}`, {
      headers: getHeaders(false),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ML algorithms');
    }

    return response.json();
  }

  async trainMLModel(config?: any) {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.ML_TRAIN}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(config || {}),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to train ML model');
    }

    return response.json();
  }

  async retrainMLModel(config?: any) {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.ML_RETRAIN}`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(config || {}),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to retrain ML model');
    }

    return response.json();
  }

  async getMLStats() {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.ML_STATS}`, {
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch ML stats');
    }

    return response.json();
  }

  // Doctor-Patient Mapping APIs
  async mapPatientToDoctor(doctorId: string, patient: { id: string; name: string; bookedAt?: string; notes?: string }) {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.DOCTORS}/${doctorId}/patients`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(patient),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to map patient to doctor');
    }

    return response.json();
  }

  async getPatientsForDoctor(doctorId: string): Promise<Array<{ id: string; name: string; bookedAt?: string }>> {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.DOCTORS}/${doctorId}/patients`, {
      headers: getHeaders(true),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Failed to fetch mapped patients');
    }

    return response.json();
  }

  // Medical Records APIs
  async getMedicalRecords() {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.MEDICAL_RECORDS}`, {
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch medical records');
    }

    return response.json();
  }

  async getMedicalRecordById(id: string) {
    const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.MEDICAL_RECORDS}/${id}`, {
      headers: getHeaders(true),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch medical record');
    }

    return response.json();
  }
}

export const apiService = new ApiService();
