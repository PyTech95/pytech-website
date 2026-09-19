'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

const inr = (n) => '\u20b9' + Math.round(n).toLocaleString('en-IN');
const UPLIFT = 0.38; // projected conversion uplift with PyTech

export function RoiCalculator() {
  const [visitors, setVisitors] = useState(20000);
  const [conv, setConv] = useState(2);
  const [deal, setDeal] = useState(25000);

  const { current, projected, gain } = useMemo(() => {
    const cur = visitors * (conv / 100) * deal;
    const proj = visitors * ((conv * (1 + UPLIFT)) / 100) * deal;
    return { current: cur, projected: proj, gain: proj - cur };
  }, [visitors, conv, deal]);

  return (
    <div className="grid gap-8 rounded-2xl border border-border bg-card/60 p-6 md:grid-cols-2 md:p-8">
      <div className="space-y-7">
        <Field label="Monthly website visitors" value={visitors.toLocaleString('en-IN')}>
          <Slider value={[visitors]} min={1000} max={200000} step={1000} onValueChange={(v) => setVisitors(v[0])} />
        </Field>
        <Field label="Current conversion rate" value={`${conv.toFixed(1)}%`}>
          <Slider value={[conv]} min={0.5} max={10} step={0.1} onValueChange={(v) => setConv(v[0])} />
        </Field>
        <Field label="Average deal value" value={inr(deal)}>
          <Slider value={[deal]} min={1000} max={500000} step={1000} onValueChange={(v) => setDeal(v[0])} />
        </Field>
      </div>

      <div className="flex flex-col justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--brand))]/10 to-[hsl(var(--cobalt))]/10 p-6">
        <p className="text-sm text-muted-foreground">Current monthly revenue</p>
        <p className="font-display text-2xl font-semibold">{inr(current)}</p>
        <div className="my-4 h-px bg-border" />
        <p className="flex items-center gap-1.5 text-sm text-primary"><TrendingUp className="h-4 w-4" /> Projected with PyTech (+{Math.round(UPLIFT * 100)}%)</p>
        <motion.p key={projected} initial={{ opacity: 0.4, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl font-bold text-gradient">
          {inr(projected)}
        </motion.p>
        <p className="mt-3 text-sm text-muted-foreground">That&apos;s <span className="font-semibold text-foreground">{inr(gain)}</span> in additional revenue every month.</p>
        <p className="mt-1 text-xs text-muted-foreground/70">*Illustrative estimate. Actual results vary by scope & market.</p>
      </div>
    </div>
  );
}

function Field({ label, value, children }) {
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="font-display text-sm font-semibold">{value}</span>
      </div>
      {children}
    </div>
  );
}

export default RoiCalculator;
