'use client';
import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { apiUrl } from '@/lib/api-client';

export const ImageField = ({ value, onChange, adminKey, id, label = 'Cover image', onBusy }) => {
  const input = useRef(null);
  const [busy, setBusy] = useState(false);
  async function upload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); onBusy?.(true);
    try {
      if (file.size > 5 * 1024 * 1024) throw new Error('Image must be under 5 MB');
      const body = new FormData(); body.append('file', file);
      const res = await fetch(apiUrl('/api/media'), { method: 'POST', headers: { 'x-admin-key': adminKey }, body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url); toast.success('Image uploaded');
    } catch (error) { toast.error(error.message); }
    finally { setBusy(false); onBusy?.(false); e.target.value = ''; }
  }
  return <div className="min-w-0 space-y-2">
    <Label htmlFor={`${id}-url`}>{label}</Label>
    <div className="flex gap-2">
      <Input id={`${id}-url`} data-testid={`${id}-url`} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="https://…" disabled={busy} />
      <Button type="button" variant="outline" size="icon" title="Upload image" aria-label="Upload image" data-testid={`${id}-upload`} disabled={busy} onClick={() => input.current?.click()}><Upload className={`h-4 w-4 ${busy ? 'animate-pulse' : ''}`} /></Button>
    </div>
    <input ref={input} data-testid={`${id}-file`} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={upload} />
    {busy && <p role="status" data-testid={`${id}-upload-status`} className="text-xs text-muted-foreground">Uploading…</p>}
    {value && <div className="relative aspect-[16/9] max-w-sm overflow-hidden rounded-lg border border-border bg-background">
      <img data-testid={`${id}-preview`} src={value} alt="Selected image" className="h-full w-full object-contain" />
      <Button type="button" size="icon" variant="secondary" className="absolute right-2 top-2" title="Remove image" aria-label="Remove image" data-testid={`${id}-remove`} onClick={() => onChange('')}><X className="h-4 w-4" /></Button>
    </div>}
  </div>;
};