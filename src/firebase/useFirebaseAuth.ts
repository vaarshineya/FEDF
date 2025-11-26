import { useState, useEffect } from 'react';
import { 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth, googleProvider } from './config';
import { useAuth } from '../contexts/AuthContext';

export const useFirebaseAuth = () => {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (role: 'patient' | 'doctor') => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      
      if (!user.email) {
        throw new Error('No email found in Google account');
      }

      // Call your backend to handle the Google sign-in
      await loginWithGoogle({
        uid: user.uid,
        email: user.email,
        name: user.displayName || '',
        role,
        photoURL: user.photoURL || undefined
      });

      return user;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return {
    firebaseUser,
    loading,
    signInWithGoogle,
    signOut
  };
};

export default useFirebaseAuth;
