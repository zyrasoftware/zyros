import { useState, useEffect } from 'react';
import { Theme } from '../styles/themes';
import { List, ChevronRight } from './Icons';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  theme: Theme;
}

export default function TableOfContents({ content, theme }: TableOfContentsProps) {
  const [tocItems, setTocItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      items.push({ id, text, level });
    }

    setTocItems(items);
  }, [content]);

  useEffect(() => {
    const handleScroll = () => {
      const headings = tocItems.map(item => document.getElementById(item.id)).filter(Boolean);
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i];
        if (heading && heading.getBoundingClientRect().top <= 100) {
          setActiveId(heading.id);
          break;
        }
      }
    };

    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener('scroll', throttledScroll);
    
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [tocItems]);

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (tocItems.length === 0) return null;

  return (
    <>
      {/* Mobile TOC Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 lg:hidden p-3 rounded-full ${theme.card} ${theme.border} border shadow-lg hover:shadow-xl transition-all duration-200 z-40`}
        title="Table of Contents"
      >
        <List className="w-5 h-5" />
      </button>

      {/* Desktop TOC */}
      <div className="hidden lg:block fixed left-6 top-1/2 transform -translate-y-1/2 w-64 z-30">
        <div className={`${theme.card} rounded-xl ${theme.border} border shadow-lg p-4 max-h-96 overflow-y-auto`}>
          <h3 className={`font-semibold ${theme.text} mb-3 flex items-center`}>
            <List className="w-4 h-4 mr-2" />
            Table of Contents
          </h3>
          <nav>
            <ul className="space-y-1">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToHeading(item.id)}
                    className={`w-full text-left px-2 py-1 rounded text-sm transition-all duration-200 flex items-center hover:${theme.card} ${
                      activeId === item.id 
                        ? `${theme.accent} font-medium border-l-2 border-blue-500 pl-3` 
                        : theme.secondary
                    }`}
                    style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
                  >
                    {item.level > 1 && (
                      <ChevronRight className="w-3 h-3 mr-1 opacity-50" />
                    )}
                    {item.text}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile TOC Modal */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex items-end">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className={`relative w-full ${theme.card} rounded-t-xl border-t ${theme.border} p-6 max-h-96 overflow-y-auto animate-slide-in-up`}>
            <h3 className={`font-semibold ${theme.text} mb-4 flex items-center`}>
              <List className="w-4 h-4 mr-2" />
              Table of Contents
            </h3>
            <nav>
              <ul className="space-y-2">
                {tocItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => {
                        scrollToHeading(item.id);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                        activeId === item.id 
                          ? `${theme.accent} font-medium ${theme.card}` 
                          : theme.secondary
                      }`}
                      style={{ paddingLeft: `${(item.level - 1) * 16 + 12}px` }}
                    >
                      {item.text}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

// Throttle function
function throttle<T extends (...args: unknown[]) => unknown>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: unknown[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
} 