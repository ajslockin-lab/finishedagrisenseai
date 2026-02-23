"use client";

import { useState } from "react";
import { Check, Crown, Zap, Shield, HelpCircle, ArrowRight, Loader2, TrendingUp, Droplets, Bell, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSensors } from "@/context/SensorContext";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Slider } from "@/components/ui/slider";

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
            name: "Normal",
            monthlyPrice: 1000,
            yearlyPrice: 10000,
            description: "Essential data for active farming",
            features: [
                "Basic IoT Sensor Data",
                "Real-time Weather Alerts",
                "AI Crop Advisories",
                "Basic Farm Journaling",
                "Community Access"
            ],
            icon: Shield,
            color: "text-blue-500",
            bgColor: "bg-blue-500/10",
            buttonVariant: "outline" as const
        },
        {
            name: "Pro",
            monthlyPrice: 2500,
            yearlyPrice: 25000,
            description: "Deep insights for yield optimization",
            features: [
                "Everything in Normal",
                "AI Soil & Irrigation Insights",
                "Real-time Market Prices",
                "Advanced Irrigation Alerts",
                "Priority AI Advisor Support",
                "Yield Projection Analytics"
            ],
            icon: Zap,
            color: "text-primary",
            bgColor: "bg-primary/10",
            popular: true,
            buttonVariant: "default" as const
        },
        {
            name: "Premium",
            monthlyPrice: 5000,
            yearlyPrice: 50000,
            description: "The ultimate autonomous farm solution",
            features: [
                "Everything in Pro",
                "UAV Pest Scouting (Aerial)",
                "High-Priority Expert Support",
                "Field Health Multi-spectral Maps",
                "Unlimited AI Diagnostics",
                "Export Full Farm Reports"
            ],
            icon: Crown,
            color: "text-yellow-500",
            bgColor: "bg-yellow-500/10",
            buttonVariant: "outline" as const
        }
    ];

    const handleUpgrade = (planName: string) => {
        if (planName === currentPlan) {
            toast({
                title: "Already Active",
                description: `You are already on the ${planName} plan.`,
            });
            return;
        }

        setLoadingPlan(planName);

        // Simulate payment processing
        setTimeout(() => {
            setLoadingPlan(null);
            setCurrentPlan(planName);
            toast({
                title: "Plan Upgraded!",
                description: `Successfully upgraded to the ${planName} plan.`,
                variant: "default",
            });
        }, 2000);
    };

    return (
        <div className="space-y-8 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500 p-4 max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="text-center space-y-4">
                <Badge variant="outline" className="px-4 py-1 border-primary/20 text-primary font-bold">
                    PRICING PLANS
                </Badge>
                <h1 className="text-4xl font-black tracking-tight text-foreground">
                    Scale Your Farm with <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">AgriSense Pro</span>
                </h1>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    From independent farmers to large-scale operations, we have the right tools to maximize your yield.
                </p>

                {/* Billing Toggle */}
                <div className="flex items-center justify-center gap-4 pt-4">
                    <span className={cn("text-sm font-bold transition-colors", !isYearly ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
                    <Switch
                        checked={isYearly}
                        onCheckedChange={setIsYearly}
                        className="data-[state=checked]:bg-primary"
                    />
                    <div className="flex items-center gap-2">
                        <span className={cn("text-sm font-bold transition-colors", isYearly ? "text-foreground" : "text-muted-foreground")}>Yearly</span>
                        <Badge className="bg-green-500/20 text-green-600 border-none font-bold text-[10px]">SAVE 20%</Badge>
                    </div>
                </div>
            </div>

            {/* Current Usage Stats */}
            <Card className="border-none bg-primary/5 backdrop-blur-md overflow-hidden">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold">Monthly Usage</h3>
                                <Badge variant="secondary" className="font-bold text-[10px]">CURRENT: {currentPlan}</Badge>
                            </div>
                            <div className="w-full md:w-64">
                                <Progress value={65} className="h-2" />
                            </div>
                            <p className="text-[10px] text-muted-foreground font-medium">650MB of 1GB Data Used • <span className="text-primary">12 days left</span></p>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl">
                                <div className="p-2 bg-blue-500/10 rounded-lg"><Droplets className="w-4 h-4 text-blue-500" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Sensors</p>
                                    <p className="text-sm font-black">12/20</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl">
                                <div className="p-2 bg-orange-500/10 rounded-lg"><Bell className="w-4 h-4 text-orange-500" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Alerts</p>
                                    <p className="text-sm font-black">45 Sent</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl">
                                <div className="p-2 bg-purple-500/10 rounded-lg"><TrendingUp className="w-4 h-4 text-purple-500" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Yield ROI</p>
                                    <p className="text-sm font-black">+30%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-900/50 rounded-xl">
                                <div className="p-2 bg-green-500/10 rounded-lg"><Calendar className="w-4 h-4 text-green-500" /></div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase">Savings</p>
                                    <p className="text-sm font-black">₹12k</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing Grid */}
            <div className="grid gap-6 md:grid-cols-3">
                {tiers.map((tier, index) => (
                    <Card key={index} className={cn(
                        "relative border-2 transition-all duration-300 hover:shadow-xl",
                        tier.popular ? "border-primary bg-card/80 scale-105 z-10" : "border-border/50 bg-card/40",
                        currentPlan === tier.name && "ring-2 ring-primary ring-offset-2"
                    )}>
                        {tier.popular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                Most Popular
                            </div>
                        )}
                        <CardHeader>
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", tier.bgColor, tier.color)}>
                                <tier.icon className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-2xl font-black">{tier.name}</CardTitle>
                            <CardDescription className="text-sm font-medium">{tier.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xs font-bold text-muted-foreground">₹</span>
                                    <span className="text-xl font-black tracking-tight">{formatPrice(isYearly ? tier.yearlyPrice : tier.monthlyPrice)}</span>
                                    <span className="text-muted-foreground font-medium text-[11px]">/{isYearly ? 'year' : 'mo'}</span>
                                </div>
                                {isYearly && (
                                    <span className="text-xs text-green-600 font-bold mt-2 inline-block">
                                        Billed annually (Save ₹{formatPrice((tier.monthlyPrice * 12) - tier.yearlyPrice)})
                                    </span>
                                )}
                            </div>

                            <div className="space-y-3">
                                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                                    What&apos;s included
                                    <span className="h-[1px] flex-1 bg-border/50" />
                                </span>
                                <ul className="space-y-3">
                                    {tier.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm font-medium">
                                            <div className="mt-1 bg-primary/20 rounded-full p-0.5">
                                                <Check className="w-3 h-3 text-primary shrink-0" />
                                            </div>
                                            <span className="text-slate-600 dark:text-slate-300 leading-tight">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full font-black py-6 text-sm uppercase tracking-wider group"
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
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {/* IoT Hardware Pricing */}
            <div className="space-y-6 pt-8">
                <div className="flex items-center gap-3 px-2">
                    <div className="bg-primary/10 p-3 rounded-2xl">
                        <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-primary">Precision Hardware</h2>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Simulation Pricing</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="border-none bg-white/40 dark:bg-card/40 backdrop-blur-md rounded-[2.5rem] border border-white/10 overflow-hidden group hover:scale-[1.02] transition-transform shadow-xl">
                        <CardHeader className="p-8">
                            <Badge className="bg-green-500/10 text-green-500 border-none w-fit mb-4 font-black">SOIL SENSOR V1.0</Badge>
                            <CardTitle className="text-3xl font-black">₹5,000</CardTitle>
                            <CardDescription className="text-foreground font-bold mt-2">Basic Soil Sensor Kit</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-0">
                            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                Standard precision sensor for moisture and pH monitoring.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none bg-slate-950 text-white rounded-[2.5rem] overflow-hidden relative group hover:scale-[1.02] transition-transform shadow-2xl">
                        <CardHeader className="p-8 relative z-10">
                            <Badge className="bg-primary/20 text-primary border-primary/20 w-fit mb-4 font-black">ADVANCED HUB</Badge>
                            <CardTitle className="text-3xl font-black text-primary">₹10,000</CardTitle>
                            <CardDescription className="text-slate-300 font-bold mt-2">Advanced Sensor Bundle</CardDescription>
                        </CardHeader>
                        <CardContent className="px-8 pb-8 pt-0 relative z-10">
                            <p className="text-sm font-medium text-slate-400 leading-relaxed">
                                Multi-sensor arrays for automated nutrient and irrigation control.
                            </p>
                        </CardContent>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl rounded-full" />
                    </Card>
                </div>
            </div>

            {/* ROI Section */}
            <div className="grid md:grid-cols-2 gap-6 items-center bg-slate-950 text-white rounded-[2.5rem] p-8 md:p-12 overflow-hidden relative">
                <div className="space-y-6 relative z-10">
                    <Badge variant="outline" className="text-primary border-primary font-bold">ROI CALCULATOR</Badge>
                    <h2 className="text-3xl font-black">See the impact on your <span className="text-primary">bottom line.</span></h2>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-primary text-xl">30%</div>
                            <p className="text-slate-300 text-sm">Average increase in crop yield using our AI recommendations.</p>
                        </li>
                        <li className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center font-black text-blue-400 text-xl">40%</div>
                            <p className="text-slate-300 text-sm">Reduction in water consumption through smart irrigation.</p>
                        </li>
                    </ul>
                </div>
                <div className="relative h-64 flex items-center justify-center">
                    <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                    <Card className="bg-white/5 border-white/10 backdrop-blur-xl p-8 relative z-10 w-full flex flex-col gap-8">
                        <div>
                            <h4 className="font-bold text-lg mb-1">Projected Annual Profit</h4>
                            <div className="text-4xl font-black text-primary">₹{profitIncrease.toLocaleString()}</div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm font-bold text-slate-300">
                                <span>Farm Size</span>
                                <span className="text-white bg-primary/20 px-3 py-1 rounded-full">{farmSize[0]} Hectares</span>
                            </div>
                            <Slider
                                defaultValue={[10]}
                                max={500}
                                min={1}
                                step={1}
                                value={farmSize}
                                onValueChange={setFarmSize}
                                className="w-full cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] font-bold text-slate-500">
                                <span>1 ha</span>
                                <span>500 ha</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Support / FAQ */}
            <div className="space-y-4 pt-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black">Common Questions</h2>
                    <Button variant="ghost" className="text-primary font-bold">Contact Support</Button>
                </div>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1" className="border-none bg-card/40 px-4 rounded-xl mb-2">
                        <AccordionTrigger className="hover:no-underline font-bold text-sm">Can I switch plans anytime?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-xs leading-relaxed">
                            Yes! You can upgrade or downgrade your plan at any time. If you upgrade, the change is immediate. If you downgrade, it will take effect at the end of your billing cycle.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2" className="border-none bg-card/40 px-4 rounded-xl mb-2">
                        <AccordionTrigger className="hover:no-underline font-bold text-sm">How does the 1-on-1 consultation work?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-xs leading-relaxed">
                            Premium members can schedule a monthly video call with our agricultural experts to discuss their farm strategy, soil health, and optimization techniques.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3" className="border-none bg-card/40 px-4 rounded-xl mb-2">
                        <AccordionTrigger className="hover:no-underline font-bold text-sm">Do you offer custom enterprise pricing?</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground text-xs leading-relaxed">
                            For cooperatives or industrial farms with over 500 acres, contact our sales team for custom data pipelines and white-labeled dashboards.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                <Button variant="outline" className="rounded-full px-8 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" />
                    Billing History
                </Button>
                <Button variant="outline" className="rounded-full px-8">
                    Cancel Subscription
                </Button>
            </div>
        </div>
    );
}

function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(" ");
}
