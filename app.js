// TypeScript-style client code (will be plain JS but with TS patterns)
class InterviewApp {
    constructor() {
        this.socket = null;
        this.currentRoom = null;
        this.userRole = 'candidate';
        this.currentProblem = 'two-sum';
        this.currentLanguage = 'javascript';
        this.timerInterval = null;
        this.timerSeconds = 0;
        this.isDrawing = false;
        this.lastDrawPoint = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.connectSocket();
        this.loadProblemBank();
    }

    initializeElements() {
        // TODO: Get DOM elements for landing page
        // this.landingPage = document.getElementById('landing-page');
        // this.interviewRoom = document.getElementById('interview-room');
        // this.createRoomBtn = document.getElementById('create-room-btn');
        // this.joinRoomBtn = document.getElementById('join-room-btn');
        // this.roomCodeInput = document.getElementById('room-code-input');
        // this.statusMessage = document.getElementById('status-message');
        
        // TODO: Get DOM elements for room interface
        // this.roomIdDisplay = document.getElementById('room-id-display');
        // this.participantsCount = document.getElementById('participants-count');
        // this.leaveRoomBtn = document.getElementById('leave-room-btn');
        
        // TODO: Get DOM elements for code editor
        // this.codeEditor = document.getElementById('code-editor');
        // this.typingIndicator = document.getElementById('typing-indicator');
        
        // TODO: Get DOM elements for whiteboard
        // this.whiteboard = document.getElementById('whiteboard');
        // this.whiteboardCtx = this.whiteboard.getContext('2d');
        // this.clearWhiteboardBtn = document.getElementById('clear-whiteboard');
        // this.penColor = document.getElementById('pen-color');
        // this.penSize = document.getElementById('pen-size');
        
        // TODO: Get DOM elements for chat
        // this.chatMessages = document.getElementById('chat-messages');
        // this.chatInput = document.getElementById('chat-input');
        // this.sendChatBtn = document.getElementById('send-chat');
        
        console.log('TODO: Initialize DOM elements');
    }

    setupEventListeners() {
        // TODO: Add event listeners for landing page actions
        // this.createRoomBtn.addEventListener('click', () => this.handleCreateRoom());
        // this.joinRoomBtn.addEventListener('click', () => this.handleJoinRoom());
        // this.roomCodeInput.addEventListener('keypress', (e) => {
        //     if (e.key === 'Enter') this.submitRoomCode();
        // });
        
        // TODO: Add event listeners for room interface
        // this.leaveRoomBtn.addEventListener('click', () => this.leaveRoom());
        
        // TODO: Add event listeners for problem selection
        // this.problemSelector.addEventListener('change', () => this.changeProblem());
        // this.languageSelector.addEventListener('change', () => this.changeLanguage());
        // this.newProblemBtn.addEventListener('click', () => this.selectNewProblem());
        
        // TODO: Add event listeners for code editor
        // let codeTimeout;
        // this.codeEditor.addEventListener('input', () => {
        //     clearTimeout(codeTimeout);
        //     codeTimeout = setTimeout(() => {
        //         this.sendCodeChange();
        //     }, 300); // Debounce for 300ms
        // });
        
        // TODO: Add event listeners for whiteboard
        // this.setupWhiteboardEvents();
        // this.clearWhiteboardBtn.addEventListener('click', () => this.clearWhiteboard());
        
        // TODO: Add event listeners for chat
        // this.sendChatBtn.addEventListener('click', () => this.sendChatMessage());
        // this.chatInput.addEventListener('keypress', (e) => {
        //     if (e.key === 'Enter') this.sendChatMessage();
        // });
        
        console.log('TODO: Setup event listeners for wireframe-based UI');
    }

    handleCreateRoom() {
        // TODO: Show loading state
        // TODO: Create room and navigate to interview interface
        console.log('TODO: Handle create room');
    }

    handleJoinRoom() {
        // TODO: Show room code input
        // TODO: Focus on input field
        console.log('TODO: Handle join room - show input');
    }

    submitRoomCode() {
        // TODO: Get room code from input
        // TODO: Validate and join room
        // TODO: Navigate to interview interface
        console.log('TODO: Submit room code and join');
    }

    selectNewProblem() {
        // TODO: Show problem selection modal or cycle to next problem
        // TODO: Update problem content and reset code editor
        console.log('TODO: Select new problem');
    }

    updateRoomHeader() {
        // TODO: Update room ID, problem title, and timer in header
        console.log('TODO: Update room header display');
    }

    updateParticipantsList() {
        // TODO: Update participants list in left sidebar
        console.log('TODO: Update participants list');
    }

    selectRole(role) {
        // TODO: Update selected role
        // TODO: Update UI to show selected state
        // TODO: Store role for room creation/joining
        console.log('TODO: Select role:', role);
    }

    loadProblemBank() {
        // TODO: Load problem definitions
        // TODO: Populate problem selector
        // TODO: Set default problem content
        console.log('TODO: Load problem bank');
    }

    changeProblem() {
        // TODO: Get selected problem ID
        // TODO: Update problem content display
        // TODO: Update difficulty badge
        // TODO: Reset code editor with starter code
        // TODO: Emit problem change to other participants
        console.log('TODO: Change problem');
    }

    changeLanguage() {
        // TODO: Get selected language
        // TODO: Update code editor with language-specific starter code
        // TODO: Emit language change to other participants
        console.log('TODO: Change language');
    }

    toggleTimer() {
        // TODO: Start/pause/reset timer
        // TODO: Update timer display
        // TODO: Emit timer state to other participants
        console.log('TODO: Toggle timer');
    }

    updateTimer() {
        // TODO: Update timer display
        // TODO: Handle timer completion
        console.log('TODO: Update timer');
    }

    shareRoom() {
        // TODO: Generate shareable link
        // TODO: Copy to clipboard
        // TODO: Show success message
        console.log('TODO: Share room');
    }

    connectSocket() {
        // TODO: Initialize Socket.IO connection
        // this.socket = io();
        
        // TODO: Handle connection events
        // this.socket.on('connect', () => {
        //     console.log('Connected to server');
        // });
        
        // TODO: Handle disconnect events
        // this.socket.on('disconnect', () => {
        //     console.log('Disconnected from server');
        //     this.showStatus('Connection lost. Trying to reconnect...', 'error');
        // });
        
        // TODO: Handle room events
        // this.socket.on('room-state', (state) => { ... });
        // this.socket.on('user-joined', (data) => { ... });
        // this.socket.on('user-left', (data) => { ... });
        
        // TODO: Handle code editor events
        // this.socket.on('code-update', (data) => { ... });
        
        // TODO: Handle whiteboard events
        // this.socket.on('whiteboard-update', (data) => { ... });
        
        // TODO: Handle chat events
        // this.socket.on('chat-update', (message) => { ... });
        
        console.log('TODO: Setup Socket.IO connection and event handlers');
    }

    createRoom() {
        // TODO: Emit create-room event
        // TODO: Handle response and update UI
        console.log('TODO: Implement room creation');
    }

    joinRoom() {
        // TODO: Get room code from input
        // TODO: Validate room code
        // TODO: Emit join-room event
        // TODO: Handle response and update UI
        console.log('TODO: Implement room joining');
    }

    leaveRoom() {
        // TODO: Disconnect from current room
        // TODO: Reset UI to landing page
        // TODO: Clear room data
        console.log('TODO: Implement room leaving');
    }

    showLandingPage() {
        // TODO: Show landing page, hide interview room
        console.log('TODO: Show landing page');
    }

    showInterviewRoom() {
        // TODO: Hide landing page, show interview room
        // TODO: Update room display with current room ID
        console.log('TODO: Show interview room');
    }

    resetRoom() {
        // TODO: Clear code editor
        // TODO: Clear whiteboard
        // TODO: Clear chat messages
        // TODO: Reset input fields
        console.log('TODO: Reset room interface');
    }

    updateParticipantCount() {
        // TODO: Update participant count display
        console.log('TODO: Update participant count');
    }

    showStatus(message, type) {
        // TODO: Display status message with appropriate styling
        // TODO: Auto-hide after timeout
        console.log('TODO: Show status message');
    }

    sendCodeChange() {
        // TODO: Emit code-change event with current editor content
        console.log('TODO: Send code changes');
    }

    showTypingIndicator(userId) {
        // TODO: Show typing indicator
        // TODO: Hide after timeout
        console.log('TODO: Show typing indicator');
    }

    setupWhiteboardEvents() {
        // TODO: Add mouse event listeners for drawing
        // TODO: Handle mousedown, mousemove, mouseup events
        // TODO: Track drawing state and coordinates
        console.log('TODO: Setup whiteboard drawing events');
    }

    getMousePos(e) {
        // TODO: Calculate mouse position relative to canvas
        // TODO: Account for canvas offset
        console.log('TODO: Get mouse position');
        return { x: 0, y: 0 };
    }

    drawOnWhiteboard(data) {
        // TODO: Draw on canvas using provided data
        // TODO: Set stroke style, line width, and line cap
        // TODO: Draw line from start to end point
        console.log('TODO: Draw on whiteboard');
    }

    clearWhiteboard() {
        // TODO: Clear canvas
        // TODO: Emit clear event if in room
        console.log('TODO: Clear whiteboard');
    }

    loadWhiteboardData(data) {
        // TODO: Clear whiteboard
        // TODO: Replay all drawing data
        console.log('TODO: Load whiteboard data');
    }

    sendChatMessage() {
        // TODO: Get message from input
        // TODO: Validate message
        // TODO: Emit chat-message event
        // TODO: Clear input field
        console.log('TODO: Send chat message');
    }

    addChatMessage(message) {
        // TODO: Create message DOM element
        // TODO: Set appropriate CSS classes
        // TODO: Add to chat container
        // TODO: Scroll to bottom
        console.log('TODO: Add chat message to UI');
    }

    loadChatMessages(messages) {
        // TODO: Clear chat container
        // TODO: Add all messages to UI
        console.log('TODO: Load chat messages');
    }

    addSystemMessage(text) {
        // TODO: Create system message DOM element
        // TODO: Add to chat container
        // TODO: Scroll to bottom
        console.log('TODO: Add system message');
    }

    escapeHtml(text) {
        // TODO: Escape HTML characters for security
        console.log('TODO: Escape HTML');
        return text;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // TODO: Create new InterviewApp instance
    console.log('TODO: Initialize InterviewApp');
});