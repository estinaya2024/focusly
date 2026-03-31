import React from 'react';
import { motion } from 'framer-motion';
import penguinImg from '../assets/penguin.png';
import bunnyImg from '../assets/bunny_music.png';
import foxImg from '../assets/fox.png';
import rabbitImg from '../assets/rabbit.png';

const AmbientBackground: React.FC = () => {
  const characters = [
    { src: penguinImg, x: '8%', y: '15%', delay: 0 },
    { src: bunnyImg, x: '88%', y: '12%', delay: 0.2 },
    { src: foxImg, x: '12%', y: '78%', delay: 0.4 },
    { src: rabbitImg, x: '85%', y: '82%', delay: 0.6 },
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
      {/* Static Paper-Studio Gradients */}
      <div className="absolute inset-0 bg-[#FAF9F6]">
        {/* Soft Pink Corner */}
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] bg-gradient-radial from-[#FFDDE6]/20 to-transparent blur-[100px]" />

        {/* Soft Blue Corner */}
        <div className="absolute -bottom-[10%] -right-[10%] w-[60%] h-[60%] bg-gradient-radial from-[#D4F0F0]/20 to-transparent blur-[100px]" />

        {/* Central Warmth */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/10" />
      </div>

      {/* Static Decorative Mascots */}
      {characters.map((char, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.15, scale: 1 }}
          transition={{ duration: 2, delay: char.delay }}
          style={{ left: char.x, top: char.y }}
          className="absolute w-32 h-32 md:w-52 md:h-52 filter grayscale opacity-20 transition-all duration-1000"
        >
          <img
            src={char.src}
            alt="Mascot"
            className="w-full h-full object-contain"
          />
        </motion.div>
      ))}

      {/* Subtle Pinstripe Texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/pinstripe-light.png")` }} />
    </div>
  );
};

export default AmbientBackground;
