import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Sparkles, MoreVertical, Copy, Trash2, Globe, FileText, LogOut } from 'lucide-react';
import { usePageBuilder, createNewPage, PageData } from '@/contexts/PageBuilderContext';
import { vibeThemes, VibeName } from '@/lib/vibeThemes';

function PageCard({ page, onDuplicate, onDelete, onClick }: { page: PageData; onDuplicate: () => void; onDelete: () => void; onClick: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = vibeThemes[page.vibe];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="bg-card border border-border rounded-xl cursor-pointer group relative"
      onClick={onClick}
    >
      {/* Mini preview */}
      <div
        className="h-32 p-4 flex items-end rounded-t-xl overflow-hidden"
        style={{
          background: `hsl(${t.tokens['--vibe-bg']})`,
          fontFamily: t.tokens['--vibe-font-heading'],
          color: `hsl(${t.tokens['--vibe-fg']})`,
        }}
      >
        <div>
          <div className="text-xs opacity-50 mb-1">{t.label}</div>
          <div className="text-sm font-bold truncate">{page.title}</div>
        </div>
      </div>

      <div className="p-4 flex items-center justify-between">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm truncate">{page.title}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {new Date(page.updatedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
              page.status === 'published'
                ? 'bg-emerald-500/10 text-emerald-400'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {page.status === 'published' ? <Globe className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
            {page.status === 'published' ? 'Live' : 'Draft'}
          </span>
          <div className="relative">
            <button
              onClick={e => { e.stopPropagation(); setMenuOpen(!menuOpen); }}
              className="p-1.5 rounded-lg hover:bg-secondary transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-muted-foreground" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-card border border-border rounded-lg shadow-xl z-20 py-1">
                <button
                  onClick={e => { e.stopPropagation(); onDuplicate(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-secondary transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
                <div className="h-px bg-border my-1" />
                <button
                  onClick={e => { e.stopPropagation(); onDelete(); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-secondary hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden animate-pulse">
      <div className="h-32 bg-secondary" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-secondary rounded w-2/3" />
        <div className="h-3 bg-secondary rounded w-1/3" />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { pages, setPages, addPage, duplicatePage, setCurrentPage } = usePageBuilder();
  const navigate = useNavigate();
  const [showNew, setShowNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newVibe, setNewVibe] = useState<VibeName>('minimal');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        const res = await fetch('/api/pages', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setPages(data.map((p: any) => ({ 
            ...p, 
            id: p._id, 
            vibe: p.theme,
            sections: p.sections.map((s: any, idx: number) => ({
              ...s,
              id: s.id || `recovered-${p._id}-${idx}`,
              content: s.content || {}
            }))
          })));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchPages();
  }, [navigate, setPages]);

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    const pageObj = createNewPage(newTitle.trim(), newVibe);
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: pageObj.title,
          slug: pageObj.slug,
          theme: pageObj.vibe,
          sections: pageObj.sections
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const newPage = { ...pageObj, id: data._id, status: data.status, vibe: data.theme };
      addPage(newPage);
      setCurrentPage(newPage);
      navigate('/builder');
      setShowNew(false);
      setNewTitle('');
    } catch (e: any) {
      alert(e.message);
    }
  };

  const openPage = (page: PageData) => {
    setCurrentPage(page);
    navigate('/builder');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPages(pages.filter(p => p.id !== id));
      } else {
        const data = await res.json();
        throw new Error(data.error);
      }
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <span className="text-lg font-bold">VibeKit Studio</span>
        </Link>
        <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <LogOut className="w-4 h-4" /> Sign out
        </Link>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Your Pages</h1>
            <p className="text-sm text-muted-foreground mt-1">{pages.length} page{pages.length !== 1 && 's'}</p>
          </div>
          <button
            onClick={() => setShowNew(true)}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all"
          >
            <Plus className="w-4 h-4" /> New Page
          </button>
        </div>

        {/* New page modal */}
        <AnimatePresence>
          {showNew && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowNew(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="w-full max-w-md bg-card border border-border rounded-2xl p-6"
              >
                <h2 className="text-lg font-bold mb-4">Create New Page</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Page Title</label>
                    <input
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      className="w-full h-11 px-3 rounded-lg bg-secondary border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="My Awesome Page"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Vibe</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(Object.keys(vibeThemes) as VibeName[]).map(v => (
                        <button
                          key={v}
                          onClick={() => setNewVibe(v)}
                          className={`p-3 rounded-lg border text-xs font-medium transition-all ${
                            newVibe === v ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-muted-foreground'
                          }`}
                        >
                          {vibeThemes[v].label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setShowNew(false)} className="flex-1 h-11 rounded-lg border border-border text-sm font-medium hover:bg-secondary transition-colors">
                      Cancel
                    </button>
                    <button onClick={handleCreate} className="flex-1 h-11 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 active:scale-[0.97] transition-all">
                      Create
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {pages.map(page => (
                <PageCard
                  key={page.id}
                  page={page}
                  onDuplicate={() => duplicatePage(page.id)}
                  onDelete={() => handleDelete(page.id)}
                  onClick={() => openPage(page)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
