import React from 'react';
import { motion } from 'framer-motion';

const skills = [
  "React", "Next.js", "TypeScript", "Node.js", "WebGL", "Three.js", "Rust", "Solidity", "GraphQL", "AWS"
];

const TechTicker: React.FC = () => {
  return (
    <div className="relative flex w-full overflow-hidden py-2 items-center h-full bg-transparent">
      {/* Fade edges - Updated to match glass transparency */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white/20 to-transparent z-20" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white/20 to-transparent z-20" />
      
      <motion.div
        className="flex gap-12 whitespace-nowrap items-center will-change-transform"
        animate={{ x: "-50%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
      >
        {[...skills, ...skills, ...skills, ...skills].map((skill, i) => (
          <div key={i} className="group flex items-center gap-4 cursor-default">
            <span className="text-5xl md:text-6xl font-black uppercase tracking-tighter text-stroke hover:text-neutral-900 dark:hover:text-white transition-all duration-300 select-none opacity-30 hover:opacity-100">
              {skill}
            </span>
            {/* Dot separator */}
            <span className="h-2 w-2 rounded-full bg-neutral-300 dark:bg-neutral-600 group-hover:bg-cyan-500 transition-colors" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default TechTicker;