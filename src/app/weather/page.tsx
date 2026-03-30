"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CloudRain, Droplets, Wind, Eye, WifiOff, RefreshCw, Cloud, Sun } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import { cn } from '@/lib/utils';
import { getWeatherForecast, type WeatherData } from './actions';
import { motion } from 'framer-motion';

const DEFAULT_FORECAST: WeatherData = {
  current: { icon: '☀️', temp: 28, low: 21, rain: '10%', cond: 'Sunny', humidity: 52, wind: 11, visibility: 10 },
  daily: [
    { day: 'Today', icon: '☀️', temp: 28, low: 21, rain: '10%', cond: 'Sunny', isIdeal: true },
    { day: 'Tomorrow', icon: '☀️', temp: 29, low: 22, rain: '10%', cond: 'Ideal', isIdeal: true },
    { day: 'Tue', icon: '⛅', temp: 27, low: 21, rain: '30%', cond: 'Partly Cloudy', isIdeal: false },
    { day: 'Wed', icon: '☁️', temp: 26, low: 20, rain: '70%', cond: 'Cloudy', isIdeal: false },
    { day: 'Thu', icon: '🌧️', temp: 24, low: 19, rain: '85%', cond: 'Rain', isIdeal: false },
    { day: 'Fri', icon: '🌧️', temp: 25, low: 20, rain: '85%', cond: 'Showers', isIdeal: false },
    { day: 'Sat', icon: '⛅', temp: 26, low: 20, rain: '30%', cond: 'Clearing', isIdeal: false },
  ]
};

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } },
} as const;

export default function WeatherForecast() {
  const { settings, t } = useSensors();
  const [weather, setWeather] = useState<WeatherData>(DEFAULT_FORECAST);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    handleRefresh();
  }, [settings.location]);

  const handleRefresh = async () => {
    setLoading(true);
    setIsOffline(false);
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      setWeather(DEFAULT_FORECAST);
      setIsOffline(true);
      setLoading(false);
      return;
    }
    try {
      const data = await getWeatherForecast(settings.location);
      setWeather(data);
    } catch (error) {
      console.error('Failed to fetch real weather:', error);
      setWeather(DEFAULT_FORECAST);
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  const today = weather.current;
  const upcoming = weather.daily.slice(1);
  const idealDays = weather.daily.filter(f => f.isIdeal).slice(0, 3);

  return (
    <motion.div
      className="space-y-6"
      variants={stagger.container}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={stagger.item} className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <div className="bg-muted/50 border border-border/50 p-2.5 rounded-xl">
            <Cloud className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">{t('more_weather')}</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{settings.location}</p>
          </div>
        </div>
        {isOffline && (
          <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border/50 text-[9px] font-bold uppercase tracking-wider">
            <WifiOff className="w-3 h-3 mr-1.5" />
            {t('common_offline_demo')}
          </Badge>
        )}
      </motion.div>

      {/* ═══ Hero Current Weather ═══ */}
      <motion.section variants={stagger.item} className="relative overflow-hidden rounded-2xl border border-border/50 shadow-premium">
        <div className="absolute inset-0 bg-gradient-to-br from-sage/10 via-transparent to-primary/8" />
        {loading && (
          <div className="absolute inset-0 z-20 bg-background/60 backdrop-blur-sm flex items-center justify-center">
            <RefreshCw className="w-6 h-6 animate-spin text-primary" />
          </div>
        )}
        <div className="relative z-10 p-6 md:p-8 space-y-5">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground">{t('weather_conditions')}</p>
              <p className="text-sm font-semibold text-foreground">{settings.location}</p>
            </div>
            <div className="text-5xl">{today.icon}</div>
          </div>

          <div className="flex items-end gap-3">
            <span className="font-mono text-7xl font-bold tracking-tighter leading-none text-foreground text-glow">{today.temp}°</span>
            <div className="pb-2 space-y-0.5">
              <p className="text-base font-semibold text-foreground">{today.cond}</p>
              <p className="text-[11px] text-muted-foreground font-medium font-mono bg-muted/30 px-2 py-0.5 rounded-md border border-border/50">
                {t('weather_low')} {today.low}°C {t('weather_tonight')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-4 border-t border-border/30">
            {[
              { icon: CloudRain, label: t('weather_rain'), val: today.rain },
              { icon: Droplets, label: t('weather_humidity'), val: `${today.humidity}%` },
              { icon: Wind, label: t('weather_wind'), val: `${today.wind} km/h` },
              { icon: Eye, label: t('weather_visibility'), val: `${today.visibility} km` },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="text-center space-y-1.5 p-2.5 bg-muted/20 rounded-xl border border-border/30">
                <Icon className="w-3.5 h-3.5 mx-auto text-muted-foreground" />
                <p className="font-mono text-xs font-bold">{val}</p>
                <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══ Best Days to Farm ═══ */}
      {idealDays.length > 0 && (
        <motion.div variants={stagger.item}>
          <Card className="border border-border/50 bg-card/80 rounded-2xl">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2 px-0.5">
                <span className="text-base">🌱</span>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-sage">
                  {t('weather_best_days')}
                </p>
              </div>
              <div className="space-y-2">
                {idealDays.map((f, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-muted/20 border border-border/30 hover:border-sage/30 transition-colors">
                    <span className="text-xs font-semibold flex items-center gap-2">
                      <span>{f.icon}</span><span>{f.day}</span>
                    </span>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-medium text-muted-foreground">{f.temp}°C</span>
                      <Badge variant="outline" className="bg-sage/10 text-sage border-sage/25 text-[9px] font-bold uppercase tracking-wider">✓ {t('weather_ideal')}</Badge>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground font-medium px-1">Great for planting, irrigation, and harvesting</p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ═══ 7-Day Forecast ═══ */}
      <motion.section variants={stagger.item} className="space-y-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground px-1">{t('weather_7day')}</p>
        <div className="space-y-2">
          {upcoming.map((item, i) => (
            <motion.div key={i} variants={stagger.item} whileHover={{ y: -1, transition: { duration: 0.15 } }}>
              <Card className={cn(
                "border border-border/50 rounded-xl transition-colors hover:border-primary/20",
                item.isIdeal ? "bg-sage/5" : "bg-card/80"
              )}>
                <CardContent className="p-3.5 flex items-center gap-4">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-muted/30 rounded-xl border border-border/30">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground">{item.day}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{item.cond}</p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <p className="font-mono text-sm font-bold tracking-tight">{item.temp}°C</p>
                    <p className="text-[10px] text-blue-400 font-medium flex items-center justify-end gap-1">
                      <CloudRain className="w-2.5 h-2.5" />
                      {item.rain}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Tip */}
      <motion.div variants={stagger.item} className="bg-muted/30 p-4 rounded-xl border border-border/50 flex items-start gap-3">
        <span className="text-lg leading-none pt-0.5">💡</span>
        <p className="text-xs font-medium text-foreground leading-relaxed">
          {t('weather_tip')}
        </p>
      </motion.div>
    </motion.div>
  );
}
