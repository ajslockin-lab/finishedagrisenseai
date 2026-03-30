"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Activity, 
  MessageSquare, 
  GlassWater, 
  BookText, 
  Settings,
  ScanQrCode
} from 'lucide-react';

export function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Vision', href: '/diagnosis', icon: ScanQrCode },
    { label: 'Sensors', href: '/sensors', icon: Activity },
    { label: 'Advisor', href: '/advisor', icon: MessageSquare },
    { label: 'Forecast', href: '/weather', icon: GlassWater },
    { label: 'Journal', href: '/journal', icon: BookText },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 w-full h-[84px] bg-surface border-t border-white/10 flex justify-center z-50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center w-full max-w-lg px-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center min-w-[54px] h-full gap-1.5 transition-all active:scale-90",
                isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "w-10 h-6 flex items-center justify-center rounded-full transition-all duration-300",
                isActive ? "bg-accent/15" : ""
              )}>
                <item.icon 
                  className={cn(
                    "w-5 h-5 transition-all duration-300", 
                    isActive ? "stroke-[2.5px]" : "stroke-[1.5px]"
                  )} 
                />
              </div>
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-[0.1em] transition-all duration-300",
                isActive ? "opacity-100" : "opacity-40"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}