"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { useSensors } from '@/context/SensorContext';
import { diagnoseCrop } from './actions';
import type { DiagnoseCropOutput } from '@/ai/flows/diagnose-crop-disease';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Camera, RefreshCw, AlertTriangle, CheckCircle2, FlaskConical, Leaf } from 'lucide-react';

export default function CropDiagnosis() {
  const { settings } = useSensors();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DiagnoseCropOutput | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const zones = ["All Zones", "North Field", "East Block", "South Row", "Greenhouse"];
  const [activeZone, setActiveZone] = useState("All Zones");

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDiagnose = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const data = await diagnoseCrop({
        photoDataUri: image,
        cropType: settings.cropType,
      });
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col pt-6 pb-24 px-4 gap-6">
      
      <header className="px-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Crop Health
        </h1>
        <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
          <Camera className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Vision Analysis</span>
        </div>
      </header>

      {/* Anchor Image Frame */}
      <div className="relative w-full h-[280px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 group bg-surface flex items-center justify-center">
        {image ? (
          <Image 
            src={image}
            alt="Crop Details" 
            fill 
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-muted-foreground/50">
            <Camera className="w-12 h-12" />
            <p className="text-sm font-medium">No image loaded</p>
          </div>
        )}
        {/* Inner shadow */}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/20 rounded-[2rem] pointer-events-none" />
      </div>

      {!result ? (
        <div className="flex-1 flex flex-col space-y-6">
          {/* Zone Selector */}
          <div className="w-[calc(100%+2rem)] -ml-4 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex gap-2 px-4 w-max">
              {zones.map((zone) => (
                <button
                  key={zone}
                  onClick={() => setActiveZone(zone)}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-300",
                    activeZone === zone 
                      ? "bg-foreground text-background" 
                      : "bg-surface text-muted-foreground border border-white/5 active:scale-95"
                  )}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          <div className="glass p-5 rounded-[2rem] space-y-2">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-accent" />
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</p>
            </div>
             <p className="text-base font-medium text-foreground/90 leading-relaxed pl-1 pt-1">
               The {activeZone.toLowerCase()} is showing robust signs of photosynthesis. No immediate physiological stress detected. 
             </p>
          </div>

          <div className="flex flex-col gap-3 mt-auto">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            
            {!image ? (
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[56px] rounded-2xl bg-accent text-background font-bold text-lg hover:bg-accent/90 active:scale-95 transition-all outline-none"
              >
                Take a Photo
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={handleDiagnose}
                  disabled={loading}
                  className="w-full h-[56px] rounded-2xl bg-accent text-background font-bold text-lg hover:bg-accent/90 active:scale-[0.98] transition-all outline-none"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                       <RefreshCw className="w-5 h-5 animate-spin" />
                       Analyzing...
                    </div>
                  ) : "Analyze Crop"}
                </Button>
                <Button 
                  onClick={() => setImage(null)}
                  variant="outline"
                  disabled={loading}
                  className="w-full h-[56px] rounded-2xl bg-transparent border-white/10 text-foreground font-semibold text-base hover:bg-white/5 active:scale-100 transition-all"
                >
                  Clear Photo
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-4 animate-in slide-in-from-bottom-8 duration-500">
           
           {/* Result Header */}
           <div className="flex items-center justify-between px-2">
             <h2 className="text-2xl font-bold tracking-tight text-foreground">{result.identification}</h2>
             <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase flex items-center gap-1.5",
                result.severity === 'High' ? "bg-danger/20 text-danger" : 
                result.severity === 'Medium' ? "bg-gold/20 text-gold" : "bg-accent/20 text-accent"
             )}>
                {result.severity === 'High' ? <AlertTriangle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                {(result.confidence * 100).toFixed(0)}% Match
             </span>
           </div>

           {/* Structured Result List */}
           <div className="glass rounded-[2rem] overflow-hidden divide-y divide-white/5">
              <div className="p-5 space-y-2">
                 <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Observation</p>
                 <p className="text-[15px] font-medium text-foreground/90 leading-relaxed pr-2">{result.description}</p>
              </div>
              <div className="p-5 bg-blue/5 space-y-2">
                 <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue/20 flex items-center justify-center">
                       <FlaskConical className="w-3 h-3 text-blue" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue">Treatment Plan</p>
                 </div>
                 <p className="text-[15px] font-medium text-blue leading-relaxed pr-2 pl-1">&quot;{result.organicTreatment}&quot;</p>
              </div>
           </div>

           <Button 
            onClick={() => { setResult(null); setImage(null); }}
            className="w-full h-[56px] mt-4 rounded-2xl bg-surface text-foreground font-bold text-lg hover:bg-surface-hover active:scale-[0.98] border border-white/10 transition-all shadow-xl"
           >
             Triage Another Crop
           </Button>
        </div>
      )}
    </div>
  );
}
