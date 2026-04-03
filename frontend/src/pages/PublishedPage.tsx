import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MiniSitePreview from '@/components/preview/MiniSitePreview';
import { PageData } from '@/contexts/PageBuilderContext';

export default function PublishedPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const res = await fetch(`/api/public/pages/${slug}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setPage({ ...data, vibe: data.theme });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (slug) fetchPage();
  }, [slug]);

  if (loading) return null;

  if (!page) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-muted-foreground mb-4">Page not found or not published</p>
          <Link to="/" className="text-primary hover:underline text-sm">← Back to VibeKit</Link>
        </div>
      </div>
    );
  }

  return (
    <MiniSitePreview
      sections={page.sections}
      vibe={page.vibe}
      className="min-h-screen"
    />
  );
}
