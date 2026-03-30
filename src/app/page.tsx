"use client";

import { useState, useEffect } from 'react';
import {
  Droplets, Thermometer, Beaker, Leaf, Zap, Target,
  Plus, Check, Trash2, Cloud, TrendingUp, ArrowUpRight,
  Sprout, Sun, Wind, ChevronRight
} from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Types ───
interface Task {
  id: string;
  title: string;
  completed: boolean;
  date: string;
}

const DEFAULT_TASKS: Task[] = [
  { id: '1', title: 'Check irrigation valves in sector A', completed: false, date: format(new Date(), 'yyyy-MM-dd') },
  { id: '2', title: 'Run canopy health scan via drone', completed: false, date: format(new Date(), 'yyyy-MM-dd') },
  { id: '3', title: 'Calibrate soil sensors for pH drift', completed: false, date: format(new Date(), 'yyyy-MM-dd') },
];

// ─── Animations ───
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
} as const;

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.45, ease: "easeOut" as const }
  }
} as const;

export default function HomeDashboard() {
  const { sensors, lastUpdated, settings, t } = useSensors();
  const [mounted, setMounted] = useState(false);
  const [irrigationOn, setIrrigationOn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    setMounted(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    const saved = localStorage.getItem('agrisense_tasks_v4');
    if (saved) {
      const parsed: Task[] = JSON.parse(saved);
      setTasks(parsed.map(t => ({ ...t, completed: t.date === today ? t.completed : false, date: today })));
    }
    const valve = localStorage.getItem('agrisense_valve');
    if (valve) setIrrigationOn(valve === 'true');
  }, []);

  const persistTasks = (updated: Task[]) => {
    setTasks(updated);
    localStorage.setItem('agrisense_tasks_v4', JSON.stringify(updated));
  };

  const toggleTask = (id: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    persistTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, date: today } : t));
  };

  const deleteTask = (id: string) => persistTasks(tasks.filter(t => t.id !== id));

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    persistTasks([...tasks, { id: Date.now().toString(), title: newTaskTitle.trim(), completed: false, date: format(new Date(), 'yyyy-MM-dd') }]);
    setNewTaskTitle('');
    setShowInput(false);
  };

  const toggleValve = () => {
    const next = !irrigationOn;
    setIrrigationOn(next);
    localStorage.setItem('agrisense_valve', String(next));
  };

  const calculateHealthScore = () => {
    let score = 100;
    if (sensors.soilMoisture < 60 || sensors.soilMoisture > 85) score -= 15;
    if (sensors.soilTemperature < 20 || sensors.soilTemperature > 30) score -= 10;
    if (sensors.soilPh < 5.5 || sensors.soilPh > 7.5) score -= 15;
    if (sensors.nutrientLevel === 'Low') score -= 20;
    return Math.max(0, score);
  };

  const healthScore = calculateHealthScore();
  const completedCount = tasks.filter(t => t.completed).length;

  // Status helpers
  const getStatusDot = (score: number) => {
    if (score >= 85) return 'optimal';
    if (score >= 60) return 'warning';
    return 'critical';
  };

  const getStatusLabel = (score: number) => {
    if (score >= 85) return 'Healthy';
    if (score >= 60) return 'Needs Attention';
    return 'Critical';
  };

  const getSensorStatus = (val: number | string, type: string): string => {
    if (typeof val === 'string') return val === 'Low' ? 'critical' : val === 'Medium' ? 'warning' : 'optimal';
    if (type === 'moisture') return val < 65 || val > 85 ? 'critical' : val < 70 || val > 80 ? 'warning' : 'optimal';
    if (type === 'temp') return val < 20 || val > 30 ? 'critical' : val < 22 || val > 26 ? 'warning' : 'optimal';
    if (type === 'ph') return val < 5.5 || val > 7.5 ? 'critical' : val < 6.0 || val > 7.0 ? 'warning' : 'optimal';
    return 'optimal';
  };

  if (!mounted) return null;

  const sensorData = [
    { label: t('dashboard_moisture'), value: sensors.soilMoisture.toFixed(1), unit: '%', icon: Droplets, accent: 'stat-green', status: getSensorStatus(sensors.soilMoisture, 'moisture'), range: '70–80%' },
    { label: t('dashboard_temp'), value: sensors.soilTemperature.toFixed(1), unit: '°C', icon: Thermometer, accent: 'stat-amber', status: getSensorStatus(sensors.soilTemperature, 'temp'), range: '22–26°C' },
    { label: t('dashboard_ph'), value: sensors.soilPh.toFixed(1), unit: 'pH', icon: Beaker, accent: 'stat-blue', status: getSensorStatus(sensors.soilPh, 'ph'), range: '6.0–7.0' },
    { label: t('dashboard_nutrients'), value: sensors.nutrientLevel, unit: '', icon: Leaf, accent: 'stat-green', status: getSensorStatus(sensors.nutrientLevel, 'nutrients'), range: 'High' },
  ];

  return (
    <div className="space-y-8">
      {/* ═══ Hero Section ═══ */}
      <motion.section 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-card to-card border border-border p-6 md:p-8"
        custom={0} variants={fadeUp} initial="hidden" animate="visible"
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className={cn("status-dot", getStatusDot(healthScore))} />
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{getStatusLabel(healthScore)}</span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground leading-tight">
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'} 👋
            </h2>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              {healthScore >= 85 
                ? `Your ${settings.cropType || 'crop'} field is thriving. All sensors are within optimal ranges and the ecosystem is stable.`
                : `Some readings need attention in your ${settings.cropType || 'crop'} field. Review the sensor data below for details.`}
            </p>
          </div>

          {/* Health Score Circle */}
          <div className="flex items-center gap-6">
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
                <motion.circle 
                  cx="60" cy="60" r="52" fill="none" 
                  stroke={healthScore >= 85 ? '#6EE7A8' : healthScore >= 60 ? '#D4A854' : '#EF6461'}
                  strokeWidth="6" strokeLinecap="round"
                  initial={{ strokeDashoffset: 327 }}
                  animate={{ strokeDashoffset: 327 - (327 * healthScore / 100) }}
                  strokeDasharray="327"
                  transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-3xl font-bold text-foreground">{healthScore}</span>
                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Score</span>
              </div>
            </div>
            <div className="hidden md:flex flex-col gap-1.5 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-accent" /> Day 42 of cycle</div>
              <div className="flex items-center gap-1.5"><Wind className="w-3.5 h-3.5" /> Updated {format(lastUpdated, 'h:mm a')}</div>
              <div className="flex items-center gap-1.5"><Sprout className="w-3.5 h-3.5 text-primary" /> {settings.cropType}</div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ Sensor Grid ═══ */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg font-semibold text-foreground">Sensor Telemetry</h3>
          <Link href="/sensors" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
            View All <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 stagger-children">
          {sensorData.map((sensor, i) => (
            <motion.div
              key={i}
              className={cn("stat-card", sensor.accent)}
              custom={i + 1} variants={fadeUp} initial="hidden" animate="visible"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
                  <sensor.icon className="w-4 h-4 text-muted-foreground" strokeWidth={1.8} />
                </div>
                <div className={cn("status-dot", sensor.status)} />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="font-display text-2xl md:text-3xl font-bold text-foreground">{sensor.value}</span>
                <span className="text-sm text-muted-foreground font-medium">{sensor.unit}</span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-muted-foreground font-medium truncate">{sensor.label}</span>
                <span className="font-mono text-[9px] text-muted-foreground/60">{sensor.range}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══ Quick Actions + Task Feed ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Actions */}
        <motion.div className="lg:col-span-2 space-y-4" custom={5} variants={fadeUp} initial="hidden" animate="visible">
          <h3 className="font-display text-lg font-semibold text-foreground">Quick Actions</h3>
          
          {/* Irrigation Toggle */}
          <button 
            onClick={toggleValve} 
            className={cn(
              "w-full text-left rounded-xl p-5 border transition-all duration-300 group",
              irrigationOn 
                ? "bg-primary/10 border-primary/30 shadow-glow" 
                : "bg-card border-border hover:border-primary/20 hover:shadow-card-hover"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                irrigationOn ? "bg-primary/20" : "bg-secondary"
              )}>
                <Zap className={cn("w-5 h-5", irrigationOn ? "text-primary" : "text-muted-foreground")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-semibold text-foreground">{t('dashboard_smart_valve')}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {irrigationOn ? 'System active · Dispensing water' : 'Tap to activate irrigation'}
                </p>
              </div>
              <div className={cn(
                "w-10 h-6 rounded-full p-0.5 transition-colors",
                irrigationOn ? "bg-primary" : "bg-border"
              )}>
                <motion.div 
                  className="w-5 h-5 rounded-full bg-foreground shadow-sm"
                  animate={{ x: irrigationOn ? 16 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </div>
            </div>
          </button>

          {/* Disease Scanner */}
          <Link 
            href="/diagnosis" 
            className="block rounded-xl p-5 border border-border bg-card hover:border-primary/20 hover:shadow-card-hover transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-destructive group-hover:rotate-12 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-semibold text-foreground">{t('dashboard_disease_scan')}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Upload photo for AI analysis</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Weather Quick Card */}
          <Link 
            href="/weather" 
            className="block rounded-xl p-5 border border-border bg-card hover:border-accent/20 hover:shadow-glow-amber transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Cloud className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-semibold text-foreground">Weather Forecast</p>
                <p className="text-xs text-muted-foreground mt-0.5">Partly cloudy · 28°C expected</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Market Quick Card */}
          <Link 
            href="/prices" 
            className="block rounded-xl p-5 border border-border bg-card hover:border-primary/20 hover:shadow-card-hover transition-all duration-300 group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-sm font-semibold text-foreground">Market Prices</p>
                <p className="text-xs text-muted-foreground mt-0.5">{settings.cropType} trending up ↗</p>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>

        {/* Right: Task Feed */}
        <motion.div className="lg:col-span-3" custom={6} variants={fadeUp} initial="hidden" animate="visible">
          <div className="rounded-xl border border-border bg-card overflow-hidden h-full flex flex-col">
            {/* Task Header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-secondary/50">
              <div>
                <h3 className="font-display text-lg font-semibold text-foreground">Today's Tasks</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{completedCount} of {tasks.length} completed</p>
              </div>
              <button
                onClick={() => setShowInput(!showInput)}
                className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Progress bar */}
            <div className="h-1 bg-border">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: tasks.length > 0 ? `${(completedCount / tasks.length) * 100}%` : '0%' }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            {/* Add task input */}
            <AnimatePresence>
              {showInput && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-b border-border overflow-hidden"
                >
                  <div className="flex gap-2 p-3">
                    <input
                      autoFocus
                      type="text"
                      value={newTaskTitle}
                      onChange={e => setNewTaskTitle(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') addTask(); if (e.key === 'Escape') setShowInput(false); }}
                      placeholder="Add a new task..."
                      className="flex-1 bg-secondary rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                    />
                    <button onClick={addTask} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                      Add
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Task List */}
            <div className="flex-1 divide-y divide-border overflow-y-auto max-h-[400px]">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-secondary/30 transition-colors group cursor-pointer"
                  onClick={() => toggleTask(task.id)}
                >
                  <button className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all",
                    task.completed 
                      ? "bg-primary border-primary" 
                      : "border-border group-hover:border-primary/50"
                  )}>
                    {task.completed && <Check className="w-3 h-3 text-primary-foreground" strokeWidth={3} />}
                  </button>
                  <span className={cn(
                    "flex-1 text-sm font-medium transition-colors",
                    task.completed ? "text-muted-foreground line-through" : "text-foreground"
                  )}>
                    {task.title}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); deleteTask(task.id); }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {tasks.length === 0 && (
                <div className="py-12 text-center">
                  <Sprout className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No tasks yet. Add one above!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
