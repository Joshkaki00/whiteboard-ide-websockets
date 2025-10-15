export default function LandingPage() {
  // TODO: Add room creation/joining logic
  
  return (
    <div className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-br from-interview-primary to-interview-secondary">
      <div className="bg-white rounded-lg p-8 shadow-xl text-center max-w-md w-full border-2 border-gray-200">
        <div className="text-xl mb-8 text-gray-800 font-medium bg-gray-50 p-3 rounded border border-gray-200">
          <h1>Interview Practice Assistant</h1>
        </div>
        
        {/* Visual Placeholder */}
        <div className="my-8 py-12 px-8 border-2 border-gray-200 rounded-lg bg-gray-50 relative">
          <div className="absolute top-5 left-5 right-5 bottom-5 bg-gradient-to-br from-transparent via-gray-300 to-transparent opacity-30"></div>
          <div className="relative z-10 text-gray-500">
            <div className="text-3xl mb-2">💻</div>
            <div className="text-sm">Real-time collaborative coding</div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button className="py-3 px-6 border border-gray-400 rounded bg-gray-200 text-gray-700 text-sm cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400">
            Create Room
          </button>
          <button className="py-3 px-6 border border-gray-300 rounded bg-gray-50 text-gray-700 text-sm cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:border-gray-400">
            Join Room
          </button>
        </div>
        
        {/* Room Code Input - Hidden by default */}
        <div className="mb-4" style={{ display: 'none' }}>
          <input
            type="text"
            placeholder="ROOM CODE"
            maxLength={8}
            className="w-full py-3 px-4 border border-gray-300 rounded text-sm text-center uppercase tracking-wider focus:outline-none focus:border-gray-500"
          />
          <button className="mt-2 w-full btn btn-primary">
            Join Room
          </button>
        </div>
        
        {/* Status message - Hidden by default */}
        <div className="mt-4 py-3 px-4 rounded-lg font-medium bg-blue-100 text-blue-800 border border-blue-200" style={{ display: 'none' }}>
          Status messages will appear here
        </div>
      </div>
    </div>
  )
}
