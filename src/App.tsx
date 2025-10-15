import LandingPage from './components/LandingPage'
// import InterviewRoom from './components/InterviewRoom'

function App() {
  // TODO: Add state management and routing logic
  const showLanding = true

  return (
    <div className="min-h-screen">
      {showLanding && <LandingPage />}
      {/* {!showLanding && <InterviewRoom />} */}
    </div>
  )
}

export default App