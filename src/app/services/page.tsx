"use client";

import { useState } from "react";
import {
    Plane, Scan, ShieldCheck, Camera, ArrowRight, Calendar,
    Clock, MapPin, Download, CheckCircle2, AlertCircle,
    ChevronRight, Play, Info, Plus, Zap, Cpu, Activity
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useSensors } from "@/context/SensorContext";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function ServicesPage() {
    const { t } = useSensors();
    const { toast } = useToast();
    const [bookingStep, setBookingStep] = useState(0);
    const [isBooking, setIsBooking] = useState(false);

    const droneServices = [
        {
            title: "Standard Field Scan",
            description: "Crop health imaging, pest detection, field mapping.",
            icon: Scan,
            color: "text-cyan-500",
            bgColor: "bg-cyan-500/10",
            price: "₹15,000/session"
        },
        {
            title: "Pest Scouting",
            description: "Automated drone flights with thermal cameras to identify pest hotspots and disease outbreaks.",
            icon: ShieldCheck,
            color: "text-red-500",
            bgColor: "bg-red-500/10",
            price: "₹15,000/session"
        },
        {
            title: "Precision Spraying",
            description: "Targeted application of fertilizers and pesticides, reducing chemical use by up to 30%.",
            icon: Plane,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            price: "₹15,000/session"
        }
    ];

    const hardwareProducts = [
        {
            title: "Basic Soil Sensor Kit",
            description: "Standard precision sensor for moisture and pH. Perfect for small to medium fields.",
            icon: Activity,
            price: "₹5,000",
            color: "text-green-500",
            bgColor: "bg-green-500/10"
        },
        {
            title: "Advanced Sensor Bundle",
            description: "Multi-sensor arrays (NPK + humidity + light) for automated irrigation control.",
            icon: Cpu,
            price: "₹10,000",
            color: "text-purple-500",
            bgColor: "bg-purple-500/10"
        }
    ];

    const upcomingFlights = [
        { id: 1, type: "Health Mapping", field: "North Field", date: "Feb 15", time: "09:00 AM", status: "Scheduled" },
        { id: 2, type: "Pest Scouting", field: "Apple Orchard", date: "Feb 18", time: "02:30 PM", status: "In Preparation" }
    ];

    const handleBooking = () => {
        setIsBooking(true);
        setTimeout(() => {
            setIsBooking(false);
            setBookingStep(2);
            toast({
                title: "Service Requested!",
                description: "Our team will contact you shortly to confirm your booking.",
            });
        }, 2000);
    };

    return (
        <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-6 duration-700 p-4 max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="relative rounded-[3rem] overflow-hidden bg-slate-950 text-white p-8 md:p-16 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                <div className="relative z-10 space-y-6 max-w-2xl">
                    <Badge className="bg-primary/20 text-primary border-primary/30 py-1.5 px-4 font-bold tracking-widest uppercase text-xs">SMART INFRASTRUCTURE</Badge>
                    <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter">
                        Empower Your Farm with <span className="bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent italic">Precision</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed font-medium">
                        Deploy autonomous drones and intelligent IoT sensors to eliminate guesswork. Stop hoping, start knowing.
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="lg" className="bg-primary text-primary-foreground font-black px-10 py-8 text-lg rounded-[1.5rem] hover:bg-primary/90 transition-all hover:scale-105 shadow-2xl shadow-primary/30">
                                    Book a Service
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[450px] bg-slate-950 border-white/10 text-white rounded-[2.5rem] backdrop-blur-3xl">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black">Reserve Service</DialogTitle>
                                    <DialogDescription className="text-slate-400 font-medium">
                                        Choose your professional agriculture solution.
                                    </DialogDescription>
                                </DialogHeader>
                                {bookingStep === 0 && (
                                    <div className="space-y-3 py-4">
                                        {droneServices.map((s, i) => (
                                            <div key={i} onClick={() => setBookingStep(1)} className="p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/50 hover:bg-white/10 cursor-pointer transition-all flex items-center gap-4 group">
                                                <div className={`p-4 rounded-xl ${s.bgColor} ${s.color} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                                    <s.icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold text-sm tracking-tight">{s.title}</p>
                                                    <p className="text-[11px] font-black text-primary opacity-80 uppercase tracking-widest mt-0.5">{s.price}</p>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-primary transition-transform group-hover:translate-x-1" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {bookingStep === 1 && (
                                    <div className="space-y-6 py-4 text-center">
                                        <div className="p-10 bg-primary/5 rounded-[2rem] border border-primary/20">
                                            <Calendar className="w-16 h-16 text-primary mx-auto mb-4 animate-bounce" />
                                            <h4 className="font-black text-xl">Confirm Schedule</h4>
                                            <p className="text-xs text-slate-400 mt-2 font-medium">Select a slot on the next screen once our coordinator calls you.</p>
                                        </div>
                                        <Button
                                            onClick={handleBooking}
                                            disabled={isBooking}
                                            className="w-full bg-primary font-black py-7 text-lg rounded-2xl shadow-xl shadow-primary/20"
                                        >
                                            {isBooking ? <Clock className="w-5 h-5 animate-spin mr-2" /> : "Confirm & Send Request"}
                                        </Button>
                                    </div>
                                )}
                                {bookingStep === 2 && (
                                    <div className="space-y-6 py-8 text-center animate-in zoom-in-95 duration-500">
                                        <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                                            <CheckCircle2 className="w-12 h-12" />
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="font-black text-3xl">Request Received</h4>
                                            <p className="text-slate-400 font-medium">We'll be in touch within 24 hours.</p>
                                        </div>
                                        <Button onClick={() => setBookingStep(0)} variant="outline" className="w-full border-white/10 rounded-2xl font-black py-6 mt-4">Close Message</Button>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Animated Gradient Gradients */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[150px] -translate-y-1/2 translate-x-1/3 animate-pulse pointer-events_none" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
            </div>

            {/* Hardware & IoT Section */}
            <div className="space-y-8 relative py-4">
                <div className="flex items-center gap-4 px-2">
                    <div className="bg-primary/10 p-4 rounded-[1.25rem] shadow-sm">
                        <Zap className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight">IoT Sensors & Hardware</h2>
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-80">Precision Ground Monitoring</p>
                    </div>
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    {hardwareProducts.map((p, i) => (
                        <Card key={i} className="border-none bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 group shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                            <CardContent className="p-8 space-y-6">
                                <div className={`w-14 h-14 rounded-2xl ${p.bgColor} ${p.color} flex items-center justify-center transition-transform group-hover:scale-125 group-hover:rotate-6`}>
                                    <p.icon className="w-8 h-8" />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black tracking-tight leading-none">{p.title}</h3>
                                        <Badge variant="outline" className="font-black text-primary border-primary/20 bg-primary/5">ONE-TIME</Badge>
                                    </div>
                                    <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                                        {p.description}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-border/10">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Price</span>
                                        <span className="text-3xl font-black text-primary leading-none mt-1">{p.price}</span>
                                    </div>
                                    <Button className="rounded-2xl px-6 py-6 font-black bg-slate-950 text-white hover:bg-slate-800 transition-all">Order Now</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Professional Drone Services */}
            <div className="space-y-8 py-4">
                <div className="flex items-end justify-between px-2">
                    <div className="flex items-center gap-4">
                        <div className="bg-cyan-500/10 p-4 rounded-[1.25rem]">
                            <Plane className="w-10 h-10 text-cyan-500 -rotate-45" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black tracking-tight">Drone Rental Services</h2>
                            <p className="text-sm font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-80">Autonomous Aerial Analysis</p>
                        </div>
                    </div>
                    <Button variant="link" className="font-black text-primary text-md group underline-offset-8">Catalog <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></Button>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {droneServices.map((service, index) => (
                        <Card key={index} className="border-none bg-white/40 dark:bg-card/40 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden border border-white/10 rounded-[2rem]">
                            <CardContent className="p-7 space-y-5">
                                <div className={`w-16 h-16 rounded-2xl ${service.bgColor} ${service.color} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                                    <service.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-black leading-tight tracking-tight">{service.title}</h3>
                                <p className="text-muted-foreground text-xs leading-relaxed font-medium min-h-[40px]">
                                    {service.description}
                                </p>
                                <div className="pt-4 flex items-center justify-between border-t border-border/10">
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-tighter">Per Session</span>
                                        <span className="font-black text-lg text-primary">{service.price}</span>
                                    </div>
                                    <Button size="icon" className="rounded-full w-12 h-12 bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-md group-hover:scale-110">
                                        <Plus className="w-5 h-5" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Dashboard Row: Health Score & Upcoming */}
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-none bg-slate-950 text-white rounded-[2.5rem] overflow-hidden relative group p-2 shadow-2xl">
                    <CardHeader className="p-8 pb-0">
                        <CardTitle className="text-2xl font-black flex items-center gap-3">
                            <Activity className="w-6 h-6 text-primary" />
                            Ground Health Index
                            <Info className="w-5 h-5 text-slate-500 cursor-help ml-auto" />
                        </CardTitle>
                        <CardDescription className="text-slate-400 font-medium mt-1">Live composite score from ground sensors.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 pt-4 relative">
                        <div className="flex items-center justify-center py-10">
                            <div className="relative w-48 h-48">
                                <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
                                    <circle className="text-white/5" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                    <circle className="text-primary transition-all duration-[1500ms] ease-out-expo"
                                        strokeWidth="10"
                                        strokeDasharray="251.2"
                                        strokeDashoffset={251.2 - (251.2 * 85 / 100)}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r="40" cx="50" cy="50" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-5xl font-black tracking-tighter">85</span>
                                    <span className="text-[10px] font-black text-green-400 uppercase tracking-widest mt-1">Premium Status</span>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 px-4">
                            <div className="flex items-center justify-center flex-col p-3 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-[9px] font-black text-slate-500 uppercase">Healthy</span>
                                <div className="w-2 h-2 rounded-full bg-green-500 mt-1 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                            </div>
                            <div className="flex items-center justify-center flex-col p-3 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-[9px] font-black text-slate-500 uppercase">Alert</span>
                                <div className="w-2 h-2 rounded-full bg-orange-400 mt-1" />
                            </div>
                            <div className="flex items-center justify-center flex-col p-3 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-[9px] font-black text-slate-500 uppercase">Action</span>
                                <div className="w-2 h-2 rounded-full bg-blue-500 mt-1" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-white/40 dark:bg-card/40 backdrop-blur-xl rounded-[2.5rem] p-4 flex flex-col">
                    <CardHeader className="pb-6 flex flex-row items-center justify-between p-6">
                        <div>
                            <CardTitle className="text-2xl font-black tracking-tight">Ongoing Missions</CardTitle>
                            <CardDescription className="font-medium text-sm">Scheduled field deployments</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-2xl bg-primary/10 text-primary w-12 h-12 shadow-sm">
                            <Plus className="w-6 h-6" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4 p-6 pt-0 flex-1">
                        {upcomingFlights.map((flight) => (
                            <div key={flight.id} className="flex items-center gap-5 p-5 bg-white/80 dark:bg-slate-950/40 rounded-[1.75rem] border border-border/50 transition-all hover:bg-white hover:shadow-xl hover:scale-[1.02] cursor-pointer group">
                                <div className="p-4 bg-slate-100 dark:bg-black rounded-2xl text-center min-w-[4rem] group-hover:bg-primary/5 transition-colors">
                                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-wider">{flight.date.split(' ')[0]}</p>
                                    <p className="text-xl font-black text-foreground">{flight.date.split(' ')[1]}</p>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-md leading-tight group-hover:text-primary transition-colors">{flight.type}</h4>
                                    <div className="flex items-center gap-3 mt-1.5 font-medium opacity-70">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" />
                                            <span className="text-[11px]">{flight.field}</span>
                                        </div>
                                        <span className="text-slate-300">•</span>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span className="text-[11px]">{flight.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-[10px] font-black px-3 py-1 bg-slate-100 dark:bg-white/10">{flight.status}</Badge>
                            </div>
                        ))}
                        <div className="mt-auto pt-6 px-2 text-center">
                            <p className="text-xs font-bold text-muted-foreground italic">"Precision isn't just a service, it's the future of yield."</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
