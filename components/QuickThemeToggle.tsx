import { Sun, Moon } from './Icons';
import { Theme } from '../styles/themes';

interface QuickThemeToggleProps {
  currentTheme: Theme;
  onThemeChange: (themeName: string) => void;
}

export default function QuickThemeToggle({ currentTheme, onThemeChange }: QuickThemeToggleProps) {
  const isDark = currentTheme.name === 'dark' || currentTheme.name === 'midnight' || currentTheme.name === 'neon';
  
  const toggleTheme = () => {
    if (isDark) {
      onThemeChange('light');
    } else {
      onThemeChange('dark');
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-lg ${currentTheme.card} ${currentTheme.border} border transition-all duration-200 hover:${currentTheme.shadow} hover:scale-105`}
      title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Sun className="w-4 h-4" />
      ) : (
        <Moon className="w-4 h-4" />
      )}
    </button>
  );
} 