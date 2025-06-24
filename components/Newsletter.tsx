import { useState, useEffect } from 'react';
import { Mail, Check, X, ArrowRight, Star, Sparkles } from './Icons';

interface NewsletterCustomization {
  enabled?: boolean;
  style?: 'minimal' | 'modern' | 'glassmorphism' | 'gradient' | 'elegant';
  colorScheme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
  };
  content?: {
    title?: string;
    subtitle?: string;
    placeholder?: string;
    buttonText?: string;
    successMessage?: string;
    privacyNote?: string;
  };
  layout?: 'centered' | 'split' | 'inline' | 'floating';
  showStats?: boolean;
  showIcon?: boolean;
  animation?: 'none' | 'fade' | 'slide' | 'bounce' | 'scale';
}

interface NewsletterProps {
  theme: {
    card: string;
    border: string;
    accent: string;
    secondary: string;
    background: string;
    text: string;
  };
  compact?: boolean;
  customization?: NewsletterCustomization;
  siteData?: any;
}

export default function Newsletter({ 
  theme, 
  compact = false, 
  customization = {},
  siteData 
}: NewsletterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const subscriptions = JSON.parse(localStorage.getItem('newsletter-subscriptions') || '[]');
      setSubscriberCount(subscriptions.length);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setStatus('error');
      setMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const subscriptions = JSON.parse(localStorage.getItem('newsletter-subscriptions') || '[]');
      if (!subscriptions.find((sub: any) => sub.email === email)) {
        subscriptions.push({
          email,
          subscribedAt: new Date().toISOString(),
          source: 'newsletter'
        });
        localStorage.setItem('newsletter-subscriptions', JSON.stringify(subscriptions));
        setSubscriberCount(subscriptions.length);
      }

      setStatus('success');
      setMessage(customization.content?.successMessage || 'Thanks for subscribing! You\'ll receive updates about new posts.');
      setEmail('');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 4000);
      
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  // Get customized colors
  const colors = {
    primary: customization.colorScheme?.primary || siteData?.site?.customization?.colorScheme?.primary || '#3B82F6',
    secondary: customization.colorScheme?.secondary || siteData?.site?.customization?.colorScheme?.secondary || '#8B5CF6',
    accent: customization.colorScheme?.accent || siteData?.site?.customization?.colorScheme?.accent || '#06B6D4',
    background: customization.colorScheme?.background || siteData?.site?.customization?.colorScheme?.background || '#FFFFFF',
    surface: customization.colorScheme?.surface || siteData?.site?.customization?.colorScheme?.surface || '#F9FAFB'
  };

  // Get customized content
  const content = {
    title: customization.content?.title || 'Never Miss a Post',
    subtitle: customization.content?.subtitle || 'Subscribe to get the latest articles delivered straight to your inbox. No spam, just quality content.',
    placeholder: customization.content?.placeholder || 'Enter your email address',
    buttonText: customization.content?.buttonText || 'Subscribe Now',
    privacyNote: customization.content?.privacyNote || 'We respect your privacy. Unsubscribe at any time.'
  };

  // Get style classes based on customization
  const getStyleClasses = () => {
    const style = customization.style || 'modern';
    
    switch (style) {
      case 'minimal':
        return {
          container: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl',
          background: 'bg-gradient-to-br from-gray-50/50 to-white/50 dark:from-gray-800/50 dark:to-gray-900/50'
        };
      case 'glassmorphism':
        return {
          container: 'bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl border border-white/20 dark:border-gray-700/30 rounded-3xl',
          background: 'bg-gradient-to-br from-white/5 to-transparent'
        };
      case 'gradient':
        return {
          container: `rounded-3xl border border-white/20`,
          background: `bg-gradient-to-br`,
          style: {
            background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`,
            color: 'white'
          }
        };
      case 'elegant':
        return {
          container: 'bg-white dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl',
          background: 'bg-gradient-to-br from-blue-50/30 to-purple-50/30 dark:from-blue-900/10 dark:to-purple-900/10'
        };
      default: // modern
        return {
          container: 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl shadow-xl',
          background: 'bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-900/10 dark:to-purple-900/10'
        };
    }
  };

  const styleClasses = getStyleClasses();

  if (compact) {
    return (
      <div className={`p-4 sm:p-6 ${styleClasses.container} transition-all duration-300 hover:shadow-lg`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Icon & Text */}
          <div className="flex items-center gap-3 flex-1">
            {customization.showIcon !== false && (
              <div 
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg"
                style={{ 
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})` 
                }}
              >
                <Mail className="w-5 h-5" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">Stay Updated</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Get notified of new posts</p>
            </div>
          </div>

          {/* Form or Success */}
          {status === 'success' ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">Subscribed!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2 flex-1 sm:flex-initial">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 sm:w-48 px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300"
                style={{ 
                  focusRingColor: colors.primary + '50',
                  '--tw-ring-color': colors.primary + '50'
                } as any}
                disabled={status === 'loading'}
              />
              <button
                type="submit"
                disabled={status === 'loading' || !email}
                className="px-4 py-2 rounded-xl text-white font-medium text-sm transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                }}
              >
                {status === 'loading' ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
          )}
        </div>

        {status === 'error' && (
          <div className="flex items-center gap-2 text-red-500 mt-3 text-sm">
            <X className="w-4 h-4" />
            <span>{message}</span>
          </div>
        )}
      </div>
    );
  }

  // Full Newsletter Component
  return (
    <div 
      className={`relative overflow-hidden ${styleClasses.container} p-8 sm:p-12 lg:p-16`}
      style={styleClasses.style}
    >
      {/* Background Elements */}
      <div className={`absolute inset-0 ${styleClasses.background}`} />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full opacity-20 animate-pulse"
            style={{
              backgroundColor: colors.accent,
              left: `${20 + (i * 15)}%`,
              top: `${10 + (i * 20)}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i * 0.5)}s`
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <div 
          className="absolute w-32 h-32 rounded-full blur-3xl opacity-20 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${colors.primary}, transparent)`,
            top: '10%',
            right: '10%',
            animationDuration: '4s'
          }}
        />
        <div 
          className="absolute w-24 h-24 rounded-full blur-2xl opacity-15 animate-pulse"
          style={{
            background: `radial-gradient(circle, ${colors.secondary}, transparent)`,
            bottom: '20%',
            left: '15%',
            animationDelay: '2s',
            animationDuration: '5s'
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Layout based on customization */}
        {customization.layout === 'split' ? (
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-6">
              {customization.showIcon !== false && (
                <div 
                  className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 rounded-3xl text-white shadow-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                  }}
                >
                  <Mail className="w-8 h-8 lg:w-10 lg:h-10" />
                </div>
              )}
              
              <div>
                <h3 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                  {content.title}
                </h3>
                <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  {content.subtitle}
                </p>
              </div>

              {/* Stats */}
              {customization.showStats !== false && (
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div 
                      className="text-2xl lg:text-3xl font-bold"
                      style={{ color: colors.primary }}
                    >
                      {isClient ? subscriberCount : 0}+
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Subscribers</div>
                  </div>
                  <div className="text-center">
                    <div 
                      className="text-2xl lg:text-3xl font-bold"
                      style={{ color: colors.secondary }}
                    >
                      Weekly
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Updates</div>
                  </div>
                  <div className="text-center">
                    <div 
                      className="text-2xl lg:text-3xl font-bold"
                      style={{ color: colors.accent }}
                    >
                      0%
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Spam</div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Form */}
            <div className="space-y-6">
              {status === 'success' ? (
                <div className="text-center p-8 rounded-3xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                    Welcome aboard! 🎉
                  </h4>
                  <p className="text-green-700 dark:text-green-300">{message}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={content.placeholder}
                      className="w-full px-6 py-4 lg:py-5 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 pr-12"
                      style={{
                        '--tw-ring-color': colors.primary + '50'
                      } as any}
                      disabled={status === 'loading'}
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading' || !email}
                    className="w-full inline-flex items-center justify-center px-8 py-4 lg:py-5 rounded-2xl font-semibold text-lg text-white transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    style={{
                      background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                    }}
                  >
                    {status === 'loading' ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        {content.buttonText}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </>
                    )}
                  </button>

                  {status === 'error' && (
                    <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center text-red-600 dark:text-red-400">
                      <X className="w-5 h-5 mr-2 flex-shrink-0" />
                      <span>{message}</span>
                    </div>
                  )}

                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                    {content.privacyNote}
                  </p>
                </form>
              )}
            </div>
          </div>
        ) : (
          /* Centered Layout */
          <div className="text-center max-w-2xl mx-auto space-y-8">
            {customization.showIcon !== false && (
              <div 
                className="inline-flex items-center justify-center w-20 h-20 rounded-3xl text-white shadow-2xl animate-bounce-gentle"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                }}
              >
                <Mail className="w-10 h-10" />
              </div>
            )}

            <div>
              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                {content.title}
              </h3>
              <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                {content.subtitle}
              </p>
            </div>

            {status === 'success' ? (
              <div className="p-8 rounded-3xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h4 className="text-xl font-bold text-green-900 dark:text-green-100 mb-2">
                  Welcome aboard! 🎉
                </h4>
                <p className="text-green-700 dark:text-green-300">{message}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={content.placeholder}
                    className="w-full px-6 py-4 lg:py-5 rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-300 pr-12"
                    style={{
                      '--tw-ring-color': colors.primary + '50'
                    } as any}
                    disabled={status === 'loading'}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <Mail className="w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading' || !email}
                  className="w-full inline-flex items-center justify-center px-8 py-4 lg:py-5 rounded-2xl font-semibold text-lg text-white transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  style={{
                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.secondary})`
                  }}
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Subscribing...
                    </>
                  ) : (
                    <>
                      {content.buttonText}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>

                {status === 'error' && (
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center text-red-600 dark:text-red-400">
                    <X className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{message}</span>
                  </div>
                )}

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {content.privacyNote}
                </p>
              </form>
            )}

            {/* Stats */}
            {customization.showStats !== false && (
              <div className="flex items-center justify-center gap-8 sm:gap-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div 
                    className="text-2xl lg:text-3xl font-bold"
                    style={{ color: colors.primary }}
                  >
                    {isClient ? subscriberCount : 0}+
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Subscribers</div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-2xl lg:text-3xl font-bold"
                    style={{ color: colors.secondary }}
                  >
                    Weekly
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Updates</div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-2xl lg:text-3xl font-bold"
                    style={{ color: colors.accent }}
                  >
                    0%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Spam</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 