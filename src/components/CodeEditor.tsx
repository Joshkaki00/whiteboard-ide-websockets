import { useEffect, useRef } from 'react'
import { useSocket } from '../contexts/SocketContext'

interface CodeEditorProps {
  roomId: string
  compact?: boolean
}

export default function CodeEditor({ roomId, compact }: CodeEditorProps) {
  const { codeContent, currentLanguage, sendCodeChange, changeLanguage } = useSocket()
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isUserTyping = useRef(false)

  // Preserve cursor position when code updates
  useEffect(() => {
    if (textareaRef.current && !isUserTyping.current) {
      const textarea = textareaRef.current
      const cursorPos = textarea.selectionStart
      // Restore cursor position after React updates the value
      setTimeout(() => {
        textarea.setSelectionRange(cursorPos, cursorPos)
      }, 0)
    }
  }, [codeContent])

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    isUserTyping.current = true
    const newCode = e.target.value
    sendCodeChange(roomId, newCode)
    
    // Reset typing flag after debounce
    setTimeout(() => {
      isUserTyping.current = false
    }, 100)
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changeLanguage(roomId, e.target.value)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header flex-shrink-0">
        <h3>{compact ? "Code" : "Shared Code Editor"}</h3>
        <div className="flex gap-2">
          <select 
            value={currentLanguage}
            onChange={handleLanguageChange}
            className="py-1 px-2 border border-gray-300 rounded text-xs"
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>
      <textarea
        ref={textareaRef}
        value={codeContent}
        onChange={handleCodeChange}
        className="flex-1 w-full p-4 font-mono text-sm bg-gray-900 text-gray-100 border-none outline-none resize-none"
        placeholder="// Start typing your solution here..."
        spellCheck={false}
      />
    </div>
  )
}