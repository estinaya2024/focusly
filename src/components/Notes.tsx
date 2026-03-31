import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Sparkles } from 'lucide-react';
import bunnyImg from '../assets/bunny_music.png';

interface Note {
  id: string;
  title: string;
  text: string;
  colorIdx: number;
  date: string;
}

const WashiColors = [
  'bg-hud-accent',
  'bg-emerald-500',
  'bg-blue-500',
  'bg-pink-500',
];

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('focus-journal');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Sanctuary Entry', text: 'The forest air feels different today. Deep focus initialized. 🌿', colorIdx: 0, date: 'Mar 31' },
      { id: '2', title: 'Musical Synthesis', text: 'Blending white noise with rain creates a perfect isolation chamber...', colorIdx: 1, date: 'Mar 30' }
    ];
  });

  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [isExpanding, setIsExpanding] = useState(false);

  useEffect(() => {
    localStorage.setItem('focus-journal', JSON.stringify(notes));
  }, [notes]);

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: title.trim() || 'New Reflection',
        text: text.trim(),
        colorIdx: Math.floor(Math.random() * WashiColors.length),
        date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
      };
      setNotes([newNote, ...notes]);
      setTitle('');
      setText('');
      setIsExpanding(false);
    }
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  return (
    <div className="hud-panel flex flex-col p-8 gap-8 h-full border-white/10">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-xl">
            <BookOpen size={18} className="text-hud-accent" />
          </div>
          <div>
            <h3 className="hud-mono !text-[10px] !text-hud-text tracking-widest">Neural Journal</h3>
            <p className="hud-mono !text-[7px]">Capture Neural Patterns</p>
          </div>
        </div>

        {/* Mascot */}
        <div className="w-16 h-16 relative character-companion">
          <img
            src={bunnyImg}
            alt="Mascot"
            className="w-full h-full object-contain filter drop-shadow-xl"
          />
        </div>
      </div>

      {/* Input Section */}
      <form onSubmit={addNote} className="flex flex-col gap-4">
        <div className={`flex flex-col gap-3 p-4 bg-white/5 border transition-all rounded-2xl ${isExpanding ? 'border-hud-accent/40 bg-white/10' : 'border-white/5 hover:bg-white/10'}`}>
          <div className="flex items-center gap-3">
            <Sparkles size={14} className={isExpanding ? 'text-hud-accent' : 'text-white/10'} />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanding(true)}
              placeholder="Entry Title..."
              className="w-full bg-transparent border-none text-[12px] font-bold text-white placeholder:text-white/20 outline-none"
            />
          </div>

          <AnimatePresence>
            {isExpanding && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden flex flex-col gap-4"
              >
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Initiate pattern log..."
                  className="w-full bg-transparent border-none text-sm text-white/70 placeholder:text-white/20 outline-none min-h-[100px] resize-none pt-2 border-t border-white/5"
                  autoFocus
                />
                <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsExpanding(false)}
                    className="hud-mono !text-[8px] hover:text-white transition-all px-4"
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="hud-btn hud-btn-primary !px-6 !py-2 !text-[10px]"
                  >
                    Log Entry
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>

      {/* Journal Entries */}
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-3">
        <AnimatePresence mode="popLayout">
          {notes.map((note) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={note.id}
              className="group relative p-5 rounded-2xl border border-white/5 transition-all hover:bg-white/[0.05] bg-white/[0.02]"
            >
              <div className={`absolute top-0 left-4 w-8 h-[2px] ${WashiColors[note.colorIdx]}`} />
              
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[11px] font-bold text-white tracking-tight">{note.title}</h4>
                <span className="hud-mono !text-[7px]">{note.date}</span>
              </div>

              <p className="text-[13px] text-white/60 leading-relaxed font-medium line-clamp-3">
                {note.text}
              </p>

              <button
                onClick={() => deleteNote(note.id)}
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-500/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 shadow-lg"
              >
                <X size={12} strokeWidth={3} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notes;
