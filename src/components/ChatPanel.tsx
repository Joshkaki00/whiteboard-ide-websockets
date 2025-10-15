interface ChatPanelProps {
  compact?: boolean
}

export default function ChatPanel({ compact }: ChatPanelProps) {
  // TODO: Add chat functionality, Socket.IO integration for real-time messaging

  return (
    <div className="h-full flex flex-col">
      <div className="panel-header">
        <h3>Discussion</h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto text-sm">
        {/* Sample messages for visual reference */}
        <div className="mb-3 p-2 rounded-lg bg-blue-50 text-blue-800 text-center italic">
          <div className="text-gray-800">Welcome to the interview room!</div>
        </div>
        
        <div className="mb-3 p-2 rounded-lg bg-teal-50 ml-8">
          <div className="font-semibold text-sm text-gray-600 mb-1">You</div>
          <div className="text-gray-800">Hello! Ready to start coding?</div>
          <div className="text-xs text-gray-400 mt-1">2:30 PM</div>
        </div>
        
        <div className="mb-3 p-2 rounded-lg bg-gray-100 mr-8">
          <div className="font-semibold text-sm text-gray-600 mb-1">Interviewer</div>
          <div className="text-gray-800">Great! Let's begin with the Two Sum problem.</div>
          <div className="text-xs text-gray-400 mt-1">2:31 PM</div>
        </div>
      </div>
      
      <div className="p-4 border-t border-gray-300 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 py-2 px-3 border border-gray-300 rounded text-xs focus:outline-none focus:border-gray-500"
        />
        <button className="py-2 px-4 bg-gray-100 border border-gray-300 rounded text-xs cursor-pointer text-gray-700 hover:bg-gray-200">
          Send
        </button>
      </div>
    </div>
  )
}
