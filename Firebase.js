import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import getStorage from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyDNToeQLgflbeIXKlbKijAK-SNN3QBqj-I",
  authDomain: "weather-38fb6.firebaseapp.com",
  projectId: "weather-38fb6",
  storageBucket: "weather-38fb6.appspot.com",
  messagingSenderId: "594640539362",
  appId: "1:594640539362:web:40eb1cda8b765f8d31d8bb",
};
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
//export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
