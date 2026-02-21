import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import { SensorProvider } from '@/context/SensorContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { NotificationProvider } from '@/context/NotificationContext';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'AgriSense AI',
  description: 'Precision agricultural technology for small farmers in India.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AgriSense AI',
  },
  themeColor: '#1B4D2E',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#1B4D2E" />
        <link
          rel="icon"
          href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%231B4D2E'/%3E%3Cpath d='M46 14C28 16 16 28 13 42c11-5 20-14 25-26-4 14-13 25-25 33' stroke='%23F0E68C' stroke-width='4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground pb-20" suppressHydrationWarning>
        <ThemeProvider>
          <SensorProvider>
            <NotificationProvider>
              <div className="max-w-md mx-auto min-h-screen shadow-2xl bg-background relative flex flex-col border-x border-border/40">
                <Header />
                <main className="flex-1 px-4 py-4 space-y-6 overflow-x-hidden">
                  {children}
                </main>
                <Navigation />
              </div>
              <Toaster />
            </NotificationProvider>
          </SensorProvider>
        </ThemeProvider>

        {/* Register Service Worker */}
        <Script id="sw-register" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('[SW] Registered:', reg.scope))
                .catch(err => console.warn('[SW] Registration failed:', err));
            });
          }
        `}</Script>
      </body>
    </html>
  );
}
