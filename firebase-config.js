import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBh7R_Ms7ilYvdHIzM0dRWwJJ09Q-EAXB0",
  authDomain: "bookoflove-d6dd1.firebaseapp.com",
  databaseURL: "https://bookoflove-d6dd1-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "bookoflove-d6dd1",
  storageBucket: "bookoflove-d6dd1.firebasestorage.app",
  messagingSenderId: "293815616308",
  appId: "1:293815616308:web:8e750943b35babf65a1b61",
  measurementId: "G-Z23J72080V"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };