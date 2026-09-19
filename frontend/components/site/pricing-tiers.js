'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';

const TIERS = [
  {
    name: 'Starter',
    monthly: 14999,
    tagline: 'Launch WhatsApp automation fast.',
    features: ['Official WhatsApp Business API setup', '1 automated chatbot flow', 'Up to 5,000 conversations/mo', 'Broadcast campaigns', 'Basic delivery analytics'],
  },
  {
    name: 'Growth',
    monthly: 34999,
    popular: true,
    tagline: 'Multi-channel automation that scales.',
    features: ['Everything in Starter', 'WhatsApp + SMS marketing', '3 chatbot / drip flows', 'AI FAQ assistant', 'Up to 25,000 conversations/mo', 'CRM & catalog sync', 'Cart-recovery automation'],
  },
  {
    name: 'Scale',
    monthly: null,
    tagline: 'Enterprise automation & voice AI.',
    features: ['Everything in Growth', 'AI voice calling automation', 'Unlimited flows & volume', 'Business Workflow AI agents', 'Dedicated success manager', 'Custom integrations & SLAs'],
  },
];

const inr = (n) => '\u20b9' + n.toLocaleString('en-IN');

export function PricingTiers() {
  const [annual, setAnnual] = useState(false);
  return (
    <div>
      <div className="mb-8 flex items-center justify-center gap-3">
        <span className={`text-sm ${!annual ? 'text-foreground' : 'text-muted-foreground'}`}>Monthly</span>
        <Switch checked={annual} onCheckedChange={setAnnual} aria-label="Toggle annual billing" />
        <span className={`text-sm ${annual ? 'text-foreground' : 'text-muted-foreground'}`}>Annual</span>
        <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/5 text-primary">2 months free</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {TIERS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
            className={`relative flex flex-col rounded-2xl border p-7 ${t.popular ? 'border-primary/60 bg-card glow-brand' : 'border-border bg-card/50'}`}
          >
            {t.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full">Most popular</Badge>}
            <p className="font-display text-lg font-semibold">{t.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{t.tagline}</p>
            <div className="mt-5">
              {t.monthly ? (
                <p className="font-display text-4xl font-bold">{inr(annual ? Math.round(t.monthly * 10) : t.monthly)}<span className="text-base font-normal text-muted-foreground">/{annual ? 'yr' : 'mo'}</span></p>
              ) : (
                <p className="font-display text-4xl font-bold">Custom</p>
              )}
            </div>
            <ul className="mt-6 flex-1 space-y-3">
              {t.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <span className="mt-0.5 grid h-5 w-5 flex-none place-items-center rounded-full bg-primary/15 text-primary"><Check className="h-3 w-3" /></span>
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
            <Button asChild className={`mt-7 w-full rounded-full ${t.popular ? 'glow-brand' : ''}`} variant={t.popular ? 'default' : 'outline'}>
              <Link href="/#contact">{t.monthly ? 'Get started' : 'Talk to sales'}</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default PricingTiers;
