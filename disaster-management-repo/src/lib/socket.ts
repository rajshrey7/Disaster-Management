import { Server, Socket } from 'socket.io';

interface AlertSubscription {
  userId: string;
  regions: string[];
  alertTypes: string[];
}

interface AlertMessage {
  id: string;
  title: string;
  description: string;
  type: string;
  severity: string;
  region: string;
  issuedAt: string;
  expiresAt: string;
  actions?: string;
  source?: string;
  contact?: string;
}

export const setupSocket = (io: Server) => {
  // Store user subscriptions for targeted alert broadcasting
  const userSubscriptions = new Map<string, AlertSubscription>();

  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);
    
    // Handle user authentication and alert subscription
    socket.on('subscribe_alerts', (subscription: AlertSubscription) => {
      const { userId, regions, alertTypes } = subscription;
      
      // Store user's alert preferences
      userSubscriptions.set(userId, subscription);
      
      // Join rooms for each region and alert type combination
      regions.forEach(region => {
        alertTypes.forEach(alertType => {
          const roomName = `alerts:${region}:${alertType}`;
          socket.join(roomName);
          console.log(`User ${userId} joined room: ${roomName}`);
        });
      });

      // Also join a general alerts room for all users
      socket.join('alerts:general');
      
      socket.emit('subscription_confirmed', {
        message: 'Successfully subscribed to alerts',
        regions,
        alertTypes
      });
    });

    // Handle user unsubscription
    socket.on('unsubscribe_alerts', (userId: string) => {
      const subscription = userSubscriptions.get(userId);
      if (subscription) {
        // Leave all alert rooms
        subscription.regions.forEach(region => {
          subscription.alertTypes.forEach(alertType => {
            const roomName = `alerts:${region}:${alertType}`;
            socket.leave(roomName);
          });
        });
        socket.leave('alerts:general');
        
        // Remove user subscription
        userSubscriptions.delete(userId);
        
        socket.emit('unsubscription_confirmed', {
          message: 'Successfully unsubscribed from alerts'
        });
      }
    });

    // Handle user region update
    socket.on('update_alert_regions', (data: { userId: string; regions: string[] }) => {
      const subscription = userSubscriptions.get(data.userId);
      if (subscription) {
        // Leave old region rooms
        subscription.regions.forEach(region => {
          subscription.alertTypes.forEach(alertType => {
            const roomName = `alerts:${region}:${alertType}`;
            socket.leave(roomName);
          });
        });

        // Update regions and join new rooms
        subscription.regions = data.regions;
        subscription.regions.forEach(region => {
          subscription.alertTypes.forEach(alertType => {
            const roomName = `alerts:${region}:${alertType}`;
            socket.join(roomName);
          });
        });

        socket.emit('regions_updated', {
          message: 'Alert regions updated successfully',
          regions: data.regions
        });
      }
    });

    // Handle messages (keeping existing functionality)
    socket.on('message', (msg: { text: string; senderId: string }) => {
      socket.emit('message', {
        text: `Echo: ${msg.text}`,
        senderId: 'system',
        timestamp: new Date().toISOString(),
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      
      // Clean up user subscriptions on disconnect
      for (const [userId, subscription] of userSubscriptions.entries()) {
        // This is a simple cleanup - in production you might want to track socket-user mapping
        // For now, we'll keep subscriptions active until explicit unsubscription
      }
    });

    // Send welcome message
    socket.emit('message', {
      text: 'Welcome to Disaster Preparedness Alert System!',
      senderId: 'system',
      timestamp: new Date().toISOString(),
    });
  });

  // Function to broadcast alerts to relevant users
  const broadcastAlert = (alert: AlertMessage) => {
    const { region, type } = alert;
    
    // Broadcast to specific region and alert type room
    const specificRoom = `alerts:${region}:${type}`;
    io.to(specificRoom).emit('new_alert', alert);
    
    // Also broadcast to general alerts room for all users
    io.to('alerts:general').emit('new_alert', alert);
    
    console.log(`Alert broadcasted to room: ${specificRoom} and general`);
  };

  // Return the broadcast function so it can be used by the alerts API
  return { broadcastAlert };
};