import { useMemo } from 'react';
import { UICustomizationConfig, AnimationConfig, LayoutConfig, FloatingElementsConfig } from '../types/site';

interface UseCustomizationProps {
  ui?: UICustomizationConfig;
  animations?: AnimationConfig;
  layout?: LayoutConfig;
  floatingElements?: FloatingElementsConfig;
}

export function useCustomization({ ui, animations, layout, floatingElements }: UseCustomizationProps) {
  
  // Generate CSS custom properties for animations
  const animationCSS = useMemo(() => {
    if (!animations) return '';
    
    const properties: string[] = [];
    
    // Duration properties
    if (animations.durations) {
      Object.entries(animations.durations).forEach(([key, value]) => {
        if (value) properties.push(`--duration-${key}: ${value};`);
      });
    }
    
    // Easing properties
    if (animations.easings) {
      Object.entries(animations.easings).forEach(([key, value]) => {
        if (value) properties.push(`--easing-${key}: ${value};`);
      });
    }
    
    // Transition properties
    if (animations.transitions) {
      Object.entries(animations.transitions).forEach(([key, value]) => {
        if (value) properties.push(`--transition-${key}: ${value};`);
      });
    }
    
    return `:root { ${properties.join(' ')} }`;
  }, [animations]);

  // Generate CSS custom properties for layout
  const layoutCSS = useMemo(() => {
    if (!layout) return '';
    
    const properties: string[] = [];
    
    // Container properties
    if (layout.container) {
      Object.entries(layout.container).forEach(([key, value]) => {
        if (value) properties.push(`--container-${key}: ${value};`);
      });
    }
    
    // Spacing properties
    if (layout.spacing) {
      Object.entries(layout.spacing).forEach(([key, value]) => {
        if (value) properties.push(`--spacing-${key}: ${value};`);
      });
    }
    
    // Breakpoint properties
    if (layout.breakpoints) {
      Object.entries(layout.breakpoints).forEach(([key, value]) => {
        if (value) properties.push(`--breakpoint-${key}: ${value};`);
      });
    }
    
    return `:root { ${properties.join(' ')} }`;
  }, [layout]);

  // Generate CSS custom properties for UI elements
  const uiCSS = useMemo(() => {
    if (!ui) return '';
    
    const properties: string[] = [];
    
    // Reading progress properties
    if (ui.readingProgress) {
      Object.entries(ui.readingProgress).forEach(([key, value]) => {
        if (value && typeof value === 'string') {
          properties.push(`--reading-progress-${key}: ${value};`);
        }
      });
    }
    
    // Z-index properties
    if (ui.zIndexes) {
      Object.entries(ui.zIndexes).forEach(([key, value]) => {
        if (value) properties.push(`--z-${key}: ${value};`);
      });
    }
    
    return `:root { ${properties.join(' ')} }`;
  }, [ui]);

  // Helper function to get floating element styles
  const getFloatingElementStyle = (elementKey: keyof FloatingElementsConfig) => {
    const element = floatingElements?.[elementKey];
    if (!element || !element.enabled) return null;

    const style: React.CSSProperties = {
      position: 'fixed',
      zIndex: element.zIndex || 50,
      ...element.position,
      ...element.style,
    };

    return style;
  };

  // Helper function to get animation class names
  const getAnimationClasses = (type: 'hover' | 'click' | 'entrance') => {
    return {
      fast: animations?.durations?.fast || '150ms',
      normal: animations?.durations?.normal || '300ms',
      slow: animations?.durations?.slow || '500ms',
      bounce: animations?.easings?.bounce || 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: animations?.easings?.elastic || 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    };
  };

  // Helper function to check if an element is enabled
  const isElementEnabled = (elementKey: keyof FloatingElementsConfig) => {
    return floatingElements?.[elementKey]?.enabled === true;
  };

  // Helper function to get UI element configuration
  const getUIConfig = <T extends keyof UICustomizationConfig>(key: T): UICustomizationConfig[T] => {
    return ui?.[key];
  };

  // Helper function to get layout values
  const getLayoutValue = (path: string) => {
    const keys = path.split('.');
    let value: any = layout;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) break;
    }
    return value;
  };

  return {
    // CSS generation
    animationCSS,
    layoutCSS,
    uiCSS,
    
    // Helper functions
    getFloatingElementStyle,
    getAnimationClasses,
    isElementEnabled,
    getUIConfig,
    getLayoutValue,
    
    // Raw configurations
    ui,
    animations,
    layout,
    floatingElements,
  };
} 