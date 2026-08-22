'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, ArrowLeft, Loader2, PartyPopper } from 'lucide-react';
import { toast } from 'sonner';
import { SERVICES } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';

const schema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  company: z.string().optional(),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional(),
  service: z.string().min(1, 'Select a service'),
  budget: z.string().min(1, 'Select a budget'),
  timeline: z.string().min(1, 'Select a timeline'),
  message: z.string().optional(),
});

const BUDGETS = ['< \u20b91L', '\u20b91L \u2013 \u20b95L', '\u20b95L \u2013 \u20b915L', '\u20b915L+'];
const TIMELINES = ['ASAP', '1\u20133 months', '3\u20136 months', 'Just exploring'];
const STEPS = ['About you', 'Your project', 'Timeline & goals'];

function Choice({ active, children, ...props }) {
  return (
    <button type="button" {...props} className={`rounded-lg border px-4 py-2.5 text-sm font-medium transition-all ${active ? 'border-primary bg-primary/10 text-foreground glow-brand' : 'border-border text-muted-foreground hover:border-primary/50'}`}>
      {children}
    </button>
  );
}

export function LeadForm() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const { register, handleSubmit, watch, setValue, trigger, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', company: '', email: '', phone: '', service: '', budget: '', timeline: '', message: '' },
    mode: 'onTouched',
  });

  const values = watch();

  async function next() {
    const fields = step === 0 ? ['name', 'email'] : step === 1 ? ['service', 'budget'] : [];
    const ok = await trigger(fields);
    if (ok) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  async function onSubmit(data) {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source: 'lead-form' }),
      });
      if (!res.ok) throw new Error('Failed');
      setDone(true);
      toast.success('Thanks! Our team will reach out within one business day.');
    } catch (e) {
      toast.error('Could not submit. Please try again or WhatsApp us.');
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/60 p-10 text-center">
        <span className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary/15 text-primary"><PartyPopper className="h-7 w-7" /></span>
        <h3 className="font-display text-2xl font-semibold">You&apos;re in, {values.name?.split(' ')[0] || 'there'}! 🎉</h3>
        <p className="mt-2 max-w-sm text-muted-foreground">Our strategy team will review your {values.service || 'project'} and reach out within one business day.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 md:p-8">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>Step {step + 1} of {STEPS.length}</span>
          <span className="font-medium text-foreground">{STEPS[step]}</span>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} className="h-1.5" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }} className="space-y-4">
            {step === 0 && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="name">Full name *</Label>
                    <Input id="name" placeholder="Priya Sharma" {...register('name')} className="mt-1.5" />
                    {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Acme Inc." {...register('company')} className="mt-1.5" />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="email">Work email *</Label>
                    <Input id="email" type="email" placeholder="priya@acme.com" {...register('email')} className="mt-1.5" />
                    {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone / WhatsApp</Label>
                    <Input id="phone" placeholder="+91 …" {...register('phone')} className="mt-1.5" />
                  </div>
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <Label>Which service do you need? *</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {SERVICES.map((s) => (
                      <Choice key={s.slug} active={values.service === s.name} onClick={() => setValue('service', s.name, { shouldValidate: true })}>{s.name}</Choice>
                    ))}
                  </div>
                  {errors.service && <p className="mt-1 text-xs text-destructive">{errors.service.message}</p>}
                </div>
                <div>
                  <Label>Budget range *</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {BUDGETS.map((b) => (
                      <Choice key={b} active={values.budget === b} onClick={() => setValue('budget', b, { shouldValidate: true })}>{b}</Choice>
                    ))}
                  </div>
                  {errors.budget && <p className="mt-1 text-xs text-destructive">{errors.budget.message}</p>}
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <Label>Timeline *</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {TIMELINES.map((t) => (
                      <Choice key={t} active={values.timeline === t} onClick={() => setValue('timeline', t, { shouldValidate: true })}>{t}</Choice>
                    ))}
                  </div>
                  {errors.timeline && <p className="mt-1 text-xs text-destructive">{errors.timeline.message}</p>}
                </div>
                <div>
                  <Label htmlFor="message">Anything else? (goals, links)</Label>
                  <Textarea id="message" rows={3} placeholder="Tell us about your goals…" {...register('message')} className="mt-1.5" />
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between">
          {step > 0 ? (
            <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}><ArrowLeft className="mr-1 h-4 w-4" /> Back</Button>
          ) : <span />}
          {step < STEPS.length - 1 ? (
            <Button type="button" onClick={next} className="rounded-full">Next <ArrowRight className="ml-1 h-4 w-4" /></Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="rounded-full glow-brand">
              {isSubmitting ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Check className="mr-1 h-4 w-4" />} Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}

export default LeadForm;
