"use client";

import { Card, CardContent } from '@/components/ui/card';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Droplets, Thermometer, Beaker, Leaf, Activity } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import { cn } from '@/lib/utils';

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

export default function SensorAnalytics() {
  const { sensors } = useSensors();
  const data = buildChartData();
  const avgMoisture = (data.reduce((s, d) => s + d.moisture, 0) / data.length).toFixed(1);
  const avgTemp = (data.reduce((s, d) => s + d.temp, 0) / data.length).toFixed(1);
  const avgNutrients = (data.reduce((s, d) => s + d.nutrients, 0) / data.length).toFixed(0);

  const charts = [
    {
      label: 'Soil Moisture',
      unit: '%',
      icon: Droplets,
      color: '#3b82f6',
      colorClass: 'text-blue-500',
      bgClass: 'bg-blue-500/10',
      gradientId: 'moistureGrad',
      dataKey: 'moisture',
      domain: [0, 100] as [number, number],
      liveVal: sensors.soilMoisture.toFixed(1),
      avgVal: avgMoisture,
      optimal: '65–80%',
      isGood: sensors.soilMoisture >= 65 && sensors.soilMoisture <= 80,
    },
    {
      label: 'Soil Temperature',
      unit: '°C',
      icon: Thermometer,
      color: '#f97316',
      colorClass: 'text-orange-500',
      bgClass: 'bg-orange-500/10',
      gradientId: 'tempGrad',
      dataKey: 'temp',
      domain: [10, 40] as [number, number],
      liveVal: sensors.soilTemperature.toFixed(1),
      avgVal: avgTemp,
      optimal: '20–28°C',
      isGood: sensors.soilTemperature >= 20 && sensors.soilTemperature <= 28,
    },
    {
      label: 'Nutrient Index',
      unit: '',
      icon: Leaf,
      color: '#10b981',
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10',
      gradientId: 'nutrientGrad',
      dataKey: 'nutrients',
      domain: [30, 80] as [number, number],
      liveVal: sensors.nutrientLevel,
      avgVal: avgNutrients,
      optimal: 'High',
      isGood: sensors.nutrientLevel === 'High',
    },
  ];

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-6 duration-700">

      {/* Header */}
      <div className="flex items-center gap-3 px-1">
        <div className="bg-primary/10 p-3 rounded-2xl">
          <Activity className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-primary">Sensor Analytics</h2>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">7-Day Historical Trends</p>
        </div>
      </div>

      {/* Live snapshot cards */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { label: 'Moisture', val: `${sensors.soilMoisture.toFixed(1)}%`, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Temp', val: `${sensors.soilTemperature.toFixed(1)}°C`, icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'pH', val: sensors.soilPh.toFixed(1), icon: Beaker, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map(({ label, val, icon: Icon, color, bg }) => (
          <Card key={label} className="border-none shadow-sm bg-card/40 backdrop-blur-md rounded-[1.5rem] border border-white/10">
            <CardContent className="p-4 space-y-2">
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", bg)}>
                <Icon className={cn("w-4 h-4", color)} />
              </div>
              <p className="text-lg font-black leading-none">{val}</p>
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Charts */}
      {charts.map((chart) => (
        <Card key={chart.label} className="border-none shadow-sm bg-card/40 backdrop-blur-md rounded-[2rem] border border-white/10 overflow-hidden">
          <CardContent className="p-5 space-y-4">
            {/* Chart header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("p-2 rounded-xl", chart.bgClass)}>
                  <chart.icon className={cn("w-4 h-4", chart.colorClass)} />
                </div>
                <div>
                  <p className="text-xs font-black">{chart.label}</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-bold">Optimal: {chart.optimal}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-muted-foreground">LIVE</p>
                <p className={cn("text-lg font-black", chart.isGood ? "text-emerald-500" : "text-destructive")}>
                  {chart.liveVal}{chart.unit}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[160px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id={chart.gradientId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={chart.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={chart.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="date" fontSize={9} axisLine={false} tickLine={false} tick={{ fill: '#888' }} />
                  <YAxis fontSize={9} axisLine={false} tickLine={false} domain={chart.domain} tick={{ fill: '#888' }} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '11px' }}
                    cursor={{ stroke: chart.color, strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey={chart.dataKey}
                    stroke={chart.color}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#${chart.gradientId})`}
                    dot={false}
                    activeDot={{ r: 5, fill: chart.color, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Avg stat */}
            <div className="flex items-center justify-between px-1">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">7-Day Average</p>
              <p className="text-xs font-black">{chart.avgVal}{chart.unit}</p>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Tip */}
      <div className="bg-primary/5 p-5 rounded-[1.5rem] border border-primary/10 flex items-start gap-3">
        <span className="text-xl">💡</span>
        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
          Monitor these trends daily. Sudden drops in moisture or spikes in temperature may indicate irrigation issues or unexpected weather impact.
        </p>
      </div>

    </div>
  );
}
