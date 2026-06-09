// Import modul Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA8Pqxr7-S2cUBTBMAxUGknsV3UmLxTH0o",
  authDomain: "btoaappv3.firebaseapp.com",
  projectId: "btoaappv3",
  storageBucket: "btoaappv3.firebasestorage.app",
  messagingSenderId: "617767588735",
  appId: "1:617767588735:web:0bb8de934b9a3f7d53004a",
  measurementId: "G-LSWRFR0MLQ"
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
