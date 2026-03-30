"use client";

import { Bell, MapPin, Leaf, User } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export function Header() {
  const { settings, t } = useSensors();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between px-4 md:px-8 h-16 max-w-6xl mx-auto">
        {/* Left: Logo + farm */}
        <div className="flex items-center gap-3">
          {/* Logo visible on mobile only (sidebar has it on desktop) */}
          <div className="md:hidden w-8 h-8 rounded-lg bg-primary/15 border border-primary/25 flex items-center justify-center">
            <Leaf className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h1 className="font-display text-base md:text-lg font-bold tracking-tight text-foreground">
              {t('header_title')}
            </h1>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
              <MapPin className="w-3 h-3 text-primary" />
              <span className="font-mono text-[10px]">{settings.cropType} · {settings.location.split(',')[0]}</span>
            </div>
          </div>
        </div>

        {/* Right: notification + avatar */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button className="relative p-2.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-colors">
            <Bell className="w-5 h-5" strokeWidth={1.8} />
            {/* Badge */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full animate-live-dot" />
          </button>

          {/* User avatar */}
          <Link
            href="/settings"
            className="w-9 h-9 rounded-xl bg-muted/60 border border-border hover:border-primary/30 flex items-center justify-center transition-colors"
          >
            <User className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
          </Link>
        </div>
      </div>
      {/* Gold accent line */}
      <div className="gold-line" />
    </header>
  );
}
