import { useRef, useEffect } from 'react';
import { SectionData } from '@/contexts/PageBuilderContext';
import { VibeName, vibeThemes } from '@/lib/vibeThemes';
import { motion } from 'framer-motion';

function HeroSection({ content = {}, isNeo }: { content: Record<string, any>; isNeo: boolean }) {
  return (
    <section className="py-20 px-6 text-center" style={{ background: 'var(--bg)' }}>
      <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ lineHeight: 1.15 }}>
        {content.title || 'Welcome'}
      </h1>
      <p className="text-lg opacity-70 mb-8 max-w-lg mx-auto">{content.subtitle || 'Your subtitle here.'}</p>
      <button
        className="px-6 py-3 font-semibold text-sm transition-transform hover:scale-105 active:scale-95"
        style={{
          background: 'var(--accent)',
          color: 'var(--accent-fg)',
          borderRadius: 'var(--radius)',
          border: isNeo ? '2px solid var(--fg)' : 'none',
          boxShadow: isNeo ? '4px 4px 0 var(--fg)' : 'none',
        }}
      >
        {content.cta || 'Get Started'}
      </button>
    </section>
  );
}

function FeaturesSection({ content = {}, isNeo }: { content: Record<string, any>; isNeo: boolean }) {
  const items = content.items || [];
  return (
    <section className="py-16 px-6" style={{ background: 'var(--muted-surface)' }}>
      <div 
        className="max-w-4xl mx-auto grid gap-5"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}
      >
        {items.map((item: any, i: number) => (
          <div
            key={i}
            className="p-5 overflow-hidden break-words"
            style={{
              background: 'var(--bg)',
              borderRadius: 'var(--radius)',
              border: isNeo ? '2px solid var(--fg)' : '1px solid var(--border-color)',
              boxShadow: isNeo ? '4px 4px 0 var(--fg)' : 'none',
            }}
          >
            <h3 className="font-bold mb-2 break-words text-[var(--fg)]">{item.title}</h3>
            <p className="text-sm opacity-70 break-words text-[var(--fg)]">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ content = {} }: { content: Record<string, any> }) {
  const images = content.images || [];
  return (
    <section className="py-16 px-6" style={{ background: 'var(--bg)' }}>
      <div 
        className="max-w-4xl mx-auto grid gap-3"
        style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}
      >
        {images.map((src: string, i: number) => (
          <div
            key={i}
            className="overflow-hidden aspect-square"
            style={{ borderRadius: 'var(--radius)' }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactSection({ isNeo }: { isNeo: boolean }) {
  return (
    <section className="py-16 px-6" style={{ background: 'var(--muted-surface)' }}>
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Get in touch</h2>
        <div className="space-y-3">
          {['Name', 'Email', 'Message'].map(label => (
            <div key={label}>
              <label className="text-sm font-medium mb-1 block opacity-70">{label}</label>
              {label === 'Message' ? (
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 text-sm"
                  style={{
                    background: 'var(--bg)',
                    border: isNeo ? '2px solid var(--fg)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--fg)',
                  }}
                  readOnly
                />
              ) : (
                <input
                  className="w-full h-10 px-3 text-sm"
                  style={{
                    background: 'var(--bg)',
                    border: isNeo ? '2px solid var(--fg)' : '1px solid var(--border-color)',
                    borderRadius: 'var(--radius)',
                    color: 'var(--fg)',
                  }}
                  readOnly
                />
              )}
            </div>
          ))}
          <button
            className="w-full py-2.5 text-sm font-semibold mt-2"
            style={{
              background: 'var(--accent)',
              color: 'var(--accent-fg)',
              borderRadius: 'var(--radius)',
              border: isNeo ? '2px solid var(--fg)' : 'none',
              boxShadow: isNeo ? '4px 4px 0 var(--fg)' : 'none',
            }}
          >
            Send Message
          </button>
        </div>
      </div>
    </section>
  );
}

interface Props {
  sections: SectionData[];
  vibe: VibeName;
  className?: string;
}

export default function MiniSitePreview({ sections, vibe, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isNeo = vibe === 'neo-brutal';

  useEffect(() => {
    if (ref.current) {
      const theme = vibeThemes[vibe];
      Object.entries(theme.tokens).forEach(([key, value]) => {
        ref.current!.style.setProperty(key, value);
      });
    }
  }, [vibe]);

  return (
    <div ref={ref} className={`vibe-site min-h-full ${className}`}>
      {sections.filter(s => s.visible).map(section => {
        switch (section.type) {
          case 'hero': return <HeroSection key={section.id} content={section.content} isNeo={isNeo} />;
          case 'features': return <FeaturesSection key={section.id} content={section.content} isNeo={isNeo} />;
          case 'gallery': return <GallerySection key={section.id} content={section.content} />;
          case 'contact': return <ContactSection key={section.id} isNeo={isNeo} />;
          default: return null;
        }
      })}
    </div>
  );
}
