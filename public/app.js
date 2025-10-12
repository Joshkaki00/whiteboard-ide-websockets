// Socket.IO client connection
const socket = io();

// DOM elements
const landingPage = document.getElementById('landing-page');
const roomPage = document.getElementById('room-page');
const createRoomBtn = document.getElementById('create-room-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const roomCodeInput = document.getElementById('room-code-input');
const leaveRoomBtn = document.getElementById('leave-room-btn');
const currentRoomCode = document.getElementById('current-room-code');
const userRole = document.getElementById('user-role');
const userCount = document.getElementById('user-count');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const errorText = document.querySelector('.error-text');
const closeError = document.querySelector('.close-error');
const connectionStatus = document.getElementById('connection-status');
const roomStatus = document.getElementById('room-status');

// Application state
let currentRoom = null;
let isConnected = false;

// Utility functions
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function showLoading() {
    loading.classList.remove('hidden');
}

function hideLoading() {
    loading.classList.add('hidden');
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    errorMessage.classList.add('hidden');
}

function updateConnectionStatus(connected) {
    isConnected = connected;
    const statusDot = connectionStatus.querySelector('.status-dot');
    const statusText = connectionStatus.querySelector('.status-dot').nextSibling;
    
    if (connected) {
        statusDot.classList.add('connected');
        statusDot.classList.remove('disconnected');
        statusText.textContent = ' Connected to server';
    } else {
        statusDot.classList.add('disconnected');
        statusDot.classList.remove('connected');
        statusText.textContent = ' Disconnected from server';
    }
}

function updateRoomInfo(roomCode, role, count = 1) {
    currentRoomCode.textContent = roomCode;
    userRole.textContent = role;
    userCount.textContent = `${count}/2 users`;
    
    // Update role badge color
    if (role === 'interviewer') {
        userRole.style.background = '#667eea';
    } else {
        userRole.style.background = '#48bb78';
    }
}

// Socket.IO event handlers
socket.on('connect', () => {
    console.log('Connected to server');
    updateConnectionStatus(true);
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    updateConnectionStatus(false);
    showError('Connection lost. Attempting to reconnect...');
});

socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    updateConnectionStatus(false);
    showError('Failed to connect to server');
    hideLoading();
});

socket.on('user-joined', (data) => {
    console.log('User joined:', data);
    userCount.textContent = `${data.userCount}/2 users`;
    
    // Show notification
    showError(`Another user joined the room! (${data.userCount}/2)`);
    setTimeout(() => {
        hideError();
    }, 3000);
});

socket.on('user-left', (data) => {
    console.log('User left:', data);
    userCount.textContent = `${data.userCount}/2 users`;
    showError(`User left the room (${data.userCount}/2)`);
    setTimeout(() => {
        hideError();
    }, 3000);
});

// Button event handlers
createRoomBtn.addEventListener('click', () => {
    showLoading();
    
    socket.emit('create-room', (response) => {
        hideLoading();
        
        if (response.success) {
            currentRoom = response.roomCode;
            updateRoomInfo(response.roomCode, response.role, 1);
            showPage('room-page');
            console.log('Room created:', response.roomCode);
        } else {
            showError(response.error || 'Failed to create room');
        }
    });
});

joinRoomBtn.addEventListener('click', () => {
    const roomCode = roomCodeInput.value.trim().toUpperCase();
    
    if (!roomCode) {
        showError('Please enter a room code');
        return;
    }
    
    if (roomCode.length !== 6) {
        showError('Room code must be 6 characters');
        return;
    }
    
    showLoading();
    
    socket.emit('join-room', roomCode, (response) => {
        hideLoading();
        
        if (response.success) {
            currentRoom = response.roomCode;
            updateRoomInfo(response.roomCode, response.role, response.userCount);
            showPage('room-page');
            roomCodeInput.value = '';
            console.log('Joined room:', response.roomCode);
        } else {
            showError(response.error || 'Failed to join room');
        }
    });
});

leaveRoomBtn.addEventListener('click', () => {
    if (currentRoom) {
        socket.disconnect();
        socket.connect();
        currentRoom = null;
        showPage('landing-page');
        console.log('Left room');
    }
});

// Room code input handling
roomCodeInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
});

roomCodeInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        joinRoomBtn.click();
    }
});

// Error message close handler
closeError.addEventListener('click', hideError);

// Test connection on page load
window.addEventListener('load', () => {
    // Test ping to server
    socket.emit('ping', (response) => {
        if (response === 'pong') {
            console.log('Server connection test successful');
        }
    });
});

// Prevent accidental page refresh in room
window.addEventListener('beforeunload', (e) => {
    if (currentRoom) {
        e.preventDefault();
        e.returnValue = 'You are currently in an interview room. Are you sure you want to leave?';
    }
});

// Debug helpers (remove in production)
window.debugApp = {
    socket,
    currentRoom,
    showError,
    showPage
};
