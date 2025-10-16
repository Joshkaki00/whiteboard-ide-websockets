import { useState, useRef, useEffect } from 'react'

interface VerticalResizerProps {
  onResize: (topHeight: number) => void
}

export default function VerticalResizer({ onResize }: VerticalResizerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const resizerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !resizerRef.current) return

      const parent = resizerRef.current.parentElement
      if (!parent) return

      const parentRect = parent.getBoundingClientRect()
      const newTopHeight = ((e.clientY - parentRect.top) / parentRect.height) * 100

      // Constrain between 20% and 80%
      if (newTopHeight >= 20 && newTopHeight <= 80) {
        onResize(newTopHeight)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'row-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, onResize])

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  return (
    <div
      ref={resizerRef}
      onMouseDown={handleMouseDown}
      className="h-1 w-full cursor-row-resize hover:bg-purple-500 transition-colors relative z-10 flex-shrink-0"
      style={{ touchAction: 'none' }}
    >
      <div className="absolute inset-0 -my-1" />
    </div>
  )
}

