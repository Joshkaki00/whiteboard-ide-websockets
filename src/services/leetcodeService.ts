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

  // For problems in basic list only, show simplified view
  const allProblems = await fetchAllLeetCodeProblems()
  const problem = allProblems.find((p: any) => p.titleSlug === slug)
  
  if (!problem) return null

  return {
    id: problem.id || problem.frontendQuestionId,
    title: problem.title,
    titleSlug: problem.titleSlug,
    difficulty: problem.difficulty,
    description: `📝 **${problem.title}**\n\n🔗 Full problem details available on LeetCode:\nhttps://leetcode.com/problems/${slug}/\n\n💡 **Why use CodePair instead?**\n✅ Real-time collaboration with your partner\n✅ Integrated whiteboard for drawing your approach\n✅ Shared code editor with syntax highlighting\n✅ Chat to discuss strategies\n✅ Perfect for mock interviews!\n\n**Topics:** ${problem.topicTags?.join(', ') || 'See LeetCode'}\n**Acceptance Rate:** ${problem.acRate || 'N/A'}%`,
    examples: ['See LeetCode for full examples'],
    constraints: ['See LeetCode for constraints'],
    starterCode: {
      javascript: `// Write your solution here\nfunction solve() {\n    // Your code\n}`,
      python: `# Write your solution here\ndef solve():\n    # Your code\n    pass`,
      java: `// Write your solution here\nclass Solution {\n    public void solve() {\n        // Your code\n    }\n}`,
      cpp: `// Write your solution here\nclass Solution {\npublic:\n    void solve() {\n        // Your code\n    }\n};`
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