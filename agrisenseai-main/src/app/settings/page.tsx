"use client";

import { useState } from 'react';
import { useSensors, type SupportedLanguage } from '@/context/SensorContext';
import { useTheme } from '@/context/ThemeContext';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Globe, 
  Sprout, 
  MapPin, 
  Bell, 
  Moon, 
  Sun, 
  Save,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

const locations = [
  'Amritsar, Punjab', 'Ludhiana, Punjab', 'Bathinda, Punjab', 'Jalandhar, Punjab', 'Patiala, Punjab',
  'Karnal, Haryana', 'Hisar, Haryana', 'Rohtak, Haryana', 'Sirsa, Haryana',
  'Meerut, Uttar Pradesh', 'Lucknow, Uttar Pradesh', 'Bareilly, Uttar Pradesh', 'Varanasi, Uttar Pradesh', 'Aligarh, Uttar Pradesh', 'Gorakhpur, Uttar Pradesh', 'Jhansi, Uttar Pradesh',
  'Jaipur, Rajasthan', 'Jodhpur, Rajasthan', 'Kota, Rajasthan', 'Sri Ganganagar, Rajasthan', 'Hanumangarh, Rajasthan',
  'Nashik, Maharashtra', 'Pune, Maharashtra', 'Nagpur, Maharashtra', 'Aurangabad, Maharashtra', 'Sangli, Maharashtra', 'Kolhapur, Maharashtra', 'Akola, Maharashtra',
  'Ahmedabad, Gujarat', 'Rajkot, Gujarat', 'Surat, Gujarat', 'Junagadh, Gujarat', 'Mehsana, Gujarat', 'Anand, Gujarat',
  'Indore, Madhya Pradesh', 'Bhopal, Madhya Pradesh', 'Ujjain, Madhya Pradesh', 'Sagar, Madhya Pradesh', 'Rewa, Madhya Pradesh',
  'Raipur, Chhattisgarh', 'Bilaspur, Chhattisgarh',
  'Patna, Bihar', 'Muzaffarpur, Bihar', 'Bhagalpur, Bihar', 'Gaya, Bihar',
  'Kolkata, West Bengal', 'Bardhaman, West Bengal', 'Malda, West Bengal', 'Jalpaiguri, West Bengal', 'Siliguri, West Bengal',
  'Bhubaneswar, Odisha', 'Cuttack, Odisha', 'Sambalpur, Odisha',
  'Hyderabad, Telangana', 'Warangal, Telangana', 'Nizamabad, Telangana', 'Karimnagar, Telangana',
  'Vijayawada, Andhra Pradesh', 'Guntur, Andhra Pradesh', 'Kurnool, Andhra Pradesh', 'Nellore, Andhra Pradesh', 'Eluru, Andhra Pradesh',
  'Bengaluru, Karnataka', 'Mysuru, Karnataka', 'Hubballi, Karnataka', 'Davanagere, Karnataka', 'Raichur, Karnataka', 'Shivamogga, Karnataka',
  'Chennai, Tamil Nadu', 'Coimbatore, Tamil Nadu', 'Madurai, Tamil Nadu', 'Thanjavur, Tamil Nadu', 'Erode, Tamil Nadu', 'Salem, Tamil Nadu',
  'Palakkad, Kerala', 'Wayanad, Kerala', 'Kottayam, Kerala',
  'Guwahati, Assam', 'Dibrugarh, Assam', 'Silchar, Assam',
];

const crops = ['Rice', 'Wheat', 'Cotton', 'Maize', 'Sugarcane', 'Soybean', 'Vegetables', 'Mustard', 'Groundnut', 'Pulses', 'Other'];

const languageOptions: { label: string; value: SupportedLanguage }[] = [
  { label: 'English', value: 'en' },
  { label: 'हिन्दी (Hindi)', value: 'hi' },
  { label: 'ਪੰਜਾਬੀ (Punjabi)', value: 'pb' },
  { label: 'தமிழ் (Tamil)', value: 'ta' },
  { label: 'తెలుగు (Telugu)', value: 'te' },
  { label: 'मराठी (Marathi)', value: 'mr' },
  { label: 'ಕನ್ನಡ (Kannada)', value: 'kn' },
  { label: 'বাংলা (Bengali)', value: 'bn' },
  { label: 'ગુજરાતી (Gujarati)', value: 'gu' },
];

export default function Settings() {
  const { settings, updateSettings, t } = useSensors();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    updateSettings(formData);
    toast({
      title: "Settings updated",
      description: "Preferences saved successfully.",
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col pt-6 pb-[120px] px-4 gap-8 bg-background">
      <header className="px-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {t('settings_title') || 'Settings'}
        </h1>
        <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
          <SettingsIcon className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold uppercase tracking-wider">System Preferences</span>
        </div>
      </header>

      <div className="flex flex-col gap-6">
        {/* Appearance Group */}
        <section className="space-y-3">
          <div className="px-2">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Appearance</p>
          </div>
          <div className="glass rounded-[1.5rem] bg-surface overflow-hidden divide-y divide-white/5 border border-white/5 shadow-xl">
             <div className="flex items-center justify-between p-4 px-5">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                 </div>
                 <span className="text-[15px] font-semibold text-foreground/90">Dark Appearance</span>
               </div>
               <Switch 
                 checked={theme === 'dark'}
                 onCheckedChange={toggleTheme}
                 className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-background border-white/5"
               />
             </div>
          </div>
        </section>

        {/* Localization Group */}
        <section className="space-y-3">
          <div className="px-2">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Localization</p>
          </div>
          <div className="glass rounded-[1.5rem] bg-surface overflow-hidden divide-y divide-white/5 border border-white/5 shadow-xl">
             <div className="p-4 px-5 space-y-1">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Globe className="w-4 h-4" />
                 </div>
                 <span className="text-[15px] font-semibold text-foreground/90">Preferred Language</span>
               </div>
               <Select 
                 value={formData.language} 
                 onValueChange={(val: SupportedLanguage) => setFormData(prev => ({ ...prev, language: val }))}
               >
                 <SelectTrigger className="w-full bg-background/50 border border-white/5 rounded-xl h-11 px-4 text-sm font-semibold focus:ring-1 focus:ring-accent/50 shadow-none">
                   <SelectValue placeholder="Select language" />
                 </SelectTrigger>
                 <SelectContent className="bg-surface border-white/10 rounded-xl overflow-hidden glass">
                   {languageOptions.map(opt => (
                     <SelectItem key={opt.value} value={opt.value} className="text-sm py-2.5 font-medium">
                       {opt.label}
                     </SelectItem>
                   ))}
                 </SelectContent>
               </Select>
             </div>
          </div>
        </section>

        {/* Farm Profile Group */}
        <section className="space-y-3">
          <div className="px-2">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Farm Profile</p>
          </div>
          <div className="glass rounded-[1.5rem] bg-surface overflow-hidden divide-y divide-white/5 border border-white/5 shadow-xl">
             <div className="p-4 px-5 space-y-1">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                    <Sprout className="w-4 h-4" />
                 </div>
                 <span className="text-[15px] font-semibold text-foreground/90">Main Crop</span>
               </div>
               <Select 
                 value={formData.cropType} 
                 onValueChange={(val) => setFormData(prev => ({ ...prev, cropType: val }))}
               >
                 <SelectTrigger className="w-full bg-background/50 border border-white/5 rounded-xl h-11 px-4 text-sm font-semibold focus:ring-1 focus:ring-accent/50 shadow-none">
                   <SelectValue placeholder="Select crop" />
                 </SelectTrigger>
                 <SelectContent className="bg-surface border-white/10 rounded-xl overflow-hidden glass max-h-[300px]">
                   {crops.map(c => <SelectItem key={c} value={c} className="text-sm py-2.5 font-medium">{c}</SelectItem>)}
                 </SelectContent>
               </Select>
             </div>

             <div className="p-4 px-5 space-y-1">
               <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">
                    <MapPin className="w-4 h-4" />
                 </div>
                 <span className="text-[15px] font-semibold text-foreground/90">Location</span>
               </div>
               <Select 
                 value={formData.location} 
                 onValueChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
               >
                 <SelectTrigger className="w-full bg-background/50 border border-white/5 rounded-xl h-11 px-4 text-sm font-semibold focus:ring-1 focus:ring-accent/50 shadow-none">
                   <SelectValue placeholder="Select location" />
                 </SelectTrigger>
                 <SelectContent className="bg-surface border-white/10 rounded-xl overflow-hidden glass max-h-[400px]">
                   {locations.map(l => <SelectItem key={l} value={l} className="text-sm py-2.5 font-medium">{l}</SelectItem>)}
                 </SelectContent>
               </Select>
             </div>
          </div>
        </section>

        {/* Notifications Group */}
        <section className="space-y-3">
          <div className="px-2 flex justify-between items-center">
             <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Smart Alerts</p>
             <ShieldCheck className="w-3.5 h-3.5 text-accent/40" />
          </div>
          <div className="glass rounded-[1.5rem] bg-surface overflow-hidden divide-y divide-white/5 border border-white/5 shadow-xl">
            {Object.entries(formData.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 px-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent">
                     <Bell className="w-4 h-4" />
                  </div>
                  <span className="text-[15px] font-semibold capitalize text-foreground/90">{key} Thresholds</span>
                </div>
                <Switch 
                  checked={value}
                  onCheckedChange={(val) => setFormData(p => ({ ...p, notifications: { ...p.notifications, [key]: val } }))}
                  className="data-[state=checked]:bg-accent data-[state=unchecked]:bg-background border-white/5"
                />
              </div>
            ))}
          </div>
        </section>

        <button 
          onClick={handleSave} 
          className="mt-4 w-full h-[56px] rounded-2xl bg-accent text-background font-bold text-lg hover:bg-accent/90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-2xl"
        >
          <Save className="w-5 h-5" />
          Save Preferences
        </button>
      </div>

    </div>
  );
}
