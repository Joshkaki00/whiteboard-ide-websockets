export default function MobileBlocker() {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="mb-6">
            <svg className="w-20 h-20 mx-auto text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6l12 12M6 18L18 6" />
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            📱 Mobile Not Supported
          </h1>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            CodePair is optimized for collaborative coding on larger screens. 
            Please switch to a <strong>tablet</strong> or <strong>desktop</strong> device for the best experience.
          </p>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <p className="text-sm text-purple-800">
              <strong>Minimum screen width:</strong> 768px (tablet)
            </p>
          </div>
        </div>
      </div>
    )
  }