export interface AnalyticsEvent {
  type: 'page_view' | 'scroll_depth' | 'reading_time' | 'search' | 'theme_change' | 'share';
  page?: string;
  data?: Record<string, unknown>;
  timestamp: number;
}

export interface PageAnalytics {
  slug: string;
  title: string;
  views: number;
  averageReadingTime: number;
  scrollDepth: number;
  shares: number;
  lastViewed: number;
}

class Analytics {
  private events: AnalyticsEvent[] = [];
  private isClient = typeof window !== 'undefined';

  constructor() {
    if (this.isClient) {
      this.loadStoredEvents();
      this.setupBeforeUnload();
    }
  }

  private loadStoredEvents() {
    try {
      const stored = localStorage.getItem('zyros-analytics');
      if (stored) {
        this.events = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load analytics data:', error);
    }
  }

  private saveEvents() {
    if (!this.isClient) return;
    try {
      // Keep only last 1000 events to prevent storage bloat
      const recentEvents = this.events.slice(-1000);
      localStorage.setItem('zyros-analytics', JSON.stringify(recentEvents));
    } catch (error) {
      console.warn('Failed to save analytics data:', error);
    }
  }

  private setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      this.saveEvents();
    });
  }

  track(event: Omit<AnalyticsEvent, 'timestamp'>) {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now()
    };
    
    this.events.push(fullEvent);
    this.saveEvents();
  }

  trackPageView(page: string) {
    this.track({
      type: 'page_view',
      page,
      data: {
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    });
  }

  trackScrollDepth(page: string, depth: number) {
    this.track({
      type: 'scroll_depth',
      page,
      data: { depth }
    });
  }

  trackReadingTime(page: string, timeSpent: number) {
    this.track({
      type: 'reading_time',
      page,
      data: { timeSpent }
    });
  }

  trackSearch(query: string, results: number) {
    this.track({
      type: 'search',
      data: { query, results }
    });
  }

  trackThemeChange(theme: string) {
    this.track({
      type: 'theme_change',
      data: { theme }
    });
  }

  trackShare(page: string, platform: string) {
    this.track({
      type: 'share',
      page,
      data: { platform }
    });
  }

  getPageAnalytics(): PageAnalytics[] {
    const pageStats = new Map<string, PageAnalytics>();

    this.events.forEach(event => {
      if (!event.page) return;

      if (!pageStats.has(event.page)) {
        pageStats.set(event.page, {
          slug: event.page,
          title: event.page,
          views: 0,
          averageReadingTime: 0,
          scrollDepth: 0,
          shares: 0,
          lastViewed: 0
        });
      }

      const stats = pageStats.get(event.page)!;

      switch (event.type) {
        case 'page_view':
          stats.views++;
          stats.lastViewed = Math.max(stats.lastViewed, event.timestamp);
          break;
        case 'reading_time':
          const timeSpent = (event.data?.timeSpent as number) || 0;
          stats.averageReadingTime = (stats.averageReadingTime + timeSpent) / 2;
          break;
        case 'scroll_depth':
          const depth = (event.data?.depth as number) || 0;
          stats.scrollDepth = Math.max(stats.scrollDepth, depth);
          break;
        case 'share':
          stats.shares++;
          break;
      }
    });

    return Array.from(pageStats.values()).sort((a, b) => b.views - a.views);
  }

  getSearchAnalytics() {
    const searches = this.events.filter(e => e.type === 'search');
    const queries = new Map<string, number>();
    
    searches.forEach(search => {
      const query = (search.data?.query as string)?.toLowerCase() || '';
      queries.set(query, (queries.get(query) || 0) + 1);
    });

    return Array.from(queries.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }

  getThemeAnalytics() {
    const themeChanges = this.events.filter(e => e.type === 'theme_change');
    const themes = new Map<string, number>();
    
    themeChanges.forEach(change => {
      const theme = (change.data?.theme as string) || '';
      themes.set(theme, (themes.get(theme) || 0) + 1);
    });

    return Array.from(themes.entries())
      .map(([theme, count]) => ({ theme, count }))
      .sort((a, b) => b.count - a.count);
  }

  getTotalViews(): number {
    return this.events.filter(e => e.type === 'page_view').length;
  }

  getUniquePages(): number {
    const pages = new Set(this.events.filter(e => e.page).map(e => e.page));
    return pages.size;
  }

  exportData(): string {
    return JSON.stringify(this.events, null, 2);
  }

  clearData() {
    this.events = [];
    if (this.isClient) {
      localStorage.removeItem('zyros-analytics');
    }
  }
}

export const analytics = new Analytics(); 