import React, { useState, useRef, useCallback, useMemo } from 'react';
import { Palette, Plus, Move, Trash2, Eye, Code, Save, Download, X } from './Icons';
import { Theme } from '../styles/themes';
import { ContentBlock, SiteConfig } from '../types/site';

interface VisualPageBuilderProps {
  theme: Theme;
  onSavePage: (pageData: any) => void;
}

interface BuilderBlock {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'cta' | 'gallery' | 'stats' | 'team' | 'faq' | 'pricing' | 'contact';
  name: string;
  icon: string;
  data: any;
  position: number;
}

interface DragState {
  isDragging: boolean;
  draggedBlock: BuilderBlock | null;
  dragOverIndex: number | null;
}

interface SiteSettings {
  title: string;
  description: string;
  theme: string;
  author: string;
  url: string;
  language: string;
  favicon: string;
  logo: string;
  layout: string;
  social: {
    twitter: string;
    github: string;
    linkedin: string;
    email: string;
    facebook: string;
    instagram: string;
  };
}

const availableBlocks: Omit<BuilderBlock, 'id' | 'position' | 'data'>[] = [
  { type: 'hero', name: 'Hero Section', icon: '🚀' },
  { type: 'features', name: 'Features Grid', icon: '⚡' },
  { type: 'testimonials', name: 'Testimonials', icon: '💬' },
  { type: 'cta', name: 'Call to Action', icon: '📢' },
  { type: 'gallery', name: 'Image Gallery', icon: '🖼️' },
  { type: 'stats', name: 'Statistics', icon: '📊' },
  { type: 'team', name: 'Team Section', icon: '👥' },
  { type: 'faq', name: 'FAQ Section', icon: '❓' },
  { type: 'pricing', name: 'Pricing Table', icon: '💰' },
  { type: 'contact', name: 'Contact Form', icon: '📞' }
];

const themeOptions = [
  'light', 'dark', 'minimal', 'ocean', 'sunset', 'forest', 
  'midnight', 'neon', 'aurora', 'autumn', 'cyberpunk', 'sakura'
];

export default function VisualPageBuilder({ theme, onSavePage }: VisualPageBuilderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState<'builder' | 'settings' | 'pages'>('builder');
  const [pageBlocks, setPageBlocks] = useState<BuilderBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<BuilderBlock | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedBlock: null,
    dragOverIndex: null
  });
  
  // Site settings with enhanced validation
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: 'My Awesome Website',
    description: 'A beautiful website built with Zyros',
    theme: 'ocean',
    author: 'Website Owner',
    url: 'https://mywebsite.com',
    language: 'en',
    favicon: '/favicon.svg',
    logo: '/logo.png',
    layout: 'default',
    social: {
      twitter: '',
      github: '',
      linkedin: '',
      email: '',
      facebook: '',
      instagram: ''
    }
  });

  // Enhanced pages management with validation
  const [pages, setPages] = useState([
    {
      title: 'Home Page',
      slug: 'index',
      description: 'Welcome to our website',
      content: '# Welcome to My Website\n\nThis is the home page of my awesome website built with Zyros.',
      layout: 'default',
      contentBlocks: [] as string[]
    }
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const dragRef = useRef<HTMLDivElement>(null);

  // Memoized utility functions for better performance
  const generateBlockId = useCallback(() => {
    return `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Enhanced block data with better defaults and validation
  const getDefaultBlockData = useCallback((type: string): any => {
    const blockDataMap: Record<string, any> = {
      hero: {
        title: 'Welcome to Our Amazing Product',
        subtitle: '✨ New Launch',
        content: 'Transform your business with our cutting-edge solution that delivers results.',
        data: {
          backgroundImage: '/hero-bg.jpg',
          buttons: [
            { text: 'Get Started Free', href: '/getting-started', style: 'primary' },
            { text: 'View Examples', href: '/examples', style: 'outline' }
          ],
          features: [
            'No coding required',
            'Lightning fast',
            'SEO optimized',
            'Mobile responsive'
          ]
        }
      },
      features: {
        title: 'Powerful Features',
        subtitle: 'Everything you need',
        content: 'Built-in components and features that make creating websites effortless and enjoyable.',
        data: {
          layout: 'grid',
          features: [
            {
              title: 'Fast Performance',
              description: 'Lightning-fast load times and smooth interactions.',
              icon: '⚡'
            },
            {
              title: 'Secure & Reliable',
              description: 'Bank-level security with 99.9% uptime guarantee.',
              icon: '🔒'
            },
            {
              title: '24/7 Support',
              description: 'Round-the-clock customer support when you need it.',
              icon: '🛟'
            }
          ]
        }
      },
      testimonials: {
        title: 'What Our Customers Say',
        content: 'Don\'t just take our word for it - see what our customers have to say.',
        data: {
          testimonials: [
            {
              name: 'Sarah Johnson',
              role: 'CEO, TechCorp',
              content: 'This product completely transformed our workflow. Highly recommended!',
              avatar: '/avatar1.jpg',
              rating: 5
            },
            {
              name: 'Michael Chen',
              role: 'CTO, InnovateLabs',
              content: 'Outstanding quality and excellent customer service. Worth every penny.',
              avatar: '/avatar2.jpg',
              rating: 5
            }
          ]
        }
      },
      stats: {
        title: 'Trusted by Developers Worldwide',
        content: 'Join thousands of developers who have already discovered the power of our platform.',
        data: {
          stats: [
            {
              value: '10,000+',
              label: 'Websites Created',
              description: 'Built with our platform',
              icon: '🌐'
            },
            {
              value: '50+',
              label: 'Components',
              description: 'Ready to use',
              icon: '🧱'
            },
            {
              value: '99.9%',
              label: 'Uptime',
              description: 'Reliable performance',
              icon: '⚡'
            }
          ]
        }
      },
      cta: {
        title: 'Ready to Get Started?',
        content: 'Join thousands of satisfied customers and transform your business today.',
        data: {
          button: { text: 'Start Free Trial', href: '#', style: 'primary' },
          backgroundColor: 'gradient'
        }
      },
      pricing: {
        title: 'Simple, Transparent Pricing',
        subtitle: 'Choose the Perfect Plan',
        content: 'Start free and scale as you grow. All plans include our core features with no hidden fees.',
        data: {
          plans: [
            {
              name: 'Free',
              price: '$0',
              period: 'forever',
              description: 'Perfect for personal projects',
              features: [
                'Up to 3 websites',
                'Basic themes',
                'Community support'
              ],
              buttonText: 'Get Started Free',
              buttonLink: '/signup'
            },
            {
              name: 'Pro',
              price: '$19',
              period: 'month',
              description: 'Ideal for professionals',
              popular: true,
              features: [
                'Unlimited websites',
                'Premium themes',
                'Priority support',
                'Advanced analytics'
              ],
              buttonText: 'Start Pro Trial',
              buttonLink: '/signup?plan=pro'
            }
          ]
        }
      },
      team: {
        title: 'Meet Our Team',
        subtitle: 'The People Behind Our Success',
        content: 'Our passionate team of professionals working to make your experience exceptional.',
        data: {
          members: [
            {
              name: 'John Doe',
              role: 'CEO & Founder',
              bio: 'Passionate entrepreneur with 10+ years of experience in technology.',
              avatar: '/team/john.jpg',
              social: {
                twitter: 'https://twitter.com/johndoe',
                linkedin: 'https://linkedin.com/in/johndoe',
                github: 'https://github.com/johndoe'
              }
            },
            {
              name: 'Jane Smith',
              role: 'Lead Developer',
              bio: 'Full-stack developer who loves creating beautiful and functional applications.',
              avatar: '/team/jane.jpg',
              social: {
                twitter: 'https://twitter.com/janesmith',
                linkedin: 'https://linkedin.com/in/janesmith',
                github: 'https://github.com/janesmith'
              }
            }
          ]
        }
      },
      faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'Everything You Need to Know',
        content: 'Find answers to common questions about our product and services.',
        data: {
          faqs: [
            {
              question: 'How do I get started?',
              answer: 'Getting started is easy! Simply sign up for an account and follow our step-by-step onboarding process.'
            },
            {
              question: 'What features are included?',
              answer: 'Our platform includes a comprehensive set of features including analytics, customization options, and 24/7 support.'
            },
            {
              question: 'Can I cancel anytime?',
              answer: 'Yes, you can cancel your subscription at any time with no penalties or hidden fees.'
            }
          ]
        }
      },
      gallery: {
        title: 'Project Gallery',
        subtitle: 'Our Latest Work',
        content: 'Explore our portfolio of successful projects and creative solutions.',
        data: {
          layout: 'grid',
          columns: 3,
          images: [
            {
              src: '/gallery/project1.jpg',
              alt: 'Project 1',
              title: 'Modern Website Design',
              description: 'A clean, responsive website for a tech startup'
            },
            {
              src: '/gallery/project2.jpg',
              alt: 'Project 2',
              title: 'E-commerce Platform',
              description: 'Full-featured online store with payment integration'
            },
            {
              src: '/gallery/project3.jpg',
              alt: 'Project 3',
              title: 'Mobile App UI',
              description: 'Beautiful and intuitive mobile application interface'
            }
          ]
        }
      },
      contact: {
        title: 'Get in Touch',
        subtitle: 'We\'d Love to Hear From You',
        content: 'Have questions or want to work together? Send us a message and we\'ll get back to you soon.',
        data: {
          showForm: true,
          contactInfo: [
            {
              icon: '📧',
              label: 'Email',
              value: 'hello@example.com',
              link: 'mailto:hello@example.com'
            },
            {
              icon: '📞',
              label: 'Phone',
              value: '+1 (555) 123-4567',
              link: 'tel:+15551234567'
            },
            {
              icon: '📍',
              label: 'Address',
              value: '123 Main St, City, State 12345',
              link: 'https://maps.google.com'
            }
          ]
        }
      }
    };
    
    return blockDataMap[type] || {};
  }, []);

  // Enhanced addBlock function with error handling
  const addBlock = useCallback((blockType: string) => {
    try {
      const newBlock: BuilderBlock = {
        id: generateBlockId(),
        type: blockType as any,
        name: availableBlocks.find(b => b.type === blockType)?.name || blockType,
        icon: availableBlocks.find(b => b.type === blockType)?.icon || '📦',
        data: getDefaultBlockData(blockType),
        position: pageBlocks.length
      };
      
      setPageBlocks(prev => [...prev, newBlock]);
      
      // Add block ID to current page
      setPages(prev => {
        const updatedPages = [...prev];
        updatedPages[currentPageIndex].contentBlocks.push(newBlock.id);
        return updatedPages;
      });
      
      // Auto-select the new block
      setSelectedBlock(newBlock);
    } catch (error) {
      console.error('Error adding block:', error);
    }
  }, [pageBlocks.length, currentPageIndex, generateBlockId, getDefaultBlockData]);

  // Enhanced removeBlock function
  const removeBlock = useCallback((blockId: string) => {
    setPageBlocks(prev => prev.filter(block => block.id !== blockId));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
    
    // Remove block ID from current page
    setPages(prev => {
      const updatedPages = [...prev];
      updatedPages[currentPageIndex].contentBlocks = 
        updatedPages[currentPageIndex].contentBlocks.filter(id => id !== blockId);
      return updatedPages;
    });
  }, [selectedBlock?.id, currentPageIndex]);

  // Enhanced moveBlock function
  const moveBlock = useCallback((fromIndex: number, toIndex: number) => {
    setPageBlocks(prev => {
      const newBlocks = [...prev];
      const [movedBlock] = newBlocks.splice(fromIndex, 1);
      newBlocks.splice(toIndex, 0, movedBlock);
      
      // Update positions
      return newBlocks.map((block, index) => ({
        ...block,
        position: index
      }));
    });
  }, []);

  // Enhanced drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, block: BuilderBlock, index: number) => {
    setDragState({
      isDragging: true,
      draggedBlock: block,
      dragOverIndex: null
    });
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragState(prev => ({ ...prev, dragOverIndex: index }));
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragState.draggedBlock) {
      const dragIndex = pageBlocks.findIndex(block => block.id === dragState.draggedBlock!.id);
      if (dragIndex !== -1 && dragIndex !== dropIndex) {
        moveBlock(dragIndex, dropIndex);
      }
    }
    setDragState({
      isDragging: false,
      draggedBlock: null,
      dragOverIndex: null
    });
  }, [dragState.draggedBlock, pageBlocks, moveBlock]);

  // Enhanced updateBlockData function with validation
  const updateBlockData = useCallback((blockId: string, newData: any) => {
    if (!blockId || !newData) return;
    
    setPageBlocks(prevBlocks => prevBlocks.map(block => 
      block.id === blockId ? { 
        ...block, 
        data: { 
          ...block.data, 
          ...newData 
        } 
      } : block
    ));
    
    // Also update the selected block to prevent it from reverting
    setSelectedBlock(prevSelected => 
      prevSelected?.id === blockId ? {
        ...prevSelected,
        data: {
          ...prevSelected.data,
          ...newData
        }
      } : prevSelected
    );
  }, []);

  // Enhanced page management functions
  const addNewPage = useCallback(() => {
    const newPage = {
      title: `Page ${pages.length + 1}`,
      slug: `page-${pages.length + 1}`,
      description: 'A new page',
      content: `# Page ${pages.length + 1}\n\nThis is a new page.`,
      layout: 'default',
      contentBlocks: [] as string[]
    };
    setPages(prev => [...prev, newPage]);
    setCurrentPageIndex(pages.length);
    setPageBlocks([]); // Clear blocks for new page
  }, [pages.length]);

  const switchToPage = useCallback((index: number) => {
    setCurrentPageIndex(index);
    // Filter blocks for this page
    const pageBlockIds = pages[index].contentBlocks;
    setPageBlocks(prev => prev.filter(block => pageBlockIds.includes(block.id)));
  }, [pages]);

  // Enhanced site configuration generation with better error handling
  const generateSiteJSON = useCallback((): SiteConfig => {
    try {
      // Convert blocks to ContentBlocks format with proper data structure
      const contentBlocks: ContentBlock[] = pageBlocks.map(block => {
        // Clean data structure - avoid duplication
        const cleanData = { ...block.data };
        
        // Remove duplicate title/subtitle/content from data if they exist at root level
        if (cleanData.title) delete cleanData.title;
        if (cleanData.subtitle) delete cleanData.subtitle;
        if (cleanData.content) delete cleanData.content;
        
        return {
          id: block.id,
          type: block.type,
          title: block.data.title,
          subtitle: block.data.subtitle,
          content: block.data.content,
          data: cleanData,
          visible: true
        };
      });

      // Generate pages with proper structure - skip home page as it's handled by contentBlocks
      const pagesData = pages
        .filter((page, index) => !(index === 0 && page.slug === 'index')) // Skip home page
        .map((page) => ({
          title: page.title,
          slug: page.slug,
          content: page.content,
          description: page.description,
          category: 'general',
          tags: ['website', 'zyros'],
          layout: page.layout as any,
          contentBlocks: page.contentBlocks,
          publishedAt: new Date().toISOString().split('T')[0],
          readingTime: Math.max(1, Math.ceil(page.content.length / 1000)) // At least 1 minute
        }));

      const siteConfig: SiteConfig = {
        site: {
          title: siteSettings.title,
          theme: siteSettings.theme as any,
          description: siteSettings.description,
          layout: siteSettings.layout as any,
          author: siteSettings.author,
          url: siteSettings.url,
          language: siteSettings.language,
          favicon: siteSettings.favicon,
          logo: siteSettings.logo,
          social: siteSettings.social,
          analytics: {
            googleAnalytics: 'GA_MEASUREMENT_ID'
          },
          seo: {
            keywords: ['website', 'zyros', 'static site generator'],
            ogImage: '/og-image.jpg',
            twitterCard: 'summary_large_image'
          },
          features: {
            search: true,
            newsletter: false,
            comments: false,
            darkMode: true,
            analytics: true,
            socialShare: true,
            tableOfContents: true,
            readingProgress: true
          }
        },
        pages: pagesData,
        header: {
          logo: {
            text: siteSettings.title,
            image: siteSettings.logo,
            url: '/',
            size: 'medium',
            position: 'left'
          },
          navigation: [
            {
              title: 'Home',
              href: '/',
              icon: '🏠'
            },
            ...pagesData.map(page => ({
              title: page.title,
              href: `/${page.slug}`,
              icon: '📄'
            }))
          ],
          search: true,
          themeToggle: true,
          sticky: true,
          transparent: false,
          height: 'normal',
          style: 'modern',
          background: {
            type: 'blur'
          },
          border: {
            show: true,
            style: 'solid',
            width: 'thin'
          },
          layout: 'spread',
          mobileMenu: {
            style: 'slide',
            position: 'right'
          }
        },
        footer: {
          copyright: `© ${new Date().getFullYear()} ${siteSettings.title}. All rights reserved.`,
          columns: [
            {
              title: 'Product',
              links: [
                { text: 'Features', url: '/features' },
                { text: 'Pricing', url: '/pricing' },
                { text: 'Documentation', url: '/docs' }
              ]
            },
            {
              title: 'Company',
              links: [
                { text: 'About Us', url: '/about' },
                { text: 'Contact', url: '/contact' },
                { text: 'Blog', url: '/blog' }
              ]
            }
          ],
          newsletter: false,
          social: true,
          backToTop: true,
          style: 'modern',
          layout: 'columns',
          background: {
            type: 'gradient',
            gradient: {
              from: '#1e293b',
              to: '#0f172a',
              direction: 'diagonal'
            }
          },
          spacing: 'normal',
          border: {
            show: true,
            style: 'solid',
            width: 'thin'
          },
          socialLinks: Object.entries(siteSettings.social)
            .filter(([_, url]) => url)
            .map(([platform, url]) => ({
              platform: platform.charAt(0).toUpperCase() + platform.slice(1),
              url,
              icon: platform === 'twitter' ? '🐦' : platform === 'github' ? '🐙' : '🔗',
              color: '#333'
            }))
        },
        contentBlocks,
        forms: [
          {
            id: 'contact-form',
            title: 'Contact Us',
            description: 'Send us a message and we\'ll get back to you as soon as possible.',
            fields: [
              {
                id: 'name',
                type: 'text',
                label: 'Full Name',
                placeholder: 'Enter your full name',
                required: true,
                validation: {
                  minLength: 2,
                  maxLength: 50
                }
              },
              {
                id: 'email',
                type: 'email',
                label: 'Email Address',
                placeholder: 'Enter your email',
                required: true
              },
              {
                id: 'message',
                type: 'textarea',
                label: 'Message',
                placeholder: 'Tell us how we can help you...',
                required: true,
                validation: {
                  minLength: 10,
                  maxLength: 1000
                }
              }
            ],
            submitText: 'Send Message',
            successMessage: 'Thank you for your message! We\'ll get back to you within 24 hours.',
            action: '/api/contact',
            method: 'POST'
          }
        ]
      };

      return siteConfig;
    } catch (error) {
      console.error('Error generating site JSON:', error);
      throw new Error('Failed to generate site configuration');
    }
  }, [pageBlocks, pages, siteSettings]);

  // Enhanced download function with improved error handling
  const downloadSiteJSON = useCallback(async () => {
    try {
      setIsGenerating(true);
      const siteConfig = generateSiteJSON();
      const jsonString = JSON.stringify(siteConfig, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${siteSettings.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-site.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      // Show enhanced success notification
      showNotification('🎉 Website Downloaded!', 'Replace your public/site.json file with this download. Your home page content blocks will appear on the main page automatically!', 'success');
    } catch (error) {
      console.error('Download failed:', error);
      showNotification('❌ Download Failed', 'There was an error generating your website. Please try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  }, [generateSiteJSON, siteSettings.title]);

  // Enhanced notification system
  const showNotification = useCallback((title: string, message: string, type: 'success' | 'error' = 'success') => {
    if (typeof window === 'undefined') return;
    
    const notification = document.createElement('div');
    const bgColor = type === 'success' 
      ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
      : 'bg-gradient-to-r from-red-500 to-rose-500';
    
    notification.className = `fixed top-6 right-6 ${bgColor} text-white px-6 py-4 rounded-2xl shadow-2xl z-[9999] flex items-center space-x-3 transform translate-x-full transition-all duration-500 max-w-md`;
    notification.style.backdropFilter = 'blur(20px)';
    notification.innerHTML = `
      <div class="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${type === 'success' ? 'M5 13l4 4L19 7' : 'M6 18L18 6M6 6l12 12'}"></path>
        </svg>
      </div>
      <div class="flex-1">
        <div class="font-semibold text-sm">${title}</div>
        <div class="text-xs opacity-90 mt-1">${message}</div>
      </div>
      <button onclick="this.parentElement.remove()" class="flex-shrink-0 w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    `;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-hide after 6 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        if (notification.parentElement) {
          document.body.removeChild(notification);
        }
      }, 500);
    }, 6000);
  }, []);

  const savePage = useCallback(() => {
    try {
      const pageData = {
        title: pages[currentPageIndex].title,
        slug: pages[currentPageIndex].slug,
        blocks: pageBlocks.map(block => ({
          type: block.type,
          data: block.data,
          visible: true,
          id: block.id
        }))
      };
      onSavePage(pageData);
      showNotification('✅ Page Saved', 'Your page has been saved successfully!', 'success');
    } catch (error) {
      console.error('Save failed:', error);
      showNotification('❌ Save Failed', 'There was an error saving your page. Please try again.', 'error');
    }
  }, [pages, currentPageIndex, pageBlocks, onSavePage, showNotification]);

  // Memoized block preview component for better performance
  const renderBlockPreview = useMemo(() => (block: BuilderBlock) => {
    return (
      <div className={`p-6 rounded-2xl ${theme.card} border ${theme.border} shadow-xl hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm`}>
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 shadow-lg">
            <span className="text-2xl">{block.icon}</span>
          </div>
          <div className="flex-1">
            <h3 className={`font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
              {block.name}
            </h3>
            <p className={`text-sm ${theme.secondary} capitalize font-medium`}>
              {block.type.replace('-', ' ')} Block
            </p>
          </div>
          <div className="text-xs bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-3 py-1 rounded-full font-semibold">
            Live Preview
          </div>
        </div>
        
        {/* Enhanced preview based on block type */}
        <div className="text-xs text-gray-500 mb-3">
          {block.data.title && (
            <div className="font-medium truncate">{block.data.title}</div>
          )}
          {block.data.subtitle && (
            <div className="truncate">{block.data.subtitle}</div>
          )}
        </div>
        
        {/* Block-specific preview content */}
        {block.type === 'hero' && (
          <div className="space-y-2">
            <div className={`h-3 bg-gradient-to-r from-blue-200 to-purple-200 rounded`}></div>
            <div className={`h-2 ${theme.code} rounded w-3/4`}></div>
            <div className="flex space-x-2 mt-3">
              <div className={`h-5 w-14 bg-blue-500 rounded text-white text-xs flex items-center justify-center`}>CTA</div>
              <div className={`h-5 w-14 ${theme.border} border rounded text-xs flex items-center justify-center`}>Link</div>
            </div>
          </div>
        )}
        
        {block.type === 'features' && (
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="space-y-1 text-center">
                <div className="text-lg">⚡</div>
                <div className={`h-1 ${theme.code} rounded`}></div>
                <div className={`h-1 ${theme.code} rounded w-2/3 mx-auto`}></div>
              </div>
            ))}
          </div>
        )}
        
        {block.type === 'testimonials' && (
          <div className="space-y-2">
            <div className={`h-2 ${theme.code} rounded w-1/2`}></div>
            <div className={`h-1 ${theme.code} rounded w-3/4`}></div>
            <div className="flex items-center space-x-2 mt-2">
              <div className={`w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs`}>👤</div>
              <div className={`h-1 ${theme.code} rounded w-1/3`}></div>
              <div className="text-yellow-400 text-xs">★★★★★</div>
            </div>
          </div>
        )}
        
        {block.type === 'stats' && (
          <div className="grid grid-cols-3 gap-1 text-center">
            {['10K+', '99%', '24/7'].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-blue-600 font-bold text-sm">{stat}</div>
                <div className={`h-1 ${theme.code} rounded`}></div>
              </div>
            ))}
          </div>
        )}
        
        {block.type === 'pricing' && (
          <div className="grid grid-cols-2 gap-2">
            {['Free', 'Pro'].map((plan, i) => (
              <div key={i} className={`p-2 rounded border ${i === 1 ? 'border-blue-500 bg-blue-50' : theme.border}`}>
                <div className="text-xs font-medium">{plan}</div>
                <div className="text-xs text-blue-600 font-bold">{i === 0 ? '$0' : '$19'}</div>
                <div className={`h-3 w-full ${theme.code} rounded mt-1`}></div>
              </div>
            ))}
          </div>
        )}
        
        {block.type === 'team' && (
          <div className="flex space-x-2">
            {[1, 2].map(i => (
              <div key={i} className="flex-1 text-center space-y-1">
                <div className={`w-8 h-8 bg-gray-300 rounded-full mx-auto flex items-center justify-center text-xs`}>👤</div>
                <div className={`h-1 ${theme.code} rounded`}></div>
                <div className={`h-1 ${theme.code} rounded w-2/3 mx-auto`}></div>
              </div>
            ))}
          </div>
        )}
        
        {block.type === 'faq' && (
          <div className="space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between">
                <div className={`h-1 ${theme.code} rounded flex-1`}></div>
                <div className="text-xs ml-2">❓</div>
              </div>
            ))}
          </div>
        )}
        
        {block.type === 'gallery' && (
          <div className="grid grid-cols-3 gap-1">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`aspect-square ${theme.code} rounded flex items-center justify-center text-xs`}>
                🖼️
              </div>
            ))}
          </div>
        )}
        
        {block.type === 'contact' && (
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-sm">📧</span>
              <div className={`h-1 ${theme.code} rounded flex-1`}></div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm">📞</span>
              <div className={`h-1 ${theme.code} rounded flex-1`}></div>
            </div>
            <div className={`h-8 ${theme.border} border rounded mt-2 flex items-center justify-center text-xs`}>
              Contact Form
            </div>
          </div>
        )}
        
        {block.type === 'cta' && (
          <div className="text-center space-y-2">
            <div className={`h-2 ${theme.code} rounded w-3/4 mx-auto`}></div>
            <div className={`h-1 ${theme.code} rounded w-1/2 mx-auto`}></div>
            <div className={`h-6 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded text-white text-xs flex items-center justify-center mx-auto`}>
              CTA
            </div>
          </div>
        )}
      </div>
    );
  }, [theme]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-34 right-6 p-4 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 z-50 group animate-pulse hover:animate-none`}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          boxShadow: '0 20px 40px rgba(102, 126, 234, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.1) inset'
        }}
      >
        <Palette className="w-6 h-6" />
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-gray-900 to-black text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl border border-gray-700">
          <div className="font-semibold">🎨 Visual Website Builder</div>
          <div className="text-xs text-gray-300">Create stunning websites visually</div>
          <div className="absolute top-1/2 -right-1 w-2 h-2 bg-gray-900 rotate-45 -translate-y-1/2"></div>
        </div>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/20 to-black/60 backdrop-blur-xl z-50 flex">
      {/* Sidebar */}
      <div className={`w-80 ${theme.card} border-r ${theme.border} overflow-y-auto shadow-2xl`} style={{
        background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
        backdropFilter: 'blur(20px)'
      }}>
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h2 className={`text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>Website Builder</h2>
                <p className={`text-sm ${theme.secondary} font-medium`}>Build complete websites visually</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-2 rounded-xl ${theme.border} hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-200 group`}
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>

          {/* Enhanced Tabs */}
          <div className="flex space-x-1 p-1 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-xl mb-6 shadow-inner">
            {[
              { id: 'builder', label: 'Builder', icon: '🏗️', color: 'from-blue-500 to-indigo-600' },
              { id: 'pages', label: 'Pages', icon: '📄', color: 'from-green-500 to-emerald-600' },
              { id: 'settings', label: 'Settings', icon: '⚙️', color: 'from-purple-500 to-pink-600' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  currentTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-gray-600/50'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {currentTab === 'builder' && (
            <>
              <h3 className={`font-semibold ${theme.accent} mb-4`}>Available Blocks</h3>
              <div className="space-y-2">
                {availableBlocks.map((block, index) => (
                  <button
                    key={block.type}
                    onClick={() => addBlock(block.type)}
                    className={`w-full p-4 rounded-xl border-2 border-dashed ${theme.border} hover:border-indigo-500 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/20 dark:hover:to-purple-900/20 transition-all duration-300 flex items-center space-x-3 group hover:shadow-lg hover:scale-105 transform`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'fadeInUp 0.5s ease-out forwards'
                    }}
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-indigo-100 group-hover:to-purple-100 transition-all duration-300">
                      <span className="text-xl">{block.icon}</span>
                    </div>
                    <div className="text-left flex-1">
                      <div className={`font-semibold ${theme.accent} group-hover:text-indigo-600 transition-colors duration-300`}>{block.name}</div>
                      <div className={`text-xs ${theme.secondary} capitalize`}>{block.type.replace('-', ' ')}</div>
                    </div>
                    <div className="p-2 rounded-full bg-indigo-100 group-hover:bg-indigo-500 transition-all duration-300">
                      <Plus className="w-4 h-4 text-indigo-600 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {currentTab === 'pages' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className={`font-semibold ${theme.accent}`}>Pages</h3>
                  <p className={`text-xs ${theme.secondary} mt-1`}>
                    Home page blocks appear on main site. Other pages create separate routes.
                  </p>
                </div>
                <button
                  onClick={addNewPage}
                  className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  title="Add new page"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2">
                {pages.map((page, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                      currentPageIndex === index
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : `border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600`
                    }`}
                    onClick={() => switchToPage(index)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{page.slug === 'index' ? '🏠' : '📄'}</span>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={page.title}
                            onChange={(e) => {
                              const updatedPages = [...pages];
                              updatedPages[index].title = e.target.value;
                              setPages(updatedPages);
                            }}
                            className={`flex-1 bg-transparent border-none focus:outline-none font-medium ${
                              currentPageIndex === index ? 'text-indigo-600' : theme.accent
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          />
                          {page.slug === 'index' && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full font-medium">
                              Home
                            </span>
                          )}
                        </div>
                        <div className={`text-xs ${theme.secondary}`}>
                          {page.slug === 'index' ? '/' : `/${page.slug}`} • {page.contentBlocks.length} blocks
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {currentTab === 'settings' && (
            <>
              <h3 className={`font-semibold ${theme.accent} mb-4`}>Site Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.accent} mb-2`}>Site Title</label>
                  <input
                    type="text"
                    value={siteSettings.title}
                    onChange={(e) => setSiteSettings({...siteSettings, title: e.target.value})}
                    className={`w-full p-3 rounded-lg border ${theme.border} ${theme.card} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.accent} mb-2`}>Description</label>
                  <textarea
                    value={siteSettings.description}
                    onChange={(e) => setSiteSettings({...siteSettings, description: e.target.value})}
                    rows={3}
                    className={`w-full p-3 rounded-lg border ${theme.border} ${theme.card} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.accent} mb-2`}>Theme</label>
                  <select
                    value={siteSettings.theme}
                    onChange={(e) => setSiteSettings({...siteSettings, theme: e.target.value})}
                    className={`w-full p-3 rounded-lg border ${theme.border} ${theme.card} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  >
                    {themeOptions.map(themeOption => (
                      <option key={themeOption} value={themeOption}>
                        {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.accent} mb-2`}>Author</label>
                  <input
                    type="text"
                    value={siteSettings.author}
                    onChange={(e) => setSiteSettings({...siteSettings, author: e.target.value})}
                    className={`w-full p-3 rounded-lg border ${theme.border} ${theme.card} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${theme.accent} mb-2`}>Website URL</label>
                  <input
                    type="url"
                    value={siteSettings.url}
                    onChange={(e) => setSiteSettings({...siteSettings, url: e.target.value})}
                    className={`w-full p-3 rounded-lg border ${theme.border} ${theme.card} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                  />
                </div>
                
                {/* Social Links */}
                <div>
                  <label className={`block text-sm font-medium ${theme.accent} mb-2`}>Social Links</label>
                  <div className="space-y-2">
                    {Object.entries(siteSettings.social).map(([platform, url]) => (
                      <div key={platform}>
                        <label className={`block text-xs ${theme.secondary} mb-1`}>
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </label>
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => setSiteSettings({
                            ...siteSettings,
                            social: { ...siteSettings.social, [platform]: e.target.value }
                          })}
                          placeholder={`https://${platform}.com/username`}
                          className={`w-full p-2 text-sm rounded-lg border ${theme.border} ${theme.card} focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Toolbar */}
        <div className={`p-4 ${theme.card} border-b ${theme.border} flex items-center justify-between shadow-lg`} style={{
          background: 'linear-gradient(90deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                previewMode 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {previewMode ? <Eye className="w-4 h-4" /> : <Code className="w-4 h-4" />}
              <span>{previewMode ? 'Preview Mode' : 'Edit Mode'}</span>
            </button>
            <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-gray-100 to-gray-200 shadow-inner">
              <div className={`text-sm font-semibold ${theme.accent}`}>
                📄 {pages[currentPageIndex]?.title}
              </div>
              <div className={`text-xs ${theme.secondary}`}>
                🧱 {pageBlocks.length} blocks • 🎨 {siteSettings.theme} theme
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={downloadSiteJSON}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
            >
              <Download className="w-4 h-4" />
              <span>Download Site</span>
            </button>
            <button
              onClick={savePage}
              className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 transform"
            >
              <Save className="w-4 h-4" />
              <span>Save Page</span>
            </button>
          </div>
        </div>

        {/* Enhanced Canvas */}
        <div className="flex-1 overflow-y-auto p-6" style={{
          background: 'linear-gradient(135deg, #f6f8fa 0%, #e9ecef 50%, #f6f8fa 100%)',
          backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(147, 51, 234, 0.05) 0%, transparent 50%)'
        }}>
          <div className="max-w-5xl mx-auto">
            {pageBlocks.length === 0 ? (
              <div className="text-center py-24">
                <div className="mb-8">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-4xl animate-bounce shadow-2xl">
                    🎨
                  </div>
                  <div className="w-32 h-1 mx-auto bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></div>
                </div>
                <h3 className={`text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4`}>
                  Start Building Your Website
                </h3>
                <p className={`text-lg ${theme.secondary} mb-8 max-w-md mx-auto`}>
                  Add blocks from the sidebar to create beautiful, professional pages
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <div className={`inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-semibold shadow-lg`}>
                    <Plus className="w-5 h-5 mr-2" />
                    Add your first block
                  </div>
                  <div className="text-sm text-gray-500">
                    Drag & drop • Visual editing • No coding required
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {pageBlocks
                  .sort((a, b) => a.position - b.position)
                  .map((block, index) => (
                    <div
                      key={block.id}
                      draggable={!previewMode}
                      onDragStart={(e) => handleDragStart(e, block, index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDrop={(e) => handleDrop(e, index)}
                      className={`relative group ${
                        dragState.dragOverIndex === index ? 'border-t-4 border-indigo-500' : ''
                      } ${
                        selectedBlock?.id === block.id ? 'ring-2 ring-indigo-500' : ''
                      }`}
                      onClick={() => setSelectedBlock(block)}
                    >
                      {!previewMode && (
                        <div className="absolute -top-2 -right-2 z-10 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeBlock(block.id);
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <button className="p-2 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition-colors shadow-lg cursor-move">
                            <Move className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                      
                      {renderBlockPreview(block)}
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced Properties Panel */}
      {selectedBlock && !previewMode && (
        <div className={`w-80 ${theme.card} border-l ${theme.border} overflow-y-auto shadow-2xl`} style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
          backdropFilter: 'blur(20px)'
        }}>
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-lg">
                <span className="text-2xl">{selectedBlock.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className={`font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent`}>
                  {selectedBlock.name}
                </h3>
                <p className={`text-sm ${theme.secondary} font-medium`}>
                  Customize your {selectedBlock.type} block
                </p>
              </div>
            </div>

            {/* Enhanced Block-specific property editors */}
            <div className="space-y-6">
              <div>
                <label className={`block text-sm font-semibold ${theme.accent} mb-3 flex items-center space-x-2`}>
                  <span>📝</span>
                  <span>Title</span>
                </label>
                <input
                  type="text"
                  value={selectedBlock.data.title || ''}
                  onChange={(e) => updateBlockData(selectedBlock.id, { title: e.target.value })}
                  placeholder="Enter a compelling title..."
                  className={`w-full p-4 rounded-xl border-2 ${theme.border} ${theme.card} focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 font-medium`}
                />
              </div>
              
              {selectedBlock.data.subtitle !== undefined && (
                <div>
                  <label className={`block text-sm font-semibold ${theme.accent} mb-3 flex items-center space-x-2`}>
                    <span>✨</span>
                    <span>Subtitle</span>
                  </label>
                  <input
                    type="text"
                    value={selectedBlock.data.subtitle || ''}
                    onChange={(e) => updateBlockData(selectedBlock.id, { subtitle: e.target.value })}
                    placeholder="Add a catchy subtitle..."
                    className={`w-full p-4 rounded-xl border-2 ${theme.border} ${theme.card} focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 font-medium`}
                  />
                </div>
              )}
              
              {selectedBlock.data.content && (
                <div>
                  <label className={`block text-sm font-semibold ${theme.accent} mb-3 flex items-center space-x-2`}>
                    <span>📄</span>
                    <span>Content</span>
                  </label>
                  <textarea
                    value={selectedBlock.data.content || ''}
                    onChange={(e) => updateBlockData(selectedBlock.id, { content: e.target.value })}
                    placeholder="Write your content here..."
                    rows={5}
                    className={`w-full p-4 rounded-xl border-2 ${theme.border} ${theme.card} focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 font-medium resize-none`}
                  />
                  <div className="mt-2 text-xs text-gray-500 flex justify-between">
                    <span>Supports Markdown formatting</span>
                    <span>{selectedBlock.data.content?.length || 0} characters</span>
                  </div>
                </div>
              )}
              
              {/* Quick Actions */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-sm font-semibold text-gray-600 mb-3">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => removeBlock(selectedBlock.id)}
                    className="p-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-200 text-sm font-medium"
                  >
                    🗑️ Delete Block
                  </button>
                  <button 
                    onClick={() => {
                      const newBlock = { ...selectedBlock, id: generateBlockId() };
                      setPageBlocks([...pageBlocks, newBlock]);
                    }}
                    className="p-3 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                  >
                    📋 Duplicate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 