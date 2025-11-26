import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api.service';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor';
  specialty?: string;
  bio?: string;
  consultationFee?: number;
  profileComplete?: boolean;
  token?: string;
}

interface GoogleSignInData {
  uid: string;
  email: string;
  name: string;
  role: 'patient' | 'doctor';
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (data: GoogleSignInData) => Promise<User | undefined>;
  register: (email: string, password: string, name: string, role: 'patient' | 'doctor') => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [googleAuthInProgress, setGoogleAuthInProgress] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async (googleData: GoogleSignInData) => {
    if (googleAuthInProgress) return;
    
    setLoading(true);
    setGoogleAuthInProgress(true);
    
    try {
      // Try real API first
      try {
        const response = await apiService.loginWithGoogle({
          uid: googleData.uid,
          email: googleData.email,
          name: googleData.name,
          role: googleData.role,
          photoURL: googleData.photoURL
        });
        
        const userData: User = {
          id: response.user._id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          token: response.token,
          profileComplete: response.user.profileComplete,
        };
        
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return userData;
      } catch (apiError) {
        console.warn('Google login API failed, using mock data:', apiError);
        
        // Mock response for development
        const mockUser: User = {
          id: googleData.uid,
          email: googleData.email,
          name: googleData.name,
          role: googleData.role,
          token: `google-token-${Date.now()}`,
          profileComplete: true,
        };
        
        setUser(mockUser);
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        return mockUser;
      }
    } finally {
      setLoading(false);
      setGoogleAuthInProgress(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Try real API first
      try {
        const response = await apiService.login({ email, password });
        const userData: User = {
          id: response.user._id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          token: response.token,
          profileComplete: response.user.profileComplete,
        };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return;
      } catch (apiError) {
        console.warn('API login failed, using mock data:', apiError);
      }

      // Fallback to mock for development
      const mockUsers = [
        {
          id: '1',
          email: 'patient@demo.com',
          name: 'John Doe',
          role: 'patient' as const,
          profileComplete: true,
          token: 'mock-patient-token',
        },
        {
          id: '2',
          email: 'doctor@demo.com',
          name: 'Dr. Sarah Johnson',
          role: 'doctor' as const,
          specialty: 'General Practice',
          bio: 'Experienced family medicine physician with 10+ years of practice.',
          consultationFee: 75,
          profileComplete: true,
          token: 'mock-doctor-token',
        },
      ];

      const foundUser = mockUsers.find(u => u.email === email);
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }

      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, role: 'patient' | 'doctor') => {
    setLoading(true);
    try {
      // Try real API first
      try {
        const response = await apiService.register({ email, password, name, role });
        const userData: User = {
          id: response.user._id,
          email: response.user.email,
          name: response.user.name,
          role: response.user.role,
          token: response.token,
          profileComplete: false,
        };
        setUser(userData);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        return;
      } catch (apiError) {
        console.warn('API registration failed, using mock data:', apiError);
      }

      // Fallback to mock for development
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        email,
        name,
        role,
        profileComplete: false,
        token: 'mock-token-' + Math.random().toString(36).substr(2, 9),
      };

      setUser(newUser);
      localStorage.setItem('currentUser', JSON.stringify(newUser));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginWithGoogle,
      register,
      logout,
      updateProfile,
      loading,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};