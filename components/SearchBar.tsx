import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X } from './Icons';
import Link from 'next/link';
import { Page } from '../lib/contentLoader';
import { Theme } from '../styles/themes';

interface SearchBarProps {
  pages: Page[];
  theme: Theme;
}

interface SearchResult {
  item: Page;
  score: number;
}

export default function SearchBar({ pages, theme }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Simple search function
  const searchPages = useCallback((searchQuery: string): SearchResult[] => {
    if (searchQuery.length < 2) return [];
    
    const lowercaseQuery = searchQuery.toLowerCase();
    
    return pages
      .map(page => {
        let score = 0;
        const titleMatch = page.title.toLowerCase().includes(lowercaseQuery);
        const descriptionMatch = page.description?.toLowerCase().includes(lowercaseQuery);
        const contentMatch = page.content.toLowerCase().includes(lowercaseQuery);
        
        if (titleMatch) score += 3;
        if (descriptionMatch) score += 2;
        if (contentMatch) score += 1;
        
        return { item: page, score };
      })
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }, [pages]);

  useEffect(() => {
    const searchResults = searchPages(query);
    setResults(searchResults);
  }, [query, pages, searchPages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const highlightMatch = (text: string, searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) return text;

    const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
  };

  return (
    <div ref={searchRef} className="relative ">
      {/* Search Button */}
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 100);
        }}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${theme.card} ${theme.border} border transition-all duration-200 hover:${theme.shadow} group`}
      >
        <Search className="w-4 h-4" />
        <span className={`text-sm ${theme.secondary} group-hover:${theme.text}`}>
          Search articles...
        </span>
        <div className={`hidden sm:flex items-center space-x-1 text-xs ${theme.secondary}`}>
          <kbd className={`px-2 py-1 rounded ${theme.code} border`}>⌘</kbd>
          <kbd className={`px-2 py-1 rounded ${theme.code} border`}>K</kbd>
        </div>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Search Panel */}
          <div className={`relative w-full max-w-2xl ${theme.card} rounded-xl ${theme.shadow} border ${theme.border} overflow-hidden animate-fade-in-down`}>
            {/* Search Input */}
            <div className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <Search className={`w-5 h-5 ${theme.secondary} mr-3`} />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search articles..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`flex-1 bg-transparent ${theme.text} placeholder-gray-400 focus:outline-none text-lg`}
              />
              <button
                onClick={() => {
                  setIsOpen(false);
                  setQuery('');
                }}
                className={`p-1 rounded-md ${theme.secondary} hover:${theme.text} transition-colors`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {query.length < 2 ? (
                <div className={`p-8 text-center ${theme.secondary}`}>
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Type at least 2 characters to search</p>
                  <p className="text-sm mt-2">
                    Use <kbd className={`px-2 py-1 rounded ${theme.code} border text-xs`}>⌘K</kbd> to open search
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className={`p-8 text-center ${theme.secondary}`}>
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <Search className="w-6 h-6 opacity-50" />
                  </div>
                  <p>No articles found for &quot;{query}&quot;</p>
                  <p className="text-sm mt-2">Try different keywords</p>
                </div>
              ) : (
                <div className="py-2">
                  {results.map((result) => (
                    <Link
                      key={result.item.slug}
                      href={`/${result.item.slug}`}
                      onClick={() => {
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className={`block px-4 py-3 hover:${theme.card} transition-colors border-l-4 border-transparent hover:border-blue-500`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-2 h-2 rounded-full ${theme.accent.replace('text-', 'bg-')} mt-2 flex-shrink-0`} />
                        <div className="flex-1 min-w-0">
                          <h3 
                            className={`font-semibold ${theme.text} mb-1`}
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(result.item.title, query)
                            }}
                          />
                          {result.item.description && (
                            <p 
                              className={`text-sm ${theme.secondary} line-clamp-2`}
                              dangerouslySetInnerHTML={{
                                __html: highlightMatch(result.item.description, query)
                              }}
                            />
                          )}
                          <div className="flex items-center mt-2 space-x-2">
                            <span className={`text-xs ${theme.secondary}`}>
                              {Math.ceil(result.item.content.split(' ').length / 200)} min read
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`px-4 py-3 border-t ${theme.border} ${theme.card} flex items-center justify-between text-xs ${theme.secondary}`}>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <kbd className={`px-2 py-1 rounded ${theme.code} border`}>↑</kbd>
                  <kbd className={`px-2 py-1 rounded ${theme.code} border`}>↓</kbd>
                  <span>Navigate</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className={`px-2 py-1 rounded ${theme.code} border`}>Enter</kbd>
                  <span>Select</span>
                </div>
                <div className="flex items-center space-x-1">
                  <kbd className={`px-2 py-1 rounded ${theme.code} border`}>Esc</kbd>
                  <span>Close</span>
                </div>
              </div>
              <div>
                {results.length > 0 && (
                  <span>{results.length} result{results.length !== 1 ? 's' : ''}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 