"use client";

import { Badge } from '@/components/ui/badge';

export function Footer() {
    return (
        <footer className="px-6 py-8 mt-auto border-t border-border/40 bg-card/20 backdrop-blur-md opacity-60">
            <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-[8px] font-black tracking-tighter uppercase px-1.5 py-0 border-primary/20 text-primary">Simulation Notice</Badge>
                <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">DECA IBP 2026</p>
            </div>
            <p className="text-[8px] font-medium leading-relaxed text-muted-foreground/80">
                AgriSense AI is a business simulation developed for the DECA International Business Plan 2026. All agricultural data, AI diagnoses, and sensor responses are simulated for presentation purposes.
            </p>
        </footer>
    );
}
