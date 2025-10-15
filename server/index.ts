import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import path from 'path'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

app.get('/', (req, res) => {
  res.send('Socket.IO server is running!')
})

interface Room {
  id: string
  participants: Set<string>
  messages: ChatMessage[]
  codeContent: string
  currentLanguage: string
  currentProblem: string
}

interface ChatMessage {
  id: string
  userId: string
  username: string
  message: string
  timestamp: Date
}

const rooms = new Map<string, Room>()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('create-room', (callback) => {
    const roomId = Math.random().toString(36).substring(2, 10).toUpperCase()
    const room: Room = {
      id: roomId,
      participants: new Set([socket.id]),
      messages: [],
      codeContent: `function twoSum(nums, target) {\n    \n}`,
      currentLanguage: 'javascript',
      currentProblem: 'two-sum'
    }
    rooms.set(roomId, room)
    socket.join(roomId)
    
    callback({ success: true, roomId })
  })

  socket.on('join-room', (data: { roomId: string }, callback) => {
    const room = rooms.get(data.roomId)
    if (!room) {
      callback({ success: false, error: 'Room not found' })
      return
    }

    if (room.participants.size >= 2) {
      callback({ success: false, error: 'Room is full' })
      return
    }

    room.participants.add(socket.id)
    socket.join(data.roomId)
    
    // Send existing messages to new participant
    socket.emit('room-messages', room.messages)
    
    // Notify room about new participant
    socket.to(data.roomId).emit('user-joined', { 
      userId: socket.id,
      participantCount: room.participants.size 
    })
    
    callback({ success: true, roomId: data.roomId, messages: room.messages })
    console.log(`User ${socket.id} joined room ${data.roomId}`)
  })

  socket.on('send-message', (data: { roomId: string, message: string, username: string }) => {
    const room = rooms.get(data.roomId)
    if (!room || !room.participants.has(socket.id)) {
      return
    }

    const chatMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: socket.id,
      username: data.username,
      message: data.message,
      timestamp: new Date()
    }

    room.messages.push(chatMessage)
    
    // Send to all participants in room
    io.to(data.roomId).emit('new-message', chatMessage)
  })

  socket.on('disconnect', () => {
    // Remove user from all rooms
    rooms.forEach((room, roomId) => {
      if (room.participants.has(socket.id)) {
        room.participants.delete(socket.id)
        socket.to(roomId).emit('user-left', { 
          userId: socket.id,
          participantCount: room.participants.size 
        })
        
        // Delete empty rooms
        if (room.participants.size === 0) {
          rooms.delete(roomId)
        }
      }
    })
    console.log('User disconnected:', socket.id)
  })
})

const PORT = process.env.PORT || 3001
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})