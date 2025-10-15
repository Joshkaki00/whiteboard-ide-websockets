import { useState } from 'react'

interface LandingPageProps {
  onJoinRoom: (roomId: string) => void
}

export default function LandingPage({ onJoinRoom }: LandingPageProps) {
  const [showRoomInput, setShowRoomInput] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [statusMessage, setStatusMessage] = useState('')

  const handleCreateRoom = () => {
    // TODO: Implement room creation with Socket.IO
    const newRoomId = Math.random().toString(36).substring(2, 10).toUpperCase()
    setStatusMessage(`Room created: ${newRoomId}`)
    onJoinRoom(newRoomId)
  }

  const handleJoinRoom = () => {
    setShowRoomInput(true)
  }

  const handleSubmitRoomCode = () => {
    if (roomCode.length === 8) {
      // TODO: Validate room exists with Socket.IO
      onJoinRoom(roomCode)
    } else {
      setStatusMessage('Please enter a valid 8-character room code')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-br from-interview-primary to-interview-secondary">
      <div className="bg-white rounded-lg p-8 shadow-xl text-center max-w-md w-full border-2 border-gray-200">
        <div className="text-xl mb-8 text-gray-800 font-medium bg-gray-50 p-3 rounded border border-gray-200">
          <h1>Interview Practice Assistant</h1>
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
            className="py-3 px-6 border border-gray-400 rounded bg-gray-200 text-gray-700 text-sm cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400"
          >
            Create Room
          </button>
          <button 
            onClick={handleJoinRoom}
            className="py-3 px-6 border border-gray-300 rounded bg-gray-50 text-gray-700 text-sm cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400"
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
              className="mt-2 w-full btn btn-primary"
            >
              Join Room
            </button>
          </div>
        )}
        
        {statusMessage && (
          <div className="mt-4 py-3 px-4 rounded-lg font-medium bg-blue-100 text-blue-800 border border-blue-200">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  )
}
