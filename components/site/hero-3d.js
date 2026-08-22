'use client';

import { motion } from 'framer-motion';

// Animated placeholder for an interactive WebGL 3D hero element.
export function Hero3D() {
  return (
    <div className="relative mx-auto flex h-[420px] w-full max-w-[520px] items-center justify-center md:h-[520px]">
      {/* rotating gradient rings */}
      <div className="absolute inset-0 animate-spin-slow">
        <div className="absolute inset-6 rounded-full border border-primary/25" />
        <div className="absolute inset-14 rounded-full border border-primary/15" />
        <div className="absolute inset-24 rounded-full border border-[hsl(var(--cobalt))]/20" />
      </div>

      {/* core orb */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="relative h-56 w-56 rounded-full md:h-64 md:w-64"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, hsl(var(--brand)), hsl(var(--cobalt)) 60%, transparent 75%)',
          boxShadow: '0 0 120px 10px hsl(var(--brand) / 0.5)',
        }}
      >
        <div className="absolute inset-0 rounded-full mix-blend-overlay opacity-60 grid-bg" />
      </motion.div>

      {/* floating glass cards */}
      <motion.div
        className="glass absolute left-0 top-10 rounded-xl px-4 py-3 text-left shadow-xl"
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <p className="text-xs text-muted-foreground">LCP</p>
        <p className="font-display text-lg font-semibold text-primary">0.8s</p>
      </motion.div>

      <motion.div
        className="glass absolute bottom-12 right-0 rounded-xl px-4 py-3 text-left shadow-xl"
        animate={{ y: [0, 14, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <p className="text-xs text-muted-foreground">ROAS</p>
        <p className="font-display text-lg font-semibold text-[hsl(var(--cobalt))]">4.2x</p>
      </motion.div>

      <motion.div
        className="glass absolute bottom-0 left-10 rounded-xl px-4 py-3 text-left shadow-xl"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <p className="text-xs text-muted-foreground">AI answers</p>
        <p className="font-display text-lg font-semibold text-primary">GEO ready</p>
      </motion.div>

      <span className="glass absolute right-2 top-2 rounded-full px-3 py-1 text-[10px] uppercase tracking-widest text-muted-foreground">
        WebGL slot
      </span>
    </div>
  );
}

export default Hero3D;
