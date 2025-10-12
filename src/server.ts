import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Types for our application
interface Room {
  id: string;
  participants: Set<string>;
  codeContent: string;
  whiteboardData: any[];
  chatMessages: ChatMessage[];
  currentProblem: string;
  timerStarted: boolean;
  timerDuration: number;
  createdAt: Date;
}

interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
}

interface UserSocket {
  id: string;
  username: string;
  role: 'interviewer' | 'candidate';
  roomId?: string;
}

interface Problem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  description: string;
  examples: string;
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
}

// Problem Bank - Classic Interview Questions
const problemBank: Record<string, Problem> = {
  'two-sum': {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    examples: `Input: nums = [2,7,11,15], target = 9
Output: [0,1]
Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].`,
    starterCode: {
      javascript: `function twoSum(nums, target) {
    
}`,
      python: `def two_sum(nums, target):
    pass`,
      java: `public int[] twoSum(int[] nums, int target) {
    
}`,
      cpp: `vector<int> twoSum(vector<int>& nums, int target) {
    
}`
    }
  },
  'reverse-linked-list': {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: `Input: head = [1,2,3,4,5]
Output: [5,4,3,2,1]`,
    starterCode: {
      javascript: `function reverseList(head) {
    
}`,
      python: `def reverse_list(head):
    pass`,
      java: `public ListNode reverseList(ListNode head) {
    
}`,
      cpp: `ListNode* reverseList(ListNode* head) {
    
}`
    }
  },
  'valid-parentheses': {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    examples: `Input: s = "()[]{}"
Output: true

Input: s = "([)]"
Output: false`,
    starterCode: {
      javascript: `function isValid(s) {
    
}`,
      python: `def is_valid(s):
    pass`,
      java: `public boolean isValid(String s) {
    
}`,
      cpp: `bool isValid(string s) {
    
}`
    }
  },
  'binary-search': {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'easy',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.',
    examples: `Input: nums = [-1,0,3,5,9,12], target = 9
Output: 4
Explanation: 9 exists in nums and its index is 4`,
    starterCode: {
      javascript: `function search(nums, target) {
    
}`,
      python: `def search(nums, target):
    pass`,
      java: `public int search(int[] nums, int target) {
    
}`,
      cpp: `int search(vector<int>& nums, int target) {
    
}`
    }
  },
  'merge-intervals': {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'medium',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.',
    examples: `Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].`,
    starterCode: {
      javascript: `function merge(intervals) {
    
}`,
      python: `def merge(intervals):
    pass`,
      java: `public int[][] merge(int[][] intervals) {
    
}`,
      cpp: `vector<vector<int>> merge(vector<vector<int>>& intervals) {
    
}`
    }
  },
  'longest-substring': {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: `Input: s = "abcabcbb"
Output: 3
Explanation: The answer is "abc", with the length of 3.`,
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
    
}`,
      python: `def length_of_longest_substring(s):
    pass`,
      java: `public int lengthOfLongestSubstring(String s) {
    
}`,
      cpp: `int lengthOfLongestSubstring(string s) {
    
}`
    }
  }
};

// In-memory storage (replace with database later)
const rooms = new Map<string, Room>();
const users = new Map<string, UserSocket>();

// Socket.IO event handlers
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // TODO: Initialize user
  // users.set(socket.id, { ... });

  // Handle room creation
  socket.on('create-room', (callback) => {
    // TODO: Generate room ID
    // TODO: Create room object
    // TODO: Add user to room
    // TODO: Send success response
    console.log('TODO: Implement room creation');
  });

  // Handle room joining
  socket.on('join-room', (roomId: string, callback) => {
    // TODO: Validate room exists
    // TODO: Check room capacity
    // TODO: Add user to room
    // TODO: Send room state to new user
    // TODO: Notify other participants
    console.log('TODO: Implement room joining');
  });

  // Handle code changes
  socket.on('code-change', (data: { content: string }) => {
    // TODO: Update room code content
    // TODO: Broadcast to other participants
    console.log('TODO: Implement code synchronization');
  });

  // Handle whiteboard changes
  socket.on('whiteboard-change', (data: any) => {
    // TODO: Store whiteboard data
    // TODO: Broadcast drawing to other participants
    console.log('TODO: Implement whiteboard synchronization');
  });

  // Handle chat messages
  socket.on('chat-message', (data: { message: string }) => {
    // TODO: Create chat message object
    // TODO: Store in room
    // TODO: Broadcast to all participants
    console.log('TODO: Implement chat messaging');
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    
    // TODO: Remove user from room
    // TODO: Notify other participants
    // TODO: Clean up empty rooms
    console.log('TODO: Implement disconnect cleanup');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
