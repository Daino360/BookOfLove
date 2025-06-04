// Replace with your Firebase config

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-analytics.js";
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
// DOM Elements
const memoryForm = document.getElementById('memoryForm');
const memoryDisplay = document.getElementById('memoryDisplay');
const newMemoryBtn = document.getElementById('newMemoryBtn');

// Form submission handler
memoryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = memoryForm.title.value;
    const date = memoryForm.date.value;
    const description = memoryForm.description.value;
    const author = memoryForm.author.value;
    
    addMemory(title, date, description, author);
    memoryForm.reset();
});

// New random memory button
newMemoryBtn.addEventListener('click', displayRandomMemory);

// Add memory to Firestore
function addMemory(title, date, description, author) {
    memoriesCollection.add({
        title,
        date,
        description,
        author,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        alert('Memory added to your BookOfLove! ❤️');
    })
    .catch((error) => {
        console.error("Error adding memory: ", error);
        alert('Error saving memory. Please try again.');
    });
}

// Display random memory from Firestore
function displayRandomMemory() {
    memoriesCollection.get().then((querySnapshot) => {
        const memories = [];
        querySnapshot.forEach((doc) => {
            memories.push({ id: doc.id, ...doc.data() });
        });
        
        if (memories.length === 0) {
            memoryDisplay.innerHTML = '<p>Your BookOfLove is empty. Add your first memory!</p>';
            return;
        }
        
        const randomMemory = memories[Math.floor(Math.random() * memories.length)];
        renderMemory(randomMemory);
    });
}

// Render memory to DOM
function renderMemory(memory) {
    const dateString = new Date(memory.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    memoryDisplay.innerHTML = `
        <div class="memory-card">
            <h3>${memory.title}</h3>
            <p class="date">📅 ${dateString}</p>
            <p class="description">${memory.description}</p>
            <span class="author">Written by: ${memory.author === 'him' ? 'Him 👨' : 'Her 👩'}</span>
        </div>
    `;
}

// Initialize app
function initApp() {
    displayRandomMemory();
}

// Load app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);