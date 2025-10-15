import { useState } from 'react'

const starterCode = {
  javascript: `function twoSum(nums, target) {
    
}`,
  python: `def two_sum(nums, target):
    pass`,
  java: `public int[] twoSum(int[] nums, int target) {
    
}`,
  cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    
}`
}

interface CodeEditorProps {
  language: string
  onLanguageChange: (language: string) => void
  compact?: boolean
}

export default function CodeEditor({ language, onLanguageChange, compact }: CodeEditorProps) {
  const [code, setCode] = useState(starterCode[language as keyof typeof starterCode])

  const handleLanguageChange = (newLanguage: string) => {
    setCode(starterCode[newLanguage as keyof typeof starterCode])
    onLanguageChange(newLanguage)
  }

  return (
    <div className="flex flex-col flex-1">
      <div className="panel-header">
        <h3>Shared Code Editor</h3>
        <div className="flex gap-2">
          <select 
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
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
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="code-editor"
        placeholder={`// Start typing your solution here...
${starterCode[language as keyof typeof starterCode]}`}
        spellCheck={false}
      />
    </div>
  )
}
