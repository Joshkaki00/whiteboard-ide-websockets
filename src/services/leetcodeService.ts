export interface LeetCodeProblem {
  id: string
  title: string
  titleSlug: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  examples: string[]
  constraints: string[]
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  }
  isPremium?: boolean;
  topicTags?: string[];
  acRate?: number;
}

// Hardcoded problems with real LeetCode data structure
// You can fetch these from LeetCode's public API or scrape
const PROBLEM_BANK: Record<string, LeetCodeProblem> = {
  'two-sum': {
    id: '1',
    title: 'Two Sum',
    titleSlug: 'two-sum',
    difficulty: 'Easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: [
      'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]',
      'Input: nums = [3,2,4], target = 6\nOutput: [1,2]'
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      'Only one valid answer exists.'
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n    // Your code here\n}`,
      python: `def two_sum(nums, target):\n    # Your code here\n    pass`,
      java: `public int[] twoSum(int[] nums, int target) {\n    // Your code here\n}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n}`
    }
  },
  'valid-parentheses': {
    id: '20',
    title: 'Valid Parentheses',
    titleSlug: 'valid-parentheses',
    difficulty: 'Easy',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    examples: [
      'Input: s = "()"\nOutput: true',
      'Input: s = "()[]{}"\nOutput: true',
      'Input: s = "(]"\nOutput: false'
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.'
    ],
    starterCode: {
      javascript: `function isValid(s) {\n    // Your code here\n}`,
      python: `def is_valid(s):\n    # Your code here\n    pass`,
      java: `public boolean isValid(String s) {\n    // Your code here\n}`,
      cpp: `bool isValid(string s) {\n    // Your code here\n}`
    }
  },
  'merge-two-sorted-lists': {
    id: '21',
    title: 'Merge Two Sorted Lists',
    titleSlug: 'merge-two-sorted-lists',
    difficulty: 'Easy',
    description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.',
    examples: [
      'Input: list1 = [1,2,4], list2 = [1,3,4]\nOutput: [1,1,2,3,4,4]',
      'Input: list1 = [], list2 = []\nOutput: []'
    ],
    constraints: [
      'The number of nodes in both lists is in the range [0, 50].',
      '-100 <= Node.val <= 100'
    ],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {\n    // Your code here\n}`,
      python: `def merge_two_lists(list1, list2):\n    # Your code here\n    pass`,
      java: `public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n    // Your code here\n}`,
      cpp: `ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n    // Your code here\n}`
    }
  },
  'best-time-to-buy-and-sell-stock': {
    id: '121',
    title: 'Best Time to Buy and Sell Stock',
    titleSlug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Maximize your profit by choosing a single day to buy and different day to sell.',
    examples: [
      'Input: prices = [7,1,5,3,6,4]\nOutput: 5',
      'Input: prices = [7,6,4,3,1]\nOutput: 0'
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4'
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {\n    // Your code here\n}`,
      python: `def max_profit(prices):\n    # Your code here\n    pass`,
      java: `public int maxProfit(int[] prices) {\n    // Your code here\n}`,
      cpp: `int maxProfit(vector<int>& prices) {\n    // Your code here\n}`
    }
  }
}

// Import curated problem list with full descriptions
import problemsDataExtended from '../data/leetcode-problems-extended.json'
import problemsDataBasic from '../data/leetcode-problems.json'

// Combine both datasets - extended problems have full details, basic ones just have metadata
const extendedSlugs = new Set(problemsDataExtended.map(p => p.titleSlug))
const basicProblemsFiltered = problemsDataBasic.filter(p => !extendedSlugs.has(p.titleSlug) && !p.paidOnly)

// Cache the full problem list (extended + basic)
let problemListCache: any[] = [
  ...problemsDataExtended.filter(p => !p.paidOnly),
  ...basicProblemsFiltered
]

export const fetchAllLeetCodeProblems = async (): Promise<any[]> => {
  console.log('📚 Loaded', problemListCache.length, 'curated problems (' + problemsDataExtended.length + ' with full details)')
  // Return immediately - no API call needed!
  return Promise.resolve(problemListCache)
}

export const getLeetCodeProblem = async (slug: string): Promise<LeetCodeProblem | null> => {
  // First check local bank for problems with full details
  if (PROBLEM_BANK[slug]) {
    return PROBLEM_BANK[slug]
  }

  // Check extended problem list (has descriptions, examples, constraints)
  const extendedProblem = problemsDataExtended.find((p: any) => p.titleSlug === slug)
  if (extendedProblem) {
    return {
      id: extendedProblem.id,
      title: extendedProblem.title,
      titleSlug: extendedProblem.titleSlug,
      difficulty: extendedProblem.difficulty,
      description: extendedProblem.description,
      examples: extendedProblem.examples.map((ex: any) => 
        `Input: ${ex.input}\nOutput: ${ex.output}\nExplanation: ${ex.explanation}`
      ),
      constraints: extendedProblem.constraints,
      starterCode: {
        javascript: `// Write your solution here\nfunction solve() {\n    // Your code\n}`,
        python: `# Write your solution here\ndef solve():\n    # Your code\n    pass`,
        java: `// Write your solution here\nclass Solution {\n    public void solve() {\n        // Your code\n    }\n}`,
        cpp: `// Write your solution here\nclass Solution {\npublic:\n    void solve() {\n        // Your code\n    }\n};`
      },
      isPremium: extendedProblem.paidOnly,
      topicTags: extendedProblem.topicTags || [],
      acRate: extendedProblem.acRate
    }
  }

  // For problems in basic list only, show helpful view with link to LeetCode
  const allProblems = await fetchAllLeetCodeProblems()
  const problem = allProblems.find((p: any) => p.titleSlug === slug)
  
  if (!problem) return null

  // Generate helpful description based on topic tags
  const topics = problem.topicTags?.join(', ') || 'Algorithm'
  const topicHints: Record<string, string> = {
    'Array': 'Think about iteration patterns, two pointers, or sliding windows.',
    'Hash Table': 'Consider using a map/dict for O(1) lookups.',
    'String': 'Look for patterns, use two pointers, or try sliding window.',
    'Dynamic Programming': 'Break into subproblems. Can you memoize or use bottom-up DP?',
    'Tree': 'Consider DFS (recursion) or BFS (queue). What\'s the base case?',
    'Graph': 'Think about BFS, DFS, or topological sort. Track visited nodes.',
    'Binary Search': 'Array is sorted - use left/right pointers. When to move which?',
    'Greedy': 'Make locally optimal choice. Can you prove it works globally?',
    'Backtracking': 'Explore all possibilities. Remember to undo your choice.',
    'Linked List': 'Draw it out! Consider fast/slow pointers or dummy nodes.',
    'Stack': 'LIFO - think about what to push/pop and when.',
    'Sorting': 'Which sort? Or can you use the sorted property cleverly?',
    'Two Pointers': 'One from each end? Or both from start? When to move each?',
    'Sliding Window': 'Expand window to find valid, shrink to optimize.',
    'Depth-First Search': 'Go deep first. Use recursion or explicit stack.',
    'Breadth-First Search': 'Level by level. Use a queue.',
    'Heap (Priority Queue)': 'Need min/max quickly? Heap is O(log n) insert/remove.'
  }
  
  let hint = ''
  for (const topic of (problem.topicTags || [])) {
    if (topicHints[topic]) {
      hint = topicHints[topic]
      break
    }
  }

  return {
    id: problem.id || problem.frontendQuestionId,
    title: problem.title,
    titleSlug: problem.titleSlug,
    difficulty: problem.difficulty,
    description: `# ${problem.title}\n\n## 📋 Problem\n\nThis is a **${problem.difficulty}** level problem focusing on: **${topics}**\n\n### 🔗 Full Description\nFor complete problem details, examples, and constraints, visit:\n**[LeetCode Problem #${problem.id}](https://leetcode.com/problems/${slug}/)**\n\n### 💡 Approach Hints\n${hint || 'Think about the data structures and algorithms that fit the problem category.'}\n\n### 🎨 Use the Whiteboard!\n- Draw out examples\n- Sketch data structures\n- Visualize your algorithm\n- Explain your approach to your partner\n\n### 📊 Stats\n- **Difficulty:** ${problem.difficulty}\n- **Acceptance Rate:** ${problem.acRate?.toFixed(1) || 'N/A'}%\n- **Topics:** ${topics}\n\n---\n\n**💬 Tip:** Use the chat to discuss your approach with your partner before coding!`,
    examples: [
      'Visit LeetCode for detailed examples with explanations:\nhttps://leetcode.com/problems/' + slug + '/'
    ],
    constraints: [
      'See full constraints on LeetCode:\nhttps://leetcode.com/problems/' + slug + '/'
    ],
    starterCode: {
      javascript: `// ${problem.title}\n// Difficulty: ${problem.difficulty}\n// Topics: ${topics}\n\nfunction solve() {\n    // Write your solution here\n    // Use the whiteboard to sketch your approach first!\n}`,
      python: `# ${problem.title}\n# Difficulty: ${problem.difficulty}\n# Topics: ${topics}\n\ndef solve():\n    # Write your solution here\n    # Use the whiteboard to sketch your approach first!\n    pass`,
      java: `// ${problem.title}\n// Difficulty: ${problem.difficulty}\n// Topics: ${topics}\n\nclass Solution {\n    public void solve() {\n        // Write your solution here\n        // Use the whiteboard to sketch your approach first!\n    }\n}`,
      cpp: `// ${problem.title}\n// Difficulty: ${problem.difficulty}\n// Topics: ${topics}\n\nclass Solution {\npublic:\n    void solve() {\n        // Write your solution here\n        // Use the whiteboard to sketch your approach first!\n    }\n};`
    },
    isPremium: problem.paidOnly,
    topicTags: problem.topicTags || [],
    acRate: problem.acRate
  }
}

export const getRandomProblem = async (): Promise<LeetCodeProblem> => {
  const allProblems = await fetchAllLeetCodeProblems()
  const randomIndex = Math.floor(Math.random() * allProblems.length)
  const problem = allProblems[randomIndex]
  
  return await getLeetCodeProblem(problem.titleSlug) || PROBLEM_BANK['two-sum']
}

export const getAllProblems = (): LeetCodeProblem[] => {
  // Return local bank for immediate display
  // Component will call fetchAllLeetCodeProblems() for full list
  return Object.values(PROBLEM_BANK)
}

export const searchProblems = async (query: string, limit = 50): Promise<any[]> => {
  const allProblems = await fetchAllLeetCodeProblems()
  const lowerQuery = query.toLowerCase()
  
  return allProblems
    .filter((p: any) => 
      p.title.toLowerCase().includes(lowerQuery) ||
      p.difficulty.toLowerCase().includes(lowerQuery) ||
      p.topicTags?.some((t: any) => t.name.toLowerCase().includes(lowerQuery))
    )
    .slice(0, limit)
}