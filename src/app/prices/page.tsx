"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  MapPin,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  AlertCircle,
  Coins,
  Sprout
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useSensors } from '@/context/SensorContext';

// Mock Data for Charts
const priceHistory = [
  { day: 'D1', wheat: 2100, rice: 3800, cotton: 6200, maize: 1900 },
  { day: 'D2', wheat: 2150, rice: 3850, cotton: 6300, maize: 1950 },
  { day: 'D3', wheat: 2200, rice: 3900, cotton: 6450, maize: 2000 },
  { day: 'D4', wheat: 2250, rice: 3980, cotton: 6600, maize: 2020 },
  { day: 'D5', wheat: 2280, rice: 3960, cotton: 6700, maize: 2040 },
  { day: 'D6', wheat: 2300, rice: 3950, cotton: 6800, maize: 2050 },
];

// Mock Data for Market Trends
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

export default function MarketPrices() {
  const { settings } = useSensors();
  const state = settings.location.split(', ')[1] || 'Punjab';
  const currentPrices = pricesByState[state] || pricesByState['Punjab'];
  const boomingCount = trendingCrops.filter(c => c.status === 'booming').length;
  const decliningCount = trendingCrops.filter(c => c.status === 'declining').length;

  return (
    <div className="space-y-6 pb-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Market Intelligence</h2>
          <p className="text-sm text-muted-foreground">Real-time mandi rates & AI forecasts</p>
        </div>
        <div className="bg-primary/10 p-2 rounded-full">
          <TrendingUp className="w-6 h-6 text-primary" />
        </div>
      </div>

      <Tabs defaultValue="trends" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 mb-6">
          <TabsTrigger value="trends" className="text-xs font-bold">🔥 Market Trends</TabsTrigger>
          <TabsTrigger value="prices" className="text-xs font-bold">💰 Local Prices</TabsTrigger>
          <TabsTrigger value="profit" className="text-xs font-bold">✨ Profit Guide</TabsTrigger>
        </TabsList>

        {/* --- TAB 1: MARKET TRENDS --- */}
        <TabsContent value="trends" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">

          {/* Summary Boxes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900/50 p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-2xl font-black text-green-600 dark:text-green-500">{boomingCount}</span>
              <span className="text-xs font-bold text-green-800 dark:text-green-400 uppercase tracking-wide">🚀 Booming Crops</span>
            </div>
            <div className="bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 p-3 rounded-xl flex flex-col items-center justify-center text-center space-y-1">
              <span className="text-2xl font-black text-red-600 dark:text-red-500">{decliningCount}</span>
              <span className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wide">📉 Declining Crops</span>
            </div>
          </div>

          {/* Trending List */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">Market Movers</h3>
            {trendingCrops.map((crop, i) => (
              <Card key={i} className={`border-l-4 shadow-sm overflow-hidden ${crop.status === 'booming' ? 'border-l-green-500' :
                crop.status === 'declining' ? 'border-l-red-500' : 'border-l-yellow-500'
                }`}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl bg-muted/30 p-2 rounded-lg">{crop.icon}</span>
                    <div>
                      <h4 className="font-bold text-sm">{crop.name}</h4>
                      <p className="text-xs text-muted-foreground">Current: {crop.price}/q</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`flex items-center gap-1 font-bold ${crop.status === 'booming' ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' :
                    crop.status === 'declining' ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' :
                      'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800'
                    }`}>
                    {crop.status === 'booming' ? <TrendingUp className="w-3 h-3" /> :
                      crop.status === 'declining' ? <TrendingDown className="w-3 h-3" /> :
                        <Activity className="w-3 h-3" />}
                    {crop.trend}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* --- TAB 2: LOCAL PRICES (Existing Logic) --- */}
        <TabsContent value="prices" className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-2">

          <div className="flex items-center gap-2 bg-white dark:bg-card px-3 py-2 rounded-full border border-border/50 shadow-sm w-fit mx-auto">
            <MapPin className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-bold text-muted-foreground">Mandi prices — {settings.location}</span>
          </div>

          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-bold">Price Trend (Last 6 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-2 h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceHistory}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="day" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={10} axisLine={false} tickLine={false} domain={[0, 8000]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="wheat" stroke="#ECAA53" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="rice" stroke="#386641" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="cotton" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="maize" stroke="#f97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-3">
            {currentPrices.map((crop, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-border/50">
                <div>
                  <p className="font-bold text-sm">{crop.name}</p>
                  <p className="text-xs text-muted-foreground">Prev: ₹{crop.prev}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg">₹{crop.current.toLocaleString()}</p>
                  <p className={`text-xs font-bold flex items-center justify-end gap-1 ${crop.up ? 'text-green-600' : 'text-red-600'}`}>
                    {crop.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {crop.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* --- TAB 3: PROFIT GUIDE --- */}
        <TabsContent value="profit" className="space-y-4 animate-in fade-in-50 slide-in-from-bottom-2">

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6 text-center space-y-4">
              <div className="bg-white w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary">AI Profit Calculator</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on your soil health and current market trends, here is your personalized recommendation.
                </p>
              </div>
              <Button className="w-full font-bold shadow-lg shadow-primary/20">
                Generate Report
              </Button>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest pl-1">Best Opportunities</h3>

            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50 space-y-2">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-orange-600 dark:text-orange-500" />
                <h4 className="font-bold text-orange-800 dark:text-orange-400">Switch to Maize</h4>
              </div>
              <p className="text-xs text-orange-900/70 dark:text-orange-200/70 leading-relaxed">
                Wheat prices are stabilizing, but Maize demand is projected to rise by 15% next month due to poultry feed shortages.
              </p>
              <Badge variant="secondary" className="bg-white/50 dark:bg-black/20 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-800">
                Potential +₹4,500/acre
              </Badge>
            </div>

            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50 space-y-2">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-blue-600 dark:text-blue-500" />
                <h4 className="font-bold text-blue-800 dark:text-blue-400">Hold Your Cotton</h4>
              </div>
              <p className="text-xs text-blue-900/70 dark:text-blue-200/70 leading-relaxed">
                Global cotton supply is tight. Holding your stock for another 2 weeks could yield better returns.
              </p>
              <Badge variant="secondary" className="bg-white/50 dark:bg-black/20 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                Projected +8% Value
              </Badge>
            </div>

          </div>

        </TabsContent>
      </Tabs>
    </div>
  );
}
