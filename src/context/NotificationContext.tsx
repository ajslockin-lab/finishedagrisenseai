"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface AppNotification {
    id: string;
    title: string;
    body: string;
    icon: string;
    time: Date;
    read: boolean;
    url?: string;
}

interface NotificationContextType {
    notifications: AppNotification[];
    unreadCount: number;
    permission: NotificationPermission | 'unsupported';
    requestPermission: () => Promise<void>;
    addNotification: (n: Omit<AppNotification, 'id' | 'time' | 'read'>) => void;
    markAllRead: () => void;
    clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const STORAGE_KEY = 'agrisense_notifications';
// Separate flag so clearAll doesn't re-seed on next reload
const CLEARED_FLAG_KEY = 'agrisense_notifications_cleared';

const DEMO_NOTIFICATIONS: Omit<AppNotification, 'id' | 'time' | 'read'>[] = [
    { title: '💧 Moisture Alert', body: 'Soil moisture at 62% — below optimal. Consider irrigation.', icon: '💧', url: '/' },
    { title: '📈 Price Update', body: 'Wheat prices up 4.2% in your region today.', icon: '📈', url: '/prices' },
    { title: '🌧️ Rain Forecast', body: 'Rain expected Thursday — skip irrigation on Wed.', icon: '🌧️', url: '/weather' },
    { title: '🤖 AI Advisor', body: 'New recommendations ready based on your sensor data.', icon: '🤖', url: '/advisor' },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Set permission state
        if (!('Notification' in window)) {
            setPermission('unsupported');
        } else {
            setPermission(Notification.permission);
        }

        const saved = localStorage.getItem(STORAGE_KEY);
        const wasCleared = localStorage.getItem(CLEARED_FLAG_KEY) === 'true';

        if (saved) {
            try {
                const parsed = JSON.parse(saved).map((n: any) => ({ ...n, time: new Date(n.time) }));
                setNotifications(parsed);
            } catch {
                setNotifications([]);
            }
        } else if (!wasCleared) {
            // Only seed demos on first-ever load, not after user cleared them
            const demo = DEMO_NOTIFICATIONS.map((n, i) => ({
                ...n,
                id: `demo-${i}`,
                time: new Date(Date.now() - i * 3600000),
                read: false,
            }));
            setNotifications(demo);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
        }

        setInitialized(true);
    }, []);

    const persist = useCallback((updated: AppNotification[]) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }, []);

    const addNotification = useCallback((n: Omit<AppNotification, 'id' | 'time' | 'read'>) => {
        const newNotif: AppNotification = {
            ...n,
            id: Date.now().toString(),
            time: new Date(),
            read: false,
        };

        setNotifications((prev) => {
            const updated = [newNotif, ...prev].slice(0, 20);
            persist(updated);
            // Clear the "was cleared" flag since we have real notifications now
            localStorage.removeItem(CLEARED_FLAG_KEY);
            return updated;
        });

        // Fire native browser/PWA notification if permission granted
        if (
            typeof window !== 'undefined' &&
            'Notification' in window &&
            Notification.permission === 'granted'
        ) {
            try {
                new Notification(n.title, {
                    body: n.body,
                    icon: '/icon-192.svg',
                    badge: '/icon-192.svg',
                });
            } catch {
                // Native notification failed silently — in-app still shows
            }
        }
    }, [persist]);

    const requestPermission = useCallback(async () => {
        if (typeof window === 'undefined' || !('Notification' in window)) return;
        const result = await Notification.requestPermission();
        setPermission(result);
        if (result === 'granted') {
            addNotification({
                title: '🔔 Notifications Enabled',
                body: 'You will now receive farm alerts and price updates.',
                icon: '🔔',
            });
        }
    }, [addNotification]);

    const markAllRead = useCallback(() => {
        setNotifications((prev) => {
            const updated = prev.map((n) => ({ ...n, read: true }));
            persist(updated);
            return updated;
        });
    }, [persist]);

    const clearAll = useCallback(() => {
        setNotifications([]);
        localStorage.removeItem(STORAGE_KEY);
        // Set flag so demo notifications don't re-seed on next reload
        localStorage.setItem(CLEARED_FLAG_KEY, 'true');
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            permission,
            requestPermission,
            addNotification,
            markAllRead,
            clearAll,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
};
