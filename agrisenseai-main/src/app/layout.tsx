import type {Metadata} from 'next';
import { Inter } from "next/font/google";
import './globals.css';
import {Navigation} from '@/components/Navigation';
import {Toaster} from '@/components/ui/toaster';
import {SensorProvider} from '@/context/SensorContext';
import {ThemeProvider} from '@/context/ThemeContext';

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AgriSense AI',
  description: 'Precision agricultural technology for small farmers in India.',
  manifest: "/manifest.json",
  themeColor: "#0E100F",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AgriSense AI"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased text-foreground pb-[70px] bg-background`} suppressHydrationWarning>
        {/* Subtle global grain texture for tactile feel */}
        <div className="fixed inset-0 z-[-1] pointer-events-none opacity-[0.015]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}></div>
        <ThemeProvider>
          <SensorProvider>
            <div className="max-w-md mx-auto min-h-screen shadow-2xl relative flex flex-col border-x border-white/5">
              <main className="flex-1 overflow-x-hidden relative min-h-screen">
                {children}
              </main>
              <Navigation />
            </div>
            <Toaster />
          </SensorProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
