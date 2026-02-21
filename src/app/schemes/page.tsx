"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Landmark, ExternalLink, CheckCircle2, Phone } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';

const schemes = [
  {
    name: 'PM-KISAN Samman Nidhi',
    benefit: '₹6,000 yearly income support in 3 installments of ₹2,000',
    status: 'Active',
    type: 'Direct Benefit',
    url: 'https://pmkisan.gov.in',
    helpline: '155261',
  },
  {
    name: 'Pradhan Mantri Fasal Bima Yojana',
    benefit: 'Crop insurance against natural calamities at subsidized premium',
    status: 'Enrolling',
    type: 'Insurance',
    url: 'https://pmfby.gov.in',
    helpline: '14447',
  },
  {
    name: 'Soil Health Card Scheme',
    benefit: 'Free soil testing and crop-wise nutrient recommendations',
    status: 'Available',
    type: 'Technical',
    url: 'https://soilhealth.dac.gov.in',
    helpline: null,
  },
  {
    name: 'PM Krishi Sinchai Yojana',
    benefit: 'Subsidies up to 55% on drip and sprinkler irrigation systems',
    status: 'State-wise',
    type: 'Irrigation',
    url: 'https://pmksy.gov.in',
    helpline: null,
  },
  {
    name: 'eNAM — National Market',
    benefit: 'Sell crops online across 1,000+ mandis at best prices',
    status: 'Live',
    type: 'Market',
    url: 'https://www.enam.gov.in/web/',
    helpline: '1800-270-0224',
  },
  {
    name: 'Kisan Credit Card',
    benefit: 'Short-term credit up to ₹3 lakh at 4% interest for farm inputs',
    status: 'Available',
    type: 'Finance',
    url: 'https://www.nabard.org/content1.aspx?id=572',
    helpline: null,
  },
];

const statusColor: Record<string, string> = {
  Active: 'text-green-600',
  Enrolling: 'text-blue-600',
  Available: 'text-emerald-600',
  'State-wise': 'text-orange-600',
  Live: 'text-green-600',
};

export default function GovtSchemes() {
  const { t } = useSensors();

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="px-2">
        <h2 className="text-2xl font-black text-primary flex items-center gap-2">
          <Landmark className="w-6 h-6" />
          {t('schemes_title')}
        </h2>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Subsidies & Central Support</p>
      </div>

      <div className="grid gap-4">
        {schemes.map((scheme, i) => (
          <a
            key={i}
            href={scheme.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="border-none shadow-sm bg-card/40 backdrop-blur-md rounded-[1.5rem] border border-white/10 group overflow-hidden hover:shadow-md transition-all active:scale-[0.98]">
              <CardHeader className="p-5 pb-2">
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase tracking-widest">
                    {scheme.type}
                  </Badge>
                  <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${statusColor[scheme.status] ?? 'text-muted-foreground'}`}>
                    <CheckCircle2 className="w-3 h-3" />
                    {scheme.status}
                  </div>
                </div>
                <CardTitle className="text-base font-black leading-tight group-hover:text-primary transition-colors flex items-start justify-between gap-2">
                  {scheme.name}
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary shrink-0 mt-0.5 transition-colors" />
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3">
                <p className="text-xs font-medium text-muted-foreground">
                  {scheme.benefit}
                </p>
                {scheme.helpline && (
                  <a
                    href={`tel:${scheme.helpline}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-1.5 text-[9px] font-black text-primary bg-primary/5 px-3 py-1.5 rounded-full w-fit hover:bg-primary/10 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    Helpline: {scheme.helpline}
                  </a>
                )}
              </CardContent>
            </Card>
          </a>
        ))}
      </div>

      {/* CSC Locator CTA */}
      <a href="https://locator.csccloud.in" target="_blank" rel="noopener noreferrer">
        <div className="bg-primary p-6 rounded-[2rem] text-white shadow-xl relative overflow-hidden active:scale-[0.98] transition-all">
          <div className="relative z-10 space-y-3">
            <h3 className="text-lg font-black uppercase tracking-wider">Need Help Applying?</h3>
            <p className="text-xs font-medium opacity-80 leading-relaxed">
              Visit your nearest Common Service Center (CSC) or contact your local Agriculture Officer for verification and form filling assistance.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/10 px-4 py-2 rounded-full w-fit">
              <ExternalLink className="w-3 h-3" />
              Find Nearest CSC
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
      </a>
    </div>
  );
}