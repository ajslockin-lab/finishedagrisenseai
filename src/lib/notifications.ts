// Notification utility for AgriSense AI
export class NotificationService {
    private static instance: NotificationService;
    private registration: ServiceWorkerRegistration | null = null;

    private constructor() { }

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    // Initialize service worker
    async init() {
        if ('serviceWorker' in navigator) {
            try {
                this.registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                });
                console.log('Service Worker registered successfully');
                return this.registration;
            } catch (error) {
                console.error('Service Worker registration failed:', error);
                return null;
            }
        }
        return null;
    }

    // Request notification permission
    async requestPermission(): Promise<NotificationPermission> {
        if (!('Notification' in window)) {
            console.warn('This browser does not support notifications');
            return 'denied';
        }

        if (Notification.permission === 'granted') {
            return 'granted';
        }

        if (Notification.permission !== 'denied') {
            const permission = await Notification.requestPermission();
            return permission;
        }

        return Notification.permission;
    }

    // Show local notification
    async showNotification(title: string, options?: NotificationOptions) {
        const permission = await this.requestPermission();

        if (permission !== 'granted') {
            console.warn('Notification permission not granted');
            return;
        }

        const defaultOptions = {
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-96x96.png',
            vibrate: [200, 100, 200],
            tag: 'agrisense',
            requireInteraction: false,
            ...options,
        } as any;

        if (this.registration) {
            await this.registration.showNotification(title, defaultOptions);
        } else {
            new Notification(title, defaultOptions);
        }
    }

    // Subscribe to push notifications (requires backend setup)
    async subscribeToPush() {
        if (!this.registration) {
            await this.init();
        }

        if (!this.registration) {
            console.error('Service Worker not registered');
            return null;
        }

        const permission = await this.requestPermission();
        if (permission !== 'granted') {
            return null;
        }

        try {
            // You'll need to replace this with your actual VAPID public key
            const subscription = await this.registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.urlBase64ToUint8Array(
                    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || ''
                ) as any,
            });

            console.log('Push subscription successful:', subscription);
            return subscription;
        } catch (error) {
            console.error('Failed to subscribe to push notifications:', error);
            return null;
        }
    }

    // Convert VAPID key
    private urlBase64ToUint8Array(base64String: string): Uint8Array {
        const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    // Predefined notification types for AgriSense
    async notifyPriceAlert(cropName: string, price: number, change: string) {
        await this.showNotification('Price Alert! 📈', {
            body: `${cropName} price changed ${change} to ₹${price.toLocaleString('en-IN')}`,
            data: { url: '/prices', type: 'price-alert' },
            actions: [
                { action: 'view', title: 'View Market' },
                { action: 'dismiss', title: 'Dismiss' }
            ],
        } as any);
    }

    async notifyWeatherAlert(message: string) {
        await this.showNotification('Weather Alert ⛈️', {
            body: message,
            data: { url: '/weather', type: 'weather-alert' },
            requireInteraction: true,
        });
    }

    async notifySensorAlert(sensorName: string, reading: string) {
        await this.showNotification('Sensor Alert 🌡️', {
            body: `${sensorName}: ${reading}`,
            data: { url: '/sensors', type: 'sensor-alert' },
        });
    }

    async notifyAIRecommendation(message: string) {
        await this.showNotification('AI Recommendation 🤖', {
            body: message,
            data: { url: '/advisor', type: 'ai-recommendation' },
        });
    }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
