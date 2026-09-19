import { ArrowUpRight, Clock, FolderGit2 } from 'lucide-react';

export const ProjectGrid = ({ projects, prefix = 'work' }) => <div className="grid min-w-0 gap-6 md:grid-cols-2 lg:grid-cols-3">
  {projects.map((p) => <article key={p.id} data-testid={`${prefix}-project-${p.id}`} className="group flex min-w-0 flex-col overflow-hidden rounded-lg border border-border bg-card/50 transition-colors hover:border-primary/50">
    {p.image ? <div className="aspect-[16/10] bg-background"><img data-testid={`${prefix}-image-${p.id}`} src={p.image} alt={p.name} loading="lazy" className="h-full w-full object-contain" /></div> : <div className="flex aspect-[16/10] items-center justify-center bg-secondary/50"><FolderGit2 className="h-12 w-12 text-primary/60" /></div>}
    <div className="flex flex-1 flex-col gap-3 p-5 [overflow-wrap:anywhere]">
      {p.category && <p className="text-xs font-medium text-primary">{p.category}</p>}
      <h3 data-testid={`${prefix}-name-${p.id}`} className="font-display text-lg font-semibold">{p.name}</h3>
      {p.client && <p className="text-xs text-muted-foreground">{p.client}</p>}
      {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
      {p.challenges && <div className="border-l-2 border-primary/40 pl-3"><p className="text-xs font-semibold">The challenge</p><p className="mt-1 text-sm text-muted-foreground">{p.challenges}</p></div>}
      {p.tech?.length > 0 && <p className="text-xs text-muted-foreground">{p.tech.join(' · ')}</p>}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
        {p.deliveryTime && <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground"><Clock className="h-3.5 w-3.5" />{p.deliveryTime}</span>}
        {p.url && <a data-testid={`${prefix}-visit-${p.id}`} href={p.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">Visit project <ArrowUpRight className="h-4 w-4" /></a>}
      </div>
    </div>
  </article>)}
</div>;