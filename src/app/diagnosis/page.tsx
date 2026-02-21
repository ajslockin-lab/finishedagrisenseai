"use client";

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, ShieldCheck, AlertTriangle, RefreshCw, Leaf, Sparkles, WifiOff } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import { diagnoseCrop } from './actions';
import type { DiagnoseCropOutput } from '@/ai/flows/diagnose-crop-disease';
import { cn } from '@/lib/utils';
import Image from 'next/image';

// Offline/demo fallbacks by crop type
const DEMO_DIAGNOSES: Record<string, DiagnoseCropOutput> = {
  Rice: {
    identification: 'Rice Blast (Magnaporthe oryzae)',
    confidence: 0.87,
    description: 'Diamond-shaped lesions with grey centers and brown borders observed on leaves. Classic symptoms of rice blast — a fungal infection most common in humid, warm conditions with heavy nitrogen use.',
    organicTreatment: 'Apply neem oil spray (5ml/L) every 7 days. Ensure proper field drainage and reduce nitrogen application. Remove and destroy infected plant material. Use Trichoderma-based bioagent as a soil drench.',
    severity: 'Medium',
  },
  Wheat: {
    identification: 'Yellow Rust (Puccinia striiformis)',
    confidence: 0.91,
    description: 'Yellow-orange pustules in stripe pattern along leaf veins. Yellow rust thrives in cool, moist weather and can spread rapidly across a field.',
    organicTreatment: 'Remove infected leaves immediately. Apply sulfur-based fungicide or neem extract spray. Ensure good air circulation between rows. Scout weekly and remove new pustules before they sporulate.',
    severity: 'High',
  },
  Cotton: {
    identification: 'Bacterial Blight (Xanthomonas citri)',
    confidence: 0.83,
    description: 'Angular water-soaked lesions on leaves turning brown with yellow halos. Commonly spreads through rain splash and infected seeds.',
    organicTreatment: 'Spray copper-based bactericide (Bordeaux mixture 1%). Avoid overhead irrigation. Remove affected branches and dispose safely. Maintain plant spacing for airflow.',
    severity: 'Medium',
  },
  default: {
    identification: 'Nutrient Deficiency (Nitrogen)',
    confidence: 0.79,
    description: 'Yellowing of older lower leaves progressing upward — classic nitrogen deficiency pattern. Soil pH imbalance or waterlogging can reduce nitrogen uptake even in well-fertilized fields.',
    organicTreatment: 'Apply compost tea or vermicompost at base of plants. Use green manure cover crops in off-season. Foliar spray of diluted fish emulsion (2%) can provide quick uptake. Check soil pH (target 6.0–7.0).',
    severity: 'Low',
  },
};

function getDemoResult(cropType: string): DiagnoseCropOutput {
  return DEMO_DIAGNOSES[cropType] || DEMO_DIAGNOSES.default;
}

export default function CropDiagnosis() {
  const { settings, t } = useSensors();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseCropOutput | null>(null);
  const [isOfflineResult, setIsOfflineResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
        setIsOfflineResult(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!image) return;
    setLoading(true);
    setIsOfflineResult(false);
    try {
      const data = await diagnoseCrop({
        photoDataUri: image,
        cropType: settings.cropType,
      });
      setResult(data);
    } catch (error: any) {
      console.warn('AI diagnosis failed, using demo result:', error?.message);
      // Offline/no-API fallback: realistic demo result
      await new Promise(r => setTimeout(r, 1400)); // simulate AI thinking
      setResult(getDemoResult(settings.cropType));
      setIsOfflineResult(true);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setImage(null);
    setIsOfflineResult(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24">
      <section className="text-center space-y-2">
        <h2 className="text-3xl font-black text-primary flex items-center justify-center gap-2">
          <ShieldCheck className="w-8 h-8 text-accent" />
          {t('scan_title')}
        </h2>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.2em]">{t('scan_subtitle')}</p>
      </section>

      <Card className="border-none shadow-2xl bg-card/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden border border-white/20">
        <CardContent className="p-0">
          <div
            onClick={() => !loading && !result && fileInputRef.current?.click()}
            className={cn(
              "h-80 w-full flex flex-col items-center justify-center cursor-pointer transition-all duration-500 relative",
              !image ? "bg-muted/30 border-2 border-dashed border-primary/20 m-4 rounded-[2rem] w-[calc(100%-2rem)]" : "bg-black"
            )}
          >
            {image ? (
              <>
                <Image src={image} alt="Crop" fill className="object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {!loading && !result && (
                  <div className="absolute bottom-6 flex gap-3">
                    <Button onClick={(e) => { e.stopPropagation(); setImage(null); }} variant="secondary" size="sm" className="rounded-full bg-white/10 backdrop-blur-md text-white border-none">Change</Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Snap or Upload Photo</p>
                  <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">Leaf, stem, or fruit</p>
                </div>
              </div>
            )}
            <input type="file" accept="image/*" capture="environment" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
          </div>

          <div className="p-6">
            {!result ? (
              <Button
                disabled={!image || loading}
                onClick={handleDiagnose}
                className="w-full h-16 bg-primary hover:bg-primary/90 text-lg font-black rounded-2xl shadow-xl transition-all active:scale-95"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 animate-spin" />
                    <span className="text-sm">Analyzing crop...</span>
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2 text-accent animate-pulse" />
                    {t('scan_btn')}
                  </>
                )}
              </Button>
            ) : (
              <div className="space-y-6 animate-in zoom-in-95 duration-500">
                {/* Offline badge */}
                {isOfflineResult && (
                  <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-2xl border border-white/10">
                    <WifiOff className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Demo result — AI offline</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-2 rounded-xl",
                      result.severity === 'High' ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-600"
                    )}>
                      {result.severity === 'High' ? <AlertTriangle className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-foreground leading-none">{result.identification}</h3>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-1">
                        Confidence: {(result.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={reset} className="rounded-full h-10 w-10">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>

                {/* Severity badge */}
                <div className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest w-fit",
                  result.severity === 'High' ? "bg-destructive/10 text-destructive" :
                    result.severity === 'Medium' ? "bg-orange-500/10 text-orange-600" :
                      "bg-green-500/10 text-green-600"
                )}>
                  {result.severity} Severity
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-muted/40 border border-white/10">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Observation</p>
                    <p className="text-sm text-foreground leading-relaxed font-medium">{result.description}</p>
                  </div>

                  <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Leaf className="w-4 h-4 text-primary" />
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest">Organic Treatment Plan</p>
                    </div>
                    <p className="text-sm text-foreground leading-relaxed font-bold italic">
                      &quot;{result.organicTreatment}&quot;
                    </p>
                  </div>
                </div>

                <Button className="w-full bg-secondary text-primary font-black rounded-2xl h-14 hover:bg-secondary/80" onClick={reset}>
                  {t('scan_another')}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <section className="px-2 space-y-4">
        <h3 className="text-xs font-black text-primary uppercase tracking-[0.2em]">Guidelines</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Good Lighting', icon: '☀️' },
            { label: 'Clear Focus', icon: '🔍' },
            { label: 'Close Up', icon: '🌿' },
            { label: 'Single Leaf', icon: '🍃' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-card/40 border border-white/10 shadow-sm">
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
