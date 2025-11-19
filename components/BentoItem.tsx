import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface BentoItemProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: string;
  rowSpan?: string;
  noPadding?: boolean;
  index?: number;
  id?: string;
}

const BentoItem: React.FC<BentoItemProps> = ({ 
  children, 
  className = "", 
  colSpan = "col-span-1", 
  rowSpan = "row-span-1",
  noPadding = false,
  index = 0,
  id
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smoother, heavier physics for a "premium" weight feel
  const mouseXSpring = useSpring(x, { stiffness: 250, damping: 25, mass: 0.5 });
  const mouseYSpring = useSpring(y, { stiffness: 250, damping: 25, mass: 0.5 });

  // Subtle tilt, deep perspective (Reduced tilt for elegance)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["1.5deg", "-1.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-1.5deg", "1.5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate tilt percentages
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);

    // CSS Variables for Lighting Calculation
    ref.current.style.setProperty('--mouse-x', `${mouseX}px`);
    ref.current.style.setProperty('--mouse-y', `${mouseY}px`);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setHovered(false);
  };

  return (
    <motion.div
      id={id}
      ref={ref}
      className={`relative ${colSpan} ${rowSpan} h-full w-full group perspective-container z-0`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.8, 
        ease: [0.2, 0.8, 0.2, 1], // Custom ease for "fluid" entrance
        delay: index * 0.05
      }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className={`h-full w-full relative rounded-[32px] transition-all duration-500 will-change-transform`}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
      >
        {/* 
          --- REFINED LIQUID GLASS ENGINE ---
          Simulating physical glass properties:
          1. Refraction (Blur + Saturation)
          2. Thickness (Inner Shadows)
          3. Surface Imperfection (Noise)
          4. Specular Reflection (Dynamic Light)
          5. Fresnel Edge (Border Light)
        */}
        <div className="absolute inset-0 rounded-[32px] overflow-hidden transform-gpu">
           
           {/* 1. BASE MATERIAL (The Glass Body) */}
           {/* Extremely high saturation pulls background colors through vividly, imitating high-index glass */}
           <div className="absolute inset-0 bg-neutral-50/60 dark:bg-neutral-900/60 backdrop-blur-[40px] saturate-[1.8] transition-colors duration-500" />

           {/* 2. STATIC OVERHEAD LIGHT (Studio Lighting Simulation) */}
           {/* Adds a permanent subtle gradient from top-left, simulating a physical light source */}
           <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-transparent opacity-50 pointer-events-none mix-blend-overlay" />

           {/* 3. NOISE TEXTURE (Micro-texture) */}
           <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-overlay pointer-events-none" />

           {/* 4. DIFFUSE AMBIENT GLOW (Mouse Follower) */}
           {/* Massive radius (800px) ensures no harsh edges. "Flashlight" effect removed. */}
           <div 
             className="absolute inset-0 transition-opacity duration-700 opacity-0 group-hover:opacity-100 pointer-events-none"
             style={{
                background: `radial-gradient(800px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.08), transparent 50%)`,
             }}
           />

           {/* 5. SPECULAR SHEEN (Surface Reflection) */}
           {/* A sharper, but still soft interaction that catches the light on movement */}
           <div 
             className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100 pointer-events-none"
             style={{
                background: `radial-gradient(400px circle at var(--mouse-x, 0) var(--mouse-y, 0), rgba(255,255,255,0.15), transparent 80%)`,
                mixBlendMode: 'plus-lighter' // Elegant additive blending
             }}
           />

           {/* 6. DYNAMIC RIM LIGHT (Edge Catching) */}
           {/* Extremely subtle edge highlight that follows mouse */}
           <div 
             className="absolute inset-0 z-20 rounded-[32px] border border-transparent pointer-events-none transition-opacity duration-500 opacity-0 group-hover:opacity-100"
             style={{
                 background: `radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(255, 255, 255, 0.4), transparent 50%) border-box`,
                 WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
                 WebkitMaskComposite: 'xor',
                 maskComposite: 'exclude'
             }}
           />

           {/* 7. PHYSICAL EDGE (Glass Thickness) */}
           {/* Static inner highlights to define the shape even without interaction */}
           <div className="absolute inset-0 rounded-[32px] ring-1 ring-inset ring-white/10 dark:ring-white/5 pointer-events-none z-20" />
           <div className="absolute inset-0 rounded-[32px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.2)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] pointer-events-none z-20" />
           
           {/* Content Container */}
           <div className={`relative h-full w-full z-10 ${noPadding ? '' : 'p-8'} ${className}`} style={{ transform: "translateZ(10px)" }}>
               {children}
           </div>
        </div>

        {/* Deep Ambient Shadow (Elevation) */}
        <div 
            className="absolute -inset-4 bg-black/5 dark:bg-black/20 rounded-[40px] blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" 
            style={{ transform: "translateZ(-20px)" }}
        />
      </motion.div>
    </motion.div>
  );
};

export default BentoItem;