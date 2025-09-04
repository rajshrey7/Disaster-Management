# Disaster Preparedness API Documentation

This document outlines the core backend API routes for the Disaster Preparedness application, built with Next.js and Prisma.

## Base URL
All API endpoints are prefixed with `/api`

## Authentication
Currently, the API routes do not include authentication middleware. Implement JWT or session-based authentication as needed for production use.

## API Endpoints

### 1. Learning Modules (`/api/modules`)

#### GET `/api/modules`
Fetch all learning modules with optional filtering.

**Query Parameters:**
- `category` (optional): Filter by module category (EARTHQUAKE, FLOOD, FIRE, FIRST_AID, REGIONAL_HAZARDS, EMERGENCY_COMMUNICATION)
- `difficulty` (optional): Filter by difficulty level (BEGINNER, INTERMEDIATE, ADVANCED)
- `isActive` (optional): Filter by active status (true/false)
- `includeLessons` (optional): Include lesson data (true/false)

**Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "difficulty": "BEGINNER",
    "duration": 30,
    "category": "EARTHQUAKE",
    "content": "string",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z",
    "updatedAt": "2024-01-01T00:00:00Z",
    "lessons": []
  }
]
```

#### POST `/api/modules`
Create a new learning module.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "difficulty": "BEGINNER",
  "duration": 30,
  "category": "EARTHQUAKE",
  "content": "string",
  "lessons": [
    {
      "title": "string",
      "description": "string",
      "content": "string",
      "duration": 10,
      "order": 1
    }
  ]
}
```

#### GET `/api/modules/[id]`
Fetch a specific module by ID.

**Query Parameters:**
- `includeLessons` (optional): Include lesson data (true/false)

#### PUT `/api/modules/[id]`
Update a specific module.

#### DELETE `/api/modules/[id]`
Delete a specific module.

---

### 2. Virtual Drills (`/api/drills`)

#### GET `/api/drills`
Fetch all virtual drills with optional filtering.

**Query Parameters:**
- `type` (optional): Filter by drill type (EARTHQUAKE, FIRE_EVACUATION, FLOOD_RESPONSE, MEDICAL_EMERGENCY, SHELTER_IN_PLACE)
- `difficulty` (optional): Filter by difficulty level (BEGINNER, INTERMEDIATE, ADVANCED)
- `isActive` (optional): Filter by active status (true/false)
- `includeSteps` (optional): Include drill steps (true/false)

#### POST `/api/drills`
Create a new virtual drill.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "type": "EARTHQUAKE",
  "difficulty": "BEGINNER",
  "duration": 15,
  "scenario": "string",
  "steps": [
    {
      "title": "string",
      "description": "string",
      "choices": "string",
      "correctChoice": 0,
      "points": 10,
      "order": 1
    }
  ]
}
```

#### GET `/api/drills/[id]`
Fetch a specific drill by ID.

#### PUT `/api/drills/[id]`
Update a specific drill.

#### DELETE `/api/drills/[id]`
Delete a specific drill.

---

### 3. Alerts (`/api/alerts`)

#### GET `/api/alerts`
Fetch all alerts with optional filtering.

**Query Parameters:**
- `type` (optional): Filter by alert type (WEATHER, ENVIRONMENTAL, FLOOD, SEISMIC, UTILITY, SECURITY, HEALTH)
- `severity` (optional): Filter by severity (LOW, MEDIUM, HIGH, CRITICAL)
- `region` (optional): Filter by region
- `status` (optional): Filter by status (ACTIVE, EXPIRED, RESOLVED, CANCELLED)
- `activeOnly` (optional): Show only active, non-expired alerts (true/false)

#### POST `/api/alerts`
Create a new alert.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "type": "WEATHER",
  "severity": "HIGH",
  "region": "string",
  "expiresAt": "2024-12-31T23:59:59Z",
  "actions": "string",
  "source": "string",
  "contact": "string"
}
```

#### GET `/api/alerts/[id]`
Fetch a specific alert by ID.

#### PUT `/api/alerts/[id]`
Update a specific alert.

#### DELETE `/api/alerts/[id]`
Delete a specific alert.

---

### 4. Users (`/api/users`)

#### GET `/api/users`
Fetch all users with optional filtering.

**Query Parameters:**
- `role` (optional): Filter by user role (STUDENT, TEACHER, ADMIN, EMERGENCY_RESPONDER)
- `institution` (optional): Filter by institution
- `location` (optional): Filter by location
- `includeProfile` (optional): Include user profile data (true/false)

#### POST `/api/users`
Create a new user.

**Request Body:**
```json
{
  "email": "string",
  "name": "string",
  "role": "STUDENT",
  "institution": "string",
  "location": "string",
  "phone": "string",
  "profile": {
    "grade": "string",
    "department": "string",
    "subjects": "string",
    "emergencyContact": "string",
    "medicalConditions": "string",
    "avatar": "string"
  }
}
```

#### GET `/api/users/[id]`
Fetch a specific user by ID.

**Query Parameters:**
- `includeProfile` (optional): Include user profile (true/false)
- `includeProgress` (optional): Include learning progress (true/false)
- `includeDrillResults` (optional): Include drill results (true/false)

#### PUT `/api/users/[id]`
Update a specific user.

#### DELETE `/api/users/[id]`
Delete a specific user.

---

### 5. Progress (`/api/progress`)

#### GET `/api/progress`
Fetch user progress records with optional filtering.

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `moduleId` (optional): Filter by module ID
- `lessonId` (optional): Filter by lesson ID
- `isCompleted` (optional): Filter by completion status (true/false)

#### POST `/api/progress`
Create or update user progress.

**Request Body:**
```json
{
  "userId": "string",
  "moduleId": "string",
  "lessonId": "string",
  "completedLessons": 5,
  "totalLessons": 10,
  "progress": 50.0,
  "isCompleted": false
}
```

---

### 6. Drill Results (`/api/progress/drill-results`)

#### GET `/api/progress/drill-results`
Fetch drill results with optional filtering.

**Query Parameters:**
- `userId` (optional): Filter by user ID
- `drillId` (optional): Filter by drill ID
- `passed` (optional): Filter by pass/fail status (true/false)

#### POST `/api/progress/drill-results`
Create a new drill result.

**Request Body:**
```json
{
  "userId": "string",
  "drillId": "string",
  "userResponses": "string",
  "score": 8,
  "maxScore": 10,
  "timeTaken": 120
}
```

#### GET `/api/progress/drill-results/[id]`
Fetch a specific drill result by ID.

#### PUT `/api/progress/drill-results/[id]`
Update a specific drill result.

#### DELETE `/api/progress/drill-results/[id]`
Delete a specific drill result.

---

## Error Handling

All API endpoints return consistent error responses:

**Error Response Format:**
```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (missing required fields)
- `404` - Not Found
- `500` - Internal Server Error

## Data Models

The API is built around these core Prisma models:

- **User**: Core user information and authentication
- **UserProfile**: Extended user profile data
- **LearningModule**: Educational content modules
- **Lesson**: Individual lessons within modules
- **VirtualDrill**: Interactive emergency drills
- **DrillStep**: Individual steps within drills
- **UserProgress**: User learning progress tracking
- **DrillResult**: User drill performance results
- **Alert**: Emergency alerts and notifications

## Usage Examples

### Creating a Learning Module
```javascript
const response = await fetch('/api/modules', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Earthquake Safety Basics',
    description: 'Learn essential earthquake safety procedures',
    difficulty: 'BEGINNER',
    duration: 30,
    category: 'EARTHQUAKE',
    lessons: [
      {
        title: 'Drop, Cover, and Hold On',
        description: 'Basic earthquake response',
        duration: 10,
        order: 1
      }
    ]
  })
});
```

### Fetching User Progress
```javascript
const response = await fetch('/api/progress?userId=user123&includeProgress=true');
const progress = await response.json();
```

### Creating a Drill Result
```javascript
const response = await fetch('/api/progress/drill-results', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    drillId: 'drill456',
    userResponses: JSON.stringify(['A', 'B', 'C']),
    score: 8,
    maxScore: 10,
    timeTaken: 120
  })
});
```

## Notes

- All timestamps are returned in ISO 8601 format
- JSON fields (like `content`, `actions`, `choices`) are stored as strings and should be parsed accordingly
- The API automatically calculates pass/fail status for drill results (70% threshold)
- User progress uses a unique constraint on `userId` + `moduleId` to prevent duplicates
- Cascade deletes are configured for related data (deleting a module will delete its lessons)
