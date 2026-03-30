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
import { motion } from 'framer-motion';

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } },
} as const;

export default function EducationPage() {
    const { toast } = useToast();
    const [enrolled, setEnrolled] = useState(false);
    const [completedVideos, setCompletedVideos] = useState<number[]>([]);
    const [downloadedGuides, setDownloadedGuides] = useState<string[]>([]);

    const overallProgress = Math.round(((completedVideos.length + (enrolled ? 1 : 0)) / 5) * 100);

    const toggleVideo = (id: number, title: string) => {
        if (completedVideos.includes(id)) {
            setCompletedVideos(completedVideos.filter((v: number) => v !== id));
        } else {
            setCompletedVideos([...completedVideos, id]);
            toast({ title: "Lesson Completed!", description: `You've watched: ${title}` });
        }
    };

    const handleDownload = (guide: string) => {
        if (!downloadedGuides.includes(guide)) setDownloadedGuides([...downloadedGuides, guide]);
        toast({ title: "Download Started", description: `${guide} is being saved to your device.` });
    };

    const handleEnroll = () => {
        setEnrolled(true);
        toast({ title: "Enrolled Successfully!", description: "You've joined the Certified Smart Farmer program." });
    };

    const courses = [
        { id: 1, title: "Sustainable Farming 101", lessons: "12 Lessons", duration: "2h 30m", bg: "bg-sage/10", iconColor: "text-sage", level: "Beginner", points: 500 },
        { id: 2, title: "Advanced Pest Management", lessons: "8 Lessons", duration: "1h 45m", bg: "bg-destructive/10", iconColor: "text-destructive", level: "Intermediate", points: 750 },
        { id: 3, title: "Soil Health Mastery", lessons: "15 Lessons", duration: "3h 15m", bg: "bg-primary/10", iconColor: "text-primary", level: "Advanced", points: 1200 },
    ];

    return (
        <motion.div className="space-y-6" variants={stagger.container} initial="hidden" animate="visible">
            {/* Header */}
            <motion.div variants={stagger.item} className="space-y-4 px-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                        <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">Education Hub</h1>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">Master modern agriculture with expert-led courses.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="px-3 py-1.5 rounded-xl flex items-center gap-1.5 border-primary/20 bg-primary/8 text-primary text-[10px] uppercase font-bold tracking-[0.15em]">
                            <Star className="w-3.5 h-3.5 fill-primary" />
                            <span className="font-mono">2,450 XP</span>
                        </Badge>
                        <Badge variant="outline" className="px-3 py-1.5 rounded-xl border border-border/50 flex items-center gap-1.5 bg-muted/30 text-[10px] uppercase font-bold tracking-[0.15em]">
                            <Trophy className="w-3.5 h-3.5 text-primary" />
                            <span>LVL 4</span>
                        </Badge>
                    </div>
                </div>

                {/* Progress card */}
                <Card className="border border-border/50 bg-card/80 rounded-2xl overflow-hidden shadow-premium">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <Sparkles className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="font-display text-lg font-bold tracking-tight">Your Learning Progress</h3>
                                </div>
                                <div className="space-y-2.5 w-full">
                                    <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                                        <span>Weekly Goal</span>
                                        <span className="text-primary font-mono">{overallProgress}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                        <motion.div className="h-full bg-gradient-to-r from-sage to-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${overallProgress}%` }} transition={{ duration: 1.2, delay: 0.3 }} />
                                    </div>
                                </div>
                                <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                                    You&apos;ve completed <span className="text-foreground font-semibold">{completedVideos.length} lessons</span> this week.
                                    Finish 2 more to earn the <span className="text-primary font-semibold">&quot;Seed Sower&quot;</span> badge.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
                                <div className="p-4 bg-muted/20 rounded-xl border border-border/30 text-center">
                                    <p className="font-mono text-xl font-bold tracking-tight">50K+</p>
                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.15em] mt-0.5">Learners</p>
                                </div>
                                <div className="p-4 bg-muted/20 rounded-xl border border-border/30 text-center">
                                    <p className="font-mono text-xl font-bold tracking-tight">120+</p>
                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.15em] mt-0.5">Awards</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Search */}
            <motion.div variants={stagger.item} className="flex gap-2 px-1">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search tutorials, crop guides..." className="pl-10 h-12 bg-muted/30 border border-border/50 rounded-xl focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors" />
                </div>
                <Button size="icon" variant="outline" className="h-12 w-12 rounded-xl border-border/50 bg-muted/30">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                </Button>
            </motion.div>

            {/* Courses */}
            <motion.div variants={stagger.item} className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <h2 className="font-display text-lg font-bold tracking-tight text-foreground">Recommended for You</h2>
                    <Button variant="link" className="text-primary font-semibold text-xs h-auto p-0">View All <ChevronRight className="w-4 h-4 ml-0.5" /></Button>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <Card key={course.id} className="group border border-border/50 bg-card/80 hover:border-primary/20 transition-colors rounded-2xl overflow-hidden">
                            <CardContent className="p-2.5 flex flex-col h-full">
                                <div className={cn("aspect-video rounded-xl flex items-center justify-center relative overflow-hidden mb-3", course.bg)}>
                                    <PlayCircle className={cn("w-12 h-12 cursor-pointer transition-transform hover:scale-110", course.iconColor)} onClick={() => toggleVideo(course.id, course.title)} />
                                    {completedVideos.includes(course.id) && (
                                        <div className="absolute top-3 right-3 bg-sage border border-sage text-primary-foreground p-1.5 rounded-full">
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-3 left-3 flex gap-1.5">
                                        <Badge variant="outline" className="bg-background/80 text-foreground backdrop-blur-sm border-border/50 font-bold text-[9px] px-2 uppercase tracking-wider">{course.level}</Badge>
                                        <Badge variant="outline" className="bg-foreground/80 text-background backdrop-blur-sm border-transparent font-bold text-[9px] px-2 uppercase tracking-wider">{course.duration}</Badge>
                                    </div>
                                </div>
                                <div className="px-2 pb-2 space-y-2.5 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[9px] font-bold tracking-[0.15em] text-muted-foreground uppercase">{course.lessons}</p>
                                        <p className="text-[10px] font-bold text-primary font-mono">+{course.points} XP</p>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors">{course.title}</h3>
                                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed font-medium">Learn the fundamentals with practical field exercises and AI modules.</p>
                                    </div>
                                    <div className="mt-auto pt-3">
                                        <Button variant="outline" className="w-full font-semibold rounded-xl text-xs h-10 border-border/50 active-scale" onClick={() => toggleVideo(course.id, course.title)}>
                                            {completedVideos.includes(course.id) ? "Watch Again" : "Start Learning"}
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </motion.div>

            {/* Resources & Cert */}
            <div className="grid md:grid-cols-2 gap-6 pt-2">
                <motion.div variants={stagger.item} className="space-y-4">
                    <h2 className="font-display text-lg font-bold tracking-tight px-1 text-foreground">Farmer Guides</h2>
                    <div className="grid gap-2.5">
                        {[
                            { title: 'Seasonal Crop Calendar', size: '2.4 MB', type: 'PDF' },
                            { title: 'Pest Control Handbook', size: '5.1 MB', type: 'PDF' },
                            { title: 'Market Trends Report', size: '0.8 MB', type: 'XLS' },
                            { title: 'Soil Health Checklist', size: '1.2 MB', type: 'PDF' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-3.5 p-3.5 bg-card/80 rounded-xl border border-border/50 transition-colors hover:border-primary/20 group">
                                <div className="w-10 h-10 bg-muted/30 border border-border/30 rounded-lg flex items-center justify-center shrink-0">
                                    <FileText className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate text-foreground">{item.title}</h4>
                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-[0.15em] mt-0.5">{item.size} • {item.type}</p>
                                </div>
                                <Button
                                    size="icon" variant="ghost"
                                    className={cn("rounded-lg h-9 w-9", downloadedGuides.includes(item.title) ? "text-sage bg-sage/10 hover:bg-sage/20" : "text-muted-foreground hover:text-primary hover:bg-primary/10")}
                                    onClick={() => handleDownload(item.title)}
                                >
                                    {downloadedGuides.includes(item.title) ? <CheckCircle2 className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                                </Button>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div variants={stagger.item} className="flex flex-col">
                    <h2 className="font-display text-lg font-bold tracking-tight px-1 mb-4 text-foreground">Certification</h2>
                    <Card className="flex-1 bg-gradient-to-br from-primary/15 to-sage/10 border border-primary/20 rounded-2xl shadow-premium overflow-hidden">
                        <CardContent className="p-6 space-y-5 flex flex-col h-full">
                            <div className="w-12 h-12 bg-primary/15 border border-primary/25 rounded-xl flex items-center justify-center">
                                <Award className="w-6 h-6 text-primary" />
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <h3 className="font-display text-xl font-bold leading-tight tracking-tight text-foreground">Certified Smart Farmer</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                                    Complete 10 advanced modules to earn your AgriSense professional certification.
                                </p>
                            </div>
                            <div className="space-y-4 pt-4 mt-auto">
                                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] font-bold bg-muted/30 rounded-lg p-3 border border-border/50">
                                    <div className="flex items-center gap-1.5">
                                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                                        <span className="text-muted-foreground">7/10 Modules</span>
                                    </div>
                                    <span className="text-primary font-mono">Next: Irrigation Tech</span>
                                </div>
                                <Button onClick={handleEnroll} className="w-full font-semibold h-11 rounded-xl bg-primary text-primary-foreground shadow-premium active-scale">
                                    {enrolled ? "Continue Learning" : "Enroll Now"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Achievement */}
            {completedVideos.length === 3 && (
                <motion.div variants={stagger.item} className="bg-primary/8 border border-primary/20 p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shrink-0 shadow-premium">
                        <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-foreground">New Achievement Unlocked!</h4>
                        <p className="text-xs text-muted-foreground font-medium mt-0.5">&quot;Course Complete&quot; - You&apos;ve watched all recommended courses.</p>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}
