'use client';

import { useEffect, useState } from 'react';

export interface ExtendedNotificationOptions extends NotificationOptions {
  vibrate?: number[];
}

export function usePWANotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      console.warn('Notifications are not supported in this browser');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!isSupported) {
      console.warn('Notifications are not supported');
      return null;
    }

    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    try {
      const notification = new Notification(title, {
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-96x96.png',
        ...options,
      });

      return notification;
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  };

  // Specific notification types for AgriSense

  const sendPriceAlert = (crop: string, price: number, change: number) => {
    const direction = change > 0 ? '↑' : '↓';
    const emoji = change > 0 ? '📈' : '📉';

    return sendNotification(`${emoji} ${crop} Price Update`, {
      body: `₹${price}/quintal (${direction} ${Math.abs(change).toFixed(1)}%)`,
      tag: 'price-alert',
      requireInteraction: false,
      vibrate: [200, 100, 200],
      data: { type: 'price', crop, price, change },
    } as ExtendedNotificationOptions);
  };

  const sendWeatherAlert = (message: string, severity: 'info' | 'warning' | 'severe') => {
    const emoji = severity === 'severe' ? '⚠️' : severity === 'warning' ? '🌤️' : '☁️';

    return sendNotification(`${emoji} Weather Alert`, {
      body: message,
      tag: 'weather-alert',
      requireInteraction: severity === 'severe',
      vibrate: severity === 'severe' ? [300, 100, 300, 100, 300] : [200, 100, 200],
      data: { type: 'weather', severity },
    } as ExtendedNotificationOptions);
  };

  const sendSensorAlert = (sensorName: string, value: number, threshold: number) => {
    return sendNotification(`⚡ Sensor Alert: ${sensorName}`, {
      body: `Current: ${value} (Threshold: ${threshold})`,
      tag: 'sensor-alert',
      requireInteraction: true,
      vibrate: [300, 100, 300],
      data: { type: 'sensor', sensorName, value, threshold },
    } as ExtendedNotificationOptions);
  };

  const sendAdvisorTip = (tip: string) => {
    return sendNotification('💡 New Farming Tip', {
      body: tip.slice(0, 100) + (tip.length > 100 ? '...' : ''),
      tag: 'advisor-tip',
      requireInteraction: false,
      data: { type: 'advisor', tip },
    });
  };

  return {
    isSupported,
    permission,
    requestPermission,
    sendNotification,
    // Specific notification helpers
    sendPriceAlert,
    sendWeatherAlert,
    sendSensorAlert,
    sendAdvisorTip,
  };
}

// Example usage component (can be added to any page)
export function NotificationExample() {
  const {
    isSupported,
    permission,
    requestPermission,
    sendPriceAlert,
    sendWeatherAlert,
  } = usePWANotifications();

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      console.log('Notifications enabled!');
      // Send a welcome notification
      sendWeatherAlert('Notifications enabled! You will now receive price and weather alerts.', 'info');
    }
  };

  const handleTestPriceAlert = () => {
    sendPriceAlert('Rice', 2500, 5.2);
  };

  const handleTestWeatherAlert = () => {
    sendWeatherAlert('Heavy rain expected tomorrow. Protect your crops!', 'warning');
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm">Notifications</span>
        <span className="text-xs px-2 py-1 rounded-full bg-muted">
          {permission === 'granted' ? '✓ Enabled' :
            permission === 'denied' ? '✗ Blocked' :
              'Not set'}
        </span>
      </div>

      {permission === 'default' && (
        <button
          onClick={handleRequestPermission}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          Enable Notifications
        </button>
      )}

      {permission === 'granted' && (
        <div className="space-y-2">
          <button
            onClick={handleTestPriceAlert}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Test Price Alert
          </button>
          <button
            onClick={handleTestWeatherAlert}
            className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
          >
            Test Weather Alert
          </button>
        </div>
      )}

      {permission === 'denied' && (
        <p className="text-xs text-muted-foreground">
          Notifications blocked. Enable them in your browser settings.
        </p>
      )}
    </div>
  );
}
