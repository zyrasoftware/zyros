import React from 'react';
import { Theme } from '../styles/themes';

interface LoadingSpinnerProps {
  theme: Theme;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'skeleton';
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  theme, 
  size = 'md', 
  variant = 'spinner', 
  text,
  fullScreen = false 
}: LoadingSpinnerProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'w-4 h-4';
      case 'md': return 'w-8 h-8';
      case 'lg': return 'w-12 h-12';
      case 'xl': return 'w-16 h-16';
      default: return 'w-8 h-8';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 'text-sm';
      case 'md': return 'text-base';
      case 'lg': return 'text-lg';
      case 'xl': return 'text-xl';
      default: return 'text-base';
    }
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`${getSizeClasses()} animate-spin`}>
            <div className={`w-full h-full border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full`}></div>
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-2">
                    <div className={`loading-spinner w-3 h-3 bg-blue-500 rounded-full animate-bounce`}></div>
        <div className={`loading-spinner w-3 h-3 bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0.1s' }}></div>
        <div className={`loading-spinner w-3 h-3 bg-blue-500 rounded-full animate-bounce`} style={{ animationDelay: '0.2s' }}></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className={`${getSizeClasses()} bg-blue-500 rounded-full animate-pulse`}></div>
        );
      
      case 'skeleton':
        return (
          <div className="space-y-3 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          </div>
        );
      
      default:
        return (
          <div className={`${getSizeClasses()} animate-spin`}>
            <div className={`w-full h-full border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 rounded-full`}></div>
          </div>
        );
    }
  };

  const content = (
    <div className="flex flex-col items-center justify-center space-y-4">
      {renderSpinner()}
      {text && (
        <p className={`${getTextSize()} ${theme.secondary} font-medium animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${theme.background} bg-opacity-90 backdrop-blur-sm`}>
        {content}
      </div>
    );
  }

  return content;
}

// Skeleton components for different content types
export function SkeletonCard({ theme }: { theme: Theme }) {
  return (
    <div className={`p-6 rounded-2xl ${theme.card} border ${theme.border} animate-pulse`}>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number; theme: Theme }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: lines }).map((_, index) => (
        <div 
          key={index}
          className={`h-4 bg-gray-200 dark:bg-gray-700 rounded ${
            index === lines - 1 ? 'w-3/4' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse`}></div>
  );
} 