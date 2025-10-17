import { useSocket } from '../contexts/SocketContext'
import ShareRoom from './ShareRoom'

interface ParticipantsPanelProps {
  roomId: string
}

export default function ParticipantsPanel({ roomId }: ParticipantsPanelProps) {
  const { participantCount } = useSocket()

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="panel-header border-b border-gray-200">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <h3>Participants</h3>
        </div>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {participantCount}
        </span>
      </div>
      
      <div className="p-4 flex-1 overflow-auto">
        {participantCount === 0 && (
          <div className="text-center text-gray-400 text-sm italic mt-4">
            Waiting for participants...
          </div>
        )}
        
        {participantCount >= 1 && (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-100">
              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-semibold text-sm">
                Y
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">You</div>
                <div className="text-xs text-gray-500">Candidate</div>
              </div>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            </div>
            
            {participantCount >= 2 && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 border border-blue-100">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-semibold text-sm">
                  P
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-800">Partner</div>
                  <div className="text-xs text-gray-500">Interviewer</div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
