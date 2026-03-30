"use client";

import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Droplets, Thermometer, Beaker, Leaf, Activity } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const buildChartData = () => {
  const base = [
    { moisture: 62, temp: 22, nutrients: 45 },
    { moisture: 68, temp: 24, nutrients: 50 },
    { moisture: 72, temp: 23, nutrients: 65 },
    { moisture: 65, temp: 21, nutrients: 60 },
    { moisture: 70, temp: 25, nutrients: 70 },
    { moisture: 69, temp: 24, nutrients: 55 },
    { moisture: 67, temp: 23, nutrients: 58 },
  ];
  const today = new Date();
  return base.map((d, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - i));
    return { ...d, date: `${date.getMonth() + 1}/${date.getDate()}` };
  });
};

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } },
} as const;

export default function SensorAnalytics() {
  const { sensors } = useSensors();
  const data = buildChartData();
  const avgMoisture = (data.reduce((s, d) => s + d.moisture, 0) / data.length).toFixed(1);
  const avgTemp = (data.reduce((s, d) => s + d.temp, 0) / data.length).toFixed(1);
  const avgNutrients = (data.reduce((s, d) => s + d.nutrients, 0) / data.length).toFixed(0);

  const charts = [
    {
      label: 'Soil Moisture', unit: '%', icon: Droplets,
      color: '#6B8F5E', colorClass: 'text-sage', bgClass: 'bg-sage/10 border-sage/20',
      gradientId: 'moistureGrad', dataKey: 'moisture', domain: [0, 100] as [number, number],
      liveVal: sensors.soilMoisture.toFixed(1), avgVal: avgMoisture, optimal: '65–80%',
      isGood: sensors.soilMoisture >= 65 && sensors.soilMoisture <= 80,
    },
    {
      label: 'Soil Temperature', unit: '°C', icon: Thermometer,
      color: '#D4A843', colorClass: 'text-primary', bgClass: 'bg-primary/10 border-primary/20',
      gradientId: 'tempGrad', dataKey: 'temp', domain: [10, 40] as [number, number],
      liveVal: sensors.soilTemperature.toFixed(1), avgVal: avgTemp, optimal: '20–28°C',
      isGood: sensors.soilTemperature >= 20 && sensors.soilTemperature <= 28,
    },
    {
      label: 'Nutrient Index', unit: '', icon: Leaf,
      color: '#C0622A', colorClass: 'text-destructive', bgClass: 'bg-destructive/10 border-destructive/20',
      gradientId: 'nutrientGrad', dataKey: 'nutrients', domain: [30, 80] as [number, number],
      liveVal: sensors.nutrientLevel, avgVal: avgNutrients, optimal: 'High',
      isGood: sensors.nutrientLevel === 'High',
    },
  ];

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
          <Activity className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">Sensor Analytics</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">7-Day Historical Trends</p>
        </div>
      </motion.div>

      {/* Zone selector tabs */}
      <motion.div variants={stagger.item}>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="bg-muted/30 border border-border/50 p-1 mb-4 w-fit">
            <TabsTrigger value="all" className="text-xs font-semibold data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md">All Zones</TabsTrigger>
            <TabsTrigger value="north" className="text-xs font-semibold data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md">North Field</TabsTrigger>
            <TabsTrigger value="south" className="text-xs font-semibold data-[state=active]:bg-primary/15 data-[state=active]:text-primary rounded-md">South Field</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Live snapshot cards */}
      <motion.section variants={stagger.item} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Moisture', val: `${sensors.soilMoisture.toFixed(1)}%`, icon: Droplets, color: 'text-sage', bg: 'bg-sage/10 border-sage/20' },
          { label: 'Temp', val: `${sensors.soilTemperature.toFixed(1)}°C`, icon: Thermometer, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
          { label: 'pH', val: sensors.soilPh.toFixed(1), icon: Beaker, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
        ].map(({ label, val, icon: Icon, color, bg }) => (
          <Card key={label} className="border border-border/50 bg-card/80 rounded-xl hover:border-primary/20 transition-colors">
            <CardContent className="p-3.5 space-y-2 flex flex-col items-center text-center">
              <div className={cn("w-8 h-8 rounded-full border flex items-center justify-center mb-1", bg)}>
                <Icon className={cn("w-4 h-4", color)} />
              </div>
              <p className="font-mono text-base font-bold leading-none tracking-tight animate-sensor-pulse">{val}</p>
              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{label}</p>
            </CardContent>
          </Card>
        ))}
      </motion.section>

      {/* Charts */}
      {charts.map((chart, idx) => (
        <motion.div key={chart.label} variants={stagger.item}>
          <Card className="border border-border/50 bg-card/80 rounded-2xl overflow-hidden hover:border-primary/15 transition-colors">
            <CardContent className="p-5 space-y-4">
              {/* Chart header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg border", chart.bgClass)}>
                    <chart.icon className={cn("w-4 h-4", chart.colorClass)} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{chart.label}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-0.5">Optimal: {chart.optimal}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1.5 justify-end mb-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-live-dot" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Live</p>
                  </div>
                  <p className={cn("font-mono text-lg font-bold tracking-tight", chart.isGood ? "text-sage" : "text-destructive")}>
                    {chart.liveVal}<span className="text-xs font-semibold">{chart.unit}</span>
                  </p>
                </div>
              </div>

              {/* Anomaly highlight */}
              {!chart.isGood && (
                <div className="flex items-center gap-2 bg-destructive/8 border border-destructive/20 px-3 py-1.5 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                  <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">Outside optimal range</span>
                </div>
              )}

              {/* Chart */}
              <div className="h-[160px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id={chart.gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={chart.color} stopOpacity={0.25} />
                        <stop offset="95%" stopColor={chart.color} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(132 10% 22%)" opacity={0.5} />
                    <XAxis dataKey="date" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'hsl(40 12% 60%)' }} dy={10} />
                    <YAxis fontSize={10} axisLine={false} tickLine={false} domain={chart.domain} tick={{ fill: 'hsl(40 12% 60%)' }} dx={-10} />
                    <Tooltip
                      contentStyle={{ borderRadius: '10px', border: '1px solid hsl(132 10% 22%)', background: 'hsl(132 16% 14%)', fontSize: '12px', padding: '8px 14px', color: 'hsl(40 25% 92%)' }}
                      itemStyle={{ fontWeight: 600, color: 'hsl(40 25% 92%)' }}
                      cursor={{ stroke: chart.color, strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Area
                      type="monotone"
                      dataKey={chart.dataKey}
                      stroke={chart.color}
                      strokeWidth={2}
                      fillOpacity={1}
                      fill={`url(#${chart.gradientId})`}
                      dot={false}
                      activeDot={{ r: 4, fill: chart.color, strokeWidth: 0 }}
                      isAnimationActive={true}
                      animationBegin={idx * 200}
                      animationDuration={1200}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Avg stat */}
              <div className="flex items-center justify-between px-1 border-t border-border/30 pt-3">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">7-Day Average</p>
                <p className="font-mono text-xs font-bold">{chart.avgVal}{chart.unit}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Tip */}
      <motion.div variants={stagger.item} className="bg-muted/30 p-4 rounded-xl border border-border/50 flex items-start gap-3">
        <span className="text-lg leading-none pt-0.5">💡</span>
        <p className="text-xs font-medium text-foreground leading-relaxed">
          Monitor these trends daily. Sudden drops in moisture or spikes in temperature may indicate irrigation issues or unexpected weather impact.
        </p>
      </motion.div>
    </motion.div>
  );
}
