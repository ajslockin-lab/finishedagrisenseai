"use client";

import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Cloud, FileText, Landmark, Settings, ChevronRight, Crown, Plane, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import { useSensors } from '@/context/SensorContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function MoreHub() {
  const { t } = useSensors();
  const { toast } = useToast();

  const services = [
    {
      title: "Subscription Plans",
      desc: 'Manage Your Plan',
      icon: Crown,
      href: '/subscription',
      color: 'bg-yellow-500',
      iconColor: 'text-yellow-500'
    },
    {
      title: "Drone Services",
      desc: 'Aerial Intelligence',
      icon: Plane,
      href: '/drone',
      color: 'bg-blue-600',
      iconColor: 'text-blue-600'
    },
    {
      title: "Education Hub",
      desc: 'Learn Smart Farming',
      icon: GraduationCap,
      href: '/education',
      color: 'bg-indigo-500',
      iconColor: 'text-indigo-500'
    },
    {
      title: t('more_doctor'),
      desc: 'AI Disease Diagnosis',
      icon: ShieldCheck,
      href: '/diagnosis',
      color: 'bg-green-500',
      iconColor: 'text-green-500'
    },
    {
      title: t('more_weather'),
      desc: '7-Day Farm Forecast',
      icon: Cloud,
      href: '/weather',
      color: 'bg-blue-500',
      iconColor: 'text-blue-500'
    },
    {
      title: t('more_journal'),
      desc: 'Field Observations',
      icon: FileText,
      href: '/journal',
      color: 'bg-orange-500',
      iconColor: 'text-orange-500'
    },
    {
      title: t('more_schemes'),
      desc: 'Govt. Subsidies',
      icon: Landmark,
      href: '/schemes',
      color: 'bg-purple-500',
      iconColor: 'text-purple-500'
    },
    {
      title: t('settings_title'),
      desc: 'Profile & App Options',
      icon: Settings,
      href: '/settings',
      color: 'bg-gray-500',
      iconColor: 'text-gray-500'
    },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-2">
        <h2 className="text-2xl font-black text-primary">{t('more_title')}</h2>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Utility & Extension Services</p>
      </div>

      <div className="grid gap-4">
        {services.map((service, i) => (
          <Link href={service.href} key={i}>
            <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.98] bg-card/40 backdrop-blur-md rounded-[1.5rem] overflow-hidden group border border-white/10">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={cn("p-3 rounded-2xl", service.iconColor, "bg-white/10")}>
                  <service.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground">{service.title}</h3>
                  <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{service.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <section className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10">
        <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-3">Resources</h3>
        <ul className="space-y-4">
          <li
            onClick={() => toast({ title: "Market Holidays", description: "All APMC markets are closed this Sunday.", duration: 3000 })}
            className="flex items-center justify-between text-xs font-bold text-muted-foreground cursor-pointer active:scale-95 transition-transform"
          >
            <span>Market Holidays</span>
            <span className="text-primary bg-primary/10 px-3 py-1 rounded-full">View</span>
          </li>
          <li
            onClick={() => window.open('tel:1551')}
            className="flex items-center justify-between text-xs font-bold text-muted-foreground cursor-pointer active:scale-95 transition-transform"
          >
            <span>Kisan Call Center</span>
            <span className="text-primary bg-primary/10 px-3 py-1 rounded-full">Call 1551</span>
          </li>
          <li
            onClick={() => toast({ title: "App Manual", description: "Downloading offline manual PDF...", duration: 2000 })}
            className="flex items-center justify-between text-xs font-bold text-muted-foreground cursor-pointer active:scale-95 transition-transform"
          >
            <span>App Manual</span>
            <span className="text-primary bg-primary/10 px-3 py-1 rounded-full">Read</span>
          </li>
        </ul>
      </section>
    </div>
  );
}