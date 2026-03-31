import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, VolumeX, Calendar } from 'lucide-react';
import Timer from './components/Timer';
import TodoList from './components/TodoList';
import SoundMixer from './components/SoundMixer';
import logoImg from './assets/penguin.png';

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [globalVolume, setGlobalVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);

  // Update Clock & Date
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateString = useMemo(() => {
    return currentTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [currentTime]);

  // Load YouTube Iframe API Global Script
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }
  }, []);

  return (
    <div className="min-h-screen relative flex flex-col items-center font-geist text-hud-text overflow-hidden">

      {/* HUD Immersion Layers */}
      <div className="hud-grain" />
      <div className="hud-scanlines" />

      {/* Background Layer (Static) */}
      <div
        className="fixed inset-0 z-[-1]"
        style={{
          backgroundImage: "url('./src/assets/background1.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* HUD Progress Arc (Top Line) */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        className="fixed top-0 left-0 h-[1.5px] bg-black/30 z-[200] origin-left shadow-[0_0_10px_rgba(0,0,0,0.1)]"
      />

      {/* Persistent HUD Layers */}
      <div className="fixed inset-0 flex flex-col z-10 p-8 pointer-events-none">

        {/* Top Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full flex justify-between items-center pointer-events-auto"
        >
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-0">
              <div className="w-[120px] h-auto -mr-2">
                <img src={logoImg} alt="Focusly Logo" className="w-full h-full object-contain" />
              </div>
              <h1 className="hud-display text-5xl tracking-tighter">Focusly</h1>
            </div>

            {/* Global Ambiance Control */}
            <div className="flex items-center gap-4 bg-black/10 px-6 py-2.5 rounded-full border border-white/5 backdrop-blur-md">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="hover:scale-110 transition-transform"
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <div className="w-24">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : globalVolume}
                  onChange={(e) => {
                    setGlobalVolume(parseInt(e.target.value));
                    setIsMuted(false);
                  }}
                  className="hud-slider w-full"
                />
              </div>
              <span className="hud-mono !text-[10px] w-8 tabular-nums">{isMuted ? 0 : globalVolume}%</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 hud-mono text-[10px] bg-black/10 px-5 py-2.5 rounded-full border border-black/5 backdrop-blur-md">
              <Calendar size={12} className="opacity-60" />
              <span>{dateString}</span>
              <span className="opacity-20 mx-1">|</span>
              <span className="text-black font-bold">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
              </span>
            </div>
            <div className="hud-mono text-[10px] bg-black/20 px-5 py-2.5 rounded-full border border-white/5 backdrop-blur-md">
              "The forest is quiet for those who listen"
            </div>
          </div>
        </motion.header>

        {/* Main Side Panels */}
        <div className="flex-1 flex justify-between items-center w-full mt-12 mb-12">

          {/* Left Panel: Ambiance */}
          <motion.div
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-80 h-[580px] pointer-events-auto"
          >
            <SoundMixer masterVolume={isMuted ? 0 : globalVolume} />
          </motion.div>

          {/* Right Panel: Tasks */}
          <motion.div
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="w-80 h-[580px] pointer-events-auto"
          >
            <TodoList />
          </motion.div>
        </div>

        {/* Bottom Footer Info */}
        <motion.footer
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="w-full flex justify-center pointer-events-auto"
        >
          <div className="hud-mono text-[8px] bg-black/20 px-6 py-2 rounded-full border border-white/5 backdrop-blur-md opacity-60">
            Engineered for Deep Work • Focusly Sanctuary 2024
          </div>
        </motion.footer>
      </div>

      {/* Central Focus Zone */}
      <main className="fixed inset-0 flex flex-col items-center justify-center z-0">
        <Timer />
      </main>
    </div>
  );
}

export default App;
