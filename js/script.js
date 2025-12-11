document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase is available (initialized in index.html)
    if (typeof firebase === 'undefined' || typeof db === 'undefined') {
        console.error("Firebase is not initialized. Check your index.html script tags.");
        return;
    }

    // --- Configuration ---
    const USERS = ["Abe", "Ciara", "Chris", "Bryce", "Evan", "Allen", "Koda"];
    let CURRENT_USER = USERS[0]; 
    let eventIdCounter = 100; // Still used for unique ID generation, though Firestore generates its own ID
    
    // The events data will now be stored in this array, populated by Firestore
    let LIVE_EVENTS = []; 
    
    // --- DOM Elements ---
    const tabLinks = document.querySelectorAll('.tabs-nav .tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const userSelect = document.getElementById('current-user-select');
    const eventsListContainer = document.getElementById('events-list');
    const addEventBtn = document.getElementById('add-event-btn');
    const addEventForm = document.getElementById('add-event-form');
    const cancelEventBtn = document.getElementById('cancel-event-btn');

    // --- Utility Functions ---

    // Function to create the HTML string for an event card (No change needed here)
    const createEventCardHTML = (event) => {
        // Find the current user's vote status for styling
        const isYes = event.votes.yes.includes(CURRENT_USER) ? ' selected' : '';
        const isNo = event.votes.no.includes(CURRENT_USER) ? ' selected' : '';

        return `
            <div class="event-card">
                <button class="delete-event-btn" data-event-id="${event.id}">❌ Delete</button>
                <button class="view-votes-btn" data-event-id="${event.id}">View Other Votes</button>
                <h3>${event.title}</h3>
                <p><strong>Time:</strong> ${event.time}</p>
                <p><strong>Location:</strong> ${event.location}</p>
                
                <div class="group-poll" data-event-id="${event.id}">
                    <p class="poll-prompt">Will you be attending?</p>
                    <div class="poll-options">
                        <button class="poll-btn yes-btn${isYes}" data-vote="yes">
                            ✅ Yes (<span class="count-yes">${event.votes.yes.length}</span>)
                        </button>
                        <button class="poll-btn no-btn${isNo}" data-vote="no">
                            ❌ No (<span class="count-no">${event.votes.no.length}</span>)
                        </button>
                    </div>
                    <div class="poll-results hidden" data-visible="false" style="display: none;">
                        <p class="yes-attendees"><strong>Attending (${event.votes.yes.length}):</strong> ${event.votes.yes.sort().join(', ')}</p>
                        <p class="no-attendees"><strong>Not Attending (${event.votes.no.length}):</strong> ${event.votes.no.sort().join(', ')}</p>
                    </div>
                </div>
            </div>
        `;
    };

    // --- DATABASE INTERACTION FUNCTIONS ---

    // New: Renders events based on the LIVE_EVENTS array
    const renderAllEvents = () => {
        eventsListContainer.innerHTML = '';
        
        // Group and sort the live data
        const eventsByDay = LIVE_EVENTS.reduce((acc, event) => {
            if (!acc[event.day]) acc[event.day] = [];
            acc[event.day].push(event);
            return acc;
        }, {});

        const sortedDays = Object.keys(eventsByDay).sort();

        sortedDays.forEach(day => {
            if (eventsByDay[day].length > 0) {
                // Add Day Header with a Collapse Button
                eventsListContainer.innerHTML += `
                    <div class="day-header" data-day="${day}">
                        ${day}
                        <button class="collapse-btn" data-day="${day}" data-state="expanded">
                            <i class="fas fa-chevron-up"></i>
                        </button>
                    </div>
                `;
                
                // Sort events by time (simplistic sort based on time string)
                eventsByDay[day].sort((a, b) => a.time.localeCompare(b.time));
                
                eventsByDay[day].forEach(event => {
                    // Add an event-card-wrapper around the event card to target for collapse
                    eventsListContainer.innerHTML += `
                        <div class="event-card-wrapper event-day-${day.replace(/[^a-zA-Z0-9]/g, '-')}" data-day="${day}">
                            ${createEventCardHTML(event)}
                        </div>
                    `;
                });
            }
        });

        // Re-attach all listeners after new HTML is injected
        attachPollListeners();
        attachDeleteListeners();
        attachViewVotesListeners();
        attachCollapseListeners();
    };

    // NEW: Handles vote updates and writes to Firestore
    const handleVoteUpdate = async (eventObj, voteType, oppositeType) => {
        const docRef = db.collection('events').doc(eventObj.id);
        
        // Prepare the updated vote arrays (using Firestore array update commands)
        const updateData = {};

        // 1. Remove user from the opposite category
        updateData[`votes.${oppositeType}`] = firebase.firestore.FieldValue.arrayRemove(CURRENT_USER);
        
        // 2. Add user to the current category (Firestore handles checking if user is already there)
        updateData[`votes.${voteType}`] = firebase.firestore.FieldValue.arrayUnion(CURRENT_USER);

        try {
            await docRef.update(updateData);
            // Re-rendering is handled automatically by the Firestore listener (see Initialization)
        } catch (error) {
            console.error("Error updating vote:", error);
        }
    };

    // NEW: Deletes an event document from Firestore
    const deleteEventFromDB = async (eventIdToDelete) => {
        try {
            await db.collection('events').doc(eventIdToDelete).delete();
            // Re-rendering is handled automatically by the Firestore listener
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete event. Check console for details.");
        }
    };
    
    // NEW: Adds a new event document to Firestore
    const addNewEventToDB = async (newEventData) => {
        try {
            // Firestore generates a unique ID automatically
            await db.collection('events').add(newEventData);
            
            // Re-rendering is handled automatically by the Firestore listener
        } catch (error) {
            console.error("Error adding new event:", error);
            alert("Failed to add new event. Check console for details.");
        }
    };


    // --- ATTACH LISTENERS (UPDATED TO USE DB FUNCTIONS) ---
    
    const attachDeleteListeners = () => {
        document.querySelectorAll('.delete-event-btn').forEach(button => {
            button.onclick = function() {
                const eventIdToDelete = this.getAttribute('data-event-id');
                
                if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
                    return;
                }
                
                // Use the new DB function
                deleteEventFromDB(eventIdToDelete);
            };
        });
    };
    
    const attachPollListeners = () => {
        document.querySelectorAll('.poll-btn').forEach(button => {
            button.onclick = function() {
                if (!CURRENT_USER) {
                    alert("Please select your name from the 'Viewing As' dropdown first.");
                    return;
                }
                
                const pollElement = this.closest('.group-poll');
                const eventId = pollElement.getAttribute('data-event-id');
                const voteType = this.getAttribute('data-vote');
                const oppositeType = (voteType === 'yes' ? 'no' : 'yes');

                // Find the event object in the LIVE_EVENTS array
                const eventObj = LIVE_EVENTS.find(e => e.id === eventId);

                if (eventObj) {
                    // Use the new DB function to update the vote
                    handleVoteUpdate(eventObj, voteType, oppositeType);
                }
            };
        });
        
        // Attach View Votes Listener to the new button
        document.querySelectorAll('.view-votes-btn').forEach(button => {
            button.onclick = function() {
                const card = this.closest('.event-card');
                const results = card.querySelector('.poll-results');
                const isHidden = results.getAttribute('data-visible') === 'false';
                
                if (isHidden) {
                    results.style.display = 'block';
                    results.setAttribute('data-visible', 'true');
                    this.textContent = 'Hide Other Votes';
                } else {
                    results.style.display = 'none';
                    results.setAttribute('data-visible', 'false');
                    this.textContent = 'View Other Votes';
                }
            };
        });
    };
    
    // Attach the collapse listener (no changes needed)
    const attachCollapseListeners = () => {
        document.querySelectorAll('.collapse-btn').forEach(button => {
            button.onclick = function() {
                const dayToToggle = this.getAttribute('data-day');
                const currentState = this.getAttribute('data-state');
                
                const eventWrappers = document.querySelectorAll(`.event-card-wrapper[data-day="${dayToToggle}"]`);
                
                if (currentState === 'expanded') {
                    eventWrappers.forEach(wrapper => {
                        wrapper.style.display = 'none';
                    });
                    this.setAttribute('data-state', 'collapsed');
                    this.innerHTML = '<i class="fas fa-chevron-down"></i>';
                } else {
                    eventWrappers.forEach(wrapper => {
                        wrapper.style.display = 'block';
                    });
                    this.setAttribute('data-state', 'expanded');
                    this.innerHTML = '<i class="fas fa-chevron-up"></i>';
                }
            };
        });
    };

    // --- INITIALIZATION & DATA LISTENER ---

    // 1. Set up the Tab Switching (no change)
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetTab = link.getAttribute('data-tab');
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            link.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            if (targetTab === 'tab-daily') {
                renderAllEvents();
            }
        });
    });

    // 2. Set up the User Selector (no change)
    USERS.forEach(user => {
        const option = document.createElement('option');
        option.value = user;
        option.textContent = user;
        userSelect.appendChild(option);
    });
    document.getElementById('current-user-display').textContent = `(VOTING AS: ${CURRENT_USER})`;

    userSelect.addEventListener('change', (e) => {
        CURRENT_USER = e.target.value;
        document.getElementById('current-user-display').textContent = `(VOTING AS: ${CURRENT_USER})`;
        renderAllEvents();
    });
    
    // 3. New Event Form Handling (updated to use DB function)
    addEventBtn.addEventListener('click', () => {
        addEventForm.style.display = 'block';
        addEventBtn.style.display = 'none';
    });
    
    cancelEventBtn.addEventListener('click', () => {
        addEventForm.style.display = 'none';
        addEventBtn.style.display = 'block';
        addEventForm.reset();
    });

    addEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!CURRENT_USER) {
            alert("Please select your name from the 'Viewing As' dropdown before submitting an event.");
            return;
        }

        const newEvent = {
            day: document.getElementById('event-day').value,
            title: document.getElementById('event-title').value,
            time: document.getElementById('event-time').value,
            location: document.getElementById('event-location').value,
            votes: {
                yes: [CURRENT_USER],
                no: USERS.filter(user => user !== CURRENT_USER)
            }
        };

        addNewEventToDB(newEvent);
        
        addEventForm.style.display = 'none';
        addEventBtn.style.display = 'block';
        addEventForm.reset();
        // Render is now handled by the Firestore listener
    });

    // 4. Firestore Real-Time Data Listener
    // This is the core piece: it listens for changes and updates LIVE_EVENTS array
    db.collection('events').onSnapshot(snapshot => {
        LIVE_EVENTS = snapshot.docs.map(doc => ({
            id: doc.id, // Use Firestore's generated document ID as the event ID
            ...doc.data()
        }));
        
        // Re-render the events list every time the database changes
        renderAllEvents();
    }, error => {
        console.error("Firestore snapshot error:", error);
    });
    
    // 5. Initial Data Population (Manual one-time push)
    // IMPORTANT: Run this once manually if your 'events' collection is empty.
    // If you already have events in the DB, DELETE this section.
    const initialEvents = [
        { day: 'Dec 14 (Sea)', title: 'Captain\'s Welcome Aboard Show', time: '7:30 PM - 8:30 PM (1 hr)', location: 'Theater (Decks 2 & 3)', votes: { yes: ["Ciara", "Chris", "Evan"], no: ["Abe", "Bryce", "Allen", "Koda"] } },
        { day: 'Dec 14 (Sea)', title: 'Late-Night DJ Set', time: '11:00 PM - 1:00 AM (2 hr)', location: 'The Crypt Nightclub', votes: { yes: ["Abe", "Chris", "Koda"], no: ["Ciara", "Bryce", "Evan", "Allen"] } },
        { day: 'Dec 15 (Port 1)', title: 'Group Dinner Reservation at Chops', time: '7:00 PM', location: 'Chops Grille (Deck 11)', votes: { yes: ["Abe", "Ciara", "Chris", "Bryce"], no: ["Evan", "Allen", "Koda"] } },
    ];
    // UNCOMMENT AND RUN THIS CODE ONCE IF YOUR DB IS EMPTY:
    /*
    initialEvents.forEach(event => {
        db.collection('events').add(event);
    });
    */
});