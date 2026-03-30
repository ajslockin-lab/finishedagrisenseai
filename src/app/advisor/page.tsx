"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, RefreshCw, User, Bot, Sparkles, WifiOff, AlertTriangle, ArrowUp } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import { getPersonalizedRecommendations, askFarmingQuestion } from './actions';
import { getOfflineChatResponse, getOfflineRecommendations, isOffline } from '@/lib/offlineAI';
import type { GeneratePersonalizedRecommendationsOutput } from '@/ai/flows/generate-personalized-recommendations';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const languageNames: Record<string, string> = {
  en: 'English', hi: 'Hindi', pb: 'Punjabi', ta: 'Tamil',
  te: 'Telugu', mr: 'Marathi', kn: 'Kannada', bn: 'Bengali', gu: 'Gujarati',
};

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } },
} as const;

const priorityConfig = {
  High: { color: 'text-destructive', bg: 'bg-destructive/10 border-destructive/25', dot: 'bg-destructive' },
  Medium: { color: 'text-primary', bg: 'bg-primary/10 border-primary/25', dot: 'bg-primary' },
  Low: { color: 'text-sage', bg: 'bg-sage/10 border-sage/25', dot: 'bg-sage' },
};

export default function AIAdvisor() {
  const { sensors, settings, t } = useSensors();
  const [recommendations, setRecommendations] = useState<GeneratePersonalizedRecommendationsOutput>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [offline, setOffline] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'Hello! I am your AgriSense advisor. How can I help you with your farm today?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const getSafeIcon = (icon: string) => {
    const safeIcons = ['🌾', '🚜', '🌱', '💧', '☀️', '📈', '🛡️', '⚡', '🧪', '💡', '🌡️', '🚿'];
    const match = safeIcons.find(safe => icon?.trim().startsWith(safe));
    return match ?? '💡';
  };

  useEffect(() => {
    setMounted(true);
    setOffline(isOffline());
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    handleRefreshRecs();
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefreshRecs = async () => {
    setLoadingRecs(true);
    try {
      if (isOffline()) {
        const result = getOfflineRecommendations(
          sensors.soilMoisture, sensors.soilTemperature, sensors.soilPh, sensors.nutrientLevel, settings.cropType
        );
        setRecommendations(result);
        setOffline(true);
      } else {
        const result = await getPersonalizedRecommendations({
          soilMoisture: sensors.soilMoisture,
          soilTemperature: sensors.soilTemperature,
          soilPh: sensors.soilPh,
          nutrientLevel: sensors.nutrientLevel,
          weatherForecast: 'Mostly sunny for the next 3 days.',
          cropType: settings.cropType,
          location: settings.location,
          language: languageNames[settings.language],
        });
        setRecommendations(result);
      }
    } catch (error) {
      const result = getOfflineRecommendations(
        sensors.soilMoisture, sensors.soilTemperature, sensors.soilPh, sensors.nutrientLevel, settings.cropType
      );
      setRecommendations(result);
      setOffline(true);
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    const userMsg = inputValue.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    try {
      if (isOffline()) {
        await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
        const answer = getOfflineChatResponse(userMsg);
        setChatMessages(prev => [...prev, { role: 'bot', text: answer }]);
      } else {
        const response = await askFarmingQuestion({
          question: userMsg,
          language: languageNames[settings.language]
        });
        setChatMessages(prev => [...prev, { role: 'bot', text: response.answer }]);
      }
    } catch (error) {
      await new Promise(r => setTimeout(r, 600));
      const answer = getOfflineChatResponse(userMsg);
      setChatMessages(prev => [...prev, { role: 'bot', text: answer }]);
      setOffline(true);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  if (!mounted) return null;

  // Sort by priority: High first
  const sortedRecs = [...recommendations].sort((a, b) => {
    const order: Record<string, number> = { High: 0, Medium: 1, Low: 2 };
    return (order[a.priority] ?? 9) - (order[b.priority] ?? 9);
  });

  return (
    <motion.div
      className="space-y-6"
      variants={stagger.container}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={stagger.item} className="flex items-center gap-3 px-1">
        <div className="bg-primary/10 border border-primary/20 p-2.5 rounded-xl">
          <Sparkles className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">{t('advisor_title')}</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
            {languageNames[settings.language]} · {offline ? 'Demo Mode' : 'Live AI'}
          </p>
        </div>
        <Button
          onClick={handleRefreshRecs}
          variant="ghost" size="sm"
          className="h-9 gap-2 rounded-lg text-primary hover:bg-primary/10 transition-colors"
          disabled={loadingRecs}
        >
          <RefreshCw className={cn("w-4 h-4", loadingRecs && "animate-spin")} />
          {t('common_refresh')}
        </Button>
      </motion.div>

      {/* Offline banner */}
      {offline && (
        <motion.div variants={stagger.item} className="flex items-center gap-2.5 bg-muted/50 border border-border/50 px-4 py-3 rounded-xl">
          <WifiOff className="w-4 h-4 text-muted-foreground shrink-0" />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
            Offline — smart demo AI active
          </p>
        </motion.div>
      )}

      {/* ═══ AI Recommendations Feed ═══ */}
      <motion.section variants={stagger.item} className="space-y-3">
        {loadingRecs ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-card/80 border border-border/50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="skeleton w-10 h-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-4 w-2/3" />
                    <div className="skeleton h-3 w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : sortedRecs.length > 0 ? (
          sortedRecs.map((rec, i) => {
            const prio = priorityConfig[rec.priority as keyof typeof priorityConfig] || priorityConfig.Low;
            return (
              <motion.div
                key={i}
                variants={stagger.item}
                whileHover={{ y: -1, transition: { duration: 0.15 } }}
              >
                <Card className="border border-border/50 bg-card/80 rounded-xl group hover:border-primary/20 transition-all">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0 grayscale group-hover:grayscale-0 transition-all mt-0.5">
                      {getSafeIcon(rec.icon)}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-sm text-foreground tracking-tight truncate">{rec.title}</h3>
                        <Badge variant="outline" className={cn("text-[9px] font-bold uppercase tracking-wider px-2 py-0 rounded-md shrink-0 border", prio.bg, prio.color)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full mr-1.5", prio.dot)} />
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed font-medium">{rec.action}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })
        ) : (
          <div className="text-center py-10 border border-dashed border-border/50 rounded-xl bg-muted/10">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            </div>
            <p className="text-sm font-display font-semibold text-foreground">{t('common_loading')}</p>
            <p className="text-xs text-muted-foreground mt-1">Generating personalized recommendations...</p>
          </div>
        )}
      </motion.section>

      {/* ═══ Chat — Forest/Gold Aesthetic ═══ */}
      <motion.section variants={stagger.item} className="space-y-3">
        <div className="px-1">
          <h3 className="font-display text-lg font-bold text-foreground tracking-tight">{t('advisor_chat_title')}</h3>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em] mt-0.5">
            {offline ? 'Smart demo mode active' : `Speaking in ${languageNames[settings.language]}`}
          </p>
        </div>

        <Card className="border border-border/50 bg-card/80 overflow-hidden flex flex-col h-[480px] rounded-2xl shadow-premium">
          <ScrollArea className="flex-1 p-5" ref={scrollRef}>
            <div className="space-y-4">
              {chatMessages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}
                  initial={i > 0 ? { opacity: 0, y: 8 } : undefined}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border",
                    msg.role === 'user' ? "bg-primary/15 text-primary border-primary/20" : "bg-muted/50 text-sage border-border/50"
                  )}>
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>
                  <div className={cn(
                    "p-3.5 rounded-2xl text-sm max-w-[80%] leading-relaxed font-medium",
                    msg.role === 'user'
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted/40 text-foreground rounded-tl-sm border border-border/50"
                  )}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-sage" />
                  </div>
                  <div className="bg-muted/40 border border-border/50 p-3.5 rounded-2xl rounded-tl-sm text-xs flex gap-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-3 bg-background/60 border-t border-border/50 flex gap-2">
            <Input
              placeholder={offline ? "Ask about irrigation, pests, diseases..." : `${t('advisor_ask_placeholder')} ${languageNames[settings.language]}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 border border-border/50 bg-muted/30 focus-visible:border-primary/50 focus-visible:ring-0 rounded-xl h-12 px-4 text-sm font-medium transition-colors"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              className="bg-primary hover:bg-primary/90 rounded-xl h-12 w-12 shrink-0 shadow-sm transition-colors"
            >
              <ArrowUp className="w-5 h-5" />
            </Button>
          </div>
        </Card>
      </motion.section>
    </motion.div>
  );
}
