# LeetCode Interview Assistant

A real-time collaborative coding interview practice tool built with Socket.IO.

## 🎯 Project Overview

This is a one-week intensive MVP for practicing technical interviews. Two users can join a room and collaborate on coding problems in real-time, simulating a real technical interview environment.

## 🚀 Day 1 - Basic Setup Complete

### ✅ Features Implemented
- **Room Management**: Create and join interview rooms with 6-character codes
- **Real-time Connection**: Socket.IO integration with connection status
- **User Roles**: Interviewer (creates room) vs Interviewee (joins room)
- **Basic UI**: Clean, responsive interface with loading states and error handling
- **Connection Handling**: Automatic reconnection and disconnect management

### 🏗️ Architecture
- **Backend**: Node.js + Express + Socket.IO
- **Frontend**: Vanilla HTML/CSS/JS with Socket.IO client
- **Storage**: In-memory room management (no database needed for MVP)

## 📦 Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or start production server
npm start
```

Visit `http://localhost:3000` to access the application.

## 🎮 How to Use

1. **As Interviewer**: Click "Create Room" to generate a room code
2. **As Interviewee**: Enter the room code and click "Join Room"
3. **Both users** will see connection status and user count
4. **Coming soon**: Code editor, whiteboard, chat, and terminal

## 🛠️ Tech Stack

- **Server**: Node.js, Express, Socket.IO
- **Client**: HTML5, CSS3, Vanilla JavaScript
- **Real-time**: Socket.IO for bidirectional communication
- **Styling**: Modern CSS with flexbox/grid

## 🔧 Development

### Available Scripts
- `npm start` - Production server
- `npm run dev` - Development with nodemon

### Key Files
- `server.js` - Express + Socket.IO server
- `public/index.html` - Main HTML interface
- `public/app.js` - Client-side Socket.IO logic
- `public/style.css` - Responsive styling

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop and mobile
- **Loading States**: Visual feedback for all actions
- **Error Handling**: User-friendly error messages
- **Connection Status**: Real-time connection indicators
- **Modern UI**: Clean, professional interview-ready interface

## 🧪 Testing

Open multiple browser tabs/windows to test:
1. Create room in one tab
2. Join with the room code in another tab
3. Verify user count updates and connection status

