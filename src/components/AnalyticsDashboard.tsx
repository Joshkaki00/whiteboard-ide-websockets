import { useState, useEffect } from 'react'

interface AnalyticsStats {
  totalEvents: number
  eventsByType: Record<string, number>
  roomsCreated: number
  roomsJoined: number
  problemsSelected: number
  uniqueSessions: number
  lastUpdated: string
}

interface Feedback {
  id: string
  rating: number
  category: string
  message: string
  roomId?: string
  timestamp: string
  serverTimestamp: string
}

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [feedback, setFeedback] = useState<Feedback[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'stats' | 'feedback'>('stats')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const serverUrl = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001'
      
      const [statsRes, feedbackRes] = await Promise.all([
        fetch(`${serverUrl}/api/analytics/stats`),
        fetch(`${serverUrl}/api/feedback/all`)
      ])

      if (!statsRes.ok || !feedbackRes.ok) {
        throw new Error('Failed to fetch data')
      }

      const statsData = await statsRes.json()
      const feedbackData = await feedbackRes.json()

      setStats(statsData)
      setFeedback(feedbackData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-lg max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchData}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const avgRating = feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : 'N/A'

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">CodePair Analytics</h1>
          <p className="text-gray-600">Usage insights and user feedback</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('stats')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              📊 Usage Stats
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`pb-3 px-4 font-medium transition-colors ${
                activeTab === 'feedback'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💬 User Feedback ({feedback.length})
            </button>
          </div>
        </div>

        {/* Stats Tab */}
        {activeTab === 'stats' && stats && (
          <>
            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-3xl font-bold text-gray-800">{stats.totalEvents}</div>
                <div className="text-sm text-gray-600">Total Events</div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">🚪</div>
                <div className="text-3xl font-bold text-purple-600">{stats.roomsCreated}</div>
                <div className="text-sm text-gray-600">Rooms Created</div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">👥</div>
                <div className="text-3xl font-bold text-blue-600">{stats.uniqueSessions}</div>
                <div className="text-sm text-gray-600">Unique Sessions</div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">📚</div>
                <div className="text-3xl font-bold text-green-600">{stats.problemsSelected}</div>
                <div className="text-sm text-gray-600">Problems Solved</div>
              </div>
            </div>

            {/* Event Breakdown */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Event Breakdown</h2>
              <div className="space-y-3">
                {Object.entries(stats.eventsByType).map(([event, count]) => {
                  const percentage = stats.totalEvents > 0 
                    ? ((count / stats.totalEvents) * 100).toFixed(1)
                    : '0'
                  
                  return (
                    <div key={event} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {event.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className="text-sm text-gray-600">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-purple-600 h-2 rounded-full transition-all"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Last updated: {new Date(stats.lastUpdated).toLocaleString()}
              </div>
            </div>
          </>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <>
            {/* Feedback Summary */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-3xl font-bold text-yellow-600">{avgRating}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">💬</div>
                <div className="text-3xl font-bold text-gray-800">{feedback.length}</div>
                <div className="text-sm text-gray-600">Total Feedback</div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">
                  {feedback.filter(f => f.rating >= 4).length > feedback.length / 2 ? '😊' : '🤔'}
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {feedback.filter(f => f.rating >= 4).length}
                </div>
                <div className="text-sm text-gray-600">Positive Reviews (4-5★)</div>
              </div>
            </div>

            {/* Feedback List */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Feedback</h2>
              {feedback.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No feedback received yet
                </div>
              ) : (
                <div className="space-y-4">
                  {feedback.slice().reverse().map((item) => (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="text-yellow-500">
                            {'⭐'.repeat(item.rating)}
                            {'☆'.repeat(5 - item.rating)}
                          </div>
                          {item.category && (
                            <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                              {item.category}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                      {item.message && (
                        <p className="text-gray-700 text-sm">{item.message}</p>
                      )}
                      {item.roomId && (
                        <div className="mt-2 text-xs text-gray-500 font-mono">
                          Room: {item.roomId}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchData}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-sm"
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}

