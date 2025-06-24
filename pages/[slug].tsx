import { GetStaticProps, GetStaticPaths } from 'next';
import { useEffect } from 'react';
import Layout from '../components/Layout';
import PageRenderer from '../components/PageRenderer';
import { loadSiteData, getPageBySlug, getAllPageSlugs, Page, SiteData } from '../lib/contentLoader';
import { getTheme } from '../styles/themes';
import { analytics } from '../lib/analytics';

interface PageProps {
  page: Page;
  siteData: SiteData;
}

export default function DynamicPage({ page, siteData }: PageProps) {
  const theme = getTheme(siteData.site.theme || 'light');

  // Track page view and reading time
  useEffect(() => {
    analytics.trackPageView(page.slug);
    
    const startTime = Date.now();
    let maxScroll = 0;
    
    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      maxScroll = Math.max(maxScroll, scrollPercent);
      analytics.trackScrollDepth(page.slug, maxScroll);
    };

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      analytics.trackReadingTime(page.slug, timeSpent);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Track reading time on component unmount
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      analytics.trackReadingTime(page.slug, timeSpent);
    };
  }, [page.slug]);

  return (
    <Layout 
      siteConfig={siteData} 
      theme={theme} 
      pages={siteData.pages}
      currentPage={page}
    >
      <PageRenderer page={page} theme={theme} uiConfig={siteData.ui || undefined} />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const slugs = getAllPageSlugs();
    
    const paths = slugs.map((slug) => ({
      params: { slug },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error generating static paths:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    
    if (!slug) {
      return {
        notFound: true,
      };
    }

    const page = getPageBySlug(slug);
    const siteData = loadSiteData();
    
    if (!page) {
      return {
        notFound: true,
      };
    }

    // Remove undefined values to prevent serialization issues
    const cleanSiteData = JSON.parse(JSON.stringify(siteData));
    
    return {
      props: {
        page,
        siteData: cleanSiteData,
      },
    };
  } catch (error) {
    console.error('Error loading page data:', error);
    return {
      notFound: true,
    };
  }
}; 