import { useState } from 'react'

interface Problem {
  id: string
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  examples: string
}

const problems: Record<string, Problem> = {
  'two-sum': {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: `Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`
  },
  'reverse-linked-list': {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: `Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]`
  },
  'valid-parentheses': {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    examples: `Input: s = "()[]{}"
Output: true

Input: s = "([)]"
Output: false`
  }
}

interface ProblemPanelProps {
  currentProblem: string
  onProblemChange: (problemId: string) => void
  compact?: boolean
}

export default function ProblemPanel({ currentProblem, onProblemChange, compact }: ProblemPanelProps) {
  const problem = problems[currentProblem]

  const getDifficultyClass = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'difficulty-easy'
      case 'medium': return 'difficulty-medium'
      case 'hard': return 'difficulty-hard'
      default: return 'difficulty-easy'
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="panel-header">
        <h3>Problem</h3>
      </div>
      <div className="p-4 overflow-y-auto flex-1">
        <div className="flex gap-2 items-center mb-4">
          <select 
            value={currentProblem}
            onChange={(e) => onProblemChange(e.target.value)}
            className="flex-1 py-2 px-3 border border-gray-300 rounded text-xs"
          >
            <option value="two-sum">Two Sum (Easy)</option>
            <option value="reverse-linked-list">Reverse Linked List (Easy)</option>
            <option value="valid-parentheses">Valid Parentheses (Easy)</option>
          </select>
          <span className={getDifficultyClass(problem.difficulty)}>
            {problem.difficulty}
          </span>
        </div>
        
        {!compact && (
          <div className="problem-text">
            <h4 className="text-base mb-2 text-gray-900">{problem.title}</h4>
            <p className="text-sm leading-relaxed text-gray-600 mb-3">
              {problem.description}
            </p>
            <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-700 mt-2">
              <strong>Example:</strong><br />
              {problem.examples}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
