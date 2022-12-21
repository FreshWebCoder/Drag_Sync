import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FB_APIKEY,
  authDomain: "dragsync.firebaseapp.com",
  databaseURL: "https://dragsync-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dragsync",
  storageBucket: "dragsync.appspot.com",
  messagingSenderId: "1064461718658",
  appId: process.env.REACT_APP_FB_APPID
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
