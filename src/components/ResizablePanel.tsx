import { useState, useRef, useEffect, ReactNode } from 'react'

interface ResizablePanelProps {
  children: ReactNode
  defaultWidth?: number
  minWidth?: number
  maxWidth?: number
  direction?: 'left' | 'right'
}

export default function ResizablePanel({ 
  children, 
  defaultWidth = 320, 
  minWidth = 250, 
  maxWidth = 600,
  direction = 'right'
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMove = (clientX: number) => {
      if (!isResizing || !panelRef.current) return

      const panel = panelRef.current
      const rect = panel.getBoundingClientRect()
      
      let newWidth: number
      if (direction === 'right') {
        newWidth = clientX - rect.left
      } else {
        newWidth = rect.right - clientX
      }

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setWidth(newWidth)
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      handleMove(e.clientX)
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX)
      }
    }

    const handleEnd = () => {
      setIsResizing(false)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleTouchMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleEnd)
    }
  }, [isResizing, minWidth, maxWidth, direction])

  const handleStart = () => {
    setIsResizing(true)
  }

  return (
    <div 
      ref={panelRef}
      className="relative flex-shrink-0"
      style={{ width: `${width}px` }}
    >
      {children}
      <div
        onMouseDown={handleMouseDown}
        className={`absolute top-0 ${direction === 'right' ? 'right-0' : 'left-0'} w-1 h-full cursor-col-resize hover:bg-purple-500 transition-colors z-10 group`}
        style={{ touchAction: 'none' }}
      >
        <div className="absolute inset-0 -mx-1" />
      </div>
    </div>
  )
}

