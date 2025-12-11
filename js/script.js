document.addEventListener('DOMContentLoaded', () => {
    // --- Configuration ---
    const USERS = ["Abe", "Ciara", "Chris", "Bryce", "Evan", "Allen", "Koda"];
    let CURRENT_USER = USERS[0]; // Default user, tracked via dropdown
    let eventIdCounter = 100; // Counter for unique IDs (starting high to avoid conflict with e001-e008)
    
    // Structure: { 'Dec 14': [{event object}, {event object}], ... }
    let eventsByDay = {}; 
    
    // --- DOM Elements ---
    const tabLinks = document.querySelectorAll('.tabs-nav .tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const userSelect = document.getElementById('current-user-select');
    const eventsListContainer = document.getElementById('events-list');
    const addEventBtn = document.getElementById('add-event-btn');
    const addEventForm = document.getElementById('add-event-form');
    const cancelEventBtn = document.getElementById('cancel-event-btn');

    // --- Utility Functions ---

    // Function to generate unique event ID
    const getNextEventId = () => {
        eventIdCounter++;
        return `e${eventIdCounter}`;
    };

    // Function to create the HTML string for an event card
    const createEventCardHTML = (event) => {
        // Find the current user's vote status for styling
        const isYes = event.votes.yes.includes(CURRENT_USER) ? ' selected' : '';
        const isNo = event.votes.no.includes(CURRENT_USER) ? ' selected' : '';

        return `
            <div class="event-card">
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
                    <div class="poll-results" style="display: none;">
                        <p class="yes-attendees"><strong>Attending (${event.votes.yes.length}):</strong> ${event.votes.yes.sort().join(', ')}</p>
                        <p class="no-attendees"><strong>Not Attending (${event.votes.no.length}):</strong> ${event.votes.no.sort().join(', ')}</p>
                    </div>
                </div>
            </div>
        `;
    };

    // Main function to render ALL events grouped by day
    const renderAllEvents = () => {
        eventsListContainer.innerHTML = '';
        const sortedDays = Object.keys(eventsByDay).sort();

        sortedDays.forEach(day => {
            if (eventsByDay[day].length > 0) {
                eventsListContainer.innerHTML += `<div class="day-header">${day}</div>`;
                
                // Sort events by time (simplistic sort based on time string)
                eventsByDay[day].sort((a, b) => a.time.localeCompare(b.time));
                
                eventsByDay[day].forEach(event => {
                    eventsListContainer.innerHTML += createEventCardHTML(event);
                });
            }
        });

        // Re-attach poll listeners after new HTML is injected
        attachPollListeners();
    };

    // Function to initialize or add a new event to the data structure
    const addEventToData = (eventData) => {
        if (!eventsByDay[eventData.day]) {
            eventsByDay[eventData.day] = [];
        }
        eventsByDay[eventData.day].push(eventData);
    };
    
    // --- Poll Handlers ---

    // Function to attach click handlers to the poll buttons
    const attachPollListeners = () => {
        document.querySelectorAll('.poll-btn').forEach(button => {
            button.onclick = function() {
                if (!CURRENT_USER) {
                    alert("Please select your name from the 'Viewing As' dropdown first.");
                    return;
                }
                
                const pollElement = this.closest('.group-poll');
                const eventId = pollElement.getAttribute('data-event-id');
                const voteType = this.getAttribute('data-vote'); // 'yes' or 'no'
                const oppositeType = (voteType === 'yes' ? 'no' : 'yes');

                // Find the event object in the data structure
                let eventObj;
                Object.values(eventsByDay).flat().forEach(e => {
                    if (e.id === eventId) {
                        eventObj = e;
                    }
                });

                if (eventObj) {
                    // 1. Remove user from the opposite category
                    eventObj.votes[oppositeType] = eventObj.votes[oppositeType].filter(name => name !== CURRENT_USER);
                    
                    // 2. Add user to the current category (only if not already there)
                    if (!eventObj.votes[voteType].includes(CURRENT_USER)) {
                        eventObj.votes[voteType].push(CURRENT_USER);
                    }
                }

                // Re-render all to update the counts and highlights
                renderAllEvents();
            };
        });
        
        // Listener for toggling poll results visibility
        document.querySelectorAll('.group-poll').forEach(poll => {
             poll.onclick = function(e) {
                if (e.target.classList.contains('poll-btn') || e.target.classList.contains('poll-prompt')) {
                    const results = poll.querySelector('.poll-results');
                    results.style.display = results.style.display === 'none' ? 'block' : 'none';
                }
            };
        });
    };


    // --- Initialization & Setup ---
    
    // 1. Set up the Tab Switching
    tabLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetTab = link.getAttribute('data-tab');
            tabLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            link.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            // Re-render events when Daily Plan tab is activated
            if (targetTab === 'tab-daily') {
                renderAllEvents();
            }
        });
    });

    // 2. Set up the User Selector
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
        renderAllEvents(); // Re-render to update current user's highlight
    });
    
    // 3. Populate initial (hardcoded) events
    // 3. Populate initial (hardcoded) events
    const initialEvents = [
        // Hardcoded Event 1 (Dec 14)
        { id: 'e001', day: 'Dec 14 (Sea)', title: 'Captain\'s Welcome Aboard Show', time: '7:30 PM - 8:30 PM (1 hr)', location: 'Theater (Decks 2 & 3)', votes: { yes: ["Ciara", "Chris", "Evan"], no: ["Abe", "Bryce", "Allen", "Koda"] } },
        // Hardcoded Event 2 (Dec 14)
        { id: 'e002', day: 'Dec 14 (Sea)', title: 'Late-Night DJ Set', time: '11:00 PM - 1:00 AM (2 hr)', location: 'The Crypt Nightclub', votes: { yes: ["Abe", "Chris", "Koda"], no: ["Ciara", "Bryce", "Evan", "Allen"] } },
        
        // --- NEW DUMMY EVENT (e009) ---
        { 
            id: 'e009', 
            day: 'Dec 15 (Port 1)', 
            title: 'Group Dinner Reservation at Chops', 
            time: '7:00 PM', 
            location: 'Chops Grille (Deck 11)', 
            votes: { 
                // Simulating a consensus vote: Abe, Ciara, Chris, and Bryce are going.
                yes: ["Abe", "Ciara", "Chris", "Bryce"], 
                no: ["Evan", "Allen", "Koda"] 
            } 
        },
        // -------------------------------
    ];
    initialEvents.forEach(addEventToData);
    
    // 4. Form Handling for New Events
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
        
        // Check if user is selected before creating event
        if (!CURRENT_USER) {
            alert("Please select your name from the 'Viewing As' dropdown before submitting an event.");
            return;
        }

        const newEvent = {
            id: getNextEventId(),
            day: document.getElementById('event-day').value,
            title: document.getElementById('event-title').value,
            time: document.getElementById('event-time').value,
            location: document.getElementById('event-location').value,
            // Automatic YES vote for the user who created it
            votes: {
                yes: [CURRENT_USER],
                no: USERS.filter(user => user !== CURRENT_USER)
            }
        };

        addEventToData(newEvent);
        addEventForm.style.display = 'none';
        addEventBtn.style.display = 'block';
        addEventForm.reset();
        renderAllEvents(); // Update the list immediately
    });

    // Initial render of events when the page first loads (if on the daily tab)
    if (document.getElementById('tab-daily').classList.contains('active')) {
        renderAllEvents();
    }
});