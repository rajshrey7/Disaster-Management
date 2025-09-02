# 🚨 Punjab Emergency Hub - Complete System Documentation

## Overview

The Punjab Emergency Hub is a comprehensive real-time emergency monitoring and response coordination system designed specifically for Punjab State, India. It provides automated weather monitoring, real-time alert broadcasting, and district-specific emergency contact management.

## 🏗️ System Architecture

### Core Components

1. **Weather Monitoring Service** (`src/lib/weather-monitor.ts`)
   - Automated cron job for weather data fetching
   - Real-time analysis of dangerous weather conditions
   - Automatic alert generation and database storage

2. **WebSocket Broadcasting System** (`src/lib/socket.ts`)
   - Real-time alert distribution to connected clients
   - Room-based targeting for regional alerts
   - Integration with Next.js API routes

3. **Emergency Contacts API** (`src/app/api/contacts/route.ts`)
   - District-specific contact filtering
   - Comprehensive emergency service information
   - Real-time contact directory updates

4. **Weather Monitor Control API** (`src/app/api/weather/monitor/route.ts`)
   - Start/stop/restart weather monitoring
   - Manual weather checks for specific cities
   - System status monitoring

5. **Frontend Dashboard** (`src/components/PunjabEmergencyHub.tsx`)
   - Real-time weather data display
   - Alert management interface
   - Emergency contact directory
   - System control panel

## 🌦️ Weather Monitoring System

### Monitored Cities

The system monitors 6 major Punjab cities:
- **Ludhiana** (Ludhiana District)
- **Amritsar** (Amritsar District)
- **Chandigarh** (Chandigarh District)
- **Jalandhar** (Jalandhar District)
- **Patiala** (Patiala District)
- **Bathinda** (Bathinda District)

### Weather Thresholds

The system automatically detects and alerts for:

#### Heat Wave Conditions
- Temperature > 40°C for 2+ consecutive days
- Humidity < 30% with high temperatures
- Heat index > 45°C

#### Cold Wave Conditions
- Temperature < 4°C for 2+ consecutive days
- Wind chill < 0°C
- Frost conditions

#### Heavy Rainfall
- Rainfall > 50mm in 24 hours
- Rainfall > 100mm in 48 hours
- Flash flood risk assessment

#### Dust Storm & Thunderstorm
- Wind speed > 40 km/h with low visibility
- Thunderstorm with lightning activity
- Hail storm conditions

#### Visibility Issues
- Visibility < 1km due to fog
- Visibility < 500m due to smog
- Air quality index considerations

### Alert Generation Logic

```typescript
// Example alert generation for heat wave
if (temperature > 40 && humidity < 30) {
  const alert = {
    type: 'HEAT_WAVE',
    severity: 'HIGH',
    title: 'Heat Wave Warning',
    description: `Extreme heat conditions detected in ${city}`,
    actions: JSON.stringify([
      'Stay indoors during peak hours (12 PM - 4 PM)',
      'Drink plenty of water',
      'Avoid strenuous outdoor activities',
      'Check on elderly and vulnerable individuals'
    ]),
    evacuationRoutes: JSON.stringify([
      'Designated cooling centers',
      'Public buildings with AC',
      'Emergency shelters'
    ])
  };
}
```

## 📡 WebSocket Broadcasting System

### Room Structure

The system uses Socket.io rooms for targeted alert distribution:

```
alerts:general          - All connected clients
alerts:Punjab:WEATHER  - Weather alerts for Punjab
alerts:Ludhiana:FLOOD  - Flood alerts for Ludhiana district
alerts:Amritsar:FIRE   - Fire alerts for Amritsar district
```

### Client Subscription

```typescript
// Subscribe to specific region and alert type
socket.emit('subscribe_alerts', {
  regions: ['Punjab', 'Ludhiana'],
  alertTypes: ['WEATHER', 'FLOOD', 'FIRE']
});

// Listen for new alerts
socket.on('new_alert', (alert) => {
  console.log('New emergency alert:', alert);
  // Handle alert display and notification
});
```

### Alert Broadcasting

When a new alert is created (either manually or automatically):

1. **Database Storage**: Alert is saved to the database
2. **WebSocket Broadcast**: Alert is immediately broadcasted to relevant rooms
3. **Client Notification**: Connected clients receive real-time updates
4. **Fallback Handling**: If WebSocket fails, alert is queued for retry

## 🚨 Emergency Contact Management

### Contact Categories

- **Police** 🚔 - Law enforcement and security
- **Fire** 🚒 - Fire department and rescue services
- **Ambulance** 🚑 - Emergency medical services
- **Hospital** 🏥 - Medical facilities and trauma centers
- **State Disaster Management** 🏛️ - PSDMA and state-level coordination
- **District Emergency Operations** 🏢 - District-level emergency response
- **Civil Defense** 🛡️ - Civil protection and defense services
- **Utility Services** ⚡ - Power, water, and infrastructure
- **Transport** 🚌 - Emergency transportation services
- **Communication** 📡 - Emergency communication systems
- **Volunteer Organizations** 🤝 - Community response groups

### Contact Information Structure

Each emergency contact includes:
- **Basic Info**: Name, phone number, category
- **Location**: State, district, city, coverage area
- **Availability**: 24/7 status, response time
- **Specializations**: Specific services and capabilities
- **Contact Methods**: Phone, email, website, social media

## 🛠️ Setup Instructions

### 1. Environment Configuration

```bash
# .env.local
OPENWEATHER_API_KEY=your_openweather_api_key
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### 2. Database Seeding

```bash
# Seed geographic regions
npm run db:seed:regions

# Seed emergency contacts
npm run db:seed:contacts

# Generate Prisma client
npx prisma generate
```

### 3. Start the System

```bash
# Development mode
npm run dev

# Start weather monitoring (in another terminal)
curl -X POST http://localhost:3000/api/weather/monitor \
  -H "Content-Type: application/json" \
  -d '{"action": "start", "intervalMinutes": 15}'
```

### 4. Test the System

1. **Visit the Dashboard**: Navigate to `/emergency-hub/punjab`
2. **Start Weather Monitoring**: Use the control panel to start monitoring
3. **Check Weather Data**: View real-time weather for different cities
4. **Test Alerts**: Create test alerts using the alerts API
5. **Verify WebSocket**: Check real-time alert broadcasting

## 📊 API Reference

### Weather Monitor Control

#### GET `/api/weather/monitor?action=status`
Returns current weather monitoring system status.

**Response:**
```json
{
  "success": true,
  "data": {
    "isRunning": true,
    "lastCheck": "2024-01-15T10:30:00Z",
    "citiesMonitored": 6,
    "thresholds": { ... }
  }
}
```

#### POST `/api/weather/monitor`
Control the weather monitoring system.

**Request Body:**
```json
{
  "action": "start|stop|restart",
  "intervalMinutes": 15
}
```

#### GET `/api/weather/monitor?action=check-city&city=Ludhiana`
Manually check weather for a specific city.

### Emergency Contacts

#### GET `/api/contacts?district=Ludhiana&state=Punjab&category=POLICE`
Get filtered emergency contacts.

**Query Parameters:**
- `district`: Filter by district name
- `state`: Filter by state (default: Punjab)
- `category`: Filter by contact category
- `isActive`: Filter by active status

#### POST `/api/contacts`
Create a new emergency contact.

**Request Body:**
```json
{
  "name": "Ludhiana Police Control Room",
  "number": "100",
  "category": "POLICE",
  "district": "Ludhiana",
  "state": "Punjab",
  "city": "Ludhiana",
  "available24x7": true,
  "responseTime": "5 minutes",
  "coverageArea": "Ludhiana District"
}
```

### Alerts

#### GET `/api/alerts?region=Punjab&limit=10`
Get alerts filtered by region and limit.

#### POST `/api/alerts`
Create a new emergency alert (automatically triggers WebSocket broadcast).

## 🔧 Customization Options

### Adding New Cities

1. **Update Weather Monitor**:
```typescript
// src/lib/weather-monitor.ts
const PUNJAB_CITIES = [
  // ... existing cities
  {
    name: 'Mohali',
    district: 'Mohali',
    lat: 30.7046,
    lon: 76.7179
  }
];
```

2. **Update Database Seeding**:
```typescript
// prisma/seed-punjab-contacts.ts
const mohaliContacts = [
  {
    name: 'Mohali Emergency Control',
    number: '112',
    category: 'DISTRICT_EMERGENCY_OPERATIONS',
    district: 'Mohali',
    state: 'Punjab'
  }
];
```

### Customizing Weather Thresholds

```typescript
// src/lib/weather-monitor.ts
const WEATHER_THRESHOLDS = {
  HEAT_WAVE: {
    temperature: 42, // Customize temperature threshold
    consecutiveDays: 3, // Customize consecutive days
    humidity: 25 // Customize humidity threshold
  },
  // ... other thresholds
};
```

### Adding New Alert Types

1. **Update Prisma Schema**:
```prisma
enum AlertType {
  WEATHER
  FLOOD
  FIRE
  EARTHQUAKE
  CYCLONE
  CUSTOM_ALERT // Add new types here
}
```

2. **Update Weather Monitor**:
```typescript
// Add new detection logic
if (earthquakeMagnitude > 4.5) {
  const alert = {
    type: 'EARTHQUAKE',
    severity: 'CRITICAL',
    // ... alert details
  };
}
```

## 🚀 Integration with PSDMA

### WebSocket Integration

The system is designed to integrate with PSDMA's alert systems:

1. **Alert Forwarding**: PSDMA can send alerts to your WebSocket endpoint
2. **Real-time Broadcasting**: Alerts are immediately distributed to all connected clients
3. **Regional Targeting**: Alerts can be targeted to specific districts or regions
4. **Fallback Mechanisms**: Multiple delivery methods ensure alert delivery

### API Integration

```typescript
// Example: PSDMA alert integration
const psdmaAlert = {
  title: 'PSDMA: Heavy Rainfall Warning',
  description: 'Heavy rainfall expected in Ludhiana district',
  type: 'FLOOD',
  severity: 'HIGH',
  region: 'Ludhiana',
  source: 'PSDMA',
  actions: JSON.stringify([
    'Avoid low-lying areas',
    'Stay updated with weather reports',
    'Follow evacuation orders if issued'
  ])
};

// Send to your system
fetch('/api/alerts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(psdmaAlert)
});
```

## 📱 Frontend Integration

### React Hook Usage

```typescript
import { useAlerts } from '@/hooks/use-alerts';

function EmergencyApp() {
  const { alerts, subscribe, unsubscribe } = useAlerts();
  
  useEffect(() => {
    // Subscribe to Punjab alerts
    subscribe(['Punjab'], ['WEATHER', 'FLOOD', 'FIRE']);
    
    return () => unsubscribe();
  }, []);
  
  return (
    <div>
      {alerts.map(alert => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  );
}
```

### Real-time Updates

The dashboard automatically updates:
- **Weather Status**: Every 30 seconds
- **Alerts**: Every 2 minutes
- **WebSocket Alerts**: Real-time (immediate)
- **System Status**: On user interaction

## 🔒 Security Considerations

### API Security

1. **Rate Limiting**: Implement rate limiting for weather API calls
2. **Authentication**: Add authentication for admin functions
3. **Input Validation**: Validate all input parameters
4. **CORS Configuration**: Configure CORS for production deployment

### WebSocket Security

1. **Room Access Control**: Implement user authentication for room access
2. **Message Validation**: Validate all WebSocket messages
3. **Connection Limits**: Limit concurrent connections per user
4. **DDoS Protection**: Implement connection rate limiting

## 📈 Performance Optimization

### Database Optimization

1. **Indexing**: Add indexes for frequently queried fields
2. **Connection Pooling**: Use connection pooling for database connections
3. **Query Optimization**: Optimize complex queries with proper joins
4. **Caching**: Implement Redis caching for frequently accessed data

### WebSocket Optimization

1. **Connection Management**: Implement connection pooling
2. **Message Batching**: Batch multiple alerts for efficiency
3. **Room Cleanup**: Clean up empty rooms periodically
4. **Load Balancing**: Use multiple WebSocket servers for high load

## 🧪 Testing

### Unit Tests

```bash
# Run unit tests
npm run test

# Test specific components
npm run test:components
npm run test:api
```

### Integration Tests

```bash
# Test weather monitoring
npm run test:weather

# Test WebSocket functionality
npm run test:websocket

# Test emergency contacts
npm run test:contacts
```

### Load Testing

```bash
# Test WebSocket connections
npm run test:load:websocket

# Test API endpoints
npm run test:load:api
```

## 🚀 Deployment

### Production Setup

1. **Environment Variables**: Configure production environment variables
2. **Database**: Use production database (PostgreSQL/MySQL)
3. **WebSocket Server**: Deploy with proper load balancing
4. **Monitoring**: Implement application monitoring and logging
5. **Backup**: Set up automated database backups

### Docker Deployment

```dockerfile
# Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Configuration

```bash
# Production .env
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:port/db"
OPENWEATHER_API_KEY=your_production_key
NEXTAUTH_SECRET=your_production_secret
NEXTAUTH_URL=https://yourdomain.com
```

## 🔮 Future Enhancements

### Planned Features

1. **Mobile App Integration**: Push notifications for mobile devices
2. **AI-Powered Analysis**: Machine learning for weather pattern recognition
3. **Multi-language Support**: Punjabi, Hindi, and English interfaces
4. **Offline Mode**: Cached data for offline emergency response
5. **Integration APIs**: Connect with more emergency services
6. **Analytics Dashboard**: Emergency response metrics and analytics

### Scalability Improvements

1. **Microservices Architecture**: Break down into smaller services
2. **Event Streaming**: Use Apache Kafka for high-volume alert processing
3. **Geographic Distribution**: Deploy region-specific instances
4. **Real-time Analytics**: Implement real-time emergency response analytics

## 📞 Support and Maintenance

### System Monitoring

- **Health Checks**: Regular system health monitoring
- **Performance Metrics**: Track response times and throughput
- **Error Logging**: Comprehensive error logging and alerting
- **Backup Verification**: Regular backup testing and verification

### Maintenance Schedule

- **Daily**: Database backup verification
- **Weekly**: System performance review
- **Monthly**: Security updates and patches
- **Quarterly**: Full system audit and optimization

---

## 🎯 Conclusion

The Punjab Emergency Hub provides a robust, scalable, and real-time emergency response system specifically designed for Punjab State. With its automated weather monitoring, real-time alert broadcasting, and comprehensive emergency contact management, it serves as a critical tool for disaster preparedness and response coordination.

The system is built with modern technologies, follows best practices, and is designed for easy integration with existing emergency management infrastructure. Its modular architecture allows for easy customization and extension to meet specific regional requirements.

For support, customization, or integration assistance, please refer to the development team or create an issue in the project repository.
