import { useState, useEffect } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link2, Check } from './Icons';
import { analytics } from '../lib/analytics';

interface SocialShareProps {
  title: string;
  url: string;
  description?: string;
  theme: {
    card: string;
    border: string;
    text: string;
    accent: string;
    secondary: string;
    code: string;
  };
  slug: string;
}

export default function SocialShare({ title, url, description, theme, slug }: SocialShareProps) {
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setHasNativeShare(typeof window !== 'undefined' && 'share' in navigator);
  }, []);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : url;
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };

  const handleShare = (platform: string) => {
    analytics.trackShare(slug, platform);
    
    if (platform === 'copy') {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      window.open(shareLinks[platform as keyof typeof shareLinks], '_blank', 'width=600,height=400');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url: shareUrl,
        });
        analytics.trackShare(slug, 'native');
      } catch {
        // User cancelled or error occurred
      }
    }
  };

  return (
    <div className="relative">
      {/* Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-300 ${theme.card} border ${theme.border} ${theme.text} hover:${theme.accent} hover:scale-105 hover:shadow-lg`}
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </button>

      {/* Share Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className={`absolute top-full left-0 mt-2 p-4 rounded-2xl ${theme.card} border ${theme.border} shadow-2xl z-50 min-w-[280px] animate-fade-in-up`}>
            <div className={`text-sm font-medium ${theme.secondary} mb-4`}>
              Share this article
            </div>
            
            <div className="space-y-2">
              {/* Native Share (if supported) */}
              {isClient && hasNativeShare && (
                <button
                  onClick={handleNativeShare}
                  className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${theme.code} hover:${theme.accent} hover:scale-105`}
                >
                  <Share2 className="w-5 h-5 mr-3 text-blue-500" />
                  <span className={`font-medium ${theme.text}`}>Share via...</span>
                </button>
              )}

              {/* Twitter */}
              <button
                onClick={() => handleShare('twitter')}
                className={`social-share-button w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${theme.code} hover:${theme.accent} hover:scale-105`}
              >
                <Twitter className="w-5 h-5 mr-3 text-blue-400" />
                <span className={`font-medium ${theme.text}`}>Share on Twitter</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => handleShare('facebook')}
                className={`social-share-button w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${theme.code} hover:${theme.accent} hover:scale-105`}
              >
                <Facebook className="w-5 h-5 mr-3 text-blue-600" />
                <span className={`font-medium ${theme.text}`}>Share on Facebook</span>
              </button>

              {/* LinkedIn */}
              <button
                onClick={() => handleShare('linkedin')}
                className={`social-share-button w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${theme.code} hover:${theme.accent} hover:scale-105`}
              >
                <Linkedin className="w-5 h-5 mr-3 text-blue-700" />
                <span className={`font-medium ${theme.text}`}>Share on LinkedIn</span>
              </button>

              {/* Copy Link */}
              <button
                onClick={() => handleShare('copy')}
                className={`w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${theme.code} hover:${theme.accent} hover:scale-105`}
              >
                {copied ? (
                  <Check className="w-5 h-5 mr-3 text-green-500" />
                ) : (
                  <Link2 className="w-5 h-5 mr-3 text-gray-500" />
                )}
                <span className={`font-medium ${theme.text}`}>
                  {copied ? 'Link copied!' : 'Copy link'}
                </span>
              </button>
            </div>

            {/* URL Preview */}
            <div className={`mt-4 p-3 rounded-xl ${theme.code} border`}>
              <div className={`text-xs ${theme.secondary} mb-1`}>Share URL:</div>
              <div className={`text-sm ${theme.text} font-mono break-all`}>
                {shareUrl}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 