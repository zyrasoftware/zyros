import React from 'react';
import Image from 'next/image';
import { ContentBlock } from '../types/site';
import { Theme } from '../styles/themes';
import { 
  Star, 
  Mail, 
  Phone, 
  MapPin,
  Check,
  ArrowRight,
  Quote
} from './Icons';

interface ContentBlocksProps {
  blocks: ContentBlock[];
  theme: Theme;
}

interface ContentBlockProps {
  block: ContentBlock;
  theme: Theme;
}

export default function ContentBlocks({ blocks, theme }: ContentBlocksProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-16">
      {blocks.filter(block => block.visible !== false).map((block) => (
        <ContentBlockRenderer key={block.id} block={block} theme={theme} />
      ))}
    </div>
  );
}

function ContentBlockRenderer({ block, theme }: ContentBlockProps) {
  switch (block.type) {
    case 'hero':
      return <HeroBlock block={block} theme={theme} />;
    case 'features':
      return <FeaturesBlock block={block} theme={theme} />;
    case 'testimonials':
      return <TestimonialsBlock block={block} theme={theme} />;
    case 'cta':
      return <CTABlock block={block} theme={theme} />;
    case 'gallery':
      return <GalleryBlock block={block} theme={theme} />;
    case 'stats':
      return <StatsBlock block={block} theme={theme} />;
    case 'team':
      return <TeamBlock block={block} theme={theme} />;
    case 'faq':
      return <FAQBlock block={block} theme={theme} />;
    case 'pricing':
      return <PricingBlock block={block} theme={theme} />;
    case 'contact':
      return <ContactBlock block={block} theme={theme} />;
    default:
      return null;
  }
}

function HeroBlock({ block, theme }: ContentBlockProps) {
  const data = block.data as {
    backgroundImage?: string;
    buttons?: Array<{
      text: string;
      href: string;
      style?: 'primary' | 'secondary' | 'outline';
    }>;
    features?: string[];
  };

  return (
    <section className={`hero-section relative py-20 lg:py-32 overflow-hidden ${theme.background}`}>
      {data?.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {block.subtitle && (
          <div className={`hero-badge inline-flex items-center px-4 py-2 rounded-full ${theme.card} border ${theme.border} text-sm font-medium ${theme.accent} mb-8`}>
            <Star className="w-4 h-4 mr-2" />
            {block.subtitle}
          </div>
        )}
        
        <h1 className={`hero-title text-4xl md:text-6xl lg:text-7xl font-bold ${theme.accent} mb-8 leading-tight`}>
          {block.title}
        </h1>
        
        {block.content && (
          <p className={`hero-subtitle text-xl lg:text-2xl ${theme.secondary} mb-12 max-w-4xl mx-auto leading-relaxed`}>
            {block.content}
          </p>
        )}
        
        {data?.buttons && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {data.buttons.map((button, index) => (
              <a
                key={index}
                href={button.href}
                className={`zyros-button-primary inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl ${
                  button.style === 'primary' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                    : button.style === 'secondary'
                    ? `zyros-button-secondary ${theme.card} border ${theme.border} ${theme.text} hover:${theme.accent}`
                    : `border-2 border-current ${theme.accent} hover:bg-current hover:text-white`
                }`}
              >
                {button.text}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            ))}
          </div>
        )}
        
        {data?.features && (
          <div className="flex flex-wrap justify-center gap-8 text-sm">
            {data.features.map((feature, index) => (
              <div key={index} className={`flex items-center ${theme.secondary}`}>
                <Check className="w-4 h-4 mr-2 text-green-500" />
                {feature}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function FeaturesBlock({ block, theme }: ContentBlockProps) {
  const data = block.data as {
    features: Array<{
      title: string;
      description: string;
      icon?: string;
      image?: string;
    }>;
    layout?: 'grid' | 'list' | 'cards';
  };

  if (!data?.features) return null;

  return (
    <section className={`py-20 ${theme.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {block.subtitle && (
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${theme.card} border ${theme.border} text-sm font-medium ${theme.accent} mb-4`}>
              {block.subtitle}
            </div>
          )}
          <h2 className={`text-3xl md:text-5xl font-bold ${theme.accent} mb-6`}>
            {block.title}
          </h2>
          {block.content && (
            <p className={`text-xl ${theme.secondary} max-w-3xl mx-auto`}>
              {block.content}
            </p>
          )}
        </div>
        
        <div className={`grid gap-8 ${
          data.layout === 'list' 
            ? 'grid-cols-1' 
            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {data.features.map((feature, index) => (
            <div 
              key={index}
              className={`p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              {feature.icon && (
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center mb-6 text-2xl`}>
                  {feature.icon}
                </div>
              )}
              {feature.image && (
                <div className="relative w-full h-48 mb-6">
                  <Image 
                    src={feature.image} 
                    alt={feature.title}
                    fill
                    className="object-cover rounded-2xl"
                  />
                </div>
              )}
              <h3 className={`text-xl font-bold ${theme.accent} mb-4`}>
                {feature.title}
              </h3>
              <p className={`${theme.secondary} leading-relaxed`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsBlock({ block, theme }: ContentBlockProps) {
  const data = block.data as {
    testimonials: Array<{
      content: string;
      author: string;
      role?: string;
      company?: string;
      avatar?: string;
      rating?: number;
    }>;
  };

  if (!data?.testimonials) return null;

  return (
    <section className={`py-20 ${theme.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {block.subtitle && (
            <div className={`inline-flex items-center px-4 py-2 rounded-full ${theme.card} border ${theme.border} text-sm font-medium ${theme.accent} mb-4`}>
              {block.subtitle}
            </div>
          )}
          <h2 className={`text-3xl md:text-5xl font-bold ${theme.accent} mb-6`}>
            {block.title}
          </h2>
          {block.content && (
            <p className={`text-xl ${theme.secondary} max-w-3xl mx-auto`}>
              {block.content}
            </p>
          )}
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className={`p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 relative`}
            >
              <Quote className={`w-8 h-8 ${theme.accent} opacity-20 absolute top-6 right-6`} />
              
              {testimonial.rating && (
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              )}
              
              <blockquote className={`${theme.text} mb-6 text-lg leading-relaxed`}>
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>
              
              <div className="flex items-center">
                {testimonial.avatar && (
                  <div className="relative w-12 h-12 mr-4">
                    <Image 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <div className={`font-semibold ${theme.accent}`}>
                    {testimonial.author}
                  </div>
                  {(testimonial.role || testimonial.company) && (
                    <div className={`text-sm ${theme.secondary}`}>
                      {testimonial.role}
                      {testimonial.role && testimonial.company && ' at '}
                      {testimonial.company}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABlock({ block }: ContentBlockProps) {
  const data = block.data as {
    buttons?: Array<{
      text: string;
      href: string;
      style?: 'primary' | 'secondary' | 'outline';
    }>;
    backgroundImage?: string;
  };

  return (
    <section className={`relative py-20 overflow-hidden`}>
      {data?.backgroundImage && (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          {block.title}
        </h2>
        {block.content && (
          <p className="text-xl mb-8 opacity-90">
            {block.content}
          </p>
        )}
        
        {data?.buttons && (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {data.buttons.map((button, index) => (
              <a
                key={index}
                href={button.href}
                className={`inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl ${
                  button.style === 'primary' 
                    ? 'bg-white text-blue-600 hover:bg-gray-100'
                    : button.style === 'secondary'
                    ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    : 'border-2 border-white text-white hover:bg-white hover:text-blue-600'
                }`}
              >
                {button.text}
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function StatsBlock({ block, theme }: ContentBlockProps) {
  const data = block.data as {
    stats: Array<{
      value: string;
      label: string;
      description?: string;
      icon?: string;
    }>;
  };

  if (!data?.stats) return null;

  return (
    <section className={`stats-section py-20 ${theme.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {block.title && (
            <h2 className={`text-3xl md:text-5xl font-bold ${theme.accent} mb-6`}>
              {block.title}
            </h2>
          )}
          {block.content && (
            <p className={`text-xl ${theme.secondary} max-w-3xl mx-auto`}>
              {block.content}
            </p>
          )}
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {data.stats.map((stat, index) => (
            <div 
              key={index}
              className={`zyros-card text-center p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              {stat.icon && (
                <div className={`stats-icon w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center mx-auto mb-6 text-2xl`}>
                  {stat.icon}
                </div>
              )}
              <div className={`stats-number text-4xl font-bold ${theme.accent} mb-2`}>
                {stat.value}
              </div>
              <div className={`stats-label text-lg font-semibold ${theme.text} mb-2`}>
                {stat.label}
              </div>
              {stat.description && (
                <p className={`text-sm ${theme.secondary}`}>
                  {stat.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryBlock({ block, theme }: ContentBlockProps) {
  const data = block.data as {
    images?: Array<{
      src: string;
      alt: string;
      title?: string;
      description?: string;
    }>;
    layout?: 'grid' | 'masonry' | 'carousel';
    columns?: number;
  };

  if (!data?.images) return null;

  const columns = data.columns || 3;
  const gridCols = columns === 2 ? 'md:grid-cols-2' : columns === 4 ? 'md:grid-cols-4' : 'md:grid-cols-3';

  return (
    <section className={`py-20 ${theme.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {block.title && (
            <h2 className={`text-3xl md:text-5xl font-bold ${theme.accent} mb-6`}>
              {block.title}
            </h2>
          )}
          {block.content && (
            <p className={`text-xl ${theme.secondary} max-w-3xl mx-auto`}>
              {block.content}
            </p>
          )}
        </div>
        
        <div className={`grid grid-cols-1 ${gridCols} lg:grid-cols-${columns} gap-6`}>
          {data.images.map((image, index) => (
            <div 
              key={index}
              className={`group relative overflow-hidden rounded-2xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              <div className="relative aspect-square">
                <Image 
                  src={image.src} 
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {(image.title || image.description) && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {image.title && (
                      <h3 className="font-semibold mb-1">{image.title}</h3>
                    )}
                    {image.description && (
                      <p className="text-sm opacity-90">{image.description}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamBlock({ block, theme }: ContentBlockProps) {
  const data = block.data as {
    members?: Array<{
      name: string;
      role: string;
      bio?: string;
      avatar?: string;
      social?: {
        twitter?: string;
        linkedin?: string;
        github?: string;
      };
    }>;
  };

  if (!data?.members) return null;

  return (
    <section className={`py-20 ${theme.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold ${theme.accent} mb-6`}>
            {block.title || 'Our Team'}
          </h2>
          {block.content && (
            <p className={`text-xl ${theme.secondary} max-w-3xl mx-auto`}>
              {block.content}
            </p>
          )}
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.members.map((member, index) => (
            <div 
              key={index}
              className={`text-center p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105`}
            >
              {member.avatar && (
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <Image 
                    src={member.avatar} 
                    alt={member.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              )}
              <h3 className={`text-xl font-bold ${theme.accent} mb-2`}>
                {member.name}
              </h3>
              <p className={`text-sm font-semibold ${theme.secondary} mb-4`}>
                {member.role}
              </p>
              {member.bio && (
                <p className={`text-sm ${theme.text} mb-6`}>
                  {member.bio}
                </p>
              )}
              
              {member.social && (
                <div className="flex justify-center space-x-4">
                  {member.social.twitter && (
                    <a 
                      href={member.social.twitter}
                      className={`w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors duration-200`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-xs">T</span>
                    </a>
                  )}
                  {member.social.linkedin && (
                    <a 
                      href={member.social.linkedin}
                      className={`w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors duration-200`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-xs">L</span>
                    </a>
                  )}
                  {member.social.github && (
                    <a 
                      href={member.social.github}
                      className={`w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center hover:bg-gray-900 transition-colors duration-200`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="text-xs">G</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQBlock({ block, theme }: ContentBlockProps) {
  const data = block.data as {
    faqs?: Array<{
      question: string;
      answer: string;
    }>;
  };

  if (!data?.faqs) return null;

  return (
    <section className={`py-20 ${theme.background}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold ${theme.accent} mb-6`}>
            {block.title || 'Frequently Asked Questions'}
          </h2>
          {block.content && (
            <p className={`text-xl ${theme.secondary} max-w-3xl mx-auto`}>
              {block.content}
            </p>
          )}
        </div>
        
        <div className="space-y-6">
          {data.faqs.map((faq, index) => (
            <details 
              key={index}
              className={`group p-6 rounded-2xl ${theme.card} border ${theme.border} shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <summary className={`flex items-center justify-between cursor-pointer text-lg font-semibold ${theme.accent} list-none`}>
                <span>{faq.question}</span>
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-open:rotate-180" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>
              <div className={`mt-4 pt-4 border-t ${theme.border} ${theme.text} leading-relaxed`}>
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingBlock({ block, theme }: ContentBlockProps) {
  const data = block.data as {
    plans?: Array<{
      name: string;
      price: string;
      period?: string;
      description?: string;
      features: string[];
      popular?: boolean;
      buttonText?: string;
      buttonLink?: string;
    }>;
  };

  if (!data?.plans) return null;

  return (
    <section className={`py-20 ${theme.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold ${theme.accent} mb-6`}>
            {block.title || 'Choose Your Plan'}
          </h2>
          {block.content && (
            <p className={`text-xl ${theme.secondary} max-w-3xl mx-auto`}>
              {block.content}
            </p>
          )}
        </div>
        
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.plans.map((plan, index) => (
            <div 
              key={index}
              className={`relative p-8 rounded-3xl border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${
                plan.popular 
                  ? `${theme.card} border-blue-500 shadow-blue-500/20` 
                  : `${theme.card} ${theme.border}`
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center">
                <h3 className={`text-2xl font-bold ${theme.accent} mb-4`}>
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${theme.accent}`}>
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className={`text-lg ${theme.secondary}`}>
                      /{plan.period}
                    </span>
                  )}
                </div>
                {plan.description && (
                  <p className={`${theme.secondary} mb-8`}>
                    {plan.description}
                  </p>
                )}
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className={`flex items-center ${theme.text}`}>
                    <Check className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <a
                href={plan.buttonLink || '#'}
                className={`block w-full text-center py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg'
                    : `${theme.card} border ${theme.border} ${theme.accent} hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10`
                }`}
              >
                {plan.buttonText || 'Get Started'}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactBlock({ block, theme }: ContentBlockProps) {
  const data = block.data as {
    email?: string;
    phone?: string;
    address?: string;
    social?: Record<string, string>;
  };

  return (
    <section className={`py-20 ${theme.background}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl font-bold ${theme.accent} mb-6`}>
            {block.title || 'Contact Us'}
          </h2>
          {block.content && (
            <p className={`text-xl ${theme.secondary} max-w-3xl mx-auto`}>
              {block.content}
            </p>
          )}
        </div>
        
        <div className="grid gap-8 md:grid-cols-3">
          {data?.email && (
            <div className={`text-center p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-lg`}>
              <Mail className={`w-12 h-12 ${theme.accent} mx-auto mb-4`} />
              <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>Email</h3>
              <a href={`mailto:${data.email}`} className={`${theme.accent} hover:underline`}>
                {data.email}
              </a>
            </div>
          )}
          
          {data?.phone && (
            <div className={`text-center p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-lg`}>
              <Phone className={`w-12 h-12 ${theme.accent} mx-auto mb-4`} />
              <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>Phone</h3>
              <a href={`tel:${data.phone}`} className={`${theme.accent} hover:underline`}>
                {data.phone}
              </a>
            </div>
          )}
          
          {data?.address && (
            <div className={`text-center p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-lg`}>
              <MapPin className={`w-12 h-12 ${theme.accent} mx-auto mb-4`} />
              <h3 className={`text-lg font-semibold ${theme.text} mb-2`}>Address</h3>
              <p className={`${theme.secondary}`}>{data.address}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 