import React, { createContext, useContext, useState, ReactNode } from 'react';
import { VibeName } from '@/lib/vibeThemes';

export interface SectionData {
  id: string;
  type: 'hero' | 'features' | 'gallery' | 'contact';
  visible: boolean;
  content: Record<string, any>;
}

export interface PageData {
  id: string;
  title: string;
  slug: string;
  vibe: VibeName;
  status: 'draft' | 'published';
  sections: SectionData[];
  updatedAt: string;
}

const defaultSections: SectionData[] = [
  {
    id: 'hero-1',
    type: 'hero',
    visible: true,
    content: {
      title: 'Welcome to our site',
      subtitle: 'A beautifully crafted experience just for you.',
      cta: 'Get Started',
    },
  },
  {
    id: 'features-1',
    type: 'features',
    visible: true,
    content: {
      items: [
        { title: 'Lightning Fast', description: 'Built for speed and performance.' },
        { title: 'Fully Responsive', description: 'Looks great on every device.' },
        { title: 'Customizable', description: 'Tailor everything to your brand.' },
      ],
    },
  },
  {
    id: 'gallery-1',
    type: 'gallery',
    visible: true,
    content: {
      images: [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=400&h=300&fit=crop',
      ],
    },
  },
  {
    id: 'contact-1',
    type: 'contact',
    visible: true,
    content: {},
  },
];

export function createNewPage(title: string, vibe: VibeName = 'minimal'): PageData {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return {
    id: crypto.randomUUID(),
    title,
    slug,
    vibe,
    status: 'draft',
    sections: JSON.parse(JSON.stringify(defaultSections)),
    updatedAt: new Date().toISOString(),
  };
}

interface PageBuilderContextType {
  pages: PageData[];
  setPages: React.Dispatch<React.SetStateAction<PageData[]>>;
  currentPage: PageData | null;
  setCurrentPage: (page: PageData | null) => void;
  updateCurrentPage: (updates: Partial<PageData>) => void;
  updateSection: (sectionId: string, content: Record<string, any>) => void;
  addPage: (page: PageData) => void;
  duplicatePage: (pageId: string) => void;
  togglePublish: () => void;
  previewMode: 'desktop' | 'tablet' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
}

const PageBuilderContext = createContext<PageBuilderContextType | null>(null);

const samplePages: PageData[] = [
  { ...createNewPage('My Portfolio', 'minimal'), status: 'published' },
  { ...createNewPage('Product Launch', 'dark-neon'), status: 'draft' },
  { ...createNewPage('Agency Site', 'neo-brutal'), status: 'published' },
];

export function PageBuilderProvider({ children }: { children: ReactNode }) {
  const [pages, setPages] = useState<PageData[]>(samplePages);
  const [currentPage, setCurrentPage] = useState<PageData | null>(null);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const updateCurrentPage = (updates: Partial<PageData>) => {
    if (!currentPage) return;
    const updated = { ...currentPage, ...updates, updatedAt: new Date().toISOString() };
    setCurrentPage(updated);
    setPages(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const updateSection = (sectionId: string, content: Record<string, any>) => {
    if (!currentPage) return;
    const sections = currentPage.sections.map(s =>
      s.id === sectionId ? { ...s, content: { ...s.content, ...content } } : s
    );
    updateCurrentPage({ sections });
  };

  const addPage = (page: PageData) => {
    setPages(prev => [page, ...prev]);
  };

  const duplicatePage = (pageId: string) => {
    const original = pages.find(p => p.id === pageId);
    if (!original) return;
    const dup = {
      ...JSON.parse(JSON.stringify(original)),
      id: crypto.randomUUID(),
      title: `${original.title} (Copy)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      status: 'draft' as const,
      updatedAt: new Date().toISOString(),
    };
    setPages(prev => [dup, ...prev]);
  };

  const togglePublish = () => {
    if (!currentPage) return;
    updateCurrentPage({ status: currentPage.status === 'published' ? 'draft' : 'published' });
  };

  const reorderSections = (fromIndex: number, toIndex: number) => {
    if (!currentPage) return;
    const sections = [...currentPage.sections];
    const [moved] = sections.splice(fromIndex, 1);
    sections.splice(toIndex, 0, moved);
    updateCurrentPage({ sections });
  };

  return (
    <PageBuilderContext.Provider
      value={{
        pages, setPages, currentPage, setCurrentPage, updateCurrentPage, updateSection,
        addPage, duplicatePage, togglePublish, previewMode, setPreviewMode, reorderSections,
      }}
    >
      {children}
    </PageBuilderContext.Provider>
  );
}

export function usePageBuilder() {
  const ctx = useContext(PageBuilderContext);
  if (!ctx) throw new Error('usePageBuilder must be inside PageBuilderProvider');
  return ctx;
}
