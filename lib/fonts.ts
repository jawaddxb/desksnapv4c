export interface FontPair {
  id: string;
  name: string;
  heading: string;
  body: string;
  description: string;
}

// Cache of loaded fonts (pre-populate with fonts loaded in index.html)
const loadedFonts = new Set<string>(['DM Sans', 'Space Grotesk']);

// Extract font name from CSS font-family string (e.g., "'Playfair Display', serif" -> "Playfair Display")
export const extractFontName = (fontFamily: string): string => {
  return fontFamily.split(',')[0].replace(/['"]/g, '').trim();
};

// Helper to dynamically load a Google Font into the document head
export const loadGoogleFont = (fontName: string): Promise<void> => {
  if (!fontName) return Promise.resolve();

  // Already loaded
  if (loadedFonts.has(fontName)) {
    return Promise.resolve();
  }

  const linkId = `font-${fontName.replace(/\s+/g, '-').toLowerCase()}`;

  // Already has link element
  if (document.getElementById(linkId)) {
    loadedFonts.add(fontName);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const link = document.createElement('link');
    link.id = linkId;
    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, '+')}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&display=swap`;
    link.rel = 'stylesheet';
    link.onload = () => {
      loadedFonts.add(fontName);
      resolve();
    };
    link.onerror = () => resolve(); // Don't block on font errors
    document.head.appendChild(link);
  });
};

// Load all fonts for a theme
export const loadThemeFonts = async (theme: { fonts: { heading: string; body: string } }): Promise<void> => {
  const headingFont = extractFontName(theme.fonts.heading);
  const bodyFont = extractFontName(theme.fonts.body);

  await Promise.all([
    loadGoogleFont(headingFont),
    loadGoogleFont(bodyFont),
  ]);
};

// Preload common theme fonts in the background (call after initial render)
export const preloadCommonFonts = (): void => {
  const commonFonts = [
    'Inter', 'Oswald', 'Space Mono', 'Playfair Display', 'Lato',
    'Montserrat', 'Poppins', 'Open Sans', 'Roboto'
  ];

  // Use requestIdleCallback for non-blocking preload
  if ('requestIdleCallback' in window) {
    (window as Window & { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(() => {
      commonFonts.forEach(font => loadGoogleFont(font));
    });
  } else {
    // Fallback for Safari
    setTimeout(() => {
      commonFonts.forEach(font => loadGoogleFont(font));
    }, 2000);
  }
};

export const CURATED_FONT_PAIRINGS: FontPair[] = [
  {
    id: 'swiss',
    name: 'Swiss Modern',
    heading: 'Inter',
    body: 'Inter',
    description: 'Clean, neutral, and highly legible. The standard for modern UI.'
  },
  {
    id: 'editorial',
    name: 'NY Editorial',
    heading: 'Playfair Display',
    body: 'Lato',
    description: 'Classic serif headings with clean sans-serif body. Elegant and trustworthy.'
  },
  {
    id: 'brutalist',
    name: 'Neo Brutalist',
    heading: 'Oswald',
    body: 'Space Mono',
    description: 'Bold, condensed headings with technical monospace body text.'
  },
  {
    id: 'tech',
    name: 'Future Tech',
    heading: 'Rajdhani',
    body: 'Chakra Petch',
    description: 'Squared-off shapes and industrial vibes. Perfect for cyberpunk or engineering.'
  },
  {
    id: 'luxury',
    name: 'High Luxury',
    heading: 'Cinzel',
    body: 'Cormorant Garamond',
    description: 'all-caps serif headings inspired by roman inscriptions. Very expensive feel.'
  },
  {
    id: 'humanist',
    name: 'Warm Humanist',
    heading: 'Merriweather',
    body: 'Open Sans',
    description: 'Approachable and easy to read. Great for storytelling.'
  },
  {
    id: 'poster',
    name: 'Loud Poster',
    heading: 'Anton',
    body: 'Roboto Condensed',
    description: 'Maximum impact. Tall, thick headings for short, punchy statements.'
  },
  {
    id: 'retro',
    name: 'Retro 70s',
    heading: 'Abril Fatface',
    body: 'Poppins',
    description: 'Heavy curves and high contrast. Fun, groovy, and distinctive.'
  },
  {
    id: 'minimal',
    name: 'Nordic Minimal',
    heading: 'Manrope',
    body: 'Manrope',
    description: 'Geometric sans-serif with a modern, friendly character.'
  },
  {
    id: 'academic',
    name: 'Ivy League',
    heading: 'Libre Baskerville',
    body: 'Source Serif 4',
    description: 'Traditional, scholarly, and serious. Best for data-heavy presentations.'
  },
  {
    id: 'fashion',
    name: 'Vogue',
    heading: 'Bodoni Moda',
    body: 'Montserrat',
    description: 'High contrast, high fashion. Sharp edges and varying stroke widths.'
  },
  {
    id: 'handwritten',
    name: 'Whiteboard',
    heading: 'Permanent Marker',
    body: 'Kalam',
    description: 'Casual, sketched look. Good for brainstorming or rough ideas.'
  }
];
