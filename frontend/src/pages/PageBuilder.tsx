import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowLeft, Monitor, Tablet, Smartphone,
  Eye, EyeOff, GripVertical, ChevronDown, ChevronUp,
  Check, Cloud, Globe, FileText,
} from 'lucide-react';
import { usePageBuilder } from '@/contexts/PageBuilderContext';
import { vibeThemes, VibeName } from '@/lib/vibeThemes';
import MiniSitePreview from '@/components/preview/MiniSitePreview';

const previewWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };

export default function PageBuilder() {
  const {
    currentPage, updateCurrentPage, togglePublish,
    previewMode, setPreviewMode,
  } = usePageBuilder();
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!currentPage) navigate('/app');
  }, [currentPage, navigate]);

  const savePage = async () => {
    if (!currentPage) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`/api/pages/${currentPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          title: currentPage.title,
          theme: currentPage.vibe,
          sections: currentPage.sections
        })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch(e) {
      console.error(e);
    }
  };

  const handlePublishToggle = async () => {
    if (!currentPage) return;
    try {
      const token = localStorage.getItem('token');
      const action = currentPage.status === 'published' ? 'unpublish' : 'publish';
      const res = await fetch(`/api/pages/${currentPage.id}/${action}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) togglePublish(); // update context state
    } catch(e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => savePage(), 8000);
    return () => clearInterval(timer);
  }, [currentPage]);

  if (!currentPage) return null;

  const toggleSectionVisibility = (sectionId: string) => {
    const sections = currentPage.sections.map(s =>
      s.id === sectionId ? { ...s, visible: !s.visible } : s
    );
    updateCurrentPage({ sections });
  };

  const moveSection = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= currentPage.sections.length) return;
    const sections = [...currentPage.sections];
    [sections[index], sections[target]] = [sections[target], sections[index]];
    updateCurrentPage({ sections });
  };

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Bar */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/app')} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <input
              value={currentPage.title}
              onChange={e => updateCurrentPage({ title: e.target.value })}
              className="bg-transparent text-sm font-semibold focus:outline-none border-b border-transparent focus:border-primary transition-colors max-w-[200px]"
            />
          </div>
        </div>

        {/* Preview mode toggle */}
        <div className="hidden sm:flex items-center gap-1 bg-secondary rounded-lg p-1">
          {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([mode, Icon]) => (
            <button
              key={mode}
              onClick={() => setPreviewMode(mode)}
              className={`p-2 rounded-md transition-colors ${previewMode === mode ? 'bg-card text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Auto-save */}
          <AnimatePresence>
            {saved && (
              <motion.span
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <Cloud className="w-3.5 h-3.5" />
                <Check className="w-3 h-3 text-emerald-400" />
                Saved
              </motion.span>
            )}
          </AnimatePresence>

          {/* Save button */}
          <button
            onClick={savePage}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-secondary text-foreground hover:bg-secondary/80 transition-all active:scale-[0.97]"
          >
            <Cloud className="w-3.5 h-3.5" /> Save
          </button>

          {/* Publish toggle */}
          <button
            onClick={handlePublishToggle}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all active:scale-[0.97] ${
              currentPage.status === 'published'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                : 'bg-primary text-primary-foreground'
            }`}
          >
            {currentPage.status === 'published' ? (
              <><Globe className="w-3.5 h-3.5" /> Published</>
            ) : (
              <><FileText className="w-3.5 h-3.5" /> Publish</>
            )}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-border bg-card overflow-y-auto shrink-0 hidden md:block"
            >
              <div className="p-4 space-y-6">
                {/* Vibe selector */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Theme</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(vibeThemes) as VibeName[]).map(v => {
                      const t = vibeThemes[v];
                      const active = currentPage.vibe === v;
                      return (
                        <button
                          key={v}
                          onClick={() => updateCurrentPage({ vibe: v })}
                          className={`p-2.5 rounded-lg text-left transition-all text-xs ${
                            active ? 'ring-2 ring-primary ring-offset-2 ring-offset-card' : 'border border-border hover:border-muted-foreground'
                          }`}
                        >
                          <div className="flex gap-1 mb-1.5">
                            {[t.tokens['--vibe-bg'], t.tokens['--vibe-fg'], t.tokens['--vibe-accent']].map((c, i) => (
                              <div key={i} className="w-3 h-3 rounded-full" style={{ background: `hsl(${c})` }} />
                            ))}
                          </div>
                          <span className="font-medium">{t.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Sections */}
                <div>
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sections</h3>
                  <div className="space-y-1.5">
                    {currentPage.sections.map((section, i) => (
                      <div
                        key={section.id}
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary/50 border border-border"
                      >
                        <GripVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        <span className="text-sm font-medium capitalize flex-1">{section.type}</span>
                        <div className="flex items-center gap-0.5">
                          <button onClick={() => moveSection(i, -1)} className="p-1 rounded hover:bg-secondary" disabled={i === 0}>
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => moveSection(i, 1)} className="p-1 rounded hover:bg-secondary" disabled={i === currentPage.sections.length - 1}>
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => toggleSectionVisibility(section.id)} className="p-1 rounded hover:bg-secondary">
                            {section.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-muted-foreground" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Published link */}
                {currentPage.status === 'published' && (
                  <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-xs text-muted-foreground mb-1">Published at</p>
                    <Link
                      to={`/p/${currentPage.slug}`}
                      className="text-xs text-primary hover:underline break-all"
                    >
                      /p/{currentPage.slug}
                    </Link>
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Sidebar toggle for mobile/collapsed */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden absolute bottom-4 left-4 z-20 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg"
        >
          <Sparkles className="w-4 h-4" />
        </button>

        {/* Preview Area */}
        <main className="flex-1 bg-secondary/30 overflow-auto flex justify-center items-start p-4 sm:p-8">
          <motion.div
            layout
            className="bg-card h-fit rounded-xl border border-border overflow-hidden shadow-lg"
            style={{
              width: previewWidths[previewMode],
              maxWidth: '100%',
              minHeight: 600,
            }}
          >
            <MiniSitePreview
              sections={currentPage.sections}
              vibe={currentPage.vibe}
            />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
