import React, { createContext, useContext, useEffect, useState, useMemo } from 'react'
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
  sendCodeChange: (roomId: string, code: string) => void
  changeLanguage: (roomId: string, language: string) => void
  changeViewMode: (roomId: string, viewMode: 'hybrid' | 'whiteboard') => void
  toggleViewLock: (roomId: string, locked: boolean) => void
  messages: ChatMessage[]
  participantCount: number
  codeContent: string
  currentLanguage: string
  viewMode: 'hybrid' | 'whiteboard'
  viewModeLocked: boolean
  isCreator: boolean
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
  const [viewMode, setViewMode] = useState<'hybrid' | 'whiteboard'>('hybrid')
  const [viewModeLocked, setViewModeLocked] = useState(false)
  const [isCreator, setIsCreator] = useState(false)

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001', {
      // Reconnection settings
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: Infinity,
      // Timeout settings
      timeout: 20000,
      // Transports
      transports: ['websocket', 'polling']
    })
    
    newSocket.on('connect', () => {
      setIsConnected(true)
      console.log('Connected to server', newSocket.id)
    })

    newSocket.on('disconnect', (reason) => {
      setIsConnected(false)
      console.log('Disconnected from server:', reason)
      
      // Auto-reconnect on disconnect
      if (reason === 'io server disconnect') {
        // Server disconnected, manually reconnect
        newSocket.connect()
      }
    })
    
    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected after', attemptNumber, 'attempts')
      setIsConnected(true)
    })
    
    newSocket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error)
    })
    
    newSocket.on('reconnect_failed', () => {
      console.error('Reconnection failed')
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

    newSocket.on('view-mode-update', (data: { viewMode: 'hybrid' | 'whiteboard' }) => {
      setViewMode(data.viewMode)
    })

    newSocket.on('view-lock-update', (data: { locked: boolean }) => {
      setViewModeLocked(data.locked)
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
          setIsCreator(true)
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
        currentLanguage?: string,
        viewMode?: 'hybrid' | 'whiteboard',
        viewModeLocked?: boolean,
        isCreator?: boolean
      }) => {
        if (response.success) {
          setMessages(response.messages || [])
          setCodeContent(response.codeContent || '')
          setCurrentLanguage(response.currentLanguage || 'javascript')
          setViewMode(response.viewMode || 'hybrid')
          setViewModeLocked(response.viewModeLocked || false)
          setIsCreator(response.isCreator || false)
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

  const changeViewMode = (roomId: string, viewMode: 'hybrid' | 'whiteboard') => {
    if (socket) {
      socket.emit('change-view-mode', { roomId, viewMode })
    }
  }

  const toggleViewLock = (roomId: string, locked: boolean) => {
    if (socket) {
      socket.emit('toggle-view-lock', { roomId, locked })
    }
  }

  const value = useMemo(() => ({
    socket,
    isConnected,
    createRoom,
    joinRoom,
    sendMessage,
    sendCodeChange,
    changeLanguage,
    changeViewMode,
    toggleViewLock,
    messages,
    participantCount,
    codeContent,
    currentLanguage,
    viewMode,
    viewModeLocked,
    isCreator
  }), [socket, isConnected, messages, participantCount, codeContent, currentLanguage, viewMode, viewModeLocked, isCreator])

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )}