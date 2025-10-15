import React, { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface ChatMessage {
  id: string
  userId: string
  username: string
  message: string
  timestamp: Date
}

interface SocketContextType {
  socket: Socket | null
  isConnected: boolean
  createRoom: () => Promise<string | null>
  joinRoom: (roomId: string) => Promise<boolean>
  sendMessage: (roomId: string, message: string, username: string) => void
  sendCodeChange: (roomId: string, code: string) => void  // Add this
  changeLanguage: (roomId: string, language: string) => void  // Add this
  messages: ChatMessage[]
  participantCount: number
  codeContent: string  // Add this
  currentLanguage: string  // Add this
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [participantCount, setParticipantCount] = useState(0)
  const [codeContent, setCodeContent] = useState('')
  const [currentLanguage, setCurrentLanguage] = useState('javascript')

  useEffect(() => {
    const newSocket = io('http://localhost:3001')
    
    newSocket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to server')
    })

    newSocket.on('disconnect', () => {
      setIsConnected(false)
      console.log('Disconnected from server')
    })

    newSocket.on('room-messages', (roomMessages: ChatMessage[]) => {
      setMessages(roomMessages)
    })

    newSocket.on('new-message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message])
    })

    newSocket.on('user-joined', (data: { userId: string, participantCount: number }) => {
      setParticipantCount(data.participantCount)
    })

    newSocket.on('user-left', (data: { userId: string, participantCount: number }) => {
      setParticipantCount(data.participantCount)
    })

    newSocket.on('code-update', (data: { code: string, userId: string }) => {
      setCodeContent(data.code)
    })
  
    newSocket.on('language-update', (data: { language: string, code: string }) => {
      setCurrentLanguage(data.language)
      setCodeContent(data.code)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

  const createRoom = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!socket) {
        resolve(null)
        return
      }

      socket.emit('create-room', (response: { success: boolean, roomId?: string }) => {
        if (response.success && response.roomId) {
          setParticipantCount(1)
          resolve(response.roomId)
        } else {
          resolve(null)
        }
      })
    })
  }

  const joinRoom = (roomId: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (!socket) {
        resolve(false)
        return
      }
  
      socket.emit('join-room', { roomId }, (response: { 
        success: boolean, 
        error?: string,
        messages?: ChatMessage[],
        codeContent?: string,
        currentLanguage?: string
      }) => {
        if (response.success) {
          setMessages(response.messages || [])
          setCodeContent(response.codeContent || '')
          setCurrentLanguage(response.currentLanguage || 'javascript')
          setParticipantCount(2)
          resolve(true)
        } else {
          resolve(false)
        }
      })
    })
  }

  const sendMessage = (roomId: string, message: string, username: string) => {
    if (socket && message.trim()) {
      socket.emit('send-message', { roomId, message: message.trim(), username })
    }
  }

  const sendCodeChange = (roomId: string, code: string) => {
    if (socket) {
      setCodeContent(code)  // Update local state immediately
      socket.emit('code-change', { roomId, code })
    }
  }
  
  const changeLanguage = (roomId: string, language: string) => {
    if (socket) {
      socket.emit('language-change', { roomId, language })
    }
  }

  return (
    <SocketContext.Provider value={{
      socket,
      isConnected,
      createRoom,
      joinRoom,
      sendMessage,
      messages,
      participantCount
    }}>
      {children}
    </SocketContext.Provider>
  )
}