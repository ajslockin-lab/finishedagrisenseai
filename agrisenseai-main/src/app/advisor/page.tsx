"use client";

import { useState, useRef, useEffect } from 'react';
import { useSensors } from '@/context/SensorContext';
import { getPersonalizedRecommendations, askFarmingQuestion } from './actions';
import type { GeneratePersonalizedRecommendationsOutput } from '@/ai/flows/generate-personalized-recommendations';
import { cn } from '@/lib/utils';
import { Send, RefreshCw, AlertTriangle, Lightbulb, MessageSquare } from 'lucide-react';

const languageNames: Record<string, string> = {
  en: 'English',
  hi: 'Hindi',
  pb: 'Punjabi',
  ta: 'Tamil',
  te: 'Telugu',
  mr: 'Marathi',
  kn: 'Kannada',
  bn: 'Bengali',
  gu: 'Gujarati',
};

export default function AIAdvisor() {
  const { sensors, settings } = useSensors();
  const [recommendations, setRecommendations] = useState<GeneratePersonalizedRecommendationsOutput>([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([
    { role: 'bot', text: 'How can I assist you with your farm today? Speak freely in your native language.' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    handleRefreshRecs();
  }, []);

  const handleRefreshRecs = async () => {
    setLoadingRecs(true);
    try {
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
    } catch (error) {
      console.error('Error:', error);
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
      const response = await askFarmingQuestion({
        question: userMsg,
        language: languageNames[settings.language]
      });
      setChatMessages(prev => [...prev, { role: 'bot', text: response.answer }]);
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages(prev => [...prev, {
        role: 'bot',
        text: "I'm having a little trouble connecting. Please try again."
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex flex-col pt-6 pb-[80px] bg-background">
      <header className="px-6 flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Advisor
          </h1>
          <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold uppercase tracking-wider">AI Intelligence ({languageNames[settings.language]})</span>
          </div>
        </div>
        <button 
          onClick={handleRefreshRecs} 
          disabled={loadingRecs}
          className="w-8 h-8 rounded-full bg-surface border border-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground active:scale-95 transition-all"
        >
          <RefreshCw className={cn("w-4 h-4", loadingRecs && "animate-spin text-accent")} />
        </button>
      </header>

      {/* Structured Recommendations List */}
      <section className="px-4 space-y-3 shrink-0">
         {loadingRecs ? (
            <div className="glass h-24 rounded-[1.5rem] flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-muted-foreground animate-spin" />
            </div>
         ) : recommendations.length > 0 ? (
           <div className="flex gap-3 overflow-x-auto pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
             {recommendations.map((rec, i) => (
               <div 
                 key={i} 
                 className="min-w-[85%] sm:min-w-[280px] glass p-5 rounded-[1.5rem] flex flex-col gap-2 relative overflow-hidden shrink-0"
               >
                 <div className="flex items-center gap-2 mb-1">
                   {rec.priority === 'High' ? (
                     <AlertTriangle className="w-4 h-4 text-danger" />
                   ) : (
                     <Lightbulb className="w-4 h-4 text-accent" />
                   )}
                   <span className={cn(
                     "text-[10px] font-bold uppercase tracking-wider",
                     rec.priority === 'High' ? "text-danger" : "text-accent"
                   )}>
                     {rec.priority} Priority
                   </span>
                 </div>
                 <p className="text-lg font-bold text-foreground leading-tight tracking-tight">
                   {rec.title}
                 </p>
                 <p className="text-sm font-medium text-foreground/80 leading-relaxed">
                   {rec.action}
                 </p>
               </div>
             ))}
           </div>
         ) : null}
      </section>

      {/* Chat Interface */}
      <section className="flex-1 flex flex-col mt-2 px-4 relative overflow-hidden">
        
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-6 pb-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] pt-4 px-2"
        >
          {chatMessages.map((msg, i) => (
            <div key={i} className={cn(
              "flex flex-col max-w-[85%]", 
              msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
            )}>
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-1.5 px-2">
                {msg.role === 'user' ? "You" : "AgriSense AI"}
              </span>
              <div className={cn(
                "px-5 py-3.5 text-[15px] font-medium leading-relaxed rounded-2xl relative",
                msg.role === 'user'
                  ? "bg-accent text-background rounded-tr-sm"
                  : "bg-surface border border-white/5 text-foreground/90 rounded-tl-sm glass"
              )}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex flex-col max-w-[85%] mr-auto items-start">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/50 mb-1.5 px-2">
                AgriSense AI
              </span>
              <div className="px-5 py-4 bg-surface border border-white/5 rounded-2xl rounded-tl-sm glass flex gap-1.5 items-center justify-center">
                 <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0ms' }} />
                 <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '150ms' }} />
                 <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/90 to-transparent pt-12 pb-[10px]">
          <div className="relative glass rounded-full flex items-center p-1.5">
            <input
              type="text"
              placeholder={`Ask a question...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="w-full bg-transparent outline-none h-[44px] px-4 text-[15px] font-medium text-foreground placeholder:text-muted-foreground/50"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isTyping || !inputValue.trim()}
              className="w-11 h-11 shrink-0 rounded-full bg-accent flex items-center justify-center text-background disabled:opacity-50 disabled:bg-surface disabled:text-muted-foreground transition-colors"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
