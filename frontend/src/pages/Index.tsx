import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Layers, Zap, Palette, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { vibeThemes, VibeName } from '@/lib/vibeThemes';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

function VibeCard({ vibe, index }: { vibe: VibeName; index: number }) {
  const theme = vibeThemes[vibe];
  const bgHsl = theme.tokens['--vibe-bg'];
  const fgHsl = theme.tokens['--vibe-fg'];
  const accentHsl = theme.tokens['--vibe-accent'];
  const radius = theme.tokens['--vibe-radius'];

  return (
    <motion.div
      custom={index + 3}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      whileHover={{ y: -8, transition: { duration: 0.25 } }}
      className="group relative overflow-hidden border border-border"
      style={{ borderRadius: 'var(--radius)' }}
    >
      <div
        className="p-6 h-56 flex flex-col justify-between"
        style={{
          background: `hsl(${bgHsl})`,
          color: `hsl(${fgHsl})`,
          fontFamily: theme.tokens['--vibe-font-heading'],
          borderRadius: radius,
        }}
      >
        <div>
          <div
            className="inline-block px-3 py-1 text-xs font-semibold mb-3"
            style={{
              background: `hsl(${accentHsl})`,
              color: `hsl(${theme.tokens['--vibe-accent-fg']})`,
              borderRadius: radius === '0px' ? '0' : '999px',
            }}
          >
            {theme.label}
          </div>
          <h3 className="text-lg font-bold leading-tight">{theme.label}</h3>
          <p className="text-sm mt-1 opacity-70" style={{ fontFamily: theme.tokens['--vibe-font-body'] }}>
            {theme.description}
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          {[bgHsl, fgHsl, accentHsl].map((c, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border"
              style={{
                background: `hsl(${c})`,
                borderColor: `hsl(${theme.tokens['--vibe-border']})`,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Index() {
  const showcaseVibes: VibeName[] = ['minimal', 'neo-brutal', 'dark-neon', 'pastel', 'luxury', 'retro'];
  const features = [
    { icon: Palette, title: '6 Vibe Presets', desc: 'Choose from curated themes or create your own.' },
    { icon: Layers, title: 'Drag & Drop Builder', desc: 'Reorder sections with an intuitive interface.' },
    { icon: Zap, title: 'Instant Publish', desc: 'Go live with one click. No config needed.' },
    { icon: Globe, title: 'Responsive Preview', desc: 'See your site on desktop, tablet, and mobile.' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative noise-bg overflow-x-hidden">
      {/* Nav */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex items-center justify-between px-6 py-5 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-lg font-bold tracking-tight">VibeKit Studio</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2">
            Log in
          </Link>
          <Link
            to="/signup"
            className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign up
          </Link>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-xs font-medium text-muted-foreground mb-6">
                <Sparkles className="w-3 h-3 text-primary" />
                Now in Beta
              </span>
            </motion.div>
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight"
            >
              Generate a theme.
              <br />
              <span className="bg-gradient-to-r from-primary to-[hsl(var(--gradient-end))] bg-clip-text text-transparent">
                Build a mini-site.
              </span>
              <br />
              Publish it.
            </motion.h1>
            <motion.p custom={2} variants={fadeUp} initial="hidden" animate="visible" className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
              Pick a vibe, customize your sections, and ship a stunning one-page site in minutes — no code required.
            </motion.p>
            <motion.div custom={3} variants={fadeUp} initial="hidden" animate="visible" className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="glow-button inline-flex items-center gap-2 bg-gradient-to-r from-primary to-[hsl(var(--gradient-end))] text-primary-foreground px-6 py-3.5 rounded-xl font-semibold text-sm hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Create your first page
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/app"
                className="inline-flex items-center gap-2 border border-border text-foreground px-6 py-3.5 rounded-xl font-medium text-sm hover:bg-secondary transition-colors"
              >
                Explore demo
              </Link>
            </motion.div>
          </div>

          {/* Right side — Bento preview grid */}
          <motion.div
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="hidden lg:grid grid-cols-2 gap-3"
          >
            {(['minimal', 'neo-brutal', 'dark-neon', 'luxury'] as VibeName[]).map((vibe, i) => {
              const t = vibeThemes[vibe];
              return (
                <motion.div
                  key={vibe}
                  whileHover={{ scale: 1.03 }}
                  className={`p-5 border border-border rounded-xl ${i === 0 ? 'col-span-2 row-span-1' : ''}`}
                  style={{
                    background: `hsl(${t.tokens['--vibe-bg']})`,
                    color: `hsl(${t.tokens['--vibe-fg']})`,
                    fontFamily: t.tokens['--vibe-font-heading'],
                  }}
                >
                  <p className="text-xs opacity-60 mb-1">{t.label}</p>
                  <p className="font-bold text-sm">{i === 0 ? 'Your next site, your vibe.' : t.description}</p>
                  <div
                    className="mt-3 h-2 w-16 rounded-full"
                    style={{ background: `hsl(${t.tokens['--vibe-accent']})` }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-24">
        <motion.h2
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-center mb-12"
        >
          Everything you need to ship fast
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i + 1}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <f.icon className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Theme Showcase */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
        <motion.h2
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-center mb-4"
        >
          6 Vibes, infinite possibilities
        </motion.h2>
        <motion.p
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center text-muted-foreground mb-12 max-w-md mx-auto"
        >
          Choose a design personality and make it yours.
        </motion.p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {showcaseVibes.map((v, i) => (
            <VibeCard key={v} vibe={v} index={i} />
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-32 text-center">
        <motion.div
          variants={fadeUp}
          custom={0}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
            Ready to find your vibe?
          </h2>
          <p className="text-muted-foreground mb-8">
            Start building your mini-site for free. No credit card required.
          </p>
          <Link
            to="/signup"
            className="glow-button inline-flex items-center gap-2 bg-gradient-to-r from-primary to-[hsl(var(--gradient-end))] text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition-transform"
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-border py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>VibeKit Studio</span>
          </div>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>

      {/* Background gradient orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/10 blur-[120px] animate-glow-pulse" />
        <div className="absolute top-1/2 -right-32 w-80 h-80 rounded-full bg-[hsl(var(--gradient-end))]/10 blur-[100px] animate-glow-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
}
