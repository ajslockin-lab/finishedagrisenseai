"use client";

import { useState, useEffect } from 'react';
import { Droplets, Thermometer, Beaker, Leaf, CheckCircle2, Circle, Star, Sparkles, ShieldCheck, Zap, AlertCircle, TrendingUp, Timer, Plus, Trash2, Crown, ChevronRight, LayoutGrid, Plane, BookOpen, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSensors } from '@/context/SensorContext';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  icon: string;
  date: string;
}

const DEFAULT_TASKS: Task[] = [
  { id: '1', title: 'Morning Irrigation Check', completed: false, icon: '💧', date: format(new Date(), 'yyyy-MM-dd') },
  { id: '2', title: 'Analyze Canopy Health', completed: false, icon: '🔎', date: format(new Date(), 'yyyy-MM-dd') },
  { id: '3', title: 'Calibrate Ph Sensors', completed: false, icon: '🧪', date: format(new Date(), 'yyyy-MM-dd') },
];

const TASK_ICONS = ['💧', '🌱', '🔎', '🚜', '🌾', '🧪', '📦', '🌿', '🛒', '⚡'];

// Smoother, more floating spatial animations
const spatialStagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
} as const;

const spatialItem = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
} as const;

export default function HomeDashboard() {
  const { sensors, lastUpdated, settings, t } = useSensors();
  const [mounted, setMounted] = useState(false);
  const [irrigationOn, setIrrigationOn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [addingTask, setAddingTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  useEffect(() => {
    setMounted(true);
    const today = format(new Date(), 'yyyy-MM-dd');
    const saved = localStorage.getItem('agrisense_tasks');
    if (saved) {
      const parsed: Task[] = JSON.parse(saved);
      const todayTasks = parsed.map(t => ({
        ...t,
        completed: t.date === today ? t.completed : false,
        date: today,
      }));
      setTasks(todayTasks);
    }
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
  const isOptimal = healthScore > 80;

  if (!mounted) return null;

  const sensorCards = [
    { key: 'dashboard_moisture', val: sensors.soilMoisture, icon: Droplets, unit: '%', optimal: '70–80%', color: 'from-blue-400 to-cyan-300', text: 'text-cyan-300' },
    { key: 'dashboard_temp', val: sensors.soilTemperature, icon: Thermometer, unit: '°C', optimal: '22–26°C', color: 'from-amber-400 to-orange-400', text: 'text-amber-400' },
    { key: 'dashboard_ph', val: sensors.soilPh, icon: Beaker, unit: '', optimal: '6.0–7.0', color: 'from-purple-400 to-pink-400', text: 'text-purple-400' },
    { key: 'dashboard_nutrients', val: sensors.nutrientLevel, icon: Leaf, unit: '', optimal: 'High', color: 'from-sage-light to-emerald-400', text: 'text-sage-light' },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Absolute ambient background */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-ambient animate-ambient-shift opacity-70" />

      <motion.div
        className="relative z-10 space-y-8 pb-12"
        variants={spatialStagger}
        initial="hidden"
        animate="visible"
      >
        {/* ═══ Header ═══ */}
        <motion.div variants={spatialItem} className="flex justify-between items-center px-2 pt-2">
          <div>
            <h1 className="font-display text-2xl font-semibold tracking-tight">AgriSense</h1>
            <p className="text-sm text-white/50">{settings.cropType || 'Paddy Field'} Alpha</p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 shadow-spatial-sm px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-subtle" />
            <span className="text-[10px] font-semibold text-white/70 uppercase tracking-widest">{t('dashboard_live')}</span>
          </div>
        </motion.div>

        {/* ═══ Live Alert Banner ═══ */}
        <AnimatePresence>
          {sensors.soilMoisture < 65 && (
            <motion.div 
              variants={spatialItem} 
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              className="bg-destructive/10 backdrop-blur-md border border-destructive/20 shadow-spatial-sm px-5 py-4 rounded-2xl flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center shrink-0 shadow-inner">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-destructive">{t('settings_alerts')}</h4>
                <p className="text-xs text-destructive/80 mt-0.5">
                  {t('dashboard_moisture')} ({sensors.soilMoisture.toFixed(1)}%) — below optimal range. Turn on irrigation.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Hero Health Sphere ═══ */}
        <motion.section variants={spatialItem} className="relative overflow-visible">
          <div className={cn(
            "glass-panel rounded-[2rem] p-8 md:p-10 relative overflow-hidden transition-colors duration-1000",
            isOptimal ? "bg-white/[0.03]" : "bg-white/[0.01]"
          )}>
            {/* Soft inner glow */}
            <div className={cn(
               "absolute -top-32 -right-32 w-96 h-96 rounded-full blur-[80px] opacity-20 pointer-events-none transition-colors duration-1000",
               isOptimal ? "bg-sage" : "bg-destructive"
            )} />

            <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-12 relative z-10">
              
              {/* Ethereal Gauge */}
              <div className="flex-shrink-0 relative w-40 h-40 md:w-48 md:h-48 mx-auto md:mx-0">
                <div className="absolute inset-0 animate-breathe-spatial">
                  <svg className="w-full h-full -rotate-90 drop-shadow-xl" viewBox="0 0 100 100">
                    <circle className="text-white/5" strokeWidth="3" stroke="currentColor" fill="transparent" r="46" cx="50" cy="50" />
                    <motion.circle
                      className={cn("transition-colors duration-1000", isOptimal ? "text-primary" : "text-amber-500")}
                      strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 46}`}
                      strokeDashoffset={2 * Math.PI * 46 * (1 - healthScore / 100)}
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="transparent"
                      r="46" cx="50" cy="50"
                      initial={{ strokeDashoffset: 2 * Math.PI * 46 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - healthScore / 100) }}
                      transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </svg>
                </div>
                
                {/* Center score */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="font-display text-5xl font-light tracking-tighter text-white text-glow-subtle">{healthScore}</span>
                  <span className="text-[10px] font-semibold text-white/40 uppercase tracking-[0.2em] mt-1">
                    {t('dashboard_integrity')}
                  </span>
                </div>
              </div>

              {/* Info section */}
              <div className="flex-1 space-y-6 text-center md:text-left">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-3 shadow-[0_2px_10px_rgba(0,0,0,0.2)]">
                    <Star className="w-3 h-3 text-gold fill-gold" />
                    <span className="text-[10px] font-semibold text-gold uppercase tracking-widest">Premium Analysis</span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-medium tracking-tight text-white mb-2">
                    {isOptimal ? t('dashboard_health_excellent') : t('dashboard_health_stable')}
                  </h2>
                  <p className="text-sm text-white/60 leading-relaxed font-body">
                    The ecosystem is maintaining perfect equilibrium. Soil nutrients are absorbing perfectly, and light levels are optimal for the vegetative stage.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ═══ Crop Lifecycle ═══ */}
        <motion.div variants={spatialItem}>
          <div className="glass-panel rounded-2xl p-5 flex items-center gap-5">
            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10 shadow-inner">
              <Clock className="w-5 h-5 text-white/50" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-baseline mb-3">
                <span className="text-sm font-medium text-white/90">{t('dashboard_status_veg')}</span>
                <span className="text-xs font-mono text-white/40 tracking-wider">Day 42 / 120</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                <motion.div
                  className="h-full bg-gradient-to-r from-accent to-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: '35%' }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ═══ Sensor Grid — Spatial Glass ═══ */}
        <motion.section variants={spatialItem} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {sensorCards.map((sensor, idx) => (
            <motion.div
              key={idx}
              variants={spatialItem}
              whileHover={{ y: -4, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="glass-panel rounded-[1.5rem] p-5 h-full relative group">
                <div className={cn("absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-[1.5rem] bg-gradient-to-br", sensor.color)} />
                
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest leading-tight w-2/3">
                    {t(sensor.key as any)}
                  </span>
                  <sensor.icon className={cn("w-5 h-5", sensor.text, "opacity-70 group-hover:opacity-100 transition-opacity")} />
                </div>
                
                <div className="flex items-baseline gap-1 mt-auto">
                  <span className="font-display text-3xl font-light tracking-tight text-white">
                    {typeof sensor.val === 'number' ? sensor.val.toFixed(1) : sensor.val}
                  </span>
                  <span className="text-sm font-medium text-white/40">{sensor.unit}</span>
                </div>
                <p className="text-[10px] text-white/30 mt-2 font-mono">{t('dashboard_range')}: {sensor.optimal}</p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        {/* ═══ Operational spatial list ═══ */}
        <motion.section variants={spatialItem} className="space-y-5">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-display text-xl font-medium tracking-tight text-white">{t('dashboard_ops_log')}</h3>
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold text-white/40 tracking-widest uppercase">
                {completedCount}/{tasks.length} {t('dashboard_done')}
              </span>
              <button
                onClick={() => setAddingTask(!addingTask)}
                className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-colors shadow-spatial-sm"
              >
                <Plus className="w-4 h-4 text-white/70" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {addingTask && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex gap-3 px-2 overflow-hidden"
              >
                <input
                  autoFocus
                  type="text"
                  value={newTaskTitle}
                  onChange={e => setNewTaskTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') addTask(); if (e.key === 'Escape') setAddingTask(false); }}
                  placeholder={t('dashboard_task_placeholder')}
                  className="flex-1 glass-panel px-5 py-3.5 text-sm font-body focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all text-white placeholder:text-white/30 rounded-2xl"
                />
                <button 
                  onClick={addTask} 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 rounded-2xl text-sm font-semibold transition-colors shadow-spatial-sm active-scale-smooth"
                >
                  {t('dashboard_add_btn')}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3">
            {tasks.map(task => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-panel p-4 rounded-2xl flex items-center gap-5 group hover:bg-white/[0.04] transition-colors cursor-pointer"
                onClick={() => toggleTask(task.id)}
              >
                <div className={cn("text-xl transition-all duration-500", task.completed ? "grayscale opacity-30" : "scale-110 drop-shadow-md")}>
                  {task.icon}
                </div>
                <div className="flex-1">
                  <p className={cn(
                    "text-sm font-medium transition-all duration-300", 
                    task.completed ? "text-white/30 line-through" : "text-white/90"
                  )}>
                    {task.title}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center transition-colors">
                    {task.completed && <div className="w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_rgba(229,193,108,0.5)]" />}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="opacity-0 group-hover:opacity-100 transition-opacity p-2 -mr-2">
                    <Trash2 className="w-4 h-4 text-white/30 hover:text-destructive transition-colors" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ═══ Elegant Actions Grid ═══ */}
        <motion.section variants={spatialItem} className="grid grid-cols-2 gap-4">
          <Link href="/diagnosis" className="glass-panel p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-white/[0.04] transition-all active-scale-smooth group">
            <ShieldCheck className="w-6 h-6 text-white/50 group-hover:text-primary transition-colors duration-500" />
            <span className="text-xs font-medium text-white/70">{t('dashboard_disease_scan')}</span>
          </Link>
          
          <button onClick={toggleValve} className={cn(
            "p-6 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all duration-500 active-scale-smooth shadow-frost",
            irrigationOn ? "bg-primary/10 border border-primary/20 backdrop-blur-[40px]" : "glass-panel hover:bg-white/[0.04]"
          )}>
            <Zap className={cn("w-6 h-6 transition-transform duration-500", irrigationOn ? "text-primary scale-110 drop-shadow-[0_0_15px_rgba(229,193,108,0.5)]" : "text-white/50")} />
            <div className="text-center">
              <span className="text-xs font-medium block text-white/70">{t('dashboard_smart_valve')}</span>
              <span className={cn("text-[9px] uppercase tracking-widest font-semibold mt-1 block", irrigationOn ? "text-primary" : "text-white/30")}>
                {irrigationOn ? t('dashboard_valve_active') : t('dashboard_valve_off')}
              </span>
            </div>
          </button>
        </motion.section>

        {/* ═══ AI Advisor Prominent CTA ═══ */}
        <motion.div variants={spatialItem} className="py-2">
          <Link href="/advisor" className="block relative group active-scale-smooth">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-sage/20 rounded-[2rem] blur-xl group-hover:blur-2xl transition-all opacity-50 duration-700" />
            <div className="relative glass-panel rounded-[2rem] p-5 flex items-center justify-center gap-3 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
               <Sparkles className="w-5 h-5 text-primary" />
               <span className="font-display font-medium text-white tracking-wide">Enter AI Consultation</span>
               <ChevronRight className="w-4 h-4 text-white/50 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>

        {/* ═══ Sync Footer ═══ */}
        <motion.footer variants={spatialItem} className="text-center pt-8">
          <p className="text-[10px] font-mono font-medium text-white/30 flex items-center justify-center gap-2 tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-white/20 rounded-full" />
            {t('dashboard_synced')} {format(lastUpdated, 'HH:mm')}
          </p>
        </motion.footer>
      </motion.div>
    </div>
  );
}
