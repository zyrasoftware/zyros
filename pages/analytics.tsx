import { GetStaticProps } from 'next';
import { useState, useEffect } from 'react';
import { BarChart3, Eye, Share2, Search, TrendingUp, Download, Trash2 } from '../components/Icons';
import Layout from '../components/Layout';
import { loadSiteData, SiteData } from '../lib/contentLoader';
import { analytics, PageAnalytics } from '../lib/analytics';
import { getTheme } from '../styles/themes';

interface AnalyticsProps {
  siteData: SiteData;
}

export default function Analytics({ siteData }: AnalyticsProps) {
  const theme = getTheme(siteData.site.theme || 'light');
  const [pageAnalytics, setPageAnalytics] = useState<PageAnalytics[]>([]);
  const [searchAnalytics, setSearchAnalytics] = useState<Array<{ query: string; count: number }>>([]);
  const [themeAnalytics, setThemeAnalytics] = useState<Array<{ theme: string; count: number }>>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [uniquePages, setUniquePages] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    setPageAnalytics(analytics.getPageAnalytics());
    setSearchAnalytics(analytics.getSearchAnalytics());
    setThemeAnalytics(analytics.getThemeAnalytics());
    setTotalViews(analytics.getTotalViews());
    setUniquePages(analytics.getUniquePages());
  };

  const exportData = () => {
    const data = analytics.exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zyros-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (confirm('Are you sure you want to clear all analytics data? This action cannot be undone.')) {
      analytics.clearData();
      loadAnalyticsData();
    }
  };

  if (!isClient) {
    return (
      <Layout siteConfig={siteData} theme={theme} pages={siteData.pages}>
        <div className="flex items-center justify-center min-h-screen">
          <div className={`text-center ${theme.secondary}`}>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            Loading analytics...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout siteConfig={siteData} theme={theme} pages={siteData.pages}>
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className={`inline-flex items-center px-6 py-3 rounded-full text-sm font-medium ${theme.code} mb-6 shadow-lg`}>
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics Dashboard
          </div>
          <h1 className={`text-4xl lg:text-5xl font-bold mb-4 ${theme.accent}`}>
            Blog Performance Insights
          </h1>
          <p className={`text-xl ${theme.secondary} max-w-3xl mx-auto`}>
            Track your content performance, understand your audience, and optimize your blog for better engagement
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-2xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-blue-500/10 text-blue-500`}>
                <Eye className="w-6 h-6" />
              </div>
              <div className={`text-3xl font-bold ${theme.accent}`}>
                {totalViews.toLocaleString()}
              </div>
            </div>
            <div className={`text-sm ${theme.secondary}`}>Total Page Views</div>
          </div>

          <div className={`p-6 rounded-2xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-green-500/10 text-green-500`}>
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className={`text-3xl font-bold ${theme.accent}`}>
                {uniquePages}
              </div>
            </div>
            <div className={`text-sm ${theme.secondary}`}>Unique Pages Viewed</div>
          </div>

          <div className={`p-6 rounded-2xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-purple-500/10 text-purple-500`}>
                <Search className="w-6 h-6" />
              </div>
              <div className={`text-3xl font-bold ${theme.accent}`}>
                {searchAnalytics.length}
              </div>
            </div>
            <div className={`text-sm ${theme.secondary}`}>Search Queries</div>
          </div>

          <div className={`p-6 rounded-2xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-orange-500/10 text-orange-500`}>
                <Share2 className="w-6 h-6" />
              </div>
              <div className={`text-3xl font-bold ${theme.accent}`}>
                {pageAnalytics.reduce((sum, page) => sum + page.shares, 0)}
              </div>
            </div>
            <div className={`text-sm ${theme.secondary}`}>Total Shares</div>
          </div>
        </div>

        {/* Page Performance */}
        <div className={`p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-xl`}>
          <div className="flex items-center justify-between mb-8">
            <h2 className={`text-2xl font-bold ${theme.accent}`}>Page Performance</h2>
            <div className={`px-4 py-2 rounded-full ${theme.code} text-sm font-medium`}>
              {pageAnalytics.length} pages tracked
            </div>
          </div>

          {pageAnalytics.length === 0 ? (
            <div className={`text-center py-12 ${theme.secondary}`}>
              <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No page views recorded yet</p>
              <p className="text-sm opacity-75">Start browsing your site to see analytics data</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pageAnalytics.slice(0, 10).map((page, index) => (
                <div key={page.slug} className={`p-6 rounded-2xl ${theme.code} border hover:shadow-lg transition-all duration-300`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center`}>
                        {index + 1}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${theme.text}`}>
                          {siteData.pages.find(p => p.slug === page.slug)?.title || page.slug}
                        </h3>
                        <p className={`text-sm ${theme.secondary}`}>/{page.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <div className={`font-bold ${theme.accent}`}>{page.views}</div>
                        <div className={`${theme.secondary}`}>Views</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${theme.accent}`}>{Math.round(page.averageReadingTime)}s</div>
                        <div className={`${theme.secondary}`}>Avg Time</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${theme.accent}`}>{Math.round(page.scrollDepth)}%</div>
                        <div className={`${theme.secondary}`}>Scroll</div>
                      </div>
                      <div className="text-center">
                        <div className={`font-bold ${theme.accent}`}>{page.shares}</div>
                        <div className={`${theme.secondary}`}>Shares</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress bars */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className={`text-xs ${theme.secondary} w-16`}>Engagement</span>
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(page.scrollDepth, 100)}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs ${theme.secondary} w-12`}>{Math.round(page.scrollDepth)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Analytics */}
        {searchAnalytics.length > 0 && (
          <div className={`p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-xl`}>
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-2xl font-bold ${theme.accent}`}>Popular Search Queries</h2>
              <div className={`px-4 py-2 rounded-full ${theme.code} text-sm font-medium`}>
                {searchAnalytics.reduce((sum, item) => sum + item.count, 0)} total searches
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {searchAnalytics.slice(0, 10).map((item, searchIndex) => (
                <div key={item.query} className={`p-4 rounded-xl ${theme.code} border flex items-center justify-between`}>
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-blue-500 text-white text-xs font-bold flex items-center justify-center`}>
                      {searchIndex + 1}
                    </div>
                    <span className={`font-medium ${theme.text}`}>{item.query || 'Empty query'}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-sm font-medium`}>
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Theme Analytics */}
        {themeAnalytics.length > 0 && (
          <div className={`p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-xl`}>
            <div className="flex items-center justify-between mb-8">
              <h2 className={`text-2xl font-bold ${theme.accent}`}>Theme Preferences</h2>
              <div className={`px-4 py-2 rounded-full ${theme.code} text-sm font-medium`}>
                {themeAnalytics.reduce((sum, item) => sum + item.count, 0)} theme changes
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {themeAnalytics.map((item) => (
                <div key={item.theme} className={`p-4 rounded-xl ${theme.code} border text-center`}>
                  <div className={`w-8 h-8 rounded-full mx-auto mb-3`} style={{
                    background: item.theme === 'dark' ? '#1f2937' : 
                               item.theme === 'light' ? '#f9fafb' :
                               item.theme === 'ocean' ? '#0891b2' :
                               item.theme === 'sunset' ? '#ea580c' :
                               item.theme === 'forest' ? '#059669' :
                               item.theme === 'midnight' ? '#4c1d95' :
                               item.theme === 'neon' ? '#10b981' : '#6b7280'
                  }}></div>
                  <div className={`font-medium ${theme.text} capitalize mb-1`}>{item.theme}</div>
                  <div className={`text-sm ${theme.secondary}`}>{item.count} uses</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Management */}
        <div className={`p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-xl`}>
          <h2 className={`text-2xl font-bold ${theme.accent} mb-6`}>Data Management</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={exportData}
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-blue-500 text-white hover:bg-blue-600 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Download className="w-5 h-5 mr-2" />
              Export Analytics Data
            </button>
            <button
              onClick={clearData}
              className="inline-flex items-center px-6 py-3 rounded-xl font-semibold transition-all duration-300 bg-red-500 text-white hover:bg-red-600 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Clear All Data
            </button>
          </div>
          <p className={`text-sm ${theme.secondary} mt-4`}>
            Analytics data is stored locally in your browser. Export your data before clearing or switching browsers.
          </p>
        </div>
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