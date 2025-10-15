export default function ParticipantsPanel() {
  // TODO: Add participant management, Socket.IO integration for user presence

  return (
    <div className="h-full flex flex-col">
      <div className="panel-header">
        <h3>Users</h3>
      </div>
      
      <div className="p-4 flex-1">
        {/* Static participants for visual reference */}
        <div className="flex justify-between items-center py-2 text-sm">
          <span className="text-gray-700">You (Candidate)</span>
          <span className="text-green-500 text-xs">●</span>
        </div>
        <div className="flex justify-between items-center py-2 text-sm">
          <span className="text-gray-700">Interviewer</span>
          <span className="text-green-500 text-xs">●</span>
        </div>
      </div>
      
      <button className="m-4 py-2 px-4 bg-gray-100 border border-gray-300 rounded text-xs cursor-pointer text-gray-700 hover:bg-gray-200">
        New Problem
      </button>
    </div>
  )
}
