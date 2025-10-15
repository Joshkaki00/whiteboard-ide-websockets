import { useState } from 'react'
import ProblemPanel from './ProblemPanel'
import Timer from './Timer'
import { getAllProblems } from '../services/leetcodeService'
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
  const [showProblemSelector, setShowProblemSelector] = useState(false)
  const [currentProblemSlug, setCurrentProblemSlug] = useState('two-sum')
  const problems = getAllProblems()
  
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Room Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="status-dot status-online"></div>
                <h2 className="text-lg font-semibold text-gray-800">Room: {roomId}</h2>
              </div>
              <button 
                onClick={() => setShowProblemSelector(!showProblemSelector)}
                className="text-sm text-purple-600 hover:text-purple-700 font-medium mt-1 flex items-center gap-1"
              >
                {problems.find(p => p.titleSlug === currentProblemSlug)?.title || 'Two Sum'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Problem Selector Dropdown */}
            {showProblemSelector && (
              <div className="absolute top-16 left-6 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-80">
                <div className="p-2">
                  {problems.map((problem) => (
                    <button
                      key={problem.titleSlug}
                      onClick={() => {
                        setCurrentProblemSlug(problem.titleSlug)
                        setShowProblemSelector(false)
                      }}
                      className="w-full text-left px-4 py-3 hover:bg-purple-50 rounded-md transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{problem.title}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                          problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {problem.difficulty}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Timer initialMinutes={45} />
            
            <button
              onClick={onLeaveRoom}
              className="btn-secondary"
            >
              Leave Room
            </button>
          </div>
        </div>
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
