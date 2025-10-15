# 🚀 CodePair Quick Start Guide

Get up and running in 5 minutes!

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Joshkaki00/whiteboard-ide-websockets.git
cd whiteboard-ide-websockets

# Install dependencies
npm install

# Start both servers
npm run dev
```

## 🎮 Testing Locally

1. **Open first browser window**
   - Go to `http://localhost:5173`
   - Click "Start New Session"
   - You'll be taken to an interview room
   - **Copy the room code** from the header (e.g., "AB12CD34")

2. **Open second browser window**
   - Go to `http://localhost:5173`
   - Click "Join Session"
   - Paste the room code
   - Click "Join Room"

3. **Test real-time features**
   - ✅ Type in chat → appears in both windows
   - ✅ Edit code → syncs instantly
   - ✅ Change language → both see new starter code
   - ✅ Start timer → synced across users
   - ✅ Problem switcher → changes for both users

## 🌐 Live Demo

**Frontend**: [https://joshkaki00.github.io/whiteboard-ide-websockets/](https://joshkaki00.github.io/whiteboard-ide-websockets/)

**Note**: For the live demo to work, you need to:
1. Deploy the backend server (see [DEPLOYMENT.md](DEPLOYMENT.md))
2. Update `.env.production` with your backend URL
3. Redeploy the frontend

## 📱 Device Support

- ✅ **Desktop** (1024px+): Full 3-column layout
- ✅ **Tablet** (768px-1023px): 2x2 grid layout
- ❌ **Phone** (<768px): Not supported (friendly blocker message)

## 🎯 Quick Tips

### For Interviewers
1. Create a room
2. Share the 8-character code
3. Select a problem from the dropdown
4. Start the timer when ready
5. Use chat for hints and feedback

### For Candidates
1. Join with the code provided
2. Start coding when interviewer begins timer
3. Use whiteboard to explain your thinking
4. Ask questions via chat
5. Test multiple approaches

## 🧪 Load Testing

Test the server performance:

```bash
npm run loadtest
```

Expected results:
- 50 concurrent connections
- ~500 messages/second
- <50ms latency on local network

## 🐛 Troubleshooting

### Frontend won't start
```bash
# Check if port 5173 is in use
lsof -ti:5173 | xargs kill -9

# Restart
npm run dev:client
```

### Backend won't start
```bash
# Check if port 3001 is in use
lsof -ti:3001 | xargs kill -9

# Restart
npm run dev:server
```

### Can't connect to server
- Make sure backend is running (`npm run dev:server`)
- Check browser console for errors
- Verify Socket.IO connection in Network tab

### Code not syncing
- Refresh both browser windows
- Create a new room
- Check if both users are in the same room

## 📚 Next Steps

- Read the full [README.md](README.md) for complete documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment
- Review code structure in `src/` directory
- Explore Socket.IO events in `server/index.ts`

## 🎉 You're Ready!

Start conducting mock interviews and level up your coding skills!

**Happy coding!** 🚀

