import { useState, useEffect } from 'react';
import { Mail, Check, X, ArrowRight } from './Icons';

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
}

export default function Newsletter({ theme, compact = false }: NewsletterProps) {
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
      // Simulate API call - in a real app, you'd integrate with a service like:
      // - Mailchimp
      // - ConvertKit
      // - Buttondown
      // - Substack
      // - Or your own backend
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store subscription locally for demo purposes
      const subscriptions = JSON.parse(localStorage.getItem('newsletter-subscriptions') || '[]');
      if (!subscriptions.includes(email)) {
        subscriptions.push({
          email,
          subscribedAt: new Date().toISOString(),
          source: 'blog'
        });
        localStorage.setItem('newsletter-subscriptions', JSON.stringify(subscriptions));
        setSubscriberCount(subscriptions.length);
      }

      setStatus('success');
      setMessage('Thanks for subscribing! You\'ll receive updates about new posts.');
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
      
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  if (compact) {
    return (
      <div className={`p-6 rounded-2xl ${theme.card} border ${theme.border} shadow-lg`}>
        <div className="flex items-center mb-4">
          <div className={`p-2 rounded-lg bg-blue-500/10 text-blue-500 mr-3`}>
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`font-semibold ${theme.accent}`}>Stay Updated</h3>
            <p className={`text-sm ${theme.secondary}`}>Get notified of new posts</p>
          </div>
        </div>

        {status === 'success' ? (
          <div className="flex items-center text-green-500">
            <Check className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Subscribed successfully!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className={`flex-1 px-3 py-2 rounded-lg border ${theme.border} ${theme.background} ${theme.text} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-medium text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
            >
              {status === 'loading' ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                'Subscribe'
              )}
            </button>
          </form>
        )}

        {status === 'error' && (
          <div className="flex items-center text-red-500 mt-2">
            <X className="w-4 h-4 mr-2" />
            <span className="text-sm">{message}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`p-8 rounded-3xl ${theme.card} border ${theme.border} shadow-xl relative overflow-hidden`}>
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5" />
      <div className="absolute top-4 right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />
      
      <div className="relative z-10 text-center max-w-md mx-auto">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6 animate-bounce-gentle`}>
          <Mail className="w-8 h-8" />
        </div>

        {/* Heading */}
        <h3 className={`text-2xl lg:text-3xl font-bold ${theme.accent} mb-4`}>
          Never Miss a Post
        </h3>
        
        <p className={`text-lg ${theme.secondary} mb-8 leading-relaxed`}>
          Subscribe to get the latest articles delivered straight to your inbox. 
          No spam, just quality content about web development and technology.
        </p>

        {status === 'success' ? (
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-4`}>
              <Check className="w-8 h-8" />
            </div>
            <h4 className={`text-xl font-semibold ${theme.accent} mb-2`}>
              Welcome aboard! 🎉
            </h4>
            <p className={`${theme.secondary}`}>
              {message}
            </p>
          </div>
        ) : (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className={`w-full px-6 py-4 rounded-2xl border ${theme.border} ${theme.background} ${theme.text} text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                  disabled={status === 'loading'}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <Mail className={`w-5 h-5 ${theme.secondary}`} />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading' || !email}
                className="w-full inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Error Message */}
            {status === 'error' && (
              <div className={`mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center text-red-500`}>
                <X className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {/* Privacy Note */}
            <p className={`text-sm ${theme.secondary} opacity-75 mt-6`}>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </>
        )}

        {/* Stats */}
        <div className="flex items-center justify-center space-x-6 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className={`text-lg font-bold ${theme.accent}`}>
              {isClient ? subscriberCount : 0}+
            </div>
            <div className={`text-xs ${theme.secondary}`}>Subscribers</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${theme.accent}`}>Weekly</div>
            <div className={`text-xs ${theme.secondary}`}>Updates</div>
          </div>
          <div className="text-center">
            <div className={`text-lg font-bold ${theme.accent}`}>0%</div>
            <div className={`text-xs ${theme.secondary}`}>Spam</div>
          </div>
        </div>
      </div>
    </div>
  );
} 