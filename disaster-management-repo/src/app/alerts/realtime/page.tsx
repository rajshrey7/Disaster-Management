import { RealTimeAlerts } from '@/components/RealTimeAlerts';

export default function RealTimeAlertsPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Real-Time Alert System
          </h1>
          <p className="text-gray-600">
            Experience real-time emergency alerts with WebSocket technology. 
            This demo shows how alerts are instantly pushed to connected clients.
          </p>
        </div>

        <RealTimeAlerts 
          userId="demo-user-123"
          userRegions={['California', 'Nevada', 'Arizona']}
        />

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            How to Test
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Connect to the WebSocket server using the Connect button</li>
            <li>Open another browser tab and navigate to <code className="bg-blue-100 px-2 py-1 rounded">/api/alerts</code></li>
            <li>Create a new alert using a tool like Postman or curl</li>
            <li>Watch the alert appear in real-time on this page</li>
          </ol>
          
          <div className="mt-4 p-4 bg-white rounded border">
            <h3 className="font-medium text-blue-900 mb-2">Sample Alert Creation (curl):</h3>
            <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto">
{`curl -X POST http://localhost:3000/api/alerts \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Severe Weather Warning",
    "description": "Heavy rainfall expected in California",
    "type": "WEATHER",
    "severity": "HIGH",
    "region": "California",
    "expiresAt": "2024-12-31T23:59:59Z",
    "actions": "Stay indoors, avoid flood areas",
    "source": "National Weather Service"
  }'`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
