"use client";

import { Card, CardContent } from '@/components/ui/card';
import { ShieldCheck, Cloud, FileText, Landmark, Settings, ChevronRight, ExternalLink, Calendar, Phone, BookOpen } from 'lucide-react';
import Link from 'next/link';
import { useSensors } from '@/context/SensorContext';
import { cn } from '@/lib/utils';

export default function MoreHub() {
  const { t } = useSensors();

  const services = [
    {
      title: t('more_doctor'),
      desc: 'AI Disease Diagnosis',
      icon: ShieldCheck,
      href: '/diagnosis',
      color: 'bg-green-500',
      iconColor: 'text-green-500',
      external: false,
    },
    {
      title: t('more_weather'),
      desc: '7-Day Farm Forecast',
      icon: Cloud,
      href: '/weather',
      color: 'bg-blue-500',
      iconColor: 'text-blue-500',
      external: false,
    },
    {
      title: t('more_journal'),
      desc: 'Field Observations',
      icon: FileText,
      href: '/journal',
      color: 'bg-orange-500',
      iconColor: 'text-orange-500',
      external: false,
    },
    {
      title: t('more_schemes'),
      desc: 'Govt. Subsidies',
      icon: Landmark,
      href: '/schemes',
      color: 'bg-purple-500',
      iconColor: 'text-purple-500',
      external: false,
    },
    {
      title: t('settings_title'),
      desc: 'Profile & App Options',
      icon: Settings,
      href: '/settings',
      color: 'bg-gray-500',
      iconColor: 'text-gray-500',
      external: false,
    },
  ];

  const resources = [
    {
      label: 'Market Holidays (APMC)',
      sub: 'National Agriculture Market',
      icon: Calendar,
      href: 'https://www.enam.gov.in/web/',
    },
    {
      label: 'Kisan Call Center',
      sub: 'Free helpline: 1800-180-1551',
      icon: Phone,
      href: 'tel:18001801551',
    },
    {
      label: 'App Manual & Guide',
      sub: 'AgriSense usage documentation',
      icon: BookOpen,
      href: 'https://agrisenseaindia.netlify.app',
    },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-2">
        <h2 className="text-2xl font-black text-primary">{t('more_title')}</h2>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Utility & Extension Services</p>
      </div>

      <div className="grid gap-4">
        {services.map((service, i) => {
          const inner = (
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
          );
          return service.external
            ? <a key={i} href={service.href} target="_blank" rel="noopener noreferrer">{inner}</a>
            : <Link href={service.href} key={i}>{inner}</Link>;
        })}
      </div>

      {/* Resources with real links */}
      <section className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10 space-y-4">
        <h3 className="text-xs font-black text-primary uppercase tracking-widest">Resources</h3>
        <div className="space-y-3">
          {resources.map((r, i) => (
            <a
              key={i}
              href={r.href}
              target={r.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-card/40 border border-white/10 hover:bg-primary/5 transition-all active:scale-[0.98] group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-xl">
                  <r.icon className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{r.label}</p>
                  <p className="text-[9px] text-muted-foreground font-medium">{r.sub}</p>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
            </a>
          ))}
        </div>
      </section>

      {/* Find nearest CSC */}
      <a
        href="https://locator.csccloud.in"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <div className="bg-primary p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden active:scale-[0.98] transition-all">
          <div className="relative z-10 space-y-3">
            <h3 className="text-lg font-black uppercase tracking-wider">Find Nearest CSC</h3>
            <p className="text-xs font-medium opacity-80 leading-relaxed">
              Visit your nearest Common Service Center for scheme verification and government assistance.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full w-fit">
              <ExternalLink className="w-3 h-3" />
              locator.csccloud.in
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
      </a>
    </div>
  );
}