# Real-Time Alert System Documentation

This document outlines the implementation of a real-time alert system using WebSockets (Socket.io) within the Next.js Disaster Preparedness application.

## Overview

The real-time alert system provides instant notification delivery to connected users based on their geographic regions and alert type preferences. When a new alert is created via the API, it's automatically broadcast to all relevant users through WebSocket connections.

## Architecture

```
┌─────────────────┐    HTTP POST    ┌─────────────────┐
│   Frontend      │ ──────────────→ │   API Route     │
│   (React)       │                 │  /api/alerts    │
└─────────────────┘                 └─────────────────┘
         │                                   │
         │ WebSocket                         │
         │ Connection                        │
         │                                  │
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│  WebSocket      │                 │   Database      │
│   Client        │                 │   (Prisma)      │
└─────────────────┘                 └─────────────────┘
         │                                   │
         │                                   │
         ▼                                   ▼
┌─────────────────┐                 ┌─────────────────┐
│  WebSocket      │ ◄────────────── │   Alert         │
│   Server        │    Broadcast    │   Creation      │
│  (Socket.io)    │                 │   Trigger       │
└─────────────────┘                 └─────────────────┘
```

## Components

### 1. WebSocket Server (`src/lib/socket.ts`)

The server-side WebSocket handler that manages client connections and alert broadcasting.

**Key Features:**
- Client connection management
- Region-based room subscriptions
- Alert type filtering
- Real-time alert broadcasting

**Room Structure:**
- `alerts:general` - All connected users
- `alerts:{region}:{type}` - Users subscribed to specific region/type combinations

**Events Handled:**
- `subscribe_alerts` - User subscribes to alerts
- `unsubscribe_alerts` - User unsubscribes from alerts
- `update_alert_regions` - User updates their alert regions

### 2. React Hook (`src/hooks/use-alerts.ts`)

A custom React hook that manages WebSocket connections and alert state.

**Features:**
- Automatic connection management
- Real-time alert reception
- Connection status tracking
- Error handling and reconnection

**Usage:**
```typescript
const {
  alerts,
  isConnected,
  isLoading,
  error,
  connect,
  disconnect,
  subscribe,
  unsubscribe,
  updateRegions,
  clearAlerts
} = useAlerts({
  userId: 'user123',
  regions: ['California', 'Nevada'],
  alertTypes: ['WEATHER', 'FLOOD'],
  autoConnect: true
});
```

### 3. React Component (`src/components/RealTimeAlerts.tsx`)

A complete UI component that demonstrates the real-time alert system.

**Features:**
- Connection status display
- Real-time alert list
- Region and alert type configuration
- Connection controls
- Alert management

### 4. WebSocket Client Utility (`src/lib/socket-client.ts`)

A utility class for managing WebSocket connections outside of React components.

**Features:**
- Connection management
- Event handling
- Reconnection logic
- Statistics and debugging

## API Integration

### Alert Creation Flow

1. **Frontend/API Client** sends POST request to `/api/alerts`
2. **API Route** creates alert in database
3. **WebSocket Broadcast** automatically triggers
4. **Connected Clients** receive real-time notification

### Code Example

```typescript
// Creating an alert (triggers WebSocket broadcast)
const response = await fetch('/api/alerts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Severe Weather Warning',
    description: 'Heavy rainfall expected',
    type: 'WEATHER',
    severity: 'HIGH',
    region: 'California',
    expiresAt: '2024-12-31T23:59:59Z',
    actions: 'Stay indoors, avoid flood areas',
    source: 'National Weather Service'
  })
});

// The alert is automatically broadcast to all connected clients
// subscribed to California weather alerts
```

## WebSocket Events

### Server → Client Events

| Event | Description | Payload |
|-------|-------------|---------|
| `new_alert` | New alert notification | `Alert` object |
| `subscription_confirmed` | Alert subscription confirmed | Subscription details |
| `unsubscription_confirmed` | Alert unsubscription confirmed | Confirmation message |
| `regions_updated` | Alert regions updated | New regions list |
| `message` | General system message | Message object |

### Client → Server Events

| Event | Description | Payload |
|-------|-------------|---------|
| `subscribe_alerts` | Subscribe to alerts | `AlertSubscription` object |
| `unsubscribe_alerts` | Unsubscribe from alerts | `userId` string |
| `update_alert_regions` | Update alert regions | `{userId, regions}` object |
| `message` | Send message | `{text, senderId}` object |

## Configuration

### Server Configuration (`server.ts`)

```typescript
const io = new Server(server, {
  path: '/api/socketio',
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
```

### Client Configuration (`use-alerts.ts`)

```typescript
const socketConfig = {
  serverUrl: 'http://localhost:3000',
  path: '/api/socketio',
  transports: ['websocket', 'polling'],
  timeout: 20000,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
};
```

## Usage Examples

### Basic Alert Subscription

```typescript
import { useAlerts } from '@/hooks/use-alerts';

function MyComponent() {
  const { alerts, isConnected, subscribe } = useAlerts({
    userId: 'user123',
    regions: ['California'],
    alertTypes: ['WEATHER', 'FLOOD']
  });

  useEffect(() => {
    if (isConnected) {
      subscribe({
        userId: 'user123',
        regions: ['California'],
        alertTypes: ['WEATHER', 'FLOOD']
      });
    }
  }, [isConnected, subscribe]);

  return (
    <div>
      {alerts.map(alert => (
        <div key={alert.id}>{alert.title}</div>
      ))}
    </div>
  );
}
```

### Dynamic Region Updates

```typescript
const { updateRegions } = useAlerts({ userId: 'user123' });

const handleLocationChange = (newLocation: string) => {
  updateRegions('user123', [newLocation]);
};
```

### Manual Connection Control

```typescript
const { connect, disconnect, isConnected } = useAlerts({
  autoConnect: false
});

return (
  <div>
    <button onClick={connect} disabled={isConnected}>
      Connect
    </button>
    <button onClick={disconnect} disabled={!isConnected}>
      Disconnect
    </button>
  </div>
);
```

## Testing

### 1. Start the Server

```bash
npm run dev
# or
node server.ts
```

### 2. Navigate to Demo Page

Visit `/alerts/realtime` to see the real-time alert system in action.

### 3. Test Alert Creation

Use curl or Postman to create alerts:

```bash
curl -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Alert",
    "description": "This is a test alert",
    "type": "WEATHER",
    "severity": "MEDIUM",
    "region": "California",
    "expiresAt": "2024-12-31T23:59:59Z"
  }'
```

### 4. Watch Real-Time Updates

The alert should appear instantly on the demo page for users subscribed to California weather alerts.

## Security Considerations

### Current Implementation
- No authentication required for WebSocket connections
- No rate limiting on alert creation
- CORS is open for development

### Production Recommendations
- Implement JWT authentication for WebSocket connections
- Add rate limiting to alert creation API
- Restrict CORS to specific domains
- Validate alert data and user permissions
- Implement WebSocket connection limits per user

## Performance Considerations

### Scalability
- Room-based broadcasting reduces unnecessary message delivery
- Connection pooling and load balancing for high-traffic scenarios
- Redis adapter for horizontal scaling

### Optimization
- Debounce region updates to prevent excessive room changes
- Implement alert caching for offline users
- Use WebSocket compression for large alert payloads

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check if server is running
   - Verify WebSocket path configuration
   - Check CORS settings

2. **Alerts Not Receiving**
   - Verify user is subscribed to correct regions/types
   - Check WebSocket connection status
   - Verify alert creation API is working

3. **Performance Issues**
   - Monitor WebSocket connection count
   - Check for memory leaks in event handlers
   - Verify room subscription logic

### Debug Mode

Enable debug logging:

```typescript
const { connect } = useAlerts({
  debug: true,
  serverUrl: 'http://localhost:3000'
});
```

## Future Enhancements

### Planned Features
- Push notifications for mobile devices
- Alert acknowledgment tracking
- Geographic clustering for regional alerts
- Alert priority queuing
- Offline alert caching

### Integration Possibilities
- SMS/Email alert delivery
- Third-party weather service integration
- Social media alert sharing
- Emergency contact notification system

## Conclusion

The real-time alert system provides a robust foundation for instant emergency communication. The WebSocket-based architecture ensures minimal latency while the room-based subscription system optimizes message delivery. The React hooks and components make it easy to integrate real-time alerts into any part of the application.
