'use client';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { ProjectGrid } from './project-grid';
import { contentFetcher, useServices } from './content-provider';
import { Button } from '@/components/ui/button';

export function WorkClient() {
  const [service, setService] = useState('all');
  const services = useServices();
  useEffect(() => { setService(new URLSearchParams(window.location.search).get('service') || 'all'); }, []);
  const { data, error, mutate } = useSWR(`/api/projects${service === 'all' ? '' : `?service=${encodeURIComponent(service)}`}`, contentFetcher);
  function filter(value) { setService(value); window.history.replaceState(null, '', value === 'all' ? '/work' : `/work?service=${encodeURIComponent(value)}`); }
  return <div className="container mx-auto px-6 pb-12 pt-32 md:pt-40">
    <p className="text-sm font-semibold uppercase text-primary">Our work</p>
    <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold sm:text-5xl lg:text-6xl">Projects we&apos;ve <span className="text-gradient">shipped.</span></h1>
    <p className="mt-5 max-w-2xl text-muted-foreground">From ambitious ideas to real-world results.</p>
    <div className="my-10 max-w-sm"><label htmlFor="work-service" className="mb-2 block text-sm">Service</label><select id="work-service" data-testid="work-service-filter" className="cms-select" value={service} onChange={(e) => filter(e.target.value)}><option value="all">All services</option>{services.map((s) => <option key={s.slug} value={s.slug}>{s.name}</option>)}</select></div>
    {error ? <div role="alert" data-testid="work-error"><p>Projects could not be loaded.</p><Button variant="outline" className="mt-3" data-testid="work-retry" onClick={() => mutate()}>Retry</Button></div> : !data ? <p data-testid="work-loading" role="status">Loading projects…</p> : data.projects.length ? <ProjectGrid projects={data.projects} /> : <p data-testid="work-empty" className="border-y border-border py-12 text-muted-foreground">No projects published for this service yet.</p>}
  </div>;
}
export default WorkClient;