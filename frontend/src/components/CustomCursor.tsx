'use client';

import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setHidden(false);

      // Move the core dot instantly
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    };

    const onMouseLeave = () => {
      setHidden(true);
    };

    const onMouseEnter = () => {
      setHidden(false);
    };

    // Smooth physics animation loop for outer ring
    const render = () => {
      const ease = 0.12; // lower is smoother/laggier
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;

      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      requestAnimationFrame(render);
    };

    const animationId = requestAnimationFrame(render);

    // Dynamic hover listener
    const addHoverEvents = () => {
      const clickables = document.querySelectorAll('a, button, input, textarea, select, [role="button"], .interactive');
      clickables.forEach((el) => {
        el.addEventListener('mouseenter', () => setHovered(true));
        el.addEventListener('mouseleave', () => setHovered(false));
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Initial hook
    addHoverEvents();

    // Create an observer to attach listeners to dynamically rendered elements
    const observer = new MutationObserver(addHoverEvents);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className={`custom-cursor hidden md:block ${hovered ? 'custom-cursor-hover' : ''} ${hidden ? 'opacity-0' : 'opacity-1'}`}
      />
      <div
        ref={ringRef}
        className={`custom-cursor-ring hidden md:block ${hovered ? 'custom-cursor-ring-hover' : ''} ${hidden ? 'opacity-0' : 'opacity-1'}`}
      />
    </>
  );
}
