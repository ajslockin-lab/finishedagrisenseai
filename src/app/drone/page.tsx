"use client";

import { useState } from "react";
import {
    Plane, Scan, ShieldCheck, Camera, ArrowRight, Calendar,
    Clock, MapPin, Download, CheckCircle2, AlertCircle,
    ChevronRight, Play, Info, Plus
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
    DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function DronePage() {
    const { t } = useSensors();
    const { toast } = useToast();
    const [bookingStep, setBookingStep] = useState(0);
    const [isBooking, setIsBooking] = useState(false);

    const services = [
        {
            title: "Field Health Mapping",
            description: "High-resolution NDVI imaging to detect crop stress before it's visible to the naked eye.",
            icon: Scan,
            color: "text-green-500",
            bgColor: "bg-green-500/10",
            price: "₹1,500/acre"
        },
        {
            title: "Pest Scouting",
            description: "Automated drone flights with thermal cameras to identify pest hotspots and disease outbreaks.",
            icon: ShieldCheck,
            color: "text-red-500",
            bgColor: "bg-red-500/10",
            price: "₹2,000/acre"
        },
        {
            title: "Precision Spraying",
            description: "Targeted application of fertilizers and pesticides, reducing chemical use by up to 30%.",
            icon: Plane,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            price: "₹3,500/acre"
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
                title: "Flight Scheduled!",
                description: "Our drone pilot will contact you shortly to confirm coordinates.",
            });
        }, 2000);
    };

    return (
        <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 max-w-5xl mx-auto">
            {/* Hero Section */}
            <div className="relative rounded-[2.5rem] overflow-hidden bg-slate-950 text-white p-8 md:p-16 border border-white/5">
                <div className="relative z-10 space-y-6 max-w-2xl">
                    <Badge className="bg-primary/20 text-primary border-primary/30 py-1 px-4 font-bold">AERIAL INTELLIGENCE</Badge>
                    <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
                        Revolutionize Your Farm from <span className="text-primary italic">Above</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Deploy autonomous drones for ultra-precise mapping and
                        intelligent scouting. Stop guessing, start seeing.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="lg" className="bg-primary text-primary-foreground font-black px-8 py-7 text-md rounded-2xl hover:bg-primary/90 transition-all hover:scale-105 shadow-xl shadow-primary/20">
                                    Schedule a Flight
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] bg-slate-900 border-white/10 text-white rounded-[2rem]">
                                <DialogHeader>
                                    <DialogTitle className="text-2xl font-black">Book Drone Service</DialogTitle>
                                    <DialogDescription className="text-slate-400">
                                        Choose your service and field area.
                                    </DialogDescription>
                                </DialogHeader>
                                {bookingStep === 0 && (
                                    <div className="space-y-4 py-4">
                                        {services.map((s, i) => (
                                            <div key={i} onClick={() => setBookingStep(1)} className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-primary/50 cursor-pointer transition-all flex items-center gap-4 group">
                                                <div className={`p-3 rounded-xl ${s.bgColor} ${s.color}`}>
                                                    <s.icon className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold">{s.title}</p>
                                                    <p className="text-[10px] text-slate-400">{s.price}</p>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-primary" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {bookingStep === 1 && (
                                    <div className="space-y-6 py-4 text-center">
                                        <div className="p-8 bg-primary/5 rounded-3xl border border-primary/20">
                                            <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
                                            <h4 className="font-bold text-lg">Select Field & Date</h4>
                                            <p className="text-xs text-slate-400 mt-2">Our team will verify the weather conditions for your preferred slot.</p>
                                        </div>
                                        <Button
                                            onClick={handleBooking}
                                            disabled={isBooking}
                                            className="w-full bg-primary font-black py-6 rounded-2xl"
                                        >
                                            {isBooking ? <Clock className="w-4 h-4 animate-spin mr-2" /> : "Confirm Schedule"}
                                        </Button>
                                    </div>
                                )}
                                {bookingStep === 2 && (
                                    <div className="space-y-6 py-8 text-center animate-in zoom-in-95 duration-300">
                                        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle2 className="w-10 h-10" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-2xl">Flight Booked!</h4>
                                            <p className="text-slate-400 mt-2">Check your notifications for the pilot details.</p>
                                        </div>
                                        <Button onClick={() => setBookingStep(0)} variant="outline" className="w-full border-white/10 rounded-2xl font-bold">Done</Button>
                                    </div>
                                )}
                            </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="lg" className="border-white/10 text-white font-bold px-8 py-7 text-md rounded-2xl hover:bg-white/5 transition-all">
                            View Example Reports
                        </Button>
                    </div>
                </div>

                {/* Abstract Decorative Elements */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 animate-pulse" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
            </div>

            {/* Dashboard Row: Health Score & Upcoming */}
            <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-none bg-primary/5 backdrop-blur-md overflow-hidden relative group">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xl font-black flex items-center gap-2">
                            Field Health Index
                            <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </CardTitle>
                        <CardDescription>Live composite health score for all scanned fields.</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 relative">
                        <div className="flex items-center justify-center py-4">
                            <div className="relative w-40 h-40">
                                <svg className="w-full h-full" viewBox="0 0 100 100">
                                    <circle className="text-slate-200 dark:text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                    <circle className="text-primary transition-all duration-1000 ease-out" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset="251.2 - (251.2 * 85 / 100)" strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black">85</span>
                                    <span className="text-[10px] font-bold text-green-500 uppercase">Excellent</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center text-xs font-bold mt-4 px-4">
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> Healthy</div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500" /> Stress Detected</div>
                            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> Irrigation Need</div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none bg-card/40 backdrop-blur-md">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-black">Upcoming Flights</CardTitle>
                            <CardDescription>Scheduled aerial surveys</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" className="rounded-full bg-primary/10 text-primary">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {upcomingFlights.map((flight) => (
                            <div key={flight.id} className="flex items-center gap-4 p-4 bg-white/50 dark:bg-slate-900/50 rounded-2xl border border-border/50 transition-all hover:bg-white hover:shadow-sm">
                                <div className="p-3 bg-slate-100 dark:bg-black rounded-xl text-center min-w-[3.5rem]">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{flight.date.split(' ')[0]}</p>
                                    <p className="text-lg font-black">{flight.date.split(' ')[1]}</p>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm leading-tight">{flight.type}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <MapPin className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-[10px] font-medium text-muted-foreground">{flight.field}</span>
                                        <span className="text-[10px] text-slate-300">•</span>
                                        <Clock className="w-3 h-3 text-muted-foreground" />
                                        <span className="text-[10px] font-medium text-muted-foreground">{flight.time}</span>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-tight">{flight.status}</Badge>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            {/* Services Grid */}
            <div className="space-y-6">
                <div className="flex items-end justify-between px-2">
                    <div>
                        <h2 className="text-2xl font-black">Professional Services</h2>
                        <p className="text-sm text-muted-foreground">Expert pilots and specialized sensors.</p>
                    </div>
                    <Button variant="link" className="font-bold text-primary">Full Catalog <ChevronRight className="w-4 h-4" /></Button>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {services.map((service, index) => (
                        <Card key={index} className="border-none bg-white/40 dark:bg-white/5 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 group overflow-hidden border border-white/10">
                            <CardContent className="p-6 space-y-4">
                                <div className={`w-14 h-14 rounded-2xl ${service.bgColor} ${service.color} flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                                    <service.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-lg font-black leading-tight">{service.title}</h3>
                                <p className="text-muted-foreground text-xs leading-relaxed">
                                    {service.description}
                                </p>
                                <div className="pt-2 flex items-center justify-between">
                                    <span className="font-black text-sm text-primary">{service.price}</span>
                                    <Button size="sm" variant="outline" className="rounded-full border-primary/20 text-primary font-bold hover:bg-primary hover:text-white transition-all">Book Now</Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Recent Activity with Reports */}
            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white border border-white/5 overflow-hidden relative">
                <div className="flex items-center justify-between mb-8 relative z-10">
                    <div>
                        <h3 className="text-2xl font-black">Recent Flight Reports</h3>
                        <p className="text-slate-400 text-sm">Download your processed aerial data</p>
                    </div>
                    <Button variant="outline" className="border-white/10 rounded-full font-bold">Manage Logs</Button>
                </div>
                <div className="space-y-4 relative z-10">
                    {[
                        { title: "North Field Sector A", date: "Today, 10:30 AM", type: "NDVI Map", size: "245MB", score: "88" },
                        { title: "East Valley Orchard", date: "Yesterday, 04:15 PM", type: "Thermal", size: "128MB", score: "72" }
                    ].map((scan, i) => (
                        <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-all hover:bg-white/10 group">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center shrink-0">
                                <Camera className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-md">{scan.title}</h4>
                                <p className="text-xs text-slate-400">{scan.date} • {scan.type}</p>
                            </div>
                            <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
                                <div className="text-right">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Progress value={parseInt(scan.score)} className="w-20 h-1" />
                                        <span className="text-[10px] font-bold text-primary">{scan.score}%</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase">{scan.size}</p>
                                </div>
                                <Button size="icon" variant="secondary" className="rounded-full bg-white/10 hover:bg-primary hover:text-white transition-all">
                                    <Download className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Visual Accent */}
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />
            </div>

            {/* How It Works & Safety */}
            <div className="grid md:grid-cols-2 gap-8 pt-8">
                <div className="space-y-4">
                    <h3 className="text-xl font-black">Safety & Compliance</h3>
                    <div className="p-6 bg-orange-500/5 border border-orange-500/10 rounded-3xl space-y-3">
                        <div className="flex items-center gap-3 text-orange-600">
                            <AlertCircle className="w-5 h-5" />
                            <span className="font-black text-sm italic">DGCA REGISTERED</span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                            All our pilots are DGCA certified. We handle all flight permissions and
                            NPNT compliance for every mission.
                        </p>
                        <Button variant="link" className="p-0 text-orange-600 h-auto font-bold text-xs">Read Safety Guidelines</Button>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="text-xl font-black">Our Fleet</h3>
                    <div className="flex gap-4 p-4 bg-card/40 rounded-3xl overflow-x-auto pb-4 scrollbar-hide">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="min-w-[150px] space-y-2 group cursor-pointer">
                                <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center p-4">
                                    <Plane className="w-12 h-12 text-muted-foreground group-hover:text-primary group-hover:rotate-12 transition-all p-2" />
                                </div>
                                <p className="text-xs font-bold text-center">AgriScan v{i}.0</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
