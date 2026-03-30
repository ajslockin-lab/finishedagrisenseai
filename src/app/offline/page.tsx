'use client';

import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } },
} as const;

export default function Offline() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        className="text-center max-w-md w-full space-y-8"
        variants={stagger.container}
        initial="hidden"
        animate="visible"
      >
        {/* Icon */}
        <motion.div variants={stagger.item} className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center animate-breathe">
            <WifiOff className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">You&apos;re Offline</h1>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xs mx-auto">
              No internet connection detected. Don&apos;t worry — AgriSense works offline too!
            </p>
          </div>
        </motion.div>

        {/* Retry */}
        <motion.div variants={stagger.item}>
          <Button
            onClick={() => window.location.reload()}
            className="bg-primary text-primary-foreground rounded-xl h-12 px-8 font-semibold shadow-premium active-scale gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        </motion.div>

        {/* Available offline features */}
        <motion.div variants={stagger.item}>
          <Card className="border border-border/50 bg-card/80 rounded-2xl text-left">
            <CardContent className="p-6 space-y-4">
              <h2 className="font-display text-base font-bold text-foreground tracking-tight">Available Offline</h2>
              <ul className="space-y-3">
                {[
                  'View previously loaded advisor tips',
                  'Check cached sensor data',
                  'Review saved market prices',
                  'Access your saved information',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-0.5 bg-sage/10 border border-sage/20 rounded-md p-0.5">
                      <CheckCircle2 className="w-3 h-3 text-sage" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
