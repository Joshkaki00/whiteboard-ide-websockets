import { useState, useEffect, useRef } from 'react'

interface TimerProps {
  onTimeUp?: () => void
  initialMinutes?: number
}

export default function Timer({ onTimeUp, initialMinutes = 45 }: TimerProps) {
  const [seconds, setSeconds] = useState(initialMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const intervalRef = useRef<number | null>(null)

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        setSeconds(prev => {
          if (prev <= 1) {
            if (onTimeUp) onTimeUp()
            setIsRunning(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, isPaused, onTimeUp])

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getTimerColor = () => {
    const percentRemaining = (seconds / (initialMinutes * 60)) * 100
    if (percentRemaining > 50) return 'text-green-600'
    if (percentRemaining > 25) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleStart = () => {
    setIsRunning(true)
    setIsPaused(false)
  }

  const handlePause = () => {
    setIsPaused(!isPaused)
  }

  const handleReset = () => {
    setIsRunning(false)
    setIsPaused(false)
    setSeconds(initialMinutes * 60)
  }

  return (
    <div className="flex items-center gap-2 bg-gray-50 border-2 border-gray-200 rounded-lg px-3 py-2">
      <svg className={`w-4 h-4 ${getTimerColor()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className={`text-xl font-mono font-bold ${getTimerColor()}`}>
        {formatTime(seconds)}
      </span>

      <div className="flex gap-1 ml-2">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="p-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
            title="Start Timer"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={handlePause}
            className="p-1.5 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
            title={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            )}
          </button>
        )}
        <button
          onClick={handleReset}
          className="p-1.5 bg-gray-400 hover:bg-gray-500 text-white rounded-md transition-colors"
          title="Reset Timer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>
  )
}