"use client";

import { useState } from "react";
import { Check, Crown, Zap, Shield, HelpCircle, ArrowRight, Loader2, Droplets, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSensors } from "@/context/SensorContext";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
    Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } },
} as const;

export default function SubscriptionPage() {
    const { t } = useSensors();
    const [farmSize, setFarmSize] = useState([10]);
    const profitIncrease = farmSize[0] * 28000;
    const { toast } = useToast();
    const [isYearly, setIsYearly] = useState(true);
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
    const [currentPlan, setCurrentPlan] = useState("Normal");

    const formatPrice = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const tiers = [
        {
            name: "Normal", monthlyPrice: 1000, yearlyPrice: 10000,
            description: "Essential data for active farming",
            features: ["Basic IoT Sensor Data", "Real-time Weather Alerts", "AI Crop Advisories", "Basic Farm Journaling", "Community Access"],
            icon: Shield, color: "text-sage", bgColor: "bg-sage/10 border-sage/20", buttonVariant: "outline" as const
        },
        {
            name: "Pro", monthlyPrice: 2500, yearlyPrice: 25000,
            description: "Deep insights for yield optimization",
            features: ["Everything in Normal", "AI Soil & Irrigation Insights", "Real-time Market Prices", "Advanced Irrigation Alerts", "Priority AI Advisor Support", "Yield Projection Analytics"],
            icon: Zap, color: "text-primary", bgColor: "bg-primary/10 border-primary/20", popular: true, buttonVariant: "default" as const
        },
        {
            name: "Premium", monthlyPrice: 5000, yearlyPrice: 50000,
            description: "Ultimate autonomous farm solution",
            features: ["Everything in Pro", "UAV Pest Scouting (Aerial)", "High-Priority Expert Support", "Field Health Multi-spectral Maps", "Unlimited AI Diagnostics", "Export Full Farm Reports"],
            icon: Crown, color: "text-primary", bgColor: "bg-primary/10 border-primary/20", buttonVariant: "outline" as const
        }
    ];

    const handleUpgrade = (planName: string) => {
        if (planName === currentPlan) {
            toast({ title: "Already Active", description: `You are already on the ${planName} plan.` });
            return;
        }
        setLoadingPlan(planName);
        setTimeout(() => {
            setLoadingPlan(null);
            setCurrentPlan(planName);
            toast({ title: "Plan Upgraded!", description: `Successfully upgraded to the ${planName} plan.`, variant: "default" });
        }, 1500);
    };

    return (
        <motion.div className="space-y-6" variants={stagger.container} initial="hidden" animate="visible">
            {/* Header */}
            <motion.div variants={stagger.item} className="text-center space-y-4 px-1 py-4">
                <Badge variant="outline" className="px-3 py-1 border-primary/20 bg-primary/8 text-primary text-[10px] font-bold uppercase tracking-[0.15em]">
                    Pricing Plans
                </Badge>
                <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">Scale Your Farm</h1>
                <p className="text-sm text-muted-foreground font-medium max-w-sm mx-auto leading-relaxed">
                    From independent farmers to large-scale operations, we have the right tools to maximize your yield.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 pt-2">
                    <span className={cn("text-xs font-semibold transition-colors", !isYearly ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
                    <Switch checked={isYearly} onCheckedChange={setIsYearly} className="data-[state=checked]:bg-primary" />
                    <div className="flex items-center gap-1.5">
                        <span className={cn("text-xs font-semibold transition-colors", isYearly ? "text-foreground" : "text-muted-foreground")}>Yearly</span>
                        <Badge variant="outline" className="bg-sage/10 text-sage border-sage/25 font-bold text-[9px] uppercase tracking-[0.15em] px-2 py-0.5">Save 20%</Badge>
                    </div>
                </div>
            </motion.div>

            {/* Current Usage */}
            <motion.div variants={stagger.item}>
                <Card className="border border-border/50 bg-card/80 rounded-2xl overflow-hidden shadow-premium">
                    <CardContent className="p-5 space-y-5">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm text-foreground">Monthly Usage</h3>
                                <Badge variant="outline" className="font-bold text-[9px] uppercase tracking-[0.15em] border-border/50 bg-muted/30">Current: {currentPlan}</Badge>
                            </div>
                            <div className="space-y-1.5">
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div className="h-full bg-gradient-to-r from-sage to-primary rounded-full" initial={{ width: 0 }} animate={{ width: '65%' }} transition={{ duration: 1.2, delay: 0.3 }} />
                                </div>
                                <p className="text-[10px] text-muted-foreground font-medium">
                                    650MB of 1GB Data Used • <span className="text-primary font-bold font-mono">12 days left</span>
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div className="flex items-center gap-2.5 p-3 bg-muted/20 rounded-xl border border-border/30">
                                <div className="p-2 bg-card border border-border/50 rounded-lg"><Droplets className="w-4 h-4 text-primary" /></div>
                                <div>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Sensors</p>
                                    <p className="font-mono text-sm font-bold tracking-tight text-foreground">12/20</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2.5 p-3 bg-muted/20 rounded-xl border border-border/30">
                                <div className="p-2 bg-card border border-border/50 rounded-lg"><Bell className="w-4 h-4 text-destructive" /></div>
                                <div>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Alerts</p>
                                    <p className="font-mono text-sm font-bold tracking-tight text-foreground">45 Sent</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Pricing Grid */}
            <motion.div variants={stagger.item} className="grid gap-4 md:grid-cols-3">
                {tiers.map((tier, index) => (
                    <Card key={index} className={cn(
                        "relative border transition-colors rounded-2xl overflow-hidden",
                        tier.popular ? "border-primary/40 shadow-premium bg-card/90" : "border-border/50 bg-card/80",
                        currentPlan === tier.name && "ring-1 ring-primary"
                    )}>
                        {tier.popular && (
                            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-[9px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-[0.15em]">
                                Popular
                            </div>
                        )}
                        <CardHeader className="p-5 pb-3">
                            <div className={cn("w-10 h-10 rounded-lg border flex items-center justify-center mb-3", tier.bgColor, tier.color)}>
                                <tier.icon className="w-5 h-5" />
                            </div>
                            <CardTitle className="font-display text-lg font-bold tracking-tight text-foreground">{tier.name}</CardTitle>
                            <CardDescription className="text-xs font-medium text-muted-foreground">{tier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-5 pt-0 space-y-6">
                            <div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-bold text-muted-foreground">₹</span>
                                    <span className="font-mono text-3xl font-bold tracking-tighter text-foreground">{formatPrice(isYearly ? tier.yearlyPrice : tier.monthlyPrice)}</span>
                                    <span className="text-muted-foreground font-semibold text-[10px]">/{isYearly ? 'yr' : 'mo'}</span>
                                </div>
                                {isYearly && (
                                    <span className="text-[10px] text-sage font-bold mt-1 inline-block bg-sage/10 px-2 py-0.5 rounded-md">
                                        Save ₹{formatPrice((tier.monthlyPrice * 12) - tier.yearlyPrice)} annually
                                    </span>
                                )}
                            </div>
                            <div className="space-y-3">
                                <span className="text-[9px] font-bold uppercase tracking-[0.15em] text-muted-foreground flex items-center gap-2">
                                    What&apos;s included
                                    <span className="h-[1px] flex-1 bg-border/50" />
                                </span>
                                <ul className="space-y-2.5">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-xs font-medium">
                                            <div className="mt-0.5 bg-primary/10 rounded-md p-0.5">
                                                <Check className="w-2.5 h-2.5 text-primary shrink-0" />
                                            </div>
                                            <span className="text-muted-foreground leading-tight">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter className="p-5 pt-0">
                            <Button
                                className={cn(
                                    "w-full font-semibold h-11 text-xs uppercase tracking-wider group rounded-xl",
                                    tier.popular && currentPlan !== tier.name && "bg-primary text-primary-foreground shadow-premium"
                                )}
                                variant={currentPlan === tier.name ? "outline" : tier.buttonVariant}
                                disabled={loadingPlan !== null}
                                onClick={() => handleUpgrade(tier.name)}
                            >
                                {loadingPlan === tier.name ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : currentPlan === tier.name ? (
                                    "Current Plan"
                                ) : (
                                    <>
                                        {tier.name === "Normal" ? "Basic Free" : `Upgrade to ${tier.name}`}
                                        <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-0.5" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </motion.div>

            {/* Hardware Pricing */}
            <motion.div variants={stagger.item} className="space-y-4 pt-4">
                <div className="flex items-center gap-3 px-1">
                    <div className="bg-muted/50 border border-border/50 p-2.5 rounded-xl">
                        <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-display text-lg font-bold tracking-tight text-foreground">Precision Hardware</h2>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em]">Simulation Pricing</p>
                    </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <Card className="border border-border/50 bg-card/80 rounded-2xl group hover:border-primary/20 transition-colors">
                        <CardHeader className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="bg-sage/8 text-sage border-sage/25 font-bold text-[9px] uppercase tracking-[0.15em]">Soil Sensor V1.0</Badge>
                                <Zap className="w-4 h-4 text-muted-foreground shrink-0" />
                            </div>
                            <CardTitle className="font-mono text-xl font-bold tracking-tight text-foreground">₹5,000</CardTitle>
                            <CardDescription className="text-foreground font-semibold mt-1 text-sm">Basic Soil Sensor Kit</CardDescription>
                        </CardHeader>
                        <CardContent className="px-5 pb-5 pt-0">
                            <p className="text-xs font-medium text-muted-foreground leading-relaxed">Standard precision sensor for moisture and pH monitoring.</p>
                        </CardContent>
                    </Card>
                    <Card className="border border-border/50 bg-card/80 rounded-2xl group hover:border-primary/20 transition-colors">
                        <CardHeader className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <Badge variant="outline" className="bg-primary/8 text-primary border-primary/20 font-bold text-[9px] uppercase tracking-[0.15em]">Advanced Hub</Badge>
                                <Crown className="w-4 h-4 text-primary shrink-0" />
                            </div>
                            <CardTitle className="font-mono text-xl font-bold tracking-tight text-primary">₹10,000</CardTitle>
                            <CardDescription className="text-foreground font-semibold mt-1 text-sm">Advanced Sensor Bundle</CardDescription>
                        </CardHeader>
                        <CardContent className="px-5 pb-5 pt-0">
                            <p className="text-xs font-medium text-muted-foreground leading-relaxed">Multi-sensor arrays for automated nutrient and irrigation control.</p>
                        </CardContent>
                    </Card>
                </div>
            </motion.div>

            {/* ROI Calculator */}
            <motion.div variants={stagger.item}>
                <Card className="bg-gradient-to-br from-primary/15 to-sage/10 border border-primary/20 rounded-2xl overflow-hidden shadow-premium">
                    <CardContent className="p-6 md:p-10 space-y-6">
                        <div className="space-y-4">
                            <Badge variant="outline" className="text-primary border-primary/25 font-bold text-[9px] uppercase tracking-[0.15em] bg-primary/8">ROI Calculator</Badge>
                            <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">Impact on bottom line.</h2>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 border border-primary/20 rounded-xl flex items-center justify-center font-mono font-bold text-primary text-sm shrink-0">30%</div>
                                    <p className="text-muted-foreground text-xs font-medium leading-relaxed">Average increase in crop yield using our AI recommendations.</p>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-sage/10 border border-sage/20 rounded-xl flex items-center justify-center font-mono font-bold text-sage text-sm shrink-0">40%</div>
                                    <p className="text-muted-foreground text-xs font-medium leading-relaxed">Reduction in water consumption through smart irrigation.</p>
                                </li>
                            </ul>
                        </div>
                        <div className="mt-6 pt-6 border-t border-border/30">
                            <div>
                                <h4 className="font-semibold text-xs mb-1 text-muted-foreground">Projected Annual Profit</h4>
                                <div className="font-mono text-3xl font-bold tracking-tight text-foreground text-glow">₹{formatPrice(profitIncrease)}</div>
                            </div>
                            <div className="space-y-3 mt-4">
                                <div className="flex justify-between text-xs font-semibold text-foreground">
                                    <span>Farm Area</span>
                                    <span className="bg-muted/30 border border-border/50 px-2.5 py-1 rounded-lg font-mono">{farmSize[0]} Hectares</span>
                                </div>
                                <Slider
                                    defaultValue={[10]} max={500} min={1} step={1}
                                    value={farmSize} onValueChange={setFarmSize}
                                    className="w-full cursor-pointer [&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary/50"
                                />
                                <div className="flex justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
                                    <span>1 ha</span>
                                    <span>500 ha</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* FAQ */}
            <motion.div variants={stagger.item} className="space-y-3 pt-2">
                <div className="flex items-center justify-between px-1">
                    <h2 className="font-display text-lg font-bold tracking-tight text-foreground">Common Questions</h2>
                    <Button variant="ghost" className="text-primary font-semibold text-xs h-auto p-0">Contact Support</Button>
                </div>
                <Accordion type="single" collapsible className="w-full bg-card/80 border border-border/50 rounded-2xl overflow-hidden">
                    <AccordionItem value="item-1" className="border-b border-border/30 px-4">
                        <AccordionTrigger className="hover:no-underline font-semibold text-xs py-4 text-foreground">Can I switch plans anytime?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-xs leading-relaxed pb-4">
                            Yes! You can upgrade or downgrade your plan at any time. If you upgrade, the change is immediate.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-b border-border/30 px-4">
                        <AccordionTrigger className="hover:no-underline font-semibold text-xs py-4 text-foreground">How does the 1-on-1 consultation work?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-xs leading-relaxed pb-4">
                            Premium members can schedule a monthly video call with our agricultural experts to discuss their farm strategy, soil health, and optimization techniques.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border-none px-4">
                        <AccordionTrigger className="hover:no-underline font-semibold text-xs py-4 text-foreground">Do you offer enterprise pricing?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-xs leading-relaxed pb-4">
                            For cooperatives or industrial farms with over 500 acres, contact our sales team for custom data pipelines and white-labeled dashboards.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </motion.div>

            <motion.div variants={stagger.item} className="flex gap-3 justify-center items-center pt-4 pb-20">
                <Button variant="outline" className="rounded-xl px-4 flex-1 h-11 font-semibold text-xs border-border/50 active-scale">
                    <HelpCircle className="w-4 h-4 mr-1.5" />
                    Billing History
                </Button>
                <Button variant="outline" className="rounded-xl px-4 flex-1 h-11 font-semibold text-xs border-destructive/30 text-destructive hover:bg-destructive/5 active-scale">
                    Cancel Plan
                </Button>
            </motion.div>
        </motion.div>
    );
}
