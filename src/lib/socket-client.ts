import { io, Socket } from 'socket.io-client';

export interface SocketConfig {
  serverUrl?: string;
  path?: string;
  transports?: string[];
  timeout?: number;
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionAttempts?: number;
}

export interface AlertEvent {
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

export interface SubscriptionEvent {
  userId: string;
  regions: string[];
  alertTypes: string[];
}

export interface MessageEvent {
  text: string;
  senderId: string;
  timestamp: string;
}

export class SocketClient {
  private socket: Socket | null = null;
  private config: SocketConfig;
  private eventHandlers: Map<string, ((...args: any[]) => void)[]> = new Map();

  constructor(config: SocketConfig = {}) {
    this.config = {
      serverUrl: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
      path: '/api/socketio',
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      ...config
    };
  }

  // Connect to WebSocket server
  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (this.socket && this.socket.connected) {
          resolve();
          return;
        }

        this.socket = io(this.config.serverUrl!, {
          path: this.config.path,
          transports: this.config.transports,
          timeout: this.config.timeout,
          reconnection: this.config.reconnection,
          reconnectionDelay: this.config.reconnectionDelay,
          reconnectionAttempts: this.config.reconnectionAttempts,
        });

        this.socket.on('connect', () => {
          console.log('Connected to WebSocket server');
          this.emit('connected');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('WebSocket connection error:', error);
          this.emit('error', error);
          reject(error);
        });

        this.socket.on('disconnect', () => {
          console.log('Disconnected from WebSocket server');
          this.emit('disconnected');
        });

        // Set up default event handlers
        this.setupDefaultHandlers();

      } catch (error) {
        reject(error);
      }
    });
  }

  // Disconnect from WebSocket server
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Subscribe to alerts
  subscribeAlerts(subscription: SubscriptionEvent): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('subscribe_alerts', subscription);
    } else {
      throw new Error('Not connected to WebSocket server');
    }
  }

  // Unsubscribe from alerts
  unsubscribeAlerts(userId: string): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('unsubscribe_alerts', userId);
    }
  }

  // Update alert regions
  updateAlertRegions(userId: string, regions: string[]): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('update_alert_regions', { userId, regions });
    }
  }

  // Send a message
  sendMessage(message: { text: string; senderId: string }): void {
    if (this.socket && this.socket.connected) {
      this.socket.emit('message', message);
    } else {
      throw new Error('Not connected to WebSocket server');
    }
  }

  // Check connection status
  isConnected(): boolean {
    return this.socket ? this.socket.connected : false;
  }

  // Get socket ID
  getSocketId(): string | null {
    return this.socket ? this.socket.id : null;
  }

  // Add event listener
  on(event: string, handler: (...args: any[]) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  // Remove event listener
  off(event: string, handler: (...args: any[]) => void): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // Emit event to local handlers
  private emit(event: string, ...args: any[]): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(...args);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }

  // Set up default event handlers
  private setupDefaultHandlers(): void {
    if (!this.socket) return;

    // Alert events
    this.socket.on('new_alert', (alert: AlertEvent) => {
      this.emit('new_alert', alert);
    });

    this.socket.on('subscription_confirmed', (data: any) => {
      this.emit('subscription_confirmed', data);
    });

    this.socket.on('unsubscription_confirmed', (data: any) => {
      this.emit('unsubscription_confirmed', data);
    });

    this.socket.on('regions_updated', (data: any) => {
      this.emit('regions_updated', data);
    });

    // General message events
    this.socket.on('message', (msg: MessageEvent) => {
      this.emit('message', msg);
    });
  }

  // Get connection statistics
  getStats() {
    if (!this.socket) return null;

    return {
      connected: this.socket.connected,
      id: this.socket.id,
      transport: this.socket.io.engine.transport.name,
      reconnecting: this.socket.io.engine.reconnecting,
      reconnectionAttempts: this.socket.io.engine.reconnectionAttempts,
    };
  }
}

// Export a singleton instance
export const socketClient = new SocketClient();

// Export utility functions
export const createSocketClient = (config?: SocketConfig) => new SocketClient(config);

export const connectToSocket = async (config?: SocketConfig) => {
  const client = createSocketClient(config);
  await client.connect();
  return client;
};
