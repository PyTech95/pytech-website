'use client';
import { useEffect, useState } from 'react';
import { Plus, Save, Trash2, ExternalLink, X, Pencil, Search } from 'lucide-react';
import { toast } from 'sonner';
import { mutate } from 'swr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ContentFields } from './content-fields';
import { apiUrl } from '@/lib/api-client';

const labels = { posts: 'Blog / News', cases: 'Case Studies', services: 'Services' };
const paths = { posts: 'blog', cases: 'case-studies', services: 'services' };
const blank = () => ({ slug: '', status: 'draft', pillar: 'build', kind: 'blog', author: 'PyTech Digital', features: '', outcomes: '', techStack: '', metrics: '' });
export const ContentManager = ({ type, adminKey }) => {
  const [items, setItems] = useState([]), [form, setForm] = useState(null);
  const [version, setVersion] = useState(0), [busy, setBusy] = useState(false), [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState(''), [status, setStatus] = useState('all'), [error, setError] = useState(''), [loading, setLoading] = useState(true);
  const headers = { 'x-admin-key': adminKey, 'Content-Type': 'application/json' };
  async function load() {
    setLoading(true);
    try { const r = await fetch(apiUrl(`/api/cms/${type}?admin=1`), { headers }); const d = await r.json(); if (!r.ok) throw new Error(d.error); setItems(d.items); setError(''); }
    catch (e) { setError(e.message || 'Could not load content'); } finally { setLoading(false); }
  }
  useEffect(() => { load(); }, [type, adminKey]);
  function edit(item) {
    setError(''); setVersion((v) => v + 1);
    setForm(item ? { ...item, features: (item.features || []).join('\n'), outcomes: type === 'services' ? (item.outcomes || []).join('\n') : item.outcomes, techStack: (item.techStack || []).join('\n'), metrics: type === 'cases' ? (item.outcomes || []).map((o) => `${o.label} | ${o.value} | ${o.delta || ''}`).join('\n') : '' } : blank());
    document.getElementById(`manager-${type}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  async function save(e) {
    e.preventDefault(); setBusy(true); setError('');
    const body = { ...form };
    if (type === 'cases') body.outcomes = (form.metrics || '').split('\n').filter((l) => l.trim()).map((line) => { const [label = '', value = '', delta = ''] = line.split('|').map((s) => s.trim()); return { label, value, delta }; });
    try {
      const r = await fetch(apiUrl(`/api/cms/${type}`), { method: form.id ? 'PUT' : 'POST', headers, body: JSON.stringify(body) }); const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Save failed');
      toast.success(d.item.status === 'published' ? 'Published changes saved' : 'Draft saved'); setForm(null); await load();
      mutate('/api/services'); mutate(`/api/cms/${type}`);
    } catch (e) { setError(e.message); toast.error(e.message); } finally { setBusy(false); }
  }
  async function remove(item) {
    if (!window.confirm(`Delete “${item.name || item.title}”? Its public page will be removed.`)) return;
    setBusy(true);
    try { const r = await fetch(apiUrl(`/api/cms/${type}?id=${encodeURIComponent(item.id)}`), { method: 'DELETE', headers }); const d = await r.json(); if (!r.ok) throw new Error(d.error); if (form?.id === item.id) setForm(null); await load(); mutate('/api/services'); mutate(`/api/cms/${type}`); toast.success('Deleted'); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  }
  const visible = items.filter((item) => (status === 'all' || item.status === status) && `${item.title || item.name} ${item.slug}`.toLowerCase().includes(query.toLowerCase()));
  return <section id={`manager-${type}`} className="min-w-0 scroll-mt-24" data-testid={`${type}-manager`}>
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-display text-lg font-semibold">{labels[type]}</h2><p data-testid={`${type}-counts`} className="text-sm text-muted-foreground">{items.filter((i) => i.status === 'published').length} published · {items.filter((i) => i.status === 'draft').length} drafts</p></div><Button data-testid={`${type}-add`} onClick={() => edit(null)} disabled={busy || uploading}><Plus className="mr-2 h-4 w-4" />Add new</Button></div>
    {error && <p role="alert" data-testid={`${type}-error`} className="mb-4 rounded-lg border border-destructive/40 p-3 text-sm text-destructive">{error}</p>}
    <div className={form ? 'grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]' : ''}>
      {form && <form key={version} onSubmit={save} data-testid={`${type}-form`} className="min-w-0 space-y-6 border-b border-border pb-8 xl:border-b-0 xl:border-r xl:pr-8">
        <div className="flex items-center justify-between"><h3 className="font-display font-semibold">{form.id ? 'Edit' : 'New'} {type === 'services' ? 'service' : type === 'cases' ? 'case study' : 'article'}</h3><Button type="button" variant="ghost" size="icon" data-testid={`${type}-cancel`} aria-label="Close editor" disabled={busy || uploading} onClick={() => setForm(null)}><X className="h-4 w-4" /></Button></div>
        <ContentFields type={type} form={form} setForm={setForm} adminKey={adminKey} onBusy={setUploading} />
        <Button type="submit" data-testid={`${type}-save`} disabled={busy || uploading} className="w-full sm:w-auto"><Save className="mr-2 h-4 w-4" />{busy ? 'Saving…' : form.status === 'published' ? 'Save & publish' : 'Save draft'}</Button>
      </form>}
      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap gap-3"><div className="relative min-w-0 flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input data-testid={`${type}-search`} aria-label={`Search ${labels[type]}`} className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…" /></div><select aria-label="Filter visibility" data-testid={`${type}-filter`} className="cms-select !w-auto" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option><option value="published">Published</option><option value="draft">Drafts</option></select></div>
        {loading && <p data-testid={`${type}-loading`} role="status">Loading…</p>}
        {!loading && !visible.length && <p data-testid={`${type}-empty`} className="py-10 text-sm text-muted-foreground">No content found.</p>}
        <div className="divide-y divide-border">{visible.map((item) => <div key={item.id} data-testid={`${type}-item-${item.slug}`} className="flex min-w-0 flex-wrap items-start justify-between gap-3 py-5">
          <div className="min-w-0 flex-1"><span data-testid={`${type}-status-${item.slug}`} className={`text-xs font-medium ${item.status === 'published' ? 'text-emerald-500' : 'text-amber-500'}`}>{item.status === 'published' ? 'Published' : 'Draft'}</span><h3 className="mt-1 break-words font-display font-semibold">{item.name || item.title}</h3><p className="mt-1 break-all text-xs text-muted-foreground">/{paths[type]}/{item.slug}</p></div>
          <div className="flex shrink-0 gap-1"><Button size="icon" variant="ghost" title="Edit" aria-label="Edit" data-testid={`${type}-edit-${item.slug}`} disabled={busy || uploading} onClick={() => edit(item)}><Pencil className="h-4 w-4" /></Button>{item.status === 'published' && <Button asChild variant="ghost" size="icon"><a data-testid={`${type}-view-${item.slug}`} href={`/${paths[type]}/${item.slug}`} target="_blank" rel="noopener noreferrer" title="View page" aria-label="View page"><ExternalLink className="h-4 w-4" /></a></Button>}<Button size="icon" variant="ghost" className="text-destructive" title="Delete" aria-label="Delete" data-testid={`${type}-delete-${item.slug}`} disabled={busy || uploading} onClick={() => remove(item)}><Trash2 className="h-4 w-4" /></Button></div>
        </div>)}</div>
      </div>
    </div>
  </section>;
};