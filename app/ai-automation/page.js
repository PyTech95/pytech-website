import Link from 'next/link';
import { ArrowRight, MessageCircle, MessageSquare, PhoneCall, Workflow, Zap } from 'lucide-react';
import { Reveal } from '@/components/site/reveal';
import { PricingTiers } from '@/components/site/pricing-tiers';
import { LeadForm } from '@/components/site/lead-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { COMPANY } from '@/lib/data';

export const metadata = {
  title: 'AI Automation — WhatsApp API, SMS & Voice Marketing',
  description: 'Automate sales & support with PyTech Digital: official WhatsApp Business API, SMS marketing, AI voice calling and Business Workflow AI. Transparent pricing tiers.',
  alternates: { canonical: `${COMPANY.url}/ai-automation` },
};

const AI_IMG = 'https://images.unsplash.com/photo-1716436329475-4c55d05383bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NTZ8MHwxfHNlYXJjaHwyfHxBSSUyMHRlY2hub2xvZ3l8ZW58MHx8fGJsYWNrfDE3ODc0Mjg5ODJ8MA&ixlib=rb-4.1.0&q=85';

const CHANNELS = [
  { icon: MessageCircle, t: 'WhatsApp API Systems', d: 'Official Cloud API, chatbots, broadcasts, catalog commerce & CRM sync.' },
  { icon: MessageSquare, t: 'SMS Marketing', d: 'DLT-compliant bulk, OTP & transactional SMS with 98% delivery.' },
  { icon: PhoneCall, t: 'Voice Calling Automation', d: 'AI voice agents, IVR & automated outbound campaigns, 24/7.' },
  { icon: Workflow, t: 'Business Workflow AI', d: 'AI agents that automate ops, sales & support end-to-end.' },
];

export default function AiAutomationPage() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden pt-28 md:pt-36">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="pointer-events-none absolute right-0 top-0 h-[400px] w-[500px] rounded-full opacity-25 blur-[120px]" style={{ background: 'radial-gradient(circle, hsl(var(--cobalt)), transparent 60%)' }} />
        <div className="container relative mx-auto grid items-center gap-10 px-6 pb-12 lg:grid-cols-2">
          <div>
            <Badge variant="outline" className="mb-4 gap-1.5 rounded-full border-primary/30 bg-primary/5 text-primary"><Zap className="h-3.5 w-3.5" /> AUTOMATE pillar</Badge>
            <h1 className="font-display text-4xl font-bold leading-[1.08] tracking-tight md:text-5xl">Automate conversations. <span className="text-gradient">Multiply revenue.</span></h1>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">Deploy official WhatsApp Business API, SMS marketing, AI voice calling and workflow automation — all in one place. Convert leads, recover carts and support customers 24/7.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full glow-brand"><Link href="#pricing">View pricing <ArrowRight className="ml-1 h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline" className="rounded-full"><Link href="#lead">Book a demo</Link></Button>
            </div>
          </div>
          <div className="relative">
            <div className="overflow-hidden rounded-2xl border border-border">
              <img src={AI_IMG} alt="AI automation" className="h-[320px] w-full object-cover md:h-[400px]" />
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHANNELS.map((c, i) => (
            <Reveal key={c.t} delay={i * 0.07}>
              <div className="h-full rounded-2xl border border-border bg-card/50 p-6 transition-all hover:border-primary/40">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-border bg-background text-primary"><c.icon className="h-5 w-5" /></span>
                <p className="mt-4 font-display font-semibold">{c.t}</p>
                <p className="mt-1.5 text-sm text-muted-foreground">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="pricing" className="container mx-auto scroll-mt-24 px-6 py-14">
        <Reveal>
          <div className="mb-8 text-center">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary">Pricing</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">Simple, scalable automation plans.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">No hidden fees. Cancel anytime. Message volume & API costs billed transparently at cost.</p>
          </div>
        </Reveal>
        <PricingTiers />
      </section>

      <section id="lead" className="container mx-auto scroll-mt-24 px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-3xl font-bold md:text-4xl">Book a free automation demo.</h2>
            <p className="mt-4 max-w-md text-muted-foreground">See exactly how WhatsApp, SMS and voice automation would work for your business. We&apos;ll map a plan in one call.</p>
          </Reveal>
          <Reveal delay={0.1}><LeadForm /></Reveal>
        </div>
      </section>
    </div>
  );
}
