import { useState, useEffect } from 'react'
import ProblemPanel from './ProblemPanel'
import Timer from './Timer'
import { getAllProblems, fetchAllLeetCodeProblems, searchProblems, getRandomProblem, getLeetCodeProblem } from '../services/leetcodeService'
import CodeEditor from './CodeEditor'
import Whiteboard from './Whiteboard'
import ChatPanel from './ChatPanel'
import ParticipantsPanel from './ParticipantsPanel'
import ResizablePanel from './ResizablePanel'
import VerticalResizer from './VerticalResizer'
import { useSocket } from '../contexts/SocketContext'

interface InterviewRoomProps {
  readonly roomId: string;
  readonly onLeaveRoom: () => void;
}

export default function InterviewRoom({ roomId, onLeaveRoom}: InterviewRoomProps) {
  const { socket, viewMode, viewModeLocked, isCreator, changeViewMode, toggleViewLock, currentLanguage } = useSocket()
  const [showProblemSelector, setShowProblemSelector] = useState(false)
  const [currentProblemSlug, setCurrentProblemSlug] = useState('two-sum')
  const [searchQuery, setSearchQuery] = useState('')
  const [allProblems, setAllProblems] = useState<any[]>([])
  const [filteredProblems, setFilteredProblems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [codeEditorHeight, setCodeEditorHeight] = useState(66)
  const localProblems = getAllProblems()
  
  // Listen for problem changes from interviewer
  useEffect(() => {
    if (!socket) return
    
    const handleProblemChanged = (data: { problemSlug: string, code: string }) => {
      setCurrentProblemSlug(data.problemSlug)
    }
    
    socket.on('problem-changed', handleProblemChanged)
    
    return () => {
      socket.off('problem-changed', handleProblemChanged)
    }
  }, [socket])
  
  // Load all LeetCode problems when selector opens
  useEffect(() => {
    if (showProblemSelector && allProblems.length === 0 && !isLoading) {
      setIsLoading(true)
      loadAllProblems()
    }
  }, [showProblemSelector, allProblems.length, isLoading])
  
  // Search with debounce
  useEffect(() => {
    if (!searchQuery) {
      setFilteredProblems(allProblems.length > 0 ? allProblems.slice(0, 50) : [])
      return
    }
    
    setIsSearching(true)
    const timer = setTimeout(async () => {
      const results = await searchProblems(searchQuery, 50)
      setFilteredProblems(results)
      setIsSearching(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [searchQuery, allProblems])
  
  const loadAllProblems = async () => {
    setIsLoading(true)
    try {
      const problems = await fetchAllLeetCodeProblems()
      setAllProblems(problems)
      setFilteredProblems(problems.slice(0, 50))
    } catch (error) {
      console.error('Failed to load problems:', error)
      setAllProblems(localProblems)
      setFilteredProblems(localProblems)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleProblemSelect = async (problemSlug: string) => {
    if (!socket || !isCreator) return
    
    setIsLoading(true)
    try {
      // Get the problem to fetch starter code
      const problem = await getLeetCodeProblem(problemSlug)
      if (!problem) return
      
      // Get starter code for current language
      const starterCode = problem.starterCode[currentLanguage as keyof typeof problem.starterCode] || problem.starterCode.javascript
      
      // Emit socket event to sync with all participants
      socket.emit('change-problem', { 
        roomId, 
        problemSlug, 
        starterCode 
      }, (response: { success: boolean, error?: string }) => {
        if (response.success) {
          setCurrentProblemSlug(problemSlug)
          setShowProblemSelector(false)
          setSearchQuery('')
        } else {
          console.error('Failed to change problem:', response.error)
        }
      })
    } catch (error) {
      console.error('Failed to select problem:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleRandomProblem = async () => {
    setIsLoading(true)
    try {
      const randomProblem = await getRandomProblem()
      await handleProblemSelect(randomProblem.titleSlug)
    } catch (error) {
      console.error('Failed to get random problem:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  const getCurrentProblemTitle = () => {
    const problem = allProblems.find(p => p.titleSlug === currentProblemSlug) ||
                    localProblems.find(p => p.titleSlug === currentProblemSlug)
    return problem?.title || 'Two Sum'
  }
  
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
                    onClick={() => isCreator && setShowProblemSelector(!showProblemSelector)}
                    disabled={!isCreator}
                    className={`text-sm font-medium mt-1 flex items-center gap-1 ${
                      isCreator 
                        ? 'text-purple-600 hover:text-purple-700 cursor-pointer' 
                        : 'text-gray-500 cursor-not-allowed'
                    }`}
                    title={isCreator ? 'Change problem' : 'Only the interviewer can change problems'}
                  >
                    {getCurrentProblemTitle()}
                    {isCreator && (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </button>
            </div>

            {/* Problem Selector Dropdown */}
            {showProblemSelector && (
              <div className="absolute top-16 left-6 bg-white border border-gray-200 rounded-lg shadow-xl z-50 w-96">
                {/* Search Header */}
                <div className="p-3 border-b border-gray-200">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search problems..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                        autoFocus
                      />
                    </div>
                        <button
                          onClick={handleRandomProblem}
                          onTouchEnd={(e) => {
                            e.preventDefault()
                            if (!isLoading) {
                              handleRandomProblem()
                            }
                          }}
                          disabled={isLoading}
                          className="px-3 py-2 bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Random Problem"
                        >
                      {isLoading ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )}
                      Random
                    </button>
                  </div>
                </div>

                {/* Problems List */}
                <div className="max-h-96 overflow-y-auto p-2">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <svg className="w-8 h-8 mx-auto mb-3 text-purple-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <p className="text-sm text-gray-600">Loading LeetCode problems...</p>
                      <p className="text-xs text-gray-400 mt-1">~3000 free problems</p>
                    </div>
                  ) : filteredProblems.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm">No problems found</p>
                      <p className="text-xs mt-1">Try a different search term</p>
                    </div>
                  ) : (
                    filteredProblems.map((problem) => (
                      <button
                        key={problem.titleSlug}
                        onClick={() => handleProblemSelect(problem.titleSlug)}
                        onTouchEnd={(e) => {
                          e.preventDefault()
                          handleProblemSelect(problem.titleSlug)
                        }}
                        className={`w-full text-left px-4 py-3 hover:bg-purple-50 active:bg-purple-100 rounded-md transition-colors ${
                          currentProblemSlug === problem.titleSlug ? 'bg-purple-50 border border-purple-200' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-800 truncate">{problem.title}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              #{problem.frontendQuestionId || problem.id}
                              {problem.paidOnly && <span className="ml-2 text-orange-500">🔒 Premium</span>}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                            problem.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                            problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {problem.difficulty}
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                {/* Footer Stats */}
                <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
                  <span>
                    {isSearching ? 'Searching...' : `${filteredProblems.length} of ${allProblems.length || 'Loading'} problems`}
                    {allProblems.length > 0 && <span className="ml-2 text-green-600">✓ Free</span>}
                  </span>
                  <button
                    onClick={() => {
                      setShowProblemSelector(false)
                      setSearchQuery('')
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault()
                      setShowProblemSelector(false)
                      setSearchQuery('')
                    }}
                    className="text-purple-600 hover:text-purple-700 active:text-purple-800 font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* View Mode Switcher - Controlled by creator */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    if (isCreator || !viewModeLocked) {
                      changeViewMode(roomId, 'hybrid')
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault()
                    if (isCreator || !viewModeLocked) {
                      changeViewMode(roomId, 'hybrid')
                    }
                  }}
                  disabled={!isCreator && viewModeLocked}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    viewMode === 'hybrid' 
                      ? 'bg-white text-purple-600 font-semibold shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  } ${(!isCreator && viewModeLocked) ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                  title="Split View (Code + Whiteboard)"
                >
                  <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                  Hybrid
                </button>
                <button
                  onClick={() => {
                    if (isCreator || !viewModeLocked) {
                      changeViewMode(roomId, 'whiteboard')
                    }
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault()
                    if (isCreator || !viewModeLocked) {
                      changeViewMode(roomId, 'whiteboard')
                    }
                  }}
                  disabled={!isCreator && viewModeLocked}
                  className={`px-3 py-1 text-xs rounded-md transition-colors ${
                    viewMode === 'whiteboard' 
                      ? 'bg-white text-purple-600 font-semibold shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  } ${(!isCreator && viewModeLocked) ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                  title="Whiteboard Only"
                >
                  <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Board
                </button>
              </div>

              {/* Lock/Unlock button - Creator only */}
              {isCreator && (
                <button
                  onClick={() => toggleViewLock(roomId, !viewModeLocked)}
                  className={`p-1.5 rounded-md transition-colors ${
                    viewModeLocked 
                      ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={viewModeLocked ? 'Unlock view mode (allow partner to change)' : 'Lock view mode (prevent partner from changing)'}
                >
                  {viewModeLocked ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              )}
            </div>

            <Timer roomId={roomId} initialMinutes={30} />
            
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
      <div className="flex-1 hidden lg:flex gap-0 overflow-hidden">
        {/* Left Sidebar: Problem + Participants - Resizable */}
        <ResizablePanel defaultWidth={320} minWidth={250} maxWidth={600} direction="right">
          <div className="h-full bg-white border-r border-gray-200 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto">
              <ProblemPanel problemSlug={currentProblemSlug} />
            </div>
            <div className="h-48 border-t border-gray-200 overflow-auto">
              <ParticipantsPanel />
            </div>
          </div>
        </ResizablePanel>

        {/* Center Panel: Code + Whiteboard */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
          {viewMode === 'hybrid' && (
            <>
              <div style={{ height: `${codeEditorHeight}%` }} className="overflow-hidden">
                <CodeEditor roomId={roomId} />
              </div>
              <VerticalResizer onResize={setCodeEditorHeight} />
              <div style={{ height: `${100 - codeEditorHeight}%` }} className="overflow-hidden">
                <Whiteboard roomId={roomId} />
              </div>
            </>
          )}
          {viewMode === 'whiteboard' && (
            <div className="flex-1 overflow-hidden">
              <Whiteboard roomId={roomId} />
            </div>
          )}
        </div>

        {/* Right Sidebar: Chat - Resizable */}
        <ResizablePanel defaultWidth={320} minWidth={250} maxWidth={500} direction="left">
          <div className="h-full bg-white border-l border-gray-200 overflow-auto">
            <ChatPanel roomId={roomId} />
          </div>
        </ResizablePanel>
      </div>

      {/* Tablet/Mobile Layout */}
      <div className="flex-1 lg:hidden flex flex-col overflow-hidden">
        {/* Top Panel: Problem */}
        <div className="h-48 flex-shrink-0 bg-white border-b border-gray-200 overflow-hidden">
          <ProblemPanel problemSlug={currentProblemSlug} compact />
        </div>
        
        {/* Middle Panel: Code/Whiteboard */}
        <div className="flex-1 bg-white flex flex-col overflow-hidden">
          {viewMode === 'hybrid' && (
            <>
              <div style={{ height: `${codeEditorHeight}%` }} className="overflow-hidden">
                <CodeEditor roomId={roomId} compact />
              </div>
              <VerticalResizer onResize={setCodeEditorHeight} />
              <div style={{ height: `${100 - codeEditorHeight}%` }} className="overflow-hidden">
                <Whiteboard roomId={roomId} />
              </div>
            </>
          )}
          {viewMode === 'whiteboard' && (
            <div className="flex-1 overflow-hidden">
              <Whiteboard roomId={roomId} />
            </div>
          )}
        </div>
        
        {/* Bottom Panel: Chat */}
        <div className="h-56 flex-shrink-0 bg-white border-t border-gray-200 overflow-hidden">
          <ChatPanel roomId={roomId} compact />
        </div>
      </div>
    </div>
  )
}
