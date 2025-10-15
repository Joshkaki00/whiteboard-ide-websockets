import { useState } from 'react'
import LandingPage from './components/LandingPage'
import InterviewRoom from './components/InterviewRoom'

type AppState = 'landing' | 'room'

function App() {
  const [currentPage, setCurrentPage] = useState<AppState>('landing')
  const [roomId, setRoomId] = useState<string>('')

  const handleJoinRoom = (id: string) => {
    setRoomId(id)
    setCurrentPage('room')
  }

  const handleLeaveRoom = () => {
    setRoomId('')
    setCurrentPage('landing')
  }

  return (
    <div className="min-h-screen">
      {currentPage === 'landing' && (
        <LandingPage onJoinRoom={handleJoinRoom} />
      )}
      {currentPage === 'room' && (
        <InterviewRoom roomId={roomId} onLeaveRoom={handleLeaveRoom} />
      )}
    </div>
  )
}

export default App