// Firebase Configuration
// Update dengan credentials Firebase Anda dari https://console.firebase.google.com

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Firebase initialization akan dilakukan saat diperlukan
window.firebaseConfig = firebaseConfig;
console.log('Firebase config loaded. Update dengan credentials Anda.');