import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYrgMdNLisflItN2U_DFDuXEuKKD_UNk",
  authDomain: "mess-wallah-3280b.firebaseapp.com",
  projectId: "mess-wallah-3280b",
  storageBucket: "mess-wallah-3280b.firebasestorage.app",
  messagingSenderId: "728500350008",
  appId: "1:728500350008:web:951549cc433942906aaa5",
  measurementId: "G-BM0LSQNNYY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
