import React, { ReactNode } from 'react';

interface CustomButtonConfig {
  enabled?: boolean;
  text?: string;
  icon?: string;
  iconPosition?: 'left' | 'right';
  styles?: {
    backgroundColor?: string;
    color?: string;
    borderRadius?: string;
    fontSize?: string;
    fontWeight?: string;
    padding?: string;
    border?: string;
    boxShadow?: string;
    transition?: string;
    [key: string]: string | undefined;
  };
  hoverStyles?: {
    backgroundColor?: string;
    color?: string;
    transform?: string;
    boxShadow?: string;
    [key: string]: string | undefined;
  };
}

interface CustomButtonProps {
  buttonId: string;
  customButtons?: Record<string, CustomButtonConfig>;
  children?: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  fallbackText?: string;
}

export default function CustomButton({
  buttonId,
  customButtons,
  children,
  className = '',
  onClick,
  href,
  fallbackText = 'Button'
}: CustomButtonProps) {
  const buttonConfig = customButtons?.[buttonId];
  
  // Debug logging
  console.log('🔍 CustomButton Debug:', {
    buttonId,
    buttonConfig,
    customButtons,
    enabled: buttonConfig?.enabled,
    hasCustomButtons: !!customButtons,
    buttonConfigExists: !!buttonConfig,
    configText: buttonConfig?.text,
    timestamp: new Date().toISOString()
  });
  
  // If no custom buttons config at all, render a fallback button
  if (!customButtons) {
    console.log('⚠️ No customButtons config found, rendering fallback button for:', buttonId);
    const fallbackElement = (
      <button
        className={`inline-flex items-center justify-center px-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ${className}`}
        onClick={() => href ? window.location.href = href : onClick?.()}
      >
        {children || fallbackText}
      </button>
    );
    return fallbackElement;
  }
  
  // If button is disabled or config doesn't exist, return fallback
  if (!buttonConfig?.enabled) {
    console.log('❌ Button not enabled or config missing:', buttonId, 'Config:', buttonConfig);
    console.log('🔄 Rendering fallback button instead');
    const fallbackElement = (
      <button
        className={`inline-flex items-center justify-center px-6 py-3 rounded-2xl font-semibold text-lg transition-all duration-300 bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 hover:scale-105 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 ${className}`}
        onClick={() => href ? window.location.href = href : onClick?.()}
      >
        {children || fallbackText} (Fallback)
      </button>
    );
    return fallbackElement;
  }
  
  console.log('✅ Button will render with custom config:', buttonId);

  const baseStyles = buttonConfig.styles || {};
  const hoverStyles = buttonConfig.hoverStyles || {};
  
  // Ensure text color is properly applied
  const enhancedBaseStyles = {
    ...baseStyles,
    // Force text color with higher specificity
    color: baseStyles.color || '#000000',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  };

  // Render button content with icon support
  const renderButtonContent = () => {
    const text = buttonConfig.text || children || fallbackText;
    const icon = buttonConfig.icon;
    const iconPosition = buttonConfig.iconPosition || 'left';

    if (!icon) {
      return text;
    }

    return (
      <>
        {iconPosition === 'left' && <span style={{ fontSize: '1.2em' }}>{icon}</span>}
        <span>{text}</span>
        {iconPosition === 'right' && <span style={{ fontSize: '1.2em' }}>{icon}</span>}
      </>
    );
  };
  
  // Generate CSS for hover effects
  const hoverCSS = Object.entries(hoverStyles)
    .map(([key, value]) => {
      const cssProperty = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssProperty}: ${value} !important;`;
    })
    .join(' ');

  const buttonElement = (
    <>
      <style jsx>{`
        .custom-button-${buttonId}:hover {
          ${hoverCSS}
        }
      `}</style>
      <button
        className={`custom-button-${buttonId} inline-flex items-center justify-center transition-all duration-300 cursor-pointer ${className}`}
        style={enhancedBaseStyles}
        onClick={onClick}
      >
        {renderButtonContent()}
      </button>
    </>
  );

  // If href is provided, wrap in a link-like div (since we can't nest button in Link)
  if (href) {
    return (
      <>
        <style jsx>{`
          .custom-button-${buttonId}:hover {
            ${hoverCSS}
          }
        `}</style>
        <div
          className={`custom-button-${buttonId} inline-flex items-center justify-center transition-all duration-300 cursor-pointer ${className}`}
          style={enhancedBaseStyles}
          onClick={() => window.location.href = href}
        >
          {renderButtonContent()}
        </div>
      </>
    );
  }

  return buttonElement;
} 