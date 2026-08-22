'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { whatsappLink } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const STORAGE_KEY = 'pytech-triage-session';
const GREETING = "Hi, I'm Ada \u2014 PyTech's AI assistant. \ud83d\udc4b What are you looking to build, brand, market or automate?";
const CHIPS = ['Build a web/app', 'Grow with SEO', 'WhatsApp automation', '3D branding'];

export function TriageChatbot() {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([{ role: 'assistant', content: GREETING }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    const existing = typeof window !== 'undefined' && window.localStorage.getItem(STORAGE_KEY);
    if (existing) {
      setSessionId(existing);
      fetch(`/api/chat?sessionId=${encodeURIComponent(existing)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => { if (d?.messages?.length) setMessages(d.messages.map((m) => ({ role: m.role, content: m.content }))); })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading, open]);

  async function sendMessage(text) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', content }]);
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content, sessionId: sessionId || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setSessionId(data.sessionId);
      if (typeof window !== 'undefined') window.localStorage.setItem(STORAGE_KEY, data.sessionId);
      setMessages((m) => [...m, { role: 'assistant', content: data.message }]);
    } catch (e) {
      setMessages((m) => [...m, { role: 'assistant', content: `Sorry, I hit an issue. Please try again or message us on WhatsApp.` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open AI assistant"
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--cobalt))] text-white shadow-xl transition-transform hover:scale-105"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot className="h-7 w-7" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
            className="glass fixed bottom-24 right-4 z-40 flex h-[540px] w-[calc(100vw-2rem)] max-w-[390px] flex-col overflow-hidden rounded-2xl shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border/60 bg-gradient-to-r from-[hsl(var(--brand))]/15 to-[hsl(var(--cobalt))]/15 p-4">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-[hsl(var(--brand))] to-[hsl(var(--cobalt))] text-white">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold leading-none">Ada · AI Assistant</p>
                <p className="mt-1 text-xs text-muted-foreground">Qualifies your project in seconds</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <span
                    className={`inline-block max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm ${
                      m.role === 'user'
                        ? 'rounded-br-sm bg-primary text-primary-foreground'
                        : 'rounded-bl-sm bg-secondary text-secondary-foreground'
                    }`}
                  >
                    {m.content}
                  </span>
                </div>
              ))}
              {loading && <p className="text-xs text-muted-foreground">Ada is typing…</p>}

              {messages.length <= 1 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {CHIPS.map((c) => (
                    <button key={c} onClick={() => sendMessage(c)} className="rounded-full border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground">
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* WhatsApp handoff */}
            <a
              href={whatsappLink('Hi PyTech, Ada helped me and I want to continue on WhatsApp.')}
              target="_blank" rel="noopener noreferrer"
              className="mx-4 mb-2 flex items-center justify-center gap-2 rounded-lg bg-[#25D366]/15 py-2 text-xs font-medium text-[#25D366] transition-colors hover:bg-[#25D366]/25"
            >
              Continue on WhatsApp →
            </a>

            {/* Input */}
            <form
              onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
              className="flex items-center gap-2 border-t border-border/60 p-3"
            >
              <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message…" maxLength={1000} disabled={loading} className="rounded-full" />
              <Button type="submit" size="icon" disabled={loading || !input.trim()} className="rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default TriageChatbot;
