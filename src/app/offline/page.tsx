'use client';

export default function Offline() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 to-green-600 p-4">
      <div className="text-center text-white max-w-md">
        <div className="text-8xl mb-6">🌾</div>
        <h1 className="text-4xl font-bold mb-4">You're Offline</h1>
        <p className="text-xl mb-8 opacity-90">
          No internet connection detected. Don't worry - AgriSense works offline too!
        </p>
        
        <button
          onClick={() => window.location.reload()}
          className="bg-white text-green-800 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
        >
          Try Again
        </button>

        <div className="mt-12 bg-white/10 backdrop-blur-sm rounded-xl p-6 text-left">
          <h2 className="text-xl font-bold mb-4">Available Offline:</h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <span className="text-green-300 mr-2 text-xl">✓</span>
              <span>View previously loaded advisor tips</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-300 mr-2 text-xl">✓</span>
              <span>Check cached sensor data</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-300 mr-2 text-xl">✓</span>
              <span>Review saved market prices</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-300 mr-2 text-xl">✓</span>
              <span>Access your saved information</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
