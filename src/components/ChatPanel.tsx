import { useState } from 'react'

interface Message {
  id: string
  username: string
  message: string
  timestamp: Date
  type: 'user' | 'system'
}

interface ChatPanelProps {
  compact?: boolean
}

export default function ChatPanel({ compact }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      username: 'System',
      message: 'Welcome to the interview room!',
      timestamp: new Date(),
      type: 'system'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        username: 'You',
        message: inputMessage.trim(),
        timestamp: new Date(),
        type: 'user'
      }
      setMessages(prev => [...prev, newMessage])
      setInputMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="panel-header">
        <h3>Discussion</h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto text-sm">
        {messages.map((msg) => (
          <div 
            key={msg.id}
            className={`mb-3 p-2 rounded-lg ${
              msg.type === 'system' 
                ? 'bg-blue-50 text-blue-800 text-center italic' 
                : msg.username === 'You'
                ? 'bg-teal-50 ml-8'
                : 'bg-gray-100 mr-8'
            }`}
          >
            {msg.type !== 'system' && (
              <div className="font-semibold text-sm text-gray-600 mb-1">
                {msg.username}
              </div>
            )}
            <div className="text-gray-800">{msg.message}</div>
            {msg.type !== 'system' && (
              <div className="text-xs text-gray-400 mt-1">
                {msg.timestamp.toLocaleTimeString()}
              </div>
            )}
          </div>
        ))}
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
          onClick={sendMessage}
          className="py-2 px-4 bg-gray-100 border border-gray-300 rounded text-xs cursor-pointer text-gray-700 hover:bg-gray-200"
        >
          Send
        </button>
      </div>
    </div>
  )
}
