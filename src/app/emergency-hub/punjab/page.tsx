import { PunjabEmergencyHub } from '@/components/PunjabEmergencyHub';

export default function PunjabEmergencyHubPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <PunjabEmergencyHub />
      
      {/* Setup Instructions */}
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🚀 Punjab Emergency Hub - Setup Instructions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                1. Database Setup
              </h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  First, seed the database with Punjab-specific data:
                </p>
                <div className="space-y-2">
                  <code className="block bg-gray-200 px-2 py-1 rounded text-sm">
                    npm run db:seed:regions
                  </code>
                  <code className="block bg-gray-200 px-2 py-1 rounded text-sm">
                    npm run db:seed:contacts
                  </code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                2. Weather Monitoring Setup
              </h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  Configure your OpenWeatherMap API key in the environment variables:
                </p>
                <code className="block bg-gray-200 px-2 py-1 rounded text-sm">
                  OPENWEATHER_API_KEY=your_api_key_here
                </code>
                <p className="text-sm text-gray-700 mt-2">
                  You can get a free API key from{' '}
                  <a 
                    href="https://openweathermap.org/api" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    OpenWeatherMap
                  </a>
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                3. Start Weather Monitoring
              </h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  Use the control panel in the dashboard to start weather monitoring:
                </p>
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  <li>Click "Start" to begin monitoring (default: 15-minute intervals)</li>
                  <li>Monitor will check weather for 6 major Punjab cities</li>
                  <li>Automatically creates alerts for dangerous conditions</li>
                  <li>Broadcasts alerts via WebSocket to connected clients</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                4. Test the System
              </h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  Test different features:
                </p>
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  <li><strong>Weather Tab:</strong> View real-time weather data for Punjab cities</li>
                  <li><strong>Alerts Tab:</strong> See emergency alerts and warnings</li>
                  <li><strong>Contacts Tab:</strong> Browse district-specific emergency contacts</li>
                  <li><strong>Overview Tab:</strong> Get a quick summary of system status</li>
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                5. API Endpoints
              </h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  Available API endpoints for integration:
                </p>
                <div className="space-y-2">
                  <code className="block bg-gray-200 px-2 py-1 rounded text-sm">
                    GET /api/weather/monitor?action=status
                  </code>
                  <code className="block bg-gray-200 px-2 py-1 rounded text-sm">
                    POST /api/weather/monitor (start/stop/restart)
                  </code>
                  <code className="block bg-gray-200 px-2 py-1 rounded text-sm">
                    GET /api/contacts?district=Ludhiana&state=Punjab
                  </code>
                  <code className="block bg-gray-200 px-2 py-1 rounded text-sm">
                    GET /api/alerts?region=Punjab
                  </code>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                6. WebSocket Integration
              </h3>
              <div className="bg-gray-100 p-4 rounded-md">
                <p className="text-sm text-gray-700 mb-2">
                  Real-time alert broadcasting:
                </p>
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  <li>Alerts are automatically broadcasted when created</li>
                  <li>Clients can subscribe to specific regions and alert types</li>
                  <li>Room-based targeting: <code>alerts:{region}:{type}</code></li>
                  <li>General alerts room: <code>alerts:general</code></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ✨ Key Features
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🚨 Real-Time Monitoring
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Automated weather monitoring for 6 Punjab cities</li>
                <li>• Configurable monitoring intervals (15+ minutes)</li>
                <li>• Automatic alert generation for dangerous conditions</li>
                <li>• Real-time WebSocket broadcasting</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📍 Hyper-Localized Content
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• District-specific emergency contacts</li>
                <li>• Regional weather monitoring</li>
                <li>• Location-based alert targeting</li>
                <li>• Punjab State Disaster Management Authority integration</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🌦️ Weather Intelligence
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Heat wave, cold wave detection</li>
                <li>• Heavy rainfall and flood warnings</li>
                <li>• Dust storm and thunderstorm alerts</li>
                <li>• Visibility and wind speed monitoring</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📱 Emergency Response
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Comprehensive emergency contact directory</li>
                <li>• Response time and coverage area information</li>
                <li>• 24/7 availability status</li>
                <li>• Specialization and service details</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-bold text-blue-900 mb-3">
            🚀 Next Steps
          </h2>
          <p className="text-blue-800 mb-4">
            The Punjab Emergency Hub is now fully functional! Here's what you can do next:
          </p>
          <ul className="text-blue-800 space-y-2 text-sm">
            <li>• <strong>Test the weather monitoring</strong> by starting the system and checking different cities</li>
            <li>• <strong>Create custom alerts</strong> using the alerts API for testing</li>
            <li>• <strong>Integrate with PSDMA</strong> by connecting their alert systems to your WebSocket</li>
            <li>• <strong>Add more cities</strong> by extending the weather monitoring service</li>
            <li>• <strong>Customize thresholds</strong> for different weather conditions</li>
            <li>• <strong>Add mobile app integration</strong> for push notifications</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
