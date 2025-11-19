import React, { useEffect, useRef } from 'react';

const GravityPad: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true }); // Optimize for alpha if needed, or false if opaque
    if (!ctx) return;

    let animationFrameId: number;
    let width = container.clientWidth;
    let height = container.clientHeight;
    let isInView = true;

    // Physics constants
    const friction = 0.98; 
    const gravity = 0.4;   
    const mouseRepelRadius = 120;
    const mouseRepelForce = 1.5;

    interface Ball {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }

    let balls: Ball[] = [];
    const colors = ['#000000', '#06B6D4', '#DB2777', '#8B5CF6'];

    // Initialize balls
    const init = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      // Handle DPI for crisp rendering but performance cost. 
      // For absolute performance, 1x is better, but let's stick to 1x for speed unless pixel ratio is needed.
      canvas.width = width; 
      canvas.height = height;
      
      balls = [];
      // Reduce ball count slightly for mobile optimization if needed, but 12 is fine
      for (let i = 0; i < 12; i++) {
        balls.push({
          x: Math.random() * width,
          y: Math.random() * height / 2,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          radius: Math.random() * 12 + 8,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    let mouseX = -1000;
    let mouseY = -1000;

    const update = () => {
      // Optimization: Don't render if off-screen
      if (!isInView) {
         animationFrameId = requestAnimationFrame(update);
         return;
      }
      
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        
        // Apply forces
        ball.vy += gravity;
        ball.vx *= friction;
        ball.vy *= friction;

        // Mouse Interaction (Repel)
        const dx = ball.x - mouseX;
        const dy = ball.y - mouseY;
        // Optimization: avoid sqrt if distance check can be squared, but we need actual distance for normalization
        const distanceSq = dx * dx + dy * dy;
        
        if (distanceSq < mouseRepelRadius * mouseRepelRadius) {
          const distance = Math.sqrt(distanceSq);
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouseRepelRadius - distance) / mouseRepelRadius;
          
          ball.vx += forceDirectionX * force * mouseRepelForce;
          ball.vy += forceDirectionY * force * mouseRepelForce;
          
          // Draw connection line
          ctx.beginPath();
          ctx.moveTo(ball.x, ball.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(120, 120, 120, ${force * 0.4})`; // Slightly lighter line for glass look
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Update position
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Floor Collision
        if (ball.y + ball.radius > height) {
          ball.y = height - ball.radius;
          ball.vy *= -0.7;
        }
        // Ceiling Collision
        if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy *= -0.7;
        }
        // Wall Collision
        if (ball.x + ball.radius > width) {
          ball.x = width - ball.radius;
          ball.vx *= -0.7;
        }
        if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx *= -0.7;
        }

        // Draw Ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        
        // Reflection (Enhanced for Glass Pad)
        ctx.fillStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath();
        ctx.arc(ball.x - ball.radius * 0.3, ball.y - ball.radius * 0.3, ball.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(update);
    };

    init();
    update();

    // Intersection Observer to pause rendering when not visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isInView = entry.isIntersecting;
        });
    }, { threshold: 0.1 });
    
    observer.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    };

    const handleResize = () => {
        init();
    }

    canvas.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    canvas.addEventListener('touchmove', (e) => {
        // Cannot be passive if we want to prevent default, but for this physics pad, 
        // we might want to allow scrolling unless interacting directly. 
        // Let's keep it non-passive for interaction but be mindful.
        e.preventDefault(); 
        const rect = canvas.getBoundingClientRect();
        mouseX = e.touches[0].clientX - rect.left;
        mouseY = e.touches[0].clientY - rect.top;
    }, { passive: false });

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full relative bg-transparent overflow-hidden">
        <div className="absolute top-4 left-4 pointer-events-none z-10">
            <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-white animate-pulse" />
                 <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 uppercase">Physics Engine</span>
            </div>
        </div>
        <canvas ref={canvasRef} className="block cursor-crosshair touch-none" />
    </div>
  );
};

export default GravityPad;