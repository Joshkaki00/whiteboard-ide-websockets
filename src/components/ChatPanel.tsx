import { useState, useEffect, useRef } from 'react'
import { useSocket } from '../contexts/SocketContext'

interface ChatPanelProps {
  roomId: string
  compact?: boolean
}

export default function ChatPanel({ roomId }: ChatPanelProps) {
  const { sendMessage, messages, participantCount } = useSocket()
  const [inputMessage, setInputMessage] = useState('')
  const [username] = useState(`User${Math.floor(Math.random() * 1000)}`)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      sendMessage(roomId, inputMessage, username)
      setInputMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="panel-header border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <h3>Chat</h3>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {participantCount} {participantCount !== 1 ? 'users' : 'user'}
        </span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto text-sm bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center text-gray-400 italic mt-8">
            💬 No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              className={`mb-3 ${
                msg.username === username
                  ? 'flex justify-end'
                  : 'flex justify-start'
              }`}
            >
              <div className={`max-w-[80%] p-3 rounded-lg shadow-sm ${
                msg.username === username
                  ? 'bg-purple-100 border border-purple-200'
                  : 'bg-white border border-gray-200'
              }`}>
                <div className={`text-xs font-semibold mb-1 ${
                  msg.username === username
                    ? 'text-purple-700'
                    : 'text-gray-600'
                }`}>
                  {msg.username}
                </div>
                <div className="text-gray-800 break-words">{msg.message}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-white flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          className="py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  )
}