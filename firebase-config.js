// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBh7R_Ms7ilYvdHIzM0dRWwJJ09Q-EAXB0",
    authDomain: "bookoflove-d6dd1.firebaseapp.com",
    projectId: "bookoflove-d6dd1",
    storageBucket: "bookoflove-d6dd1.firebasestorage.app",
    messagingSenderId: "293815616308",
    appId: "1:293815616308:web:8e750943b35babf65a1b61",
    measurementId: "G-Z23J72080V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Esporta per usarli in app.js
export { db, auth };