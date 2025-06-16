import { useState, useEffect } from 'react';
import { Theme } from '../styles/themes';

interface ReadingProgressProps {
  theme: Theme;
}

export default function ReadingProgress({ }: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    const throttledUpdate = throttle(updateProgress, 10);
    window.addEventListener('scroll', throttledUpdate);
    
    return () => window.removeEventListener('scroll', throttledUpdate);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-800 z-50">
      <div 
        className={`h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-150 ease-out`}
        style={{ width: `${progress}%` }}
      />
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