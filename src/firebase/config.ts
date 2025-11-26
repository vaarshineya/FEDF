import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCoprbL-dxI6qrPD69aBs8wp5_zibdujE8',
  authDomain: 'fedf2-4574c.firebaseapp.com',
  projectId: 'fedf2-4574c',
  storageBucket: 'fedf2-4574c.appspot.com',
  messagingSenderId: '620897696334',
  appId: '1:620897696334:web:f6d4e33111fa459264a11f',
  measurementId: 'G-TTLKMD671V',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export default app;
