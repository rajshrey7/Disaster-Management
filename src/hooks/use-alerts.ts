import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Alert {
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

export interface AlertSubscription {
  userId: string;
  regions: string[];
  alertTypes: string[];
}

interface UseAlertsOptions {
  userId?: string;
  regions?: string[];
  alertTypes?: string[];
  autoConnect?: boolean;
  serverUrl?: string;
}

interface UseAlertsReturn {
  alerts: Alert[];
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  connect: () => void;
  disconnect: () => void;
  subscribe: (subscription: AlertSubscription) => void;
  unsubscribe: (userId: string) => void;
  updateRegions: (userId: string, regions: string[]) => void;
  clearAlerts: () => void;
}

export const useAlerts = (options: UseAlertsOptions = {}): UseAlertsReturn => {
  const {
    userId,
    regions = [],
    alertTypes = ['WEATHER', 'ENVIRONMENTAL', 'FLOOD', 'SEISMIC', 'UTILITY', 'SECURITY', 'HEALTH'],
    autoConnect = true,
    serverUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'
  } = options;

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize socket connection
  const initializeSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    try {
      socketRef.current = io(serverUrl, {
        path: '/api/socketio',
        transports: ['websocket', 'polling'],
        timeout: 20000,
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });

      // Connection events
      socketRef.current.on('connect', () => {
        console.log('Connected to WebSocket server');
        setIsConnected(true);
        setError(null);
        setIsLoading(false);
      });

      socketRef.current.on('disconnect', () => {
        console.log('Disconnected from WebSocket server');
        setIsConnected(false);
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('WebSocket connection error:', err);
        setError(`Connection failed: ${err.message}`);
        setIsLoading(false);
      });

      // Alert events
      socketRef.current.on('new_alert', (alert: Alert) => {
        console.log('Received new alert:', alert);
        setAlerts(prev => [alert, ...prev]);
      });

      socketRef.current.on('subscription_confirmed', (data) => {
        console.log('Alert subscription confirmed:', data);
      });

      socketRef.current.on('unsubscription_confirmed', (data) => {
        console.log('Alert unsubscription confirmed:', data);
      });

      socketRef.current.on('regions_updated', (data) => {
        console.log('Alert regions updated:', data);
      });

      // General message events
      socketRef.current.on('message', (msg) => {
        console.log('Received message:', msg);
      });

    } catch (err) {
      console.error('Failed to initialize WebSocket:', err);
      setError(`Failed to initialize: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  }, [serverUrl]);

  // Connect to WebSocket server
  const connect = useCallback(() => {
    if (!socketRef.current || !socketRef.current.connected) {
      setIsLoading(true);
      setError(null);
      initializeSocket();
    }
  }, [initializeSocket]);

  // Disconnect from WebSocket server
  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setIsConnected(false);
    setIsLoading(false);
  }, []);

  // Subscribe to alerts
  const subscribe = useCallback((subscription: AlertSubscription) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('subscribe_alerts', subscription);
    } else {
      setError('Not connected to WebSocket server');
    }
  }, []);

  // Unsubscribe from alerts
  const unsubscribe = useCallback((userId: string) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('unsubscribe_alerts', userId);
    }
  }, []);

  // Update alert regions
  const updateRegions = useCallback((userId: string, regions: string[]) => {
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('update_alert_regions', { userId, regions });
    }
  }, []);

  // Clear all alerts
  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  // Auto-connect and subscribe when component mounts
  useEffect(() => {
    if (autoConnect && userId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [autoConnect, userId, connect, disconnect]);

  // Auto-subscribe when connected and user data is available
  useEffect(() => {
    if (isConnected && userId && regions.length > 0) {
      subscribe({
        userId,
        regions,
        alertTypes
      });
    }
  }, [isConnected, userId, regions, alertTypes, subscribe]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
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
  };
};
