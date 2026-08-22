import { ImageResponse } from 'next/og';

export const alt = 'PyTech Digital — Build. Brand. Market. Automate.';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: '#05070d',
          backgroundImage: 'radial-gradient(1000px 500px at 80% -10%, rgba(45,212,191,0.35), transparent), radial-gradient(800px 500px at 0% 110%, rgba(59,91,253,0.30), transparent)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ display: 'flex', width: 72, height: 72, borderRadius: 18, alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#2dd4bf,#3b5bfd)', fontSize: 34, fontWeight: 700, color: '#05070d' }}>
            PT
          </div>
          <div style={{ fontSize: 34, fontWeight: 700, letterSpacing: -1 }}>PyTech Digital</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2 }}>
            Build. Brand.
          </div>
          <div style={{ fontSize: 76, fontWeight: 800, lineHeight: 1.05, letterSpacing: -2, backgroundImage: 'linear-gradient(90deg,#2dd4bf,#3b5bfd)', backgroundClip: 'text', color: 'transparent' }}>
            Market. Automate.
          </div>
          <div style={{ marginTop: 24, fontSize: 30, color: '#9fb0c3' }}>
            Full-stack IT, design & AI-first growth studio · Gurugram
          </div>
        </div>

        <div style={{ display: 'flex', gap: 14, fontSize: 22, color: '#c7d2df' }}>
          <span>Web & Apps</span><span>·</span><span>Branding</span><span>·</span><span>SEO & GEO</span><span>·</span><span>Automation</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
