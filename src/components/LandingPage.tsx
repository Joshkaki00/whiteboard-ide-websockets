import { useState } from 'react'
import { useSocket } from '../contexts/SocketContext'
import { analytics } from '../services/analytics'
import FeedbackWidget from './FeedbackWidget'

interface LandingPageProps {
  readonly onJoinRoom: (roomId: string) => void
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
      analytics.trackRoomCreated(newRoomId)
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
      analytics.trackRoomJoined(roomCode, false)
      onJoinRoom(roomCode)
    } else {
      setStatusMessage('Failed to join room. Check the room code.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      {/* Hero Section */}
      <div className="flex items-center justify-center min-h-screen p-8">
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
        
          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Create Room Card */}
            <div className="game-card p-6">
              <div className="text-4xl mb-3">🎮</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Start New Session</h3>
              <p className="text-sm text-gray-600 mb-4">Create a room and invite your partner</p>
              <button 
                onClick={handleCreateRoom}
                disabled={!isConnected || isLoading}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Creating...' : 'Create Room'}
              </button>
            </div>

          {/* Join Room Card */}
          <div className="game-card p-6">
            <div className="text-4xl mb-3">🤝</div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Join Session</h3>
            <p className="text-sm text-gray-600 mb-4">Enter a room code to join</p>
            <button 
              onClick={handleJoinRoom}
              disabled={!isConnected}
              className="btn-secondary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Join Room
            </button>
          </div>
        </div>
        
        {/* Room Code Input */}
        {showRoomInput && (
          <div className="mb-4">
            <input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitRoomCode()}
              placeholder="ROOM CODE"
              maxLength={8}
              className="w-full py-3 px-4 border border-gray-300 rounded text-sm text-center uppercase tracking-wider focus:outline-none focus:border-gray-500"
            />
            <button 
              onClick={handleSubmitRoomCode}
              disabled={isLoading}
              className="mt-2 w-full btn-primary disabled:opacity-50"
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

        {/* Features Preview */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Why CodePair?</p>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl mb-1">⚡</div>
              <p className="text-xs text-gray-600">Real-time Sync</p>
            </div>
            <div>
              <div className="text-2xl mb-1">🎨</div>
              <p className="text-xs text-gray-600">Collaborative Whiteboard</p>
            </div>
            <div>
              <div className="text-2xl mb-1">📚</div>
              <p className="text-xs text-gray-600">100+ Problems</p>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Features Section */}
      <div className="bg-white py-16 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Everything You Need for Interview Practice
          </h2>
          <p className="text-xl text-center text-gray-600 mb-12">
            Practice like you're in a real interview
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Live Code Editor</h3>
              <p className="text-gray-600">Collaborate in real-time with syntax highlighting for Python, JavaScript, Java, and C++</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center p-6">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Shared Whiteboard</h3>
              <p className="text-gray-600">Draw diagrams, visualize algorithms, and explain your thought process together</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center p-6">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Curated Problems</h3>
              <p className="text-gray-600">Access 100+ LeetCode problems with detailed descriptions, examples, and constraints</p>
            </div>

            {/* Feature 4 */}
            <div className="text-center p-6">
              <div className="bg-yellow-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Interview Timer</h3>
              <p className="text-gray-600">30-minute timer synced across all participants to simulate real interview conditions</p>
            </div>

            {/* Feature 5 */}
            <div className="text-center p-6">
              <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Live Chat</h3>
              <p className="text-gray-600">Communicate with your partner through built-in chat without leaving the platform</p>
            </div>

            {/* Feature 6 */}
            <div className="text-center p-6">
              <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Privacy First</h3>
              <p className="text-gray-600">No accounts required. Create a room, share the code, and start practicing immediately</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 py-16 px-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl font-bold mb-12">Built for Serious Prep</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-purple-200">Coding Problems</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">4</div>
              <div className="text-purple-200">Languages</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">⚡</div>
              <div className="text-purple-200">Real-time Sync</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">🔒</div>
              <div className="text-purple-200">Private Rooms</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white py-16 px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Ready to Practice?</h2>
          <p className="text-xl text-gray-600 mb-8">Create a room and invite your practice partner in seconds</p>
          <button 
            onClick={() => globalThis.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg hover:shadow-xl"
          >
            Get Started Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 px-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="mb-2">CodePair - Collaborative Interview Practice Platform</p>
          <p className="text-sm text-gray-500">Built for developers, by developers 🚀</p>
          <div className="mt-4 flex justify-center gap-6">
            <a href="https://github.com/Joshkaki00/whiteboard-ide-websockets" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              GitHub
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); globalThis.scrollTo({ top: 0, behavior: 'smooth' }) }} className="hover:text-white transition-colors">
              Back to Top
            </a>
          </div>
        </div>
      </footer>

      {/* Feedback Widget */}
      <FeedbackWidget />
    </div>
  )
}