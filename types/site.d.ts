export interface SiteConfig {
  site: {
    title: string;
    description?: string;
    theme?: 'light' | 'dark' | 'minimal' | 'ocean' | 'sunset' | 'forest' | 'midnight' | 'neon';
    author?: string;
    url?: string;
    language?: string;
    favicon?: string;
    logo?: string;
    layout?: 'default' | 'blog' | 'portfolio' | 'landing' | 'documentation' | 'magazine';
    social?: {
      twitter?: string;
      github?: string;
      linkedin?: string;
      email?: string;
      facebook?: string;
      instagram?: string;
      youtube?: string;
    };
    analytics?: {
      googleAnalytics?: string;
      plausible?: string;
    };
    seo?: {
      keywords?: string[];
      ogImage?: string;
      twitterCard?: 'summary' | 'summary_large_image';
    };
    features?: {
      search?: boolean;
      newsletter?: boolean;
      comments?: boolean;
      darkMode?: boolean;
      analytics?: boolean;
      socialShare?: boolean;
      tableOfContents?: boolean;
      readingProgress?: boolean;
    };
  };
  pages: Page[];
  navigation?: NavigationItem[];
  header?: HeaderConfig;
  footer?: FooterConfig;
  contentBlocks?: ContentBlock[];
  forms?: FormConfig[];
  gallery?: GalleryConfig[];
  i18n?: InternationalizationConfig;
}

export interface Page {
  title: string;
  slug: string;
  content: string;
  description?: string;
  category?: string;
  tags?: string[];
  publishedAt?: string;
  updatedAt?: string;
  readingTime?: number;
  featured?: boolean;
  draft?: boolean;
  author?: string;
  image?: string;
  layout?: 'default' | 'full-width' | 'sidebar' | 'minimal' | 'landing' | 'grid' | 'masonry' | 'split' | 'magazine' | 'portfolio';
  contentBlocks?: string[]; // References to contentBlocks by ID
  customFields?: Record<string, unknown>;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
}

export interface NavigationItem {
  title: string;
  href: string;
  external?: boolean;
  icon?: string;
  badge?: string;
  children?: NavigationItem[];
  megaMenu?: MegaMenuConfig;
}

export interface HeaderConfig {
  logo?: {
    text?: string;
    image?: string;
    url?: string;
    size?: 'small' | 'medium' | 'large';
    position?: 'left' | 'center' | 'right';
  };
  navigation?: NavigationItem[];
  cta?: {
    text: string;
    href: string;
    style?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
    size?: 'small' | 'medium' | 'large';
    icon?: string;
  };
  search?: boolean;
  themeToggle?: boolean;
  sticky?: boolean;
  transparent?: boolean;
  height?: 'compact' | 'normal' | 'tall';
  style?: 'minimal' | 'modern' | 'classic' | 'bold';
  background?: {
    type?: 'solid' | 'gradient' | 'blur';
    color?: string;
    gradient?: {
      from: string;
      to: string;
      direction?: 'horizontal' | 'vertical' | 'diagonal';
    };
  };
  border?: {
    show?: boolean;
    style?: 'solid' | 'dashed' | 'dotted';
    color?: string;
    width?: 'thin' | 'medium' | 'thick';
  };
  layout?: 'spread' | 'center' | 'left' | 'right';
  mobileMenu?: {
    style?: 'slide' | 'overlay' | 'push';
    position?: 'left' | 'right' | 'top' | 'bottom';
  };
}

export interface FooterConfig {
  copyright?: string;
  links?: FooterLink[];
  columns?: FooterColumn[];
  newsletter?: boolean;
  social?: boolean;
  backToTop?: boolean;
  style?: 'minimal' | 'modern' | 'classic' | 'bold';
  layout?: 'columns' | 'centered' | 'split' | 'stacked';
  background?: {
    type?: 'solid' | 'gradient' | 'image';
    color?: string;
    gradient?: {
      from: string;
      to: string;
      direction?: 'horizontal' | 'vertical' | 'diagonal';
    };
    image?: string;
  };
  spacing?: 'compact' | 'normal' | 'spacious';
  border?: {
    show?: boolean;
    style?: 'solid' | 'dashed' | 'dotted';
    color?: string;
    width?: 'thin' | 'medium' | 'thick';
  };
  socialLinks?: {
    platform: string;
    url: string;
    icon?: string;
    color?: string;
  }[];
  customSections?: {
    id: string;
    title?: string;
    content?: string;
    position?: 'left' | 'center' | 'right';
  }[];
}

export interface FooterLink {
  title: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface ContentBlock {
  id: string;
  type: 'hero' | 'features' | 'testimonials' | 'cta' | 'gallery' | 'stats' | 'team' | 'faq' | 'pricing' | 'contact';
  title?: string;
  subtitle?: string;
  content?: string;
  data?: Record<string, unknown>;
  style?: Record<string, unknown>;
  visible?: boolean;
}

export interface FormConfig {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  submitText?: string;
  successMessage?: string;
  action?: string;
  method?: 'POST' | 'GET';
}

export interface FormField {
  id: string;
  type: 'text' | 'email' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'file';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // For select, radio, checkbox
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export interface GalleryConfig {
  id: string;
  title: string;
  description?: string;
  images: GalleryImage[];
  layout?: 'grid' | 'masonry' | 'carousel' | 'lightbox';
  columns?: number;
}

export interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
  tags?: string[];
}

export interface MegaMenuConfig {
  columns: MegaMenuColumn[];
  featured?: {
    title: string;
    description: string;
    image?: string;
    href: string;
  };
}

export interface MegaMenuColumn {
  title: string;
  links: NavigationItem[];
}

export interface InternationalizationConfig {
  defaultLocale: string;
  locales: string[];
  translations: Record<string, Record<string, string>>;
}

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
  code: string;
  link: string;
  shadow: string;
} 