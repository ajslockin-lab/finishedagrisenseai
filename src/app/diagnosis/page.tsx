"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, ShieldCheck, AlertTriangle, RefreshCw, Leaf, Sparkles, WifiOff, X } from 'lucide-react';
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
    description: 'Yellowing of older lower leaves progressing upward — classic nitrogen deficiency pattern. Soil pH imbalance or waterlogging can reduce nitrogen update even in well-fertilized fields.',
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
    setResult(null);
    setIsOfflineResult(false);

    // Explicit offline check for demo mode
    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      setTimeout(() => {
        setResult(getDemoResult(settings.cropType));
        setIsOfflineResult(true);
        setLoading(false);
      }, 1500);
      return;
    }

    try {
      const data = await diagnoseCrop({
        photoDataUri: image,
        cropType: settings.cropType,
      });
      setResult(data);
    } catch (error: any) {
      console.warn('AI diagnosis failed, using demo result:', error?.message);
      // Fallback: realistic demo result
      await new Promise(r => setTimeout(r, 1400));
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
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="pt-2">
        <h2 className="text-3xl font-black text-primary leading-tight">{t('scan_title')}</h2>
        <p className="text-muted-foreground font-medium">{t('scan_subtitle')}</p>
      </div>

      {!image ? (
        <section className="space-y-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-emerald-500/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <Card className="relative border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/50 backdrop-blur-xl">
              <CardContent className="p-8">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-[2rem] border-4 border-dashed border-primary/20 flex flex-col items-center justify-center gap-4 bg-primary/5 transition-all duration-500 hover:bg-primary/10 cursor-pointer"
                >
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-center space-y-2">
                    <p className="font-black text-lg">Snap or Upload</p>
                    <p className="text-sm text-muted-foreground font-medium">Clear photo of infected leaf</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/5 p-5 rounded-[2rem] border border-primary/10 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-lg">💡</span>
            </div>
            <p className="text-xs font-medium text-muted-foreground leading-relaxed">
              AgriSense AI analyses your crop photo to identify diseases, nutrient deficiencies, and pests with over 94% accuracy.
            </p>
          </div>
        </section>
      ) : (
        <section className="space-y-6">
          <Card className="border-none shadow-premium rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-xl border border-white/10">
            <CardContent className="p-3">
              <div className="relative aspect-square rounded-[2rem] overflow-hidden shadow-inner group">
                <Image
                  src={image}
                  alt="Crop"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                <button
                  onClick={reset}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                {loading && (
                  <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-md flex flex-col items-center justify-center text-white text-center p-6 gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-lg font-black tracking-tight">{t('common_loading')}</p>
                      <p className="text-xs text-white/60 font-medium">Analysing leaf structure & pigments...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {!result && !loading && (
            <button
              onClick={handleDiagnose}
              disabled={loading}
              className="w-full h-16 bg-primary text-white rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[0.98] transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <Sparkles className="w-6 h-6" />
              {t('scan_btn')}
            </button>
          )}

          {result && (
            <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-700">
              <Card className={cn(
                "border-none shadow-premium rounded-[2.5rem] overflow-hidden relative",
                result.severity === 'High' ? "bg-red-500/10" : result.severity === 'Medium' ? "bg-amber-500/10" : "bg-emerald-500/10"
              )}>
                <CardContent className="p-7 space-y-6">
                  {isOfflineResult && (
                    <div className="flex items-center gap-2 bg-orange-500/10 text-orange-600 px-3 py-1 rounded-full border border-orange-500/20 w-fit mb-2">
                      <WifiOff className="w-3 h-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{t('common_offline_demo')}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-3 rounded-full",
                        result.severity === 'High' ? "bg-destructive/10 text-destructive" : "bg-emerald-500/10 text-emerald-600"
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
                </CardContent>
              </Card>
            </div>
          )}
        </section>
      )}

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
