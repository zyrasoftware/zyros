export interface Theme {
  name: string;
  background: string;
  text: string;
  accent: string;
  muted: string;
  border: string;
  card: string;
  hover: string;
  primary: string;
  secondary: string;
}

export interface ThemeConfig {
  themes: Record<string, Theme>;
  defaultTheme: string;
}

export type ThemeName = 'light' | 'dark' | 'minimal' | 'ocean' | 'sunset' | 'forest' | 'midnight' | 'neon';

export interface CustomTheme extends Theme {
  custom: true;
  author?: string;
  version?: string;
  description?: string;
} 