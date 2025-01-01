// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyA4cD1bHr9lyQFvh14e6qJzRS_8VFTrifM',
  authDomain: 'fyv---find-your-vibe.firebaseapp.com',
  projectId: 'fyv---find-your-vibe',
  storageBucket: 'fyv---find-your-vibe.firebasestorage.app',
  messagingSenderId: '149876989371',
  appId: '1:149876989371:web:81f3c8734925d955d5389e',
  measurementId: 'G-BX8Z040FCP',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
