import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const app = express()
app.use(express.json())

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST"]
  }
})

app.get('/', (req, res) => {
  res.send('Socket.IO server is running!')
})

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    rooms: rooms.size
  })
})

// LeetCode API proxy to avoid CORS issues
app.post('/api/leetcode/problems', async (req, res) => {
  try {
    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'https://leetcode.com',
        'User-Agent': 'Mozilla/5.0 (compatible; InterviewApp/1.0)'
      },
      body: JSON.stringify({
        query: `
          query problemsetQuestionList {
            problemsetQuestionList: questionList(
              categorySlug: ""
              limit: -1
              skip: 0
              filters: {}
            ) {
              total: totalNum
              questions: data {
                acRate
                difficulty
                freqBar
                frontendQuestionId: questionFrontendId
                isFavor
                paidOnly: isPaidOnly
                status
                title
                titleSlug
                topicTags {
                  name
                  slug
                }
              }
            }
          }
        `
      })
    })

    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.error('Error fetching LeetCode problems:', error)
    res.status(500).json({ error: 'Failed to fetch problems' })
  }
})

interface Room {
  id: string
  creator: string
  participants: Set<string>
  messages: ChatMessage[]
  codeContent: string
  currentLanguage: string
  currentProblem: string
  timerStartedAt: Date | null
  timerDuration: number  //(in seconds)
  viewMode: 'hybrid' | 'whiteboard'
  viewModeLocked: boolean
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

  socket.on('create-room', (dataOrCallback?: any, callbackOrUndefined?: any) => {
    // Handle both (callback) and (data, callback) signatures
    let data: { problemSlug?: string } = {}
    let callback: Function
    
    if (typeof dataOrCallback === 'function') {
      callback = dataOrCallback
      data = {}
    } else {
      data = dataOrCallback || {}
      callback = callbackOrUndefined
    }
    
    const roomId = Math.random().toString(36).substring(2, 10).toUpperCase()
    const problemSlug = data.problemSlug || 'two-sum'
    
    const room: Room = {
      id: roomId,
      creator: socket.id,
      participants: new Set([socket.id]),
      messages: [],
      codeContent: `function twoSum(nums, target) {\n    // Your code here\n}`,
      currentLanguage: 'javascript',
      currentProblem: problemSlug,
      timerStartedAt: null,
      timerDuration: 2700, // 45 minutes default
      viewMode: 'hybrid',
      viewModeLocked: false
    }
    rooms.set(roomId, room)
    socket.join(roomId)
    
    if (callback) {
      callback({ success: true, roomId, problemSlug })
    }
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
    
    // Send full room state including code and view settings
    callback({ 
      success: true, 
      roomId: data.roomId, 
      messages: room.messages,
      codeContent: room.codeContent,
      currentLanguage: room.currentLanguage,
      currentProblem: room.currentProblem,
      viewMode: room.viewMode,
      viewModeLocked: room.viewModeLocked,
      isCreator: socket.id === room.creator
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

  // Whiteboard synchronization
  socket.on('whiteboard-draw', (data: { 
    roomId: string, 
    x: number, 
    y: number, 
    prevX: number, 
    prevY: number, 
    color: string, 
    lineWidth: number 
  }) => {
    const room = rooms.get(data.roomId)
    if (!room || !room.participants.has(socket.id)) {
      return
    }

    // Broadcast drawing to all OTHER participants
    socket.to(data.roomId).emit('whiteboard-draw', {
      x: data.x,
      y: data.y,
      prevX: data.prevX,
      prevY: data.prevY,
      color: data.color,
      lineWidth: data.lineWidth
    })
  })

  socket.on('whiteboard-clear', (data: { roomId: string }) => {
    const room = rooms.get(data.roomId)
    if (!room || !room.participants.has(socket.id)) {
      return
    }

    // Broadcast clear to all OTHER participants
    socket.to(data.roomId).emit('whiteboard-clear')
  })

  // View mode control (creator only)
  socket.on('change-view-mode', (data: { roomId: string, viewMode: 'hybrid' | 'whiteboard' }) => {
    const room = rooms.get(data.roomId)
    if (!room || socket.id !== room.creator) {
      return
    }

    room.viewMode = data.viewMode
    // Broadcast to all participants including creator
    io.to(data.roomId).emit('view-mode-update', { viewMode: data.viewMode })
  })

  socket.on('toggle-view-lock', (data: { roomId: string, locked: boolean }) => {
    const room = rooms.get(data.roomId)
    if (!room || socket.id !== room.creator) {
      return
    }

    room.viewModeLocked = data.locked
    // Broadcast to all participants including creator
    io.to(data.roomId).emit('view-lock-update', { locked: data.locked })
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