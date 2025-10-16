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
      description: `Solve this array problem efficiently using the right data structures and algorithms.\n\n**Topics:** ${topics}\n\n**Key Concepts:**\n- Array traversal and indexing\n- Time/space complexity\n- Edge case handling\n\n**Approach:**\n1. Understand input/output format\n2. Consider edge cases\n3. Draw examples on whiteboard\n4. Think about optimization`,
      examples: [
        { input: 'nums = [5, 2, 8, 1, 9]', output: '[1, 2, 5, 8, 9] (or depends on problem)', explanation: 'Trace through your algorithm with this example. What happens at each step?' },
        { input: 'nums = [1]', output: '[1] or single element result', explanation: 'Single element - does your algorithm handle this correctly?' },
        { input: 'nums = []', output: '[] or appropriate empty result', explanation: 'Empty array edge case - what should be returned?' }
      ],
      constraints: ['1 <= nums.length <= 10⁴', '-10⁴ <= nums[i] <= 10⁴', 'All elements may or may not be unique']
    };
  }
  'String': {
    description: (title) => `Work through this string manipulation problem that tests pattern recognition and efficient string processing.\n\n**Key Concepts:**\n- String traversal (forward, backward, two pointers)\n- Character frequency counting\n- Substring patterns\n- String building vs in-place modification\n\n**Approach:**\n1. Draw out examples on the whiteboard\n2. Look for patterns or repeating structures\n3. Consider if you need a hash map for character tracking\n4. Think about time/space tradeoffs`,
    examples: [
      { input: 's = "hello"', output: 'Depends on operation', explanation: 'Write out the string and trace through character by character on the whiteboard.' },
      { input: 's = ""', output: 'Handle empty string', explanation: 'Empty string is a critical edge case - what should happen?' },
      { input: 's = "a"', output: 'Handle single character', explanation: 'Single character strings are another edge case to consider.' }
    ],
    constraints: ['0 <= s.length <= 5 × 10⁴', 's consists of printable ASCII characters', 'Consider: empty strings, single characters, all same character, palindromes']
  },
  'Dynamic Programming': {
    description: (title) => `This dynamic programming problem tests your ability to break problems into subproblems and build solutions incrementally.\n\n**Key Concepts:**\n- Overlapping subproblems\n- Optimal substructure\n- Memoization (top-down) vs Tabulation (bottom-up)\n- State definition and transitions\n\n**Approach:**\n1. Define what dp[i] represents\n2. Find the base cases\n3. Write the recurrence relation\n4. Decide: recursive with memo or iterative?\n5. Draw the dp table on the whiteboard!`,
    examples: [
      { input: 'n = 5', output: 'Optimal solution for n=5', explanation: 'Draw a DP table on the whiteboard. Start with base cases (n=0, n=1) and build up to n=5.' },
      { input: 'n = 1', output: 'Base case result', explanation: 'Base cases are crucial in DP - this is where your recursion/iteration stops.' },
      { input: 'n = 0', output: 'Base case result', explanation: 'n=0 is often your starting point. What\'s the answer for zero?' }
    ],
    constraints: ['1 <= n <= 1000', 'Values fit in 32-bit integer', 'Draw the DP table to visualize subproblem relationships']
  },
  'Tree': {
    description: (title) => `Solve this tree problem using traversal techniques and recursive thinking.\n\n**Key Concepts:**\n- Tree traversal (pre/in/post-order, level-order)\n- Recursion with base cases\n- DFS vs BFS approach\n- Parent-child relationships\n\n**Approach:**\n1. Draw the tree structure on the whiteboard\n2. Identify the base case (null node or leaf)\n3. Define what to return at each node\n4. Consider if you need helper functions\n5. Test with small examples`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: 'Depends on operation', explanation: 'Draw this tree structure on the whiteboard:\n       3\n      / \\\n     9  20\n       /  \\\n      15   7\nTrace through your algorithm node by node.' },
      { input: 'root = []', output: 'null or default value', explanation: 'Empty tree - what should your function return?' },
      { input: 'root = [1]', output: 'Single node result', explanation: 'Single node tree is a good edge case to verify your solution.' }
    ],
    constraints: ['0 <= number of nodes <= 10⁴', '-100 <= Node.val <= 100', 'Tree can be empty (null root)']
  },
  'Linked List': {
    description: (title) => `Work through this linked list problem using pointer manipulation and careful traversal.\n\n**Key Concepts:**\n- Pointer manipulation (slow/fast, previous/current)\n- Dummy nodes for easier edge case handling\n- In-place vs new list creation\n- Cycle detection techniques\n\n**Approach:**\n1. Draw the linked list on the whiteboard\n2. Consider using a dummy head\n3. Track multiple pointers if needed\n4. Watch for null pointer issues\n5. Test with edge cases (empty, single node)`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: 'Modified list', explanation: 'Draw the linked list: 1 -> 2 -> 3 -> 4 -> 5 -> null\nTrace your pointer movements on the whiteboard.' },
      { input: 'head = []', output: 'null', explanation: 'Empty list - handle this edge case carefully to avoid null pointer errors.' },
      { input: 'head = [1]', output: 'Single node result', explanation: 'Single node: 1 -> null. What happens with just one element?' }
    ],
    constraints: ['0 <= list length <= 5000', '-5000 <= Node.val <= 5000', 'List can be empty (null head)']
  }
};

// Generate full problem entries for all basic problems
const newProblems = basicProblems
  .filter(p => !extendedSlugs.has(p.titleSlug) && !p.paidOnly)
  .map(p => {
    const mainTopic = p.topicTags[0] || 'Array';
    const template = templates[mainTopic] || templates['Array'];
    const topics = p.topicTags.join(', ');
    
    return {
      id: p.id,
      title: p.title,
      titleSlug: p.titleSlug,
      difficulty: p.difficulty,
      paidOnly: false,
      acRate: p.acRate,
      topicTags: p.topicTags,
      description: `# ${p.title}\n\n${template.description(p.title)}\n\n### 📊 Problem Stats\n- **Difficulty:** ${p.difficulty}\n- **Acceptance Rate:** ${p.acRate?.toFixed(1)}%\n- **Topics:** ${topics}\n\n### 🎨 Interview Tip\nUse the whiteboard to:\n- Sketch out your approach\n- Draw examples and edge cases\n- Explain your thinking to your interviewer\n- Calculate time/space complexity\n\nThis is what makes CodePair better than solo practice!`,
      examples: template.examples.map((ex, i) => ({
        input: `Example ${i + 1}: ${ex.input}`,
        output: ex.output,
        explanation: ex.explanation
      })),
      constraints: [
        ...template.constraints,
        `Work through constraints on the whiteboard with your partner`,
        `This is a ${p.difficulty} level problem - adjust your approach accordingly`
      ]
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

