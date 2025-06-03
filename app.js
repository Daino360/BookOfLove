document.addEventListener('DOMContentLoaded', function() {
    // Set default date to today
    document.getElementById('memoryDate').valueAsDate = new Date();
    
    // DOM elements
    const memoryForm = document.getElementById('memoryForm');
    const entriesList = document.getElementById('entriesList');
    const signInButton = document.getElementById('signInButton');
    const signOutButton = document.getElementById('signOutButton');
    const submitButton = document.getElementById('submitButton');
    
    // Auth state listener
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is signed in
            signInButton.classList.add('hidden');
            signOutButton.classList.remove('hidden');
            submitButton.disabled = false;
            loadEntries();
        } else {
            // User is signed out
            signInButton.classList.remove('hidden');
            signOutButton.classList.add('hidden');
            submitButton.disabled = true;
            entriesList.innerHTML = '<div class="no-entries">Please sign in to view memories</div>';
        }
    });
    
    // Sign in handler
    signInButton.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(error => {
            console.error("Sign in error:", error);
            alert("Sign in failed. Please try again.");
        });
    });
    
    // Sign out handler
    signOutButton.addEventListener('click', () => {
        auth.signOut();
    });
    
	// Form submission
	memoryForm.addEventListener('submit', async (e) => {
	  e.preventDefault();
	  
	  const user = auth.currentUser;
	  if (!user) return;

	  try {
		await addDoc(collection(db, "memories"), {
		  title: document.getElementById('memoryTitle').value,
		  date: document.getElementById('memoryDate').value,
		  author: document.querySelector('input[name="author"]:checked').value,
		  mood: document.querySelector('input[name="mood"]:checked').value,
		  content: document.getElementById('memoryContent').value,
		  createdAt: serverTimestamp(),
		  userId: user.uid
		});
		
		// Reset form
		memoryForm.reset();
		document.getElementById('memoryDate').valueAsDate = new Date();
	  } catch (error) {
		console.error("Error adding document: ", error);
	  }
	});
    
    // Filter handlers
    document.getElementById('filterAuthor').addEventListener('change', filterEntries);
    document.getElementById('filterMood').addEventListener('change', filterEntries);
    document.getElementById('clearFilters').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('filterAuthor').value = 'all';
        document.getElementById('filterMood').value = 'all';
        filterEntries();
    });
    
	function loadEntries() {
	  const user = auth.currentUser;
	  if (!user) return;

	  const q = query(
		collection(db, "memories"),
		where("userId", "==", user.uid),
		orderBy("createdAt", "desc")
	  );

	  const unsubscribe = onSnapshot(q, (querySnapshot) => {
		entriesList.innerHTML = '';
		
		if (querySnapshot.empty) {
		  entriesList.innerHTML = '<div class="no-entries">No memories yet</div>';
		  return;
		}

		querySnapshot.forEach((doc) => {
		  addEntryToDOM({ id: doc.id, ...doc.data() });
		});
	  });

	  return unsubscribe; // Useful for cleanup
	}
    
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
    
    function filterEntries() {
        const authorFilter = document.getElementById('filterAuthor').value;
        const moodFilter = document.getElementById('filterMood').value;
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