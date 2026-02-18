"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, CheckCircle2 } from 'lucide-react';
import { notificationService } from '@/lib/notifications';

export function NotificationSettings() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if ('Notification' in window) {
            setPermission(Notification.permission);
            setIsEnabled(Notification.permission === 'granted');
        }
    }, []);

    const handleEnableNotifications = async () => {
        setIsLoading(true);
        try {
            const result = await notificationService.requestPermission();
            setPermission(result);
            setIsEnabled(result === 'granted');

            if (result === 'granted') {
                // Initialize service worker and subscribe
                await notificationService.init();

                // Show welcome notification
                await notificationService.showNotification('Notifications Enabled! 🎉', {
                    body: 'You will now receive important updates from AgriSense AI',
                });
            }
        } catch (error) {
            console.error('Failed to enable notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const testNotification = async () => {
        await notificationService.notifyPriceAlert('Wheat', 2350, '+5.2%');
    };

    return (
        <Card className="border-none shadow-sm">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            {isEnabled ? <Bell className="w-5 h-5 text-primary" /> : <BellOff className="w-5 h-5 text-muted-foreground" />}
                            Notifications
                        </CardTitle>
                        <CardDescription>Get alerts for prices, weather, and sensors</CardDescription>
                    </div>
                    {isEnabled && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Active
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {!isEnabled ? (
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Enable notifications to receive real-time updates about:
                        </p>
                        <ul className="text-sm space-y-2 text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <span className="text-primary">•</span>
                                Price changes in your local market
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-primary">•</span>
                                Weather alerts and warnings
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-primary">•</span>
                                Sensor readings and anomalies
                            </li>
                            <li className="flex items-center gap-2">
                                <span className="text-primary">•</span>
                                AI-powered crop recommendations
                            </li>
                        </ul>
                        <Button
                            onClick={handleEnableNotifications}
                            disabled={isLoading || permission === 'denied'}
                            className="w-full"
                        >
                            {isLoading ? 'Enabling...' : permission === 'denied' ? 'Blocked by Browser' : 'Enable Notifications'}
                        </Button>
                        {permission === 'denied' && (
                            <p className="text-xs text-red-600 text-center">
                                Please enable notifications in your browser settings
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">Price Alerts</span>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">Weather Alerts</span>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">Sensor Alerts</span>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <span className="text-sm font-medium">AI Recommendations</span>
                            <Switch defaultChecked />
                        </div>
                        <Button
                            onClick={testNotification}
                            variant="outline"
                            className="w-full"
                        >
                            Test Notification
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
