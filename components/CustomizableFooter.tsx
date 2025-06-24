import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowUp, Mail, Phone, MapPin, ExternalLink, Heart, Star, Globe, Users, Zap } from './Icons';
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


  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
  };

  // Get customized colors from config
  const colors = {
    primary: config.customization?.colorScheme?.primary || '#3B82F6',
    secondary: config.customization?.colorScheme?.secondary || '#8B5CF6',
    accent: config.customization?.colorScheme?.accent || '#06B6D4',
    background: config.customization?.colorScheme?.background || '#FFFFFF',
    surface: config.customization?.colorScheme?.surface || '#F9FAFB',
    text: config.customization?.colorScheme?.text || '#1F2937'
  };

  // Get background styles with modern design
  const getBackgroundStyles = () => {
    if (!config.background) {
      return {
        className: 'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700',
        style: {}
      };
    }
    
    switch (config.background.type) {
      case 'solid':
        return {
          className: 'border-t border-white/10',
          style: { 
            backgroundColor: config.background.color || colors.background,
            color: config.background.color === '#000000' || config.background.color?.includes('900') ? 'white' : colors.text
          }
        };
      case 'gradient':
        const gradient = config.background.gradient;
        if (gradient) {
          const direction = gradient.direction === 'vertical' ? 'to bottom' : 
                          gradient.direction === 'diagonal' ? 'to bottom right' : 'to right';
          return {
            className: 'border-t border-white/10',
            style: {
              background: `linear-gradient(${direction}, ${gradient.from}, ${gradient.to})`,
              color: 'white'
            }
          };
        }
        return {
          className: 'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700',
          style: {}
        };
      case 'image':
        return {
          className: 'relative border-t border-white/20',
          style: {
            backgroundImage: `url(${config.background.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }
        };
      default:
        return {
          className: 'bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700',
          style: {}
        };
    }
  };

  // Get spacing classes
  const getSpacingClasses = () => {
    switch (config.spacing) {
      case 'compact': return 'py-12 sm:py-16';
      case 'spacious': return 'py-20 sm:py-32';
      default: return 'py-16 sm:py-24';
    }
  };

  // Get layout classes
  const getLayoutClasses = () => {
    switch (config.layout) {
      case 'centered': return 'text-center max-w-4xl mx-auto';
      case 'split': return 'flex flex-col lg:flex-row lg:justify-between lg:items-start gap-12';
      case 'stacked': return 'space-y-12 sm:space-y-16';
      default: return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12';
    }
  };

  const backgroundStyles = getBackgroundStyles();

  return (
    <footer 
      className={`relative ${backgroundStyles.className} ${getSpacingClasses()} overflow-hidden`}
      style={backgroundStyles.style}
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* Background Overlay for Image */}
      {config.background?.type === 'image' && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${colors.primary}, transparent)`,
            top: '-10%',
            right: '-10%',
            animationDuration: '6s'
          }}
        />
        <div 
          className="absolute w-64 h-64 rounded-full blur-2xl opacity-5 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${colors.secondary}, transparent)`,
            bottom: '-5%',
            left: '-5%',
            animationDelay: '3s',
            animationDuration: '8s'
          }}
        />
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-20 animate-pulse"
            style={{
              backgroundColor: colors.accent,
              left: `${5 + (i * 8)}%`,
              top: `${10 + (i * 7)}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${4 + (i * 0.2)}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Newsletter Section */}
        {(config.newsletter === true || (config.newsletter && typeof config.newsletter === 'object' && config.newsletter.enabled)) && (
          <div className="mb-16 sm:mb-20">
            <Newsletter 
              theme={theme}
              customization={typeof config.newsletter === 'object' ? config.newsletter : undefined}
              siteData={{ site: { customization: { colorScheme: colors } } }}
            />
          </div>
        )}

        {/* Main Footer Content */}
        <div className={getLayoutClasses()}>
          {config.layout === 'columns' && config.columns ? (
            // Column Layout
            <>
              {/* Brand Column */}
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                    }}
                  >
                    {(siteTitle || 'Z').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {siteTitle || 'Zyros SSG'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Static Site Generator
                    </p>
                  </div>
                </div>
                
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-sm">
                  Empowering developers to create beautiful websites with the simplicity of JSON configuration.
                </p>
                
                {/* Social Links */}
                {config.social && config.socialLinks && (
                  <div className="flex items-center space-x-3">
                    {config.socialLinks.slice(0, 6).map((social, index) => (
                      <Link
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative p-3 rounded-2xl bg-white/5 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/30 backdrop-blur-sm hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                        style={{ 
                          '--tw-ring-color': colors.primary + '50',
                          '--tw-ring-offset-color': 'transparent'
                        } as any}
                        aria-label={`Follow us on ${social.platform}`}
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                             style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)` }} />
                        {social.icon ? (
                          <span className="relative text-xl text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300">
                            {social.icon}
                          </span>
                        ) : (
                          <ExternalLink className="relative w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
                        )}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Contact Info */}
                {config.contact && (
                  <div className="space-y-3">
                    {config.contact.email && (
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <a href={`mailto:${config.contact.email}`} className="hover:underline">
                          {config.contact.email}
                        </a>
                      </div>
                    )}
                    {config.contact.phone && (
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <a href={`tel:${config.contact.phone}`} className="hover:underline">
                          {config.contact.phone}
                        </a>
                      </div>
                    )}
                    {config.contact.address && (
                      <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-300">
                        <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span>{config.contact.address}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation Columns */}
              {config.columns.map((column, index) => (
                <div key={index} className="space-y-6">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">
                    {column.title}
                  </h4>
                  <ul className="space-y-3">
                    {column.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <FooterLinkComponent 
                          link={link} 
                          theme={theme}
                          colors={colors}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </>
          ) : config.layout === 'centered' ? (
            // Centered Layout
            <div className="space-y-12">
              {/* Brand Section */}
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div 
                    className="w-20 h-20 rounded-3xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                    }}
                  >
                    {(siteTitle || 'Z').charAt(0).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                    {siteTitle || 'Zyros SSG'}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                    Empowering developers to create beautiful websites with the simplicity of JSON configuration.
                  </p>
                </div>
              </div>

              {/* Links Grid */}
              {config.columns && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                  {config.columns.map((column, columnIndex) => (
                    <div key={columnIndex} className="space-y-4">
                      <h4 className="text-base font-bold text-gray-900 dark:text-white tracking-wide">
                        {column.title}
                      </h4>
                      <ul className="space-y-2">
                        {column.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <FooterLinkComponent 
                              link={link} 
                              theme={theme}
                              colors={colors}
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
                <div className="flex justify-center space-x-4">
                  {config.socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-4 rounded-2xl bg-white/5 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/30 backdrop-blur-sm hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
                      style={{ 
                        '--tw-ring-color': colors.primary + '50',
                        '--tw-ring-offset-color': 'transparent'
                      } as any}
                      aria-label={`Follow us on ${social.platform}`}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                           style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)` }} />
                      {social.icon ? (
                        <span className="relative text-2xl text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300">
                          {social.icon}
                        </span>
                      ) : (
                        <ExternalLink className="relative w-7 h-7 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : config.layout === 'split' ? (
            // Split Layout
            <>
              {/* Left: Brand */}
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                    }}
                  >
                    {(siteTitle || 'Z').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {siteTitle || 'Zyros SSG'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      Static Site Generator
                    </p>
                  </div>
                </div>
                
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-md">
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
                        className="group relative p-3 rounded-2xl bg-white/5 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/30 backdrop-blur-sm hover:scale-110 transition-all duration-300"
                        aria-label={`Follow us on ${social.platform}`}
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                             style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)` }} />
                        {social.icon ? (
                          <span className="relative text-xl text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300">
                            {social.icon}
                          </span>
                        ) : (
                          <ExternalLink className="relative w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Links */}
              {config.columns && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                  {config.columns.map((column, columnIndex) => (
                    <div key={columnIndex} className="space-y-4">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">
                        {column.title}
                      </h4>
                      <ul className="space-y-2">
                        {column.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <FooterLinkComponent 
                              link={link} 
                              theme={theme}
                              colors={colors}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // Stacked Layout
            <div className="space-y-12">
              {/* Brand */}
              <div className="text-center">
                <div className="flex justify-center mb-6">
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                    }}
                  >
                    {(siteTitle || 'Z').charAt(0).toUpperCase()}
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {siteTitle || 'Zyros SSG'}
                </h3>
                <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl mx-auto">
                  Empowering developers to create beautiful websites with the simplicity of JSON configuration.
                </p>
              </div>

              {/* Links */}
              {config.columns && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {config.columns.map((column, columnIndex) => (
                    <div key={columnIndex} className="space-y-4">
                      <h4 className="text-lg font-bold text-gray-900 dark:text-white tracking-wide">
                        {column.title}
                      </h4>
                      <ul className="space-y-2">
                        {column.links.map((link, linkIndex) => (
                          <li key={linkIndex}>
                            <FooterLinkComponent 
                              link={link} 
                              theme={theme}
                              colors={colors}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}

              {/* Social */}
              {config.social && config.socialLinks && (
                <div className="flex justify-center space-x-4">
                  {config.socialLinks.map((social, index) => (
                    <Link
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-3 rounded-2xl bg-white/5 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/30 backdrop-blur-sm hover:scale-110 transition-all duration-300"
                      aria-label={`Follow us on ${social.platform}`}
                    >
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                           style={{ background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)` }} />
                      {social.icon ? (
                        <span className="relative text-xl text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300">
                          {social.icon}
                        </span>
                      ) : (
                        <ExternalLink className="relative w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-gray-200/30 dark:border-gray-700/30">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>© {currentYear} {siteTitle || 'Zyros SSG'}. Made with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>using zyros</span>
            </div>
            
            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>Global</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4" />
                <span>Fast</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>Community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Top Button */}
        {showBackToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 group p-4 rounded-2xl text-white shadow-2xl hover:scale-110 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
              '--tw-ring-color': colors.primary + '50'
            } as any}
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        )}
      </div>
    </footer>
  );
}

// Enhanced Footer Link Component
function FooterLinkComponent({ 
  link, 
  theme,
  colors
}: { 
  link: FooterLink; 
  theme: Theme;
  colors: any;
}) {
  const isExternal = link.url && (link.url.startsWith('http') || link.url.startsWith('mailto:') || link.url.startsWith('tel:'));
  
  const linkContent = (
    <span className="group inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all duration-300 hover:translate-x-1">
      {link.icon && (
        <span className="text-base group-hover:scale-110 transition-transform duration-300">
          {link.icon}
        </span>
      )}
      <span className="relative">
        {link.text || 'Link'}
        <span 
          className="absolute bottom-0 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
          style={{ backgroundColor: colors.primary }}
        />
      </span>
      {isExternal && <ExternalLink className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity duration-300" />}
    </span>
  );

  if (isExternal) {
    return (
      <a
        href={link.url || '#'}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        {linkContent}
      </a>
    );
  }

  return (
    <Link href={link.url || '#'} className="block">
      {linkContent}
    </Link>
  );
} 