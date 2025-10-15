import axios from 'axios'

export interface LeetCodeProblem {
  id: string
  title: string
  titleSlug: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  examples: string[]
  constraints: string[]
  starterCode: {
    javascript: string
    python: string
    java: string
    cpp: string
  }
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

export const getLeetCodeProblem = async (slug: string): Promise<LeetCodeProblem | null> => {
  // For now, return from our bank
  // In production, you could fetch from LeetCode's GraphQL API
  return PROBLEM_BANK[slug] || null
}

export const getRandomProblem = (): LeetCodeProblem => {
  const slugs = Object.keys(PROBLEM_BANK)
  const randomSlug = slugs[Math.floor(Math.random() * slugs.length)]
  return PROBLEM_BANK[randomSlug]
}

export const getAllProblems = (): LeetCodeProblem[] => {
  return Object.values(PROBLEM_BANK)
}