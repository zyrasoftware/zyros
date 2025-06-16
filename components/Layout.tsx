import Head from 'next/head';
import Link from 'next/link';
import { ReactNode, useState, useEffect } from 'react';
import { Menu, X, ArrowUp } from './Icons';
import type { Page } from '../types/site';
import type { SiteData } from '../lib/contentLoader';
import { Theme, getTheme } from '../styles/themes';
import SearchBar from './SearchBar';
import ThemeSwitcher from './ThemeSwitcher';
import QuickThemeToggle from './QuickThemeToggle';
import { analytics } from '../lib/analytics';
import CustomizableHeader from './CustomizableHeader';
import CustomizableFooter from './CustomizableFooter';

interface LayoutProps {
  children: ReactNode;
  siteConfig: SiteData;
  theme: Theme;
  pages: Page[];
  currentPage?: Page;
}

export default function Layout({ 
  children, 
  siteConfig, 
  theme: initialTheme, 
  pages, 
  currentPage 
}: LayoutProps) {
  const [theme, setTheme] = useState(initialTheme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle theme changes
  const handleThemeChange = (themeName: string) => {
    const newTheme = getTheme(themeName);
    setTheme(newTheme);
    
    // Save theme preference and track change
    if (typeof window !== 'undefined') {
      localStorage.setItem('zyros-theme', themeName);
      analytics.trackThemeChange(themeName);
    }
  };

  // Load saved theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('zyros-theme');
      if (savedTheme) {
        const newTheme = getTheme(savedTheme);
        setTheme(newTheme);
      }
    }
  }, []);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      
      setScrollProgress(scrollPercent);
      setShowScrollTop(scrollTop > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pageTitle = currentPage 
    ? `${currentPage.title} | ${siteConfig.site.title}`
    : siteConfig.site.title;
  
  const pageDescription = currentPage?.description || siteConfig.site.description || 
    `${siteConfig.site.title} - A static site built with zyros`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" />


        {/* Open Graph */}
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={siteConfig.site.title} />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content={siteConfig.site.title} />
        {typeof window !== 'undefined' && (
          <link rel="canonical" href={window.location.href} />
        )}
      </Head>

      <div className={`min-h-screen transition-all duration-500 ${theme.background} ${theme.text}`}>
        {/* Use Customizable Header if configured, otherwise fallback to default */}
        {siteConfig.header ? (
          <CustomizableHeader
            config={siteConfig.header}
            theme={theme}
            pages={pages}
            currentPage={currentPage}
            siteTitle={siteConfig.site.title}
            onThemeChange={handleThemeChange}
            scrollProgress={scrollProgress}
          />
        ) : (
          <header className={`sticky top-0 z-50 backdrop-blur-xl border-b ${theme.border} ${theme.card}/95 supports-[backdrop-filter]:bg-background/80 shadow-lg transition-all duration-300`}>
          {/* Navigation Progress Bar */}
          <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300" 
               style={{ width: `${Math.min(100, scrollProgress)}%` }} />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              {/* Enhanced Logo */}
              <Link 
                href="/" 
                className={`text-xl font-bold ${theme.accent} hover:opacity-90 transition-all duration-300 flex items-center space-x-3 group`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 animate-gradient bg-[length:200%_200%]">
                    Z
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-40 blur transition-all duration-300"></div>
                </div>
                <div className="hidden sm:block">
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {siteConfig.site.title}
                  </span>
                  <div className={`text-xs ${theme.secondary} font-medium tracking-wide`}>
                    Static Site Generator
                  </div>
                </div>
              </Link>
              
              {/* Enhanced Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                <Link 
                  href="/" 
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 group ${
                    !currentPage 
                      ? `${theme.accent} bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-md` 
                      : `${theme.link} hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5`
                  }`}
                >
                  <span className="relative z-10">Home</span>
                  {!currentPage && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                  )}
                </Link>
                
                {pages.slice(0, 3).map((page, index) => (
                  <Link 
                    key={page.slug} 
                    href={`/${page.slug}`}
                    className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 group ${
                      currentPage?.slug === page.slug 
                        ? `${theme.accent} bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-md` 
                        : `${theme.link} hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5`
                    }`}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="relative z-10">
                      {page.title.length > 18 ? page.title.substring(0, 18) + '...' : page.title}
                    </span>
                    {currentPage?.slug === page.slug && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
                    )}
                  </Link>
                ))}
                
                <Link 
                  href="/analytics" 
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 group ${theme.link} hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5`}
                >
                  <span className="relative z-10">Analytics</span>
                </Link>
                
                {pages.length > 3 && (
                  <div className="relative group">
                    <button className={`px-4 py-2 rounded-xl text-sm font-semibold ${theme.link} transition-all duration-300 hover:scale-105 hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5 flex items-center space-x-1`}>
                      <span>More</span>
                      <svg className="w-4 h-4 transition-transform duration-300 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <div className={`absolute top-full right-0 mt-3 w-72 ${theme.card} rounded-2xl ${theme.shadow} border ${theme.border} opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 backdrop-blur-xl`}>
                      <div className="p-3">
                        <div className={`text-xs font-semibold ${theme.secondary} uppercase tracking-wider mb-3 px-3`}>
                          More Articles
                        </div>
                        <div className="space-y-1">
                          {pages.slice(3).map((page, index) => (
                            <Link
                              key={page.slug}
                              href={`/${page.slug}`}
                              className={`block px-3 py-3 rounded-xl text-sm ${theme.link} hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5 transition-all duration-200 hover:scale-[1.02] group/item`}
                              style={{ animationDelay: `${index * 50}ms` }}
                            >
                              <div className="font-medium group-hover/item:text-blue-600 transition-colors">
                                {page.title}
                              </div>
                              {page.description && (
                                <div className={`text-xs ${theme.secondary} mt-1 line-clamp-2`}>
                                  {page.description}
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </nav>

              {/* Enhanced Right Side Controls */}
              <div className="flex items-center space-x-3">
                {/* Enhanced Search */}
                <div className="hidden md:block">
                  <div className="relative">
                    <SearchBar pages={pages} theme={theme} />
                  </div>
                </div>
                
                {/* Theme Controls with Better Spacing */}
                <div className="hidden sm:flex items-center space-x-2">
                  <QuickThemeToggle currentTheme={theme} onThemeChange={handleThemeChange} />
                  <ThemeSwitcher currentTheme={theme} onThemeChange={handleThemeChange} />
                </div>
                
                {/* Enhanced Mobile Menu Button */}
                <button 
                  className={`lg:hidden relative p-3 rounded-2xl ${theme.card} ${theme.border} border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg group overflow-hidden`}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle mobile menu"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    {mobileMenuOpen ? (
                      <X className="w-6 h-6 transition-transform duration-300 rotate-90" />
                    ) : (
                      <Menu className="w-6 h-6 transition-transform duration-300 group-hover:scale-110" />
                    )}
                  </div>
                </button>
              </div>
            </div>
          </div>
          
          {/* Enhanced Mobile Navigation Menu */}
          {mobileMenuOpen && (
            <div className={`lg:hidden border-t ${theme.border} ${theme.card}/95 backdrop-blur-xl animate-fade-in-down`}>
              <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
                {/* Mobile Search */}
                <div className="md:hidden mb-6">
                  <SearchBar pages={pages} theme={theme} />
                </div>
                
                {/* Mobile Theme Controls */}
                <div className="sm:hidden flex items-center justify-between mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5">
                  <span className={`text-sm font-medium ${theme.text}`}>Theme</span>
                  <div className="flex items-center space-x-2">
                    <QuickThemeToggle currentTheme={theme} onThemeChange={handleThemeChange} />
                    <ThemeSwitcher currentTheme={theme} onThemeChange={handleThemeChange} />
                  </div>
                </div>
                
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  <Link 
                    href="/" 
                    className={`flex items-center justify-between px-4 py-4 rounded-2xl text-base font-semibold transition-all duration-300 group ${
                      !currentPage 
                        ? `${theme.accent} bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-md` 
                        : `${theme.link} hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5`
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"></div>
                      <span>Home</span>
                    </div>
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  
                  {pages.map((page, index) => (
                    <Link 
                      key={page.slug} 
                      href={`/${page.slug}`}
                      className={`flex items-center justify-between px-4 py-4 rounded-2xl text-base font-semibold transition-all duration-300 group ${
                        currentPage?.slug === page.slug 
                          ? `${theme.accent} bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-md` 
                          : `${theme.link} hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5`
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${currentPage?.slug === page.slug ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-400'}`}></div>
                        <div>
                          <div>{page.title}</div>
                          {page.description && (
                            <div className={`text-xs ${theme.secondary} mt-1 line-clamp-1`}>
                              {page.description}
                            </div>
                          )}
                        </div>
                      </div>
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
                  
                  <Link 
                    href="/analytics" 
                    className={`flex items-center justify-between px-4 py-4 rounded-2xl text-base font-semibold transition-all duration-300 group ${theme.link} hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span>Analytics</span>
                    </div>
                    <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
                
                {/* Mobile Footer Info */}
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      <span>Online</span>
                    </div>
                    <div>•</div>
                    <div>{pages.length} Articles</div>
                    <div>•</div>
                    <div>zyros</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </header>
        )}

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-fade-in">
          {children}
        </main>

        {/* Use Customizable Footer if configured, otherwise fallback to default */}
        {siteConfig.footer ? (
          <CustomizableFooter
            config={siteConfig.footer}
            theme={theme}
            siteTitle={siteConfig.site.title}
            currentYear={new Date().getFullYear()}
          />
        ) : (
          <footer className={`border-t ${theme.border} ${theme.card} mt-20 relative overflow-hidden`}>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center">
                <h3 className={`text-xl font-bold ${theme.accent} mb-4`}>
                  {siteConfig.site.title}
                </h3>
                <p className={`text-sm ${theme.secondary} mb-8`}>
                  {siteConfig.site.description || 'A beautiful static site built with zyros'}
                </p>
                <p className={`text-sm ${theme.secondary}`}>
                  © {new Date().getFullYear()} {siteConfig.site.title}. Built with zyros
                </p>
              </div>
            </div>
          </footer>
        )}

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-30"
            title="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </>
  );
} 