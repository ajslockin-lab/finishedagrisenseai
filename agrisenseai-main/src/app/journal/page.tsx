"use client";

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { BookOpen, Calendar, Trash2, Plus, PenLine } from 'lucide-react';

interface JournalEntry {
  id: string;
  date: string;
  content: string;
}

export default function FarmJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [newNote, setNewNote] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('agrisense_journal');
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  const saveEntries = (updated: JournalEntry[]) => {
    setEntries(updated);
    localStorage.setItem('agrisense_journal', JSON.stringify(updated));
  };

  const handleAddEntry = () => {
    if (!newNote.trim()) return;
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: format(new Date(), 'MMMM d, yyyy'),
      content: newNote.trim()
    };
    saveEntries([entry, ...entries]);
    setNewNote('');
  };

  const handleDelete = (id: string) => {
    saveEntries(entries.filter(e => e.id !== id));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen w-full flex flex-col pt-6 pb-[100px] px-4 gap-6 bg-background">
      
      <header className="px-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Journal
        </h1>
        <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
          <BookOpen className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold uppercase tracking-wider">Field Observations</span>
        </div>
      </header>

      {/* Input Section - Tactile Card */}
      <div className="glass rounded-[2rem] p-5 border border-white/5 bg-surface relative shadow-xl overflow-hidden focus-within:ring-2 focus-within:ring-accent/50 transition-all">
        <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-[40px] pointer-events-none" />
        
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Record a thought from the fields..."
          className="w-full bg-transparent border-none focus:ring-0 text-[17px] font-medium text-foreground placeholder:text-muted-foreground/40 min-h-[120px] resize-none outline-none leading-relaxed relative z-10"
        />
        
        <div className="flex justify-between items-center mt-4 border-t border-white/5 pt-4 relative z-10">
           <div className="flex items-center gap-1.5 text-muted-foreground/70">
             <Calendar className="w-3.5 h-3.5" />
             <span className="text-[10px] font-bold uppercase tracking-wider">
               {format(new Date(), 'MMM d, yyyy')}
             </span>
           </div>
           <button 
             onClick={handleAddEntry}
             disabled={!newNote.trim()}
             className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-accent text-background text-xs font-bold uppercase tracking-wider hover:bg-accent/90 focus:scale-95 transition-all disabled:opacity-50 disabled:bg-surface disabled:text-muted-foreground disabled:border disabled:border-white/10"
           >
             <Plus className="w-3.5 h-3.5" />
             Save
           </button>
        </div>
      </div>

      {/* Entries List - Structured Cards */}
      <div className="space-y-4">
        {entries.map((entry, index) => (
          <article key={entry.id} className="glass rounded-[1.5rem] p-5 border border-white/5 bg-surface/50 group hover:bg-surface transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-accent/80 flex items-center gap-1.5">
                <PenLine className="w-3 h-3" />
                Entry N° {entries.length - index}
              </span>
              <button 
                onClick={() => handleDelete(entry.id)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground/40 hover:bg-danger/10 hover:text-danger focus:scale-95 transition-all"
                aria-label="Delete entry"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-muted-foreground tracking-wider uppercase">
                {entry.date}
              </h3>
              <p className="text-[16px] font-medium text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {entry.content}
              </p>
            </div>
          </article>
        ))}

        {entries.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center opacity-40">
            <BookOpen className="w-12 h-12 mb-4 text-muted-foreground" />
            <p className="text-lg font-bold text-muted-foreground">The pages are waiting...</p>
          </div>
        )}
      </div>

    </div>
  );
}