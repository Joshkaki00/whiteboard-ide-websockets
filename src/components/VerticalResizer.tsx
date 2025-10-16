import { useState, useRef, useEffect } from 'react'

interface VerticalResizerProps {
  onResize: (topHeight: number) => void
}

export default function VerticalResizer({ onResize }: VerticalResizerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const resizerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMove = (clientY: number) => {
      if (!isDragging || !resizerRef.current) return

      const parent = resizerRef.current.parentElement
      if (!parent) return

      const parentRect = parent.getBoundingClientRect()
      const newTopHeight = ((clientY - parentRect.top) / parentRect.height) * 100

      // Constrain between 20% and 80%
      if (newTopHeight >= 20 && newTopHeight <= 80) {
        onResize(newTopHeight)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientY)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientY)
      }
    }

    const handleEnd = () => {
      setIsDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
      document.body.style.cursor = 'row-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, onResize])

  const handleStart = () => {
    setIsDragging(true)
  }

  return (
    <div
      ref={resizerRef}
      onMouseDown={handleStart}
      onTouchStart={(e) => {
        e.preventDefault()
        handleStart()
      }}
      className="h-2 w-full cursor-row-resize bg-purple-300 bg-opacity-0 hover:bg-opacity-50 active:bg-opacity-100 transition-colors relative z-10 flex-shrink-0"
      style={{ touchAction: 'none' }}
    >
      <div className="absolute inset-0 -my-2" />
    </div>
  )
}

