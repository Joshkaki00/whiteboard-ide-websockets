# 🚀 CodePair - Real-Time Interview Practice Platform

A modern, gamified interview practice tool for technical coding interviews with real-time collaboration. Built with React, TypeScript, Vite, Socket.IO, and Tailwind CSS.

**🌐 Live Demo**: [https://joshkaki00.github.io/whiteboard-ide-websockets/](https://joshkaki00.github.io/whiteboard-ide-websockets/)

**📖 User Guide**: [LAUNCH_GUIDE.md](LAUNCH_GUIDE.md)  
**🚀 Deployment Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)  
**📊 Analytics Dashboard**: Access at `/analytics` (for admins)

## ✨ Features

### 🎮 **Gamified Experience**
- **XP System**: Track your coding progress with experience points
- **Level System**: Advance through coder levels
- **Achievement Badges**: Earn rewards for milestones
- **Professional Slack-like UI**: Clean, modern interface with smooth animations

### 🤝 **Real-Time Collaboration**
- **Room Creation/Joining**: 8-character room codes for easy sharing
- **Live Chat**: Real-time messaging between participants
- **Synchronized Code Editing**: See changes as your partner types
- **Participant Tracking**: Know when users join/leave
- **Connection Status**: Visual indicators for server connection

### 💻 **Code Editor**
- **Multi-Language Support**: JavaScript, Python, Java, C++
- **Language Switching**: Change languages mid-session with starter code
- **Syntax Highlighting**: Dark-themed code editor
- **Live Synchronization**: Changes sync in real-time across users
- **Cursor Position Preservation**: Smart cursor handling during updates

### 📚 **Problem Bank**
- **1000+ LeetCode Problems**: Comprehensive problem library
  - Full problem descriptions with examples and constraints
  - Search by title, topic, or difficulty
  - Random problem generator
  - Only interviewer can change problems (locked for candidates)
- **Problem Switcher**: Change problems mid-session (interviewer only)
- **Detailed Info**: Full descriptions, multiple examples, constraints
- **Difficulty Badges**: Color-coded Easy/Medium/Hard indicators

### ⏱️ **Timer Functionality**
- **30-Minute Timer**: Default interview duration (adjustable)
- **Start/Pause/Reset**: Full control over timing
- **Color-Coded Urgency**: Visual feedback as time runs out
- **Synced Across Users**: Timer state shared in real-time

### 🎨 **Whiteboard**
- **Drawing Canvas**: Sketch algorithms and data structures
- **Touch Support**: Full touchscreen support for tablets
- **Real-time Sync**: Drawings appear instantly for all participants
- **Color Picker**: Customizable drawing colors
- **Brush Sizes**: Adjustable line thickness
- **Clear Function**: Reset canvas when needed
- **View Modes**: Hybrid (code + whiteboard) or whiteboard-only
- **Resizable Panels**: Drag to adjust whiteboard and code editor sizes

### 📱 **Responsive Design**
- **Desktop (1024px+)**: 3-column layout with full features
- **Tablet (768px-1023px)**: 2x2 grid optimized layout
- **Mobile Blocker**: Friendly message for phones (not supported)
- **Breakpoint-Aware**: Smooth transitions between layouts

### 💻 **Technical Stack**
- **Frontend**: React 19 + TypeScript
- **Backend**: Node.js + Express + Socket.IO
- **Build Tool**: Vite 7 for lightning-fast development
- **Styling**: Tailwind CSS 4 with custom components
- **Real-Time**: Socket.IO for WebSocket communication
- **Type Safety**: Full TypeScript coverage

## 🚀 Quick Start

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Joshkaki00/whiteboard-ide-websockets.git
   cd whiteboard-ide-websockets
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start both servers**
   ```bash
   npm run dev
   ```
   This will start:
   - Frontend dev server on `http://localhost:5173`
   - Backend Socket.IO server on `http://localhost:3001`

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - Create a room or join with a room code
   - Open another browser window to test real-time collaboration!

## 📋 Available Scripts

- `npm run dev` - Start both frontend and backend servers
- `npm run dev:client` - Start only the Vite dev server
- `npm run dev:server` - Start only the Socket.IO server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run loadtest` - Run Socket.IO load tests
- `npm run deploy` - Deploy frontend to GitHub Pages

## 🏗️ Architecture

### Project Structure
```
fall-2025-intensive/
├── src/                        # Frontend React app
│   ├── components/
│   │   ├── LandingPage.tsx     # Gamified room creation/joining
│   │   ├── InterviewRoom.tsx   # Main interview layout
│   │   ├── ProblemPanel.tsx    # LeetCode problem display
│   │   ├── CodeEditor.tsx      # Synchronized code editing
│   │   ├── Whiteboard.tsx      # Drawing canvas
│   │   ├── ChatPanel.tsx       # Real-time messaging
│   │   ├── Timer.tsx           # Interview timer
│   │   ├── MobileBlocker.tsx   # Phone blocker screen
│   │   └── ParticipantsPanel.tsx
│   ├── contexts/
│   │   └── SocketContext.tsx   # Socket.IO context provider
│   ├── hooks/
│   │   └── useMediaQuery.ts    # Responsive breakpoint hooks
│   ├── services/
│   │   └── leetcodeService.ts  # Problem bank management
│   ├── App.tsx                 # Main app routing
│   └── index.css              # Tailwind CSS + custom components
├── server/
│   └── index.ts               # Socket.IO backend server
├── tests/
│   └── loadtest.js            # Socket.IO load testing
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Actions auto-deploy
└── vite.config.ts             # Vite configuration
```

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  GitHub Pages (Frontend)                 │
│         https://joshkaki00.github.io/...               │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │ Landing  │→ │ Interview │→ │ Problem  │            │
│  │  Page    │  │   Room    │  │  Solving │            │
│  └──────────┘  └──────────┘  └──────────┘            │
└──────────────────────┬──────────────────────────────────┘
                       │ Socket.IO WebSocket
                       ↓
┌─────────────────────────────────────────────────────────┐
│             Backend Server (Socket.IO)                   │
│         (Railway/Render/Self-hosted)                    │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Room    │  │   Code   │  │   Chat   │            │
│  │  Manager │  │   Sync   │  │  System  │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│                                                          │
│  In-Memory Storage (no database required)               │
└─────────────────────────────────────────────────────────┘
```

## 🎨 Design System

### Gamified Components
- `.game-card` - Hover-animated cards with border effects
- `.achievement-badge` - Gradient badges for XP/levels
- `.xp-counter` - Lightning bolt XP display
- `.status-dot` - Animated online/offline indicators
- `.btn-primary` - Purple gradient action buttons
- `.btn-secondary` - White bordered secondary buttons

### Slack-Inspired Elements
- `.panel-header` - Clean section headers
- `.progress-bar` - Animated progress indicators
- `.glass` - Glassmorphism backgrounds
- `.glow` - Subtle glow effects

### Color Palette
- **Primary**: `#9333ea` → `#3b82f6` (Purple to Blue gradient)
- **Success**: `#10b981` (Green for online status)
- **Warning**: `#f59e0b` (Yellow for timer warnings)
- **Danger**: `#ef4444` (Red for critical alerts)
- **Neutrals**: Gray scale for backgrounds and text

## 📱 Responsive Strategy

- **Desktop (1024px+)**: 3-column layout (Problem | Code+Whiteboard | Chat)
- **Tablet (768px-1023px)**: 2x2 grid layout
- **Phone (<768px)**: Blocked with upgrade message
- **Breakpoint Tool**: Custom `useMediaQuery` hook

## 🛠️ Development

### Local Development
```bash
# Install dependencies
npm install

# Start dev servers (frontend + backend)
npm run dev

# Frontend only
npm run dev:client

# Backend only
npm run dev:server
```

### Testing Real-Time Features

1. **Open two browser windows** at `http://localhost:5173`
2. **Create room** in first window
3. **Copy room code** (8 characters)
4. **Join room** in second window
5. **Test features**:
   - Type in chat → should appear in both windows
   - Edit code → should sync in real-time
   - Change language → both users see new starter code
   - Start timer → synced across users
   - Draw on whiteboard → appears for both

### Load Testing

Test server performance:
```bash
npm run loadtest
```

This will:
- Create 50 concurrent connections
- Each sends 10 messages
- Reports performance metrics

### Environment Variables

**Development** (`.env.development`):
```env
VITE_SERVER_URL=http://localhost:3001
```

**Production** (`.env.production`):
```env
VITE_SERVER_URL=https://your-backend-url.com
```

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions.

### Quick Deploy to GitHub Pages

1. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy updates"
   git push origin main
   ```

2. **GitHub Actions auto-deploys** to:
   `https://joshkaki00.github.io/whiteboard-ide-websockets/`

3. **Deploy backend** separately (Railway, Render, etc.)

4. **Update `.env.production`** with backend URL

### Manual Deploy
```bash
npm run deploy
```

## 🤝 Contributing

We welcome contributions to improve this interview practice tool! Please follow these guidelines to ensure a safe and collaborative development environment.

### Before Contributing

1. **Fork the repository** and create your feature branch from `main`
2. **Install dependencies** and verify the project runs locally
3. **Check existing issues** to avoid duplicate work
4. **Open an issue** for major changes to discuss implementation

### Development Guidelines

- **Follow TypeScript best practices** - maintain type safety
- **Use existing Tailwind components** - follow the established design system
- **Test responsive layouts** - ensure features work on all screen sizes
- **Write descriptive commit messages** - use conventional commit format
- **Keep components focused** - maintain single responsibility principle

### Pull Request Process

1. **Update documentation** if you change component interfaces
2. **Run linting** with `npm run lint` before submitting
3. **Build successfully** with `npm run build`
4. **Provide clear descriptions** of changes and testing performed
5. **Request review** from maintainers

### Security Considerations

- **Never commit sensitive data** (API keys, secrets, personal info)
- **Sanitize user inputs** in any new form components
- **Follow secure coding practices** for authentication features
- **Report security vulnerabilities** privately to maintainers

### Code Style

- Use the existing ESLint configuration
- Follow the established component structure in `src/components/`
- Maintain consistency with existing naming conventions
- Add TODO comments for incomplete functionality

Questions? Open an issue or reach out to the maintainers!

### Development Guidelines
- **TypeScript**: Maintain type safety throughout
- **Component-based**: Keep components focused and reusable
- **Tailwind CSS**: Use utility classes and custom components
- **Responsive-first**: Ensure all features work across devices

## 📊 Performance

- **Load Tested**: 50 concurrent connections
- **Message Throughput**: ~500 messages/second
- **Latency**: <50ms for local network
- **Memory**: ~50MB per 10 active rooms

## 🤝 Contributing

See detailed contribution guidelines in the main README sections above.

Quick tips:
1. Fork the repo
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/Joshkaki00/whiteboard-ide-websockets/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Joshkaki00/whiteboard-ide-websockets/discussions)
- **Email**: [Your email if you want]

## 🙏 Acknowledgments

- LeetCode for problem inspiration
- Socket.IO team for real-time magic
- React team for amazing framework
- Vite team for blazing fast builds
- Tailwind CSS for beautiful styling

## 📄 License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

---

**Happy coding!** 🚀 Now go ace those technical interviews!