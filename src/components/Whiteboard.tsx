import { useRef, useEffect, useState } from 'react'
import { useSocket } from '../contexts/SocketContext'

interface WhiteboardProps {
  roomId: string
}

interface DrawingData {
  x: number
  y: number
  prevX: number
  prevY: number
  color: string
  lineWidth: number
}

export default function Whiteboard({ roomId }: WhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(2)
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null)
  const lastPosRef = useRef<{ x: number; y: number } | null>(null)
  const { socket } = useSocket()

  // Initialize canvas and handle resize
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      // Save current canvas content only if canvas has size
      let imageData: ImageData | null = null
      if (canvas.width > 0 && canvas.height > 0) {
        try {
          imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        } catch (e) {
          // Ignore errors on first load
        }
      }
      
      // Set canvas size to match display size
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height

      // Restore canvas content if we saved it
      if (imageData) {
        try {
          ctx.putImageData(imageData, 0, 0)
        } catch (e) {
          // Ignore if dimensions changed
        }
      }
      
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
    }

    resizeCanvas()
    setContext(ctx)

    // Handle window resize
    window.addEventListener('resize', resizeCanvas)
    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  // Listen for remote drawing
  useEffect(() => {
    if (!socket) return

    socket.on('whiteboard-draw', (data: DrawingData) => {
      drawLine(data.prevX, data.prevY, data.x, data.y, data.color, data.lineWidth)
    })

    socket.on('whiteboard-clear', () => {
      clearCanvas()
    })

    return () => {
      socket.off('whiteboard-draw')
      socket.off('whiteboard-clear')
    }
  }, [socket, context])

  const drawLine = (x1: number, y1: number, x2: number, y2: number, strokeColor: string, strokeWidth: number) => {
    if (!context) return

    context.beginPath()
    context.moveTo(x1, y1)
    context.lineTo(x2, y2)
    context.strokeStyle = strokeColor
    context.lineWidth = strokeWidth
    context.stroke()
    context.closePath()
  }

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    
    // Scale coordinates to match canvas internal dimensions
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const getTouchPos = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    const touch = e.touches[0] || e.changedTouches[0]
    
    // Scale coordinates to match canvas internal dimensions
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY
    }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    setIsDrawing(true)
    const pos = getMousePos(e)
    lastPosRef.current = pos
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPosRef.current) return
    e.preventDefault()

    const pos = getMousePos(e)

    // Draw locally
    drawLine(lastPosRef.current.x, lastPosRef.current.y, pos.x, pos.y, color, lineWidth)

    // Send to other users
    if (socket) {
      socket.emit('whiteboard-draw', {
        roomId,
        x: pos.x,
        y: pos.y,
        prevX: lastPosRef.current.x,
        prevY: lastPosRef.current.y,
        color,
        lineWidth
      })
    }

    lastPosRef.current = pos
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
    lastPosRef.current = null
  }

  const handleMouseLeave = () => {
    setIsDrawing(false)
    lastPosRef.current = null
  }

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDrawing(true)
    const pos = getTouchPos(e)
    lastPosRef.current = pos
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPosRef.current) return
    e.preventDefault()
    e.stopPropagation()

    const pos = getTouchPos(e)

    // Draw locally
    drawLine(lastPosRef.current.x, lastPosRef.current.y, pos.x, pos.y, color, lineWidth)

    // Send to other users
    if (socket) {
      socket.emit('whiteboard-draw', {
        roomId,
        x: pos.x,
        y: pos.y,
        prevX: lastPosRef.current.x,
        prevY: lastPosRef.current.y,
        color,
        lineWidth
      })
    }

    lastPosRef.current = pos
  }

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDrawing(false)
    lastPosRef.current = null
  }

  const handleTouchCancel = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDrawing(false)
    lastPosRef.current = null
  }

  const clearCanvas = () => {
    if (!context || !canvasRef.current) return
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  const handleClear = () => {
    clearCanvas()
    if (socket) {
      socket.emit('whiteboard-clear', { roomId })
    }
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="panel-header border-b border-gray-200 flex-shrink-0">
        <h3>Collaborative Whiteboard</h3>
        <div className="flex gap-2 items-center">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600">Color:</span>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-6 h-6 border border-gray-300 rounded cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600">Size:</span>
            <input
              type="range"
              min="1"
              max="10"
              value={lineWidth}
              onChange={(e) => setLineWidth(Number(e.target.value))}
              className="w-16"
            />
            <span className="text-xs text-gray-600 w-4">{lineWidth}</span>
          </div>
          <button 
            onClick={handleClear}
            className="btn-secondary text-xs py-1 px-3"
          >
            Clear
          </button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="w-full h-full cursor-crosshair touch-none"
          style={{ touchAction: 'none' }}
        />
      </div>
    </div>
  )
}
