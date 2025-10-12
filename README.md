# 🚀 Leetcode Interview Assistant

A real-time collaborative coding interview practice tool that emulates the experience of technical interviews at tech companies. Built with TypeScript, Socket.IO, and vanilla web technologies.

## ✨ Features

### 🤝 **Real-time Collaboration**
- **Shared Code Editor**: Write code together with live synchronization
- **Interactive Whiteboard**: Draw diagrams, explain algorithms, and visualize solutions
- **Live Chat**: Communicate during the interview session
- **Room System**: Create private rooms with shareable codes (max 2 participants)

### 💻 **Technical Interview Experience**
- **Clean Code Environment**: Dark-themed monospace editor optimized for coding
- **Whiteboard Drawing**: HTML5 Canvas with customizable pen colors and sizes
- **Real-time Updates**: Sub-second synchronization across all features
- **Professional UI**: Modern, responsive design that works on all devices

### 🔧 **Developer Features**
- **TypeScript**: Full type safety on server-side with TypeScript patterns on client
- **Socket.IO v4**: Robust WebSocket communication with fallback support
- **Hot Reload**: Development server with automatic recompilation
- **Cross-platform**: Works on desktop, tablet, and mobile devices

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <your-repo-url>
   cd fall-2025-intensive
   npm install
   ```

2. **Build the TypeScript server**
   ```bash
   npm run build
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:3000`
   - Create a new room or join an existing one
   - Share the room code with your interview partner

## 📋 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Start development server with hot reload
- `npm start` - Run the production server
- `npm run clean` - Remove compiled files

## 🏗️ Architecture

### Server (TypeScript)
```
src/
├── server.ts          # Main Socket.IO server with room management
└── types/             # TypeScript type definitions
```

### Client (Vanilla JS/HTML/CSS)
```
public/
├── index.html         # Single-page application
├── app.js            # Client-side Socket.IO logic
└── style.css         # Responsive UI styling
```

### Key Technologies
- **Backend**: Node.js + Express + Socket.IO + TypeScript
- **Frontend**: Vanilla JavaScript + HTML5 Canvas + CSS Grid
- **Real-time**: Socket.IO with event-driven architecture
- **Development**: TypeScript compiler + Nodemon + Concurrently

## 🎯 Usage Guide

### Creating an Interview Session

1. **Host creates a room**:
   - Click "Create New Room"
   - Share the generated 8-character room code
   - Wait for participant to join

2. **Participant joins**:
   - Enter the room code
   - Click "Join Room"
   - Start collaborating immediately

### During the Interview

#### **Code Editor**
- Type in the shared textarea
- Changes sync automatically with 300ms debouncing
- See typing indicators when your partner is coding
- Cursor position is preserved during updates

#### **Whiteboard**
- Draw with mouse/touch
- Change pen color and size using controls
- Click "Clear" to reset the whiteboard
- All drawing actions sync in real-time

#### **Chat**
- Send messages to communicate
- See system notifications for join/leave events
- Messages include timestamps and usernames
- Auto-scroll to latest messages

## 🔧 Socket.IO Events

### Client → Server
- `create-room` - Create a new interview room
- `join-room` - Join existing room with code
- `code-change` - Send code editor updates
- `whiteboard-change` - Send drawing data
- `chat-message` - Send chat messages

### Server → Client
- `room-state` - Initial room state for new participants
- `user-joined` / `user-left` - Participant notifications
- `code-update` - Receive code changes from partner
- `whiteboard-update` - Receive drawing updates
- `chat-update` - Receive new chat messages

## 🎨 Customization

### Styling
- Modify `public/style.css` for UI customization
- CSS Grid layout adapts automatically to screen sizes
- Dark theme optimized for coding sessions

### Features
- Add syntax highlighting with Prism.js
- Implement problem templates in `server.ts`
- Add timer functionality for timed interviews
- Extend whiteboard with shapes and text tools

## 🚢 Deployment

### Development
```bash
npm run dev  # Runs on http://localhost:3000
```

### Production
1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Start production server**:
   ```bash
   npm start
   ```

3. **Deploy to platforms**:
   - **Heroku**: Add `Procfile` with `web: npm start`
   - **Vercel**: Configure for Node.js deployment
   - **Railway**: Connect GitHub repo and deploy
   - **DigitalOcean**: Use App Platform with Node.js buildpack

### Environment Variables
```bash
PORT=3000  # Server port (default: 3000)
```

## 🧪 Testing Your Setup

1. **Open two browser tabs** to `http://localhost:3000`
2. **Create a room** in the first tab
3. **Join with the room code** in the second tab
4. **Test all features**:
   - Type in the code editor (should sync)
   - Draw on the whiteboard (should appear on both)
   - Send chat messages (should appear instantly)

## 🤝 Contributing

This is an MVP built for a one-week intensive. Key areas for improvement:

- **Security**: Add input validation and rate limiting
- **Persistence**: Replace in-memory storage with database
- **Features**: Add syntax highlighting, problem banks, timers
- **Testing**: Add unit and integration tests
- **Performance**: Optimize for larger rooms and heavy usage

## 📄 License

MIT License - feel free to use this for your own interview practice!

## 🎯 MVP Scope

This project was built as a **one-week MVP** focusing on core collaboration features:

✅ **Included**:
- Real-time code sharing
- Interactive whiteboard
- Chat system
- Room management
- Responsive UI

❌ **Intentionally excluded** (for future versions):
- User authentication
- Code execution
- Video/audio calls
- Problem databases
- Advanced drawing tools
- Persistent storage

---

**Happy interviewing!** 🎉 Use this tool to practice coding interviews with friends, simulate real technical interview conditions, and improve your collaborative problem-solving skills.
