import { useRef, useEffect, useState } from 'react'

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [penColor, setPenColor] = useState('#000000')
  const [penSize, setPenSize] = useState(2)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.offsetWidth
    canvas.height = 200

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsDrawing(true)
    ctx.strokeStyle = penColor
    ctx.lineWidth = penSize
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  return (
    <div className="border-t border-gray-300 bg-white">
      <div className="py-2 px-4 bg-gray-50 border-b border-gray-300 flex justify-between items-center text-xs text-gray-500">
        <span>Collaborative Whiteboard</span>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={penColor}
            onChange={(e) => setPenColor(e.target.value)}
            className="w-5 h-5 border-none rounded-sm"
          />
          <input
            type="range"
            min="1"
            max="10"
            value={penSize}
            onChange={(e) => setPenSize(Number(e.target.value))}
            className="w-16"
          />
          <button
            onClick={clearCanvas}
            className="btn-sm py-1 px-2 text-xs border border-gray-300 bg-gray-50 rounded cursor-pointer hover:bg-gray-200"
          >
            Clear
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        className="block border-b border-gray-300 cursor-crosshair w-full"
        style={{ height: '200px' }}
      />
    </div>
  )
}
