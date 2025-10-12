// TypeScript-style client code (will be plain JS but with TS patterns)
class InterviewApp {
    constructor() {
        this.socket = null;
        this.currentRoom = null;
        this.isDrawing = false;
        this.lastDrawPoint = null;
        
        this.initializeElements();
        this.setupEventListeners();
        this.connectSocket();
    }

    initializeElements() {
        // Landing page elements
        this.landingPage = document.getElementById('landing-page');
        this.interviewRoom = document.getElementById('interview-room');
        this.createRoomBtn = document.getElementById('create-room-btn');
        this.joinRoomBtn = document.getElementById('join-room-btn');
        this.roomCodeInput = document.getElementById('room-code-input');
        this.statusMessage = document.getElementById('status-message');
        
        // Room elements
        this.roomIdDisplay = document.getElementById('room-id-display');
        this.participantsCount = document.getElementById('participants-count');
        this.leaveRoomBtn = document.getElementById('leave-room-btn');
        
        // Code editor
        this.codeEditor = document.getElementById('code-editor');
        this.typingIndicator = document.getElementById('typing-indicator');
        
        // Whiteboard
        this.whiteboard = document.getElementById('whiteboard');
        this.whiteboardCtx = this.whiteboard.getContext('2d');
        this.clearWhiteboardBtn = document.getElementById('clear-whiteboard');
        this.penColor = document.getElementById('pen-color');
        this.penSize = document.getElementById('pen-size');
        
        // Chat
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendChatBtn = document.getElementById('send-chat');
    }

    setupEventListeners() {
        // Landing page events
        this.createRoomBtn.addEventListener('click', () => this.createRoom());
        this.joinRoomBtn.addEventListener('click', () => this.joinRoom());
        this.roomCodeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.joinRoom();
        });
        
        // Room events
        this.leaveRoomBtn.addEventListener('click', () => this.leaveRoom());
        
        // Code editor events
        let codeTimeout;
        this.codeEditor.addEventListener('input', () => {
            clearTimeout(codeTimeout);
            codeTimeout = setTimeout(() => {
                this.sendCodeChange();
            }, 300); // Debounce for 300ms
        });
        
        // Whiteboard events
        this.setupWhiteboardEvents();
        this.clearWhiteboardBtn.addEventListener('click', () => this.clearWhiteboard());
        
        // Chat events
        this.sendChatBtn.addEventListener('click', () => this.sendChatMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendChatMessage();
        });
    }

    connectSocket() {
        this.socket = io();
        
        this.socket.on('connect', () => {
            console.log('Connected to server');
        });
        
        this.socket.on('disconnect', () => {
            console.log('Disconnected from server');
            this.showStatus('Connection lost. Trying to reconnect...', 'error');
        });
        
        // Room events
        this.socket.on('room-state', (state) => {
            this.codeEditor.value = state.codeContent;
            this.loadWhiteboardData(state.whiteboardData);
            this.loadChatMessages(state.chatMessages);
        });
        
        this.socket.on('user-joined', (data) => {
            this.addSystemMessage(`${data.username} joined the room`);
            this.updateParticipantCount();
        });
        
        this.socket.on('user-left', (data) => {
            this.addSystemMessage(`${data.username} left the room`);
            this.updateParticipantCount();
        });
        
        // Code editor events
        this.socket.on('code-update', (data) => {
            const cursorPosition = this.codeEditor.selectionStart;
            this.codeEditor.value = data.content;
            this.codeEditor.setSelectionRange(cursorPosition, cursorPosition);
            this.showTypingIndicator(data.userId);
        });
        
        // Whiteboard events
        this.socket.on('whiteboard-update', (data) => {
            this.drawOnWhiteboard(data);
        });
        
        // Chat events
        this.socket.on('chat-update', (message) => {
            this.addChatMessage(message);
        });
    }

    createRoom() {
        this.socket.emit('create-room', (response) => {
            if (response.success) {
                this.currentRoom = response.roomId;
                this.showInterviewRoom();
                this.showStatus('Room created successfully!', 'success');
            } else {
                this.showStatus('Failed to create room', 'error');
            }
        });
    }

    joinRoom() {
        const roomCode = this.roomCodeInput.value.trim().toUpperCase();
        if (!roomCode) {
            this.showStatus('Please enter a room code', 'error');
            return;
        }
        
        this.socket.emit('join-room', roomCode, (response) => {
            if (response.success) {
                this.currentRoom = response.roomId;
                this.showInterviewRoom();
                this.showStatus('Joined room successfully!', 'success');
            } else {
                this.showStatus(response.error || 'Failed to join room', 'error');
            }
        });
    }

    leaveRoom() {
        if (this.currentRoom) {
            this.socket.disconnect();
            this.socket.connect();
            this.currentRoom = null;
            this.showLandingPage();
            this.resetRoom();
        }
    }

    showLandingPage() {
        this.landingPage.classList.add('active');
        this.interviewRoom.classList.remove('active');
    }

    showInterviewRoom() {
        this.landingPage.classList.remove('active');
        this.interviewRoom.classList.add('active');
        this.roomIdDisplay.textContent = `Room: ${this.currentRoom}`;
        this.updateParticipantCount();
    }

    resetRoom() {
        this.codeEditor.value = '';
        this.clearWhiteboard();
        this.chatMessages.innerHTML = '';
        this.roomCodeInput.value = '';
    }

    updateParticipantCount() {
        // This is a simplified version - in a real app you'd track this properly
        this.participantsCount.textContent = '1-2 participants';
    }

    showStatus(message, type) {
        this.statusMessage.textContent = message;
        this.statusMessage.className = `status-message ${type}`;
        
        setTimeout(() => {
            this.statusMessage.textContent = '';
            this.statusMessage.className = 'status-message';
        }, 3000);
    }

    sendCodeChange() {
        if (this.currentRoom) {
            this.socket.emit('code-change', {
                content: this.codeEditor.value
            });
        }
    }

    showTypingIndicator(userId) {
        this.typingIndicator.textContent = 'Partner is typing...';
        setTimeout(() => {
            this.typingIndicator.textContent = '';
        }, 2000);
    }

    setupWhiteboardEvents() {
        this.whiteboard.addEventListener('mousedown', (e) => {
            this.isDrawing = true;
            this.lastDrawPoint = this.getMousePos(e);
        });
        
        this.whiteboard.addEventListener('mousemove', (e) => {
            if (!this.isDrawing) return;
            
            const currentPoint = this.getMousePos(e);
            const drawData = {
                type: 'draw',
                from: this.lastDrawPoint,
                to: currentPoint,
                color: this.penColor.value,
                size: parseInt(this.penSize.value)
            };
            
            this.drawOnWhiteboard(drawData);
            this.socket.emit('whiteboard-change', drawData);
            
            this.lastDrawPoint = currentPoint;
        });
        
        this.whiteboard.addEventListener('mouseup', () => {
            this.isDrawing = false;
        });
        
        this.whiteboard.addEventListener('mouseout', () => {
            this.isDrawing = false;
        });
    }

    getMousePos(e) {
        const rect = this.whiteboard.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    drawOnWhiteboard(data) {
        if (data.type === 'draw') {
            this.whiteboardCtx.strokeStyle = data.color;
            this.whiteboardCtx.lineWidth = data.size;
            this.whiteboardCtx.lineCap = 'round';
            
            this.whiteboardCtx.beginPath();
            this.whiteboardCtx.moveTo(data.from.x, data.from.y);
            this.whiteboardCtx.lineTo(data.to.x, data.to.y);
            this.whiteboardCtx.stroke();
        }
    }

    clearWhiteboard() {
        this.whiteboardCtx.clearRect(0, 0, this.whiteboard.width, this.whiteboard.height);
        if (this.currentRoom) {
            this.socket.emit('whiteboard-change', { type: 'clear' });
        }
    }

    loadWhiteboardData(data) {
        this.clearWhiteboard();
        data.forEach(item => {
            if (item.type === 'draw') {
                this.drawOnWhiteboard(item);
            }
        });
    }

    sendChatMessage() {
        const message = this.chatInput.value.trim();
        if (!message || !this.currentRoom) return;
        
        this.socket.emit('chat-message', { message });
        this.chatInput.value = '';
    }

    addChatMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${message.userId === this.socket.id ? 'own' : 'other'}`;
        
        messageDiv.innerHTML = `
            <div class="chat-username">${message.username}</div>
            <div class="chat-text">${this.escapeHtml(message.message)}</div>
            <div class="chat-timestamp">${new Date(message.timestamp).toLocaleTimeString()}</div>
        `;
        
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    loadChatMessages(messages) {
        this.chatMessages.innerHTML = '';
        messages.forEach(message => this.addChatMessage(message));
    }

    addSystemMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'system-message';
        messageDiv.textContent = text;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new InterviewApp();
});