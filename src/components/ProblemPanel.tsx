import { useState, useEffect } from 'react'
import { type LeetCodeProblem, getLeetCodeProblem } from '../services/leetcodeService'

interface ProblemPanelProps {
  readonly problemSlug: string
}

export default function ProblemPanel({ problemSlug}: ProblemPanelProps) {
  const [problem, setProblem] = useState<LeetCodeProblem | null>(null)
  const [activeTab, setActiveTab] = useState<'description' | 'examples' | 'constraints'>('description')
;
  useEffect(() => {
    const loadProblem = async () => {
      const data = await getLeetCodeProblem(problemSlug)
      setProblem(data)
    }
    loadProblem()
  }, [problemSlug])

  if (!problem) {
    return (
      <div className="flex flex-col flex-1 bg-white">
        <div className="panel-header">
          <h3>Loading Problem...</h3>
        </div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50'
      case 'Medium': return 'text-yellow-600 bg-yellow-50'
      case 'Hard': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  return (
    <div className="flex flex-col flex-1 bg-white border-r border-gray-200">
      <div className="panel-header border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-gray-800">{problem.title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
            {problem.difficulty}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => setActiveTab('description')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'description' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setActiveTab('examples')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'examples' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Examples
        </button>
        <button
          onClick={() => setActiveTab('constraints')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'constraints' 
              ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Constraints
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'description' && (
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{problem.description}</p>
          </div>
        )}

        {activeTab === 'examples' && (
          <div className="space-y-4">
            {problem.examples.map((example) => (
              <div key={example.substring(0, 20)} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="text-xs font-semibold text-gray-500 mb-2">Example {example.substring(0, 20) + 1}</div>
                <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">{example}</pre>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'constraints' && (
          <div className="space-y-2">
            {problem.constraints.map((constraint) => (
              <div key={constraint.substring(0, 30)} className="...">
                <span className="text-blue-500 mt-1">•</span>
                <span className="text-sm text-gray-700">{constraint}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}