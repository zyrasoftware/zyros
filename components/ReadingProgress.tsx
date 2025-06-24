import { useState, useEffect } from 'react';
import { Theme } from '../styles/themes';
import { UICustomizationConfig } from '../types/site';

interface ReadingProgressProps {
  theme: Theme;
  uiConfig?: UICustomizationConfig;
}

export default function ReadingProgress({ theme, uiConfig }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  // Get reading progress configuration
  const readingProgressConfig = uiConfig?.readingProgress;

  useEffect(() => {
    // Don't set up listeners if disabled
    if (!readingProgressConfig?.enabled) {
      return;
    }

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    const throttledUpdate = throttle(updateProgress, 10);
    window.addEventListener('scroll', throttledUpdate);
    
    return () => window.removeEventListener('scroll', throttledUpdate);
  }, [readingProgressConfig?.enabled]);

  // Don't render if disabled
  if (!readingProgressConfig?.enabled) {
    return null;
  }

  // Use configuration values or fallbacks
  const height = readingProgressConfig.height || '3px';
  const background = readingProgressConfig.background || '#e2e8f0';
  const foreground = readingProgressConfig.foreground || 'linear-gradient(90deg, #0ea5e9 0%, #06b6d4 50%, #8b5cf6 100%)';
  const position = readingProgressConfig.position || 'top';
  const zIndex = readingProgressConfig.zIndex || 50;

  const containerStyle: React.CSSProperties = {
    position: 'fixed',
    [position]: 0,
    left: 0,
    width: '100%',
    height: height,
    background: background,
    zIndex: zIndex,
  };

  const progressStyle: React.CSSProperties = {
    height: '100%',
    background: foreground,
    width: `${progress}%`,
    transition: 'width 150ms ease-out',
  };

  return (
    <div className="reading-progress-bar" style={containerStyle}>
      <div className="reading-progress-fill" style={progressStyle} />
    </div>
  );
}

// Throttle function to limit scroll event frequency
function throttle<T extends (...args: unknown[]) => unknown>(func: T, limit: number): T {
  let inThrottle: boolean;
  return ((...args: unknown[]) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }) as T;
} 