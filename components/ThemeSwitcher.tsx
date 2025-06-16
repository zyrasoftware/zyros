import { useState, useEffect } from 'react';
import { Palette, Check } from './Icons';
import { Theme, themes, getThemeNames } from '../styles/themes';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (themeName: string) => void;
}

export default function ThemeSwitcher({ currentTheme, onThemeChange }: ThemeSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);
  const themeNames = getThemeNames();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-theme-switcher]')) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemePreview = (themeName: string) => {
    const theme = themes[themeName];
    return (
      <div className="flex space-x-1">
        <div className={`w-3 h-3 rounded-full ${theme.background.replace('bg-', 'bg-').split(' ')[0]} border border-gray-300`} />
        <div className={`w-3 h-3 rounded-full ${theme.accent.replace('text-', 'bg-')}`} />
        <div className={`w-3 h-3 rounded-full ${theme.card.replace('bg-', 'bg-').split(' ')[0]} border border-gray-300`} />
      </div>
    );
  };

  return (
    <div className="relative" data-theme-switcher>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${currentTheme.card} ${currentTheme.border} border transition-all duration-200 hover:${currentTheme.shadow} group`}
        title="Change theme"
      >
        <Palette className="w-4 h-4" />
        <span className="hidden sm:inline text-sm font-medium">
          {currentTheme.name.charAt(0).toUpperCase() + currentTheme.name.slice(1)}
        </span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 top-full mt-2 w-64 ${currentTheme.card} rounded-xl ${currentTheme.shadow} border ${currentTheme.border} overflow-hidden z-50 animate-fade-in-down`}>
          <div className={`px-4 py-3 border-b ${currentTheme.border}`}>
            <h3 className={`font-semibold ${currentTheme.text}`}>Choose Theme</h3>
            <p className={`text-sm ${currentTheme.secondary} mt-1`}>
              Select your preferred color scheme
            </p>
          </div>
          
          <div className="py-2 max-h-80 overflow-y-auto">
            {themeNames.map((themeName) => {
              const isSelected = currentTheme.name === themeName;
              
              return (
                <button
                  key={themeName}
                  onClick={() => {
                    onThemeChange(themeName);
                    setIsOpen(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:${currentTheme.card} transition-colors flex items-center justify-between group ${
                    isSelected ? currentTheme.card : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {getThemePreview(themeName)}
                    <div>
                      <div className={`font-medium ${currentTheme.text} capitalize`}>
                        {themeName}
                      </div>
                      <div className={`text-xs ${currentTheme.secondary}`}>
                        {getThemeDescription(themeName)}
                      </div>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <Check className={`w-4 h-4 ${currentTheme.accent}`} />
                  )}
                </button>
              );
            })}
          </div>
          
          <div className={`px-4 py-3 border-t ${currentTheme.border} ${currentTheme.card}`}>
            <p className={`text-xs ${currentTheme.secondary}`}>
              Theme preference is saved locally
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function getThemeDescription(themeName: string): string {
  const descriptions: Record<string, string> = {
    light: 'Clean and bright',
    dark: 'Easy on the eyes',
    minimal: 'Simple and elegant',
    ocean: 'Cool and refreshing',
    sunset: 'Warm and vibrant',
    forest: 'Natural and calming',
    midnight: 'Deep and mysterious',
    neon: 'Bold and electric',
  };
  
  return descriptions[themeName] || 'Custom theme';
} 