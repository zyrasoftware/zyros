import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  // Inject design system styles globally
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Get siteData from pageProps (available on all pages)
    const siteData = pageProps.siteData;
    if (!siteData) return;

    const { designSystem, customTheme } = siteData;
    if (!designSystem && !customTheme) return;

    const styleId = 'zyros-design-system-global-styles';
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Generate CSS directly from configuration
    const cssProperties = '';
    const componentStyles = '';
    
    // Check ScrollToTop configuration
    const floatingScrollEnabled = siteData.floatingElements?.scrollToTop?.enabled;
    const uiScrollEnabled = siteData.ui?.scrollToTop?.enabled;
    
    // Determine if ScrollToTop should be shown (same logic as Layout component)
    let shouldShowScrollToTop = false;
    if (siteData.floatingElements?.scrollToTop !== undefined) {
      shouldShowScrollToTop = floatingScrollEnabled === true;
    } else {
      shouldShowScrollToTop = uiScrollEnabled === true;
    }
    
    // Get current card border radius from config
    const cardBorderRadius = designSystem?.components?.card?.base?.styles?.borderRadius || '2rem';
    
    // Get UI configuration
    const uiConfig = siteData.ui || {};
    const heroConfig = uiConfig.hero || {};
    const statsConfig = uiConfig.stats || {};
    const cardsConfig = uiConfig.cards || {};
    const buttonsConfig = uiConfig.buttons || {};
    const navigationConfig = uiConfig.navigation || {};
    const footerConfig = uiConfig.footer || {};
    const analyticsConfig = uiConfig.analytics || {};
    const gradientsConfig = uiConfig.gradients || {};
    const animationsConfig = uiConfig.animations || {};

    styleElement.textContent = `
      /* === ZYROS COMPREHENSIVE UI SYSTEM === */
      ${cssProperties}
      
      ${componentStyles}
      
      /* === COMPREHENSIVE DESIGN SYSTEM STYLES === */
      
      /* Card styles from site.json - Current: ${cardBorderRadius} */
      .zyros-card,
      [class*="card"],
      [class*="Card"],
      .rounded-lg.border {
        border-radius: ${cardBorderRadius} !important;
        background: ${cardsConfig.background || '#ffffff'} !important;
        border: ${cardsConfig.border?.width || '1px'} solid ${cardsConfig.border?.color || '#e2e8f0'} !important;
        box-shadow: ${cardsConfig.shadow || '0 1px 2px 0 rgb(0 0 0 / 0.05)'} !important;
        transition: all ${animationsConfig.durations?.normal || '300ms'} ${animationsConfig.easings?.default || 'cubic-bezier(0.4, 0, 0.2, 1)'} !important;
      }
      
      .zyros-card:hover,
      [class*="card"]:hover,
      [class*="Card"]:hover,
      .rounded-lg.border:hover {
        transform: ${cardsConfig.hover?.transform || 'scale(1.02) translateY(-4px)'} !important;
        box-shadow: ${cardsConfig.hover?.shadow || '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'} !important;
        border-color: ${cardsConfig.hover?.borderColor || '#3b82f6'} !important;
      }
      
      /* === HERO SECTION STYLES (Only apply if enabled) === */
      ${heroConfig.enabled && heroConfig.background?.gradient || heroConfig.background?.color ? `
      .hero-section {
        background: ${heroConfig.background.gradient || heroConfig.background.color} !important;
        position: relative !important;
      }` : ''}
      
      ${heroConfig.enabled && heroConfig.decorations?.colors ? `
      .hero-decoration-1,
      .hero-decoration-2 {
        background: ${heroConfig.decorations.colors[0] || 'rgba(59, 130, 246, 0.1)'} !important;
        animation: ${heroConfig.decorations.animation || 'pulse-slow'} 3s ease-in-out infinite !important;
      }
      
      .hero-decoration-2 {
        background: ${heroConfig.decorations.colors[1] || 'rgba(139, 92, 246, 0.1)'} !important;
      }` : ''}
      
      ${heroConfig.enabled && (heroConfig.title?.fontSize || heroConfig.title?.fontWeight || heroConfig.title?.color) ? `
      .hero-title {
        ${heroConfig.title.fontSize ? `font-size: ${heroConfig.title.fontSize} !important;` : ''}
        ${heroConfig.title.fontWeight ? `font-weight: ${heroConfig.title.fontWeight} !important;` : ''}
        ${heroConfig.title.color ? `color: ${heroConfig.title.color} !important;` : ''}
      }` : ''}
      
      ${heroConfig.enabled && heroConfig.title?.gradient ? `
      .hero-title-gradient {
        background: ${heroConfig.title.gradient} !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        background-size: 300% 100% !important;
        animation: gradient 3s ease infinite !important;
      }` : ''}
      
      ${heroConfig.enabled && (heroConfig.subtitle?.fontSize || heroConfig.subtitle?.color) ? `
      .hero-subtitle {
        ${heroConfig.subtitle.fontSize ? `font-size: ${heroConfig.subtitle.fontSize} !important;` : ''}
        ${heroConfig.subtitle.color ? `color: ${heroConfig.subtitle.color} !important;` : ''}
      }` : ''}
      
      ${heroConfig.enabled && (heroConfig.badge?.backgroundColor || heroConfig.badge?.color || heroConfig.badge?.borderRadius) ? `
      .hero-badge {
        ${heroConfig.badge.backgroundColor ? `background: ${heroConfig.badge.backgroundColor} !important;` : ''}
        ${heroConfig.badge.color ? `color: ${heroConfig.badge.color} !important;` : ''}
        ${heroConfig.badge.borderRadius ? `border-radius: ${heroConfig.badge.borderRadius} !important;` : ''}
        ${heroConfig.badge.color ? `border: 1px solid ${heroConfig.badge.color}20 !important;` : ''}
      }` : ''}
      
      /* === STATS SECTION STYLES (Only apply if enabled) === */
      ${statsConfig.enabled && (statsConfig.background?.gradient || statsConfig.background?.color) ? `
      .stats-section {
        background: ${statsConfig.background.gradient || statsConfig.background.color} !important;
        position: relative !important;
        overflow: hidden !important;
      }
      
      .stats-background {
        background: ${statsConfig.background.gradient || statsConfig.background.color} !important;
      }` : ''}
      
      ${statsConfig.enabled && (statsConfig.numbers?.fontSize || statsConfig.numbers?.fontWeight || statsConfig.numbers?.gradient) ? `
      .stats-number {
        ${statsConfig.numbers.fontSize ? `font-size: ${statsConfig.numbers.fontSize} !important;` : ''}
        ${statsConfig.numbers.fontWeight ? `font-weight: ${statsConfig.numbers.fontWeight} !important;` : ''}
        ${statsConfig.numbers.gradient ? `
        background: ${statsConfig.numbers.gradient} !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        text-shadow: 0 0 30px rgba(59, 130, 246, 0.3) !important;` : ''}
      }` : ''}
      
      ${statsConfig.enabled && (statsConfig.labels?.fontSize || statsConfig.labels?.color) ? `
      .stats-label {
        ${statsConfig.labels.fontSize ? `font-size: ${statsConfig.labels.fontSize} !important;` : ''}
        ${statsConfig.labels.color ? `color: ${statsConfig.labels.color} !important;` : ''}
      }` : ''}
      
      ${statsConfig.enabled && (statsConfig.icons?.backgroundColor || statsConfig.icons?.color) ? `
      .stats-icon {
        ${statsConfig.icons.backgroundColor ? `background: ${statsConfig.icons.backgroundColor} !important;` : ''}
        ${statsConfig.icons.color ? `color: ${statsConfig.icons.color} !important;` : ''}
        border-radius: 1rem !important;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
      }` : ''}
      
      /* === BUTTON STYLES (Only apply if enabled) === */
      ${buttonsConfig.enabled ? `
      .zyros-button-primary,
      button[class*="primary"],
      .bg-primary {
        background: ${buttonsConfig.primary?.background || 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'} !important;
        color: ${buttonsConfig.primary?.color || '#ffffff'} !important;
        border-radius: ${buttonsConfig.primary?.borderRadius || '1rem'} !important;
        padding: ${buttonsConfig.primary?.padding || '1rem 2rem'} !important;
        font-size: ${buttonsConfig.primary?.fontSize || '1.125rem'} !important;
        font-weight: ${buttonsConfig.primary?.fontWeight || '600'} !important;
        transition: all ${animationsConfig.durations?.normal || '300ms'} ${animationsConfig.easings?.default || 'cubic-bezier(0.4, 0, 0.2, 1)'} !important;
        border: none !important;
      }
      
      .zyros-button-primary:hover,
      button[class*="primary"]:hover,
      .bg-primary:hover {
        background: ${buttonsConfig.primary?.hover?.background || 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'} !important;
        transform: ${buttonsConfig.primary?.hover?.transform || 'scale(1.05) translateY(-2px)'} !important;
        box-shadow: ${buttonsConfig.primary?.hover?.shadow || '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'} !important;
      }
      
      .zyros-button-secondary,
      button[class*="secondary"],
      .bg-secondary {
        background: ${buttonsConfig.secondary?.background || 'transparent'} !important;
        color: ${buttonsConfig.secondary?.color || '#3b82f6'} !important;
        border: ${buttonsConfig.secondary?.border || '2px solid #3b82f6'} !important;
        border-radius: ${buttonsConfig.secondary?.borderRadius || '1rem'} !important;
        transition: all ${animationsConfig.durations?.normal || '300ms'} ${animationsConfig.easings?.default || 'cubic-bezier(0.4, 0, 0.2, 1)'} !important;
      }
      
      .zyros-button-secondary:hover,
      button[class*="secondary"]:hover,
      .bg-secondary:hover {
        background: ${buttonsConfig.secondary?.hover?.background || '#3b82f6'} !important;
        transform: ${buttonsConfig.secondary?.hover?.transform || 'scale(1.05)'} !important;
        color: #ffffff !important;
      }` : ''}
      
      /* === NAVIGATION STYLES (Only apply if enabled) === */
      ${navigationConfig.enabled ? `
      .navigation-header {
        background: ${navigationConfig.background?.color || 'rgba(255, 255, 255, 0.95)'} !important;
        backdrop-filter: blur(12px) !important;
      }
      
      .navigation-logo {
        background: ${navigationConfig.logo?.background || 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)'} !important;
        color: ${navigationConfig.logo?.color || '#ffffff'} !important;
        border-radius: ${navigationConfig.logo?.borderRadius || '1rem'} !important;
      }
      
      .navigation-link {
        color: ${navigationConfig.links?.color || '#64748b'} !important;
        border-radius: ${navigationConfig.links?.borderRadius || '0.75rem'} !important;
        transition: all ${animationsConfig.durations?.normal || '300ms'} ${animationsConfig.easings?.default || 'cubic-bezier(0.4, 0, 0.2, 1)'} !important;
      }
      
      .navigation-link:hover {
        background: ${navigationConfig.links?.hoverBackground || 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))'} !important;
      }
      
      .navigation-link.active {
        color: ${navigationConfig.links?.activeColor || '#3b82f6'} !important;
      }` : ''}
      
      /* === ANALYTICS STYLES (Only apply if enabled) === */
      ${analyticsConfig.enabled ? `
      .analytics-card {
        background: ${analyticsConfig.cards?.background || '#ffffff'} !important;
        border: ${analyticsConfig.cards?.border || '1px solid #e2e8f0'} !important;
        border-radius: ${analyticsConfig.cards?.borderRadius || '1rem'} !important;
      }
      
      .analytics-metric-views { color: ${analyticsConfig.metrics?.colors?.views || '#3b82f6'} !important; }
      .analytics-metric-pages { color: ${analyticsConfig.metrics?.colors?.pages || '#10b981'} !important; }
      .analytics-metric-searches { color: ${analyticsConfig.metrics?.colors?.searches || '#8b5cf6'} !important; }
      .analytics-metric-shares { color: ${analyticsConfig.metrics?.colors?.shares || '#f59e0b'} !important; }
      
      .analytics-progress-bg {
        background: ${analyticsConfig.progressBars?.background || '#e5e7eb'} !important;
      }
      
      .analytics-progress-fill {
        background: ${analyticsConfig.progressBars?.foreground || 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'} !important;
      }` : ''}
      
      /* === CARDS STYLES (Only apply if enabled) === */
      ${cardsConfig.enabled ? `
      .zyros-card,
      [class*="card"],
      [class*="Card"],
      .rounded-lg.border {
        background: ${cardsConfig.background || '#ffffff'} !important;
        border: ${cardsConfig.border?.width || '1px'} solid ${cardsConfig.border?.color || '#e2e8f0'} !important;
        border-radius: ${cardsConfig.border?.radius || '1.5rem'} !important;
        box-shadow: ${cardsConfig.shadow || '0 1px 2px 0 rgb(0 0 0 / 0.05)'} !important;
        transition: all ${animationsConfig.durations?.normal || '300ms'} ${animationsConfig.easings?.default || 'cubic-bezier(0.4, 0, 0.2, 1)'} !important;
      }
      
      .zyros-card:hover,
      [class*="card"]:hover,
      [class*="Card"]:hover,
      .rounded-lg.border:hover {
        transform: ${cardsConfig.hover?.transform || 'scale(1.02) translateY(-4px)'} !important;
        box-shadow: ${cardsConfig.hover?.shadow || '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'} !important;
        border-color: ${cardsConfig.hover?.borderColor || '#3b82f6'} !important;
      }` : ''}
      
      /* === FORM STYLES (Only apply if enabled) === */
      ${uiConfig.forms?.enabled ? `
      .form-input,
      input[type="text"],
      input[type="email"],
      input[type="password"],
      textarea,
      select {
        background: ${uiConfig.forms.input?.background || '#ffffff'} !important;
        border: ${uiConfig.forms.input?.border || '2px solid #e2e8f0'} !important;
        border-radius: ${uiConfig.forms.input?.borderRadius || '0.75rem'} !important;
        font-size: ${uiConfig.forms.input?.fontSize || '1rem'} !important;
        padding: ${uiConfig.forms.input?.padding || '0.75rem 1rem'} !important;
        transition: all ${animationsConfig.durations?.normal || '300ms'} !important;
      }
      
      .form-input:focus,
      input[type="text"]:focus,
      input[type="email"]:focus,
      input[type="password"]:focus,
      textarea:focus,
      select:focus {
        border-color: ${uiConfig.forms.input?.focus?.borderColor || '#3b82f6'} !important;
        box-shadow: ${uiConfig.forms.input?.focus?.boxShadow || '0 0 0 3px rgba(59, 130, 246, 0.1)'} !important;
        outline: none !important;
      }
      
      .form-label,
      label {
        font-size: ${uiConfig.forms.label?.fontSize || '0.875rem'} !important;
        font-weight: ${uiConfig.forms.label?.fontWeight || '600'} !important;
        color: ${uiConfig.forms.label?.color || '#374151'} !important;
      }
      
      .form-button {
        background: ${uiConfig.forms.button?.background || 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'} !important;
        color: ${uiConfig.forms.button?.color || '#ffffff'} !important;
        border-radius: ${uiConfig.forms.button?.borderRadius || '0.75rem'} !important;
        padding: ${uiConfig.forms.button?.padding || '0.75rem 1.5rem'} !important;
        font-size: ${uiConfig.forms.button?.fontSize || '1rem'} !important;
        font-weight: ${uiConfig.forms.button?.fontWeight || '600'} !important;
      }
      
      .form-button:hover {
        background: ${uiConfig.forms.button?.hover?.background || 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)'} !important;
        transform: ${uiConfig.forms.button?.hover?.transform || 'scale(1.02)'} !important;
      }` : ''}
      
      /* === NEWSLETTER STYLES (Only apply if enabled) === */
      ${uiConfig.newsletter?.enabled ? `
      .newsletter-section {
        background: ${uiConfig.newsletter.background?.gradient || uiConfig.newsletter.background?.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'} !important;
        border-radius: ${cardsConfig.border?.radius || '1.5rem'} !important;
      }
      
      .newsletter-title {
        font-size: ${uiConfig.newsletter.title?.fontSize || '2.5rem'} !important;
        font-weight: ${uiConfig.newsletter.title?.fontWeight || 'bold'} !important;
        color: ${uiConfig.newsletter.title?.color || '#ffffff'} !important;
      }
      
      .newsletter-subtitle {
        font-size: ${uiConfig.newsletter.subtitle?.fontSize || '1.125rem'} !important;
        color: ${uiConfig.newsletter.subtitle?.color || 'rgba(255, 255, 255, 0.9)'} !important;
      }
      
      .newsletter-input {
        background: ${uiConfig.newsletter.input?.background || 'rgba(255, 255, 255, 0.95)'} !important;
        border-radius: ${uiConfig.newsletter.input?.borderRadius || '1rem'} !important;
        padding: ${uiConfig.newsletter.input?.padding || '1rem 1.5rem'} !important;
        font-size: ${uiConfig.newsletter.input?.fontSize || '1rem'} !important;
      }
      
      .newsletter-button {
        background: ${uiConfig.newsletter.button?.background || 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'} !important;
        color: ${uiConfig.newsletter.button?.color || '#ffffff'} !important;
        border-radius: ${uiConfig.newsletter.button?.borderRadius || '1rem'} !important;
        padding: ${uiConfig.newsletter.button?.padding || '1rem 2rem'} !important;
        font-size: ${uiConfig.newsletter.button?.fontSize || '1rem'} !important;
        font-weight: ${uiConfig.newsletter.button?.fontWeight || '600'} !important;
      }` : ''}
      
      /* === SOCIAL SHARE STYLES (Only apply if enabled) === */
      ${uiConfig.socialShare?.enabled ? `
      .social-share-button {
        background: ${uiConfig.socialShare.button?.background || 'transparent'} !important;
        border: ${uiConfig.socialShare.button?.border || '2px solid #3b82f6'} !important;
        color: ${uiConfig.socialShare.button?.color || '#3b82f6'} !important;
        border-radius: ${uiConfig.socialShare.button?.borderRadius || '1rem'} !important;
        padding: ${uiConfig.socialShare.button?.padding || '0.75rem 1rem'} !important;
        font-size: ${uiConfig.socialShare.button?.fontSize || '0.875rem'} !important;
        transition: all ${animationsConfig.durations?.normal || '300ms'} !important;
      }
      
      .social-share-button:hover {
        background: ${uiConfig.socialShare.button?.hover?.background || '#3b82f6'} !important;
        color: ${uiConfig.socialShare.button?.hover?.color || '#ffffff'} !important;
        transform: ${uiConfig.socialShare.button?.hover?.transform || 'scale(1.05)'} !important;
      }` : ''}
      
      /* === LOADING SPINNER STYLES (Only apply if enabled) === */
      ${uiConfig.loadingSpinner?.enabled ? `
      .loading-spinner,
      [class*="animate-bounce"],
      [class*="animate-pulse"] {
        color: ${uiConfig.loadingSpinner.color || '#3b82f6'} !important;
      }
      
      .loading-spinner > div {
        background: ${uiConfig.loadingSpinner.color || '#3b82f6'} !important;
        width: ${uiConfig.loadingSpinner.size || '2rem'} !important;
        height: ${uiConfig.loadingSpinner.size || '2rem'} !important;
        animation: ${uiConfig.loadingSpinner.animation || 'spin 1s linear infinite'} !important;
      }` : ''}
      
      /* === SEARCH BAR STYLES (Only apply if enabled) === */
      ${uiConfig.searchBar?.enabled ? `
      .search-bar-input {
        background: ${uiConfig.searchBar.background || 'rgba(255, 255, 255, 0.95)'} !important;
        border: ${uiConfig.searchBar.border || '2px solid #e2e8f0'} !important;
        border-radius: ${uiConfig.searchBar.borderRadius || '1rem'} !important;
        padding: ${uiConfig.searchBar.padding || '0.75rem 1rem'} !important;
        font-size: ${uiConfig.searchBar.fontSize || '0.875rem'} !important;
      }
      
      .search-bar-input:focus {
        border-color: ${uiConfig.searchBar.focus?.borderColor || '#3b82f6'} !important;
        box-shadow: ${uiConfig.searchBar.focus?.boxShadow || '0 0 0 3px rgba(59, 130, 246, 0.1)'} !important;
      }
      
      .search-results {
        background: ${uiConfig.searchBar.results?.background || '#ffffff'} !important;
        border: ${uiConfig.searchBar.results?.border || '1px solid #e2e8f0'} !important;
        border-radius: ${uiConfig.searchBar.results?.borderRadius || '1rem'} !important;
        box-shadow: ${uiConfig.searchBar.results?.shadow || '0 10px 15px -3px rgb(0 0 0 / 0.1)'} !important;
      }` : ''}
      
      /* === TABLE OF CONTENTS STYLES (Only apply if enabled) === */
      ${uiConfig.tableOfContents?.enabled ? `
      .table-of-contents {
        background: ${uiConfig.tableOfContents.background || '#ffffff'} !important;
        border: ${uiConfig.tableOfContents.border || '1px solid #e2e8f0'} !important;
        border-radius: ${uiConfig.tableOfContents.borderRadius || '1rem'} !important;
        padding: ${uiConfig.tableOfContents.padding || '1.5rem'} !important;
      }
      
      .table-of-contents-title {
        font-size: ${uiConfig.tableOfContents.title?.fontSize || '1.125rem'} !important;
        font-weight: ${uiConfig.tableOfContents.title?.fontWeight || '600'} !important;
        color: ${uiConfig.tableOfContents.title?.color || '#1f2937'} !important;
      }
      
      .table-of-contents a {
        color: ${uiConfig.tableOfContents.link?.color || '#6b7280'} !important;
        font-size: ${uiConfig.tableOfContents.link?.fontSize || '0.875rem'} !important;
        padding: ${uiConfig.tableOfContents.link?.padding || '0.5rem 0.75rem'} !important;
        border-radius: ${uiConfig.tableOfContents.link?.borderRadius || '0.5rem'} !important;
        transition: all ${animationsConfig.durations?.normal || '300ms'} !important;
      }
      
      .table-of-contents a:hover {
        background: ${uiConfig.tableOfContents.link?.hover?.background || 'rgba(59, 130, 246, 0.05)'} !important;
        color: ${uiConfig.tableOfContents.link?.hover?.color || '#3b82f6'} !important;
      }
      
      .table-of-contents a.active {
        background: ${uiConfig.tableOfContents.link?.active?.background || 'rgba(59, 130, 246, 0.1)'} !important;
        color: ${uiConfig.tableOfContents.link?.active?.color || '#3b82f6'} !important;
      }` : ''}
      
      /* === CONTENT BLOCKS STYLES (Only apply if enabled) === */
      ${uiConfig.contentBlocks?.enabled ? `
      .feature-block {
        background: ${uiConfig.contentBlocks.features?.background || '#ffffff'} !important;
        border: ${uiConfig.contentBlocks.features?.border || '1px solid #e2e8f0'} !important;
        border-radius: ${uiConfig.contentBlocks.features?.borderRadius || '1.5rem'} !important;
        padding: ${uiConfig.contentBlocks.features?.padding || '2rem'} !important;
      }
      
      .feature-title {
        font-size: ${uiConfig.contentBlocks.features?.title?.fontSize || '1.5rem'} !important;
        font-weight: ${uiConfig.contentBlocks.features?.title?.fontWeight || '600'} !important;
        color: ${uiConfig.contentBlocks.features?.title?.color || '#1f2937'} !important;
      }
      
      .feature-description {
        font-size: ${uiConfig.contentBlocks.features?.description?.fontSize || '1rem'} !important;
        color: ${uiConfig.contentBlocks.features?.description?.color || '#6b7280'} !important;
      }
      
      .feature-icon {
        background: ${uiConfig.contentBlocks.features?.icon?.background || 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'} !important;
        color: ${uiConfig.contentBlocks.features?.icon?.color || '#ffffff'} !important;
        border-radius: ${uiConfig.contentBlocks.features?.icon?.borderRadius || '1rem'} !important;
        width: ${uiConfig.contentBlocks.features?.icon?.size || '3rem'} !important;
        height: ${uiConfig.contentBlocks.features?.icon?.size || '3rem'} !important;
      }
      
      .testimonial-block {
        background: ${uiConfig.contentBlocks.testimonials?.background || '#ffffff'} !important;
        border: ${uiConfig.contentBlocks.testimonials?.border || '1px solid #e2e8f0'} !important;
        border-radius: ${uiConfig.contentBlocks.testimonials?.borderRadius || '1.5rem'} !important;
        padding: ${uiConfig.contentBlocks.testimonials?.padding || '2rem'} !important;
      }
      
      .testimonial-quote {
        font-size: ${uiConfig.contentBlocks.testimonials?.quote?.fontSize || '1.125rem'} !important;
        font-style: ${uiConfig.contentBlocks.testimonials?.quote?.fontStyle || 'italic'} !important;
        color: ${uiConfig.contentBlocks.testimonials?.quote?.color || '#374151'} !important;
      }
      
      .testimonial-author {
        font-size: ${uiConfig.contentBlocks.testimonials?.author?.fontSize || '0.875rem'} !important;
        font-weight: ${uiConfig.contentBlocks.testimonials?.author?.fontWeight || '600'} !important;
        color: ${uiConfig.contentBlocks.testimonials?.author?.color || '#6b7280'} !important;
      }
      
      .pricing-block {
        background: ${uiConfig.contentBlocks.pricing?.background || '#ffffff'} !important;
        border: ${uiConfig.contentBlocks.pricing?.border || '1px solid #e2e8f0'} !important;
        border-radius: ${uiConfig.contentBlocks.pricing?.borderRadius || '1.5rem'} !important;
        padding: ${uiConfig.contentBlocks.pricing?.padding || '2rem'} !important;
      }
      
      .pricing-block.popular {
        border: ${uiConfig.contentBlocks.pricing?.popular?.border || '2px solid #3b82f6'} !important;
        background: ${uiConfig.contentBlocks.pricing?.popular?.background || 'rgba(59, 130, 246, 0.02)'} !important;
      }
      
      .pricing-price {
        font-size: ${uiConfig.contentBlocks.pricing?.price?.fontSize || '3rem'} !important;
        font-weight: ${uiConfig.contentBlocks.pricing?.price?.fontWeight || 'bold'} !important;
        color: ${uiConfig.contentBlocks.pricing?.price?.color || '#1f2937'} !important;
      }
      
      .pricing-feature {
        font-size: ${uiConfig.contentBlocks.pricing?.feature?.fontSize || '0.875rem'} !important;
        color: ${uiConfig.contentBlocks.pricing?.feature?.color || '#6b7280'} !important;
      }` : ''}
      
      /* === CUSTOM BUTTON COMPREHENSIVE STYLES === */
      .custom-button-heroReadLatestPost,
      .custom-button-heroExploreFeatures,
      [class*="custom-button-"] {
        color: #000000 !important;
        font-family: ${designSystem?.typography?.fontFamilies?.primary || 'Inter, system-ui, sans-serif'} !important;
        transition: all ${animationsConfig.durations?.normal || '300ms'} ${animationsConfig.easings?.bounce || 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'} !important;
      }
      
      .custom-button-heroReadLatestPost *,
      .custom-button-heroExploreFeatures *,
      [class*="custom-button-"] * {
        color: inherit !important;
      }
      
      /* === COMPREHENSIVE UI ELEMENT STYLES === */
      
      /* Loading Spinners */
      .loading-spinner,
      [class*="animate-bounce"],
      [class*="animate-pulse"] {
        color: ${gradientsConfig.primary || '#3b82f6'} !important;
      }
      
      .loading-spinner > div {
        background: ${gradientsConfig.primary || '#3b82f6'} !important;
      }
      
      /* Social Share Icons */
      .social-share-button {
        background: ${buttonsConfig.secondary?.background || 'transparent'} !important;
        border: 2px solid ${buttonsConfig.secondary?.color || '#3b82f6'} !important;
        color: ${buttonsConfig.secondary?.color || '#3b82f6'} !important;
        border-radius: ${buttonsConfig.secondary?.borderRadius || '1rem'} !important;
        transition: all ${animationsConfig.durations?.normal || '300ms'} !important;
      }
      
      .social-share-button:hover {
        background: ${buttonsConfig.secondary?.hover?.background || '#3b82f6'} !important;
        color: #ffffff !important;
        transform: ${buttonsConfig.secondary?.hover?.transform || 'scale(1.05)'} !important;
      }
      
      /* Form Elements */
      .form-input,
      input[type="text"],
      input[type="email"],
      textarea,
      select {
        border: 2px solid ${cardsConfig.border?.color || '#e2e8f0'} !important;
        border-radius: ${cardsConfig.border?.radius || '0.75rem'} !important;
        background: ${cardsConfig.background || '#ffffff'} !important;
        transition: all ${animationsConfig.durations?.normal || '300ms'} !important;
        font-family: ${designSystem?.typography?.fontFamilies?.primary || 'Inter, system-ui, sans-serif'} !important;
      }
      
      .form-input:focus,
      input[type="text"]:focus,
      input[type="email"]:focus,
      textarea:focus,
      select:focus {
        border-color: ${gradientsConfig.primary || '#3b82f6'} !important;
        box-shadow: 0 0 0 3px ${gradientsConfig.primary || '#3b82f6'}20 !important;
        outline: none !important;
      }
      
      /* Newsletter Component */
      .newsletter-section {
        background: ${heroConfig.background?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'} !important;
        border-radius: ${cardsConfig.border?.radius || '1.5rem'} !important;
      }
      
      /* Table of Contents */
      .table-of-contents {
        background: ${cardsConfig.background || '#ffffff'} !important;
        border: ${cardsConfig.border?.width || '1px'} solid ${cardsConfig.border?.color || '#e2e8f0'} !important;
        border-radius: ${cardsConfig.border?.radius || '1rem'} !important;
        box-shadow: ${cardsConfig.shadow || '0 10px 15px -3px rgb(0 0 0 / 0.1)'} !important;
      }
      
      .table-of-contents a {
        color: ${navigationConfig.links?.color || '#64748b'} !important;
        border-radius: ${navigationConfig.links?.borderRadius || '0.5rem'} !important;
        transition: all ${animationsConfig.durations?.normal || '300ms'} !important;
      }
      
      .table-of-contents a:hover,
      .table-of-contents a.active {
        background: ${navigationConfig.links?.hoverBackground || 'linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.05))'} !important;
        color: ${navigationConfig.links?.activeColor || '#3b82f6'} !important;
      }
      
      /* Page Content Blockquotes */
      blockquote {
        border-left: 4px solid ${gradientsConfig.primary || '#3b82f6'} !important;
        background: ${cardsConfig.background || '#ffffff'} !important;
        border-radius: 0 ${cardsConfig.border?.radius || '0.5rem'} ${cardsConfig.border?.radius || '0.5rem'} 0 !important;
        box-shadow: ${cardsConfig.shadow || '0 4px 6px -1px rgb(0 0 0 / 0.1)'} !important;
      }
      
      /* Code Blocks */
      pre,
      code {
        background: ${cardsConfig.background || '#f8fafc'} !important;
        border: ${cardsConfig.border?.width || '1px'} solid ${cardsConfig.border?.color || '#e2e8f0'} !important;
        border-radius: ${cardsConfig.border?.radius || '0.5rem'} !important;
        font-family: ${designSystem?.typography?.fontFamilies?.mono || 'JetBrains Mono, ui-monospace, monospace'} !important;
      }
      
      /* Global Font Family */
      body, 
      .zyros-text,
      h1, h2, h3, h4, h5, h6,
      p, span, div,
      input, textarea, button,
      [class*="font-"] {
        font-family: Inter, system-ui, -apple-system, sans-serif !important;
      }
      
      /* Global Animation Variables */
      * {
        transition-duration: ${animationsConfig.durations?.normal || '300ms'} !important;
        transition-timing-function: ${animationsConfig.easings?.default || 'cubic-bezier(0.4, 0, 0.2, 1)'} !important;
      }
      
      /* Gradient Animation */
      @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* Reading Progress Bar styles from site.json */
      ${siteData.ui?.readingProgress?.enabled ? `
      .reading-progress-bar {
        height: ${siteData.ui.readingProgress.height || '3px'} !important;
        background: ${siteData.ui.readingProgress.background || '#e2e8f0'} !important;
        position: ${siteData.ui.readingProgress.position || 'top'} !important;
        z-index: ${siteData.ui.readingProgress.zIndex || 50} !important;
      }
      
      .reading-progress-fill {
        background: ${siteData.ui.readingProgress.foreground || 'linear-gradient(90deg, #0ea5e9 0%, #06b6d4 50%, #8b5cf6 100%)'} !important;
      }
      ` : ''}
      
      /* Floating Elements Styles from site.json */
      ${siteData.floatingElements?.aiContentGenerator?.enabled ? `
      button[title*="AI Content"] {
        background: ${siteData.floatingElements.aiContentGenerator.style?.background} !important;
        color: ${siteData.floatingElements.aiContentGenerator.style?.color} !important;
        width: ${siteData.floatingElements.aiContentGenerator.style?.size} !important;
        height: ${siteData.floatingElements.aiContentGenerator.style?.size} !important;
        border-radius: ${siteData.floatingElements.aiContentGenerator.style?.borderRadius} !important;
        box-shadow: ${siteData.floatingElements.aiContentGenerator.style?.shadow} !important;
      }
      ` : ''}
      
      /* Animations from site.json */
      * {
        transition-duration: ${siteData.animations?.durations?.normal || '300ms'} !important;
        transition-timing-function: ${siteData.animations?.easings?.default || 'cubic-bezier(0.4, 0, 0.2, 1)'} !important;
      }
      
      /* Layout container from site.json */
      .container, .max-w-7xl, .max-w-6xl, .max-w-5xl, .max-w-4xl {
        max-width: ${siteData.layout?.container?.maxWidth || '1280px'} !important;
        padding: ${siteData.layout?.container?.padding || '1rem'} !important;
        margin: ${siteData.layout?.container?.margin || '0 auto'} !important;
      }
      
      /* === ENHANCED COMPONENT STYLES === */
      
      /* Newsletter decorations */
      .newsletter-decoration-1,
      .newsletter-decoration-2 {
        background: ${heroConfig.decorations?.colors?.[0] || 'rgba(59, 130, 246, 0.1)'} !important;
        animation: ${heroConfig.decorations?.animation || 'pulse-slow'} 4s ease-in-out infinite !important;
      }
      
      .newsletter-decoration-2 {
        background: ${heroConfig.decorations?.colors?.[1] || 'rgba(139, 92, 246, 0.1)'} !important;
        animation-delay: 2s !important;
      }
      
      /* Enhanced button interactions */
      .zyros-button-primary:active,
      .custom-button-heroReadLatestPost:active,
      .custom-button-heroExploreFeatures:active {
        transform: scale(0.95) !important;
      }
      
      /* Enhanced card interactions */
      .zyros-card:active,
      [class*="card"]:active {
        transform: scale(0.98) translateY(-2px) !important;
      }
      
      /* Progress indicators */
      .progress-bar {
        background: ${analyticsConfig.progressBars?.background || '#e5e7eb'} !important;
        border-radius: 9999px !important;
        overflow: hidden !important;
      }
      
      .progress-fill {
        background: ${analyticsConfig.progressBars?.foreground || 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)'} !important;
        transition: width ${animationsConfig.durations?.normal || '300ms'} ${animationsConfig.easings?.default || 'cubic-bezier(0.4, 0, 0.2, 1)'} !important;
      }
      
      /* Enhanced animations */
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.8; transform: scale(1.05); }
      }
      
      @keyframes bounce-gentle {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes gradient-shift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* Apply animations */
      .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
      .animate-bounce-gentle { animation: bounce-gentle 2s ease-in-out infinite; }
      .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
      .animate-gradient { animation: gradient-shift 3s ease infinite; }
      
      /* Color system variables */
      :root {
        --zyros-primary-500: ${gradientsConfig.primary || '#3b82f6'};
        --zyros-primary-600: #2563eb;
        --zyros-primary-100: #dbeafe;
        --zyros-secondary-500: ${navigationConfig.links?.color || '#64748b'};
        --zyros-accent-500: ${gradientsConfig.accent || '#d946ef'};
        --zyros-hero-gradient: ${heroConfig.background?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'};
        --zyros-stats-gradient: ${statsConfig.background?.gradient || 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%)'};
        --zyros-card-radius: ${cardsConfig.border?.radius || '1.5rem'};
        --zyros-animation-duration: ${animationsConfig.durations?.normal || '300ms'};
        --zyros-animation-easing: ${animationsConfig.easings?.default || 'cubic-bezier(0.4, 0, 0.2, 1)'};
      }
      
      /* FORCE HIDE SCROLL TO TOP WHEN DISABLED */
      ${!shouldShowScrollToTop ? `
      /* Multiple selectors to ensure ScrollToTop button is completely hidden */
      button[title="Scroll to top"],
      [title="Scroll to top"],
      button[data-scroll-to-top="true"],
      [data-scroll-to-top="true"],
      button:has(svg.lucide-arrow-up),
      button:has(.lucide-arrow-up),
      button[style*="position: fixed"][style*="bottom"],
      button[style*="position:fixed"][style*="bottom"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
        transform: scale(0) !important;
        width: 0 !important;
        height: 0 !important;
        overflow: hidden !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }
      
      /* Force hide any button with arrow up icon */
      svg.lucide-arrow-up {
        display: none !important;
      }
      ` : ''}
      
      /* Debug indicator */
      body::before {
      
        position: fixed;
        top: 10px;
        left: 10px;
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 6px 12px;
        border-radius: 8px;
        font-size: 11px;
        z-index: 9999;
        font-family: 'JetBrains Mono', monospace;
        pointer-events: none;
        opacity: 0.9;
        max-width: 600px;
        white-space: nowrap;
        overflow: hidden;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      }
    `;


    
  }, [pageProps.siteData]);

  return <Component {...pageProps} />;
} 