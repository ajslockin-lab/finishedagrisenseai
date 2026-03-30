"use client";

import { useState } from "react";
import {
    Plane, Scan, ShieldCheck, ArrowRight, Calendar,
    Clock, MapPin, CheckCircle2,
    ChevronRight, Plus, Zap, Cpu, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSensors } from "@/context/SensorContext";
import { Badge } from "@/components/ui/badge";
import {
    Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } },
} as const;

export default function ServicesPage() {
    const { t } = useSensors();
    const { toast } = useToast();
    const [bookingStep, setBookingStep] = useState(0);
    const [isBooking, setIsBooking] = useState(false);

    const droneServices = [
        { title: "Standard Field Scan", description: "Crop health imaging, pest detection, field mapping.", icon: Scan, color: "text-sage", bgColor: "bg-sage/10 border-sage/20", price: "₹15,000/session" },
        { title: "Pest Scouting", description: "Automated drone flights with thermal cameras to identify pest hotspots.", icon: ShieldCheck, color: "text-destructive", bgColor: "bg-destructive/10 border-destructive/20", price: "₹15,000/session" },
        { title: "Precision Spraying", description: "Targeted application of fertilizers and pesticides, reducing chemical use.", icon: Plane, color: "text-blue-400", bgColor: "bg-blue-500/10 border-blue-500/20", price: "₹15,000/session" },
    ];

    const hardwareProducts = [
        { title: "Basic Sensor Kit", description: "Standard precision sensor for moisture and pH. Perfect for small to medium fields.", icon: Activity, price: "₹5,000", color: "text-sage", bgColor: "bg-sage/10 border-sage/20" },
        { title: "Advanced Bundle", description: "Multi-sensor arrays (NPK + humidity) for automated irrigation.", icon: Cpu, price: "₹10,000", color: "text-purple-400", bgColor: "bg-purple-500/10 border-purple-500/20" },
    ];

    const upcomingFlights = [
        { id: 1, type: "Health Mapping", field: "North Field", date: "Feb 15", time: "09:00 AM", status: "Scheduled" },
        { id: 2, type: "Pest Scouting", field: "Apple Orchard", date: "Feb 18", time: "02:30 PM", status: "Preparation" },
    ];

    const handleBooking = () => {
        setIsBooking(true);
        setTimeout(() => {
            setIsBooking(false);
            setBookingStep(2);
            toast({ title: "Service Requested!", description: "Our team will contact you shortly to confirm your booking." });
        }, 2000);
    };

    return (
        <motion.div className="space-y-8" variants={stagger.container} initial="hidden" animate="visible">
            {/* Hero */}
            <motion.div variants={stagger.item} className="rounded-2xl overflow-hidden border border-border/50 shadow-premium relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-transparent to-sage/8" />
                <div className="relative z-10 p-6 md:p-12 space-y-4 max-w-2xl">
                    <Badge variant="outline" className="bg-primary/8 text-primary border-primary/20 py-1 px-3 font-bold tracking-[0.15em] uppercase text-[10px]">Smart Infrastructure</Badge>
                    <h1 className="font-display text-3xl md:text-5xl font-bold leading-tight tracking-tight text-foreground">
                        Empower Your Farm with Precision
                    </h1>
                    <p className="text-muted-foreground text-sm leading-relaxed font-medium max-w-md">
                        Deploy autonomous drones and intelligent IoT sensors to eliminate guesswork. Stop hoping, start knowing.
                    </p>
                    <div className="pt-2">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button className="bg-primary text-primary-foreground font-semibold rounded-xl h-11 px-6 shadow-premium active-scale">
                                    Book a Service <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[450px] bg-card border border-border/50 text-foreground rounded-2xl">
                                <DialogHeader>
                                    <DialogTitle className="font-display text-xl font-bold tracking-tight">Reserve Service</DialogTitle>
                                    <DialogDescription className="text-sm font-medium text-muted-foreground">Choose your professional agriculture solution.</DialogDescription>
                                </DialogHeader>
                                {bookingStep === 0 && (
                                    <div className="space-y-3 py-4">
                                        {droneServices.map((s, i) => (
                                            <div key={i} onClick={() => setBookingStep(1)} className="p-4 bg-muted/20 rounded-xl border border-border/50 hover:border-primary/30 cursor-pointer transition-colors flex items-center gap-4 group">
                                                <div className={cn("p-3 rounded-lg border", s.bgColor, s.color)}>
                                                    <s.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm tracking-tight text-foreground">{s.title}</p>
                                                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.15em] mt-0.5 font-mono">{s.price}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {bookingStep === 1 && (
                                    <div className="space-y-6 py-4 text-center">
                                        <div className="p-8 bg-muted/20 rounded-xl border border-border/50">
                                            <Calendar className="w-10 h-10 text-primary mx-auto mb-3" />
                                            <h4 className="font-display font-bold text-lg text-foreground">Confirm Schedule</h4>
                                            <p className="text-xs text-muted-foreground mt-2 font-medium">Select a slot on the next screen once our coordinator calls you.</p>
                                        </div>
                                        <Button onClick={handleBooking} disabled={isBooking} className="w-full bg-primary text-primary-foreground font-semibold py-6 rounded-xl shadow-premium">
                                            {isBooking ? <Clock className="w-4 h-4 animate-spin mr-2" /> : null}
                                            Confirm & Send Request
                                        </Button>
                                    </div>
                                )}
                                {bookingStep === 2 && (
                                    <div className="space-y-6 py-6 text-center">
                                        <div className="w-16 h-16 bg-sage/15 border border-sage/25 text-sage rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle2 className="w-8 h-8" />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-display font-bold tracking-tight text-xl text-foreground">Request Received</h4>
                                            <p className="text-sm text-muted-foreground font-medium">We'll be in touch within 24 hours.</p>
                                        </div>
                                        <Button onClick={() => setBookingStep(0)} variant="outline" className="w-full rounded-xl border-border/50">Close</Button>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </motion.div>

            {/* IoT Hardware */}
            <motion.div variants={stagger.item} className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                    <div className="bg-muted/50 border border-border/50 p-2.5 rounded-xl">
                        <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-display text-xl font-bold tracking-tight text-foreground">IoT Sensors & Hardware</h2>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Precision Ground Monitoring</p>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    {hardwareProducts.map((p, i) => (
                        <Card key={i} className="border border-border/50 bg-card/80 rounded-2xl hover:border-primary/20 transition-colors overflow-hidden">
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className={cn("w-10 h-10 rounded-lg border flex items-center justify-center", p.bgColor, p.color)}>
                                        <p.icon className="w-5 h-5" />
                                    </div>
                                    <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-[0.15em] text-primary border-primary/20 bg-primary/8 px-2 py-0.5 rounded-md">One-Time</Badge>
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="font-display text-lg font-bold tracking-tight text-foreground">{p.title}</h3>
                                    <p className="text-muted-foreground text-xs leading-relaxed font-medium">{p.description}</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-border/30">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Price</span>
                                        <span className="font-mono text-xl font-bold tracking-tight text-primary leading-none mt-0.5">{p.price}</span>
                                    </div>
                                    <Button variant="outline" className="rounded-xl px-5 border-border/50 h-10 font-semibold text-xs active-scale">Order Now</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>

            {/* Drone Services */}
            <motion.div variants={stagger.item} className="space-y-6">
                <div className="flex items-center gap-3 px-1">
                    <div className="bg-muted/50 border border-border/50 p-2.5 rounded-xl">
                        <Plane className="w-5 h-5 text-primary -rotate-45" />
                    </div>
                    <div>
                        <h2 className="font-display text-xl font-bold tracking-tight text-foreground">Drone Services</h2>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Autonomous Aerial Analysis</p>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                    {droneServices.map((service, i) => (
                        <Card key={i} className="border border-border/50 bg-card/80 transition-colors hover:border-primary/20 rounded-2xl">
                            <CardContent className="p-5 space-y-4">
                                <div className={cn("w-10 h-10 rounded-lg border flex items-center justify-center", service.bgColor, service.color)}>
                                    <service.icon className="w-5 h-5" />
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="text-sm font-bold tracking-tight text-foreground">{service.title}</h3>
                                    <p className="text-muted-foreground text-xs leading-relaxed font-medium min-h-[40px]">{service.description}</p>
                                </div>
                                <div className="pt-3 flex items-center justify-between border-t border-border/30">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Per Session</span>
                                        <span className="font-mono font-bold text-sm text-foreground">{service.price}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>

            {/* Dashboard Row */}
            <div className="grid md:grid-cols-2 gap-4">
                <motion.div variants={stagger.item}>
                    <Card className="border border-border/50 bg-card/80 rounded-2xl">
                        <CardHeader className="p-5 pb-2">
                            <CardTitle className="text-sm font-bold flex items-center gap-2 text-foreground">
                                <Activity className="w-4 h-4 text-primary" />
                                Ground Health Index
                            </CardTitle>
                            <CardDescription className="font-bold text-[10px] uppercase tracking-[0.15em] text-muted-foreground">Live composite sensor score</CardDescription>
                        </CardHeader>
                        <CardContent className="p-5 pt-0 space-y-6">
                            <div className="flex items-center justify-center py-4">
                                <div className="relative w-36 h-36 animate-breathe">
                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                        <circle className="text-muted" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                        <circle className="text-primary transition-all duration-[1500ms] ease-out" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * 85 / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <span className="font-mono text-4xl font-bold tracking-tighter text-foreground text-glow">85</span>
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] mt-0.5">Premium</span>
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: 'Healthy', dot: 'bg-sage' },
                                    { label: 'Alert', dot: 'bg-destructive' },
                                    { label: 'Action', dot: 'bg-blue-400' },
                                ].map(({ label, dot }) => (
                                    <div key={label} className="flex items-center justify-center flex-col p-2 bg-muted/20 border border-border/30 rounded-lg">
                                        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{label}</span>
                                        <div className={cn("w-1.5 h-1.5 rounded-full mt-1", dot)} />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={stagger.item}>
                    <Card className="border border-border/50 bg-card/80 rounded-2xl flex flex-col h-full">
                        <CardHeader className="p-5 pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-sm font-bold tracking-tight text-foreground">Ongoing Missions</CardTitle>
                                    <CardDescription className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground mt-0.5">Scheduled deployments</CardDescription>
                                </div>
                                <Button variant="outline" size="icon" className="rounded-lg bg-muted/30 w-8 h-8 border-border/50">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 p-5 pt-2 flex-1 flex flex-col">
                            {upcomingFlights.map((flight) => (
                                <div key={flight.id} className="flex items-center gap-4 p-3.5 bg-muted/20 rounded-xl border border-border/30 hover:border-primary/20 transition-colors">
                                    <div className="p-2 border border-border/50 bg-card rounded-lg text-center min-w-[3.5rem]">
                                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{flight.date.split(' ')[0]}</p>
                                        <p className="font-mono text-sm font-bold tracking-tight text-foreground">{flight.date.split(' ')[1]}</p>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-sm leading-tight text-foreground truncate">{flight.type}</h4>
                                        <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span className="text-[10px] font-medium">{flight.field}</span>
                                            </div>
                                            <span className="text-[10px]">•</span>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-[10px] font-medium">{flight.time}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
}
