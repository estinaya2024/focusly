import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';
import bearImg from '../assets/white-bear.png';

type Mode = 'focus' | 'recovery';

const MODES: Record<Mode, { label: string; time: number; icon: React.ReactNode; accent: string }> = {
  focus: { label: '52m Focus', time: 52 * 60, icon: <Zap size={14} />, accent: 'bg-hud-accent' },
  recovery: { label: '17m Recovery', time: 17 * 60, icon: <Coffee size={14} />, accent: 'bg-emerald-500' },
};

const Timer: React.FC = () => {
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.time);
  const [isActive, setIsActive] = useState(false);

  const switchMode = useCallback((newMode: Mode) => {
    setMode(newMode);
    setTimeLeft(MODES[newMode].time);
    setIsActive(false);
  }, []);

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
      audio.volume = 0.5;
      audio.play().catch(e => console.log('Alarm blocked:', e));
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-12 relative px-4">
      
      {/* HUD Header: Mode Selection */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center gap-2 md:gap-4 px-2 py-2 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-md z-20"
      >
        {(Object.keys(MODES) as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => switchMode(m)}
            className={`px-4 md:px-6 py-2.5 rounded-xl transition-all duration-500 flex items-center gap-3 ${mode === m 
              ? `${MODES[m].accent} text-black font-bold shadow-lg` 
              : 'text-white/40 hover:text-white hover:bg-white/5'}`}
          >
            {MODES[m].icon}
            <span className="hud-mono !text-[8.5px] !text-black tracking-widest">{MODES[m].label}</span>
          </button>
        ))}
      </motion.div>

      {/* THE MASSIVE CLOCK */}
      <div className="relative flex flex-col items-center">
        <motion.div 
          key={timeLeft}
          initial={{ opacity: 0.8, scale: 0.98 }}
          animate={{ 
            opacity: 1, 
            scale: (timeLeft < 60 && isActive) ? [1, 1.05, 1] : 1 
          }}
          transition={{ duration: (timeLeft < 60 && isActive) ? 1 : 0.2, repeat: (timeLeft < 60 && isActive) ? Infinity : 0 }}
          className={`hud-display text-[15vw] leading-none drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] select-none tabular-nums ${timeLeft < 60 && isActive ? 'text-red-500/80' : 'text-black'}`}
        >
          {formatTime(timeLeft)}
        </motion.div>

        {/* Companion Perch: Floating Bear */}
        <div className="absolute -top-80 -right-16 md:-right-48 w-[320px] h-[320px] character-companion flex flex-col items-center justify-center">
          <AnimatePresence>
            {mode !== 'focus' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5, y: 10 }}
                animate={{ opacity: 0.6, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute -top-12 right-24 hud-mono !text-xl lowercase italic tracking-tighter text-black/40 pointer-events-none"
              >
                zZz...
              </motion.div>
            )}
          </AnimatePresence>
          <motion.img 
            key={isActive ? 'active' : 'idle'}
            initial={{ scale: isActive ? 1.1 : 1 }}
            animate={{ scale: 1 }}
            src={bearImg} 
            alt="Bear Companion" 
            className={`w-full h-full object-contain transition-all duration-1000 ${mode === 'focus' ? 'brightness-100' : 'brightness-50 grayscale-50 opacity-60'}`}
          />
        </div>
      </div>

      {/* Main Controls */}
      <div className="flex items-center gap-6 z-20">
        <button
          onClick={() => setIsActive(!isActive)}
          className="hud-btn hud-btn-primary h-16 w-48 shadow-2xl transition-all hover:scale-105 active:scale-95 text-white"
        >
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em]">
            {isActive ? <Pause fill="white" size={20} /> : <Play fill="white" size={20} />}
            {isActive ? 'Pause' : 'Start'}
          </div>
        </button>

        <button
          onClick={() => { setIsActive(false); setTimeLeft(MODES[mode].time); }}
          className="hud-btn hud-btn-secondary h-16 w-16 group"
        >
          <RotateCcw size={20} className="group-hover:rotate-180 transition-transform duration-700" />
        </button>
      </div>

    </div>
  );
};

export default Timer;
