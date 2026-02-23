"use client";

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Cloud, FileText, Landmark, Settings, ChevronRight, ExternalLink, Calendar, Phone, BookOpen, UserCircle, Crown, Plane, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { useSensors } from '@/context/SensorContext';
import { cn } from '@/lib/utils';

export default function MoreHub() {
  const { t } = useSensors();

  const services = [
    {
      title: t('more_subscription'),
      desc: t('more_sub_subscription'),
      icon: Crown,
      href: '/subscription',
      color: 'bg-amber-500',
      iconColor: 'text-amber-500',
    },
    {
      title: t('settings_title'),
      desc: t('more_sub_settings'),
      icon: Settings,
      href: '/settings',
      color: 'bg-gray-500',
      iconColor: 'text-gray-500',
    },
    {
      title: t('more_weather'),
      desc: t('more_sub_weather'),
      icon: Cloud,
      href: '/weather',
      color: 'bg-blue-500',
      iconColor: 'text-blue-500',
    },
    {
      title: t('more_doctor'),
      desc: t('more_sub_doctor'),
      icon: ShieldCheck,
      href: '/diagnosis',
      color: 'bg-green-500',
      iconColor: 'text-green-500',
    },
    {
      title: t('more_drone'),
      desc: t('more_sub_drone'),
      icon: Plane,
      href: '/services',
      color: 'bg-cyan-500',
      iconColor: 'text-cyan-500',
    },
    {
      title: t('more_education'),
      desc: t('more_sub_education'),
      icon: BookOpen,
      href: '/education',
      color: 'bg-blue-600',
      iconColor: 'text-blue-600',
    },
    {
      title: t('more_journal'),
      desc: t('more_sub_journal'),
      icon: FileText,
      href: '/journal',
      color: 'bg-orange-500',
      iconColor: 'text-orange-500',
    },
    {
      title: t('more_schemes'),
      desc: t('more_sub_schemes'),
      icon: Landmark,
      href: '/schemes',
      color: 'bg-purple-500',
      iconColor: 'text-purple-500',
    },
    {
      title: t('more_resources'),
      desc: t('more_sub_resources'),
      icon: LayoutGrid,
      href: '#',
      color: 'bg-emerald-500',
      iconColor: 'text-emerald-500',
      isResources: true
    }
  ];

  const subResources = [
    { label: t('res_market'), sub: t('res_view'), icon: Calendar, href: 'https://www.enam.gov.in/web/' },
    { label: t('res_experts'), sub: t('res_call'), icon: Phone, href: 'tel:18001801551' },
    { label: t('res_manual'), sub: t('res_read'), icon: BookOpen, href: 'https://agrisenseainindia.netlify.app' },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="px-2">
        <h2 className="text-2xl font-black text-primary">{t('more_title')}</h2>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">{t('more_utility_desc')}</p>
      </div>

      <div className="grid gap-4">
        {services.map((service, i) => {
          if (service.isResources) {
            return (
              <Card key={i} className="border-none shadow-premium bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] overflow-hidden">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg">
                      <LayoutGrid className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-wider">{t('more_resources')}</h3>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{t('more_essential_tools')}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {subResources.map((r, idx) => (
                      <a key={idx} href={r.href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all active:scale-95 group">
                        <r.icon className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" />
                        <div className="text-center">
                          <p className="text-[8px] font-black uppercase leading-tight">{r.label}</p>
                          <p className="text-[7px] font-bold text-emerald-600 uppercase mt-0.5">{r.sub}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          }

          return (
            <Link href={service.href} key={i}>
              <Card className="border-none shadow-sm hover:shadow-md transition-all active:scale-[0.98] bg-card/40 backdrop-blur-md rounded-[2rem] overflow-hidden group border border-white/10">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={cn("p-3 rounded-2xl transition-all group-hover:scale-110", service.color, "bg-opacity-10")}>
                    <service.icon className={cn("w-6 h-6", service.iconColor)} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-foreground">{service.title}</h3>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">{service.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground opacity-30 group-hover:opacity-100 transition-opacity" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Aesthetic Meet the Team Card */}
      <Card className="border-none shadow-premium bg-gradient-to-br from-[#1b4d2e] via-[#1a3c31] to-[#2d5a27] border border-white/10 rounded-[2.5rem] overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-emerald-500/20 transition-colors" />
        <CardContent className="p-8 space-y-6 relative">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-widest leading-none">{t('more_meet_team')}</h3>
              <p className="text-[10px] font-bold text-white/60 uppercase mt-2">{t('meet_team_desc')}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: t('role_ceo_name' as any), role: t('role_ceo'), icon: UserCircle },
              { name: t('role_cto_name' as any), role: t('role_cto'), icon: UserCircle },
              { name: t('role_cfo_name' as any), role: t('role_cfo'), icon: UserCircle },
            ].map((member, i) => (
              <div key={i} className="flex flex-col items-center text-center p-3 rounded-[2rem] bg-black/20 border border-white/5 shadow-inner transition-transform hover:scale-105 active:scale-95">
                <div className="bg-white/10 p-2 rounded-2xl mb-2">
                  <member.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <p className="text-[9px] font-black uppercase text-white leading-[1.1] mb-1">{member.name}</p>
                <Badge variant="secondary" className="text-[7px] font-black tracking-tighter uppercase px-2 py-0 h-4 min-w-[30px] flex items-center justify-center bg-emerald-500 text-white border-none">{member.role}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}