import { auth } from "./firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Register user baru
export function registerUser(email, password) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Registrasi berhasil: " + userCredential.user.email);
    })
    .catch((error) => {
      alert("Registrasi gagal: " + error.message);
    });
}

// Login user
export function loginUser(email, password) {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login berhasil: " + userCredential.user.email);
    })
    .catch((error) => {
      alert("Login gagal: " + error.message);
    });
}

// Logout user
export function logoutUser() {
  signOut(auth)
    .then(() => {
      alert("Logout berhasil");
    })
    .catch((error) => {
      alert("Logout gagal: " + error.message);
    });
}
