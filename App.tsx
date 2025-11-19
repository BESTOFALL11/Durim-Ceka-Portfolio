import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, Github, Linkedin, Twitter, Globe, Cpu, Layers, Zap, Command, Terminal, Moon, Sun, Search, User, Mail } from 'lucide-react';

import CustomCursor from './components/CustomCursor';
import BentoItem from './components/BentoItem';

// Lazy Loading Heavy/Non-Critical Components
const TechTicker = lazy(() => import('./components/TechTicker'));
const Contact = lazy(() => import('./components/Contact'));
const MusicPlayer = lazy(() => import('./components/MusicPlayer'));
const GravityPad = lazy(() => import('./components/GravityPad'));

const ComponentLoader = () => (
  <div className="w-full h-full flex items-center justify-center bg-neutral-100/20 dark:bg-neutral-800/20">
     <div className="w-6 h-6 border-2 border-neutral-300 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const App: React.FC = () => {
  const titleWords = "Creative Technologist".split(" ");
  const [mounted, setMounted] = useState(false);
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  // Parallax Logic
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        // Center the coordinate system
        const { innerWidth, innerHeight } = window;
        mouseX.set(e.clientX - innerWidth / 2);
        mouseY.set(e.clientY - innerHeight / 2);
    };
    
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const springConfig = { damping: 50, stiffness: 400, mass: 0.5 }; 
  const xSpring = useSpring(mouseX, springConfig);
  const ySpring = useSpring(mouseY, springConfig);

  // Different movement factors for depth effect to prevent "flatness"
  const blob1X = useTransform(xSpring, (x) => x * 0.05);
  const blob1Y = useTransform(ySpring, (y) => y * 0.05);

  const blob2X = useTransform(xSpring, (x) => x * -0.06); // Moves opposite
  const blob2Y = useTransform(ySpring, (y) => y * -0.06);

  const blob3X = useTransform(xSpring, (x) => x * 0.04);
  const blob3Y = useTransform(ySpring, (y) => y * 0.04);

  const blob4X = useTransform(xSpring, (x) => x * -0.03);
  const blob4Y = useTransform(ySpring, (y) => y * 0.08); // More vertical movement

  // Theme Initialization Logic
  useEffect(() => {
    setMounted(true);
    
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCmdOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsCmdOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -20; // offset for padding
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen w-full bg-[#F5F5F7] dark:bg-[#050505] p-4 md:p-8 lg:p-10 pb-20 flex justify-center overflow-x-hidden relative transition-colors duration-700`}>
      <CustomCursor />
      
      {/* Ambient Background Lighting - Enhanced for Liquid Glass Refraction */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
         {/* Blob 1: Secondary/Violet - Top Left */}
         <motion.div style={{ x: blob1X, y: blob1Y }} className="absolute top-[-10%] left-[-10%] w-[70vw] h-[70vw]">
            <div className="w-full h-full bg-violet-200/30 dark:bg-violet-900/20 rounded-full blur-[120px] animate-blob mix-blend-multiply dark:mix-blend-screen transform-gpu will-change-transform" />
         </motion.div>
         
         {/* Blob 2: Cyan - Top Right */}
         <motion.div style={{ x: blob2X, y: blob2Y }} className="absolute top-[-20%] right-[-20%] w-[60vw] h-[60vw]">
            <div className="w-full h-full bg-cyan-200/30 dark:bg-cyan-900/20 rounded-full blur-[100px] animate-blob-reverse mix-blend-multiply dark:mix-blend-screen transform-gpu will-change-transform" style={{ animationDelay: '2s' }} />
         </motion.div>
         
         {/* Blob 3: Magenta - Bottom Left */}
         <motion.div style={{ x: blob3X, y: blob3Y }} className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw]">
            <div className="w-full h-full bg-fuchsia-200/30 dark:bg-fuchsia-900/20 rounded-full blur-[120px] animate-blob-slow mix-blend-multiply dark:mix-blend-screen transform-gpu will-change-transform" style={{ animationDelay: '4s' }} />
         </motion.div>

         {/* Blob 4: Extra Violet/Blue Mix - Bottom Right (New) */}
         <motion.div style={{ x: blob4X, y: blob4Y }} className="absolute bottom-[-30%] right-[-10%] w-[50vw] h-[50vw]">
            <div className="w-full h-full bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-[130px] animate-blob mix-blend-multiply dark:mix-blend-screen transform-gpu will-change-transform" style={{ animationDelay: '6s', animationDuration: '18s' }} />
         </motion.div>
      </div>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isCmdOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-900/20 dark:bg-neutral-950/50 backdrop-blur-sm"
              onClick={() => setIsCmdOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800"
            >
                <div className="flex items-center gap-3 p-4 border-b border-neutral-100 dark:border-neutral-800">
                    <Search className="w-5 h-5 text-neutral-400" />
                    <input 
                        type="text" 
                        placeholder="Type a command or search..." 
                        className="w-full bg-transparent outline-none text-lg text-neutral-900 dark:text-white placeholder:text-neutral-400"
                        autoFocus
                    />
                    <div className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs font-mono text-neutral-500">ESC</div>
                </div>
                <div className="p-2">
                    <div className="px-3 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">Actions</div>
                    
                    {[
                        { icon: Layers, label: 'View Projects', action: () => scrollToSection('work') },
                        { icon: User, label: 'About Me', action: () => scrollToSection('about') },
                        { icon: Mail, label: 'Contact', action: () => scrollToSection('contact') },
                    ].map((item, i) => (
                         <button 
                            key={i}
                            onClick={() => { item.action(); setIsCmdOpen(false); }} 
                            className="w-full relative overflow-hidden group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
                        >
                             <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-neutral-200/50 dark:via-white/5 to-transparent pointer-events-none" />
                            <item.icon className="w-4 h-4 text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white relative z-10" />
                            <span className="text-neutral-700 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white font-medium relative z-10">{item.label}</span>
                        </button>
                    ))}
                   
                    <div className="my-2 border-t border-neutral-100 dark:border-neutral-800" />
                    
                    <button 
                        onClick={() => { toggleTheme(); setIsCmdOpen(false); }} 
                        className="w-full relative overflow-hidden group flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-left"
                    >
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-neutral-200/50 dark:via-white/5 to-transparent pointer-events-none" />
                        <div className="relative z-10">
                            {isDark ? <Sun className="w-4 h-4 text-neutral-500" /> : <Moon className="w-4 h-4 text-neutral-500" />}
                        </div>
                        <span className="text-neutral-700 dark:text-neutral-200 group-hover:text-neutral-900 dark:group-hover:text-white font-medium relative z-10">Toggle Theme</span>
                    </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 
        GRID SYSTEM
      */}
      <div className="relative z-10 w-full max-w-[1800px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[320px]">
        
        {/* -- ROW 1 -- */}
        
        {/* 1. HERO */}
        <BentoItem colSpan="col-span-1 md:col-span-2 lg:col-span-2" rowSpan="row-span-2" index={0}>
          <div className="flex flex-col justify-between h-full relative">
            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-white/30 dark:to-black/30 z-0 pointer-events-none" />
            <div className="space-y-8 relative z-10 mt-4">
              <div 
                onClick={() => scrollToSection('contact')}
                className="relative group overflow-hidden inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/40 dark:bg-neutral-900/40 border border-white/30 dark:border-white/10 shadow-sm cursor-pointer hover:scale-105 transition-transform will-change-transform backdrop-blur-md"
              >
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                  <span className="relative flex h-2.5 w-2.5 z-10">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-900 dark:bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-neutral-900 dark:bg-green-500"></span>
                  </span>
                  <span className="relative z-10 text-xs font-bold text-neutral-900 dark:text-white tracking-wider uppercase">Available for Hire</span>
              </div>
              
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-neutral-900 dark:text-white leading-[0.9]">
                {titleWords.map((word, i) => (
                  <div key={i} className="overflow-hidden">
                    <motion.span
                      className="inline-block will-change-transform"
                      initial={{ y: 100 }}
                      animate={{ y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1, duration: 0.8, ease: [0.2, 0.65, 0.3, 0.9] }}
                    >
                      {word}
                    </motion.span>
                  </div>
                ))}
              </h1>
            </div>
            <div className="relative z-10 flex flex-col gap-6">
               <p className="text-neutral-500 dark:text-neutral-400 max-w-xl text-2xl leading-snug font-light">
                Crafting <span className="text-neutral-900 dark:text-white font-semibold">digital physics</span> & <span className="text-neutral-900 dark:text-white font-semibold">immersive systems</span>.
              </p>
              <div className="flex gap-4">
                 <button 
                    onClick={() => scrollToSection('work')}
                    className="relative group overflow-hidden px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-black font-black rounded-full hover:scale-105 transition-all duration-300 shadow-lg shadow-neutral-900/10 dark:shadow-white/10 will-change-transform"
                 >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent z-10" />
                    <span className="relative z-20">View Work</span>
                 </button>
                 <button 
                    onClick={() => scrollToSection('about')}
                    className="relative group overflow-hidden px-8 py-3 bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 text-neutral-900 dark:text-white font-bold rounded-full hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
                 >
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-neutral-900/5 dark:via-white/10 to-transparent z-10" />
                    <span className="relative z-20">About</span>
                 </button>
              </div>
            </div>
          </div>
        </BentoItem>

        {/* 2. PROFILE */}
        <BentoItem id="about" colSpan="col-span-1 md:col-span-1 lg:col-span-1" rowSpan="row-span-1 md:row-span-2" noPadding index={1}>
          <div className="flex flex-col h-full relative group">
             <div className="flex-1 relative overflow-hidden">
                {/* Overlay for better text contrast on image */}
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/80 via-transparent to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=774&q=80" 
                  alt="Avatar" 
                  className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:scale-105 will-change-transform"
                  decoding="async"
                />
                
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                   <h2 className="text-4xl font-black text-white mb-1">Alex Dev</h2>
                   <p className="text-white/80 font-bold tracking-widest text-sm uppercase mb-4">Full Stack Engineer</p>
                   <div className="flex gap-3 pt-4 border-t border-white/20">
                      {[
                        { Icon: Github, url: "https://github.com" }, 
                        { Icon: Twitter, url: "https://twitter.com" }, 
                        { Icon: Linkedin, url: "https://linkedin.com" }
                      ].map(({ Icon, url }, i) => (
                         <div 
                            key={i} 
                            onClick={() => window.open(url, '_blank')}
                            className="relative group overflow-hidden p-3 bg-white/20 rounded-full hover:bg-white hover:text-black text-white transition-all duration-300 backdrop-blur-md border border-white/10 hover:scale-110 cursor-pointer will-change-transform"
                         >
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-0" />
                            <Icon size={18} className="relative z-10" />
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        </BentoItem>

        {/* 3. TIME */}
        <BentoItem colSpan="col-span-1" rowSpan="row-span-1" index={2}>
          <div className="flex flex-col justify-between h-full relative overflow-hidden group">
             <div className="absolute inset-0 opacity-5 dark:opacity-10 transition-opacity group-hover:opacity-10" style={{
                 backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                 backgroundSize: '20px 20px'
             }}></div>
             
            <div className="flex justify-between items-start relative z-10">
                 <div className="p-2 bg-white/40 dark:bg-neutral-800/40 rounded-lg border border-white/20 dark:border-white/10 shadow-sm backdrop-blur-md">
                    <Globe className="text-neutral-900 dark:text-white w-6 h-6" />
                 </div>
                 <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <div className="relative z-10">
                <p className="text-6xl font-black text-neutral-900 dark:text-white tabular-nums tracking-tighter transition-colors duration-500">
                  {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                </p>
                <div className="flex items-center gap-2 mt-2">
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm font-bold uppercase tracking-wider">San Francisco</p>
                    <span className="text-neutral-300 dark:text-neutral-600">•</span>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">Online</p>
                </div>
            </div>
          </div>
        </BentoItem>
        
        {/* 4. MUSIC */}
        <BentoItem colSpan="col-span-1" rowSpan="row-span-1" noPadding index={3}>
            <Suspense fallback={<ComponentLoader />}>
                 <MusicPlayer />
            </Suspense>
        </BentoItem>

        {/* -- ROW 3 -- */}

        {/* 5. TECH TICKER */}
        <BentoItem colSpan="col-span-1 md:col-span-2 lg:col-span-4" rowSpan="row-span-1" noPadding index={4}>
            <div className="flex flex-col justify-center h-full overflow-hidden bg-white/10 dark:bg-black/10 relative">
                <div className="absolute -right-10 -top-10 text-neutral-200/50 dark:text-neutral-800/50 rotate-12 pointer-events-none">
                  <Cpu size={180} strokeWidth={0.5} />
                </div>
                <div className="absolute top-6 left-8 z-10">
                   <div className="flex items-center gap-2">
                        <div className="p-2 bg-neutral-900 dark:bg-white rounded-lg shadow-lg">
                            <Zap className="w-4 h-4 text-white dark:text-black" />
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-widest">Core Stack</h3>
                   </div>
                </div>
                <Suspense fallback={<ComponentLoader />}>
                    <TechTicker />
                </Suspense>
            </div>
        </BentoItem>

        {/* -- ROW 4 -- */}

        {/* 6. PROJECT A */}
        <BentoItem id="work" colSpan="col-span-1 md:col-span-2 lg:col-span-2" rowSpan="row-span-1" noPadding index={5}>
            <div className="group relative h-full w-full flex flex-col md:flex-row overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/50">
                <div className="relative z-20 flex flex-col justify-center p-8 lg:p-10 md:w-1/2 h-full pointer-events-none">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="h-2 w-2 rounded-full bg-neutral-900 dark:bg-white"></span>
                        <span className="text-xs font-bold text-neutral-900 dark:text-white uppercase tracking-widest">Fintech 2.0</span>
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-4">Nova Protocol</h3>
                    <p className="text-neutral-500 dark:text-neutral-400 text-sm lg:text-base leading-relaxed">
                      Zero-latency decentralized trading interface powered by Rust and WebGL.
                    </p>
                </div>
                <div className="absolute inset-0 md:relative md:w-1/2 h-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                    <img 
                        src="https://images.unsplash.com/photo-1639762681485-074b7f938ba0?q=80&w=2832&auto=format&fit=crop" 
                        className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out will-change-transform"
                        alt="Nova Protocol"
                        loading="lazy"
                        decoding="async"
                    />
                    {/* Light gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent dark:from-neutral-900 dark:via-transparent z-10" />
                </div>
                <div className="absolute bottom-6 right-6 z-30">
                    <button 
                        onClick={() => window.open('https://github.com', '_blank')}
                        className="relative group overflow-hidden h-12 w-12 lg:h-14 lg:w-14 rounded-full bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-black transform translate-y-24 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 shadow-xl hover:bg-black dark:hover:bg-neutral-200 hover:scale-110 cursor-pointer"
                    >
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-500 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
                        <ArrowUpRight size={28} className="relative z-20" />
                    </button>
                </div>
            </div>
        </BentoItem>
        
        {/* 7. GRAVITY PAD */}
        <BentoItem colSpan="col-span-1" rowSpan="row-span-1" noPadding index={6}>
            <Suspense fallback={<ComponentLoader />}>
                <GravityPad />
            </Suspense>
        </BentoItem>
        
        {/* 8. SERVICES */}
        <BentoItem colSpan="col-span-1" rowSpan="row-span-1" index={7}>
           <div className="flex flex-col h-full justify-between p-2">
              <div className="flex items-center justify-between mb-4">
                 <div className="p-2 bg-white/40 dark:bg-neutral-800/40 rounded-lg border border-white/20 dark:border-white/10 shadow-sm backdrop-blur-md">
                    <Layers className="w-6 h-6 text-neutral-900 dark:text-white" />
                 </div>
                 <span className="text-xs font-mono text-neutral-400">004</span>
              </div>
              <div className="space-y-2">
                  {['Art Direction', 'Motion Design', 'Creative Dev', '3D Modeling'].map((item, i) => (
                      <div key={i} 
                        onClick={() => window.location.href = `mailto:hello@studio.dev?subject=Inquiry about ${item}`}
                        className="group/item relative overflow-hidden flex items-center justify-between py-3 border-b border-neutral-200/50 dark:border-neutral-800/50 hover:border-neutral-400 dark:hover:border-neutral-600 cursor-pointer transition-colors"
                      >
                           <div className="absolute inset-0 -translate-x-full group-hover/item:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-neutral-200/20 dark:via-white/5 to-transparent pointer-events-none" />
                          <span className="relative z-10 text-lg font-medium text-neutral-500 dark:text-neutral-400 group-hover/item:text-neutral-900 dark:group-hover/item:text-white transition-colors">{item}</span>
                          <ArrowUpRight className="relative z-10 w-4 h-4 text-neutral-900 dark:text-white opacity-0 -translate-x-4 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-300" />
                      </div>
                  ))}
              </div>
           </div>
        </BentoItem>

        {/* -- ROW 5 -- */}

        {/* 9. PROJECT B */}
        <BentoItem colSpan="col-span-1" rowSpan="row-span-1" noPadding index={8}>
           <div 
             className="h-full w-full relative group overflow-hidden bg-neutral-200 cursor-pointer"
             onClick={() => window.open('https://dribbble.com', '_blank')}
           >
               {/* Shine Effect */}
               <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent z-30 pointer-events-none" />
               
              <img 
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 will-change-transform" 
                alt="Project"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-8 z-20 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                      <span className="text-xs font-bold px-2 py-1 bg-white text-black rounded">NEW</span>
                  </div>
                  <h3 className="text-3xl font-bold text-white leading-none">Aether</h3>
                  <p className="text-white/80 text-sm mt-2">Design System</p>
              </div>
           </div>
        </BentoItem>

        {/* 10. COMMAND */}
        <BentoItem colSpan="col-span-1" rowSpan="row-span-1" index={9}>
            <div className="h-full flex flex-col justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/40 dark:bg-neutral-800/40 rounded border border-white/20 dark:border-white/10 shadow-sm backdrop-blur-md">
                        <Terminal className="w-5 h-5 text-neutral-900 dark:text-white" />
                    </div>
                    <h3 className="text-sm font-mono text-neutral-500 dark:text-neutral-400 uppercase">Terminal</h3>
                </div>
                
                <div className="flex-1 flex items-center justify-center">
                     <div className="grid grid-cols-2 gap-3 w-full">
                        <div 
                            onClick={() => setIsCmdOpen(true)}
                            className="relative overflow-hidden bg-white/30 dark:bg-neutral-800/30 border border-white/20 dark:border-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/50 dark:hover:bg-white/10 hover:shadow-md transition-all cursor-pointer group backdrop-blur-md"
                        >
                             <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                            <Command className="w-6 h-6 text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-900 dark:group-hover:text-white relative z-10" />
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono relative z-10">CMD+K</span>
                        </div>
                        <div 
                            onClick={toggleTheme}
                            className="relative overflow-hidden bg-white/30 dark:bg-neutral-800/30 border border-white/20 dark:border-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/50 dark:hover:bg-white/10 hover:shadow-md transition-all cursor-pointer group backdrop-blur-md"
                        >
                             <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                            <div className="w-6 h-6 rounded bg-neutral-200 dark:bg-neutral-600 group-hover:bg-neutral-900 dark:group-hover:bg-white transition-colors flex items-center justify-center relative z-10">
                                {isDark ? <Moon size={12} className="text-neutral-300 dark:text-black" /> : <Sun size={12} className="text-neutral-500" />}
                            </div>
                            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono relative z-10">THEME</span>
                        </div>
                     </div>
                </div>

                <div className="mt-2">
                    <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/20 px-2 py-1 rounded w-fit">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span>System Operational</span>
                    </div>
                </div>
            </div>
        </BentoItem>

        {/* 11. CONTACT */}
        <BentoItem id="contact" colSpan="col-span-1 md:col-span-2" rowSpan="row-span-1" index={10}>
            <Suspense fallback={<ComponentLoader />}>
                <Contact />
            </Suspense>
        </BentoItem>
        
      </div>
    </div>
  );
};

export default App;