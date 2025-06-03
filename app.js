document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    document.getElementById('memoryDate').valueAsDate = new Date();
    
    // Get DOM elements
    const memoryForm = document.getElementById('memoryForm');
    const entriesList = document.getElementById('entriesList');
    const filterAuthor = document.getElementById('filterAuthor');
    const filterMood = document.getElementById('filterMood');
    const clearFilters = document.getElementById('clearFilters');
    
    // Initialize Firebase Realtime Database
    const database = window.firebaseDatabase;
    const memoriesRef = ref(database, 'memories');
    
    // Form submission handler
    memoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const title = document.getElementById('memoryTitle').value;
        const date = document.getElementById('memoryDate').value;
        const author = document.querySelector('input[name="author"]:checked').value;
        const mood = document.querySelector('input[name="mood"]:checked').value;
        const content = document.getElementById('memoryContent').value;
        
        // Create new memory object
        const newMemory = {
            title,
            date,
            author,
            mood,
            content,
            createdAt: new Date().toISOString()
        };
        
        // Save to Firebase
        push(memoriesRef, newMemory)
            .then(() => {
                // Reset form
                memoryForm.reset();
                document.getElementById('memoryDate').valueAsDate = new Date();
            })
            .catch(error => {
                console.error("Error saving memory:", error);
                alert("Failed to save memory. Please try again.");
            });
    });
    
    // Load memories from Firebase
    onValue(memoriesRef, (snapshot) => {
        entriesList.innerHTML = '';
        
        if (!snapshot.exists()) {
            entriesList.innerHTML = '<div class="no-entries">No memories yet. Add your first one above!</div>';
            return;
        }
        
        // Convert to array and sort by date (newest first)
        const memories = [];
        snapshot.forEach(childSnapshot => {
            const memory = childSnapshot.val();
            memory.id = childSnapshot.key;
            memories.push(memory);
        });
        
        memories.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Add to DOM
        memories.forEach(memory => {
            addEntryToDOM(memory);
        });
    }, {
        onlyOnce: false // Listen for real-time updates
    });
    
    // Add entry to DOM
    function addEntryToDOM(entry) {
        const noEntriesMsg = document.querySelector('.no-entries');
        
        if (noEntriesMsg) {
            noEntriesMsg.remove();
        }
        
        const entryElement = document.createElement('div');
        entryElement.className = 'entry-card';
        entryElement.dataset.id = entry.id;
        entryElement.dataset.author = entry.author;
        entryElement.dataset.mood = entry.mood;
        
        const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        entryElement.innerHTML = `
            <div class="entry-header">
                <h3 class="entry-title">${entry.title}</h3>
                <span class="entry-date">${formattedDate}</span>
            </div>
            <span class="entry-author ${'author-' + entry.author}">${entry.author === 'him' ? 'He wrote this' : 'She wrote this'}</span>
            <span class="entry-mood">Feeling: ${entry.mood}</span>
            <div class="entry-content">
                <p>${entry.content}</p>
            </div>
        `;
        
        entriesList.appendChild(entryElement);
    }
    
    // Filter handlers
    filterAuthor.addEventListener('change', filterEntries);
    filterMood.addEventListener('change', filterEntries);
    clearFilters.addEventListener('click', function(e) {
        e.preventDefault();
        filterAuthor.value = 'all';
        filterMood.value = 'all';
        filterEntries();
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