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

const DEMO_NOTIFICATIONS: Omit<AppNotification, 'id' | 'time' | 'read'>[] = [
    { title: '💧 Moisture Alert', body: 'Soil moisture at 62% — below optimal. Consider irrigation.', icon: '💧', url: '/' },
    { title: '📈 Price Update', body: 'Wheat prices up 4.2% in your region today.', icon: '📈', url: '/prices' },
    { title: '🌧️ Rain Forecast', body: 'Rain expected Thursday — skip irrigation on Wed.', icon: '🌧️', url: '/weather' },
    { title: '🤖 AI Advisor', body: 'New recommendations ready based on your sensor data.', icon: '🤖', url: '/advisor' },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);
    const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!('Notification' in window)) {
            setPermission('unsupported');
        } else {
            setPermission(Notification.permission);
        }

        // Load persisted notifications
        const saved = localStorage.getItem('agrisense_notifications');
        if (saved) {
            const parsed = JSON.parse(saved).map((n: any) => ({ ...n, time: new Date(n.time) }));
            setNotifications(parsed);
        } else {
            // Seed demo notifications on first load
            const demo = DEMO_NOTIFICATIONS.map((n, i) => ({
                ...n,
                id: `demo-${i}`,
                time: new Date(Date.now() - i * 3600000),
                read: false,
            }));
            setNotifications(demo);
            localStorage.setItem('agrisense_notifications', JSON.stringify(demo));
        }
    }, []);

    const persist = (updated: AppNotification[]) => {
        localStorage.setItem('agrisense_notifications', JSON.stringify(updated));
    };

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
            return updated;
        });

        // Also fire native notification if permitted
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(n.title, { body: n.body, icon: '/icon-192.svg', badge: '/icon-192.svg' });
        }
    }, []);

    const requestPermission = async () => {
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
    };

    const markAllRead = useCallback(() => {
        setNotifications((prev) => {
            const updated = prev.map((n) => ({ ...n, read: true }));
            persist(updated);
            return updated;
        });
    }, []);

    const clearAll = useCallback(() => {
        setNotifications([]);
        localStorage.removeItem('agrisense_notifications');
    }, []);

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, permission, requestPermission, addNotification, markAllRead, clearAll }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
};
