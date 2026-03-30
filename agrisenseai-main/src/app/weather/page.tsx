"use client";

import { useSensors } from '@/context/SensorContext';
import { cn } from '@/lib/utils';
import { Cloud, Sun, CloudRain, Droplets, Wind, MapPin, Sparkles } from 'lucide-react';

const forecast = [
  { day: 'Friday', date: 'Jan 30', icon: Sun, temp: 28, cond: 'Clear' },
  { day: 'Saturday', date: 'Jan 31', icon: Sun, temp: 28, cond: 'Clear' },
  { day: 'Sunday', date: 'Feb 1', icon: Cloud, temp: 27, cond: 'Cloudy' },
  { day: 'Monday', date: 'Feb 2', icon: Cloud, temp: 26, cond: 'Cloudy' },
  { day: 'Tuesday', date: 'Feb 3', icon: CloudRain, temp: 24, cond: 'Rain' },
  { day: 'Wednesday', date: 'Feb 4', icon: CloudRain, temp: 25, cond: 'Rain' },
];

export default function WeatherForecast() {
  const { settings } = useSensors();

  return (
    <div className="min-h-screen w-full flex flex-col pt-6 pb-[100px] px-4 gap-6 bg-background">
      
      <header className="px-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Atmosphere
        </h1>
        <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
          <MapPin className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold uppercase tracking-wider">{settings.location}</span>
        </div>
      </header>

      {/* Current State - Hero Widget */}
      <div className="glass rounded-[2rem] p-6 flex flex-col relative overflow-hidden bg-surface border border-white/5 shadow-2xl">
         <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none" />
         
         <div className="flex justify-between items-start z-10">
            <div className="space-y-1">
               <span className="text-xs font-bold uppercase tracking-wider text-accent">Clear Sky</span>
               <div className="flex items-baseline tracking-tighter">
                 <h2 className="text-7xl font-bold text-foreground">28</h2>
                 <span className="text-4xl font-bold text-muted-foreground">°C</span>
               </div>
            </div>
            <Sun className="w-16 h-16 text-accent drop-shadow-lg" />
         </div>
         
         <div className="flex gap-4 mt-8 pt-6 border-t border-white/5 z-10">
            <div className="flex-1 glass bg-background/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 border border-white/5">
               <Droplets className="w-5 h-5 text-blue mb-1" />
               <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Humidity</p>
               <p className="font-bold text-lg text-foreground">55%</p>
            </div>
            <div className="flex-1 glass bg-background/50 rounded-2xl p-4 flex flex-col items-center justify-center gap-1 border border-white/5">
               <Wind className="w-5 h-5 text-muted-foreground mb-1" />
               <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Wind</p>
               <p className="font-bold text-lg text-foreground">12 km/h</p>
            </div>
         </div>
      </div>

      {/* Agricultural Context */}
      <div className="glass p-5 rounded-[2rem] space-y-3 relative overflow-hidden border-accent/20 bg-accent/5">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-xs font-bold uppercase tracking-wider text-accent">Optimal Window</span>
        </div>
        <p className="text-sm font-medium text-foreground/90 leading-relaxed pr-2">
          Consistent solar exposure predicted for the next 72 hours. An ideal phase for precise irrigation management and crop inspection.
        </p>
      </div>

      {/* Forecast List */}
      <section className="space-y-3">
         <div className="px-2 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">7-Day Horizon</p>
         </div>
         
         <div className="glass rounded-[2rem] overflow-hidden divide-y divide-white/5">
           {forecast.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-4 px-5 hover:bg-white/[0.02] transition-colors">
                 <div className="flex flex-col w-24">
                    <span className="text-base font-bold text-foreground/90">
                      {item.day}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {item.date}
                    </span>
                 </div>
                 
                 <div className="flex items-center justify-center gap-2">
                    <item.icon className="w-5 h-5 text-foreground/80" />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground w-16 text-center">{item.cond}</span>
                 </div>
                 
                 <div className="w-12 text-right">
                    <span className="text-xl font-bold text-foreground">{item.temp}°</span>
                 </div>
              </div>
           ))}
         </div>
      </section>

    </div>
  );
}
