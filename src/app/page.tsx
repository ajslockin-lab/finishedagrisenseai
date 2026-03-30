"use client";

import { useState, useEffect, useRef } from 'react';
import { Droplets, Thermometer, Beaker, Leaf, CheckSquare, Square, Zap, Target, Plane, Orbit, AlertTriangle } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import Link from 'next/link';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';

// --- Types & Data ---
interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'PRIME' | 'SUB';
  date: string;
}

const DEFAULT_TASKS: Task[] = [
  { id: '1', title: 'INITIATE TRIBUTARY HYDRATION SEQUENCE', completed: false, priority: 'PRIME', date: format(new Date(), 'yyyy-MM-dd') },
  { id: '2', title: 'CALIBRATE MYCELIAL SENSOR NODE 4', completed: false, priority: 'SUB', date: format(new Date(), 'yyyy-MM-dd') },
  { id: '3', title: 'DEPLOY UAV: SPECTRAL CANOPY ANALYSIS', completed: false, priority: 'PRIME', date: format(new Date(), 'yyyy-MM-dd') },
];

const PRIORITIES = ['PRIME', 'SUB'] as const;

// --- Animations ---
const systemBootStagger = {
  hidden: { opacity: 0 },
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
} as const;

const cyberPanelReveal = {
  hidden: { opacity: 0, y: 20, filter: 'blur(5px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
} as const;

// --- Sub-Components ---
function ScrambleText({ text, active }: { text: string, active: boolean }) {
  const [displayText, setDisplayText] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789§±Ð£¢∞';

  useEffect(() => {
    if (!active) {
      setDisplayText(text);
      return;
    }
    let iteration = 0;
    let interval: NodeJS.Timeout;
    
    interval = setInterval(() => {
      setDisplayText(text.split('').map((letter, index) => {
        if(index < iteration) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));

      if (iteration >= text.length) clearInterval(interval);
      iteration += 1/3; 
    }, 30);

    return () => clearInterval(interval);
  }, [text, active]);

  return <span className="font-mono-data tracking-tighter w-full block truncate">{displayText}</span>;
}

export default function HomeDashboard() {
  const { sensors, lastUpdated, settings, t } = useSensors();
  const [mounted, setMounted] = useState(false);
  const [irrigationOn, setIrrigationOn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  
  // Sentient tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

  // Scroll bindings for the topographic drift
  const { scrollYProgress } = useScroll({ target: containerRef });
  const yDrift = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const rotateDrift = useTransform(scrollYProgress, [0, 1], ['0deg', '5deg']);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('agrisense_tasks_cyber');
    const today = format(new Date(), 'yyyy-MM-dd');
    if (saved) {
      const parsed: Task[] = JSON.parse(saved);
      setTasks(parsed.map(t => ({...t, completed: t.date === today ? t.completed : false, date: today})));
    }
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX - window.innerWidth / 2);
    mouseY.set(clientY - window.innerHeight / 2);
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
  const isHealthy = healthScore >= 80;

  if (!mounted) return null;

  return (
    <div 
      className="relative min-h-screen font-body text-bone selection:bg-bio selection:text-abyss overflow-hidden" 
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {/* ═══ Atmosphere ═══ */}
      <div className="atmosphere-noise" />
      <div className="atmosphere-mesh pointer-events-none" />

      {/* ═══ The Sentient Number ═══ */}
      <motion.div 
         className="sentient-number left-[5%] top-[10%] opacity-20"
         style={{
            x: useTransform(smoothX, [-1000, 1000], [-50, 50]),
            y: useTransform(smoothY, [-1000, 1000], [-50, 50]),
            skewX: useTransform(smoothX, [-1000, 1000], [-10, 10]),
            color: isHealthy ? 'rgba(57, 255, 20, 0.15)' : 'rgba(255, 51, 0, 0.15)'
         }}
      >
         {healthScore}
      </motion.div>

      {/* ═══ Main Architecture ═══ */}
      <motion.div
        className="relative z-10 w-full min-h-screen p-6 md:p-12 lg:p-20 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 pt-24"
        variants={systemBootStagger}
        initial="hidden"
        animate="visible"
      >

        {/* ─── Left Asymmetric Column ─── */}
        <motion.header className="lg:col-span-5 flex flex-col justify-between items-start" variants={cyberPanelReveal}>
           
           <div>
             <div className="flex items-center gap-3 mb-4">
                <SpinnerIcon className="w-6 h-6 text-bio animate-[spin_4s_linear_infinite]" />
                <span className="font-mono-data text-xs text-bio/70 uppercase tracking-widest border border-bio/30 px-2 py-0.5">NET.LINK ESTABLISHED // {format(lastUpdated, 'HH:mm:ss')}</span>
             </div>
             
             <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.8] mb-6 drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">
               AGRI<br/>SENSE
               <span className="text-bio block mt-2 text-3xl md:text-5xl font-organic italic">OS / Biosphere</span>
             </h1>

             <p className="font-mono-data text-sm md:text-base text-bone/60 max-w-sm leading-relaxed mb-12 border-l-2 border-bio/50 pl-4">
               {isHealthy ? 
               "Biological telemetry reporting nominal ranges. Mycelial network stable. Hydration nodes maintaining optimal saturation." : 
               "CRITICAL VARIANCE DETECTED. Ecosystem equilibrium disrupted. Manual intervention required to stabilize biological matrix."}
             </p>
           </div>

           {/* Vertical Status Array */}
           <div className="flex gap-4 w-full">
              <div className={cn("flex-1 p-4 border flex flex-col items-start cyber-panel", isHealthy ? "border-bio" : "border-solar")}>
                 <span className="font-mono-data text-[10px] text-bone/50 uppercase tracking-widest">ECO.INTEGRITY</span>
                 <span className={cn("font-display text-4xl font-bold leading-none mt-2", isHealthy ? "text-bio" : "text-solar")}>{healthScore}%</span>
              </div>
              <div className="flex-[0.5] p-4 cyber-panel border border-muted flex flex-col justify-end items-end">
                 <span className="font-mono-data text-[10px] text-bone/50 uppercase">SECTOR</span>
                 <span className="font-display text-xl font-bold text-bone">0xA1</span>
              </div>
           </div>
        </motion.header>

        {/* ─── Right Cascading Grid ─── */}
        <motion.main 
           className="lg:col-span-7 flex flex-col gap-6 w-full relative z-20"
           style={{ y: yDrift, rotateX: rotateDrift }}
        >
            
           {/* Telemetry Sensor Array (Overlapping / Broken Grid) */}
           <div className="grid grid-cols-2 gap-4 auto-rows-min mt-10 lg:mt-0 relative">
              <div className="absolute -left-6 top-1/2 w-0.5 h-3/4 bg-bio/20 hidden lg:block" />
              <div className="absolute -left-12 top-10 w-4 h-0.5 bg-bio/20 hidden lg:block" />
              <div className="absolute -left-12 bottom-10 w-4 h-0.5 bg-bio/20 hidden lg:block" />

              {/* Moisture */}
              <HoverRefCard>
                 <div className="flex justify-between items-start mb-6">
                    <Droplets className="w-5 h-5 text-bio drop-shadow-[0_0_8px_#39ff14]" />
                    <span className="font-mono-data text-[9px] text-bone/40 border border-muted px-1">T.MSTR</span>
                 </div>
                 <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl md:text-5xl font-bold">{sensors.soilMoisture.toFixed(1)}</span>
                    <span className="font-mono-data text-xs text-bio">%</span>
                 </div>
              </HoverRefCard>

              {/* Temperature */}
              <HoverRefCard>
                 <div className="flex justify-between items-start mb-6">
                    <Thermometer className="w-5 h-5 text-solar drop-shadow-[0_0_8px_#ff3300]" />
                    <span className="font-mono-data text-[9px] text-bone/40 border border-muted px-1">T.TEMP</span>
                 </div>
                 <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl md:text-5xl font-bold">{sensors.soilTemperature.toFixed(1)}</span>
                    <span className="font-mono-data text-xs text-solar">°C</span>
                 </div>
              </HoverRefCard>

              {/* pH Level */}
              <HoverRefCard>
                 <div className="flex justify-between items-start mb-6">
                    <Beaker className="w-5 h-5 text-bone/80" />
                    <span className="font-mono-data text-[9px] text-bone/40 border border-muted px-1">T.ACID</span>
                 </div>
                 <div className="flex items-baseline gap-1">
                    <span className="font-display text-4xl md:text-5xl font-bold">{sensors.soilPh.toFixed(1)}</span>
                    <span className="font-organic text-lg text-bone/60 ml-1">pH</span>
                 </div>
              </HoverRefCard>

              {/* Nutrients - Full Width */}
              <HoverRefCard className="col-span-2 mt-4 ml-0 md:ml-12 border-bio/50 bg-bio/5">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border border-bio flex items-center justify-center shrink-0">
                       <Leaf className="w-5 h-5 text-bio drop-shadow-[0_0_5px_#39ff14]" />
                    </div>
                    <div>
                       <span className="font-mono-data text-[10px] text-bio/70 mb-1 block">BIOLOGICAL_RESERVE</span>
                       <span className="font-display text-2xl md:text-3xl font-bold text-bio">{'<<'} {sensors.nutrientLevel} {'>>'}</span>
                    </div>
                 </div>
              </HoverRefCard>
           </div>

           {/* Hardware Overrides */}
           <motion.div variants={cyberPanelReveal} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-muted/50 relative">
              <div className="absolute -top-1 right-0 w-24 h-[1px] bg-bio/50 blur-[2px]" />
              
              <button 
                onClick={() => setIrrigationOn(!irrigationOn)}
                className={cn(
                  "cyber-panel p-6 text-left group",
                  irrigationOn ? "bg-bio/20 border-bio ring-[0.5px] ring-bio shadow-neon inset-glow" : ""
                )}
              >
                 <Zap className={cn("w-6 h-6 mb-4", irrigationOn ? "animate-pulse text-bone" : "text-bio/50")} />
                 <h3 className="font-display text-lg mb-2 text-bone">{t('dashboard_smart_valve')}</h3>
                 <span className="font-mono-data text-[10px] py-1 px-2 border border-current">
                   {irrigationOn ? "[ ACTIVE. DISCHARGE ]" : "[ STANDBY. DRY ]"}
                 </span>
              </button>

              <Link href="/diagnosis" className="cyber-panel p-6 group flex flex-col justify-between hover:bg-solar/10 hover:border-solar hover:shadow-flare">
                 <div className="flex justify-between w-full">
                    <Target className="w-6 h-6 text-solar group-hover:rotate-90 transition-transform duration-500" />
                    <Orbit className="w-4 h-4 text-bone/30 group-hover:animate-spin" />
                 </div>
                 <div className="mt-8">
                    <h3 className="font-display text-lg text-bone drop-shadow-md mb-2">{t('dashboard_disease_scan')}</h3>
                    <div className="w-full h-auto text-[10px] border-b border-solar/30 pb-1">
                      <ScrambleText text="> INITIATE_SPECTRAL_ANALYSIS" active={false} />
                    </div>
                 </div>
              </Link>
           </motion.div>

        </motion.main>
      </motion.div>
    </div>
  );
}

// A helper wrapper card for the cypher hover effect
function HoverRefCard({ children, className }: { children: React.ReactNode, className?: string }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <motion.div 
      variants={cyberPanelReveal}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn("cyber-panel p-5 relative overflow-hidden group", className)}
    >
      <div className={cn("transition-opacity duration-300 relative z-10", isHovered ? "opacity-10" : "opacity-100")}>
        {children}
      </div>

      {/* Scrambled cypher overlay that fades IN on hover */}
      <div className={cn("absolute inset-0 p-5 flex flex-col justify-center pointer-events-none transition-all duration-300 z-20", isHovered ? "opacity-100" : "opacity-0 scale-95")}>
         <div className="text-bio">
            <ScrambleText text="> DECRYPTING_NODE." active={isHovered} />
            <ScrambleText text="  VAL: [PROTECTED]" active={isHovered} />
            <ScrambleText text="  SYS: OK_" active={isHovered} />
         </div>
      </div>
    </motion.div>
  );
}

function SpinnerIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter" {...props}>
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  );
}
