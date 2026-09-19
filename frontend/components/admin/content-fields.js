'use client';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ImageField } from './image-field';
import { RichEditor } from './rich-editor';

export const ContentFields = ({ type, form, setForm, adminKey, onBusy }) => {
  const set = (field, value) => setForm((f) => ({ ...f, [field]: value }));
  const field = (key, label, multiline = false, required = false) => <div key={key} className="min-w-0 space-y-1.5">
    <Label htmlFor={`${type}-${key}`}>{label}{required ? ' *' : ''}</Label>
    {multiline ? <Textarea id={`${type}-${key}`} data-testid={`${type}-${key}`} value={form[key] || ''} onChange={(e) => set(key, e.target.value)} rows={3} required={required} /> : <Input id={`${type}-${key}`} data-testid={`${type}-${key}`} value={form[key] || ''} onChange={(e) => set(key, e.target.value)} required={required} />}
  </div>;
  return <div className="space-y-5">
    {field(type === 'services' ? 'name' : 'title', type === 'services' ? 'Service name' : 'Title', false, true)}
    <div className="space-y-1.5"><Label htmlFor={`${type}-slug`}>URL slug *</Label><Input id={`${type}-slug`} data-testid={`${type}-slug`} value={form.slug || ''} onChange={(e) => set('slug', e.target.value)} required pattern="[a-z0-9]+(-[a-z0-9]+)*" disabled={!!form.id} /></div>
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-1.5"><Label htmlFor={`${type}-pillar`}>Pillar</Label><select id={`${type}-pillar`} data-testid={`${type}-pillar`} value={form.pillar} onChange={(e) => set('pillar', e.target.value)} className="cms-select">{['build', 'brand', 'market', 'automate'].map((p) => <option key={p} value={p}>{p.toUpperCase()}</option>)}</select></div>
      <div className="space-y-1.5"><Label htmlFor={`${type}-status`}>Visibility</Label><select id={`${type}-status`} data-testid={`${type}-status`} value={form.status} onChange={(e) => set('status', e.target.value)} className="cms-select"><option value="draft">Draft</option><option value="published">Published</option></select></div>
    </div>
    {type === 'services' ? <>
      {field('tagline', 'Tagline')}{field('summary', 'Service summary', true)}
      {field('features', 'Included features (one per line)', true)}{field('outcomes', 'Outcomes (one per line)', true)}
      <div className="space-y-1.5"><Label htmlFor="services-icon">Icon</Label><select id="services-icon" data-testid="services-icon" value={form.icon || 'Globe'} onChange={(e) => set('icon', e.target.value)} className="cms-select">{['Globe', 'Smartphone', 'Server', 'Gamepad2', 'BadgeCheck', 'Box', 'PenTool', 'Package', 'Megaphone', 'Search', 'Sparkles', 'Bot', 'MessageCircle', 'MessageSquare', 'PhoneCall', 'Workflow'].map((i) => <option key={i}>{i}</option>)}</select></div>
    </> : <>
      {field('excerpt', 'Excerpt', true)}
      {type === 'posts' ? <div className="grid gap-4 sm:grid-cols-2">{field('author', 'Author')}<div className="space-y-1.5"><Label htmlFor="posts-kind">Type</Label><select id="posts-kind" data-testid="posts-kind" value={form.kind || 'blog'} onChange={(e) => set('kind', e.target.value)} className="cms-select"><option value="blog">Blog</option><option value="news">News</option></select></div></div> : <>
        <div className="grid gap-4 sm:grid-cols-2">{field('client', 'Client')}{field('industry', 'Industry')}</div>
        {field('challenge', 'The challenge', true)}{field('solution', 'The solution', true)}{field('techStack', 'Technology stack (one per line)', true)}
        {field('metrics', 'Results (one per line: Label | Value | Change)', true)}
      </>}
    </>}
    <ImageField id={`${type}-cover`} value={form.image} onChange={(v) => set('image', v)} adminKey={adminKey} onBusy={onBusy} />
    {field('imageAlt', 'Image description (alt text)')}
    {type !== 'services' && <div className="space-y-2"><Label>Content</Label><RichEditor id={type} value={form.body} onChange={(v) => set('body', v)} adminKey={adminKey} onBusy={onBusy} /></div>}
    <fieldset className="space-y-4 border-t border-border pt-5"><legend className="pr-3 font-display text-base font-semibold">Search appearance</legend>{field('seoTitle', 'SEO title')}{field('seoDescription', 'SEO description', true)}{field('keywords', 'Keywords (comma separated)')}</fieldset>
  </div>;
};