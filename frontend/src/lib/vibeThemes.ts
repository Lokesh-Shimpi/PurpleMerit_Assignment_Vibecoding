export type VibeName = 'minimal' | 'neo-brutal' | 'dark-neon' | 'pastel' | 'luxury' | 'retro';

export interface VibeTheme {
  name: VibeName;
  label: string;
  description: string;
  tokens: Record<string, string>;
}

export const vibeThemes: Record<VibeName, VibeTheme> = {
  minimal: {
    name: 'minimal',
    label: 'Minimal / Editorial',
    description: 'Serif fonts, stark black & white, generous whitespace',
    tokens: {
      '--vibe-bg': '0 0% 98%',
      '--vibe-fg': '0 0% 8%',
      '--vibe-accent': '0 0% 8%',
      '--vibe-accent-fg': '0 0% 98%',
      '--vibe-muted': '0 0% 94%',
      '--vibe-border': '0 0% 88%',
      '--vibe-radius': '0px',
      '--vibe-font-heading': "'Playfair Display', serif",
      '--vibe-font-body': "'Inter', sans-serif",
    },
  },
  'neo-brutal': {
    name: 'neo-brutal',
    label: 'Neo-Brutal',
    description: 'Hard borders, sharp shadows, bold clashing colors',
    tokens: {
      '--vibe-bg': '60 100% 97%',
      '--vibe-fg': '0 0% 0%',
      '--vibe-accent': '350 90% 55%',
      '--vibe-accent-fg': '0 0% 100%',
      '--vibe-muted': '60 50% 90%',
      '--vibe-border': '0 0% 0%',
      '--vibe-radius': '0px',
      '--vibe-font-heading': "'Space Mono', monospace",
      '--vibe-font-body': "'Inter', sans-serif",
    },
  },
  'dark-neon': {
    name: 'dark-neon',
    label: 'Dark / Neon',
    description: 'Deep black/purple, glowing neon accents',
    tokens: {
      '--vibe-bg': '260 30% 6%',
      '--vibe-fg': '0 0% 92%',
      '--vibe-accent': '170 100% 50%',
      '--vibe-accent-fg': '260 30% 6%',
      '--vibe-muted': '260 20% 12%',
      '--vibe-border': '260 20% 18%',
      '--vibe-radius': '0.5rem',
      '--vibe-font-heading': "'Inter', sans-serif",
      '--vibe-font-body': "'Inter', sans-serif",
    },
  },
  pastel: {
    name: 'pastel',
    label: 'Pastel / Soft',
    description: 'Rounded corners, soft pastels, dreamy feel',
    tokens: {
      '--vibe-bg': '270 40% 97%',
      '--vibe-fg': '270 20% 20%',
      '--vibe-accent': '270 60% 65%',
      '--vibe-accent-fg': '0 0% 100%',
      '--vibe-muted': '270 30% 92%',
      '--vibe-border': '270 20% 88%',
      '--vibe-radius': '1rem',
      '--vibe-font-heading': "'Inter', sans-serif",
      '--vibe-font-body': "'Inter', sans-serif",
    },
  },
  luxury: {
    name: 'luxury',
    label: 'Luxury',
    description: 'Gold/champagne accents, elegant thin typography',
    tokens: {
      '--vibe-bg': '30 10% 5%',
      '--vibe-fg': '40 30% 85%',
      '--vibe-accent': '40 70% 55%',
      '--vibe-accent-fg': '30 10% 5%',
      '--vibe-muted': '30 10% 10%',
      '--vibe-border': '30 15% 18%',
      '--vibe-radius': '0.25rem',
      '--vibe-font-heading': "'Cormorant Garamond', serif",
      '--vibe-font-body': "'Inter', sans-serif",
    },
  },
  retro: {
    name: 'retro',
    label: 'Retro / Pixel',
    description: 'Monospace fonts, blocky borders, retro palette',
    tokens: {
      '--vibe-bg': '45 30% 92%',
      '--vibe-fg': '200 30% 15%',
      '--vibe-accent': '15 80% 55%',
      '--vibe-accent-fg': '0 0% 100%',
      '--vibe-muted': '45 20% 85%',
      '--vibe-border': '200 15% 40%',
      '--vibe-radius': '0px',
      '--vibe-font-heading': "'Space Mono', monospace",
      '--vibe-font-body': "'Space Mono', monospace",
    },
  },
};

export function applyVibeTheme(el: HTMLElement, theme: VibeName) {
  const t = vibeThemes[theme];
  Object.entries(t.tokens).forEach(([key, value]) => {
    el.style.setProperty(key, value);
  });
}
