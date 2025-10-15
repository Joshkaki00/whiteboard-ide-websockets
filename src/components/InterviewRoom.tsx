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
}

export default function InterviewRoom({ roomId, onLeaveRoom}: InterviewRoomProps) {
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
            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('code')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  viewMode === 'code' 
                    ? 'bg-white text-purple-600 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Code Editor Only"
              >
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Code
              </button>
              <button
                onClick={() => setViewMode('hybrid')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  viewMode === 'hybrid' 
                    ? 'bg-white text-purple-600 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Split View (Code + Whiteboard)"
              >
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
                Hybrid
              </button>
              <button
                onClick={() => setViewMode('whiteboard')}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  viewMode === 'whiteboard' 
                    ? 'bg-white text-purple-600 font-semibold shadow-sm' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Whiteboard Only"
              >
                <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Board
              </button>
            </div>

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
          <div className="hidden lg:block lg:w-1/3 bg-white border-r border-gray-200">
            <ProblemPanel problemSlug={currentProblemSlug} />
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
        <div className="lg:hidden grid grid-cols-2 gap-4 p-4">
          <ProblemPanel problemSlug={currentProblemSlug} compact />
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
