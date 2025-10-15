import { io } from 'socket.io-client'

const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3001'
const NUM_CONNECTIONS = 50
const MESSAGES_PER_CONNECTION = 10

async function createConnection(id) {
  return new Promise((resolve) => {
    const socket = io(SERVER_URL)
    
    socket.on('connect', () => {
      console.log(`Connection ${id} established`)
      
      // Create or join a room
      socket.emit('create-room', (response) => {
        if (response.success) {
          console.log(`Connection ${id} created room ${response.roomId}`)
          
          // Send test messages
          let messageCount = 0
          const interval = setInterval(() => {
            if (messageCount >= MESSAGES_PER_CONNECTION) {
              clearInterval(interval)
              socket.disconnect()
              resolve()
              return
            }
            
            socket.emit('send-message', {
              roomId: response.roomId,
              message: `Test message ${messageCount} from connection ${id}`,
              username: `User${id}`
            })
            messageCount++
          }, 100)
        }
      })
    })
    
    socket.on('error', (error) => {
      console.error(`Connection ${id} error:`, error)
      socket.disconnect()
      resolve()
    })
  })
}

async function runLoadTest() {
  console.log(`Starting load test with ${NUM_CONNECTIONS} connections...`)
  const startTime = Date.now()
  
  const promises = []
  for (let i = 0; i < NUM_CONNECTIONS; i++) {
    promises.push(createConnection(i))
    // Stagger connections slightly
    await new Promise(resolve => setTimeout(resolve, 50))
  }
  
  await Promise.all(promises)
  
  const duration = (Date.now() - startTime) / 1000
  const totalMessages = NUM_CONNECTIONS * MESSAGES_PER_CONNECTION
  
  console.log('\n=== Load Test Results ===')
  console.log(`Duration: ${duration.toFixed(2)}s`)
  console.log(`Total Connections: ${NUM_CONNECTIONS}`)
  console.log(`Total Messages: ${totalMessages}`)
  console.log(`Messages/sec: ${(totalMessages / duration).toFixed(2)}`)
  console.log(`Avg time per connection: ${(duration / NUM_CONNECTIONS).toFixed(2)}s`)
}

runLoadTest().catch(console.error)