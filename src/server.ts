import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Types for our application
interface Room {
  id: string;
  participants: Set<string>;
  codeContent: string;
  whiteboardData: any[];
  chatMessages: ChatMessage[];
  createdAt: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
}

interface UserSocket {
  id: string;
  username: string;
  roomId?: string;
}

// In-memory storage (replace with database later)
const rooms = new Map<string, Room>();
const users = new Map<string, UserSocket>();

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // TODO: Initialize user
  // users.set(socket.id, { ... });

  // Handle room creation
  socket.on('create-room', (callback) => {
    // TODO: Generate room ID
    // TODO: Create room object
    // TODO: Add user to room
    // TODO: Send success response
    console.log('TODO: Implement room creation');
  });

  // Handle room joining
  socket.on('join-room', (roomId: string, callback) => {
    // TODO: Validate room exists
    // TODO: Check room capacity
    // TODO: Add user to room
    // TODO: Send room state to new user
    // TODO: Notify other participants
    console.log('TODO: Implement room joining');
  });

  // Handle code changes
  socket.on('code-change', (data: { content: string }) => {
    // TODO: Update room code content
    // TODO: Broadcast to other participants
    console.log('TODO: Implement code synchronization');
  });

  // Handle whiteboard changes
  socket.on('whiteboard-change', (data: any) => {
    // TODO: Store whiteboard data
    // TODO: Broadcast drawing to other participants
    console.log('TODO: Implement whiteboard synchronization');
  });

  // Handle chat messages
  socket.on('chat-message', (data: { message: string }) => {
    // TODO: Create chat message object
    // TODO: Store in room
    // TODO: Broadcast to all participants
    console.log('TODO: Implement chat messaging');
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // TODO: Remove user from room
    // TODO: Notify other participants
    // TODO: Clean up empty rooms
    console.log('TODO: Implement disconnect cleanup');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
