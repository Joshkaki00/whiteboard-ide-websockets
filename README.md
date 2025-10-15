# 🚀 Interview Practice Assistant

A modern React-based interview practice tool for technical coding interviews. Built with React, TypeScript, Vite, and Tailwind CSS.

## ✨ Current Features

### 🎨 **Complete UI Wireframe**
- **Landing Page**: Clean interface for room creation/joining
- **Interview Room**: Professional 3-panel layout with responsive design
- **Problem Panel**: Displays coding problems with difficulty levels
- **Code Editor**: Syntax-highlighted editor with language selection
- **Whiteboard**: Canvas area for drawing and explanations
- **Chat Interface**: Messaging panel for communication
- **Participants List**: Shows connected users

### 💻 **Technical Stack**
- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7 for fast development
- **Styling**: Tailwind CSS with custom components
- **Development**: Hot reload with instant updates

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

2. **Install Tailwind Vite plugin**
   ```bash
   npm install @tailwindcss/vite
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Navigate to `http://localhost:5173`
   - View the complete interview interface wireframe

## 📋 Available Scripts

- `npm run dev` - Start Vite development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🏗️ Architecture

### Frontend Structure
```
src/
├── components/
│   ├── LandingPage.tsx      # Room creation/joining interface
│   ├── InterviewRoom.tsx    # Main interview layout
│   ├── ProblemPanel.tsx     # Problem display and selection
│   ├── CodeEditor.tsx       # Shared code editing area
│   ├── Whiteboard.tsx       # Drawing canvas component
│   ├── ChatPanel.tsx        # Messaging interface
│   └── ParticipantsPanel.tsx # User list and controls
├── App.tsx                  # Main app component
├── main.tsx                 # React entry point
└── index.css               # Tailwind CSS imports
```

### Key Technologies
- **React 19**: Modern component-based UI
- **TypeScript**: Full type safety throughout
- **Vite 7**: Lightning-fast build tool and dev server
- **Tailwind CSS**: Utility-first styling with custom components
- **ESLint**: Code quality and consistency

## 🎨 Design System

### Custom Tailwind Components
- `.btn` - Primary button styling with hover effects
- `.panel-header` - Consistent panel headers across components
- `.difficulty-easy/medium/hard` - Problem difficulty badges
- `.code-editor` - Dark-themed code editing area

### Color Palette
- **Primary**: `#667eea` (Interview blue)
- **Secondary**: `#764ba2` (Purple gradient)
- **Success**: `#48bb78` (Green actions)
- **Danger**: `#f56565` (Red warnings)

## 📱 Responsive Design

- **Desktop (1024px+)**: 3-panel layout with full feature visibility
- **Tablet (768-1024px)**: Stacked layout with condensed panels
- **Mobile (<768px)**: Single-column layout optimized for touch

## 🛠️ Development Workflow

### Hot Reload Development
```bash
npm run dev  # Starts Vite dev server on http://localhost:5173
```

### Component Development
- All components are currently **stubbed** (no functionality)
- Each component has clear **TODO comments** for implementation
- TypeScript interfaces define expected props and data structures

### Adding New Features
1. Components are ready for state management integration
2. Socket.IO client can be added for real-time features
3. Event handlers are stubbed and ready for implementation

## 🎯 Interview Experience Goals

When complete, this tool will provide:
- **Real-time collaboration** between interviewer and candidate
- **Synchronized code editing** with live updates
- **Interactive whiteboard** for algorithm explanation
- **Problem bank** with classic interview questions
- **Timer functionality** for timed coding sessions
- **Multi-language support** (JavaScript, Python, Java, C++)

## 🧪 Testing Your Setup

1. **Start the dev server**: `npm run dev`
2. **Visit**: `http://localhost:5173`
3. **Verify**: Complete wireframe loads with all panels visible
4. **Check responsive**: Resize browser to test tablet/mobile layouts
5. **Inspect styling**: All Tailwind classes should render correctly

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

## 📄 License
This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

**Happy coding!** 🎉 This wireframe provides a solid foundation for building a comprehensive technical interview practice platform.