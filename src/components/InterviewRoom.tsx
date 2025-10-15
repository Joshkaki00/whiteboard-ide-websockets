import ProblemPanel from './ProblemPanel'
import CodeEditor from './CodeEditor'
import Whiteboard from './Whiteboard'
import ChatPanel from './ChatPanel'
import ParticipantsPanel from './ParticipantsPanel'

interface InterviewRoomProps {
  readonly roomId: string;
  readonly onLeaveRoom: () => void;
  readonly problemTitle?: string;
}

export default function InterviewRoom({ roomId, onLeaveRoom, problemTitle }: InterviewRoomProps) {
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Room Header */}
      <div className="bg-gray-50 py-3 px-6 flex justify-between items-center border-b border-gray-200 text-sm">
        <div className="flex items-center gap-4 text-gray-600 font-medium">
          <span>Room: {roomId}</span>
          <span className="text-gray-300">|</span>
          <span>Problem: {problemTitle || 'Loading...'}</span>
          <span className="text-gray-300">|</span>
          <span>Timer: 25:30</span>
        </div>
        <button onClick={onLeaveRoom} className="bg-transparent border-none text-lg text-gray-500 cursor-pointer p-1 hover:text-gray-700">
          <span>✕</span>
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="flex-1 hidden lg:grid lg:grid-cols-[280px_1fr_280px] gap-px bg-gray-300 overflow-hidden">
        {/* Left Sidebar */}
        <div className="bg-white flex flex-col">
          <div className="flex-1 border-b border-gray-300">
            <ProblemPanel />
          </div>
          <div className="h-48">
            <ParticipantsPanel />
          </div>
        </div>

        {/* Center Code Panel */}
        <div className="bg-white flex flex-col">
          <CodeEditor roomId={roomId} />  {/* Add roomId */}
          <Whiteboard />
        </div>

        {/* Right Sidebar */}
        <div className="bg-white">
          <ChatPanel roomId={roomId} />
        </div>
      </div>

      {/* Tablet/Mobile Layout */}
      <div className="flex-1 lg:hidden grid grid-rows-[200px_1fr_150px] gap-px bg-gray-300">
        <div className="bg-white">
          <ProblemPanel compact />
        </div>
        
        <div className="bg-white flex flex-col">
          <CodeEditor roomId={roomId} compact />  {/* Add roomId */}
        </div>
        
        <div className="bg-white">
          <ChatPanel roomId={roomId} compact />
        </div>
      </div>
    </div>
  )
}
