import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
import { Theme } from '../styles/themes';
import { Page } from '../lib/contentLoader';
import ReadingProgress from './ReadingProgress';
import TableOfContents from './TableOfContents';
import CopyCodeButton from './CopyCodeButton';
import SocialShare from './SocialShare';
import Newsletter from './Newsletter';
import { Tag, Clock, Calendar } from './Icons';

interface PageRendererProps {
  page: Page;
  theme: Theme;
}

export default function PageRenderer({ page, theme }: PageRendererProps) {
  return (
    <>
      <ReadingProgress theme={theme} />
      <TableOfContents content={page.content} theme={theme} />
      
      <div className="max-w-4xl mx-auto px-4">
        {/* Article Header */}
        <header className="mb-16 text-center animate-fade-in-up">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${theme.code} mb-6`}>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Article
        </div>
        
        <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 ${theme.accent} leading-tight`}>
          {page.title}
        </h1>
        
        {page.description && (
          <p className={`text-xl lg:text-2xl ${theme.secondary} max-w-3xl mx-auto leading-relaxed mb-8`}>
            {page.description}
          </p>
        )}
        
        {/* Article Meta */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-8">
          {page.publishedAt && (
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span className={`text-sm ${theme.secondary}`}>
                {new Date(page.publishedAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span className={`text-sm ${theme.secondary}`}>
              {page.readingTime || Math.ceil(page.content.split(' ').length / 200)} min read
            </span>
          </div>
          {page.category && (
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${theme.code} capitalize`}>
              {page.category}
            </div>
          )}
        </div>

        {/* Tags */}
        {page.tags && page.tags.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {page.tags.map((tag) => (
              <span 
                key={tag}
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${theme.card} ${theme.border} border ${theme.secondary} hover:${theme.accent} transition-colors`}
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Article Content */}
      <article className={`prose prose-lg max-w-none animate-fade-in ${getMarkdownStyles(theme)}`}>
        <ReactMarkdown
          components={{
            h1: ({ children }) => {
              const id = String(children).toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
              return (
                <h1 id={id} className={`text-3xl font-bold mt-12 mb-6 ${theme.accent} leading-tight scroll-mt-20`}>
                  {children}
                </h1>
              );
            },
            h2: ({ children }) => {
              const id = String(children).toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
              return (
                <h2 id={id} className={`text-2xl font-semibold mt-10 mb-4 ${theme.accent} leading-tight scroll-mt-20`}>
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => {
              const id = String(children).toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
              return (
                <h3 id={id} className={`text-xl font-semibold mt-8 mb-3 ${theme.accent} leading-tight scroll-mt-20`}>
                  {children}
                </h3>
              );
            },
            h4: ({ children }) => {
              const id = String(children).toLowerCase()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .trim();
              return (
                <h4 id={id} className={`text-lg font-semibold mt-6 mb-2 ${theme.accent} scroll-mt-20`}>
                  {children}
                </h4>
              );
            },
            p: ({ children }) => (
              <p className={`mb-6 leading-relaxed text-lg ${theme.text}`}>
                {children}
              </p>
            ),
            a: ({ href, children }) => (
              <a 
                href={href} 
                className={`${theme.link} underline decoration-2 underline-offset-2 hover:decoration-4 transition-all duration-200 font-medium`}
                target={href?.startsWith('http') ? '_blank' : undefined}
                rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {children}
              </a>
            ),
            ul: ({ children }) => (
              <ul className={`list-none space-y-2 mb-6 ${theme.text}`}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className={`list-decimal list-inside space-y-2 mb-6 ${theme.text} ml-4`}>
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li className="flex items-start">
                <span className={`inline-block w-2 h-2 rounded-full ${theme.accent.replace('text-', 'bg-')} mt-3 mr-3 flex-shrink-0`}></span>
                <span className="flex-1">{children}</span>
              </li>
            ),
            blockquote: ({ children }) => (
              <blockquote className={`border-l-4 border-blue-500 pl-6 py-4 my-8 ${theme.secondary} italic bg-blue-50/50 dark:bg-blue-900/10 rounded-r-lg`}>
                <div className="text-blue-600 mb-2">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>
                {children}
              </blockquote>
            ),
            code: ({ children, ...props }) => {
              const inline = !props.className;
              if (inline) {
                return (
                  <code className={`px-2 py-1 rounded-md text-sm font-mono ${theme.code} border`}>
                    {children}
                  </code>
                );
              }
              const codeString = String(children).replace(/\n$/, '');
              return (
                <div className="relative group">
                  <pre className={`p-6 rounded-xl text-sm overflow-x-auto ${theme.code} border shadow-lg`}>
                    <code className="font-mono">
                      {children}
                    </code>
                  </pre>
                  <div className={`absolute top-4 right-16 text-xs ${theme.secondary}`}>
                    {props.className?.replace('language-', '') || 'code'}
                  </div>
                  <CopyCodeButton code={codeString} theme={theme} />
                </div>
              );
            },
            pre: ({ children }) => (
              <div className="my-6">
                {children}
              </div>
            ),
            hr: () => (
              <hr className={`my-12 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent dark:via-gray-600`} />
            ),
            strong: ({ children }) => (
              <strong className={`font-semibold ${theme.accent}`}>
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em className={`italic ${theme.secondary}`}>
                {children}
              </em>
            ),
            img: ({ src, alt }) => (
              <div className="my-8">
                <Image 
                  src={typeof src === 'string' ? src : ''} 
                  alt={alt || ''} 
                  width={800}
                  height={400}
                  className="w-full rounded-xl shadow-lg border"
                  unoptimized
                />
                {alt && (
                  <p className={`text-center text-sm ${theme.secondary} mt-2 italic`}>
                    {alt}
                  </p>
                )}
              </div>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto my-8">
                <table className={`w-full border-collapse ${theme.card} rounded-lg overflow-hidden shadow-lg`}>
                  {children}
                </table>
              </div>
            ),
            thead: ({ children }) => (
              <thead className={`${theme.code}`}>
                {children}
              </thead>
            ),
            tbody: ({ children }) => (
              <tbody>
                {children}
              </tbody>
            ),
            tr: ({ children }) => (
              <tr className={`border-b ${theme.border}`}>
                {children}
              </tr>
            ),
            th: ({ children }) => (
              <th className={`px-6 py-4 text-left font-semibold ${theme.accent}`}>
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className={`px-6 py-4 ${theme.text}`}>
                {children}
              </td>
            ),
          }}
        >
          {page.content}
        </ReactMarkdown>
      </article>

      {/* Social Sharing */}
      <div className="mt-16 flex justify-center">
        <SocialShare 
          title={page.title}
          url={`/${page.slug}`}
          description={page.description}
          theme={theme}
          slug={page.slug}
        />
      </div>

      {/* Newsletter Subscription */}
      <div className="mt-16">
        <Newsletter theme={theme} />
      </div>

      {/* Article Footer */}
      <footer className={`mt-16 pt-8 border-t ${theme.border}`}>
        <div className="text-center">
          <p className={`text-sm ${theme.secondary} mb-4`}>
            Thanks for reading! This article was generated using zyros.
          </p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className={`px-4 py-2 rounded-lg ${theme.card} border ${theme.border} ${theme.text} hover:${theme.accent} transition-colors text-sm`}
            >
              Back to Top
            </button>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}

function getMarkdownStyles(theme: Theme): string {
  return `
    ${theme.text}
    prose-headings:${theme.accent}
    prose-a:${theme.link}
    prose-strong:${theme.accent}
    prose-code:${theme.code}
    prose-pre:${theme.code}
    prose-blockquote:${theme.secondary}
  `;
} 