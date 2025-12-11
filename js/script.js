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

    // --- NEW FUNCTION: Attach View Votes Listeners ---
    const attachViewVotesListeners = () => {
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

    // --- NEW FUNCTION: Attach Delete Listeners ---
    const attachDeleteListeners = () => {
        document.querySelectorAll('.delete-event-btn').forEach(button => {
            button.onclick = function() {
                const eventIdToDelete = this.getAttribute('data-event-id');
                
                // Confirmation Step
                if (!confirm("Are you sure you want to delete this event? This action cannot be undone.")) {
                    return; // Stop if the user clicks Cancel
                }

                // Loop through all days to find and delete the event
                for (const day in eventsByDay) {
                    eventsByDay[day] = eventsByDay[day].filter(event => event.id !== eventIdToDelete);
                }

                // After deletion, re-render the list to update the view
                renderAllEvents();
            };
        });
    };

    // --- NEW FUNCTION: Attach Collapse Listeners ---
    const attachCollapseListeners = () => {
        document.querySelectorAll('.collapse-btn').forEach(button => {
            button.onclick = function() {
                const dayToToggle = this.getAttribute('data-day');
                const currentState = this.getAttribute('data-state');
                
                // Select all event wrappers for that specific day
                const eventWrappers = document.querySelectorAll(`.event-day-${dayToToggle.replace(/[^a-zA-Z0-9]/g, '-')}`);
                
                if (currentState === 'expanded') {
                    // Collapse the section
                    eventWrappers.forEach(wrapper => {
                        wrapper.style.display = 'none';
                    });
                    this.setAttribute('data-state', 'collapsed');
                    this.innerHTML = '<i class="fas fa-chevron-down"></i>';
                } else {
                    // Expand the section
                    eventWrappers.forEach(wrapper => {
                        wrapper.style.display = 'block';
                    });
                    this.setAttribute('data-state', 'expanded');
                    this.innerHTML = '<i class="fas fa-chevron-up"></i>';
                }
            };
        });
    };
    // Main function to render ALL events grouped by day
    const renderAllEvents = () => {
        eventsListContainer.innerHTML = '';
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

        // Re-attach listeners after new HTML is injected
        attachPollListeners();
        attachDeleteListeners();
        attachViewVotesListeners();
        attachCollapseListeners(); // <--- NEW LINE ADDED HERE
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
    const initialEvents = [
        // Hardcoded Event 1 (Dec 14)
        { 
            id: 'e001', 
            day: 'Dec 14 (Sea)', 
            title: 'Captain\'s Welcome Aboard Show', 
            time: '7:30 PM - 8:30 PM (1 hr)', 
            location: 'Theater (Decks 2 & 3)', 
            votes: { 
                yes: ["Ciara", "Chris", "Evan"], 
                no: ["Abe", "Bryce", "Allen", "Koda"] 
            } 
        },
        // Hardcoded Event 2 (Dec 14)
        { 
            id: 'e002', 
            day: 'Dec 14 (Sea)', 
            title: 'Late-Night DJ Set', 
            time: '11:00 PM - 1:00 AM (2 hr)', 
            location: 'The Crypt Nightclub', 
            votes: { 
                yes: ["Abe", "Chris", "Koda"], 
                no: ["Ciara", "Bryce", "Evan", "Allen"] 
            } 
        },
        // Dummy Event (Dec 15)
        { 
            id: 'e009', 
            day: 'Dec 15 (Port 1)', 
            title: 'Group Dinner Reservation at Chops', 
            time: '7:00 PM', 
            location: 'Chops Grille (Deck 11)', 
            votes: { 
                yes: ["Abe", "Ciara", "Chris", "Bryce"], 
                no: ["Evan", "Allen", "Koda"] 
            } 
        },
        // --- Original Events from User Input (e003 - e008) ---
        { 
            id: 'e003', 
            day: 'Dec 14 (Sea)', 
            title: 'Guess the Weight of the Sculpture', 
            time: '10:40 AM - 3:10 PM', 
            location: 'Deck 5', 
            votes: { yes: [], no: [] } 
        },
        { 
            id: 'e004', 
            day: 'Dec 14 (Sea)', 
            title: 'Caribbean Tunes with Tropical Band', 
            time: '11:15 AM - 12:00 PM', 
            location: 'Deck 11', 
            votes: { yes: [], no: [] } 
        },
        { 
            id: 'e005', 
            day: 'Dec 14 (Sea)', 
            title: 'Complimentary Facial Demonstration', 
            time: '12:00 PM - 4:00 PM', 
            location: 'Deck 12', 
            votes: { yes: [], no: [] } 
        },
        { 
            id: 'e006', 
            day: 'Dec 14 (Sea)', 
            title: 'Complimentary Massage Demonstration', 
            time: '12:00 PM - 4:30 PM', 
            location: 'Deck 12', 
            votes: { yes: [], no: [] } 
        },
        { 
            id: 'e007', 
            day: 'Dec 14 (Sea)', 
            title: 'Pain Management with Acupuncture', 
            time: '12:00 PM - 5:00 PM', 
            location: 'Deck 4', 
            votes: { yes: [], no: [] } 
        },
        { 
            id: 'e008', 
            day: 'Dec 14 (Sea)', 
            title: 'Port & Shopping Expert Available', 
            time: '12:00 PM - 2:00 PM', 
            location: 'Deck 4', 
            votes: { yes: [], no: [] } 
        },
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