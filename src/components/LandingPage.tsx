import { useState } from 'react'
import { useSocket } from '../contexts/SocketContext'

interface LandingPageProps {
  onJoinRoom: (roomId: string) => void
}

export default function LandingPage({ onJoinRoom }: LandingPageProps) {
  const { isConnected, createRoom, joinRoom } = useSocket()
  const [showRoomInput, setShowRoomInput] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [statusMessage, setStatusMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [xp] = useState(420) // Mock XP
  const [level] = useState(7) // Mock level

  const handleCreateRoom = async () => {
    if (!isConnected) {
      setStatusMessage('Not connected to server')
      return
    }

    setIsLoading(true)
    const newRoomId = await createRoom()
    setIsLoading(false)

    if (newRoomId) {
      setStatusMessage(`Room created: ${newRoomId}`)
      onJoinRoom(newRoomId)
    } else {
      setStatusMessage('Failed to create room')
    }
  }

  const handleJoinRoom = () => {
    setShowRoomInput(true)
    setStatusMessage('')
  }

  const handleSubmitRoomCode = async () => {
    if (!isConnected) {
      setStatusMessage('Not connected to server')
      return
    }

    if (roomCode.length !== 8) {
      setStatusMessage('Please enter a valid 8-character room code')
      return
    }

    setIsLoading(true)
    const success = await joinRoom(roomCode)
    setIsLoading(false)

    if (success) {
      onJoinRoom(roomCode)
    } else {
      setStatusMessage('Failed to join room. Check the room code.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-br from-purple-600 to-blue-600">
    <div className="bg-white rounded-2xl p-8 shadow-2xl text-center max-w-2xl w-full">
      {/* Achievement Badge & XP Counter */}
      <div className="flex justify-center gap-3 mb-6">
        <span className="achievement-badge">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Level {level} Coder
        </span>
        <span className="xp-counter">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
          </svg>
          {xp} XP
        </span>
      </div>

      {/* Hero Title */}
      <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
        CodePair
      </h1>
      <p className="text-xl text-gray-600 mb-6">
        Level up your coding skills with real-time collaborative interviews 🚀
      </p>
      
      {/* Connection Status */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div className={`status-dot ${isConnected ? 'status-online' : 'status-offline'}`}></div>
        <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-gray-500'}`}>
          {isConnected ? 'Connected to server' : 'Connecting...'}
        </span>
      </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button 
            onClick={handleCreateRoom}
            disabled={!isConnected || isLoading}
            className="py-3 px-6 border border-gray-400 rounded bg-gray-200 text-gray-700 text-sm cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating...' : 'Create Room'}
          </button>
          <button 
            onClick={handleJoinRoom}
            disabled={!isConnected}
            className="py-3 px-6 border border-gray-300 rounded bg-gray-50 text-gray-700 text-sm cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Join Room
          </button>
        </div>
        
        {/* Room Code Input */}
        {showRoomInput && (
          <div className="mb-4">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitRoomCode()}
              placeholder="ROOM CODE"
              maxLength={8}
              className="w-full py-3 px-4 border border-gray-300 rounded text-sm text-center uppercase tracking-wider focus:outline-none focus:border-gray-500"
            />
            <button 
              onClick={handleSubmitRoomCode}
              disabled={isLoading}
              className="mt-2 w-full btn btn-primary disabled:opacity-50"
            >
              {isLoading ? 'Joining...' : 'Join Room'}
            </button>
          </div>
        )}
        
        {statusMessage && (
          <div className={`mt-4 py-3 px-4 rounded-lg font-medium ${
            statusMessage.includes('Failed') || statusMessage.includes('Not connected') 
              ? 'bg-red-100 text-red-800 border border-red-200'
              : 'bg-blue-100 text-blue-800 border border-blue-200'
          }`}>
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  )
}