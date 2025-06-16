import { GetStaticProps } from 'next';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Zap, FileText, Palette, Search, Clock, ExternalLink, Tag, Calendar } from '../components/Icons';
import Layout from '../components/Layout';
import Newsletter from '../components/Newsletter';
import { loadSiteData, SiteData } from '../lib/contentLoader';
import { getTheme } from '../styles/themes';

interface HomeProps {
  siteData: SiteData;
}

export default function Home({ siteData }: HomeProps) {
  const theme = getTheme(siteData.site.theme || 'light');
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
      description: "8 stunning themes included, from minimal to vibrant gradients"
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
    <Layout 
      siteConfig={siteData} 
      theme={theme} 
      pages={siteData.pages}
    >
      <div className="space-y-20">
        {/* Hero Section */}
        <section className="text-center py-12 sm:py-16 lg:py-24 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-10 sm:top-20 left-4 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-10 sm:bottom-20 right-4 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          </div>

          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="mb-8 animate-fade-in-up">
              <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium ${theme.code} mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}>
                <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                                  Powered by zyros
              </div>
            </div>
            
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold mb-6 sm:mb-8 ${theme.accent} leading-tight animate-fade-in-up`} style={{ animationDelay: '0.2s' }}>
              <span className="block sm:inline">Welcome to</span>{' '}
              <span className="block sm:inline bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent bg-300% animate-gradient">
                {siteData.site.title}
              </span>
            </h1>
            
            {siteData.site.description && (
              <p className={`text-lg sm:text-xl md:text-2xl lg:text-3xl ${theme.secondary} max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 animate-fade-in-up px-4 sm:px-0`} style={{ animationDelay: '0.4s' }}>
                {siteData.site.description}
              </p>
            )}
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up px-4 sm:px-0" style={{ animationDelay: '0.6s' }}>
              {siteData.pages.length > 0 && (
                <Link 
                  href={`/${siteData.pages[0].slug}`}
                  className="group inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 min-h-[44px]"
                >
                  Read Latest Post
                  <ArrowRight className="ml-2 w-4 sm:w-5 h-4 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              <Link 
                href="#features"
                className={`inline-flex items-center justify-center w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg transition-all duration-300 ${theme.card} border-2 ${theme.border} ${theme.text} hover:${theme.accent} hover:scale-105 hover:border-blue-500/50 shadow-lg hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm min-h-[44px]`}
              >
                Explore Features
                <ExternalLink className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Interactive Stats Section */}
        <section className={`py-12 sm:py-16 lg:py-20 ${theme.card} rounded-2xl sm:rounded-3xl border ${theme.border} shadow-2xl relative overflow-hidden animate-fade-in-up mx-4 sm:mx-0`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 text-center">
              <div className="space-y-3 sm:space-y-4 group hover:scale-105 transition-transform duration-300 sm:col-span-2 lg:col-span-1">
                <div className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-bounce-gentle`}>
                  {siteData.pages.length}
                </div>
                <div className={`text-lg sm:text-xl font-semibold ${theme.secondary}`}>
                  Published Articles
                </div>
                <div className={`text-sm ${theme.secondary} opacity-75`}>
                  Ready to inspire and educate
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent animate-bounce-gentle`} style={{ animationDelay: '0.5s' }}>
                  100%
                </div>
                <div className={`text-lg sm:text-xl font-semibold ${theme.secondary}`}>
                  Static & Fast
                </div>
                <div className={`text-sm ${theme.secondary} opacity-75`}>
                  No server needed, lightning fast
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4 group hover:scale-105 transition-transform duration-300">
                <div className={`text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent animate-bounce-gentle`} style={{ animationDelay: '1s' }}>
                  JSON
                </div>
                <div className={`text-lg sm:text-xl font-semibold ${theme.secondary}`}>
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

        {/* Interactive Features Section */}
        <section id="features" className="py-24 animate-fade-in-up">
          <div className="text-center mb-20">
            <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium ${theme.code} mb-8 shadow-lg`}>
              <Palette className="w-4 h-4 mr-2" />
              Powerful Features
            </div>
            <h2 className={`text-5xl lg:text-6xl font-bold mb-8 ${theme.accent}`}>
              Built for Developers
            </h2>
            <p className={`text-xl ${theme.secondary} max-w-4xl mx-auto leading-relaxed`}>
                              zyros combines simplicity with power, giving you everything you need to create stunning static sites
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Feature Showcase */}
            <div className="space-y-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-2xl transition-all duration-500 cursor-pointer ${
                    currentFeature === index 
                      ? `${theme.card} border-2 border-blue-500 shadow-xl scale-105` 
                      : `${theme.card} border ${theme.border} hover:shadow-lg hover:scale-102`
                  }`}
                  onClick={() => setCurrentFeature(index)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl ${
                      currentFeature === index 
                        ? 'bg-blue-500 text-white' 
                        : `${theme.code}`
                    } transition-all duration-300`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold mb-2 ${theme.accent}`}>
                        {feature.title}
                      </h3>
                      <p className={`${theme.secondary} leading-relaxed`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Feature Demo */}
            <div className={`p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-2xl relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-4 animate-bounce-gentle`}>
                    {features[currentFeature].icon}
                  </div>
                  <h3 className={`text-2xl font-bold ${theme.accent} mb-2`}>
                    {features[currentFeature].title}
                  </h3>
                  <p className={`${theme.secondary}`}>
                    {features[currentFeature].description}
                  </p>
                </div>
                
                {/* Demo Content */}
                <div className={`p-6 rounded-xl ${theme.code} border font-mono text-sm overflow-hidden`}>
                  {currentFeature === 0 && (
                    <div className="space-y-2">
                      <div className="text-green-500">✓ Lighthouse Score: 100/100</div>
                      <div className="text-green-500">✓ First Contentful Paint: 0.8s</div>
                      <div className="text-green-500">✓ Static Generation: Enabled</div>
                    </div>
                  )}
                  {currentFeature === 1 && (
                    <div className="space-y-2">
                      <div className="text-blue-500">{"{"}</div>
                      <div className="ml-4 text-purple-500">&quot;title&quot;: &quot;My Blog Post&quot;,</div>
                      <div className="ml-4 text-purple-500">&quot;content&quot;: &quot;# Hello World!&quot;</div>
                      <div className="text-blue-500">{"}"}</div>
                    </div>
                  )}
                  {currentFeature === 2 && (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        <div className="w-4 h-4 rounded-full bg-purple-500"></div>
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      </div>
                      <div className="text-sm opacity-75">8 beautiful themes available</div>
                    </div>
                  )}
                  {currentFeature === 3 && (
                    <div className="space-y-2">
                      <div className="text-yellow-500">⌘ + K to search</div>
                      <div className="text-gray-500">Fuzzy search enabled</div>
                      <div className="text-green-500">Instant results</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="animate-fade-in-up">
          <Newsletter theme={theme} />
        </section>

        {/* Call to Action */}
        <section className={`py-20 text-center ${theme.card} rounded-3xl border ${theme.border} shadow-2xl relative overflow-hidden animate-fade-in-up`}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
          <div className="relative z-10 max-w-4xl mx-auto px-6">
            <h2 className={`text-4xl lg:text-5xl font-bold mb-6 ${theme.accent}`}>
              Ready to Build Something Amazing?
            </h2>
            <p className={`text-xl ${theme.secondary} mb-8 leading-relaxed`}>
                              Join thousands of developers who&apos;ve chosen zyros for their static sites
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/getting-started"
                className="inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link 
                href="/analytics"
                className={`inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${theme.card} border-2 ${theme.border} ${theme.text} hover:${theme.accent} hover:scale-105 hover:border-blue-500/50 shadow-lg hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm`}
              >
                View Analytics
                <ExternalLink className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const siteData = loadSiteData();
  
  return {
    props: {
      siteData,
    },
  };
}; 