"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  TrendingUp, TrendingDown, Activity, MapPin, ArrowUpRight, ArrowDownRight,
  Sparkles, Coins, Sprout
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useSensors } from '@/context/SensorContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const priceHistory = [
  { day: 'D1', wheat: 2100, rice: 3800, cotton: 6200, maize: 1900 },
  { day: 'D2', wheat: 2150, rice: 3850, cotton: 6300, maize: 1950 },
  { day: 'D3', wheat: 2200, rice: 3900, cotton: 6450, maize: 2000 },
  { day: 'D4', wheat: 2250, rice: 3980, cotton: 6600, maize: 2020 },
  { day: 'D5', wheat: 2280, rice: 3960, cotton: 6700, maize: 2040 },
  { day: 'D6', wheat: 2300, rice: 3950, cotton: 6800, maize: 2050 },
];

const trendingCrops = [
  { name: 'Cotton (Kapus)', trend: '+6.2%', price: '₹6,800', status: 'booming', icon: '🧶' },
  { name: 'Wheat (Gehu)', trend: '+4.2%', price: '₹2,300', status: 'booming', icon: '🌾' },
  { name: 'Mustard (Sarson)', trend: '+3.5%', price: '₹5,400', status: 'booming', icon: '🌼' },
  { name: 'Rice (Dhan)', trend: '-0.8%', price: '₹3,950', status: 'declining', icon: '🍚' },
  { name: 'Tomato', trend: '-12.4%', price: '₹1,200', status: 'declining', icon: '🍅' },
  { name: 'Maize (Makka)', trend: '+1.5%', price: '₹2,050', status: 'stable', icon: '🌽' },
];

const pricesByState: Record<string, any[]> = {
  'Punjab': [
    { name: 'Wheat', current: 2300, prev: 2200, trend: '+4.2%', up: true },
    { name: 'Rice', current: 3950, prev: 3980, trend: '-0.8%', up: false },
    { name: 'Cotton', current: 6800, prev: 6400, trend: '+6.2%', up: true },
    { name: 'Maize', current: 2050, prev: 2020, trend: '+1.5%', up: true },
  ],
  'Uttar Pradesh': [
    { name: 'Wheat', current: 2150, prev: 2070, trend: '+3.8%', up: true },
    { name: 'Rice', current: 3750, prev: 3810, trend: '-1.5%', up: false },
    { name: 'Cotton', current: 6400, prev: 6060, trend: '+5.5%', up: true },
    { name: 'Maize', current: 1900, prev: 1885, trend: '+0.8%', up: true },
  ],
};

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } },
} as const;

export default function MarketPrices() {
  const { settings, t } = useSensors();
  const state = settings.location.split(', ')[1] || 'Punjab';
  const currentPrices = pricesByState[state] || pricesByState['Punjab'];
  const boomingCount = trendingCrops.filter(c => c.status === 'booming').length;
  const decliningCount = trendingCrops.filter(c => c.status === 'declining').length;

  const statusConfig: Record<string, { border: string; badge: string; badgeText: string }> = {
    booming: { border: 'border-l-sage', badge: 'bg-sage/10 text-sage border-sage/25', badgeText: 'text-sage' },
    declining: { border: 'border-l-destructive', badge: 'bg-destructive/10 text-destructive border-destructive/25', badgeText: 'text-destructive' },
    stable: { border: 'border-l-primary', badge: 'bg-primary/10 text-primary border-primary/25', badgeText: 'text-primary' },
  };

  return (
    <motion.div
      className="space-y-6"
      variants={stagger.container}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={stagger.item} className="flex items-center gap-3 px-1">
        <div className="bg-muted/50 border border-border/50 p-2.5 rounded-xl">
          <TrendingUp className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">{t('prices_title')}</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{t('prices_subtitle')}</p>
        </div>
      </motion.div>

      <motion.div variants={stagger.item}>
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="bg-muted/30 border border-border/50 p-1 mb-6 w-full grid grid-cols-3">
            <TabsTrigger value="trends" className="text-xs font-semibold data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md">🔥 {t('prices_tab_trends')}</TabsTrigger>
            <TabsTrigger value="prices" className="text-xs font-semibold data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md">💰 {t('prices_tab_local')}</TabsTrigger>
            <TabsTrigger value="profit" className="text-xs font-semibold data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md">✨ {t('prices_tab_profit')}</TabsTrigger>
          </TabsList>

          {/* TAB 1: MARKET TRENDS */}
          <TabsContent value="trends" className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-sage/8 border border-sage/20 p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
                <span className="font-mono text-2xl font-bold tracking-tight text-sage">{boomingCount}</span>
                <span className="text-[9px] font-bold text-sage uppercase tracking-[0.15em]">🚀 {t('prices_booming')}</span>
              </div>
              <div className="bg-destructive/8 border border-destructive/20 p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
                <span className="font-mono text-2xl font-bold tracking-tight text-destructive">{decliningCount}</span>
                <span className="text-[9px] font-bold text-destructive uppercase tracking-[0.15em]">📉 {t('prices_declining')}</span>
              </div>
            </div>

            {/* Trending List */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] pl-1">{t('prices_movers')}</h3>
              {trendingCrops.map((crop, i) => {
                const cfg = statusConfig[crop.status] || statusConfig.stable;
                return (
                  <Card key={i} className={cn(
                    "border-l-4 rounded-xl overflow-hidden bg-card/80 border border-border/50 transition-colors hover:border-primary/20",
                    cfg.border
                  )}>
                    <CardContent className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xl bg-muted/30 border border-border/30 p-2 rounded-lg">{crop.icon}</span>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">{crop.name}</h4>
                          <p className="text-[10px] uppercase font-medium tracking-wider text-muted-foreground mt-0.5">
                            Current: <span className="text-foreground font-mono ml-0.5">{crop.price}/q</span>
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-md", cfg.badge)}>
                        {crop.status === 'booming' ? <TrendingUp className="w-3 h-3" /> :
                          crop.status === 'declining' ? <TrendingDown className="w-3 h-3" /> :
                            <Activity className="w-3 h-3" />}
                        {crop.trend}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* TAB 2: LOCAL PRICES */}
          <TabsContent value="prices" className="space-y-6">
            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/50 w-fit mx-auto">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{t('prices_mandi_prices')} — {settings.location}</span>
            </div>

            <Card className="border border-border/50 bg-card/80 rounded-2xl overflow-hidden">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-semibold text-foreground">{t('prices_chart_title')}</CardTitle>
              </CardHeader>
              <CardContent className="p-2 h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={priceHistory} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(132 10% 22%)" opacity={0.5} />
                    <XAxis dataKey="day" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'hsl(40 12% 60%)' }} dy={10} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} domain={[0, 8000]} tick={{ fill: 'hsl(40 12% 60%)' }} dx={-10} />
                    <Tooltip
                      contentStyle={{ borderRadius: '10px', border: '1px solid hsl(132 10% 22%)', background: 'hsl(132 16% 14%)', fontSize: '12px', padding: '8px 14px', color: 'hsl(40 25% 92%)' }}
                      itemStyle={{ fontWeight: 600, color: 'hsl(40 25% 92%)' }}
                    />
                    <Line type="monotone" dataKey="wheat" stroke="#D4A843" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#D4A843' }} />
                    <Line type="monotone" dataKey="rice" stroke="#6B8F5E" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#6B8F5E' }} />
                    <Line type="monotone" dataKey="cotton" stroke="#8AACB8" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#8AACB8' }} />
                    <Line type="monotone" dataKey="maize" stroke="#C0622A" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#C0622A' }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="space-y-2.5">
              {currentPrices.map((crop: any, i: number) => (
                <Card key={i} className="border border-border/50 bg-card/80 rounded-xl overflow-hidden hover:border-primary/20 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{crop.name}</p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">Prev: <span className="font-mono">₹{crop.prev}</span></p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-bold text-lg tracking-tight text-foreground">₹{crop.current.toLocaleString()}</p>
                      <p className={cn(
                        "text-[10px] font-bold flex items-center justify-end gap-1 mt-0.5",
                        crop.up ? 'text-sage' : 'text-destructive'
                      )}>
                        {crop.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {crop.trend}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* TAB 3: PROFIT GUIDE */}
          <TabsContent value="profit" className="space-y-4">
            <Card className="border border-primary/20 bg-card/80 rounded-2xl">
              <CardContent className="p-6 text-center space-y-4">
                <div className="bg-primary/10 border border-primary/20 w-12 h-12 rounded-xl flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-foreground">{t('prices_ai_calc')}</h3>
                  <p className="text-xs text-muted-foreground font-medium mt-1">{t('prices_reco_desc')}</p>
                </div>
                <Button className="w-full font-semibold h-10 bg-primary text-primary-foreground rounded-xl shadow-premium">
                  {t('prices_gen_report')}
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-3 pt-2">
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] pl-1">{t('prices_best_opp')}</h3>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 space-y-2">
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4 text-primary" />
                  <h4 className="font-bold text-sm text-foreground">{t('prices_maize_switch' as any)}</h4>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">{t('prices_maize_desc' as any)}</p>
                <Badge variant="outline" className="bg-primary/10 text-primary border-primary/25 text-[9px] uppercase font-bold tracking-wider">
                  {t('prices_profit_acre' as any)}
                </Badge>
              </div>

              <div className="p-4 rounded-xl bg-sage/5 border border-sage/20 space-y-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-sage" />
                  <h4 className="font-bold text-sm text-foreground">{t('prices_cotton_hold' as any)}</h4>
                </div>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">{t('prices_cotton_desc' as any)}</p>
                <Badge variant="outline" className="bg-sage/10 text-sage border-sage/25 text-[9px] uppercase font-bold tracking-wider">
                  {t('prices_cotton_proj' as any)}
                </Badge>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
