"use client";

import { Card, CardContent } from '@/components/ui/card';
import { CloudRain, Droplets, Wind, Eye, Thermometer } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import { cn } from '@/lib/utils';

const buildForecast = () => {
  const templates = [
    { icon: '☀️', temp: 28, low: 21, rain: '10%', cond: 'Sunny', humidity: 52, wind: 11, visibility: 10 },
    { icon: '☀️', temp: 29, low: 22, rain: '10%', cond: 'Ideal', humidity: 50, wind: 9, visibility: 10 },
    { icon: '⛅', temp: 27, low: 21, rain: '30%', cond: 'Partly Cloudy', humidity: 61, wind: 14, visibility: 8 },
    { icon: '☁️', temp: 26, low: 20, rain: '70%', cond: 'Cloudy', humidity: 74, wind: 18, visibility: 5 },
    { icon: '🌧️', temp: 24, low: 19, rain: '85%', cond: 'Rain', humidity: 88, wind: 22, visibility: 3 },
    { icon: '🌧️', temp: 25, low: 20, rain: '85%', cond: 'Showers', humidity: 85, wind: 19, visibility: 4 },
    { icon: '⛅', temp: 26, low: 20, rain: '30%', cond: 'Clearing', humidity: 65, wind: 13, visibility: 7 },
    { icon: '☀️', temp: 29, low: 22, rain: '5%', cond: 'Sunny', humidity: 48, wind: 10, visibility: 10 },
  ];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  return templates.map((t, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
    return { ...t, day: label, isIdeal: t.cond === 'Sunny' || t.cond === 'Ideal' };
  });
};

export default function WeatherForecast() {
  const { settings } = useSensors();
  const forecast = buildForecast();
  const today = forecast[0];
  const upcoming = forecast.slice(1);
  const idealDays = forecast.filter(f => f.isIdeal).slice(0, 3);

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-6 duration-700">

      {/* Hero current weather card */}
      <section className="relative overflow-hidden rounded-[2.5rem] p-7 text-white shadow-premium border-none"
        style={{ background: 'linear-gradient(135deg, #1B4D2E 0%, #2E7D32 60%, #388E3C 100%)' }}>
        <div className="relative z-10 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Current Conditions</p>
              <p className="text-sm font-bold text-white/80">{settings.location}</p>
            </div>
            <div className="text-6xl drop-shadow-2xl">{today.icon}</div>
          </div>

          <div className="flex items-end gap-3">
            <span className="text-8xl font-black tracking-tighter leading-none">{today.temp}°</span>
            <div className="pb-3 space-y-0.5">
              <p className="text-lg font-bold text-white/90">{today.cond}</p>
              <p className="text-xs text-white/50 font-bold">Low {today.low}°C tonight</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-4 border-t border-white/20">
            {[
              { icon: CloudRain, label: 'Rain', val: today.rain },
              { icon: Droplets, label: 'Humidity', val: `${today.humidity}%` },
              { icon: Wind, label: 'Wind', val: `${today.wind} km/h` },
              { icon: Eye, label: 'Visibility', val: `${today.visibility} km` },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="text-center space-y-1.5">
                <Icon className="w-4 h-4 mx-auto opacity-60" />
                <p className="text-xs font-black">{val}</p>
                <p className="text-[9px] opacity-50 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
      </section>

      {/* Best days to farm */}
      {idealDays.length > 0 && (
        <Card className="border-none shadow-sm bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 overflow-hidden">
          <CardContent className="p-5 space-y-3">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-400">
              🌱 Best Days to Farm
            </p>
            <div className="space-y-2">
              {idealDays.map((f, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-emerald-500/10 last:border-0">
                  <span className="text-xs font-bold">{f.icon} {f.day}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{f.temp}°C</span>
                    <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">✓ Ideal</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-muted-foreground">Great for planting, irrigation, and harvesting</p>
          </CardContent>
        </Card>
      )}

      {/* 7-day forecast */}
      <section className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary px-2">7-Day Outlook</p>
        <div className="space-y-2">
          {upcoming.map((item, i) => (
            <Card key={i} className={cn(
              "border-none shadow-sm rounded-[1.5rem] overflow-hidden transition-all",
              item.isIdeal ? "bg-primary/5 border border-primary/10" : "bg-card/40 backdrop-blur-md border border-white/10"
            )}>
              <CardContent className="p-4 flex items-center gap-4">
                <span className="text-2xl w-8 text-center">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-black">{item.day}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">{item.cond}</p>
                </div>
                <div className="text-right space-y-0.5">
                  <p className="text-sm font-black">{item.temp}°C</p>
                  <p className="text-[9px] text-blue-500 font-bold">Rain {item.rain}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tip */}
      <div className="bg-primary/5 p-5 rounded-[1.5rem] border border-primary/10 flex items-start gap-3">
        <span className="text-xl">💡</span>
        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
          Plan irrigation around rain days. The forecast shows precipitation on 2 days this week — save water by skipping those irrigation cycles.
        </p>
      </div>

    </div>
  );
}
