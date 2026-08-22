import { CLIENTS } from '@/lib/data';

export function ClientTicker() {
  const row = [...CLIENTS, ...CLIENTS];
  return (
    <div className="mask-fade-x relative w-full overflow-hidden py-2">
      <div className="marquee-track gap-12">
        {row.map((c, i) => (
          <span
            key={i}
            className="font-display whitespace-nowrap text-xl font-semibold text-muted-foreground/70 md:text-2xl"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ClientTicker;
