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
  
  // Initialize user
  users.set(socket.id, {
    id: socket.id,
    username: `User_${socket.id.substring(0, 6)}`
  });

  // Handle room creation
  socket.on('create-room', (callback) => {
    const roomId = uuidv4().substring(0, 8);
    const room: Room = {
      id: roomId,
      participants: new Set([socket.id]),
      codeContent: '// Welcome to the coding interview practice!\n// Start typing your solution here...\n\n',
      whiteboardData: [],
      chatMessages: [],
      createdAt: new Date()
    };
    
    rooms.set(roomId, room);
    socket.join(roomId);
    
    const user = users.get(socket.id)!;
    user.roomId = roomId;
    
    callback({ success: true, roomId });
    console.log(`Room created: ${roomId} by ${socket.id}`);
  });

  // Handle room joining
  socket.on('join-room', (roomId: string, callback) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      callback({ success: false, error: 'Room not found' });
      return;
    }
    
    if (room.participants.size >= 2) {
      callback({ success: false, error: 'Room is full' });
      return;
    }
    
    room.participants.add(socket.id);
    socket.join(roomId);
    
    const user = users.get(socket.id)!;
    user.roomId = roomId;
    
    // Send current room state to the new participant
    socket.emit('room-state', {
      codeContent: room.codeContent,
      whiteboardData: room.whiteboardData,
      chatMessages: room.chatMessages
    });
    
    // Notify others in the room
    socket.to(roomId).emit('user-joined', {
      userId: socket.id,
      username: user.username
    });
    
    callback({ success: true, roomId });
    console.log(`User ${socket.id} joined room: ${roomId}`);
  });

  // Handle code changes
  socket.on('code-change', (data: { content: string }) => {
    const user = users.get(socket.id);
    if (!user?.roomId) return;
    
    const room = rooms.get(user.roomId);
    if (!room) return;
    
    room.codeContent = data.content;
    
    // Broadcast to others in the room
    socket.to(user.roomId).emit('code-update', {
      content: data.content,
      userId: socket.id
    });
  });

  // Handle whiteboard changes
  socket.on('whiteboard-change', (data: any) => {
    const user = users.get(socket.id);
    if (!user?.roomId) return;
    
    const room = rooms.get(user.roomId);
    if (!room) return;
    
    room.whiteboardData.push({
      ...data,
      userId: socket.id,
      timestamp: new Date()
    });
    
    // Broadcast to others in the room
    socket.to(user.roomId).emit('whiteboard-update', data);
  });

  // Handle chat messages
  socket.on('chat-message', (data: { message: string }) => {
    const user = users.get(socket.id);
    if (!user?.roomId) return;
    
    const room = rooms.get(user.roomId);
    if (!room) return;
    
    const chatMessage: ChatMessage = {
      id: uuidv4(),
      userId: socket.id,
      username: user.username,
      message: data.message,
      timestamp: new Date()
    };
    
    room.chatMessages.push(chatMessage);
    
    // Broadcast to everyone in the room (including sender)
    io.to(user.roomId).emit('chat-update', chatMessage);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    const user = users.get(socket.id);
    if (user?.roomId) {
      const room = rooms.get(user.roomId);
      if (room) {
        room.participants.delete(socket.id);
        
        // Notify others in the room
        socket.to(user.roomId).emit('user-left', {
          userId: socket.id,
          username: user.username
        });
        
        // Clean up empty rooms
        if (room.participants.size === 0) {
          rooms.delete(user.roomId);
          console.log(`Room ${user.roomId} deleted (empty)`);
        }
      }
    }
    
    users.delete(socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
