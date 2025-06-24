import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Zap, FileText, Palette, Search, Clock, ExternalLink, Tag, Calendar, 
         Code, Users, Briefcase, Monitor, Globe, Award, Target, TrendingUp, Star } from '../components/Icons';
import Layout from '../components/Layout';
import Newsletter from '../components/Newsletter';
import CustomButton from '../components/CustomButton';
import { loadSiteData, SiteData } from '../lib/contentLoader';
import { getTheme } from '../styles/themes';

interface HomeProps {
  siteData: SiteData;
}

// Template-specific components with BEAUTIFUL, MODERN designs and FULL mobile responsiveness
function PortfolioHome({ siteData, theme }: { siteData: SiteData, theme: any }) {
  const customization = siteData.site.customization || {};
  
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Modern Fullscreen Hero with Customizable Background */}
      <section className="min-h-screen flex items-center justify-center relative">
        {/* Dynamic Background Based on Customization */}
        <div 
          className="absolute inset-0"
          style={{
            background: customization.hero?.backgroundType === 'gradient' 
              ? `linear-gradient(135deg, ${customization.colorScheme?.primary || '#8B5CF6'}, ${customization.colorScheme?.secondary || '#EC4899'}, ${customization.colorScheme?.accent || '#06B6D4'})`
              : customization.hero?.backgroundUrl 
                ? `url(${customization.hero.backgroundUrl})`
                : 'linear-gradient(135deg, #8B5CF6, #EC4899, #06B6D4)'
          }}
        >
          <div 
            className="absolute inset-0 bg-black"
            style={{ opacity: customization.hero?.overlayOpacity || 0.4 }}
          ></div>
          {/* Modern Animated Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>
        
        {/* Mobile-First Content Layout */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left: Personal Branding */}
            <div className="text-white space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="space-y-4 lg:space-y-6">
                {/* Status Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                  Available for Projects
                </div>
                
                {/* Dynamic Name from Site Data */}
                <h1 className="text-4xl sm:text-5xl lg:text-7xl xl:text-8xl font-black leading-tight">
                  <span className="block">{siteData.site.author?.split(' ')[0] || 'Creative'}</span>
                  <span 
                    className="block bg-gradient-to-r bg-clip-text text-transparent"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${customization.colorScheme?.accent || '#06B6D4'}, white, ${customization.colorScheme?.primary || '#8B5CF6'})`
                    }}
                  >
                    {siteData.site.author?.split(' ')[1] || 'Developer'}
                  </span>
                </h1>
                
                {/* Dynamic Description */}
                <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-2xl leading-relaxed">
                  {siteData.site.description || 'Crafting digital experiences that blend creativity with functionality.'}
                </p>
              </div>
              
              {/* Dynamic Stats */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 lg:gap-8">
                <div className="text-center">
                  <div 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                    style={{ color: customization.colorScheme?.accent || '#06B6D4' }}
                  >
                    {siteData.pages.length}+
                  </div>
                  <div className="text-white/70 text-sm">Projects</div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                    style={{ color: customization.colorScheme?.primary || '#8B5CF6' }}
                  >
                    3+
                  </div>
                  <div className="text-white/70 text-sm">Years</div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-2xl sm:text-3xl lg:text-4xl font-bold"
                    style={{ color: customization.colorScheme?.secondary || '#EC4899' }}
                  >
                    100%
                  </div>
                  <div className="text-white/70 text-sm">Quality</div>
                </div>
              </div>
              
              {/* Modern CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  className="px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl transform"
                  style={{
                    background: `linear-gradient(135deg, ${customization.colorScheme?.primary || '#8B5CF6'}, ${customization.colorScheme?.secondary || '#EC4899'})`
                  }}
                >
                  View Portfolio
                </button>
                <button className="px-8 py-4 border-2 border-white/30 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm">
                  Get In Touch
                </button>
              </div>
            </div>
            
            {/* Right: Interactive 3D-Style Card */}
            <div className="relative mt-8 lg:mt-0">
              <div className="bg-white/10 backdrop-blur-2xl rounded-3xl p-6 lg:p-8 border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 transform">
                <div className="space-y-6">
                  {/* Avatar */}
                  <div 
                    className="w-20 h-20 lg:w-24 lg:h-24 rounded-3xl flex items-center justify-center text-white font-bold text-2xl lg:text-3xl shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${customization.colorScheme?.primary || '#8B5CF6'}, ${customization.colorScheme?.accent || '#06B6D4'})`
                    }}
                  >
                    {siteData.site.author?.split(' ').map(n => n[0]).join('') || 'CD'}
                  </div>
                  
                  {/* Status */}
                  <div>
                    <h3 className="text-white text-xl lg:text-2xl font-bold mb-2">Currently Available</h3>
                    <p className="text-white/70">Open for freelance projects and collaborations</p>
                  </div>
                  
                  {/* Skills Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                      <div 
                        className="font-semibold mb-1"
                        style={{ color: customization.colorScheme?.accent || '#06B6D4' }}
                      >
                        Design
                      </div>
                      <div className="text-white/70 text-sm">UI/UX, Branding</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                      <div 
                        className="font-semibold mb-1"
                        style={{ color: customization.colorScheme?.primary || '#8B5CF6' }}
                      >
                        Code
                      </div>
                      <div className="text-white/70 text-sm">React, Next.js</div>
                    </div>
                  </div>
                  
                  {/* Social Links */}
                  {siteData.site.social && (
                    <div className="flex gap-3 pt-2">
                      {Object.entries(siteData.site.social).map(([platform, url]) => (
                        <a
                          key={platform}
                          href={url}
                          className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors"
                        >
                          <span className="text-white text-sm font-bold">
                            {platform.charAt(0).toUpperCase()}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function BusinessHome({ siteData, theme }: { siteData: SiteData, theme: any }) {
  const customization = siteData.site.customization || {};
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Modern Corporate Hero */}
      <section 
        className="relative py-16 sm:py-20 lg:py-32 overflow-hidden"
        style={{
          background: customization.hero?.backgroundType === 'gradient'
            ? `linear-gradient(135deg, ${customization.colorScheme?.primary || '#1E40AF'} 0%, ${customization.colorScheme?.secondary || '#3B82F6'} 100%)`
            : `linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)`
        }}
      >
        {/* Modern Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5"></div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-5xl mx-auto">
            {/* Status Indicator */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-blue-200 font-medium text-sm sm:text-base">Enterprise Solutions Available</span>
            </div>
            
            {/* Main Heading */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 lg:mb-8 leading-tight text-white">
                <span className="block">Transform Your</span>
                <span 
                  className="block text-transparent bg-clip-text"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${customization.colorScheme?.accent || '#06B6D4'}, white)`
                  }}
                >
                  Business Future
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 mb-8 lg:mb-12 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                {siteData.site.description || 'We help enterprises leverage cutting-edge technology to drive growth, improve efficiency, and stay ahead of the competition.'}
              </p>
              
              {/* Modern CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center lg:justify-start">
                <button 
                  className="px-8 lg:px-10 py-4 lg:py-5 bg-white text-blue-900 rounded-2xl font-semibold text-lg hover:bg-blue-50 transition-all duration-300 hover:scale-105 hover:shadow-2xl transform"
                >
                  Schedule Consultation
                </button>
                <button className="px-8 lg:px-10 py-4 lg:py-5 border-2 border-blue-300 rounded-2xl font-semibold text-lg hover:bg-blue-800 transition-all duration-300 backdrop-blur-sm">
                  View Case Studies
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Services Section */}
      <section className="py-16 sm:py-20 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16 lg:mb-24">
            <div className="inline-flex items-center px-6 py-3 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 font-medium mb-6">
              Our Expertise
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Solutions That Scale
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Comprehensive solutions designed to address your most complex business challenges with measurable results
            </p>
          </div>
          
          {/* Modern Service Cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { 
                icon: "💻", 
                title: "Digital Transformation", 
                desc: "Modernize your infrastructure and processes for the digital age with cloud-native solutions",
                stats: "200+ Companies Transformed",
                color: customization.colorScheme?.primary || "#3B82F6"
              },
              { 
                icon: "📈", 
                title: "Growth Strategy", 
                desc: "Data-driven strategies to accelerate your business growth and market expansion",
                stats: "40% Average Growth Increase",
                color: customization.colorScheme?.secondary || "#10B981"
              },
              { 
                icon: "🔒", 
                title: "Security Solutions", 
                desc: "Enterprise-grade security to protect your digital assets and ensure compliance",
                stats: "99.9% Uptime Guarantee",
                color: customization.colorScheme?.accent || "#8B5CF6"
              }
            ].map((service, index) => (
              <div 
                key={index} 
                className="group bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-gray-700 hover:border-transparent hover:scale-105 transform"
                style={{
                  '--hover-shadow': `0 25px 50px -12px ${service.color}33`
                } as React.CSSProperties}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 25px 50px -12px ${service.color}33`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '';
                }}
              >
                {/* Icon */}
                <div className="text-4xl lg:text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                
                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {service.desc}
                </p>
                
                {/* Stats Badge */}
                <div 
                  className="rounded-2xl p-4 mb-6"
                  style={{ backgroundColor: `${service.color}15` }}
                >
                  <div 
                    className="font-semibold text-sm"
                    style={{ color: service.color }}
                  >
                    {service.stats}
                  </div>
                </div>
                
                {/* CTA */}
                <button 
                  className="font-semibold hover:translate-x-2 transition-all duration-300 flex items-center gap-2"
                  style={{ color: service.color }}
                >
                  Learn More 
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function MinimalHome({ siteData, theme }: { siteData: SiteData, theme: any }) {
  const customization = siteData.site.customization || {};
  
  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: customization.colorScheme?.background || 'white',
        color: customization.colorScheme?.text || (customization.colorScheme?.background?.includes('#0') || customization.colorScheme?.background?.includes('dark') ? '#F1F5F9' : '#1F2937')
      }}
    >
      {/* Ultra-Modern Minimal Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32">
        <div className="max-w-5xl mx-auto">
          
          {/* Minimal Header with Modern Typography */}
          <header className="text-center mb-24 sm:mb-32 lg:mb-40">
            {/* Decorative Line */}
            <div 
              className="w-1 h-16 sm:h-20 lg:h-24 mx-auto mb-8 lg:mb-12"
              style={{ backgroundColor: customization.colorScheme?.primary || '#6B7280' }}
            ></div>
            
            {/* Dynamic Title */}
            <h1 
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tight mb-8 lg:mb-12"
              style={{
                fontFamily: customization.typography?.headingFont || 'inherit',
                fontWeight: customization.typography?.fontWeight === 'light' ? 300 : 400
              }}
            >
              {siteData.site.title?.split(' ')[0] || 'Minimal'}
            </h1>
            
            <p 
              className="text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed opacity-75"
              style={{
                fontFamily: customization.typography?.bodyFont || 'inherit'
              }}
            >
              {siteData.site.description}
            </p>
          </header>

          {/* Modern Timeline Layout */}
          {siteData.pages.length > 0 && (
            <section className="space-y-16 sm:space-y-20 lg:space-y-24">
              <div className="relative">
                {/* Timeline Line */}
                <div 
                  className="absolute left-4 top-0 bottom-0 w-px"
                  style={{ backgroundColor: customization.colorScheme?.primary || '#E5E7EB' }}
                ></div>
                
                {/* Content Items */}
                <div className="space-y-16 sm:space-y-20">
                  {siteData.pages.slice(0, 5).map((page, index) => (
                    <article key={page.slug} className="relative pl-12 sm:pl-16 group">
                      {/* Timeline Dot */}
                      <div 
                        className="absolute left-2 w-4 h-4 rounded-full transform -translate-x-1/2 group-hover:scale-125 transition-transform duration-300"
                        style={{ backgroundColor: customization.colorScheme?.primary || '#6B7280' }}
                      ></div>
                      
                      {/* Content */}
                      <div className="space-y-4 sm:space-y-6">
                        {/* Article Number */}
                        <div 
                          className="text-sm font-mono opacity-50"
                          style={{ color: customization.colorScheme?.secondary || 'inherit' }}
                        >
                          {(index + 1).toString().padStart(2, '0')}
                        </div>
                        
                        {/* Title */}
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-normal hover:opacity-75 transition-opacity duration-300">
                          <Link href={`/${page.slug}`} className="block">
                            {page.title}
                          </Link>
                        </h2>
                        
                        {/* Excerpt */}
                        <p className="text-base sm:text-lg leading-relaxed max-w-3xl opacity-75">
                          {page.description || page.content.replace(/[#*`]/g, '').substring(0, 200) + '...'}
                        </p>
                        
                        {/* Meta */}
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm opacity-50">
                          <span>{Math.ceil(page.content.split(' ').length / 200)} min read</span>
                          {page.category && (
                            <span 
                              className="px-3 py-1 rounded-full text-xs"
                              style={{ 
                                backgroundColor: `${customization.colorScheme?.primary || '#6B7280'}20`,
                                color: customization.colorScheme?.primary || 'inherit'
                              }}
                            >
                              {page.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Minimal Footer */}
          <footer className="text-center mt-24 sm:mt-32 lg:mt-40 pt-16 sm:pt-20 border-t border-opacity-20">
            <div className="text-sm opacity-50">
              {siteData.pages.length} thoughts published • {new Date().getFullYear()}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function DocumentationHome({ siteData, theme }: { siteData: SiteData, theme: any }) {
  const customization = siteData.site.customization || {};
  
  return (
    <div 
      className="min-h-screen"
      style={{
        backgroundColor: customization.colorScheme?.background || '#F8FAFC',
        color: customization.colorScheme?.text || (customization.colorScheme?.background?.includes('#0') || customization.colorScheme?.background?.includes('dark') ? '#F1F5F9' : '#1F2937')
      }}
    >
      {/* Modern Documentation Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid lg:grid-cols-4 gap-8 lg:gap-16">
          
          {/* Enhanced Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              {/* Navigation Header */}
              <div 
                className="p-6 rounded-3xl border shadow-lg"
                style={{
                  backgroundColor: customization.colorScheme?.surface || 'white',
                  borderColor: customization.colorScheme?.primary ? `${customization.colorScheme.primary}20` : '#E5E7EB'
                }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: customization.colorScheme?.primary || '#10B981',
                      color: 'white'
                    }}
                  >
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Documentation</h3>
                    <p className="text-sm opacity-75">Quick Navigation</p>
                  </div>
                </div>
              </div>
              
              {/* Quick Start Section */}
              <div 
                className="p-6 rounded-3xl border"
                style={{
                  backgroundColor: customization.colorScheme?.surface || 'white',
                  borderColor: customization.colorScheme?.primary ? `${customization.colorScheme.primary}20` : '#E5E7EB'
                }}
              >
                                 <h3 className="font-semibold mb-4 flex items-center gap-2">
                   <span style={{ color: customization.colorScheme?.primary || '#10B981' }}>
                     <Zap className="w-4 h-4" />
                   </span>
                   Quick Start
                 </h3>
                <nav className="space-y-3">
                  {['Installation', 'Configuration', 'First Steps', 'Examples'].map((item, index) => (
                    <a 
                      key={item} 
                      href="#" 
                      className="block text-sm py-2 px-3 rounded-xl hover:bg-black/5 transition-colors"
                      style={{
                        color: customization.colorScheme?.text || 'inherit'
                      }}
                    >
                      <span className="text-xs opacity-50 mr-2">{(index + 1).toString().padStart(2, '0')}</span>
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
              
              {/* API Reference Section */}
              <div 
                className="p-6 rounded-3xl border"
                style={{
                  backgroundColor: customization.colorScheme?.surface || 'white',
                  borderColor: customization.colorScheme?.primary ? `${customization.colorScheme.primary}20` : '#E5E7EB'
                }}
              >
                                 <h3 className="font-semibold mb-4 flex items-center gap-2">
                   <span style={{ color: customization.colorScheme?.secondary || '#3B82F6' }}>
                     <Code className="w-4 h-4" />
                   </span>
                   API Reference
                 </h3>
                <nav className="space-y-3">
                  {['Methods', 'Properties', 'Events', 'Utilities'].map((item, index) => (
                    <a 
                      key={item} 
                      href="#" 
                      className="block text-sm py-2 px-3 rounded-xl hover:bg-black/5 transition-colors"
                      style={{
                        color: customization.colorScheme?.text || 'inherit'
                      }}
                    >
                      <span className="text-xs opacity-50 mr-2">{String.fromCharCode(65 + index)}</span>
                      {item}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Enhanced Main Content */}
          <main className="lg:col-span-3">
            {/* Modern Hero Section */}
            <header className="mb-16 lg:mb-24">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">
                {/* Icon & Title */}
                <div className="flex items-center gap-4 lg:gap-6">
                  <div 
                    className="w-16 h-16 lg:w-20 lg:h-20 rounded-3xl flex items-center justify-center shadow-lg"
                    style={{
                      background: `linear-gradient(135deg, ${customization.colorScheme?.primary || '#10B981'}, ${customization.colorScheme?.secondary || '#3B82F6'})`
                    }}
                  >
                    <FileText className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2">
                      {siteData.site.title}
                    </h1>
                    <p className="text-lg lg:text-xl opacity-75">Technical Documentation</p>
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <p className="text-lg sm:text-xl lg:text-2xl leading-relaxed mt-8 max-w-4xl opacity-90">
                {siteData.site.description}
              </p>
              
              {/* Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button 
                  className="px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  style={{
                    background: `linear-gradient(135deg, ${customization.colorScheme?.primary || '#10B981'}, ${customization.colorScheme?.secondary || '#3B82F6'})`
                  }}
                >
                  Get Started
                </button>
                <button 
                  className="px-8 py-4 border-2 rounded-2xl font-semibold hover:bg-black/5 transition-all duration-300"
                  style={{
                    borderColor: customization.colorScheme?.primary || '#10B981',
                    color: customization.colorScheme?.primary || '#10B981'
                  }}
                >
                  API Reference
                </button>
              </div>
            </header>

            {/* Modern Documentation Cards */}
            <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 mb-16 lg:mb-24">
              {[
                { icon: "🚀", title: "Getting Started", desc: "Learn the basics and get up and running quickly with our step-by-step guide" },
                { icon: "📖", title: "API Reference", desc: "Complete reference documentation for all methods, properties, and configurations" },
                { icon: "💡", title: "Examples", desc: "Real-world examples and code snippets to accelerate your development" },
                { icon: "🛠️", title: "Advanced", desc: "Advanced techniques, best practices, and optimization strategies" }
              ].map((card, index) => (
                <div 
                  key={index} 
                  className="group p-6 lg:p-8 rounded-3xl border transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
                  style={{
                    backgroundColor: customization.colorScheme?.surface || 'white',
                    borderColor: customization.colorScheme?.primary ? `${customization.colorScheme.primary}20` : '#E5E7EB'
                  }}
                  onMouseEnter={(e) => {
                    if (customization.colorScheme?.primary) {
                      e.currentTarget.style.borderColor = `${customization.colorScheme.primary}50`;
                      e.currentTarget.style.boxShadow = `0 25px 50px -12px ${customization.colorScheme.primary}20`;
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = customization.colorScheme?.primary ? `${customization.colorScheme.primary}20` : '#E5E7EB';
                    e.currentTarget.style.boxShadow = '';
                  }}
                >
                  <div className="text-4xl lg:text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                    {card.icon}
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors">
                    {card.title}
                  </h3>
                  <p className="leading-relaxed opacity-75 mb-6">
                    {card.desc}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-semibold opacity-75 group-hover:opacity-100 transition-opacity">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Updates with Modern Design */}
            {siteData.pages.length > 0 && (
              <section>
                <div className="flex items-center gap-4 mb-8 lg:mb-12">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${customization.colorScheme?.primary || '#10B981'}20`,
                      color: customization.colorScheme?.primary || '#10B981'
                    }}
                  >
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl font-bold">Recent Updates</h2>
                    <p className="opacity-75">Latest documentation changes and additions</p>
                  </div>
                </div>
                
                <div className="space-y-4 lg:space-y-6">
                  {siteData.pages.slice(0, 4).map((page, index) => (
                    <div 
                      key={page.slug} 
                      className="group p-6 lg:p-8 rounded-3xl border transition-all duration-300 hover:shadow-lg"
                      style={{
                        backgroundColor: customization.colorScheme?.surface || 'white',
                        borderColor: customization.colorScheme?.primary ? `${customization.colorScheme.primary}20` : '#E5E7EB'
                      }}
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span 
                              className="px-3 py-1 rounded-full text-xs font-medium"
                              style={{
                                backgroundColor: `${customization.colorScheme?.primary || '#10B981'}20`,
                                color: customization.colorScheme?.primary || '#10B981'
                              }}
                            >
                              Updated
                            </span>
                            {page.category && (
                              <span className="text-xs opacity-50">{page.category}</span>
                            )}
                          </div>
                          <h3 className="text-lg lg:text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                            <Link href={`/${page.slug}`}>{page.title}</Link>
                          </h3>
                          <p className="opacity-75 leading-relaxed">
                            {page.description || page.content.replace(/[#*`]/g, '').substring(0, 120) + '...'}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm opacity-50">
                            {Math.ceil(page.content.split(' ').length / 200)} min read
                          </span>
                          <div 
                            className="text-blue-600 group-hover:translate-x-1 transition-transform"
                            style={{ color: customization.colorScheme?.primary || '#10B981' }}
                          >
                            <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function BlogHome({ siteData, theme }: { siteData: SiteData, theme: any }) {
  const customization = siteData.site.customization || {};
  
  return (
    <div 
      className="min-h-screen"
      style={{
        background: customization.hero?.backgroundType === 'gradient'
          ? `linear-gradient(135deg, ${customization.colorScheme?.background || '#F8FAFC'} 0%, ${customization.colorScheme?.surface || '#FFFFFF'} 100%)`
          : customization.colorScheme?.background || 'linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)'
      }}
    >
      {/* Modern Magazine-style Layout */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* Enhanced Hero Article */}
        {siteData.pages[0] && (
          <section className="mb-20 lg:mb-32">
            <Link href={`/${siteData.pages[0].slug}`} className="group block">
              <article 
                className="relative overflow-hidden rounded-3xl lg:rounded-[2.5rem] shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02] transform"
                style={{
                  background: customization.hero?.backgroundType === 'gradient'
                    ? `linear-gradient(135deg, ${customization.colorScheme?.primary || '#3B82F6'}, ${customization.colorScheme?.secondary || '#8B5CF6'})`
                    : `linear-gradient(135deg, #3B82F6, #8B5CF6)`
                }}
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/5"></div>
                </div>
                
                {/* Content */}
                <div className="relative p-8 sm:p-12 lg:p-16 xl:p-20 text-white">
                  {/* Featured Badge */}
                  <div className="flex items-center gap-4 mb-8 lg:mb-12">
                    <span className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium border border-white/30">
                      <Star className="w-4 h-4 mr-2" />
                      Featured Article
                    </span>
                    <div className="flex items-center gap-2 text-white/80">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">
                        {Math.ceil(siteData.pages[0].content.split(' ').length / 200)} min read
                      </span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-7xl font-bold mb-6 lg:mb-8 leading-tight group-hover:text-blue-100 transition-colors">
                    {siteData.pages[0].title}
                  </h1>
                  
                  {/* Description */}
                  <p className="text-lg sm:text-xl lg:text-2xl xl:text-3xl leading-relaxed max-w-4xl text-white/90 mb-8 lg:mb-12">
                    {siteData.pages[0].description || siteData.pages[0].content.replace(/[#*`]/g, '').substring(0, 200) + '...'}
                  </p>
                  
                  {/* Meta Information */}
                  <div className="flex flex-wrap items-center gap-4 lg:gap-6">
                    {siteData.pages[0].publishedAt && (
                      <div className="flex items-center gap-2 text-white/80">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {new Date(siteData.pages[0].publishedAt).toLocaleDateString('en-US', { 
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                    )}
                    {siteData.pages[0].category && (
                      <span className="px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                        {siteData.pages[0].category}
                      </span>
                    )}
                    {siteData.pages[0].tags && siteData.pages[0].tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-white/10 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          </section>
        )}

        {/* Enhanced Article Grid */}
        {siteData.pages.length > 1 && (
          <section>
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 lg:mb-16">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: `${customization.colorScheme?.primary || '#3B82F6'}20`,
                      color: customization.colorScheme?.primary || '#3B82F6'
                    }}
                  >
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold">More Articles</h2>
                    <p className="opacity-75">Explore our latest thoughts and insights</p>
                  </div>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex items-center gap-6 lg:gap-8">
                <div className="text-center">
                  <div 
                    className="text-2xl lg:text-3xl font-bold"
                    style={{ color: customization.colorScheme?.primary || '#3B82F6' }}
                  >
                    {siteData.pages.length}
                  </div>
                  <div className="text-sm opacity-75">Articles</div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-2xl lg:text-3xl font-bold"
                    style={{ color: customization.colorScheme?.secondary || '#8B5CF6' }}
                  >
                    {Math.ceil(siteData.pages.reduce((acc, page) => acc + page.content.split(' ').length, 0) / 200)}
                  </div>
                  <div className="text-sm opacity-75">Min Read</div>
                </div>
              </div>
            </div>
            
            {/* Modern Article Cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {siteData.pages.slice(1).map((page, index) => (
                <Link key={page.slug} href={`/${page.slug}`} className="group block">
                  <article 
                    className="h-full p-6 lg:p-8 rounded-3xl border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 transform"
                    style={{
                      backgroundColor: customization.colorScheme?.surface || 'white',
                      borderColor: customization.colorScheme?.primary ? `${customization.colorScheme.primary}20` : '#E5E7EB'
                    }}
                    onMouseEnter={(e) => {
                      if (customization.colorScheme?.primary) {
                        e.currentTarget.style.borderColor = `${customization.colorScheme.primary}50`;
                        e.currentTarget.style.boxShadow = `0 25px 50px -12px ${customization.colorScheme.primary}20`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = customization.colorScheme?.primary ? `${customization.colorScheme.primary}20` : '#E5E7EB';
                      e.currentTarget.style.boxShadow = '';
                    }}
                  >
                    {/* Article Header */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <span 
                          className="inline-block w-16 h-1 rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${customization.colorScheme?.primary || '#3B82F6'}, ${customization.colorScheme?.secondary || '#8B5CF6'})`
                          }}
                        ></span>
                        <span className="text-xs opacity-50 font-mono">
                          {(index + 2).toString().padStart(2, '0')}
                        </span>
                      </div>
                      
                      {/* Category & Date */}
                      <div className="flex items-center gap-3 mb-4">
                        {page.category && (
                          <span 
                            className="px-3 py-1 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: `${customization.colorScheme?.primary || '#3B82F6'}20`,
                              color: customization.colorScheme?.primary || '#3B82F6'
                            }}
                          >
                            {page.category}
                          </span>
                        )}
                        {page.publishedAt && (
                          <span className="text-xs opacity-50">
                            {new Date(page.publishedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl lg:text-2xl font-bold mb-4 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                      {page.title}
                    </h3>
                    
                    {/* Excerpt */}
                    <p className="opacity-75 leading-relaxed mb-6 line-clamp-3">
                      {page.description || page.content.replace(/[#*`]/g, '').substring(0, 120) + '...'}
                    </p>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-opacity-20">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 opacity-50" />
                        <span className="text-sm opacity-50">
                          {Math.ceil(page.content.split(' ').length / 200)} min read
                        </span>
                      </div>
                      <div 
                        className="group-hover:translate-x-1 transition-transform"
                        style={{ color: customization.colorScheme?.primary || '#3B82F6' }}
                      >
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                    
                    {/* Tags */}
                    {page.tags && page.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {page.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="text-xs opacity-50">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function DefaultHome({ siteData, theme }: { siteData: SiteData, theme: any }) {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Static generation for instant loading and perfect performance scores"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "JSON-Driven",
      description: "Manage your entire site with a simple JSON file - no complex CMS needed"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Beautiful Themes",
      description: "Multiple stunning design systems to choose from"
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: "Smart Search",
      description: "Fuzzy search with keyboard shortcuts and instant results"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
      <div className="space-y-20">
      {/* Dynamic Hero Section */}
        <section className="hero-section text-center py-12 sm:py-16 lg:py-24 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="hero-decoration-1 absolute top-10 sm:top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="hero-decoration-2 absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="mb-8 animate-fade-in-up">
              <div className={`hero-badge inline-flex items-center px-6 py-3 rounded-full text-sm font-medium ${theme.code} mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                                  Powered by zyros
              </div>
            </div>
            
            <h1 className={`hero-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold mb-6 sm:mb-8 ${theme.accent} leading-tight animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
              <span className="block sm:inline">Welcome to</span>{' '}
              <span className="hero-title-gradient block sm:inline bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent bg-300% animate-gradient">
                {siteData.site.title}
              </span>
            </h1>
            
            {siteData.site.description && (
              <p className={`hero-subtitle text-lg sm:text-xl md:text-2xl lg:text-3xl ${theme.secondary} max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 animate-fade-in-up px-4 sm:px-0`} style={{ animationDelay: '0.4s' }}>
                {siteData.site.description}
              </p>
            )}
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up px-4 sm:px-0" style={{ animationDelay: '0.6s' }}>
              {siteData.pages.length > 0 && (
                <CustomButton
                  buttonId="heroReadLatestPost"
                customButtons={siteData.customButtons || {}}
                  href={`/${siteData.pages[0].slug}`}
                  className="group w-full sm:w-auto min-h-[44px]"
                  fallbackText="Read Latest Post"
                >
                  Read Latest Post
                  <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </CustomButton>
              )}
              <CustomButton
                buttonId="heroExploreFeatures"
              customButtons={siteData.customButtons || {}}
                href="#features"
                className="group w-full sm:w-auto min-h-[44px]"
                fallbackText="Explore Features"
              >
                Explore Features
                <ExternalLink className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
              </CustomButton>
            </div>
          </div>
        </section>

        {/* Interactive Stats Section */}
        <section className={`stats-section py-12 sm:py-16 lg:py-20 ${theme.card} rounded-2xl sm:rounded-3xl border ${theme.border} shadow-2xl relative overflow-hidden animate-fade-in-up mx-4 sm:mx-0`}>
          <div className="stats-background absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 text-center">
              <div className="space-y-3 sm:space-y-4 group hover:scale-105 transition-transform duration-300 sm:col-span-2 lg:col-span-1">
                <div className={`stats-number text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-bounce-gentle`}>
                  {siteData.pages.length}
                </div>
                <div className={`stats-label text-lg sm:text-xl font-semibold ${theme.secondary}`}>
                  Published Articles
                </div>
                <div className={`text-sm ${theme.secondary} opacity-75`}>
                  Ready to inspire and educate
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className={`stats-number text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent animate-bounce-gentle`} style={{ animationDelay: '0.5s' }}>
                  100%
                </div>
                <div className={`stats-label text-lg sm:text-xl font-semibold ${theme.secondary}`}>
                  Static & Fast
                </div>
                <div className={`text-sm ${theme.secondary} opacity-75`}>
                  No server needed, lightning fast
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className={`stats-number text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-bounce-gentle`} style={{ animationDelay: '1s' }}>
                  JSON
                </div>
                <div className={`stats-label text-lg sm:text-xl font-semibold ${theme.secondary}`}>
                  Content Management
                </div>
                <div className={`text-sm ${theme.secondary} opacity-75`}>
                  Simple, powerful, developer-friendly
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Latest Posts with Enhanced Cards */}
      {siteData.pages.length > 0 && (
        <section className="animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-16">
            <div>
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${theme.code} mb-6 shadow-md`}>
                <FileText className="w-4 h-4 mr-2" />
                Latest Articles
              </div>
              <h2 className={`text-5xl lg:text-6xl font-bold ${theme.accent} mb-4`}>
                Featured Content
              </h2>
              <p className={`text-xl ${theme.secondary} max-w-2xl`}>
                Discover insights, tutorials, and thoughts from our latest publications
              </p>
            </div>
            <div className={`mt-6 sm:mt-0 px-6 py-3 rounded-full ${theme.code} text-sm font-medium shadow-md`}>
              {siteData.pages.length} articles published
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {siteData.pages.map((page, index) => (
              <Link 
                key={page.slug} 
                href={`/${page.slug}`}
                className={`group block p-8 rounded-3xl ${theme.card} border ${theme.border} hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-blue-500/50 relative overflow-hidden animate-fade-in-up`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Article Number */}
                  <div className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-bold ${theme.code} mb-6 shadow-sm`}>
                    <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                    Article {String(index + 1).padStart(2, '0')}
                  </div>
                  
                  {/* Title */}
                  <h3 className={`text-2xl font-bold mb-4 ${theme.accent} group-hover:text-blue-600 transition-colors leading-tight`}>
                    {page.title}
                  </h3>
                  
                  {/* Excerpt */}
                  <p className={`${theme.secondary} line-clamp-3 leading-relaxed mb-6 text-lg`}>
                    {page.description || 
                      page.content.replace(/[#*`]/g, '').substring(0, 150) + '...'
                    }
                  </p>
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    {page.publishedAt && (
                      <div className={`flex items-center text-sm ${theme.secondary}`}>
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(page.publishedAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    )}
                    <div className={`flex items-center text-sm ${theme.secondary}`}>
                      <Clock className="w-4 h-4 mr-1" />
                      {page.readingTime || Math.ceil(page.content.split(' ').length / 200)} min read
                    </div>
                    {page.category && (
                      <div className={`px-2 py-1 rounded text-xs font-medium ${theme.code} capitalize`}>
                        {page.category}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {page.tags && page.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {page.tags.slice(0, 3).map((tag) => (
                        <span 
                          key={tag}
                          className={`inline-flex items-center px-2 py-1 rounded text-xs ${theme.secondary} opacity-75`}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {page.tags.length > 3 && (
                        <span className={`text-xs ${theme.secondary} opacity-75`}>
                          +{page.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  
                  {/* Read More */}
                  <div className={`flex items-center font-semibold ${theme.link} group-hover:text-blue-600 transition-colors`}>
                    Read full article
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
                    </div>
  );
}

export default function Home({ siteData }: HomeProps) {
  const theme = getTheme(siteData.site.theme || 'light');
  const layout = siteData.site.layout || 'default';

  // Determine which template layout to render
  const renderTemplateLayout = () => {
    switch (layout) {
      case 'portfolio':
        return <PortfolioHome siteData={siteData} theme={theme} />;
      case 'business':
        return <BusinessHome siteData={siteData} theme={theme} />;
      case 'minimal':
        return <MinimalHome siteData={siteData} theme={theme} />;
      case 'documentation':
        return <DocumentationHome siteData={siteData} theme={theme} />;
      case 'blog':
        return <BlogHome siteData={siteData} theme={theme} />;
      default:
        return <DefaultHome siteData={siteData} theme={theme} />;
    }
  };

  return (
    <Layout 
      siteConfig={siteData} 
      theme={theme} 
      pages={siteData.pages}
    >
      {renderTemplateLayout()}

      {/* Common Newsletter Section for all layouts except minimal */}
      {layout !== 'minimal' && (
        <div className="px-4 sm:px-0">
          <Newsletter 
            theme={theme} 
            siteData={siteData}
            customization={{
              style: 'modern',
              layout: 'centered',
              showStats: true,
              showIcon: true
            }}
          />
            </div>
      )}
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
  const siteData = loadSiteData();
  
    // Clean up undefined values for JSON serialization
    const cleanSiteData = JSON.parse(JSON.stringify(siteData, (key, value) => {
      return value === undefined ? null : value;
    }));
  
  return {
    props: {
        siteData: cleanSiteData
      }
    };
  } catch (error) {
    console.error('Error loading site data:', error);
    return {
      notFound: true
    };
  }
}; 