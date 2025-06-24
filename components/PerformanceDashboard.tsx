import React, { useState, useEffect } from 'react';
import { BarChart3, Zap, Clock, TrendingUp, Eye, Users, AlertCircle, Check } from './Icons';
import { Theme } from '../styles/themes';

interface PerformanceDashboardProps {
  theme: Theme;
}

interface PerformanceMetrics {
  lighthouse: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
    pwa: number;
  };
  coreWebVitals: {
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
  };
  pageMetrics: {
    loadTime: number;
    domContentLoaded: number;
    firstPaint: number;
    firstContentfulPaint: number;
  };
  resourceMetrics: {
    totalSize: number;
    jsSize: number;
    cssSize: number;
    imageSize: number;
    requests: number;
  };
  userMetrics: {
    bounceRate: number;
    avgSessionDuration: number;
    pagesPerSession: number;
  };
}

interface OptimizationSuggestion {
  type: 'critical' | 'warning' | 'info';
  category: 'performance' | 'accessibility' | 'seo' | 'best-practices';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'easy' | 'medium' | 'hard';
  fix: string;
}

export default function PerformanceDashboard({ theme }: PerformanceDashboardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'vitals' | 'resources' | 'suggestions'>('overview');

  useEffect(() => {
    if (isOpen && !metrics) {
      loadPerformanceData();
    }
  }, [isOpen]);

  const loadPerformanceData = async () => {
    setLoading(true);
    
    // Simulate loading performance data
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    /* 🚀 REAL DATA INTEGRATION READY 🚀
     * This currently uses mock data for demonstration purposes.
     * To integrate with real performance APIs, replace this mock data with:
     * 
     * - Performance Observer API for Core Web Vitals
     * - Lighthouse CI for automated scoring
     * - Google Analytics API for user metrics
     * - Resource Timing API for page load metrics
     * - Custom analytics for bounce rate and session data
     * 
     * The UI is fully designed to handle real-time performance data!
     */
    const mockMetrics: PerformanceMetrics = {
      lighthouse: {
        performance: 92,
        accessibility: 98,
        bestPractices: 87,
        seo: 95,
        pwa: 73
      },
      coreWebVitals: {
        lcp: 1.2, // seconds
        fid: 45, // milliseconds
        cls: 0.08 // score
      },
      pageMetrics: {
        loadTime: 1800, // milliseconds
        domContentLoaded: 1200,
        firstPaint: 900,
        firstContentfulPaint: 1100
      },
      resourceMetrics: {
        totalSize: 2.1, // MB
        jsSize: 0.8,
        cssSize: 0.3,
        imageSize: 1.0,
        requests: 28
      },
      userMetrics: {
        bounceRate: 32, // percentage
        avgSessionDuration: 245, // seconds
        pagesPerSession: 2.8
      }
    };

    const mockSuggestions: OptimizationSuggestion[] = [
      {
        type: 'warning',
        category: 'performance',
        title: 'Optimize Images',
        description: 'Some images could be better compressed or converted to modern formats',
        impact: 'medium',
        effort: 'easy',
        fix: 'Use WebP format and compress images to reduce file size by ~40%'
      },
      {
        type: 'info',
        category: 'performance',
        title: 'Enable Text Compression',
        description: 'Text-based resources could benefit from compression',
        impact: 'low',
        effort: 'easy',
        fix: 'Enable gzip or brotli compression on your server'
      },
      {
        type: 'critical',
        category: 'accessibility',
        title: 'Add Alt Text to Images',
        description: 'Some images are missing alternative text',
        impact: 'high',
        effort: 'easy',
        fix: 'Add descriptive alt attributes to all images'
      },
      {
        type: 'warning',
        category: 'seo',
        title: 'Improve Meta Descriptions',
        description: 'Some pages have missing or short meta descriptions',
        impact: 'medium',
        effort: 'medium',
        fix: 'Write compelling 120-160 character meta descriptions for all pages'
      }
    ];

    setMetrics(mockMetrics);
    setSuggestions(mockSuggestions);
    setLoading(false);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number): string => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getCoreWebVitalStatus = (metric: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    switch (metric) {
      case 'lcp':
        return value <= 2.5 ? 'good' : value <= 4.0 ? 'needs-improvement' : 'poor';
      case 'fid':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'cls':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  };

  const formatBytes = (bytes: number): string => {
    return `${bytes.toFixed(1)} MB`;
  };

  const formatTime = (ms: number): string => {
    return `${(ms / 1000).toFixed(1)}s`;
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-20 right-6 p-4 rounded-2xl bg-gradient-to-br from-violet-600 via-blue-600 to-indigo-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 z-50 group animate-pulse hover:animate-none`}
      >
        <BarChart3 className="w-6 h-6" />
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-gray-900 to-black text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl">
          <div className="font-medium">Performance Dashboard</div>
          <div className="text-xs text-gray-300">Click to analyze your site</div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`max-w-6xl w-full max-h-[90vh] overflow-y-auto rounded-2xl ${theme.card} border ${theme.border} shadow-2xl`}>
        {/* Header */}
        <div className="p-8 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-600 via-blue-600 to-indigo-600 text-white shadow-lg">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>Performance Dashboard</h2>
                <p className={`text-sm ${theme.secondary} mt-1`}>Monitor your site's performance and optimization in real-time</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-3 rounded-xl ${theme.border} hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 transition-all duration-300 text-xl font-bold`}
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: <Eye className="w-4 h-4" /> },
              { id: 'vitals', label: 'Core Web Vitals', icon: <Zap className="w-4 h-4" /> },
              { id: 'resources', label: 'Resources', icon: <BarChart3 className="w-4 h-4" /> },
              { id: 'suggestions', label: 'Suggestions', icon: <TrendingUp className="w-4 h-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? `border-blue-500 ${theme.accent}`
                    : `border-transparent ${theme.secondary} hover:${theme.accent}`
                }`}
              >
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center space-y-8">
              <div className="relative">
                <div className="animate-spin w-20 h-20 border-4 border-gradient-to-r from-blue-200 via-indigo-200 to-purple-200 border-t-blue-600 rounded-full mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <BarChart3 className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent`}>
                  Analyzing Performance...
                </h3>
                <p className={`${theme.secondary} text-lg`}>
                  Gathering performance metrics and optimization data
                </p>
                <div className="flex justify-center space-x-2 mt-4">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <p className={`text-sm ${theme.secondary} mt-4 italic`}>
                  ✨ Currently displaying demo data - Ready for real-time integration!
                </p>
              </div>
            </div>
          ) : metrics ? (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Lighthouse Scores */}
                  <div>
                    <h3 className={`text-lg font-semibold ${theme.accent} mb-4`}>Lighthouse Scores</h3>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        { label: 'Performance', score: metrics.lighthouse.performance, icon: <Zap className="w-5 h-5" /> },
                        { label: 'Accessibility', score: metrics.lighthouse.accessibility, icon: <Users className="w-5 h-5" /> },
                        { label: 'Best Practices', score: metrics.lighthouse.bestPractices, icon: <Check className="w-5 h-5" /> },
                        { label: 'SEO', score: metrics.lighthouse.seo, icon: <TrendingUp className="w-5 h-5" /> },
                        { label: 'PWA', score: metrics.lighthouse.pwa, icon: <BarChart3 className="w-5 h-5" /> }
                      ].map((item, index) => (
                        <div key={index} className={`p-6 rounded-2xl ${theme.card} border ${theme.border} text-center relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${getScoreBackground(item.score)} shadow-lg`}>
                            <div className={getScoreColor(item.score)}>
                              {item.icon}
                            </div>
                          </div>
                          <div className={`text-4xl font-bold mb-2 ${getScoreColor(item.score)}`}>
                            {item.score}
                          </div>
                          <div className={`text-sm font-semibold ${theme.secondary} mb-3`}>
                            {item.label}
                          </div>
                          {/* Progress bar */}
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-1000 ${
                                item.score >= 90 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                                item.score >= 70 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                                'bg-gradient-to-r from-red-400 to-red-600'
                              }`}
                              style={{ width: `${item.score}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* User Metrics */}
                  <div>
                    <h3 className={`text-lg font-semibold ${theme.accent} mb-4`}>User Experience Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className={`p-8 rounded-2xl ${theme.card} border ${theme.border} relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-green-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex items-center justify-between mb-6">
                          <h4 className={`font-bold text-lg ${theme.accent}`}>Bounce Rate</h4>
                          <div className="p-3 rounded-xl bg-gradient-to-r from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30">
                            <TrendingUp className={`w-6 h-6 ${metrics.userMetrics.bounceRate < 40 ? 'text-green-600' : 'text-yellow-600'}`} />
                          </div>
                        </div>
                        <div className={`text-4xl font-bold mb-4 ${metrics.userMetrics.bounceRate < 40 ? 'text-green-600' : 'text-yellow-600'}`}>
                          {metrics.userMetrics.bounceRate}%
                        </div>
                        <p className={`text-sm font-medium ${theme.secondary} mb-4`}>
                          {metrics.userMetrics.bounceRate < 40 ? 'Excellent engagement' : 'Good engagement'}
                        </p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-1000"
                            style={{ width: `${100 - metrics.userMetrics.bounceRate}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className={`p-8 rounded-2xl ${theme.card} border ${theme.border} relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex items-center justify-between mb-6">
                          <h4 className={`font-bold text-lg ${theme.accent}`}>Avg. Session</h4>
                          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                            <Clock className="w-6 h-6 text-blue-600" />
                          </div>
                        </div>
                        <div className="text-4xl font-bold text-blue-600 mb-4">
                          {Math.floor(metrics.userMetrics.avgSessionDuration / 60)}m {metrics.userMetrics.avgSessionDuration % 60}s
                        </div>
                        <p className={`text-sm font-medium ${theme.secondary} mb-4`}>Time spent on site</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-1000"
                            style={{ width: `${Math.min((metrics.userMetrics.avgSessionDuration / 300) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className={`p-8 rounded-2xl ${theme.card} border ${theme.border} relative overflow-hidden group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="flex items-center justify-between mb-6">
                          <h4 className={`font-bold text-lg ${theme.accent}`}>Pages/Session</h4>
                          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
                            <Eye className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                        <div className="text-4xl font-bold text-purple-600 mb-4">
                          {metrics.userMetrics.pagesPerSession.toFixed(1)}
                        </div>
                        <p className={`text-sm font-medium ${theme.secondary} mb-4`}>Pages viewed per visit</p>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-1000"
                            style={{ width: `${Math.min((metrics.userMetrics.pagesPerSession / 5) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vitals' && (
                <div className="space-y-8">
                  <div>
                    <h3 className={`text-lg font-semibold ${theme.accent} mb-4`}>Core Web Vitals</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className={`p-6 rounded-xl ${theme.card} border ${theme.border}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className={`font-semibold ${theme.accent}`}>Largest Contentful Paint</h4>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getCoreWebVitalStatus('lcp', metrics.coreWebVitals.lcp) === 'good' ? 'bg-green-100 text-green-800' :
                            getCoreWebVitalStatus('lcp', metrics.coreWebVitals.lcp) === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {getCoreWebVitalStatus('lcp', metrics.coreWebVitals.lcp).replace('-', ' ')}
                          </div>
                        </div>
                        <div className={`text-3xl font-bold mb-2 ${
                          getCoreWebVitalStatus('lcp', metrics.coreWebVitals.lcp) === 'good' ? 'text-green-600' :
                          getCoreWebVitalStatus('lcp', metrics.coreWebVitals.lcp) === 'needs-improvement' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {metrics.coreWebVitals.lcp.toFixed(1)}s
                        </div>
                        <p className={`text-sm ${theme.secondary}`}>Time to render largest element</p>
                      </div>

                      <div className={`p-6 rounded-xl ${theme.card} border ${theme.border}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className={`font-semibold ${theme.accent}`}>First Input Delay</h4>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getCoreWebVitalStatus('fid', metrics.coreWebVitals.fid) === 'good' ? 'bg-green-100 text-green-800' :
                            getCoreWebVitalStatus('fid', metrics.coreWebVitals.fid) === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {getCoreWebVitalStatus('fid', metrics.coreWebVitals.fid).replace('-', ' ')}
                          </div>
                        </div>
                        <div className={`text-3xl font-bold mb-2 ${
                          getCoreWebVitalStatus('fid', metrics.coreWebVitals.fid) === 'good' ? 'text-green-600' :
                          getCoreWebVitalStatus('fid', metrics.coreWebVitals.fid) === 'needs-improvement' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {metrics.coreWebVitals.fid}ms
                        </div>
                        <p className={`text-sm ${theme.secondary}`}>Response time to first interaction</p>
                      </div>

                      <div className={`p-6 rounded-xl ${theme.card} border ${theme.border}`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className={`font-semibold ${theme.accent}`}>Cumulative Layout Shift</h4>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            getCoreWebVitalStatus('cls', metrics.coreWebVitals.cls) === 'good' ? 'bg-green-100 text-green-800' :
                            getCoreWebVitalStatus('cls', metrics.coreWebVitals.cls) === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {getCoreWebVitalStatus('cls', metrics.coreWebVitals.cls).replace('-', ' ')}
                          </div>
                        </div>
                        <div className={`text-3xl font-bold mb-2 ${
                          getCoreWebVitalStatus('cls', metrics.coreWebVitals.cls) === 'good' ? 'text-green-600' :
                          getCoreWebVitalStatus('cls', metrics.coreWebVitals.cls) === 'needs-improvement' ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {metrics.coreWebVitals.cls.toFixed(3)}
                        </div>
                        <p className={`text-sm ${theme.secondary}`}>Visual stability score</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-lg font-semibold ${theme.accent} mb-4`}>Page Load Metrics</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'First Paint', value: formatTime(metrics.pageMetrics.firstPaint) },
                        { label: 'First Contentful Paint', value: formatTime(metrics.pageMetrics.firstContentfulPaint) },
                        { label: 'DOM Content Loaded', value: formatTime(metrics.pageMetrics.domContentLoaded) },
                        { label: 'Load Complete', value: formatTime(metrics.pageMetrics.loadTime) }
                      ].map((item, index) => (
                        <div key={index} className={`p-4 rounded-xl ${theme.card} border ${theme.border} text-center`}>
                          <div className={`text-2xl font-bold mb-2 ${theme.accent}`}>
                            {item.value}
                          </div>
                          <div className={`text-sm ${theme.secondary}`}>
                            {item.label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-8">
                  <div>
                    <h3 className={`text-lg font-semibold ${theme.accent} mb-4`}>Resource Breakdown</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      <div className={`p-6 rounded-xl ${theme.card} border ${theme.border}`}>
                        <h4 className={`font-semibold ${theme.accent} mb-4`}>Total Size</h4>
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {formatBytes(metrics.resourceMetrics.totalSize)}
                        </div>
                        <p className={`text-sm ${theme.secondary}`}>All resources combined</p>
                      </div>

                      <div className={`p-6 rounded-xl ${theme.card} border ${theme.border}`}>
                        <h4 className={`font-semibold ${theme.accent} mb-4`}>JavaScript</h4>
                        <div className="text-3xl font-bold text-yellow-600 mb-2">
                          {formatBytes(metrics.resourceMetrics.jsSize)}
                        </div>
                        <p className={`text-sm ${theme.secondary}`}>JS bundle size</p>
                      </div>

                      <div className={`p-6 rounded-xl ${theme.card} border ${theme.border}`}>
                        <h4 className={`font-semibold ${theme.accent} mb-4`}>CSS</h4>
                        <div className="text-3xl font-bold text-green-600 mb-2">
                          {formatBytes(metrics.resourceMetrics.cssSize)}
                        </div>
                        <p className={`text-sm ${theme.secondary}`}>Stylesheet size</p>
                      </div>

                      <div className={`p-6 rounded-xl ${theme.card} border ${theme.border}`}>
                        <h4 className={`font-semibold ${theme.accent} mb-4`}>Images</h4>
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                          {formatBytes(metrics.resourceMetrics.imageSize)}
                        </div>
                        <p className={`text-sm ${theme.secondary}`}>Image assets</p>
                      </div>

                      <div className={`p-6 rounded-xl ${theme.card} border ${theme.border}`}>
                        <h4 className={`font-semibold ${theme.accent} mb-4`}>Requests</h4>
                        <div className="text-3xl font-bold text-red-600 mb-2">
                          {metrics.resourceMetrics.requests}
                        </div>
                        <p className={`text-sm ${theme.secondary}`}>HTTP requests</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'suggestions' && (
                <div className="space-y-6">
                  <h3 className={`text-lg font-semibold ${theme.accent} mb-4`}>Optimization Suggestions</h3>
                  <div className="space-y-4">
                    {suggestions.map((suggestion, index) => (
                      <div 
                        key={index}
                        className={`p-6 rounded-xl border-l-4 ${
                          suggestion.type === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                          suggestion.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                          'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        } ${theme.card}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-full ${
                              suggestion.type === 'critical' ? 'text-red-600 bg-red-100' :
                              suggestion.type === 'warning' ? 'text-yellow-600 bg-yellow-100' :
                              'text-blue-600 bg-blue-100'
                            }`}>
                              <AlertCircle className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className={`font-semibold ${theme.accent}`}>{suggestion.title}</h4>
                              <span className={`text-xs uppercase tracking-wide font-medium ${
                                suggestion.type === 'critical' ? 'text-red-600' :
                                suggestion.type === 'warning' ? 'text-yellow-600' :
                                'text-blue-600'
                              }`}>
                                {suggestion.category.replace('-', ' ')}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              suggestion.impact === 'high' ? 'bg-red-100 text-red-800' :
                              suggestion.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {suggestion.impact} impact
                            </span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              suggestion.effort === 'hard' ? 'bg-red-100 text-red-800' :
                              suggestion.effort === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {suggestion.effort} effort
                            </span>
                          </div>
                        </div>
                        <p className={`${theme.secondary} mb-3`}>{suggestion.description}</p>
                        <div className={`p-3 rounded-lg ${theme.code} border ${theme.border}`}>
                          <p className={`text-sm ${theme.text}`}>💡 <strong>Fix:</strong> {suggestion.fix}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center space-y-6">
              <div className="p-8">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className={`text-xl font-bold ${theme.accent} mb-3`}>Ready to Analyze Performance</h3>
                <p className={`${theme.secondary} mb-6 max-w-md mx-auto`}>
                  Get comprehensive insights into your site's performance, user experience, and optimization opportunities
                </p>
                <button
                  onClick={loadPerformanceData}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl font-semibold text-lg"
                >
                  🚀 Load Performance Data
                </button>
                <p className={`text-xs ${theme.secondary} mt-4 italic`}>
                  Demo mode: Showing sample data for demonstration
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 