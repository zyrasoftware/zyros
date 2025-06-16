import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUp, Mail, Phone, MapPin, ExternalLink } from './Icons';
import type { FooterConfig, FooterLink } from '../types/site';
import { Theme } from '../styles/themes';
import Newsletter from './Newsletter';

interface CustomizableFooterProps {
  config: FooterConfig;
  theme: Theme;
  siteTitle: string;
  currentYear: number;
}

export default function CustomizableFooter({
  config,
  theme,
  siteTitle,
  currentYear
}: CustomizableFooterProps) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll to top
  React.useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  // Get background styles
  const getBackgroundStyles = () => {
    if (!config.background) {
      return `${theme.card} border-t ${theme.border}`;
    }
    
    switch (config.background.type) {
      case 'solid':
        return `${config.background.color || theme.card} border-t ${theme.border}`;
      case 'gradient':
        const gradient = config.background.gradient;
        if (gradient) {
          const direction = gradient.direction === 'vertical' ? 'to-b' : 
                          gradient.direction === 'diagonal' ? 'to-br' : 'to-r';
          return `bg-gradient-${direction} from-[${gradient.from}] to-[${gradient.to}] border-t ${theme.border}/50`;
        }
        return `${theme.card} border-t ${theme.border}`;
      case 'image':
        return `bg-cover bg-center bg-no-repeat ${theme.card}/90 backdrop-blur-sm border-t ${theme.border}/50`;
      default:
        return `${theme.card} border-t ${theme.border}`;
    }
  };

  // Get spacing classes
  const getSpacingClasses = () => {
    switch (config.spacing) {
      case 'compact': return 'py-8 sm:py-12';
      case 'spacious': return 'py-16 sm:py-24';
      default: return 'py-12 sm:py-16';
    }
  };

  // Get layout classes
  const getLayoutClasses = () => {
    switch (config.layout) {
      case 'centered': return 'text-center';
      case 'split': return 'lg:flex lg:justify-between lg:items-start';
      case 'stacked': return 'space-y-8 sm:space-y-12';
      default: return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12';
    }
  };

  return (
    <footer 
      className={`relative ${getBackgroundStyles()} ${getSpacingClasses()} safe-bottom`}
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Background Image Overlay */}
      {config.background?.type === 'image' && config.background.image && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url(${config.background.image})` }}
          aria-hidden="true"
        />
      )}

      <div className="container-fluid relative z-10">
        {/* Main Footer Content */}
        <div className={getLayoutClasses()}>
          {config.layout === 'columns' && config.columns ? (
            // Column Layout
            <>
              {/* Brand Column */}
              <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg animate-gradient bg-[length:200%_200%]">
                    {(siteTitle || 'Z').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className={`text-lg sm:text-xl font-bold ${theme.accent}`}>
                      {siteTitle || 'Zyros SSG'}
                    </h3>
                    <p className={`text-xs sm:text-sm ${theme.secondary} font-medium tracking-wide`}>
                      Static Site Generator
                    </p>
                  </div>
                </div>
                <p className={`text-sm sm:text-base ${theme.secondary} leading-relaxed max-w-sm`}>
                  Empowering developers to create beautiful websites with the simplicity of JSON configuration.
                </p>
                
                {/* Social Links */}
                {config.social && config.socialLinks && (
                  <div className="flex items-center space-x-3">
                    {config.socialLinks.slice(0, 5).map((social, index) => (
                      <Link
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-2.5 rounded-xl ${theme.card} border ${theme.border} ${theme.accent} hover:${theme.background} hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group`}
                        aria-label={`Follow us on ${social.platform}`}
                      >
                        {social.icon ? (
                          <span className="text-lg group-hover:scale-110 transition-transform duration-200">
                            {social.icon}
                          </span>
                        ) : (
                          <ExternalLink className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Columns */}
              {config.columns.map((column, index) => (
                <div key={index} className="space-y-4 sm:space-y-6">
                  <h4 className={`text-base sm:text-lg font-semibold ${theme.accent} tracking-wide`}>
                    {column.title}
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {column.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <FooterLinkComponent 
                          link={link} 
                          theme={theme} 
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          ) : config.layout === 'centered' ? (
            // Centered Layout
            <div className="max-w-4xl mx-auto space-y-8 sm:space-y-12">
              {/* Brand Section */}
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-xl animate-gradient bg-[length:200%_200%]">
                    {(siteTitle || 'Z').charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h3 className={`text-2xl sm:text-3xl font-bold ${theme.accent} mb-2`}>
                    {siteTitle || 'Zyros SSG'}
                  </h3>
                  <p className={`text-base sm:text-lg ${theme.secondary} leading-relaxed max-w-2xl mx-auto`}>
                    Empowering developers to create beautiful websites with the simplicity of JSON configuration.
                  </p>
                </div>
              </div>

              {/* Links Grid */}
              {config.columns && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
                  {config.columns.map((column, columnIndex) => (
                    <div key={columnIndex} className="space-y-3 sm:space-y-4">
                      <h4 className={`text-sm sm:text-base font-semibold ${theme.accent} tracking-wide`}>
                        {column.title}
                      </h4>
                      <ul className="space-y-2">
                        {column.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <FooterLinkComponent 
                              link={link} 
                              theme={theme} 
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Social Links */}
              {config.social && config.socialLinks && (
                <div className="flex justify-center items-center space-x-4">
                  {config.socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-xl ${theme.card} border ${theme.border} ${theme.accent} hover:${theme.background} hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group`}
                      aria-label={`Follow us on ${social.platform}`}
                    >
                      {social.icon ? (
                        <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                          {social.icon}
                        </span>
                      ) : (
                        <ExternalLink className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : config.layout === 'split' ? (
            // Split Layout
            <>
              <div className="space-y-6 sm:space-y-8">
                {/* Brand Section */}
                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg animate-gradient bg-[length:200%_200%]">
                      {(siteTitle || 'Z').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-bold ${theme.accent}`}>
                        {siteTitle || 'Zyros SSG'}
                      </h3>
                      <p className={`text-sm ${theme.secondary} font-medium tracking-wide`}>
                        Static Site Generator
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm sm:text-base ${theme.secondary} leading-relaxed max-w-md`}>
                    Empowering developers to create beautiful websites with the simplicity of JSON configuration.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span className={theme.secondary}>hello@zyros.dev</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Phone className="w-5 h-5 text-green-500" />
                    <span className={theme.secondary}>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <span className={theme.secondary}>San Francisco, CA</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
                {config.columns?.map((column, index) => (
                  <div key={index} className="space-y-4">
                    <h4 className={`text-base font-semibold ${theme.accent} tracking-wide`}>
                      {column.title}
                    </h4>
                    <ul className="space-y-2">
                      {column.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <FooterLinkComponent 
                            link={link} 
                            theme={theme} 
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </>
          ) : (
            // Stacked Layout (Default)
            <div className="space-y-8 sm:space-y-12">
              {/* Brand Section */}
              <div className="text-center space-y-4 sm:space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl shadow-xl animate-gradient bg-[length:200%_200%]">
                    {(siteTitle || 'Z').charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h3 className={`text-2xl sm:text-3xl font-bold ${theme.accent} mb-2`}>
                    {siteTitle || 'Zyros SSG'}
                  </h3>
                  <p className={`text-base sm:text-lg ${theme.secondary} leading-relaxed max-w-2xl mx-auto`}>
                    Empowering developers to create beautiful websites with the simplicity of JSON configuration.
                  </p>
                </div>
              </div>

              {/* Newsletter Section */}
              {config.newsletter && (
                <div className="max-w-md mx-auto">
                  <Newsletter theme={theme} />
                </div>
              )}

              {/* Links */}
              {config.links && (
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                  {config.links.map((link, index) => (
                    <FooterLinkComponent 
                      key={index}
                      link={link} 
                      theme={theme} 
                    />
                  ))}
                </div>
              )}

              {/* Social Links */}
              {config.social && config.socialLinks && (
                <div className="flex justify-center items-center space-x-4">
                  {config.socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-3 rounded-xl ${theme.card} border ${theme.border} ${theme.accent} hover:${theme.background} hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group`}
                      aria-label={`Follow us on ${social.platform}`}
                    >
                      {social.icon ? (
                        <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                          {social.icon}
                        </span>
                      ) : (
                        <ExternalLink className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Custom Sections */}
        {config.customSections && config.customSections.length > 0 && (
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {config.customSections.map((section) => (
                <div 
                  key={section.id}
                  className={`space-y-3 sm:space-y-4 ${
                    section.position === 'center' ? 'text-center' : 
                    section.position === 'right' ? 'text-right' : 'text-left'
                  }`}
                >
                  {section.title && (
                    <h4 className={`text-base sm:text-lg font-semibold ${theme.accent} tracking-wide`}>
                      {section.title}
                    </h4>
                  )}
                  {section.content && (
                    <div 
                      className={`text-sm sm:text-base ${theme.secondary} leading-relaxed prose prose-sm max-w-none`}
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Section */}
        <div className="mt-12 sm:mt-16 pt-6 sm:pt-8 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm">
              <span className={theme.secondary}>
                {config.copyright || `© ${currentYear} ${siteTitle || 'Zyros SSG'}. All rights reserved.`}
              </span>
            </div>

            {/* Additional Links */}
            <div className="flex items-center space-x-4 sm:space-x-6 text-sm">
              <Link 
                href="/privacy" 
                className={`${theme.link} hover:${theme.accent} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded`}
              >
                Privacy Policy
              </Link>
              <Link 
                href="/terms" 
                className={`${theme.link} hover:${theme.accent} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded`}
              >
                Terms of Service
              </Link>
              <Link 
                href="/cookies" 
                className={`${theme.link} hover:${theme.accent} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded`}
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Back to Top Button */}
      {config.backToTop && showBackToTop && (
        <button
          onClick={scrollToTop}
          className={`fixed bottom-6 right-6 z-50 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group animate-bounce-gentle`}
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-200" />
        </button>
      )}
    </footer>
  );
}

// Enhanced Footer Link Component
function FooterLinkComponent({ 
  link, 
  theme 
}: { 
  link: FooterLink; 
  theme: Theme; 
}) {
  return (
    <Link
      href={link.href}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noopener noreferrer' : undefined}
      className={`inline-flex items-center space-x-1 text-sm sm:text-base ${theme.link} hover:${theme.accent} transition-all duration-200 hover:translate-x-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded group`}
    >
      <span className="group-hover:underline underline-offset-2">
        {link.title}
      </span>
      {link.external && (
        <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 opacity-60 group-hover:opacity-100 transition-opacity duration-200" />
      )}
    </Link>
  );
} 