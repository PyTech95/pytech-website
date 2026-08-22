'use client';

import { useEffect, useRef, useState } from 'react';

// Subtle cursor-following glow (desktop / fine pointer only).
export function CursorGlow() {
  const ref = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;
    setEnabled(true);
    let raf = 0;
    const move = (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (ref.current) {
          ref.current.style.transform = `translate3d(${e.clientX - 200}px, ${e.clientY - 200}px, 0)`;
        }
      });
    };
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mousemove', move);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!enabled) return null;
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[5] h-[400px] w-[400px] rounded-full opacity-40 blur-[90px] transition-opacity"
      style={{ background: 'radial-gradient(circle, hsl(var(--brand) / 0.45), transparent 60%)' }}
    />
  );
}

export default CursorGlow;
