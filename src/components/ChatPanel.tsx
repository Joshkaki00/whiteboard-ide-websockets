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
      <div className="panel-header">
        <h3>Discussion</h3>
        <span className="text-xs text-gray-500">
          {participantCount} participant{participantCount !== 1 ? 's' : ''}
        </span>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto text-sm">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 italic">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((msg) => (
            <div 
              key={msg.id}
              className={`mb-3 p-2 rounded-lg ${
                msg.username === username
                  ? 'bg-teal-50 ml-8'
                  : 'bg-gray-100 mr-8'
              }`}
            >
              <div className="font-semibold text-sm text-gray-600 mb-1">
                {msg.username}
              </div>
              <div className="text-gray-800">{msg.message}</div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-300 flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 py-2 px-3 border border-gray-300 rounded text-xs focus:outline-none focus:border-gray-500"
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputMessage.trim()}
          className="py-2 px-4 bg-gray-100 border border-gray-300 rounded text-xs cursor-pointer text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Send
        </button>
      </div>
    </div>
  )
}