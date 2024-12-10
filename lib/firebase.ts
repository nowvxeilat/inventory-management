// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBa8Ab6aTcEU3R9-bZrT_WvMkTRZ2z9JrA",
  authDomain: "nowprivet-100.firebaseapp.com",
  projectId: "nowprivet-100",
  storageBucket: "nowprivet-100.firebasestorage.app",
  messagingSenderId: "479006278991",
  appId: "1:479006278991:web:32599ea6ae76316e37b13a",
  measurementId: "G-DHLQEE58WL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only on client side
let analytics;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Storage
export const storage = getStorage(app);

export { app, analytics };