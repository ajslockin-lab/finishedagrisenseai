"use client";

import { useSensors } from '@/context/SensorContext';
import { Activity, Droplets, ThermometerSun, FlaskConical, Leaf } from 'lucide-react';

export default function SensorAnalytics() {
  const { sensors } = useSensors();

  return (
    <div className="min-h-screen w-full flex flex-col pt-6 pb-24 px-4 gap-6">
      
      <header className="px-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Telemetry
        </h1>
        <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
          <Activity className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Live Network</span>
        </div>
      </header>

      {/* Global Health Status */}
      <div className="glass p-5 rounded-[2rem] flex flex-col gap-3 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">System Status</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-accent/20 text-accent">
            OPTIMAL
          </span>
        </div>
        <p className="text-base font-medium text-foreground/90 leading-relaxed pr-4">
          All sensor nodes are responsive. Soil moisture in the East Block is trending slightly downward.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Moisture */}
        <div className="glass p-5 rounded-[2rem] flex flex-col justify-between h-[180px]">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-blue/20 flex items-center justify-center">
              <Droplets className="w-4 h-4 text-blue" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground">Moisture</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tighter text-white">{sensors.soilMoisture.toFixed(0)}</span>
              <span className="text-xl font-bold text-muted-foreground">%</span>
            </div>
            {/* Tracking bar */}
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-blue rounded-full" style={{ width: `${sensors.soilMoisture}%` }} />
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div className="glass p-5 rounded-[2rem] flex flex-col justify-between h-[180px]">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
              <ThermometerSun className="w-4 h-4 text-gold" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground">Soil Temp</p>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold tracking-tighter text-white">{sensors.soilTemperature.toFixed(0)}</span>
              <span className="text-xl font-bold text-muted-foreground">°C</span>
            </div>
            {/* Tracking bar */}
            <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden mt-3">
              <div className="h-full bg-gold rounded-full" style={{ width: `${(sensors.soilTemperature / 50) * 100}%` }} />
            </div>
          </div>
        </div>

        {/* pH */}
        <div className="glass p-5 rounded-[2rem] flex flex-col justify-between h-[180px]">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
              <FlaskConical className="w-4 h-4 text-accent" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground">pH Level</p>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tighter text-white">{sensors.soilPh.toFixed(1)}</span>
            </div>
            <p className="text-[10px] font-bold text-accent uppercase mt-2">Target: 6.5</p>
          </div>
        </div>

        {/* Nutrients */}
        <div className="glass p-5 rounded-[2rem] flex flex-col justify-between h-[180px]">
          <div className="flex justify-between items-start">
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-green-500" />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-muted-foreground">Nutrients</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold tracking-tight text-white capitalize">{sensors.nutrientLevel}</span>
            </div>
            <p className="text-[10px] font-bold text-green-500 uppercase mt-2">N-P-K Balanced</p>
          </div>
        </div>
      </div>

    </div>
  );
}
