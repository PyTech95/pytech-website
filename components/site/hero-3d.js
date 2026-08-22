'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';

function FallbackOrb() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div
        className="h-56 w-56 animate-float-slow rounded-full md:h-64 md:w-64"
        style={{
          background: 'radial-gradient(circle at 30% 30%, hsl(var(--brand)), hsl(var(--cobalt)) 60%, transparent 75%)',
          boxShadow: '0 0 120px 10px hsl(var(--brand) / 0.5)',
        }}
      />
    </div>
  );
}

const Globe = dynamic(() => import('@/components/site/globe'), { ssr: false, loading: () => <FallbackOrb /> });

// Interactive WebGL 3D hero element (reacts to cursor) with floating glass stats.
export function Hero3D() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[560px] md:h-[540px]">
      {/* rotating decorative rings */}
      <div className="pointer-events-none absolute inset-0 animate-spin-slow">
        <div className="absolute inset-4 rounded-full border border-primary/15" />
        <div className="absolute inset-16 rounded-full border border-[hsl(var(--cobalt))]/15" />
      </div>

      {/* live WebGL globe */}
      <div className="absolute inset-0">
        <Globe />
      </div>

      {/* floating glass cards */}
      <motion.div className="glass pointer-events-none absolute left-0 top-10 rounded-xl px-4 py-3 text-left shadow-xl" animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
        <p className="text-xs text-muted-foreground">LCP</p>
        <p className="font-display text-lg font-semibold text-primary">0.8s</p>
      </motion.div>
      <motion.div className="glass pointer-events-none absolute bottom-12 right-0 rounded-xl px-4 py-3 text-left shadow-xl" animate={{ y: [0, 14, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
        <p className="text-xs text-muted-foreground">ROAS</p>
        <p className="font-display text-lg font-semibold text-[hsl(var(--cobalt))]">4.2x</p>
      </motion.div>
      <motion.div className="glass pointer-events-none absolute bottom-0 left-10 rounded-xl px-4 py-3 text-left shadow-xl" animate={{ y: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
        <p className="text-xs text-muted-foreground">AI answers</p>
        <p className="font-display text-lg font-semibold text-primary">GEO ready</p>
      </motion.div>

      <span className="glass pointer-events-none absolute right-2 top-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-widest text-primary">
        ◉ WebGL · live
      </span>
    </div>
  );
}

export default Hero3D;
