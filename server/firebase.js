// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
require("dotenv").config();

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANESJz3U7avofj5uki2jXVJ909g7BcrkQ",
  authDomain: "simpleshoppingmall.firebaseapp.com",
  projectId: "simpleshoppingmall",
  storageBucket: "simpleshoppingmall.appspot.com",
  messagingSenderId: "981768052206",
  appId: "1:981768052206:web:b00676d7987aa9d0f742ff",
  measurementId: "G-KVBGQ6JSKY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
export const db = getFirestore(app);
