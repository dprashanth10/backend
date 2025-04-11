// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCSDU3MoCUfcC3Jfn_T-cZ6fqcp2ZUFFMk",
  authDomain: "ipollusense-52f67.firebaseapp.com",
  projectId: "ipollusense-52f67",
  storageBucket: "ipollusense-52f67.appspot.com",
  messagingSenderId: "733434038670",
  appId: "1:733434038670:web:7e3d9475fd6310d1afbcdf",
  measurementId: "G-VHSG19J7HN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firestore
const db = getFirestore(app);

export default db;
