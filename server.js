const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static('public'));

// In-memory storage for rooms
const rooms = new Map();

// Generate random room code
function generateRoomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create a new interview room
  socket.on('create-room', (callback) => {
    const roomCode = generateRoomCode();
    
    // Initialize room data
    rooms.set(roomCode, {
      id: roomCode,
      users: [socket.id],
      createdAt: new Date(),
      maxUsers: 2
    });

    // Join the room
    socket.join(roomCode);
    socket.roomCode = roomCode;

    console.log(`Room created: ${roomCode} by ${socket.id}`);
    
    // Send room code back to client
    callback({
      success: true,
      roomCode: roomCode,
      role: 'interviewer'
    });
  });

  // Join existing interview room
  socket.on('join-room', (roomCode, callback) => {
    const room = rooms.get(roomCode);
    
    if (!room) {
      callback({
        success: false,
        error: 'Room not found'
      });
      return;
    }

    if (room.users.length >= room.maxUsers) {
      callback({
        success: false,
        error: 'Room is full'
      });
      return;
    }

    // Add user to room
    room.users.push(socket.id);
    socket.join(roomCode);
    socket.roomCode = roomCode;

    console.log(`User ${socket.id} joined room: ${roomCode}`);

    // Notify other users in the room
    socket.to(roomCode).emit('user-joined', {
      userId: socket.id,
      userCount: room.users.length
    });

    callback({
      success: true,
      roomCode: roomCode,
      role: 'interviewee',
      userCount: room.users.length
    });
  });

  // Get room info
  socket.on('get-room-info', (callback) => {
    if (!socket.roomCode) {
      callback({ success: false, error: 'Not in a room' });
      return;
    }

    const room = rooms.get(socket.roomCode);
    if (room) {
      callback({
        success: true,
        roomCode: socket.roomCode,
        userCount: room.users.length,
        maxUsers: room.maxUsers
      });
    } else {
      callback({ success: false, error: 'Room not found' });
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    if (socket.roomCode) {
      const room = rooms.get(socket.roomCode);
      if (room) {
        // Remove user from room
        room.users = room.users.filter(id => id !== socket.id);
        
        // Notify other users
        socket.to(socket.roomCode).emit('user-left', {
          userId: socket.id,
          userCount: room.users.length
        });

        // Delete room if empty
        if (room.users.length === 0) {
          rooms.delete(socket.roomCode);
          console.log(`Room deleted: ${socket.roomCode}`);
        }
      }
    }
  });

  // Test connection
  socket.on('ping', (callback) => {
    callback('pong');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Ready for leetcode interview practice!`);
});
