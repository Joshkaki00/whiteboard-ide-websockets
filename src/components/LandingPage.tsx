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
    <div className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-br from-interview-primary to-interview-secondary">
      <div className="bg-white rounded-lg p-8 shadow-xl text-center max-w-md w-full border-2 border-gray-200">
        <div className="text-xl mb-8 text-gray-800 font-medium bg-gray-50 p-3 rounded border border-gray-200">
          <h1>Interview Practice Assistant</h1>
        </div>
        
        {/* Connection Status */}
        <div className={`mb-4 text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
          {isConnected ? '● Connected' : '● Disconnected'}
        </div>
        
        {/* Visual Placeholder */}
        <div className="my-8 py-12 px-8 border-2 border-gray-200 rounded-lg bg-gray-50 relative">
          <div className="absolute top-5 left-5 right-5 bottom-5 bg-gradient-to-br from-transparent via-gray-300 to-transparent opacity-30"></div>
          <div className="relative z-10 text-gray-500">
            <div className="text-3xl mb-2">💻</div>
            <div className="text-sm">Real-time collaborative coding</div>
          </div>
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