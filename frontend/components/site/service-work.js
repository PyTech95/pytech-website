import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { serviceProjects } from '@/lib/cms';
import { ProjectGrid } from './project-grid';

export const ServiceWork = async ({ service }) => {
  const projects = await serviceProjects(service.slug);
  return <section className="container mx-auto px-6 py-16" data-testid="service-related-work">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
      <div><p className="text-xs font-semibold uppercase text-primary">{service.name}</p><h2 className="mt-2 font-display text-base font-bold md:text-lg">Our Work</h2></div>
      <Link href="/pricing" data-testid="service-pricing-link" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">View pricing <ArrowRight className="h-4 w-4" /></Link>
    </div>
    {projects.length ? <ProjectGrid projects={projects} prefix="service" /> : <p data-testid="service-work-empty" className="border-y border-border py-8 text-sm text-muted-foreground">New {service.name.toLowerCase()} projects will be shared here soon.</p>}
    <Link href={`/work?service=${service.slug}`} data-testid="service-all-work" className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline">Explore our work <ArrowRight className="h-4 w-4" /></Link>
  </section>;
};