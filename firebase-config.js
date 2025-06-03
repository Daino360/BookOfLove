<script type="module">
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
  import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  const auth = getAuth(app);
  
  export { db, auth };

</script>