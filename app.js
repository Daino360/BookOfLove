document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('memoryDate').value = today;
    
    // Get Firebase functions from window
    const { db, ref, push, onValue } = window.firebaseDb;
    const memoriesRef = ref(db, 'memories');
    
    // DOM elements
    const memoryForm = document.getElementById('memoryForm');
    const entriesList = document.getElementById('entriesList');
    
    // Form submission
    memoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const memoryData = {
            title: document.getElementById('memoryTitle').value,
            date: document.getElementById('memoryDate').value,
            author: document.querySelector('input[name="author"]:checked').value,
            mood: document.querySelector('input[name="mood"]:checked').value,
            content: document.getElementById('memoryContent').value,
            createdAt: new Date().toISOString()
        };
        
        // Debug: mostra i dati prima dell'invio
        console.log("Invio dati a Firebase:", memoryData);
        
        push(memoriesRef, memoryData)
            .then(() => {
                console.log("Dati salvati con successo");
                memoryForm.reset();
                document.getElementById('memoryDate').value = today;
            })
            .catch(error => {
                console.error("Errore nel salvataggio:", error);
                alert("Errore nel salvataggio: " + error.message);
            });
    });
    
    // Load and display memories
    onValue(memoriesRef, (snapshot) => {
        console.log("Ricevuti dati da Firebase:", snapshot.val());
        
        entriesList.innerHTML = '';
        
        if (!snapshot.exists()) {
            entriesList.innerHTML = '<div class="no-entries">No memories yet. Add your first one!</div>';
            return;
        }
        
        const memories = [];
        snapshot.forEach((childSnapshot) => {
            const memory = childSnapshot.val();
            memory.id = childSnapshot.key;
            memories.push(memory);
        });
        
        // Sort by date (newest first)
        memories.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Add to DOM
        memories.forEach(memory => {
            const entryElement = document.createElement('div');
            entryElement.className = 'entry-card';
            entryElement.dataset.id = memory.id;
            entryElement.dataset.author = memory.author;
            entryElement.dataset.mood = memory.mood;
            
            const formattedDate = new Date(memory.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            entryElement.innerHTML = `
                <div class="entry-header">
                    <h3 class="entry-title">${memory.title}</h3>
                    <span class="entry-date">${formattedDate}</span>
                </div>
                <span class="entry-author ${'author-' + memory.author}">
                    ${memory.author === 'him' ? 'He wrote this' : 'She wrote this'}
                </span>
                <span class="entry-mood">Feeling: ${memory.mood}</span>
                <div class="entry-content">
                    <p>${memory.content}</p>
                </div>
            `;
            
            entriesList.appendChild(entryElement);
        });
    }, {
        onlyOnce: false // Per aggiornamenti in tempo reale
    });
    
    // Filter entries function
    function filterEntries() {
        const authorFilter = filterAuthor.value;
        const moodFilter = filterMood.value;
        const entries = document.querySelectorAll('.entry-card');
        
        entries.forEach(entry => {
            const entryAuthor = entry.dataset.author;
            const entryMood = entry.dataset.mood;
            
            const authorMatch = authorFilter === 'all' || entryAuthor === authorFilter;
            const moodMatch = moodFilter === 'all' || entryMood === moodFilter;
            
            if (authorMatch && moodMatch) {
                entry.style.display = 'block';
            } else {
                entry.style.display = 'none';
            }
        });
        
        // Check if all entries are hidden
        const visibleEntries = document.querySelectorAll('.entry-card[style="display: block"]');
        const noEntriesMsg = document.querySelector('.no-entries');
        
        if (visibleEntries.length === 0 && entries.length > 0) {
            if (!noEntriesMsg) {
                const msg = document.createElement('div');
                msg.className = 'no-entries';
                msg.textContent = 'No memories match your filters.';
                entriesList.appendChild(msg);
            }
        } else if (noEntriesMsg && noEntriesMsg.textContent.includes('filters')) {
            noEntriesMsg.remove();
        }
    }
});