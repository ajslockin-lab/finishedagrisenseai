"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSensors, type SupportedLanguage } from '@/context/SensorContext';
import { useToast } from '@/hooks/use-toast';
import { Save, Database, Bell, Languages, Settings as SettingsIcon, Activity, Shield } from 'lucide-react';
import { NotificationSettings } from '@/components/NotificationSettings';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } },
} as const;

export default function Settings() {
  const { settings, updateSettings, t } = useSensors();
  const { toast } = useToast();
  const [formData, setFormData] = useState(settings);

  const handleSave = () => {
    updateSettings(formData);
    toast({
      title: "Settings Saved",
      description: "Your farm profile and preferences have been updated.",
    });
  };

  return (
    <motion.div
      className="space-y-6 pb-28"
      variants={stagger.container}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={stagger.item} className="flex items-center gap-3 px-1">
        <div className="bg-muted/50 border border-border/50 p-2.5 rounded-xl">
          <SettingsIcon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">{t('settings_title')}</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{t('settings_profile_subtitle')}</p>
        </div>
      </motion.div>

      {/* Sensor Device Table */}
      <motion.div variants={stagger.item}>
        <Card className="border border-border/50 bg-card/80 rounded-2xl overflow-hidden">
          <CardHeader className="bg-muted/20 p-4 pb-3 border-b border-border/50">
            <CardTitle className="text-xs font-semibold flex items-center gap-2 text-foreground uppercase tracking-wider">
              <Activity className="w-4 h-4 text-sage" />
              IoT Sensor Devices
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/10">
                    <th className="text-left px-4 py-3 font-bold text-muted-foreground uppercase tracking-[0.15em] text-[9px]">Device</th>
                    <th className="text-left px-4 py-3 font-bold text-muted-foreground uppercase tracking-[0.15em] text-[9px]">Type</th>
                    <th className="text-center px-4 py-3 font-bold text-muted-foreground uppercase tracking-[0.15em] text-[9px]">Status</th>
                    <th className="text-right px-4 py-3 font-bold text-muted-foreground uppercase tracking-[0.15em] text-[9px]">Battery</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {[
                    { name: 'Soil-Moisture-01', type: 'Moisture', status: 'Active', battery: '92%' },
                    { name: 'Soil-Temp-01', type: 'Temperature', status: 'Active', battery: '88%' },
                    { name: 'pH-Sensor-01', type: 'pH Meter', status: 'Active', battery: '76%' },
                    { name: 'NPK-Sensor-01', type: 'Nutrient', status: 'Standby', battery: '64%' },
                  ].map((device, i) => (
                    <tr key={i} className="border-b border-border/30 last:border-none hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-semibold text-foreground tracking-tight">{device.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{device.type}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={cn(
                          "inline-flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                          device.status === 'Active' ? "bg-sage/10 text-sage border-sage/25" : "bg-primary/10 text-primary border-primary/25"
                        )}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", device.status === 'Active' ? "bg-sage animate-live-dot" : "bg-primary")} />
                          {device.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-foreground font-semibold">{device.battery}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Language */}
      <motion.div variants={stagger.item}>
        <Card className="border border-border/50 bg-card/80 rounded-2xl overflow-hidden">
          <CardHeader className="bg-muted/20 p-4 pb-3 border-b border-border/50">
            <CardTitle className="text-xs font-semibold flex items-center gap-2 text-foreground uppercase tracking-wider">
              <Languages className="w-4 h-4 text-primary" />
              {t('settings_lang')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <Select
              value={formData.language}
              onValueChange={(val: SupportedLanguage) => setFormData(prev => ({ ...prev, language: val }))}
            >
              <SelectTrigger className="bg-muted/30 border border-border/50 rounded-xl h-11 px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-border/50 bg-card shadow-md max-h-[300px]">
                {languageOptions.map(opt => <SelectItem key={opt.value} value={opt.value} className="rounded-lg font-medium cursor-pointer">{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </motion.div>

      {/* Farm Profile */}
      <motion.div variants={stagger.item}>
        <Card className="border border-border/50 bg-card/80 rounded-2xl overflow-hidden">
          <CardHeader className="bg-muted/20 p-4 pb-3 border-b border-border/50">
            <CardTitle className="text-xs font-semibold flex items-center gap-2 text-foreground uppercase tracking-wider">
              <Database className="w-4 h-4 text-primary" />
              {t('settings_profile')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 p-4">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.15em] px-1">{t('settings_main_crop')}</Label>
              <Select
                value={formData.cropType}
                onValueChange={(val) => setFormData(prev => ({ ...prev, cropType: val }))}
              >
                <SelectTrigger className="bg-muted/30 border border-border/50 rounded-xl h-11 px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border/50 bg-card shadow-md max-h-[300px]">
                  {crops.map(c => <SelectItem key={c} value={c} className="rounded-lg font-medium cursor-pointer">{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.15em] px-1">{t('settings_location_label')}</Label>
              <Select
                value={formData.location}
                onValueChange={(val) => setFormData(prev => ({ ...prev, location: val }))}
              >
                <SelectTrigger className="bg-muted/30 border border-border/50 rounded-xl h-11 px-4 text-sm font-medium focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 transition-colors">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border border-border/50 bg-card shadow-md max-h-[300px]">
                  {locations.map(l => <SelectItem key={l} value={l} className="rounded-lg font-medium cursor-pointer">{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Alerts & Notifications */}
      <motion.div variants={stagger.item}>
        <Card className="border border-border/50 bg-card/80 rounded-2xl overflow-hidden">
          <CardHeader className="bg-muted/20 p-4 pb-3 border-b border-border/50">
            <CardTitle className="text-xs font-semibold flex items-center gap-2 text-foreground uppercase tracking-wider">
              <Bell className="w-4 h-4 text-primary" />
              {t('settings_notifications')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 p-4">
            {Object.entries(formData.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted/40 border border-border/50 flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <Label className="text-sm font-medium capitalize text-foreground">{key} {t('settings_alerts')}</Label>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(val) => setFormData(p => ({ ...p, notifications: { ...p.notifications, [key]: val } }))}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Native Notification Settings */}
      <motion.div variants={stagger.item}>
        <NotificationSettings />
      </motion.div>

      {/* Save button */}
      <div className="fixed bottom-24 md:bottom-8 left-4 right-4 md:left-auto md:right-8 md:w-80 z-40">
        <Button onClick={handleSave} className="w-full h-12 bg-primary text-primary-foreground shadow-premium rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 active-scale">
          <Save className="w-4 h-4" />
          {t('settings_save')}
        </Button>
      </div>
    </motion.div>
  );
}
