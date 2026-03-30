"use client";

import { Badge } from '@/components/ui/badge';

export function Footer() {
    return (
        <footer className="px-6 py-8 mt-auto border-t border-border/30">
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[8px] font-bold tracking-wider uppercase px-1.5 py-0 border-primary/30 text-primary bg-primary/5">
                    Simulation
                </Badge>
                <p className="text-[8px] font-bold uppercase tracking-[0.15em] text-muted-foreground">DECA IBP 2026</p>
            </div>
            <p className="text-[8px] font-medium leading-relaxed text-muted-foreground/70">
                AgriSense AI is a business simulation developed for the DECA International Business Plan 2026. All agricultural data, AI diagnoses, and sensor responses are simulated for presentation purposes.
            </p>
        </footer>
    );
}
