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
  timerStartedAt: Date | null
  timerDuration: number  //(in seconds)
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

  socket.on('create-room', (data: { problemSlug?: string }, callback) => {
    const roomId = Math.random().toString(36).substring(2, 10).toUpperCase()
    const problemSlug = data.problemSlug || 'two-sum'
    
    const room: Room = {
      id: roomId,
      participants: new Set([socket.id]),
      messages: [],
      codeContent: `function twoSum(nums, target) {\n    // Your code here\n}`,
      currentLanguage: 'javascript',
      currentProblem: problemSlug,
      timerStartedAt: null,
      timerDuration: 2700 // 45 minutes default
    }
    rooms.set(roomId, room)
    socket.join(roomId)
    
    callback({ success: true, roomId, problemSlug })
    console.log(`Room created: ${roomId} with problem ${problemSlug}`)
  })

  socket.on('join-room', (data: { roomId: string }, callback) => {
    const room = rooms.get(data.roomId)
    if (!room) {
      callback({ success: false, error: 'Room not found' })
      return
    }
  
    room.participants.add(socket.id)
    socket.join(data.roomId)
    
    // Send full room state including code
    callback({ 
      success: true, 
      roomId: data.roomId, 
      messages: room.messages,
      codeContent: room.codeContent,  // Add this
      currentLanguage: room.currentLanguage,  // Add this
      currentProblem: room.currentProblem  // Add this
    })
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

  socket.on('change-problem', (data: { roomId: string, problemSlug: string, starterCode: string }, callback) => {
    const room = rooms.get(data.roomId)
    if (!room || !room.participants.has(socket.id)) {
      callback({ success: false, error: 'Unauthorized' })
      return
    }
  
    room.currentProblem = data.problemSlug
    room.codeContent = data.starterCode
  
    // Broadcast to all participants
    io.to(data.roomId).emit('problem-changed', {
      problemSlug: data.problemSlug,
      code: data.starterCode
    })
  
    callback({ success: true })
  })

  socket.on('start-timer', (data: { roomId: string, duration: number }) => {
    const room = rooms.get(data.roomId)
    if (!room) return
  
    room.timerStartedAt = new Date()
    room.timerDuration = data.duration
  
    io.to(data.roomId).emit('timer-started', {
      startedAt: room.timerStartedAt,
      duration: room.timerDuration
    })
  })
  
  socket.on('pause-timer', (data: { roomId: string }) => {
    const room = rooms.get(data.roomId)
    if (!room) return
  
    io.to(data.roomId).emit('timer-paused')
  })
  
  socket.on('reset-timer', (data: { roomId: string }) => {
    const room = rooms.get(data.roomId)
    if (!room) return
  
    room.timerStartedAt = null
  
    io.to(data.roomId).emit('timer-reset')
  })

  socket.on('code-change', (data: { roomId: string, code: string }) => {
    const room = rooms.get(data.roomId)
    if (!room || !room.participants.has(socket.id)) {
      return
    }
  
    // Update room's code content
    room.codeContent = data.code
    
    // Broadcast to all OTHER participants (not sender)
    socket.to(data.roomId).emit('code-update', {
      code: data.code,
      userId: socket.id
    })
  })

  socket.on('language-change', (data: { roomId: string, language: string }) => {
    const room = rooms.get(data.roomId)
    if (!room || !room.participants.has(socket.id)) {
      return
    }
  
    room.currentLanguage = data.language
    
    // Update starter code based on language
    const starterCodes: Record<string, string> = {
      javascript: `function twoSum(nums, target) {\n    \n}`,
      python: `def two_sum(nums, target):\n    pass`,
      java: `public int[] twoSum(int[] nums, int target) {\n    \n}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    \n}`
    }
    
    room.codeContent = starterCodes[data.language] || starterCodes.javascript
    
    // Broadcast to all participants including sender
    io.to(data.roomId).emit('language-update', {
      language: data.language,
      code: room.codeContent
    })
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