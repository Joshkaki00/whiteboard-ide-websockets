import { useState } from 'react'

interface ShareRoomProps {
  readonly roomId: string
}

export default function ShareRoom({ roomId }: ShareRoomProps) {
  const [copied, setCopied] = useState(false)

  const roomUrl = `${globalThis.location.origin}?room=${roomId}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const copyUrlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareOnTwitter = () => {
    const text = `Join me for a coding interview practice session on CodePair! 🚀`
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(roomUrl)}`
    globalThis.open(url, '_blank', 'width=550,height=420')
  }

  const shareViaEmail = () => {
    const subject = 'Join me for a CodePair interview practice session'
    const body = `Hi!\n\nI've created a CodePair room for us to practice coding interviews together.\n\nRoom Code: ${roomId}\n\nJoin here: ${roomUrl}\n\nSee you there! 🚀`
    globalThis.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share Room
      </h3>

      {/* Room Code */}
      <div className="mb-3">
        <label htmlFor="room-code-input" className="block text-xs text-gray-600 mb-1">Room Code</label>
        <div className="flex gap-2">
          <input
            id="room-code-input"
            type="text"
            value={roomId}
            readOnly
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-sm font-mono text-center"
          />
          <button
            onClick={copyToClipboard}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
          >
            {copied ? '✓' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Share URL */}
      <div className="mb-3">
        <label htmlFor="share-url-input" className="block text-xs text-gray-600 mb-1">Share Link</label>
        <div className="flex gap-2">
          <input
            id="share-url-input"
            type="text"
            value={roomUrl}
            readOnly
            className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded text-xs truncate"
          />
          <button
            onClick={copyUrlToClipboard}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
          >
            {copied ? '✓' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Social Share Buttons */}
      <div className="flex gap-2">
        <button
          onClick={shareOnTwitter}
          className="flex-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
          Tweet
        </button>
        <button
          onClick={shareViaEmail}
          className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded text-xs font-medium transition-colors flex items-center justify-center gap-1"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Email
        </button>
      </div>
    </div>
  )
}

