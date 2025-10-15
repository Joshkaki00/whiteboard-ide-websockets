interface CodeEditorProps {
  readonly compact?: boolean
}

export default function CodeEditor({ compact }: CodeEditorProps) {

  return (
    <div className="flex flex-col flex-1">
      <div className="panel-header">
        <h3>{compact ? "Code" : "Shared Code Editor"}</h3>
        <div className="flex gap-2">
          <select className="py-1 px-2 border border-gray-300 rounded text-xs">
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
      </div>
      <textarea
        className="code-editor"
        placeholder={`// Start typing your solution here...
function twoSum(nums, target) {
    
}`}
        spellCheck={false}
        defaultValue={`function twoSum(nums, target) {
    
}`}
      />
    </div>
  )
}
