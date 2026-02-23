"use client";

import { useState, useEffect } from 'react';
import { Droplets, Thermometer, Beaker, Leaf, CheckCircle2, Circle, Star, Sparkles, ShieldCheck, Zap, AlertCircle, TrendingUp, Timer, Plus, Trash2, Crown, ArrowRight, BookOpen, Plane, LayoutGrid, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSensors } from '@/context/SensorContext';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  icon: string;
  date: string;
}

const DEFAULT_TASKS: Task[] = [
  { id: '1', title: 'Morning Irrigation', completed: false, icon: '💧', date: format(new Date(), 'yyyy-MM-dd') },
  { id: '2', title: 'Check Crop Health', completed: false, icon: '🔎', date: format(new Date(), 'yyyy-MM-dd') },
  { id: '3', title: 'Apply Organic Fertilizer', completed: false, icon: '🌱', date: format(new Date(), 'yyyy-MM-dd') },
];

const TASK_ICONS = ['💧', '🌱', '🔎', '🚜', '🌾', '🧪', '📦', '🌿', '🛒', '⚡'];

export default function HomeDashboard() {
  const { sensors, lastUpdated, settings, t } = useSensors();
  const [mounted, setMounted] = useState(false);
  const [irrigationOn, setIrrigationOn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    setMounted(true);
    // Load tasks from localStorage
    const today = format(new Date(), 'yyyy-MM-dd');
    const saved = localStorage.getItem('agrisense_tasks');
    if (saved) {
      const parsed: Task[] = JSON.parse(saved);
      // Reset completion for new day
      const todayTasks = parsed.map(t => ({
        ...t,
        completed: t.date === today ? t.completed : false,
        date: today,
      }));
      setTasks(todayTasks);
    }
    // Load irrigation state
    const valve = localStorage.getItem('agrisense_valve');
    if (valve) setIrrigationOn(valve === 'true');
  }, []);

  const persistTasks = (updated: Task[]) => {
    setTasks(updated);
    localStorage.setItem('agrisense_tasks', JSON.stringify(updated));
  };

  const toggleTask = (id: string) => {
    const today = format(new Date(), 'yyyy-MM-dd');
    persistTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed, date: today } : t));
  };

  const deleteTask = (id: string) => {
    persistTasks(tasks.filter(t => t.id !== id));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const icon = TASK_ICONS[Math.floor(Math.random() * TASK_ICONS.length)];
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      completed: false,
      icon,
      date: format(new Date(), 'yyyy-MM-dd'),
    };
    persistTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setAddingTask(false);
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

  if (!mounted) return null;

  return (
    <div className="space-y-7 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out pb-24">
      {/* Live Alert */}
      {sensors.soilMoisture < 65 && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-3xl flex items-center gap-3 animate-bounce shadow-lg">
          <AlertCircle className="w-5 h-5 text-destructive" />
          <p className="text-[10px] font-black text-destructive uppercase tracking-widest">
            {t('settings_alerts')}: {t('dashboard_moisture')} ({sensors.soilMoisture.toFixed(1)}%)
          </p>
        </div>
      )}

      {/* Farm Health Summary */}
      <section className="relative overflow-hidden rounded-[2.5rem] p-7 text-white shadow-premium health-gradient-excellent group border-none">
        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-xl font-black uppercase tracking-widest text-white/90">{t('dashboard_integrity')}</h2>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2 mt-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <p className="text-[10px] font-bold text-white/90 tracking-[0.3em]">{t('dashboard_live')}</p>
              </div>
            </div>
            <div className="flex bg-white/10 backdrop-blur-xl px-4 py-1.5 rounded-full items-center gap-2 border border-white/20 shadow-lg">
              <Star className="w-3.5 h-3.5 fill-accent text-accent animate-spin-slow" />
              <span className="text-[10px] font-black uppercase tracking-widest">Premium Care</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse" />
              <div className="relative flex items-baseline gap-1">
                <span className="text-7xl font-black tracking-tighter text-glow">{healthScore}</span>
                <span className="text-xl font-bold opacity-60">/100</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white rounded-full transition-all duration-1000 ease-out" style={{ width: `${healthScore}%` }} />
              </div>
              <p className="text-xs font-bold opacity-90 leading-relaxed">
                {healthScore > 80 ? t('dashboard_health_excellent') : t('dashboard_health_stable')}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />
      </section>

      {/* Crop Lifecycle */}
      <Card className="border-none shadow-sm bg-primary/5 rounded-[2rem] border border-primary/10 overflow-hidden">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="bg-primary text-white p-3 rounded-2xl">
            <Timer className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t('dashboard_status_veg')}</span>
              <span className="text-[10px] font-black text-muted-foreground">Day 42 of 120</span>
            </div>
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '35%' }} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sensor Grid */}
      <section className="grid grid-cols-2 gap-4">
        {[
          { key: 'dashboard_moisture', val: sensors.soilMoisture, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-500/10', unit: '%', optimal: '70-80%' },
          { key: 'dashboard_temp', val: sensors.soilTemperature, icon: Thermometer, color: 'text-orange-500', bg: 'bg-orange-500/10', unit: '°C', optimal: '22-26°C' },
          { key: 'dashboard_ph', val: sensors.soilPh, icon: Beaker, color: 'text-purple-500', bg: 'bg-purple-500/10', unit: '', optimal: '6.0-7.0' },
          { key: 'dashboard_nutrients', val: sensors.nutrientLevel, icon: Leaf, color: 'text-green-500', bg: 'bg-green-500/10', unit: '', optimal: 'High' }
        ].map((sensor, idx) => (
          <Card key={idx} className="border-none shadow-md bg-card/40 backdrop-blur-md rounded-[2rem] group overflow-hidden border border-white/10 active:opacity-80 transition-opacity">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className={cn("p-2 rounded-2xl transition-transform group-hover:scale-110", sensor.bg)}>
                  <sensor.icon className={cn("w-5 h-5", sensor.color)} />
                </div>
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{t(sensor.key as any)}</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black">
                    {typeof sensor.val === 'number' ? sensor.val.toFixed(1) : sensor.val}
                  </span>
                  <span className="text-xs font-bold text-muted-foreground uppercase">{sensor.unit}</span>
                </div>
                <Progress
                  value={typeof sensor.val === 'number' ? (sensor.val / (sensor.key === 'dashboard_temp' ? 40 : sensor.key === 'dashboard_ph' ? 14 : 100)) * 100 : 85}
                  className="h-1.5 bg-muted/50"
                />
              </div>
              <p className="text-[9px] font-black text-muted-foreground/60 tracking-wider font-sans">{t('dashboard_range')}: {sensor.optimal}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Operational Log */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">{t('dashboard_ops_log')}</h3>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/5 text-primary text-[9px] font-black tracking-widest px-3 py-1 rounded-full">
              {completedCount}/{tasks.length} {t('dashboard_done')}
            </Badge>
            <button
              onClick={() => setAddingTask(!addingTask)}
              className="p-1.5 bg-primary/10 rounded-xl hover:bg-primary/20 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-primary" />
            </button>
          </div>
        </div>

        {/* Add Task Input */}
        {addingTask && (
          <div className="flex gap-2 animate-in slide-in-from-top-2 duration-200">
            <input
              autoFocus
              type="text"
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') addTask(); if (e.key === 'Escape') setAddingTask(false); }}
              placeholder={t('dashboard_task_placeholder')}
              className="flex-1 bg-muted/50 border-none rounded-2xl px-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={addTask} className="bg-primary text-white px-4 rounded-2xl font-black text-xs">{t('dashboard_add_btn')}</button>
          </div>
        )}

        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-card/40 backdrop-blur-sm border border-white/10 shadow-sm group hover:border-primary/30 transition-all active:scale-[0.98]"
            >
              <button onClick={() => toggleTask(task.id)} className="text-2xl group-hover:scale-110 transition-transform flex-shrink-0">
                {task.icon}
              </button>
              <div className="flex-1" onClick={() => toggleTask(task.id)}>
                <p className={cn("text-sm font-bold tracking-tight cursor-pointer", task.completed ? "text-muted-foreground line-through opacity-60" : "text-foreground")}>
                  {task.title}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleTask(task.id)}>
                  {task.completed ? (
                    <div className="bg-green-500/10 p-1.5 rounded-full">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground/40 hover:text-primary transition-colors" />
                  )}
                </button>
                <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
                  <Trash2 className="w-3.5 h-3.5 text-muted-foreground/50 hover:text-destructive transition-colors" />
                </button>
              </div>
            </div>
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 opacity-30">
              <p className="text-[9px] font-black uppercase tracking-widest">{t('dashboard_no_tasks')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-2 gap-4">
        <Button asChild variant="ghost" className="h-28 flex-col gap-3 rounded-[2rem] bg-card/40 border border-white/10 shadow-sm hover:bg-primary/5 hover:text-primary active:opacity-80 transition-all group">
          <Link href="/diagnosis">
            <ShieldCheck className="w-8 h-8 text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-primary">{t('dashboard_disease_scan')}</span>
          </Link>
        </Button>
        <Card className="border-none shadow-sm bg-card/40 backdrop-blur-md rounded-[2rem] border border-white/10 active:opacity-80 transition-opacity">
          <CardContent className="p-4 flex flex-col items-center justify-center gap-2 h-full">
            <div className={cn(
              "p-3 rounded-full transition-all duration-500",
              irrigationOn ? "bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" : "bg-muted"
            )}>
              <Zap className={cn("w-6 h-6", irrigationOn ? "text-white animate-pulse" : "text-muted-foreground")} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest">{t('dashboard_smart_valve')}</p>
            <button
              onClick={toggleValve}
              className={cn(
                "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                irrigationOn ? "bg-blue-500/20 text-blue-600" : "bg-muted/50 text-muted-foreground"
              )}
            >
              {irrigationOn ? t('dashboard_valve_active') : t('dashboard_valve_off')}
            </button>
          </CardContent>
        </Card>

        {/* Second Row of Quick Actions */}
        <Button asChild variant="ghost" className="h-28 flex-col gap-3 rounded-[2rem] bg-card/40 border border-white/10 shadow-sm hover:bg-primary/5 hover:text-cyan-500 active:opacity-80 transition-all group">
          <Link href="/services">
            <Plane className="w-8 h-8 text-cyan-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-cyan-500">{t('more_drone')}</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" className="h-28 flex-col gap-3 rounded-[2rem] bg-card/40 border border-white/10 shadow-sm hover:bg-primary/5 hover:text-orange-500 active:opacity-80 transition-all group">
          <Link href="/more">
            <LayoutGrid className="w-8 h-8 text-orange-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground group-hover:text-orange-500">{t('nav_more')}</span>
          </Link>
        </Button>
      </section>

      {/* Bottom CTA Section - Standardized Sizes & Hover Animations */}
      <div className="space-y-4">
        {/* Premium Upgrade CTA */}
        <Card className="border-none shadow-premium bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 rounded-[2rem] overflow-hidden group active:opacity-80 transition-all hover:-translate-y-1 h-[100px]">
          <Link href="/subscription" className="block h-full">
            <CardContent className="p-6 flex items-center justify-between h-full">
              <div className="flex items-center gap-4">
                <div className="bg-amber-500 p-3 rounded-2xl shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-amber-900 dark:text-amber-200 uppercase tracking-wider leading-none">AgriSense Premium</h3>
                  <p className="text-[10px] font-bold text-amber-700/80 dark:text-amber-400/80 mt-1">{t('dashboard_premium_desc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-500 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase shadow-lg group-hover:px-6 transition-all shrink-0">
                {t('dashboard_premium_upgrade')}
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* Market Alert */}
        <Card className="border-none shadow-lg bg-orange-500/10 border border-orange-500/20 rounded-[2rem] overflow-hidden group active:opacity-80 transition-all hover:-translate-y-1 h-[100px]">
          <Link href="/prices" className="block h-full">
            <CardContent className="p-6 flex items-center justify-between h-full">
              <div className="flex items-center gap-3">
                <div className="bg-orange-500 text-white p-3 rounded-xl shadow-lg">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400 leading-none">{t('dashboard_market_alert')}</p>
                  <p className="text-sm font-bold mt-1.5">{typeof settings.cropType === 'string' ? settings.cropType : 'Paddy'} {t('dashboard_market_desc')} 4.2%</p>
                </div>
              </div>
              <div className="text-orange-600 dark:text-orange-400 font-black text-[10px] uppercase flex items-center gap-1 bg-orange-500/10 px-4 py-2 rounded-full group-hover:gap-2 transition-all shrink-0">
                {t('dashboard_view_all_btn')}
                <ChevronRight className="w-3 h-3" />
              </div>
            </CardContent>
          </Link>
        </Card>

        {/* Education Hub CTA */}
        <Card className="border-none shadow-premium bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20 rounded-[2rem] overflow-hidden group active:opacity-80 transition-all hover:-translate-y-1 h-[100px]">
          <Link href="/education" className="block h-full">
            <CardContent className="p-6 flex items-center justify-between h-full">
              <div className="flex items-center gap-4">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-blue-900 dark:text-blue-200 uppercase tracking-wider leading-none">{t('dashboard_edu_hub')}</h3>
                  <p className="text-[10px] font-bold text-blue-700/80 dark:text-blue-400/80 mt-1">{t('dashboard_edu_desc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase shadow-lg group-hover:px-6 transition-all shrink-0">
                {t('dashboard_learn')}
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </CardContent>
          </Link>
        </Card>
      </div>

      <Button asChild className="w-full h-18 text-lg font-black bg-primary hover:bg-primary/95 shadow-[0_15px_30px_rgba(56,102,65,0.3)] rounded-[2rem] transition-all hover:-translate-y-1 active:scale-95 border-none">
        <Link href="/advisor" className="flex items-center justify-center gap-3">
          <Sparkles className="w-6 h-6 text-accent animate-pulse" />
          {t('dashboard_advisor_btn')}
        </Link>
      </Button>

      <footer className="text-center pt-4 opacity-50 pb-10">
        <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.3em] flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          {t('dashboard_synced')}: {format(lastUpdated, 'HH:mm:ss')}
        </p>
      </footer>
    </div>
  );
}
