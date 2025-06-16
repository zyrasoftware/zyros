import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ChevronDown, Search } from './Icons';
import type { HeaderConfig, NavigationItem, Page } from '../types/site';
import { Theme } from '../styles/themes';
import SearchBar from './SearchBar';
import ThemeSwitcher from './ThemeSwitcher';

interface CustomizableHeaderProps {
  config: HeaderConfig;
  theme: Theme;
  pages: Page[];
  currentPage?: Page;
  siteTitle: string;
  onThemeChange: (theme: string) => void;
  scrollProgress: number;
}

export default function CustomizableHeader({
  config,
  theme,
  pages,
  currentPage,
  siteTitle,
  onThemeChange,
  scrollProgress
}: CustomizableHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setActiveDropdown(null);
        setSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Get header height class
  const getHeightClass = () => {
    switch (config.height) {
      case 'compact': return 'h-14 sm:h-16';
      case 'tall': return 'h-20 sm:h-24';
      default: return 'h-16 sm:h-20';
    }
  };

  // Get background styles with enhanced glass effect
  const getBackgroundStyles = () => {
    if (!config.background) {
      return `${theme.card}/80 backdrop-blur-xl border-b ${theme.border}/50 ${
        isScrolled ? 'shadow-lg' : 'shadow-sm'
      }`;
    }
    
    switch (config.background.type) {
      case 'solid':
        return `${config.background.color || theme.card} border-b ${theme.border}`;
      case 'gradient':
        const gradient = config.background.gradient;
        if (gradient) {
          const direction = gradient.direction === 'vertical' ? 'to-b' : 
                          gradient.direction === 'diagonal' ? 'to-br' : 'to-r';
          return `bg-gradient-${direction} from-[${gradient.from}] to-[${gradient.to}] border-b ${theme.border}/50`;
        }
        return `${theme.card}/80 backdrop-blur-xl border-b ${theme.border}/50`;
      case 'blur':
        return `${theme.card}/80 backdrop-blur-xl border-b ${theme.border}/50 ${
          isScrolled ? 'shadow-lg' : 'shadow-sm'
        }`;
      default:
        return `${theme.card}/80 backdrop-blur-xl border-b ${theme.border}/50 ${
          isScrolled ? 'shadow-lg' : 'shadow-sm'
        }`;
    }
  };

  // Get layout classes
  const getLayoutClasses = () => {
    switch (config.layout) {
      case 'center': return 'justify-center';
      case 'left': return 'justify-start';
      case 'right': return 'justify-end';
      default: return 'justify-between';
    }
  };

  // Get logo size classes with responsive scaling
  const getLogoSizeClasses = () => {
    switch (config.logo?.size) {
      case 'small': return 'w-8 h-8 sm:w-10 sm:h-10 text-sm sm:text-base';
      case 'large': return 'w-12 h-12 sm:w-16 sm:h-16 text-lg sm:text-xl';
      default: return 'w-10 h-10 sm:w-12 sm:h-12 text-base sm:text-lg';
    }
  };

  // Get CTA button styles with enhanced mobile design
  const getCTAStyles = () => {
    if (!config.cta) return '';
    
    const baseClasses = 'inline-flex items-center font-semibold transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap';
    const sizeClasses = config.cta.size === 'small' ? 'px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm rounded-lg' :
                       config.cta.size === 'large' ? 'px-6 py-3 text-sm sm:px-8 sm:py-4 sm:text-lg rounded-xl' :
                       'px-4 py-2.5 text-sm sm:px-6 sm:py-3 sm:text-base rounded-xl';
    
    switch (config.cta.style) {
      case 'primary':
        return `${baseClasses} ${sizeClasses} bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl focus:ring-blue-500`;
      case 'secondary':
        return `${baseClasses} ${sizeClasses} ${theme.card} border ${theme.border} ${theme.accent} hover:${theme.background} focus:ring-blue-500`;
      case 'outline':
        return `${baseClasses} ${sizeClasses} border-2 border-current ${theme.accent} hover:bg-current hover:text-white focus:ring-blue-500`;
      case 'ghost':
        return `${baseClasses} ${sizeClasses} ${theme.accent} hover:${theme.background} hover:${theme.card} focus:ring-blue-500`;
      case 'gradient':
        return `${baseClasses} ${sizeClasses} bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl focus:ring-blue-500`;
      default:
        return `${baseClasses} ${sizeClasses} bg-blue-600 text-white hover:bg-blue-700 shadow-lg hover:shadow-xl focus:ring-blue-500`;
    }
  };

  return (
    <>
      <header 
        ref={headerRef}
        className={`${config.sticky ? 'sticky top-0' : ''} z-50 ${getBackgroundStyles()} transition-all duration-300 safe-top`}
        role="banner"
      >
        {/* Enhanced Progress Bar */}
        {config.sticky && (
          <div 
            className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 rounded-r-full" 
            style={{ width: `${Math.min(100, scrollProgress)}%` }}
            role="progressbar"
            aria-label="Reading progress"
            aria-valuenow={Math.round(scrollProgress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        )}
        
        <div className="container-fluid">
          <div className={`flex items-center ${getLayoutClasses()} ${getHeightClass()}`}>
            {/* Enhanced Logo Section */}
            <div className={`flex items-center ${config.logo?.position === 'center' ? 'flex-1 justify-center lg:justify-start' : ''}`}>
              <Link 
                href={config.logo?.url || '/'}
                className="flex items-center space-x-2 sm:space-x-3 group transition-all duration-300 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-xl p-1"
                aria-label={`${config.logo?.text || siteTitle} - Go to homepage`}
              >
                {config.logo?.image ? (
                  <div className={`relative ${getLogoSizeClasses()} rounded-xl overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500/20 transition-all duration-300`}>
                    <Image 
                      src={config.logo.image} 
                      alt={config.logo.text || siteTitle}
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
                ) : (
                  <div className={`${getLogoSizeClasses()} rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 animate-gradient bg-[length:200%_200%]`}>
                    {(config.logo?.text || siteTitle).charAt(0).toUpperCase()}
                  </div>
                )}
                
                {config.logo?.text && (
                  <div className="hidden sm:block">
                    <span className={`text-lg sm:text-xl font-bold ${theme.accent} group-hover:text-blue-600 transition-colors duration-300`}>
                      {config.logo.text}
                    </span>
                    <div className={`text-xs ${theme.secondary} font-medium tracking-wide opacity-75`}>
                      Static Site Generator
                    </div>
                  </div>
                )}
              </Link>
            </div>

            {/* Enhanced Desktop Navigation */}
            {config.navigation && config.layout !== 'center' && (
              <nav className="hidden lg:flex items-center space-x-1 flex-1 justify-center" role="navigation" aria-label="Main navigation">
                {config.navigation.map((item, index) => (
                  <NavigationItem 
                    key={`${item.title}-${index}`}
                    item={item}
                    theme={theme}
                    currentPage={currentPage}
                    activeDropdown={activeDropdown}
                    setActiveDropdown={setActiveDropdown}
                    index={index}
                  />
                ))}
              </nav>
            )}

            {/* Enhanced Right Side Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Enhanced Search */}
              {config.search && (
                <div className="relative">
                  <button
                    onClick={() => setSearchOpen(!searchOpen)}
                    className={`lg:hidden p-2 rounded-xl ${theme.accent} hover:${theme.background} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    aria-label="Toggle search"
                    aria-expanded={searchOpen}
                  >
                    <Search className="w-5 h-5" />
                  </button>
                  <div className="hidden lg:block">
                    <SearchBar pages={pages} theme={theme} />
                  </div>
                  
                  {/* Mobile Search Dropdown */}
                  {searchOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] lg:hidden">
                      <div className={`${theme.card} rounded-2xl shadow-xl border ${theme.border} p-4 backdrop-blur-xl`}>
                        <SearchBar pages={pages} theme={theme} />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Enhanced Theme Toggle */}
              {config.themeToggle && (
                <div className="hidden sm:block">
                  <ThemeSwitcher currentTheme={theme} onThemeChange={onThemeChange} />
                </div>
              )}

              {/* Enhanced CTA Button */}
              {config.cta && (
                <Link 
                  href={config.cta.href} 
                  className={getCTAStyles()}
                  aria-label={config.cta.text}
                >
                  {config.cta.icon && <span className="mr-1.5 sm:mr-2">{config.cta.icon}</span>}
                  <span className="hidden sm:inline">{config.cta.text}</span>
                  <span className="sm:hidden">{config.cta.text.split(' ')[0]}</span>
                </Link>
              )}

              {/* Enhanced Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-xl ${theme.accent} hover:${theme.background} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 relative`}
                aria-label="Toggle mobile menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <div className="relative w-6 h-6">
                  <Menu 
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-0 rotate-180 scale-75' : 'opacity-100 rotate-0 scale-100'
                    }`} 
                  />
                  <X 
                    className={`absolute inset-0 w-6 h-6 transition-all duration-300 ${
                      mobileMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-75'
                    }`} 
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Enhanced Mobile Menu */}
      {mobileMenuOpen && (
        <MobileMenu
          config={config}
          theme={theme}
          pages={pages}
          currentPage={currentPage}
          onThemeChange={onThemeChange}
          onClose={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

// Enhanced Navigation Item Component
function NavigationItem({ 
  item, 
  theme, 
  currentPage, 
  activeDropdown, 
  setActiveDropdown,
  index 
}: {
  item: NavigationItem;
  theme: Theme;
  currentPage?: Page;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
  index: number;
}) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isActive = currentPage?.slug === item.href?.replace('/', '') || 
                   (item.href === '/' && !currentPage);
  const hasDropdown = item.children && item.children.length > 0;
  const dropdownId = `dropdown-${index}`;
  const isDropdownOpen = activeDropdown === dropdownId;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDropdownOpen, setActiveDropdown]);

  if (hasDropdown) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setActiveDropdown(isDropdownOpen ? null : dropdownId)}
          className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 group flex items-center space-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            isActive || isDropdownOpen
              ? `${theme.accent} bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-md` 
              : `${theme.link} hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5`
          }`}
          aria-expanded={isDropdownOpen}
          aria-haspopup="true"
          aria-label={`${item.title} menu`}
        >
          <span className="relative z-10">{item.title}</span>
          <ChevronDown 
            className={`w-4 h-4 transition-transform duration-200 ${
              isDropdownOpen ? 'rotate-180' : 'rotate-0'
            }`} 
          />
          {(isActive || isDropdownOpen) && (
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
          )}
        </button>

        {/* Enhanced Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full left-0 mt-2 w-64 z-50 animate-fade-in-down">
            <div className={`${theme.card}/95 backdrop-blur-xl rounded-2xl shadow-xl border ${theme.border} overflow-hidden`}>
              <div className="p-2">
                {item.children?.map((child, childIndex) => (
                  <Link
                    key={childIndex}
                    href={child.href || '#'}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-102 ${theme.link} hover:${theme.background} hover:${theme.accent}`}
                    onClick={() => setActiveDropdown(null)}
                  >
                    <div className="flex items-center space-x-3">
                      {child.icon && <span className="text-lg">{child.icon}</span>}
                                             <div>
                         <div className="font-semibold">{child.title}</div>
                       </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <Link 
      href={item.href || '#'} 
      className={`relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        isActive 
          ? `${theme.accent} bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-md` 
          : `${theme.link} hover:bg-gradient-to-r hover:from-blue-500/5 hover:to-purple-500/5`
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
             <span className="relative z-10">
         {item.title.length > 18 ? item.title.substring(0, 18) + '...' : item.title}
       </span>
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-sm"></div>
      )}
    </Link>
  );
}

// Enhanced Mobile Menu Component
function MobileMenu({
  config,
  theme,
  pages,
  currentPage,
  onThemeChange,
  onClose
}: {
  config: HeaderConfig;
  theme: Theme;
  pages: Page[];
  currentPage?: Page;
  onThemeChange: (theme: string) => void;
  onClose: () => void;
}) {
  return (
    <>
      {/* Enhanced Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Enhanced Mobile Menu Panel */}
      <div 
        id="mobile-menu"
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-gray-200/50 dark:border-gray-700/50 shadow-2xl lg:hidden animate-slide-in-right safe-top safe-bottom"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        <div className="flex flex-col h-full">
          {/* Enhanced Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <h2 className={`text-lg font-bold ${theme.accent}`}>Menu</h2>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl ${theme.accent} hover:${theme.background} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Enhanced Search Section */}
          {config.search && (
            <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <SearchBar pages={pages} theme={theme} />
            </div>
          )}

          {/* Enhanced Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-2" role="navigation" aria-label="Mobile navigation">
            <Link
              href="/"
              onClick={onClose}
              className={`mobile-nav-item block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                !currentPage 
                  ? `${theme.accent} bg-gradient-to-r from-blue-500/10 to-purple-500/10` 
                  : `${theme.link} hover:${theme.background}`
              }`}
              aria-current={!currentPage ? 'page' : undefined}
            >
              Home
            </Link>
            
                         {config.navigation?.map((item, index) => (
               <MobileNavigationItem
                 key={`mobile-${item.title}-${index}`}
                item={item}
                theme={theme}
                currentPage={currentPage}
                onClose={onClose}
              />
            ))}
            
            {pages.slice(0, 5).map((page) => (
              <Link
                key={page.slug}
                href={`/${page.slug}`}
                onClick={onClose}
                className={`mobile-nav-item block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                  currentPage?.slug === page.slug 
                    ? `${theme.accent} bg-gradient-to-r from-blue-500/10 to-purple-500/10` 
                    : `${theme.link} hover:${theme.background}`
                }`}
                aria-current={currentPage?.slug === page.slug ? 'page' : undefined}
              >
                {page.title}
              </Link>
            ))}
          </nav>

          {/* Enhanced Footer */}
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 space-y-4">
            {/* Theme Toggle */}
            {config.themeToggle && (
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${theme.text}`}>Theme</span>
                <ThemeSwitcher currentTheme={theme} onThemeChange={onThemeChange} />
              </div>
            )}
            
            {/* CTA Button */}
            {config.cta && (
              <Link
                href={config.cta.href}
                onClick={onClose}
                className="w-full inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {config.cta.icon && <span className="mr-2">{config.cta.icon}</span>}
                {config.cta.text}
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Enhanced Mobile Navigation Item Component
function MobileNavigationItem({
  item,
  theme,
  currentPage,
  onClose
}: {
  item: NavigationItem;
  theme: Theme;
  currentPage?: Page;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = currentPage?.slug === item.href?.replace('/', '') || 
                   (item.href === '/' && !currentPage);
  const hasChildren = item.children && item.children.length > 0;

  if (hasChildren) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`mobile-nav-item w-full flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
            isActive || isOpen
              ? `${theme.accent} bg-gradient-to-r from-blue-500/10 to-purple-500/10` 
              : `${theme.link} hover:${theme.background}`
          }`}
          aria-expanded={isOpen}
                     aria-label={`${item.title} submenu`}
         >
           <span>{item.title}</span>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`} 
          />
        </button>
        
        {isOpen && (
          <div className="ml-4 space-y-1 animate-fade-in-down">
            {item.children?.map((child, index) => (
              <Link
                key={index}
                href={child.href || '#'}
                onClick={onClose}
                className={`mobile-nav-item block px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${theme.link} hover:${theme.background}`}
              >
                <div className="flex items-center space-x-2">
                  {child.icon && <span className="text-base">{child.icon}</span>}
                                     <div>
                     <div>{child.title}</div>
                   </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      onClick={onClose}
      className={`mobile-nav-item block px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
        isActive 
          ? `${theme.accent} bg-gradient-to-r from-blue-500/10 to-purple-500/10` 
          : `${theme.link} hover:${theme.background}`
      }`}
      aria-current={isActive ? 'page' : undefined}
         >
       {item.title}
     </Link>
  );
} 