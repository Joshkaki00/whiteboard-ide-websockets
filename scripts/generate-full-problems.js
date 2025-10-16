// Script to generate full problem descriptions for all problems
// This creates placeholder descriptions that are useful and professional

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the basic problems list
const basicProblems = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/leetcode-problems.json'), 'utf8'));
const extendedProblems = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/leetcode-problems-extended.json'), 'utf8'));

// Get slugs that already have full details
const extendedSlugs = new Set(extendedProblems.map(p => p.titleSlug));

// Generic but useful descriptions based on problem category
const templates = {
  'Array': {
    description: (title) => `Solve this array manipulation problem that tests your understanding of efficient iteration and data structure usage.\n\nThis problem requires you to work with array elements and apply algorithmic thinking to find the optimal solution.\n\n**Key Concepts:**\n- Array traversal and indexing\n- Pattern recognition\n- Time/space complexity optimization\n\n**Approach:**\n1. Understand the input constraints\n2. Consider edge cases (empty array, single element, etc.)\n3. Think about whether you need multiple passes\n4. Consider if sorting or hash maps could help`,
    examples: [
      { input: 'arr = [1, 2, 3, 4, 5]', output: 'Depends on operation', explanation: 'Draw the array on the whiteboard and trace through your algorithm step by step.' },
      { input: 'arr = []', output: 'Handle empty case', explanation: 'Always consider edge cases - what if the input is empty?' },
      { input: 'arr = [1]', output: 'Handle single element', explanation: 'Single element is another important edge case to consider.' }
    ],
    constraints: ['1 <= arr.length <= 10⁴', '-10⁹ <= arr[i] <= 10⁹', 'Consider edge cases: empty input, single element, duplicates, negative numbers']
  },
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
      { input: 'See problem for specific examples', output: 'See problem for expected output', explanation: 'Draw the DP table and trace through small examples!' }
    ],
    constraints: ['See problem for specific constraints', 'DP problems often have constraints like: n <= 1000, values within certain ranges']
  },
  'Tree': {
    description: (title) => `Solve this tree problem using traversal techniques and recursive thinking.\n\n**Key Concepts:**\n- Tree traversal (pre/in/post-order, level-order)\n- Recursion with base cases\n- DFS vs BFS approach\n- Parent-child relationships\n\n**Approach:**\n1. Draw the tree structure on the whiteboard\n2. Identify the base case (null node or leaf)\n3. Define what to return at each node\n4. Consider if you need helper functions\n5. Test with small examples`,
    examples: [
      { input: 'See problem for tree structure', output: 'See problem for expected output', explanation: 'Draw the tree on the whiteboard and trace your algorithm!' }
    ],
    constraints: ['See problem for specific constraints', 'Common: number of nodes, node value ranges, tree can be empty']
  },
  'Linked List': {
    description: (title) => `Work through this linked list problem using pointer manipulation and careful traversal.\n\n**Key Concepts:**\n- Pointer manipulation (slow/fast, previous/current)\n- Dummy nodes for easier edge case handling\n- In-place vs new list creation\n- Cycle detection techniques\n\n**Approach:**\n1. Draw the linked list on the whiteboard\n2. Consider using a dummy head\n3. Track multiple pointers if needed\n4. Watch for null pointer issues\n5. Test with edge cases (empty, single node)`,
    examples: [
      { input: 'See problem for linked list structure', output: 'See problem for expected output', explanation: 'Draw the pointer movements on the whiteboard!' }
    ],
    constraints: ['See problem for specific constraints', 'Common: list length, node value ranges, list can be empty']
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

// Combine with existing extended problems
const allProblems = [...extendedProblems, ...newProblems];

// Write to file
const outputPath = path.join(__dirname, '../src/data/leetcode-problems-extended.json');
fs.writeFileSync(outputPath, JSON.stringify(allProblems, null, 2));

console.log(`✅ Generated ${allProblems.length} problems (${extendedProblems.length} detailed + ${newProblems.length} generated)`);
console.log(`📝 Extended problems now include:`);
console.log(`   - ${allProblems.filter(p => p.difficulty === 'Easy').length} Easy`);
console.log(`   - ${allProblems.filter(p => p.difficulty === 'Medium').length} Medium`);
console.log(`   - ${allProblems.filter(p => p.difficulty === 'Hard').length} Hard`);

