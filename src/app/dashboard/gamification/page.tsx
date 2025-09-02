import { GamificationDashboard } from '@/components/GamificationDashboard';

export default function GamificationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Gamification Dashboard
          </h1>
          <p className="text-gray-600">
            Track your disaster preparedness progress, earn achievements, and level up your skills.
            This comprehensive dashboard shows your learning journey with detailed statistics and rewards.
          </p>
        </div>

        <GamificationDashboard 
          userId="demo-user-123"
        />

        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-3">
            How the Gamification System Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-blue-800">
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Scoring System</h3>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Module Completion:</strong> 100 XP per completed module</li>
                <li>• <strong>Lesson Progress:</strong> 10 XP per 10% progress</li>
                <li>• <strong>Drill Success:</strong> 50 XP per passed drill</li>
                <li>• <strong>Perfect Score:</strong> 100 XP bonus for perfect drill scores</li>
                <li>• <strong>Difficulty Multipliers:</strong> Advanced content gives more XP</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Achievements & Badges</h3>
              <ul className="space-y-1 text-sm">
                <li>• <strong>Module Master:</strong> Complete 5 learning modules</li>
                <li>• <strong>Drill Expert:</strong> Pass 10 emergency drills</li>
                <li>• <strong>Perfect Score:</strong> Get perfect scores on 5 drills</li>
                <li>• <strong>Category Specialist:</strong> Master specific disaster types</li>
                <li>• <strong>Difficulty Challenger:</strong> Conquer different skill levels</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-white rounded border">
            <h3 className="font-medium text-blue-900 mb-2">API Endpoints</h3>
            <div className="space-y-2 text-sm">
              <div>
                <code className="bg-blue-100 px-2 py-1 rounded">GET /api/dashboard/stats?userId={'{userId}'}</code>
                <span className="ml-2 text-blue-700">- Fetch comprehensive user statistics</span>
              </div>
              <div>
                <code className="bg-blue-100 px-2 py-1 rounded">POST /api/dashboard/stats</code>
                <span className="ml-2 text-blue-700">- Update user progress and recalculate stats</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h2 className="text-lg font-semibold text-green-900 mb-3">
            Features & Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-green-800">
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-medium text-green-900 mb-1">Progress Tracking</h3>
              <p className="text-sm">Monitor your learning journey with detailed progress bars and statistics</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-medium text-green-900 mb-1">Achievement System</h3>
              <p className="text-sm">Unlock achievements and badges as you master different preparedness skills</p>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">📈</div>
              <h3 className="font-medium text-green-900 mb-1">Level Progression</h3>
              <p className="text-sm">Level up your preparedness skills with an XP-based progression system</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
