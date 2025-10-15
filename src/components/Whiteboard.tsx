import { useRef } from 'react'

export default function Whiteboard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // TODO: Add drawing functionality, Socket.IO synchronization for collaborative drawing

  return (
    <div className="border-t border-gray-300 bg-white">
      <div className="py-2 px-4 bg-gray-50 border-b border-gray-300 flex justify-between items-center text-xs text-gray-500">
        <span>Collaborative Whiteboard</span>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            defaultValue="#000000"
            className="w-5 h-5 border-none rounded-sm"
          />
          <input
            type="range"
            min="1"
            max="10"
            defaultValue="2"
            className="w-16"
          />
          <button className="btn-sm py-1 px-2 text-xs border border-gray-300 bg-gray-50 rounded cursor-pointer hover:bg-gray-200">
            Clear
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="block border-b border-gray-300 cursor-crosshair w-full"
        style={{ height: '200px' }}
        width={500}
        height={200}
      />
    </div>
  )
}
