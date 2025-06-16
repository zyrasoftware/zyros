import React from 'react';
import Image from 'next/image';
import { Page, ContentBlock, FormConfig } from '../types/site';
import { Theme } from '../styles/themes';
import ContentBlocks from './ContentBlocks';
import FormBuilder from './FormBuilder';

interface DynamicPageRendererProps {
  page: Page;
  theme: Theme;
  contentBlocks: ContentBlock[];
  forms?: FormConfig[];
}

export default function DynamicPageRenderer({ page, theme, contentBlocks, forms }: DynamicPageRendererProps) {
  const pageContentBlocks = contentBlocks.filter(block => 
    page.contentBlocks?.includes(block.id)
  );

  const renderPageContent = () => {
    switch (page.layout) {
      case 'grid':
        return <GridLayout page={page} theme={theme} contentBlocks={pageContentBlocks} forms={forms} />;
      case 'masonry':
        return <MasonryLayout page={page} theme={theme} contentBlocks={pageContentBlocks} />;
      case 'split':
        return <SplitLayout page={page} theme={theme} contentBlocks={pageContentBlocks} />;
      case 'magazine':
        return <MagazineLayout page={page} theme={theme} contentBlocks={pageContentBlocks} />;
      case 'portfolio':
        return <PortfolioLayout page={page} theme={theme} contentBlocks={pageContentBlocks} />;
      case 'landing':
        return <LandingLayout page={page} theme={theme} contentBlocks={pageContentBlocks} forms={forms} />;
      case 'minimal':
        return <MinimalLayout page={page} theme={theme} contentBlocks={pageContentBlocks} />;
      case 'full-width':
        return <FullWidthLayout page={page} theme={theme} contentBlocks={pageContentBlocks} />;
      case 'sidebar':
        return <SidebarLayout page={page} theme={theme} contentBlocks={pageContentBlocks} forms={forms} />;
      default:
        return <DefaultLayout page={page} theme={theme} contentBlocks={pageContentBlocks} forms={forms} />;
    }
  };

  return (
    <div className={`min-h-screen ${theme.background}`}>
      {renderPageContent()}
    </div>
  );
}

function DefaultLayout({ page, theme, contentBlocks, forms }: DynamicPageRendererProps) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className={`prose prose-lg max-w-none ${theme.text}`}>
        <PageHeader page={page} theme={theme} />
        
        {contentBlocks.length > 0 && (
          <div className="mb-12">
            <ContentBlocks blocks={contentBlocks} theme={theme} />
          </div>
        )}

        <div 
          className={`${theme.text} leading-relaxed prose prose-lg max-w-none`}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />

        {page.customFields?.showContactForm === true && forms && forms.length > 0 && (
          <div className="mt-12">
            <FormBuilder form={forms[0]} theme={theme} />
          </div>
        )}
      </article>
    </div>
  );
}

function GridLayout({ page, theme, contentBlocks, forms }: DynamicPageRendererProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader page={page} theme={theme} centered />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
        <div className="lg:col-span-8">
          {contentBlocks.length > 0 && (
            <ContentBlocks blocks={contentBlocks} theme={theme} />
          )}
          <div 
            className={`${theme.text} prose prose-lg max-w-none mt-8`}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
        
        <aside className="lg:col-span-4">
          <div className={`sticky top-8 space-y-8 p-6 rounded-2xl ${theme.card} border ${theme.border}`}>
            <PageInfo page={page} theme={theme} />
            {forms && forms.length > 0 && (
              <FormBuilder form={forms[0]} theme={theme} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function MasonryLayout({ page, theme, contentBlocks }: DynamicPageRendererProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader page={page} theme={theme} centered />
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8 mt-12">
        {contentBlocks.map((block) => (
          <div key={block.id} className="break-inside-avoid mb-8">
            <ContentBlocks blocks={[block]} theme={theme} />
          </div>
        ))}
        
        <div 
          className={`break-inside-avoid ${theme.text} prose prose-lg max-w-none`}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}

function SplitLayout({ page, theme, contentBlocks }: DynamicPageRendererProps) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-12">
        <div className="max-w-lg">
          <h1 className={`text-4xl md:text-5xl font-bold ${theme.accent} mb-6`}>
            {page.title}
          </h1>
          {page.description && (
            <p className={`text-xl ${theme.secondary} mb-8`}>
              {page.description}
            </p>
          )}
          <div 
            className={`${theme.text} prose prose-lg max-w-none`}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
      
      <div className={`lg:w-1/2 ${theme.card} p-8 lg:p-12 overflow-y-auto`}>
        {contentBlocks.length > 0 && (
          <ContentBlocks blocks={contentBlocks} theme={theme} />
        )}
      </div>
    </div>
  );
}

function MagazineLayout({ page, theme, contentBlocks }: DynamicPageRendererProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className={`text-4xl md:text-6xl font-bold ${theme.accent} mb-6 leading-tight`}>
              {page.title}
            </h1>
            {page.description && (
              <p className={`text-xl ${theme.secondary} mb-6`}>
                {page.description}
              </p>
            )}
            <PageMeta page={page} theme={theme} />
          </div>
          
          {page.image && (
            <div className="relative h-96 rounded-2xl overflow-hidden">
              <Image 
                src={page.image} 
                alt={page.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div 
            className={`${theme.text} prose prose-lg max-w-none mb-12`}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
        
        <aside className="space-y-8">
          {contentBlocks.length > 0 && (
            <ContentBlocks blocks={contentBlocks} theme={theme} />
          )}
        </aside>
      </div>
    </div>
  );
}

function PortfolioLayout({ page, theme, contentBlocks }: DynamicPageRendererProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader page={page} theme={theme} centered />
      
      {contentBlocks.length > 0 && (
        <div className="mt-16">
          <ContentBlocks blocks={contentBlocks} theme={theme} />
        </div>
      )}

      <div 
        className={`${theme.text} prose prose-lg max-w-none text-center mt-16`}
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </div>
  );
}

function LandingLayout({ page, theme, contentBlocks, forms }: DynamicPageRendererProps) {
  return (
    <div className="min-h-screen">
      {contentBlocks.length > 0 && (
        <ContentBlocks blocks={contentBlocks} theme={theme} />
      )}
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div 
          className={`${theme.text} prose prose-lg max-w-none text-center`}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
        
        {forms && forms.length > 0 && (
          <div className="mt-16">
            <FormBuilder form={forms[0]} theme={theme} />
          </div>
        )}
      </div>
    </div>
  );
}

function MinimalLayout({ page, theme, contentBlocks }: DynamicPageRendererProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <article className="text-center">
        <h1 className={`text-4xl md:text-5xl font-bold ${theme.accent} mb-8`}>
          {page.title}
        </h1>
        
        {page.description && (
          <p className={`text-xl ${theme.secondary} mb-12 max-w-2xl mx-auto`}>
            {page.description}
          </p>
        )}
        
        {contentBlocks.length > 0 && (
          <div className="mb-12">
            <ContentBlocks blocks={contentBlocks} theme={theme} />
          </div>
        )}
        
        <div 
          className={`${theme.text} prose prose-lg max-w-none mx-auto text-left`}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </article>
    </div>
  );
}

function FullWidthLayout({ page, theme, contentBlocks }: DynamicPageRendererProps) {
  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <PageHeader page={page} theme={theme} centered />
      </div>
      
      {contentBlocks.length > 0 && (
        <ContentBlocks blocks={contentBlocks} theme={theme} />
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div 
          className={`${theme.text} prose prose-lg max-w-none`}
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>
    </div>
  );
}

function SidebarLayout({ page, theme, contentBlocks, forms }: DynamicPageRendererProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
                     <div className={`sticky top-8 space-y-6 p-6 rounded-2xl ${theme.card} border ${theme.border}`}>
             <PageInfo page={page} theme={theme} />
             {forms && forms.length > 0 && (
               <FormBuilder form={forms[0]} theme={theme} />
             )}
           </div>
        </aside>
        
        <div className="lg:col-span-3">
          <PageHeader page={page} theme={theme} />
          
          {contentBlocks.length > 0 && (
            <div className="mb-12">
              <ContentBlocks blocks={contentBlocks} theme={theme} />
            </div>
          )}
          
          <div 
            className={`${theme.text} prose prose-lg max-w-none`}
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </div>
  );
}

// Helper components
function PageHeader({ page, theme, centered = false }: { page: Page; theme: Theme; centered?: boolean }) {
  return (
    <header className={centered ? 'text-center mb-16' : 'mb-12'}>
      <h1 className={`text-4xl md:text-5xl font-bold ${theme.accent} mb-4`}>
        {page.title}
      </h1>
      {page.description && (
        <p className={`text-xl ${theme.secondary} mb-6 ${centered ? 'max-w-3xl mx-auto' : ''}`}>
          {page.description}
        </p>
      )}
      <PageMeta page={page} theme={theme} />
    </header>
  );
}

function PageMeta({ page, theme }: { page: Page; theme: Theme }) {
  return (
    <div className={`flex flex-wrap gap-4 text-sm ${theme.secondary}`}>
      {page.publishedAt && (
        <time dateTime={page.publishedAt}>
          {new Date(page.publishedAt).toLocaleDateString()}
        </time>
      )}
      {page.readingTime && (
        <span>{page.readingTime} min read</span>
      )}
      {page.category && (
        <span className={`px-3 py-1 rounded-full ${theme.card} border ${theme.border}`}>
          {page.category}
        </span>
      )}
    </div>
  );
}

function PageInfo({ page, theme }: { page: Page; theme: Theme }) {
  return (
    <div>
      <h3 className={`text-lg font-semibold ${theme.accent} mb-4`}>
        Page Info
      </h3>
      <div className={`space-y-2 text-sm ${theme.secondary}`}>
        {page.publishedAt && (
          <div>Published: {new Date(page.publishedAt).toLocaleDateString()}</div>
        )}
        {page.readingTime && (
          <div>Reading time: {page.readingTime} minutes</div>
        )}
        {page.tags && (
          <div className="flex flex-wrap gap-2 mt-4">
            {page.tags.map(tag => (
              <span 
                key={tag}
                className={`px-2 py-1 rounded-md ${theme.background} border ${theme.border} text-xs`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 