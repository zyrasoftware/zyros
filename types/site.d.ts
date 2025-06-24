export interface SiteConfig {
  site: {
    title: string;
    description?: string;
    theme?: 'light' | 'dark' | 'minimal' | 'ocean' | 'sunset' | 'forest' | 'midnight' | 'neon' | 'aurora' | 'autumn' | 'cyberpunk' | 'sakura' | 'custom';
    author?: string;
    url?: string;
    language?: string;
    favicon?: string;
    logo?: string;
    layout?: 'default' | 'blog' | 'portfolio' | 'landing' | 'documentation' | 'magazine' | 'business' | 'minimal';
    customization?: SiteCustomization;
    social?: {
      twitter?: string;
      github?: string;
      linkedin?: string;
      email?: string;
      facebook?: string;
      instagram?: string;
      youtube?: string;
      behance?: string;
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
  pages?: Page[];
  navigation?: NavigationItem[];
  header?: HeaderConfig;
  footer?: FooterConfig;
  contentBlocks?: ContentBlock[];
  forms?: FormConfig[];
  gallery?: GalleryConfig[];
  i18n?: InternationalizationConfig;
  designSystem?: DesignSystemConfig;
  customTheme?: CustomThemeConfig;
  ui?: UICustomizationConfig;
  animations?: AnimationConfig;
  layout?: LayoutConfig;
  floatingElements?: FloatingElementsConfig;
  customButtons?: CustomButtonsConfig;
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
  newsletter?: boolean | NewsletterCustomization;
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
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  customization?: {
    colorScheme?: {
      primary?: string;
      secondary?: string;
      accent?: string;
      background?: string;
      surface?: string;
      text?: string;
    };
  };
}

export interface FooterLink {
  text: string;
  url: string;
  icon?: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface NewsletterCustomization {
  enabled?: boolean;
  style?: 'minimal' | 'modern' | 'glassmorphism' | 'gradient' | 'elegant';
  colorScheme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
  };
  content?: {
    title?: string;
    subtitle?: string;
    placeholder?: string;
    buttonText?: string;
    successMessage?: string;
    privacyNote?: string;
  };
  layout?: 'centered' | 'split' | 'inline' | 'floating';
  showStats?: boolean;
  showIcon?: boolean;
  animation?: 'none' | 'fade' | 'slide' | 'bounce' | 'scale';
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

// New comprehensive design system interfaces
export interface DesignSystemConfig {
  colors?: ColorSystemConfig;
  typography?: TypographySystemConfig;
  spacing?: SpacingSystemConfig;
  borders?: BorderSystemConfig;
  shadows?: ShadowSystemConfig;
  animations?: AnimationSystemConfig;
  breakpoints?: BreakpointSystemConfig;
  components?: ComponentStylesConfig;
}

export interface ColorSystemConfig {
  primary?: ColorPaletteConfig;
  secondary?: ColorPaletteConfig;
  accent?: ColorPaletteConfig;
  neutral?: ColorPaletteConfig;
  success?: ColorPaletteConfig;
  warning?: ColorPaletteConfig;
  error?: ColorPaletteConfig;
  info?: ColorPaletteConfig;
  background?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    overlay?: string;
  };
  text?: {
    primary?: string;
    secondary?: string;
    tertiary?: string;
    inverse?: string;
    muted?: string;
  };
  border?: {
    primary?: string;
    secondary?: string;
    focus?: string;
    error?: string;
    success?: string;
  };
}

export interface ColorPaletteConfig {
  50?: string;
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500?: string;
  600?: string;
  700?: string;
  800?: string;
  900?: string;
  950?: string;
}

export interface TypographySystemConfig {
  fontFamilies?: {
    primary?: string;
    secondary?: string;
    mono?: string;
    display?: string;
  };
  fontSizes?: {
    xs?: string;
    sm?: string;
    base?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    '3xl'?: string;
    '4xl'?: string;
    '5xl'?: string;
    '6xl'?: string;
    '7xl'?: string;
    '8xl'?: string;
    '9xl'?: string;
  };
  fontWeights?: {
    thin?: string;
    extralight?: string;
    light?: string;
    normal?: string;
    medium?: string;
    semibold?: string;
    bold?: string;
    extrabold?: string;
    black?: string;
  };
  lineHeights?: {
    none?: string;
    tight?: string;
    snug?: string;
    normal?: string;
    relaxed?: string;
    loose?: string;
  };
  letterSpacing?: {
    tighter?: string;
    tight?: string;
    normal?: string;
    wide?: string;
    wider?: string;
    widest?: string;
  };
}

export interface SpacingSystemConfig {
  scale?: {
    0?: string;
    px?: string;
    0.5?: string;
    1?: string;
    1.5?: string;
    2?: string;
    2.5?: string;
    3?: string;
    3.5?: string;
    4?: string;
    5?: string;
    6?: string;
    7?: string;
    8?: string;
    9?: string;
    10?: string;
    11?: string;
    12?: string;
    14?: string;
    16?: string;
    20?: string;
    24?: string;
    28?: string;
    32?: string;
    36?: string;
    40?: string;
    44?: string;
    48?: string;
    52?: string;
    56?: string;
    60?: string;
    64?: string;
    72?: string;
    80?: string;
    96?: string;
  };
  container?: {
    padding?: string;
    maxWidth?: string;
  };
}

export interface BorderSystemConfig {
  radius?: {
    none?: string;
    sm?: string;
    base?: string;
    md?: string;
    lg?: string;
    xl?: string;
    '2xl'?: string;
    '3xl'?: string;
    full?: string;
  };
  width?: {
    0?: string;
    1?: string;
    2?: string;
    4?: string;
    8?: string;
  };
  style?: {
    solid?: string;
    dashed?: string;
    dotted?: string;
    double?: string;
    none?: string;
  };
}

export interface ShadowSystemConfig {
  sm?: string;
  base?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
  inner?: string;
  none?: string;
}

export interface AnimationSystemConfig {
  duration?: {
    75?: string;
    100?: string;
    150?: string;
    200?: string;
    300?: string;
    500?: string;
    700?: string;
    1000?: string;
  };
  easing?: {
    linear?: string;
    in?: string;
    out?: string;
    'in-out'?: string;
  };
  keyframes?: Record<string, Record<string, string>>;
}

export interface BreakpointSystemConfig {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  '2xl'?: string;
}

export interface ComponentStylesConfig {
  button?: ButtonStyleConfig;
  card?: CardStyleConfig;
  input?: InputStyleConfig;
  navigation?: NavigationStyleConfig;
  footer?: FooterStyleConfig;
  hero?: HeroStyleConfig;
  content?: ContentStyleConfig;
}

export interface ButtonStyleConfig {
  base?: ComponentStyleVariant;
  variants?: {
    primary?: ComponentStyleVariant;
    secondary?: ComponentStyleVariant;
    outline?: ComponentStyleVariant;
    ghost?: ComponentStyleVariant;
    gradient?: ComponentStyleVariant;
  };
  sizes?: {
    sm?: ComponentStyleVariant;
    md?: ComponentStyleVariant;
    lg?: ComponentStyleVariant;
    xl?: ComponentStyleVariant;
  };
}

export interface CardStyleConfig {
  base?: ComponentStyleVariant;
  variants?: {
    default?: ComponentStyleVariant;
    elevated?: ComponentStyleVariant;
    outlined?: ComponentStyleVariant;
    filled?: ComponentStyleVariant;
  };
}

export interface InputStyleConfig {
  base?: ComponentStyleVariant;
  variants?: {
    default?: ComponentStyleVariant;
    filled?: ComponentStyleVariant;
    outlined?: ComponentStyleVariant;
  };
  states?: {
    focus?: ComponentStyleVariant;
    error?: ComponentStyleVariant;
    disabled?: ComponentStyleVariant;
  };
}

export interface NavigationStyleConfig {
  base?: ComponentStyleVariant;
  link?: ComponentStyleVariant;
  activeLink?: ComponentStyleVariant;
  dropdown?: ComponentStyleVariant;
}

export interface FooterStyleConfig {
  base?: ComponentStyleVariant;
  link?: ComponentStyleVariant;
  section?: ComponentStyleVariant;
}

export interface HeroStyleConfig {
  base?: ComponentStyleVariant;
  title?: ComponentStyleVariant;
  subtitle?: ComponentStyleVariant;
  button?: ComponentStyleVariant;
}

export interface ContentStyleConfig {
  base?: ComponentStyleVariant;
  heading?: ComponentStyleVariant;
  paragraph?: ComponentStyleVariant;
  link?: ComponentStyleVariant;
  code?: ComponentStyleVariant;
  blockquote?: ComponentStyleVariant;
}

export interface ComponentStyleVariant {
  className?: string;
  styles?: {
    backgroundColor?: string;
    color?: string;
    borderColor?: string;
    borderWidth?: string;
    borderRadius?: string;
    padding?: string;
    margin?: string;
    fontSize?: string;
    fontWeight?: string;
    lineHeight?: string;
    boxShadow?: string;
    transition?: string;
    transform?: string;
    opacity?: string;
    [key: string]: string | undefined;
  };
}

export interface CustomThemeConfig {
  name?: string;
  colors?: {
    background?: string;
    foreground?: string;
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
    accent?: string;
    accentForeground?: string;
    muted?: string;
    mutedForeground?: string;
    border?: string;
    input?: string;
    ring?: string;
    card?: string;
    cardForeground?: string;
    popover?: string;
    popoverForeground?: string;
    destructive?: string;
    destructiveForeground?: string;
    success?: string;
    successForeground?: string;
    warning?: string;
    warningForeground?: string;
    info?: string;
    infoForeground?: string;
  };
  gradients?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
  };
  effects?: {
    blur?: string;
    opacity?: string;
    backdropBlur?: string;
  };
}

export interface UICustomizationConfig {
  scrollToTop?: ScrollToTopConfig;
  readingProgress?: ReadingProgressConfig;
  notifications?: NotificationConfig;
  overlays?: OverlayConfig;
  zIndexes?: ZIndexConfig;
  // New comprehensive UI customization options
  hero?: HeroUIConfig;
  stats?: StatsUIConfig;
  cards?: CardsUIConfig;
  buttons?: ButtonsUIConfig;
  navigation?: NavigationUIConfig;
  footer?: FooterUIConfig;
  analytics?: AnalyticsUIConfig;
  gradients?: GradientUIConfig;
  animations?: AnimationUIConfig;
  forms?: FormsUIConfig;
  newsletter?: NewsletterUIConfig;
  socialShare?: SocialShareUIConfig;
  loadingSpinner?: LoadingSpinnerUIConfig;
  searchBar?: SearchBarUIConfig;
  tableOfContents?: TableOfContentsUIConfig;
  contentBlocks?: ContentBlocksUIConfig;
}

export interface AnimationConfig {
  durations?: {
    fast?: string;
    normal?: string;
    slow?: string;
  };
  easings?: {
    default?: string;
    bounce?: string;
    elastic?: string;
  };
  transitions?: {
    page?: string;
    component?: string;
    hover?: string;
  };
}

export interface LayoutConfig {
  container?: {
    maxWidth?: string;
    padding?: string;
    margin?: string;
  };
  spacing?: {
    section?: string;
    component?: string;
    element?: string;
  };
  breakpoints?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
    wide?: string;
  };
}

export interface FloatingElementsConfig {
  aiContentGenerator?: FloatingButtonConfig;
  seoAnalyzer?: FloatingButtonConfig;
  performanceDashboard?: FloatingButtonConfig;
  visualPageBuilder?: FloatingButtonConfig;
  scrollToTop?: FloatingButtonConfig;
}

export interface FloatingButtonConfig {
  enabled?: boolean;
  position?: {
    bottom?: string;
    right?: string;
    left?: string;
    top?: string;
  };
  style?: {
    background?: string;
    color?: string;
    size?: string;
    borderRadius?: string;
    shadow?: string;
  };
  animation?: {
    hover?: string;
    click?: string;
    entrance?: string;
  };
  zIndex?: number;
}

export interface ScrollToTopConfig {
  enabled?: boolean;
  threshold?: number;
  position?: {
    bottom?: string;
    right?: string;
  };
  style?: {
    background?: string;
    color?: string;
    size?: string;
    borderRadius?: string;
  };
}

export interface ReadingProgressConfig {
  enabled?: boolean;
  height?: string;
  background?: string;
  foreground?: string;
  position?: 'top' | 'bottom';
  zIndex?: number;
}

export interface NotificationConfig {
  position?: {
    top?: string;
    right?: string;
    bottom?: string;
    left?: string;
  };
  style?: {
    background?: string;
    color?: string;
    borderRadius?: string;
    shadow?: string;
  };
  animation?: {
    enter?: string;
    exit?: string;
    duration?: string;
  };
}

export interface OverlayConfig {
  background?: string;
  backdropBlur?: string;
  zIndex?: number;
}

export interface ZIndexConfig {
  modal?: number;
  overlay?: number;
  dropdown?: number;
  tooltip?: number;
  fixed?: number;
}

export interface CustomButtonsConfig {
  [buttonId: string]: CustomButtonConfig;
}

export interface CustomButtonConfig {
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

// New comprehensive UI configuration interfaces
export interface HeroUIConfig {
  enabled?: boolean;
  background?: {
    type?: 'solid' | 'gradient' | 'image';
    color?: string;
    gradient?: string;
    image?: string;
  };
  title?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    gradient?: string;
  };
  subtitle?: {
    fontSize?: string;
    color?: string;
  };
  badge?: {
    backgroundColor?: string;
    color?: string;
    borderRadius?: string;
  };
  decorations?: {
    enabled?: boolean;
    colors?: string[];
    animation?: string;
  };
}

export interface StatsUIConfig {
  enabled?: boolean;
  background?: {
    type?: 'solid' | 'gradient';
    color?: string;
    gradient?: string;
  };
  numbers?: {
    fontSize?: string;
    fontWeight?: string;
    gradient?: string;
  };
  labels?: {
    fontSize?: string;
    color?: string;
  };
  icons?: {
    backgroundColor?: string;
    color?: string;
  };
}

export interface CardsUIConfig {
  enabled?: boolean;
  background?: string;
  border?: {
    color?: string;
    width?: string;
    radius?: string;
  };
  shadow?: string;
  hover?: {
    transform?: string;
    shadow?: string;
    borderColor?: string;
  };
  badge?: {
    backgroundColor?: string;
    color?: string;
  };
}

export interface ButtonsUIConfig {
  enabled?: boolean;
  primary?: {
    background?: string;
    color?: string;
    borderRadius?: string;
    padding?: string;
    fontSize?: string;
    fontWeight?: string;
    hover?: {
      background?: string;
      transform?: string;
      shadow?: string;
    };
  };
  secondary?: {
    background?: string;
    color?: string;
    border?: string;
    borderRadius?: string;
    hover?: {
      background?: string;
      transform?: string;
    };
  };
}

export interface NavigationUIConfig {
  enabled?: boolean;
  background?: {
    type?: 'solid' | 'gradient' | 'blur';
    color?: string;
    gradient?: string;
  };
  logo?: {
    background?: string;
    color?: string;
    borderRadius?: string;
  };
  links?: {
    color?: string;
    activeColor?: string;
    hoverBackground?: string;
    borderRadius?: string;
  };
  mobileMenu?: {
    background?: string;
    itemBackground?: string;
  };
}

export interface FooterUIConfig {
  background?: {
    type?: 'solid' | 'gradient';
    color?: string;
    gradient?: string;
  };
  text?: {
    color?: string;
    linkColor?: string;
  };
  border?: {
    color?: string;
    width?: string;
  };
}

export interface AnalyticsUIConfig {
  enabled?: boolean;
  cards?: {
    background?: string;
    border?: string;
    borderRadius?: string;
  };
  metrics?: {
    colors?: {
      views?: string;
      pages?: string;
      searches?: string;
      shares?: string;
    };
  };
  progressBars?: {
    background?: string;
    foreground?: string;
  };
}

export interface GradientUIConfig {
  primary?: string;
  secondary?: string;
  accent?: string;
  hero?: string;
  stats?: string;
  cards?: string;
  buttons?: string;
  navigation?: string;
  decorative?: string[];
}

export interface AnimationUIConfig {
  durations?: {
    fast?: string;
    normal?: string;
    slow?: string;
  };
  easings?: {
    default?: string;
    bounce?: string;
    elastic?: string;
  };
  hover?: {
    scale?: string;
    translateY?: string;
  };
}

export interface FormsUIConfig {
  enabled?: boolean;
  input?: {
    background?: string;
    border?: string;
    borderRadius?: string;
    fontSize?: string;
    padding?: string;
    focus?: {
      borderColor?: string;
      boxShadow?: string;
    };
  };
  label?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  };
  button?: {
    background?: string;
    color?: string;
    borderRadius?: string;
    padding?: string;
    fontSize?: string;
    fontWeight?: string;
    hover?: {
      background?: string;
      transform?: string;
    };
  };
}

export interface NewsletterUIConfig {
  enabled?: boolean;
  background?: {
    type?: 'solid' | 'gradient';
    color?: string;
    gradient?: string;
  };
  title?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  };
  subtitle?: {
    fontSize?: string;
    color?: string;
  };
  input?: {
    background?: string;
    borderRadius?: string;
    padding?: string;
    fontSize?: string;
  };
  button?: {
    background?: string;
    color?: string;
    borderRadius?: string;
    padding?: string;
    fontSize?: string;
    fontWeight?: string;
  };
}

export interface SocialShareUIConfig {
  enabled?: boolean;
  button?: {
    background?: string;
    border?: string;
    color?: string;
    borderRadius?: string;
    padding?: string;
    fontSize?: string;
    hover?: {
      background?: string;
      color?: string;
      transform?: string;
    };
  };
}

export interface LoadingSpinnerUIConfig {
  enabled?: boolean;
  color?: string;
  size?: string;
  animation?: string;
}

export interface SearchBarUIConfig {
  enabled?: boolean;
  background?: string;
  border?: string;
  borderRadius?: string;
  padding?: string;
  fontSize?: string;
  focus?: {
    borderColor?: string;
    boxShadow?: string;
  };
  results?: {
    background?: string;
    border?: string;
    borderRadius?: string;
    shadow?: string;
  };
}

export interface TableOfContentsUIConfig {
  enabled?: boolean;
  background?: string;
  border?: string;
  borderRadius?: string;
  padding?: string;
  title?: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
  };
  link?: {
    color?: string;
    fontSize?: string;
    padding?: string;
    borderRadius?: string;
    hover?: {
      background?: string;
      color?: string;
    };
    active?: {
      background?: string;
      color?: string;
    };
  };
}

export interface ContentBlocksUIConfig {
  enabled?: boolean;
  features?: {
    background?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    title?: {
      fontSize?: string;
      fontWeight?: string;
      color?: string;
    };
    description?: {
      fontSize?: string;
      color?: string;
    };
    icon?: {
      background?: string;
      color?: string;
      borderRadius?: string;
      size?: string;
    };
  };
  testimonials?: {
    background?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    quote?: {
      fontSize?: string;
      fontStyle?: string;
      color?: string;
    };
    author?: {
      fontSize?: string;
      fontWeight?: string;
      color?: string;
    };
  };
  pricing?: {
    background?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    popular?: {
      border?: string;
      background?: string;
    };
    price?: {
      fontSize?: string;
      fontWeight?: string;
      color?: string;
    };
    feature?: {
      fontSize?: string;
      color?: string;
    };
  };
}

export interface Site {
    title: string;
  description: string;
    author?: string;
      email?: string;
    url?: string;
  social?: SocialLinks;
  theme?: string;
  layout?: 'default' | 'portfolio' | 'business' | 'minimal' | 'documentation' | 'blog';
  customization?: SiteCustomization;
}

export interface SiteCustomization {
  // Layout Options
  layoutStyle?: 'grid' | 'masonry' | 'timeline' | 'magazine' | 'dashboard' | 'split' | 'fullscreen';
  
  // Color Schemes
  colorScheme?: {
    primary?: string;
    secondary?: string;
    accent?: string;
    background?: string;
    surface?: string;
  text?: string;
  };
  
  // Typography
  typography?: {
    headingFont?: string;
    bodyFont?: string;
    fontSize?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
    fontWeight?: 'light' | 'normal' | 'medium' | 'bold';
  };
  
  // Header Customization
  header?: {
    style?: 'minimal' | 'elegant' | 'modern' | 'bold' | 'creative';
    showSearch?: boolean;
    showSocial?: boolean;
    sticky?: boolean;
  };
  
  // Hero Section
  hero?: {
    style?: 'centered' | 'split' | 'fullscreen' | 'minimal' | 'magazine' | 'video';
    showStats?: boolean;
    backgroundType?: 'gradient' | 'image' | 'video' | 'pattern' | 'solid';
    backgroundUrl?: string;
    overlayOpacity?: number;
  };
  
  // Content Layout
  content?: {
    cardStyle?: 'minimal' | 'elevated' | 'bordered' | 'glassmorphism' | 'neumorphism';
    spacing?: 'tight' | 'normal' | 'relaxed' | 'loose';
    animation?: 'none' | 'fade' | 'slide' | 'scale' | 'bounce';
    showExcerpts?: boolean;
    showReadingTime?: boolean;
    showTags?: boolean;
  };
  
  // Footer
  footer?: {
    style?: 'minimal' | 'detailed' | 'newsletter' | 'social';
    showSocial?: boolean;
    showNewsletter?: boolean;
  };
  
  // Advanced Features
  features?: {
    darkMode?: boolean;
    searchEnabled?: boolean;
    commentsEnabled?: boolean;
    analyticsEnabled?: boolean;
    socialSharing?: boolean;
  };
} 