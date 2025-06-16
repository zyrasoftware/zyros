import { useState, useEffect, useRef } from 'react';
import { Search, X, Tag, Calendar, Clock, Filter } from './Icons';
import { analytics } from '../lib/analytics';
import Fuse from 'fuse.js';

interface Page {
  title: string;
  slug: string;
  content: string;
  description?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  readingTime?: number;
}

interface AdvancedSearchProps {
  pages: Page[];
  theme: {
    card: string;
    border: string;
    background: string;
    text: string;
    secondary: string;
    code: string;
    accent: string;
    link: string;
  };
  onClose: () => void;
  isOpen: boolean;
}

export default function AdvancedSearch({ pages, theme, onClose, isOpen }: AdvancedSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Page[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'relevance' | 'date' | 'title'>('relevance');
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const fuse = useRef<Fuse<Page> | null>(null);

  // Initialize Fuse.js
  useEffect(() => {
    fuse.current = new Fuse(pages, {
      keys: [
        { name: 'title', weight: 0.4 },
        { name: 'description', weight: 0.3 },
        { name: 'content', weight: 0.2 },
        { name: 'tags', weight: 0.1 }
      ],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true
    });
  }, [pages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Get unique categories and tags
  const categories = Array.from(new Set(pages.map(p => p.category).filter(Boolean)));
  const allTags = Array.from(new Set(pages.flatMap(p => p.tags || [])));

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    let searchResults: Page[] = [];

    if (fuse.current) {
      const fuseResults = fuse.current.search(query);
      searchResults = fuseResults.map(result => result.item);
    } else {
      // Fallback search
      searchResults = pages.filter(page =>
        page.title.toLowerCase().includes(query.toLowerCase()) ||
        page.content.toLowerCase().includes(query.toLowerCase()) ||
        page.description?.toLowerCase().includes(query.toLowerCase()) ||
        page.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      searchResults = searchResults.filter(page => page.category === selectedCategory);
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      searchResults = searchResults.filter(page =>
        selectedTags.every(tag => page.tags?.includes(tag))
      );
    }

    // Sort results
    switch (sortBy) {
      case 'date':
        searchResults.sort((a, b) => {
          const dateA = new Date(a.publishedAt || '').getTime();
          const dateB = new Date(b.publishedAt || '').getTime();
          return dateB - dateA;
        });
        break;
      case 'title':
        searchResults.sort((a, b) => a.title.localeCompare(b.title));
        break;
      // 'relevance' is already sorted by Fuse.js
    }

    setResults(searchResults);
    
    // Track search
    analytics.trackSearch(query, searchResults.length);
  }, [query, selectedCategory, selectedTags, sortBy, pages]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedTags([]);
    setSortBy('relevance');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedTags.length > 0 || sortBy !== 'relevance';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Search Modal */}
      <div className={`relative w-full max-w-4xl ${theme.card} rounded-3xl shadow-2xl border ${theme.border} overflow-hidden animate-fade-in-up`}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme.secondary}`} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles, topics, or keywords..."
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border ${theme.border} ${theme.background} ${theme.text} text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-4 rounded-2xl transition-all duration-300 ${showFilters ? 'bg-blue-500 text-white' : `${theme.code} ${theme.text}`} hover:scale-105`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className={`p-4 rounded-2xl ${theme.code} ${theme.text} hover:${theme.accent} transition-all duration-300 hover:scale-105`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Stats */}
          {query && (
            <div className={`mt-4 text-sm ${theme.secondary}`}>
              {results.length > 0 ? (
                <>Found {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;</>
              ) : (
                <>No results found for &quot;{query}&quot;</>
              )}
            </div>
          )}
        </div>

        {/* Filters */}
        {showFilters && (
          <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${theme.code}`}>
            <div className="space-y-6">
              {/* Categories */}
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-3`}>
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedCategory === 'all'
                        ? 'bg-blue-500 text-white'
                        : `${theme.card} border ${theme.border} ${theme.text} hover:${theme.accent}`
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category || 'all')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 capitalize ${
                        selectedCategory === category
                          ? 'bg-blue-500 text-white'
                          : `${theme.card} border ${theme.border} ${theme.text} hover:${theme.accent}`
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-3`}>
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => handleTagToggle(tag)}
                      className={`inline-flex items-center px-3 py-1 rounded-lg text-sm transition-all duration-300 ${
                        selectedTags.includes(tag)
                          ? 'bg-blue-500 text-white'
                          : `${theme.card} border ${theme.border} ${theme.text} hover:${theme.accent}`
                      }`}
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className={`block text-sm font-medium ${theme.text} mb-3`}>
                  Sort by
                </label>
                <div className="flex gap-2">
                  {[
                    { value: 'relevance', label: 'Relevance' },
                    { value: 'date', label: 'Date' },
                    { value: 'title', label: 'Title' }
                  ].map(option => (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value as 'relevance' | 'date' | 'title')}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        sortBy === option.value
                          ? 'bg-blue-500 text-white'
                          : `${theme.card} border ${theme.border} ${theme.text} hover:${theme.accent}`
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className={`text-sm ${theme.link} hover:${theme.accent} transition-colors`}
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {query && results.length === 0 ? (
            <div className={`p-8 text-center ${theme.secondary}`}>
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No results found</p>
              <p className="text-sm opacity-75">
                Try adjusting your search terms or filters
              </p>
            </div>
          ) : (
            <div className="p-2">
              {results.map((page, index) => (
                <a
                  key={page.slug}
                  href={`/${page.slug}`}
                  onClick={onClose}
                  className={`block p-4 m-2 rounded-2xl transition-all duration-300 ${theme.code} hover:${theme.accent} hover:scale-102 hover:shadow-lg border ${theme.border}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`font-semibold ${theme.text} line-clamp-1`}>
                      {page.title}
                    </h3>
                    <div className={`text-xs ${theme.secondary} ml-4 flex-shrink-0`}>
                      #{index + 1}
                    </div>
                  </div>
                  
                  {page.description && (
                    <p className={`text-sm ${theme.secondary} line-clamp-2 mb-3`}>
                      {page.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs">
                      {page.category && (
                        <div className={`px-2 py-1 rounded ${theme.card} border ${theme.border} capitalize`}>
                          {page.category}
                        </div>
                      )}
                      {page.publishedAt && (
                        <div className={`flex items-center ${theme.secondary}`}>
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(page.publishedAt).toLocaleDateString()}
                        </div>
                      )}
                      {page.readingTime && (
                        <div className={`flex items-center ${theme.secondary}`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {page.readingTime} min
                        </div>
                      )}
                    </div>
                    
                    {page.tags && page.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        {page.tags.slice(0, 2).map(tag => (
                          <span
                            key={tag}
                            className={`inline-flex items-center px-2 py-1 rounded text-xs ${theme.secondary} opacity-75`}
                          >
                            <Tag className="w-2 h-2 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {page.tags.length > 2 && (
                          <span className={`text-xs ${theme.secondary} opacity-75`}>
                            +{page.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${theme.code}`}>
          <div className="flex items-center justify-between text-xs">
            <div className={`${theme.secondary}`}>
              Press <kbd className={`px-2 py-1 rounded ${theme.card} border ${theme.border} font-mono`}>Esc</kbd> to close
            </div>
            <div className={`${theme.secondary}`}>
              {results.length} of {pages.length} articles
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 