interface ProblemPanelProps {
  compact?: boolean
}

export default function ProblemPanel({ compact }: ProblemPanelProps) {
  // TODO: Add problem selection logic, Socket.IO integration for problem sync

  return (
    <div className="h-full flex flex-col">
      <div className="panel-header">
        <h3>Problem</h3>
      </div>
      <div className="p-4 overflow-y-auto flex-1">
        <div className="flex gap-2 items-center mb-4">
          <select className="flex-1 py-2 px-3 border border-gray-300 rounded text-xs">
            <option value="two-sum">Two Sum (Easy)</option>
            <option value="reverse-linked-list">Reverse Linked List (Easy)</option>
            <option value="valid-parentheses">Valid Parentheses (Easy)</option>
          </select>
          <span className="difficulty-easy">easy</span>
        </div>
        
        {!compact && (
          <div className="problem-text">
            <h4 className="text-base mb-2 text-gray-900">Two Sum</h4>
            <p className="text-sm leading-relaxed text-gray-600 mb-3">
              Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.
            </p>
            <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-700 mt-2">
              <strong>Example:</strong><br />
              Input: nums = [2,7,11,15], target = 9<br />
              Output: [0,1]<br />
              Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
