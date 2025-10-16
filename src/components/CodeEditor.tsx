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

  // Sync code content from server
  useEffect(() => {
    if (textareaRef.current && !isUserTyping.current) {
      const textarea = textareaRef.current
      const cursorPos = textarea.selectionStart
      textarea.value = codeContent
      // Restore cursor position
      textarea.setSelectionRange(cursorPos, cursorPos)
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
    <div className="flex flex-col flex-1">
      <div className="panel-header">
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
        className="code-editor"
        placeholder="// Start typing your solution here..."
        spellCheck={false}
      />
    </div>
  )
}