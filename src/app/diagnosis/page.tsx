"use client";

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, AlertTriangle, RefreshCw, Leaf, Sparkles, WifiOff, X, ShieldCheck, Upload } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import type { DiagnoseCropOutput } from '@/ai/flows/diagnose-crop-disease';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { motion } from 'framer-motion';

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

const severityConfig = {
  High: { color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/25', label: 'Critical' },
  Medium: { color: 'text-primary', bg: 'bg-primary/10 border-primary/25', label: 'Moderate' },
  Low: { color: 'text-sage', bg: 'bg-sage/10 border-sage/25', label: 'Low' },
};

export default function CropDiagnosis() {
  const { settings, t } = useSensors();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseCropOutput | null>(null);
  const [isOfflineResult, setIsOfflineResult] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
      setResult(null);
      setIsOfflineResult(false);
      setAiError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) processFile(file);
  };

  const handleDiagnose = async () => {
    if (!image) return;
    setLoading(true);
    setResult(null);
    setIsOfflineResult(false);
    setAiError(null);

    if (typeof window !== 'undefined' && !window.navigator.onLine) {
      setTimeout(() => {
        setResult(getDemoResult(settings.cropType));
        setIsOfflineResult(true);
        setLoading(false);
      }, 1500);
      return;
    }

    try {
      const response = await fetch('/api/diagnose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoDataUri: image, cropType: settings.cropType }),
      });
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.details || err.error || `Server error ${response.status}`);
      }
      const data: DiagnoseCropOutput = await response.json();
      setResult(data);
    } catch (error: any) {
      console.error('AI diagnosis failed:', error?.message);
      setAiError(error?.message || 'AI analysis failed. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setImage(null);
    setIsOfflineResult(false);
    setAiError(null);
  };

  const sev = result ? severityConfig[result.severity as keyof typeof severityConfig] || severityConfig.Low : null;

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">{t('scan_title')}</h2>
          <Badge variant="outline" className={cn(
            "text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full",
            isOfflineResult ? "bg-destructive/10 text-destructive border-destructive/25" : "bg-primary/10 text-primary border-primary/25"
          )}>
            {isOfflineResult ? "Demo Mode" : "Live AI"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground font-medium">{t('scan_subtitle')}</p>
      </div>

      {!image ? (
        <section className="space-y-6">
          {/* ═══ Drag & Drop Upload Zone ═══ */}
          <Card className="border border-border/50 bg-card/80 rounded-2xl overflow-hidden shadow-premium">
            <CardContent className="p-6">
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={cn(
                  "aspect-square md:aspect-[16/10] rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-300",
                  isDragging
                    ? "border-primary bg-primary/5 scale-[1.01]"
                    : "border-primary/30 bg-muted/20 hover:bg-muted/40 hover:border-primary/50"
                )}
              >
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors",
                  isDragging ? "bg-primary/15" : "bg-muted/50 border border-border/50"
                )}>
                  {isDragging ? <Upload className="w-8 h-8 text-primary" /> : <Camera className="w-8 h-8 text-muted-foreground" />}
                </div>
                <div className="text-center space-y-1">
                  <p className="font-display text-lg font-semibold text-foreground">
                    {isDragging ? 'Drop image here' : 'Snap or Upload'}
                  </p>
                  <p className="text-sm text-muted-foreground font-medium">Drag & drop or click — clear photo of infected leaf</p>
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              </div>
            </CardContent>
          </Card>

          {/* Info block */}
          <div className="bg-muted/30 p-4 rounded-xl border border-border/50 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs font-medium text-foreground leading-relaxed mt-1">
                AgriSense AI analyses your crop photo to identify diseases, nutrient deficiencies, and pests with high accuracy.
              </p>
            </div>
            <div className="pt-3 border-t border-border/30">
              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider mb-1">Setup Note</p>
              <p className="text-[10px] text-muted-foreground font-medium">To enable real-time AI diagnosis, ensure <code className="bg-primary/10 px-1 rounded text-primary font-mono">GOOGLE_GENAI_API_KEY</code> is set in your environment. Otherwise, the app uses realistic demo data.</p>
            </div>
          </div>
        </section>
      ) : (
        <section className="space-y-6">
          {/* ═══ Image + Results — Split Pane ═══ */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left: Image */}
            <Card className="border border-border/50 bg-card/80 rounded-2xl overflow-hidden shadow-premium">
              <CardContent className="p-2">
                <div className="relative aspect-square rounded-xl overflow-hidden bg-muted group">
                  <Image src={image} alt="Crop" fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent pointer-events-none" />
                  <button
                    onClick={reset}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-background/60 backdrop-blur-sm text-foreground flex items-center justify-center hover:bg-background/80 transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {loading && (
                    <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
                      {/* Loading skeleton */}
                      <div className="space-y-3 w-3/4">
                        <div className="skeleton h-4 w-full" />
                        <div className="skeleton h-4 w-2/3" />
                        <div className="skeleton h-20 w-full mt-4" />
                        <div className="skeleton h-4 w-1/2" />
                      </div>
                      <p className="text-xs font-medium text-muted-foreground mt-2">Analysing leaf structure & pigments...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Right: Results or Action */}
            <div className="space-y-4 flex flex-col">
              {!result && !loading && !aiError && (
                <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-border/50 rounded-2xl p-8 bg-muted/10">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-display text-lg font-semibold text-foreground mb-1">Ready to Analyse</p>
                  <p className="text-xs text-muted-foreground mb-6">AI will scan for diseases, deficiencies, and pests</p>
                  <Button onClick={handleDiagnose} className="w-full max-w-xs h-12 bg-primary text-primary-foreground rounded-xl font-semibold text-sm shadow-premium gap-2">
                    <Sparkles className="w-4 h-4" />
                    {t('scan_btn')}
                  </Button>
                </div>
              )}

              {aiError && !loading && (
                <div className="p-5 rounded-xl bg-destructive/8 border border-destructive/25 space-y-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <p className="text-xs font-bold uppercase tracking-wider">AI Analysis Failed</p>
                  </div>
                  <p className="text-xs text-destructive/80 font-medium leading-relaxed">{aiError}</p>
                  <div className="flex gap-2 pt-1">
                    <Button onClick={handleDiagnose} variant="destructive" className="flex-1 h-10 rounded-lg text-xs">
                      <RefreshCw className="w-3 h-3 mr-2" /> Retry
                    </Button>
                    <Button onClick={() => { setAiError(null); setResult(getDemoResult(settings.cropType)); setIsOfflineResult(true); }} variant="outline" className="flex-1 h-10 rounded-lg text-xs">
                      Use Demo
                    </Button>
                  </div>
                </div>
              )}

              {result && sev && (
                <motion.div
                  className="space-y-4 flex-1"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {isOfflineResult && (
                    <div className="flex items-center gap-2 bg-destructive/8 border border-destructive/20 px-3 py-2 rounded-lg w-fit">
                      <WifiOff className="w-3 h-3 text-destructive" />
                      <span className="text-[10px] font-bold text-destructive uppercase tracking-wider">Demo Result</span>
                    </div>
                  )}

                  {/* Identification */}
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2.5 rounded-xl border", sev.bg)}>
                      {result.severity === 'High' ? <AlertTriangle className={cn("w-5 h-5", sev.color)} /> : <ShieldCheck className={cn("w-5 h-5", sev.color)} />}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground leading-tight">{result.identification}</h3>
                      <p className="font-mono text-[11px] text-muted-foreground mt-1">
                        Confidence: {(result.confidence * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>

                  <Badge variant="outline" className={cn("text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md", sev.bg, sev.color)}>
                    {sev.label} Severity
                  </Badge>

                  {/* Observation */}
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Observation</p>
                    <p className="text-xs text-foreground leading-relaxed font-medium">{result.description}</p>
                  </div>

                  {/* Treatment */}
                  <div className="p-4 rounded-xl bg-sage/5 border border-sage/20">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Leaf className="w-3.5 h-3.5 text-sage" />
                      <p className="text-[10px] font-bold text-sage uppercase tracking-wider">Organic Treatment Plan</p>
                    </div>
                    <p className="text-xs text-foreground leading-relaxed font-medium">{result.organicTreatment}</p>
                  </div>

                  <Button variant="outline" className="w-full rounded-xl h-10 border-border/50 mt-2" onClick={reset}>
                    {t('scan_another')}
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Photo Guidelines */}
      <section className="space-y-3">
        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] pl-1">Photo Guidelines</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {[
            { label: 'Good Lighting', icon: '☀️' },
            { label: 'Clear Focus', icon: '🔍' },
            { label: 'Close Up', icon: '🌿' },
            { label: 'Single Leaf', icon: '🍃' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-card/80 border border-border/50">
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
