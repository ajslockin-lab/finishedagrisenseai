import type { Metadata } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import { SensorProvider } from '@/context/SensorContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt';

export const metadata: Metadata = {
  title: 'AgriSense AI',
  description: 'Precision agricultural technology for small farmers in India.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'AgriSense',
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: 'AgriSense AI',
    title: 'AgriSense AI India',
    description: 'Smart farming assistant for Indian farmers',
  },
  twitter: {
    card: 'summary',
    title: 'AgriSense AI India',
    description: 'Smart farming assistant for Indian farmers',
  },
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
        <link rel="icon" href="/logo.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f8fcf9" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#060f08" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AgriSense" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, viewport-fit=cover" />
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{var t=localStorage.getItem('agrisense_theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
            }}
          />
        </head>
        <body className="font-body antialiased bg-background text-foreground pb-20" suppressHydrationWarning>
        <ThemeProvider>
          <SensorProvider>
            <div className="max-w-md mx-auto min-h-screen shadow-2xl bg-background relative flex flex-col border-x border-border/40">
              <Header />
              <main className="flex-1 px-4 py-4 space-y-6 overflow-x-hidden">
                {children}
              </main>
              <Navigation />
            </div>
            <Toaster />
            <PWAInstallPrompt />
          </SensorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
