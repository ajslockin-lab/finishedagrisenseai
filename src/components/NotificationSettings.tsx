"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, CheckCircle2 } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

const PREFS_KEY = 'agrisense_notif_prefs';

const DEFAULT_PREFS = {
    priceAlerts: true,
    weatherAlerts: true,
    sensorAlerts: true,
    aiRecommendations: true,
};

export function NotificationSettings() {
    const { permission, requestPermission, addNotification } = useNotifications();
    const [isLoading, setIsLoading] = useState(false);
    const [prefs, setPrefs] = useState(DEFAULT_PREFS);

    const isEnabled = permission === 'granted';

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = localStorage.getItem(PREFS_KEY);
        if (saved) {
            try { setPrefs({ ...DEFAULT_PREFS, ...JSON.parse(saved) }); } catch { /* ignore */ }
        }
    }, []);

    const updatePref = (key: keyof typeof DEFAULT_PREFS, value: boolean) => {
        const updated = { ...prefs, [key]: value };
        setPrefs(updated);
        localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
    };

    const handleEnableNotifications = async () => {
        setIsLoading(true);
        try {
            await requestPermission();
        } catch (error) {
            console.error('Failed to enable notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const testNotification = () => {
        addNotification({
            title: '📈 Price Alert: Wheat',
            body: 'Wheat price up 5.2% to ₹2,350/quintal in your market.',
            icon: '📈',
            url: '/prices',
        });
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
                            {['Price changes in your local market', 'Weather alerts and warnings', 'Sensor readings and anomalies', 'AI-powered crop recommendations'].map((item) => (
                                <li key={item} className="flex items-center gap-2">
                                    <span className="text-primary">•</span> {item}
                                </li>
                            ))}
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
                        {([
                            { key: 'priceAlerts', label: 'Price Alerts' },
                            { key: 'weatherAlerts', label: 'Weather Alerts' },
                            { key: 'sensorAlerts', label: 'Sensor Alerts' },
                            { key: 'aiRecommendations', label: 'AI Recommendations' },
                        ] as { key: keyof typeof DEFAULT_PREFS; label: string }[]).map(({ key, label }) => (
                            <div key={key} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                <span className="text-sm font-medium">{label}</span>
                                <Switch
                                    checked={prefs[key]}
                                    onCheckedChange={(val) => updatePref(key, val)}
                                />
                            </div>
                        ))}
                        <Button onClick={testNotification} variant="outline" className="w-full">
                            Send Test Notification
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
