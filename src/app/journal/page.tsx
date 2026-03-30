"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Calendar as CalIcon, StickyNote } from 'lucide-react';
import { useSensors } from '@/context/SensorContext';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface JournalEntry { id: string; date: string; content: string; }

const stagger = {
  container: { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } },
  item: { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } } },
} as const;

export default function FarmJournal() {
  const { t } = useSensors();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('agrisense_journal');
    if (saved) {
      try { setEntries(JSON.parse(saved)); } catch (e) { console.error("Failed to parse journal entries", e); }
    }
  }, []);

  const saveEntries = (updated: JournalEntry[]) => {
    setEntries(updated);
    localStorage.setItem('agrisense_journal', JSON.stringify(updated));
  };

  const handleAddEntry = () => {
    if (!newNote.trim()) return;
    const entry: JournalEntry = { id: Date.now().toString(), date: format(new Date(), 'PPP'), content: newNote };
    saveEntries([entry, ...entries]);
    setNewNote('');
  };

  const handleDelete = (id: string) => { saveEntries(entries.filter(e => e.id !== id)); };

  return (
    <motion.div className="space-y-6" variants={stagger.container} initial="hidden" animate="visible">
      {/* Header */}
      <motion.div variants={stagger.item} className="flex items-center gap-3 px-1">
        <div className="bg-destructive/10 border border-destructive/20 p-2.5 rounded-xl">
          <StickyNote className="w-5 h-5 text-destructive" />
        </div>
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-foreground">{t('journal_title')}</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">{t('journal_subtitle')}</p>
        </div>
      </motion.div>

      {/* New entry */}
      <motion.div variants={stagger.item}>
        <Card className="border border-border/50 bg-card/80 rounded-2xl">
          <CardContent className="p-4 space-y-4">
            <Textarea
              placeholder={t('journal_placeholder')}
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="min-h-[120px] rounded-xl bg-muted/30 border-border/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary/50 text-sm font-medium resize-none transition-colors"
            />
            <Button onClick={handleAddEntry} className="w-full h-11 rounded-xl bg-primary text-primary-foreground font-semibold gap-2 shadow-premium active-scale">
              <Plus className="w-4 h-4" />
              {t('journal_add_btn')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Entries */}
      <div className="space-y-3">
        {entries.map(entry => (
          <motion.div key={entry.id} variants={stagger.item} whileHover={{ y: -1, transition: { duration: 0.15 } }}>
            <Card className="border border-border/50 bg-card/80 rounded-xl group hover:border-primary/20 transition-colors">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary uppercase tracking-[0.15em] bg-primary/8 border border-primary/15 px-2 py-0.5 rounded-md">
                    <CalIcon className="w-3 h-3" />
                    {entry.date}
                  </div>
                  <button onClick={() => handleDelete(entry.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1.5 rounded-lg hover:bg-destructive/10 opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm font-medium text-foreground leading-relaxed pl-1 whitespace-pre-wrap">{entry.content}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        {entries.length === 0 && (
          <motion.div variants={stagger.item} className="text-center py-12 border border-dashed border-border/50 rounded-2xl bg-muted/10 flex flex-col items-center">
            <div className="bg-muted/30 border border-border/50 p-3 rounded-2xl mb-3">
              <StickyNote className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-display font-semibold tracking-tight text-foreground">{t('journal_no_entries')}</p>
            <p className="text-xs font-medium text-muted-foreground mt-1 max-w-[200px]">{t('journal_no_entries_desc')}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}