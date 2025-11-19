import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor: React.FC = () => {
  // Use MotionValues directly to avoid React re-renders on every pixel move
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Much tighter spring physics for "snappy" responsiveness
  const springConfig = { damping: 35, stiffness: 800, mass: 0.5 };
  
  // We pipe the raw mouse MotionValues into the spring MotionValues
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  // Configuration for cursor size (High Quality Scaling)
  // We define the cursor as a larger element (32px) and scale it DOWN for the resting state (0.25 = 8px).
  // This ensures that when it scales up to 1 (32px) or larger, it retains sharp edges (vector-like quality)
  // instead of blurring a small 4px or 16px bitmap.
  const BASE_SIZE = 32;
  const OFFSET = BASE_SIZE / 2;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Update MotionValues directly - NO STATE UPDATE involved
      mouseX.set(e.clientX - OFFSET); 
      mouseY.set(e.clientY - OFFSET);
      
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const computedStyle = window.getComputedStyle(target);
      
      // Check efficiently using closest
      if (
        target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.closest('button') || 
        target.closest('a') ||
        computedStyle.cursor === 'pointer' ||
        target.closest('.group')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    // Passive listeners for better scroll performance
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <>
      {/* Main Cursor Blob - Exclusion blend for perfect contrast */}
      {/* w-8 h-8 = 32px. Scaled to 0.25 = 8px resting size. */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 w-8 h-8 bg-white rounded-full pointer-events-none z-[9999] mix-blend-exclusion will-change-transform"
        style={{
          x: cursorX,
          y: cursorY,
          scale: isHovering ? 1.2 : 0.25, // Hover scales to ~38px, Resting is 8px
          opacity: isVisible ? 1 : 0,
        }}
      />
      
      {/* Trailing dot - No spring for instant feedback */}
      {/* Centering logic: MouseX is (client - 16). We want dot at client. 
          Dot is 4px (w-1). Center of dot needs to be at client.
          Dot Left = client - 2.
          Dot Left = (mouseX + 16) - 2 = mouseX + 14.
      */}
      <motion.div 
        className={`custom-cursor fixed top-0 left-0 w-1 h-1 bg-cyan-500 rounded-full pointer-events-none z-[9999] ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        style={{
            x: mouseX, 
            y: mouseY,
            translateX: 14,
            translateY: 14
        }}
      />
    </>
  );
};

export default CustomCursor;