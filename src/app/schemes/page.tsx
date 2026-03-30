"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Landmark, ExternalLink, CheckCircle2, Phone } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const schemes = [
  { name: 'PM-KISAN Samman Nidhi', benefit: '₹6,000 yearly income support in 3 installments of ₹2,000', status: 'Active', type: 'Direct Benefit', url: 'https://pmkisan.gov.in', helpline: '155261' },
  { name: 'Pradhan Mantri Fasal Bima Yojana', benefit: 'Crop insurance against natural calamities at subsidized premium', status: 'Enrolling', type: 'Insurance', url: 'https://pmfby.gov.in', helpline: '14447' },
  { name: 'Soil Health Card Scheme', benefit: 'Free soil testing and crop-wise nutrient recommendations', status: 'Available', type: 'Technical', url: 'https://soilhealth.dac.gov.in', helpline: null },
  { name: 'PM Krishi Sinchai Yojana', benefit: 'Subsidies up to 55% on drip and sprinkler irrigation systems', status: 'State-wise', type: 'Irrigation', url: 'https://pmksy.gov.in', helpline: null },
  { name: 'eNAM — National Market', benefit: 'Sell crops online across 1,000+ mandis at best prices', status: 'Live', type: 'Market', url: 'https://www.enam.gov.in/web/', helpline: '1800-270-0224' },
  { name: 'Kisan Credit Card', benefit: 'Short-term credit up to ₹3 lakh at 4% interest for farm inputs', status: 'Available', type: 'Finance', url: 'https://www.nabard.org/content1.aspx?id=572', helpline: null },
];

const statusConfig: Record<string, string> = {
  Active: 'text-sage', Enrolling: 'text-blue-400', Available: 'text-sage', 'State-wise': 'text-primary', Live: 'text-sage',
};

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } },
} as const;

export default function GovtSchemes() {
  const { t } = useSensors();

  return (
    <motion.div className="space-y-6" variants={stagger.container} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={stagger.item} className="flex items-center gap-3 px-1">
        <div className="bg-purple-500/10 border border-purple-500/20 p-2.5 rounded-xl">
          <Landmark className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">{t('schemes_title')}</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{t('schemes_subtitle')}</p>
        </div>
      </motion.div>

      {/* Scheme cards */}
      <div className="space-y-3">
        {schemes.map((scheme, i) => (
          <motion.div key={i} variants={stagger.item} whileHover={{ y: -1, transition: { duration: 0.15 } }}>
            <a href={scheme.url} target="_blank" rel="noopener noreferrer" className="block">
              <Card className="border border-border/50 bg-card/80 rounded-xl group overflow-hidden hover:border-primary/20 transition-colors">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="bg-primary/8 text-primary border-primary/20 text-[9px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-md">
                      {scheme.type}
                    </Badge>
                    <div className={cn("flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em]", statusConfig[scheme.status] ?? 'text-muted-foreground')}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {scheme.status}
                    </div>
                  </div>
                  <CardTitle className="text-sm font-semibold leading-tight group-hover:text-primary transition-colors flex items-start justify-between gap-2">
                    {scheme.name}
                    <ExternalLink className="w-4 h-4 text-muted-foreground/20 group-hover:text-primary shrink-0 transition-colors" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 space-y-3">
                  <p className="text-xs font-medium text-muted-foreground leading-relaxed">{scheme.benefit}</p>
                  {scheme.helpline && (
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-foreground bg-muted/30 border border-border/50 px-2.5 py-1.5 rounded-lg w-fit">
                      <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                      {t('schemes_helpline_label')}: <span className="text-primary font-mono">{scheme.helpline}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </a>
          </motion.div>
        ))}
      </div>

      {/* CSC CTA */}
      <motion.div variants={stagger.item}>
        <a href="https://locator.csccloud.in" target="_blank" rel="noopener noreferrer" className="block">
          <div className="bg-gradient-to-br from-primary/15 to-sage/10 border border-primary/20 p-5 rounded-2xl shadow-premium relative overflow-hidden transition-colors hover:border-primary/30">
            <div className="relative z-10 space-y-2.5">
              <h3 className="font-display text-sm font-bold text-foreground tracking-tight">{t('schemes_help_title')}</h3>
              <p className="text-xs font-medium text-muted-foreground leading-relaxed max-w-[85%]">{t('schemes_help_desc')}</p>
              <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] bg-primary text-primary-foreground px-3 py-1.5 rounded-lg w-fit mt-1 shadow-sm">
                <ExternalLink className="w-3.5 h-3.5" />
                {t('schemes_find_csc')}
              </div>
            </div>
          </div>
        </a>
      </motion.div>
    </motion.div>
  );
}