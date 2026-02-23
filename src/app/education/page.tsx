"use client";

import { useState } from "react";
import {
    PlayCircle, Award, Search, Download,
    CheckCircle2, Star, FileText, ChevronRight,
    Trophy, Lock, Sparkles, Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function EducationPage() {
    const { toast } = useToast();
    const [enrolled, setEnrolled] = useState(false);
    const [completedVideos, setCompletedVideos] = useState<number[]>([]);
    const [downloadedGuides, setDownloadedGuides] = useState<string[]>([]);

    const overallProgress = Math.round(((completedVideos.length + (enrolled ? 1 : 0)) / 5) * 100);

    const toggleVideo = (id: number, title: string) => {
        if (completedVideos.includes(id)) {
            setCompletedVideos(completedVideos.filter(v => v !== id));
        } else {
            setCompletedVideos([...completedVideos, id]);
            toast({
                title: "Lesson Completed!",
                description: `You've watched: ${title}`,
            });
        }
    };

    const handleDownload = (guide: string) => {
        if (!downloadedGuides.includes(guide)) {
            setDownloadedGuides([...downloadedGuides, guide]);
        }
        toast({
            title: "Download Started",
            description: `${guide} is being saved to your device.`,
        });
    };

    const handleEnroll = () => {
        setEnrolled(true);
        toast({
            title: "Enrolled Successfully!",
            description: "You've joined the Certified Smart Farmer program.",
        });
    };

    const courses = [
        {
            id: 1,
            title: "Sustainable Farming 101",
            lessons: "12 Lessons",
            duration: "2h 30m",
            bg: "bg-green-500/10",
            iconColor: "text-green-500/80",
            level: "Beginner",
            points: 500
        },
        {
            id: 2,
            title: "Advanced Pest Management",
            lessons: "8 Lessons",
            duration: "1h 45m",
            bg: "bg-red-500/10",
            iconColor: "text-red-500/80",
            level: "Intermediate",
            points: 750
        },
        {
            id: 3,
            title: "Soil Health Mastery",
            lessons: "15 Lessons",
            duration: "3h 15m",
            bg: "bg-amber-500/10",
            iconColor: "text-amber-500/80",
            level: "Advanced",
            points: 1200
        }
    ];

    return (
        <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 max-w-5xl mx-auto">
            {/* Header with Stats Dashboard */}
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-foreground tracking-tight">Education <span className="text-primary italic">Hub</span></h1>
                        <p className="text-sm text-muted-foreground font-medium">Master modern agriculture with expert-led courses.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="px-3 py-1.5 rounded-full flex items-center gap-2 border-primary/20 bg-primary/5 text-primary">
                            <Star className="w-3.5 h-3.5 fill-primary" />
                            <span className="font-black">2,450 XP</span>
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1.5 rounded-full flex items-center gap-2 bg-card">
                            <Trophy className="w-3.5 h-3.5 text-yellow-500" />
                            <span className="font-black">LVL 4</span>
                        </Badge>
                    </div>
                </div>

                <Card className="border-none bg-slate-950 text-white rounded-[2rem] overflow-hidden relative">
                    <CardContent className="p-8 relative z-10">
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-black">Your Learning Progress</h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs font-bold text-slate-400">
                                        <span>WEEKLY GOAL</span>
                                        <span>{overallProgress}% COMPLETE</span>
                                    </div>
                                    <Progress value={overallProgress} className="h-3 bg-white/10" />
                                </div>
                                <p className="text-xs text-slate-400 font-medium">
                                    You&apos;ve completed <span className="text-white font-bold">{completedVideos.length} lessons</span> this week.
                                    Finish 2 more to earn the <span className="text-primary font-bold">"Seed Sower"</span> badge.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                                    <p className="text-2xl font-black">50K+</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Learners</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center">
                                    <p className="text-2xl font-black">120+</p>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Awards</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full" />
                </Card>
            </div>

            {/* Search & Filters */}
            <div className="flex gap-2">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input placeholder="Search tutorials, crop guides..." className="pl-12 h-14 bg-card/50 border-white/10 rounded-2xl focus-visible:ring-primary shadow-sm" />
                </div>
                <Button size="icon" variant="outline" className="h-14 w-14 rounded-2xl border-white/10 bg-card/50">
                    <Filter className="w-5 h-5" />
                </Button>
            </div>

            {/* Featured Courses Grid */}
            <div className="space-y-6">
                <div className="flex items-center justify-between px-1">
                    <h2 className="text-2xl font-black">Recommended for You</h2>
                    <Button variant="link" className="text-primary font-black">View All <ChevronRight className="w-4 h-4" /></Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <Card key={course.id} className="group border-none bg-white/50 dark:bg-card/40 backdrop-blur-md shadow-sm hover:shadow-xl transition-all duration-300 rounded-[2rem] overflow-hidden border border-white/10">
                            <CardContent className="p-2 space-y-4">
                                <div className={cn("aspect-[4/3] rounded-[1.5rem] flex items-center justify-center relative overflow-hidden group-hover:scale-[0.98] transition-transform", course.bg)}>
                                    <PlayCircle className={cn("w-16 h-16 group-hover:scale-110 transition-transform cursor-pointer", course.iconColor)} onClick={() => toggleVideo(course.id, course.title)} />
                                    {completedVideos.includes(course.id) && (
                                        <div className="absolute top-4 right-4 bg-green-500 text-white p-2 rounded-full animate-in zoom-in-50">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-4 left-4 flex gap-2">
                                        <Badge className="bg-white/90 text-black border-none font-bold text-[10px]">{course.level}</Badge>
                                        <Badge className="bg-black/50 text-white backdrop-blur-md border-none font-bold text-[10px]">{course.duration}</Badge>
                                    </div>
                                </div>
                                <div className="px-4 pb-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-black tracking-widest text-muted-foreground uppercase">{course.lessons}</p>
                                        <p className="text-[10px] font-black text-primary">+{course.points} XP</p>
                                    </div>
                                    <h3 className="font-black text-lg group-hover:text-primary transition-colors leading-tight">{course.title}</h3>
                                    <p className="text-xs text-muted-foreground line-clamp-2">Learn the fundamentals of this topic with practical field exercises and AI modules.</p>
                                    <Button variant="ghost" className="w-full mt-2 font-bold group-hover:bg-primary/10 transition-colors rounded-xl text-xs py-5" onClick={() => toggleVideo(course.id, course.title)}>
                                        {completedVideos.includes(course.id) ? "Watch Again" : "Start Learning"}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Resources & Certifications Section */}
            <div className="grid md:grid-cols-2 gap-8 pt-4">
                {/* Downloadable Guides */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-black px-1">Farmer Guides</h2>
                    <div className="grid gap-3">
                        {[
                            { title: 'Seasonal Crop Calendar', size: '2.4 MB', type: 'PDF' },
                            { title: 'Pest Control Handbook', size: '5.1 MB', type: 'PDF' },
                            { title: 'Market Trends Report', size: '0.8 MB', type: 'XLS' },
                            { title: 'Soil Health Checklist', size: '1.2 MB', type: 'PDF' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-card/60 backdrop-blur-md rounded-2xl border border-white/5 hover:border-primary/20 transition-all group">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                                    <FileText className="w-6 h-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-sm">{item.title}</h4>
                                    <p className="text-[10px] text-muted-foreground font-black uppercase">{item.size} • {item.type}</p>
                                </div>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className={cn("rounded-full", downloadedGuides.includes(item.title) ? "text-green-500" : "text-slate-400 group-hover:text-primary")}
                                    onClick={() => handleDownload(item.title)}
                                >
                                    {downloadedGuides.includes(item.title) ? <CheckCircle2 className="w-5 h-5" /> : <Download className="w-5 h-5" />}
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Certification CTA */}
                <div className="flex flex-col">
                    <h2 className="text-2xl font-black px-1 mb-6">Certification</h2>
                    <Card className="flex-1 bg-gradient-to-br from-primary to-green-700 text-primary-foreground border-none rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-primary/20">
                        <CardContent className="p-8 space-y-6 relative z-10">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center">
                                <Award className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black leading-tight">Certified Smart Farmer Program</h3>
                                <p className="text-sm opacity-90 leading-relaxed font-medium">
                                    Complete 10 advanced modules to earn your AgriSense professional certification. Recognized locally and globally.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between text-xs font-bold bg-black/20 rounded-xl p-4">
                                    <div className="flex items-center gap-2">
                                        <Lock className="w-3.5 h-3.5" />
                                        <span>7/10 MODULES</span>
                                    </div>
                                    <span className="text-primary italic font-black">NEXT: Irrigation Tech</span>
                                </div>
                                <Button
                                    onClick={handleEnroll}
                                    variant="secondary"
                                    className="w-full font-black py-7 text-md rounded-2xl shadow-lg transition-transform hover:scale-105 active:scale-95"
                                >
                                    {enrolled ? "Continue Learning" : "Enroll Now"}
                                </Button>
                            </div>
                        </CardContent>
                        {/* Visuals */}
                        <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                    </Card>
                </div>
            </div>

            {/* Achievement Toast Mockup/Indicator */}
            {completedVideos.length === 3 && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 p-6 rounded-[2rem] flex items-center gap-6 animate-in slide-in-from-right-10 duration-500">
                    <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center text-white shrink-0 rotate-3">
                        <Trophy className="w-8 h-8" />
                    </div>
                    <div>
                        <h4 className="font-black text-lg">New Achievement Unlocked!</h4>
                        <p className="text-sm text-muted-foreground font-medium">"Course Complete" - You've watched all recommended courses. Keep it up!</p>
                    </div>
                </div>
            )}
        </div>
    );
}

