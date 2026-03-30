"use client";

import { useState, useEffect } from 'react';
import { useSensors } from '@/context/SensorContext';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Sparkles, Droplets, ThermometerSun, Leaf } from 'lucide-react';

export default function HomeDashboard() {
  const { sensors, settings } = useSensors();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateHealthScore = () => {
    let score = 100;
    if (sensors.soilMoisture < 60 || sensors.soilMoisture > 85) score -= 15;
    if (sensors.soilTemperature < 20 || sensors.soilTemperature > 30) score -= 10;
    if (sensors.soilPh < 5.5 || sensors.soilPh > 7.5) score -= 15;
    if (sensors.nutrientLevel === 'Low') score -= 20;
    return Math.max(0, score);
  };

  const healthScore = calculateHealthScore();

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex flex-col pt-6 pb-24 px-4 gap-6">
      
      {/* Header & Location */}
      <header className="flex justify-between items-end px-2">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {settings.cropType}
          </h1>
          <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">{settings.location.split(',')[0]}</span>
          </div>
        </div>
        <Link href="/weather" className="glass py-2 px-4 rounded-full flex items-center gap-2 active-scale">
          <span className="text-xl">🌤️</span>
          <span className="text-sm font-bold">24°</span>
        </Link>
      </header>

      {/* Anchor Image Frame */}
      <div className="relative w-full h-[240px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group">
        <Image 
          src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=800&auto=format&fit=crop" 
          alt="Anchor Farm Image" 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-1000"
          priority
        />
        {/* Inner shadow to give it that contained, tactile feel */}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/20 rounded-[2rem] pointer-events-none" />
      </div>

      {/* AI Summary Block */}
      <div className="glass p-5 rounded-[2rem] space-y-3 relative overflow-hidden">
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue/20 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-blue" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">AI Insight</span>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${healthScore > 80 ? 'bg-accent/20 text-accent' : 'bg-gold/20 text-gold'}`}>
            {healthScore}% VITALITY
          </span>
        </div>
        <p className="text-base font-medium text-foreground/90 leading-relaxed pl-1">
          Soil moisture is stable, but a slight temperature drop is expected tonight. Consider delaying open irrigation until tomorrow noon.
        </p>
      </div>

      {/* Primary Telemetry Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Moisture Card */}
        <div className="glass p-5 rounded-[2rem] flex flex-col justify-between h-[160px] relative overflow-hidden">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-blue" />
            <span className="text-xs font-bold text-muted-foreground">Moisture</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tighter text-white">{sensors.soilMoisture.toFixed(0)}</span>
              <span className="text-xl font-bold text-muted-foreground">%</span>
            </div>
            {/* Simple progress bar */}
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-blue rounded-full" style={{ width: `${sensors.soilMoisture}%` }} />
            </div>
          </div>
        </div>

        {/* Temperature Card */}
        <div className="glass p-5 rounded-[2rem] flex flex-col justify-between h-[160px] relative overflow-hidden">
          <div className="flex items-center gap-2">
            <ThermometerSun className="w-4 h-4 text-gold" />
            <span className="text-xs font-bold text-muted-foreground">Soil Temp</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tighter text-white">{sensors.soilTemperature.toFixed(0)}</span>
              <span className="text-xl font-bold text-muted-foreground">°C</span>
            </div>
            <p className="text-xs font-semibold text-gold mt-2">Optimal range</p>
          </div>
        </div>
      </div>

      {/* Secondary Wide Card */}
      <div className="glass p-5 rounded-[2rem] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground mb-0.5">Nutrient Level</p>
            <p className="text-xl font-bold text-white capitalize">{sensors.nutrientLevel}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-muted-foreground mb-0.5">pH Level</p>
          <p className="text-xl font-bold text-white">{sensors.soilPh.toFixed(1)}</p>
        </div>
      </div>

    </div>
  );
}
