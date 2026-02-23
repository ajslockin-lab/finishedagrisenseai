"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Calendar as CalIcon, StickyNote } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import { format } from 'date-fns';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export default function FarmJournal() {
  const { t } = useSensors();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    // Only access localStorage on the client side after mounting
    const saved = localStorage.getItem('agrisense_journal');
    if (saved) {
      try {
        setEntries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse journal entries", e);
      }
    }
  }, []);

  const saveEntries = (updated: JournalEntry[]) => {
    setEntries(updated);
    localStorage.setItem('agrisense_journal', JSON.stringify(updated));
  };

  const handleAddEntry = () => {
    if (!newNote.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: format(new Date(), 'PPP'),
      content: newNote
    };
    saveEntries([entry, ...entries]);
    setNewNote('');
  };

  const handleDelete = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="px-2">
        <h2 className="text-2xl font-black text-primary flex items-center gap-2">
          <StickyNote className="w-6 h-6 text-accent" />
          {t('journal_title')}
        </h2>
        <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">{t('journal_subtitle')}</p>
      </div>

      <Card className="border-none shadow-xl bg-card/60 dark:bg-card/40 backdrop-blur-xl rounded-[2rem] border border-border/50">
        <CardContent className="p-6 space-y-4">
          <Textarea
            placeholder={t('journal_placeholder')}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[120px] rounded-2xl bg-muted/50 dark:bg-background/50 border-none focus-visible:ring-1 focus-visible:ring-primary text-sm font-medium resize-none"
          />
          <Button onClick={handleAddEntry} className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black gap-2 shadow-lg transition-all active:scale-[0.98]">
            <Plus className="w-5 h-5" />
            {t('journal_add_btn')}
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {entries.map(entry => (
          <Card key={entry.id} className="border-none shadow-sm bg-card/40 dark:bg-card/20 backdrop-blur-md rounded-[1.5rem] group border border-border/40 hover:border-primary/30 transition-all">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                  <CalIcon className="w-3 h-3" />
                  {entry.date}
                </div>
                <button onClick={() => handleDelete(entry.id)} className="text-muted-foreground/50 hover:text-destructive transition-colors p-2 rounded-full hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm font-medium text-foreground leading-relaxed pl-1">
                {entry.content}
              </p>
            </CardContent>
          </Card>
        ))}
        {entries.length === 0 && (
          <div className="text-center py-16 opacity-40 bg-muted/20 rounded-[2rem] border border-dashed border-border/50">
            <StickyNote className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t('journal_no_entries')}</p>
            <p className="text-[10px] font-bold text-muted-foreground mt-1">{t('journal_no_entries_desc')}</p>
          </div>
        )}
      </div>
    </div>
  );
}