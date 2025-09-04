'use client';

import React, { useState, useEffect } from 'react';
import { useAlerts, Alert, AlertSubscription } from '@/hooks/use-alerts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Wifi, WifiOff, Bell, BellOff, MapPin, Clock, AlertTriangle } from 'lucide-react';

interface RealTimeAlertsProps {
  userId?: string;
  userRegions?: string[];
}

const severityColors = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  CRITICAL: 'bg-red-100 text-red-800'
};

const alertTypeIcons = {
  WEATHER: '🌤️',
  ENVIRONMENTAL: '🌍',
  FLOOD: '🌊',
  SEISMIC: '🌋',
  UTILITY: '⚡',
  SECURITY: '🔒',
  HEALTH: '🏥'
};

export const RealTimeAlerts: React.FC<RealTimeAlertsProps> = ({ 
  userId = 'demo-user', 
  userRegions = ['California', 'Nevada'] 
}) => {
  const [selectedRegions, setSelectedRegions] = useState<string[]>(userRegions);
  const [selectedAlertTypes, setSelectedAlertTypes] = useState<string[]>([
    'WEATHER', 'ENVIRONMENTAL', 'FLOOD', 'SEISMIC', 'UTILITY', 'SECURITY', 'HEALTH'
  ]);

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
    userId,
    regions: selectedRegions,
    alertTypes: selectedAlertTypes,
    autoConnect: true
  });

  // Handle region updates
  const handleRegionUpdate = (newRegions: string[]) => {
    setSelectedRegions(newRegions);
    if (isConnected && userId) {
      updateRegions(userId, newRegions);
    }
  };

  // Handle alert type updates
  const handleAlertTypeUpdate = (newTypes: string[]) => {
    setSelectedAlertTypes(newTypes);
    if (isConnected && userId) {
      // Re-subscribe with new alert types
      subscribe({
        userId,
        regions: selectedRegions,
        alertTypes: newTypes
      });
    }
  };

  // Format timestamp
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  // Get severity color class
  const getSeverityColor = (severity: string) => {
    return severityColors[severity as keyof typeof severityColors] || 'bg-gray-100 text-gray-800';
  };

  // Get alert type icon
  const getAlertTypeIcon = (type: string) => {
    return alertTypeIcons[type as keyof typeof alertTypeIcons] || '📢';
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            Real-Time Alert System
          </CardTitle>
          <CardDescription>
            {isConnected 
              ? 'Connected to WebSocket server - receiving real-time alerts' 
              : 'Disconnected from WebSocket server'
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Connection Controls */}
          <div className="flex gap-2">
            <Button
              onClick={connect}
              disabled={isLoading || isConnected}
              variant="outline"
              size="sm"
            >
              {isLoading ? 'Connecting...' : 'Connect'}
            </Button>
            <Button
              onClick={disconnect}
              disabled={!isConnected}
              variant="outline"
              size="sm"
            >
              Disconnect
            </Button>
            <Button
              onClick={clearAlerts}
              disabled={alerts.length === 0}
              variant="outline"
              size="sm"
            >
              Clear Alerts
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Regions */}
            <div className="space-y-2">
              <Label htmlFor="regions">Alert Regions</Label>
              <Input
                id="regions"
                placeholder="Enter regions (comma-separated)"
                value={selectedRegions.join(', ')}
                onChange={(e) => {
                  const regions = e.target.value.split(',').map(r => r.trim()).filter(Boolean);
                  handleRegionUpdate(regions);
                }}
              />
            </div>

            {/* Alert Types */}
            <div className="space-y-2">
              <Label>Alert Types</Label>
              <Select
                value={selectedAlertTypes.join(',')}
                onValueChange={(value) => {
                  const types = value.split(',').filter(Boolean);
                  handleAlertTypeUpdate(types);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select alert types" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(alertTypeIcons).map((type) => (
                    <SelectItem key={type} value={type}>
                      {alertTypeIcons[type as keyof typeof alertTypeIcons]} {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Live Alerts ({alerts.length})
          </CardTitle>
          <CardDescription>
            Real-time emergency alerts for your selected regions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BellOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No alerts received yet</p>
              <p className="text-sm">Alerts will appear here in real-time</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getAlertTypeIcon(alert.type)}
                      </span>
                      <div>
                        <h3 className="font-semibold text-lg">{alert.title}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {alert.region}
                          <Clock className="h-4 w-4 ml-2" />
                          {formatTime(alert.issuedAt)}
                        </div>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>

                  <p className="text-gray-700 mb-3">{alert.description}</p>

                  {alert.actions && (
                    <div className="mb-3">
                      <Label className="text-sm font-medium text-gray-700">Recommended Actions:</Label>
                      <p className="text-sm text-gray-600 mt-1">{alert.actions}</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Type: {alert.type}</span>
                    {alert.source && <span>Source: {alert.source}</span>}
                    {alert.contact && <span>Contact: {alert.contact}</span>}
                  </div>

                  <Separator className="mt-3" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connection Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Connection Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Status:</span>
              <span className={`ml-2 ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <div>
              <span className="font-medium">User ID:</span>
              <span className="ml-2 font-mono">{userId}</span>
            </div>
            <div>
              <span className="font-medium">Regions:</span>
              <span className="ml-2">{selectedRegions.join(', ') || 'None'}</span>
            </div>
            <div>
              <span className="font-medium">Alert Types:</span>
              <span className="ml-2">{selectedAlertTypes.join(', ')}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
