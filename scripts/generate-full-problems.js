// Script to generate full problem descriptions for all problems
// This creates placeholder descriptions that are useful and professional

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the basic problems list
const basicProblems = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/leetcode-problems.json'), 'utf8'));

// Try to read existing extended problems, or start fresh
let extendedProblems = [];
const extendedPath = path.join(__dirname, '../src/data/leetcode-problems-extended.json');
if (fs.existsSync(extendedPath)) {
  extendedProblems = JSON.parse(fs.readFileSync(extendedPath, 'utf8'));
}

// Get slugs that already have full details
const extendedSlugs = new Set(extendedProblems.map(p => p.titleSlug));

// Problem-specific templates with REAL examples
const getTemplateForProblem = (problem) => {
  const title = problem.title.toLowerCase();
  const topics = problem.topicTags.join(', ');
  
  // Default array template
  if (topics.includes('Array') || topics.includes('Sorting') || topics.includes('Two Pointers')) {
    return {
      description: `Solve this array problem efficiently using the right data structures and algorithms.\n\nTOPICS: ${topics}\n\nKEY CONCEPTS:\n• Array traversal and indexing\n• Time/space complexity\n• Edge case handling\n\nAPPROACH:\n1. Understand input/output format\n2. Consider edge cases\n3. Draw examples on whiteboard\n4. Think about optimization`,
      examples: [
        { input: 'nums = [5, 2, 8, 1, 9]', output: '[1, 2, 5, 8, 9] (or depends on problem)', explanation: 'Trace through your algorithm with this example. What happens at each step?' },
        { input: 'nums = [1]', output: '[1] or single element result', explanation: 'Single element - does your algorithm handle this correctly?' },
        { input: 'nums = []', output: '[] or appropriate empty result', explanation: 'Empty array edge case - what should be returned?' }
      ],
      constraints: ['1 <= nums.length <= 10⁴', '-10⁴ <= nums[i] <= 10⁴', 'All elements may or may not be unique']
    };
  }
  
  if (topics.includes('String') || topics.includes('Sliding Window')) {
    return {
      description: `Work through this string problem using efficient traversal techniques.\n\n**Topics:** ${topics}\n\n**Key Concepts:**\n- String traversal patterns\n- Character frequency counting\n- Two pointers or sliding window\n- String immutability\n\n**Approach:**\n1. Write examples on whiteboard\n2. Look for patterns\n3. Consider hash maps for frequency\n4. Think about edge cases`,
      examples: [
        { input: 's = "racecar"', output: 'true (if palindrome check) or relevant result', explanation: 'Palindrome example - reads same forwards and backwards. Draw pointers moving from both ends.' },
        { input: 's = "hello"', output: 'Result based on problem', explanation: 'Regular string with distinct characters. Trace through your algorithm character by character.' },
        { input: 's = "a"', output: 'true or single char result', explanation: 'Single character is always valid for most string operations.' }
      ],
      constraints: ['0 <= s.length <= 10⁵', 's consists of lowercase/uppercase letters', 'May contain spaces or special characters']
    };
  }
  
  if (topics.includes('Dynamic Programming') || topics.includes('Memoization')) {
    return {
      description: `Solve this DP problem by breaking it into subproblems.\n\n**Topics:** ${topics}\n\n**Key Concepts:**\n- Overlapping subproblems\n- Optimal substructure\n- Memoization or tabulation\n- State definition\n\n**Approach:**\n1. Define dp[i] meaning\n2. Find base cases\n3. Write recurrence relation\n4. Draw DP table on whiteboard!`,
      examples: [
        { input: 'n = 5', output: '8 (example for Fibonacci-like problems)', explanation: 'If Fibonacci: dp = [0,1,1,2,3,5,8]. Draw the DP table showing how each value builds on previous ones.' },
        { input: 'n = 3', output: '3 or 5 (depends on problem)', explanation: 'Small input to trace through. dp[3] = some combination of dp[2] and dp[1]. Work it out!' },
        { input: 'n = 1', output: '1 (base case)', explanation: 'Base case: dp[1] = 1. This is your starting point.' }
      ],
      constraints: ['1 <= n <= 1000', 'Result fits in 32-bit integer', 'May need O(n) space for DP table']
    };
  }
  
  if (topics.includes('Tree') || topics.includes('Binary Tree') || topics.includes('Binary Search Tree')) {
    return {
      description: `Solve this tree problem using traversal and recursion.\n\n**Topics:** ${topics}\n\n**Key Concepts:**\n- Tree traversal (DFS/BFS)\n- Recursion with base cases\n- Left and right subtrees\n- Null checks\n\n**Approach:**\n1. Draw tree on whiteboard\n2. Identify base case (null)\n3. Define what to return\n4. Test with examples`,
      examples: [
        { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1] (if inverted) or relevant result', explanation: 'Tree structure:\n       4\n      / \\\n     2   7\n    / \\ / \\\n   1  3 6  9\nDraw this and trace your algorithm!' },
        { input: 'root = [2,1,3]', output: '3 (if max depth) or relevant result', explanation: 'Simple 3-node tree. Height = 2. Test your recursion logic.' },
        { input: 'root = []', output: 'null or 0', explanation: 'Empty tree edge case. What does your function return?' }
      ],
      constraints: ['0 <= number of nodes <= 10⁴', '-1000 <= Node.val <= 1000', 'Tree can be empty']
    };
  }
  
  if (topics.includes('Linked List')) {
    return {
      description: `Work through this linked list problem with pointer manipulation.\n\n**Topics:** ${topics}\n\n**Key Concepts:**\n- Pointer manipulation\n- Dummy nodes\n- In-place vs new list\n- Null checks\n\n**Approach:**\n1. Draw list on whiteboard\n2. Consider dummy head\n3. Track pointers carefully\n4. Test edge cases`,
      examples: [
        { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1] (if reversed) or relevant result', explanation: 'Draw: 1 -> 2 -> 3 -> 4 -> 5 -> null\nIf reversing: 5 -> 4 -> 3 -> 2 -> 1 -> null\nTrace pointer movements step by step!' },
        { input: 'head = [1,2]', output: '[2,1] or relevant result', explanation: 'Two nodes: 1 -> 2 -> null. Simplest non-trivial case.' },
        { input: 'head = []', output: 'null', explanation: 'Empty list returns null. Guard against null pointer errors!' }
      ],
      constraints: ['0 <= list length <= 5000', '-1000 <= Node.val <= 1000', 'List can be empty']
    };
  }
  
  // Default fallback
  return {
    description: `Solve this problem using appropriate algorithms and data structures.\n\n**Topics:** ${topics}\n\n**Approach:**\n1. Understand the problem\n2. Draw examples\n3. Find patterns\n4. Code solution`,
    examples: [
      { input: 'Input example 1', output: 'Expected output 1', explanation: 'Work through this example on the whiteboard step by step.' },
      { input: 'Input example 2', output: 'Expected output 2', explanation: 'Another test case to verify your approach.' }
    ],
    constraints: ['See problem constraints', 'Consider edge cases', 'Think about time/space complexity']
  };
};

// Generate full problem entries for all basic problems
const newProblems = basicProblems
  .filter(p => !extendedSlugs.has(p.titleSlug) && !p.paidOnly)
  .map(p => {
    const template = getTemplateForProblem(p);
    const topics = p.topicTags.join(', ');
    
    return {
      id: p.id,
      title: p.title,
      titleSlug: p.titleSlug,
      difficulty: p.difficulty,
      paidOnly: false,
      acRate: p.acRate,
      topicTags: p.topicTags,
      description: `${template.description}\n\n📊 PROBLEM STATS:\n• Difficulty: ${p.difficulty}\n• Acceptance Rate: ${p.acRate?.toFixed(1)}%\n• Topics: ${topics}\n\n🎨 INTERVIEW TIP:\nUse the whiteboard to:\n• Sketch out your approach\n• Draw examples and edge cases\n• Explain your thinking to your interviewer\n• Calculate time/space complexity\n\nThis is what makes CodePair better than solo practice!`,
      examples: template.examples.map((ex, i) => ({
        input: ex.input,
        output: ex.output,
        explanation: ex.explanation
      })),
      constraints: template.constraints
    };
  });

// Keep ONLY the first 25 detailed problems, regenerate the rest with new templates
const detailedProblems = extendedProblems.slice(0, 25);
const allProblems = [...detailedProblems, ...newProblems];

// Write to file
const outputPath = path.join(__dirname, '../src/data/leetcode-problems-extended.json');
fs.writeFileSync(outputPath, JSON.stringify(allProblems, null, 2));

console.log(`✅ Generated ${allProblems.length} problems (${extendedProblems.length} detailed + ${newProblems.length} generated)`);
console.log(`📝 Extended problems now include:`);
console.log(`   - ${allProblems.filter(p => p.difficulty === 'Easy').length} Easy`);
console.log(`   - ${allProblems.filter(p => p.difficulty === 'Medium').length} Medium`);
console.log(`   - ${allProblems.filter(p => p.difficulty === 'Hard').length} Hard`);

