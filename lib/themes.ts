
import { Theme } from '../types';

// GLOBAL Z-INDEX LAYERING SYSTEM
// Prevents overlap issues by assigning semantic layers to layout elements.
export const LayoutLayer = {
  BACKGROUND: 0,      // Texture, Colors, base patterns
  DECORATION: 10,     // Shapes, Lines, decorative elements
  MEDIA: 20,          // Images, Videos
  CONTENT_BASE: 30,   // Standard content containers
  CONTENT_HERO: 40,   // Titles, Hero text (or overlapping content)
  OVERLAY: 50,        // Badges, Floating tags, Atmospheric effects (Rain, Blinds, Bars)
  CONTENT_TOP: 60,    // Critical text that must float above atmospheric effects (Noir, Cinematic)
  UI: 100             // Tooltips, drag handles (if any)
};

export const SYSTEM_THEME: Theme = {
  id: 'system',
  name: 'System UI',
  description: 'Standard Interface Theme',
  fonts: { heading: '"Space Grotesk", sans-serif', body: '"DM Sans", sans-serif' },
  colors: { background: '#ffffff', surface: '#ffffff', text: '#18181b', accent: '#18181b', border: '#e4e4e7', secondary: '#71717a' },
  layout: { radius: '8px', borderWidth: '1px', shadow: 'none', headingTransform: 'none', headingWeight: '600' },
  imageStyle: ''
};

export const IMAGE_STYLES = [
  { 
    id: 'auto', 
    label: 'Auto (Match Theme)', 
    prompt: 'auto',
    subjectGuidance: 'Match the subject matter to the theme aesthetic. If corporate, use people. If tech, use futuristic interfaces.'
  },
  { 
    id: 'photo-studio', 
    label: 'Studio Photo', 
    prompt: 'High-end studio photography, clean background, soft controlled lighting, 8k resolution, photorealistic, sharp focus, commercial look, shot on Hasselblad',
    subjectGuidance: 'STRICTLY REALISM. Describe real people, professional models, hands working on devices, modern office architecture, or clean physical objects. DO NOT describe abstract data, floating nodes, or digital waves. Translate concepts into human scenarios.'
  },
  { 
    id: 'photo-cinematic', 
    label: 'Cinematic', 
    prompt: 'Cinematic film still, dramatic lighting, anamorphic lens flares, color graded, depth of field, movie scene aesthetic, high contrast, IMAX quality',
    subjectGuidance: 'STRICTLY REALISM. Describe narrative scenes, characters in dramatic environments, emotional moments, or epic landscapes. Use cinematic camera angles. Avoid generic icons or abstract graphics.'
  },
  { 
    id: 'photo-analog', 
    label: 'Analog Film', 
    prompt: '35mm film photography, grain, light leaks, warm tones, vintage aesthetic, candid feel, Kodak Portra 400, Leica M6',
    subjectGuidance: 'STRICTLY REALISM. Describe candid moments, lifestyle photography, authentic human interactions, or street photography. The vibe should be "captured in the moment", not staged.'
  },
  { 
    id: '3d-abstract', 
    label: 'Abstract 3D', 
    prompt: 'Abstract 3D geometric shapes, glass and metal materials, octane render, unreal engine 5, futuristic, clean, architectural, raytracing',
    subjectGuidance: 'STRICTLY ABSTRACT. Describe geometric shapes, floating spheres, glass prisms, data streams, light beams, and complex textures. Do not include human faces or realistic environments.'
  },
  { 
    id: '3d-iso', 
    label: 'Isometric 3D', 
    prompt: 'Isometric 3D render, orthographic view, clean studio lighting, pastel background, highly detailed, c4d, behance style, minimal',
    subjectGuidance: 'ISOMETRIC 3D. Describe small, self-contained floating islands or scenes viewed from a distance. Office desks, city blocks, or server rooms in a cute, clean, orthographic style.'
  },
  { 
    id: '3d-clay', 
    label: 'Clay Render', 
    prompt: '3D claymorphism, soft rounded shapes, matte plastic texture, pastel colors, toy-like, studio lighting, cute, C4D render',
    subjectGuidance: 'STYLIZED 3D. Describe cute, simplified objects, icons, or characters made of soft clay. Use rounded edges. Metaphors should be playful (e.g., a clay rocket for growth).'
  },
  { 
    id: '3d-surreal', 
    label: 'Surreal 3D', 
    prompt: 'Surreal digital art, dreamlike atmosphere, floating objects, defy gravity, soft gradients, ethereal lighting, dali-esque',
    subjectGuidance: 'SURREALISM. Describe dreamlike scenes that defy physics. Floating islands, clouds inside rooms, impossible geometry. Blend nature with technology.'
  },
  { 
    id: 'illustration-minimal', 
    label: 'Minimal Vector', 
    prompt: 'Minimalist flat vector illustration, clean lines, solid colors, no gradients, corporate memphis style, simple shapes, adobe illustrator',
    subjectGuidance: 'FLAT ILLUSTRATION. Describe simple 2D scenes with flat characters or icons. Use metaphors. Keep composition simple and clean.'
  },
  { 
    id: 'illustration-hand', 
    label: 'Hand Drawn', 
    prompt: 'Hand drawn sketch style, pencil or ink lines, white paper texture, rough edges, artistic, architectural sketch, detailed, graphite',
    subjectGuidance: 'SKETCH ART. Describe architectural drafts, rough conceptual sketches, or hand-drawn diagrams. Use lines and hatching.'
  },
  { 
    id: 'illustration-tech', 
    label: 'Blueprint', 
    prompt: 'Technical blueprint aesthetic, white isometric lines on blue background, schematic, engineering, grid, CAD style',
    subjectGuidance: 'TECHNICAL DIAGRAMS. Describe schematics, wireframes, engine parts, or isometric city grids. Everything must look like a technical drawing.'
  },
  { 
    id: 'illustration-lofi', 
    label: 'Lo-Fi', 
    prompt: 'Lo-fi aesthetic, grainy, muted colors, retro anime vibe, chill atmosphere, soft lighting',
    subjectGuidance: 'ANIME/LO-FI. Describe cozy rooms, desks with computers, city skylines at night, or characters studying. Relaxed vibe.'
  },
  { 
    id: 'art-riso', 
    label: 'Risograph', 
    prompt: 'Risograph print, grainy texture, vibrant neon colors, misaligned layers, halftone, zine aesthetic, rough ink',
    subjectGuidance: 'PRINT ART. Describe simple compositions with limited color palettes (pink, blue, yellow). Overlapping shapes and rough textures.'
  },
  { 
    id: 'art-watercolor', 
    label: 'Watercolor', 
    prompt: 'Watercolor painting, soft bleed effects, paper texture, artistic, dreamy, pastel tones, wet on wet technique',
    subjectGuidance: 'PAINTING. Describe soft, flowing scenes. Nature, flowers, or abstract color washes. No sharp lines or tech UI.'
  },
  { 
    id: 'art-oil', 
    label: 'Oil Painting', 
    prompt: 'Oil painting, impasto texture, visible brushstrokes, classical art style, rich colors, dramatic lighting',
    subjectGuidance: 'CLASSICAL ART. Describe portraits, dramatic landscapes, or still life arrangements. Use classical composition techniques.'
  },
  { 
    id: 'art-pop', 
    label: 'Pop Art', 
    prompt: 'Pop Art style, halftone dots, bold black outlines, vibrant primary colors, comic book aesthetic, Roy Lichtenstein style',
    subjectGuidance: 'COMIC BOOK. Describe explosive action, speech bubbles, bold character close-ups, or commercial products in a retro comic style.'
  },
  { 
    id: 'art-double', 
    label: 'Double Exposure', 
    prompt: 'Double exposure photography, silhouette of subject filled with nature scene, dreamy, surreal, artistic, high contrast, black and white',
    subjectGuidance: 'SURREAL PORTRAIT. Describe a silhouette of a person or object that contains a landscape (forest, city, ocean) inside it.'
  },
  { 
    id: 'collage', 
    label: 'Retro Collage', 
    prompt: 'Mixed media collage, cut-out vintage paper, grain, texture, surreal composition, dadaism style, ripped edges',
    subjectGuidance: 'MIXED MEDIA. Describe a composition of disparate elements: vintage photos of people mixed with astronomical elements or flowers. Ripped paper edges.'
  },
  { 
    id: 'pixel', 
    label: 'Pixel Art', 
    prompt: 'Pixel art, 8-bit graphics, retro video game style, isometric view, limited color palette, dithering',
    subjectGuidance: 'RETRO GAME. Describe isometric game environments, 8-bit items, or arcade interfaces.'
  }
];

export const PATTERNS = {
  GRID: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`,
  NOISE: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`,
  DOTS: `radial-gradient(#444 0.5px, transparent 0.5px)`,
  PAPER: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.1'/%3E%3C/svg%3E")`,
};

export const THEMES: Record<string, Theme> = {
  // --- CORE COLLECTION ---
  neoBrutalist: {
    id: 'neoBrutalist',
    name: 'Neo-Brutalist',
    description: 'Raw, high-contrast, monochromatic photography.',
    fonts: {
      heading: '"Oswald", sans-serif',
      body: '"Space Mono", monospace',
    },
    colors: {
      background: '#ffffff',
      surface: '#f4f4f5',
      text: '#000000',
      accent: '#ccff00',
      border: '#000000',
      secondary: '#52525b',
      backgroundPattern: PATTERNS.NOISE
    },
    layout: {
      radius: '0px',
      borderWidth: '4px',
      shadow: '8px 8px 0px #000000',
      headingTransform: 'uppercase',
      headingWeight: '700',
    },
    imageStyle: 'Black and white analog photography, high contrast, flash photography, grunge texture, raw aesthetic, street style, 35mm film grain, harsh shadows'
  },
  executive: {
    id: 'executive',
    name: 'Executive Suite',
    description: 'Clean, modern corporate photography.',
    fonts: {
      heading: '"Inter", sans-serif',
      body: '"Inter", sans-serif',
    },
    colors: {
      background: '#f8fafc',
      surface: '#ffffff',
      text: '#0f172a',
      accent: '#0369a1',
      border: '#cbd5e1',
      secondary: '#64748b',
    },
    layout: {
      radius: '6px',
      borderWidth: '1px',
      shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      headingTransform: 'none',
      headingWeight: '600',
    },
    imageStyle: 'High-end corporate stock photography, modern glass architecture, bright natural light, shallow depth of field, professional, clean lines, blue and white color palette'
  },
  vogue: {
    id: 'vogue',
    name: 'Vogue Editorial',
    description: 'Warm, cinematic fashion photography.',
    fonts: {
      heading: '"Abril Fatface", serif',
      body: '"Lato", sans-serif',
    },
    colors: {
      background: '#fff1f2',
      surface: '#ffffff',
      text: '#4a044e',
      accent: '#db2777',
      border: '#fbcfe8',
      secondary: '#9d174d',
      backgroundPattern: PATTERNS.NOISE
    },
    layout: {
      radius: '0px',
      borderWidth: '0px',
      shadow: 'none',
      headingTransform: 'none',
      headingWeight: '400',
    },
    imageStyle: 'Fashion editorial photography, warm golden hour lighting, analog film aesthetic, Kodak Portra 400, soft focus, elegance, luxury lifestyle, beige and pastel tones'
  },
  swiss: {
    id: 'swiss',
    name: 'Swiss International',
    description: 'Geometric, flat vector illustration.',
    fonts: {
      heading: '"Work Sans", sans-serif',
      body: '"DM Sans", sans-serif',
    },
    colors: {
      background: '#f5f5f5',
      surface: '#ffffff',
      text: '#111111',
      accent: '#ea580c',
      border: '#111111',
      secondary: '#444444',
      backgroundPattern: `radial-gradient(#ccc 1px, transparent 1px)`
    },
    layout: {
      radius: '0px',
      borderWidth: '2px',
      shadow: 'none',
      headingTransform: 'uppercase',
      headingWeight: '900',
    },
    imageStyle: 'Swiss Design Style, Bauhaus vector art, flat geometric shapes, minimalism, bold primary colors, abstract composition, clean lines, no gradients, graphic design poster'
  },
  futureTech: {
    id: 'futureTech',
    name: 'Future Tech',
    description: 'Dark mode, 3D abstract data.',
    fonts: {
      heading: '"Teko", sans-serif',
      body: '"Space Mono", monospace',
    },
    colors: {
      background: '#020617',
      surface: '#0f172a',
      text: '#e2e8f0',
      accent: '#06b6d4',
      border: '#1e293b',
      secondary: '#94a3b8',
      backgroundPattern: `radial-gradient(circle at 50% 0%, #1e293b 0%, transparent 70%)`
    },
    layout: {
      radius: '4px',
      borderWidth: '1px',
      shadow: '0 0 20px rgba(6, 182, 212, 0.2)',
      headingTransform: 'uppercase',
      headingWeight: '600',
    },
    imageStyle: 'Abstract 3D Technology, neon glowing particles, data visualization, dark cyberpunk atmosphere, volumetric lighting, Octane render, unreal engine 5, cyan and purple palette'
  },
  
  // --- BUSINESS & TECH ---
  
  saas: {
    id: 'saas',
    name: 'Modern SaaS',
    description: 'Deep purples and gradients, software vibe.',
    fonts: {
      heading: '"Plus Jakarta Sans", sans-serif',
      body: '"Inter", sans-serif',
    },
    colors: {
      background: '#0f172a', // slate-900
      surface: '#1e293b', // slate-800
      text: '#f8fafc',
      accent: '#818cf8', // indigo-400
      border: '#334155',
      secondary: '#94a3b8',
      backgroundPattern: `linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)`
    },
    layout: {
      radius: '12px',
      borderWidth: '1px',
      shadow: '0 10px 30px -10px rgba(129, 140, 248, 0.3)',
      headingTransform: 'none',
      headingWeight: '700',
    },
    imageStyle: '3D Glassmorphism, abstract fluid gradients, software interface elements, translucent materials, deep blue and purple lighting, futuristic UI design'
  },
  fintech: {
    id: 'fintech',
    name: 'Trust Fintech',
    description: 'Reliable navy and gold, clean layout.',
    fonts: {
      heading: '"Manrope", sans-serif',
      body: '"Manrope", sans-serif',
    },
    colors: {
      background: '#ffffff',
      surface: '#f0f9ff', // sky-50
      text: '#0c4a6e', // sky-900
      accent: '#d97706', // amber-600
      border: '#bae6fd',
      secondary: '#0369a1',
    },
    layout: {
      radius: '4px',
      borderWidth: '1px',
      shadow: 'none',
      headingTransform: 'none',
      headingWeight: '800',
    },
    imageStyle: 'Minimalist financial illustration, thin lines, gold accents, isometric cityscapes, clean data visualization, white background, trustworthy aesthetic'
  },
  startup: {
    id: 'startup',
    name: 'Silicon Valley',
    description: 'Blurple, energetic, standard tech.',
    fonts: {
      heading: '"Poppins", sans-serif',
      body: '"Open Sans", sans-serif',
    },
    colors: {
      background: '#ffffff',
      surface: '#fafafa',
      text: '#27272a',
      accent: '#4f46e5', // indigo-600
      border: '#e4e4e7',
      secondary: '#71717a',
    },
    layout: {
      radius: '8px',
      borderWidth: '1px',
      shadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      headingTransform: 'capitalize',
      headingWeight: '700',
    },
    imageStyle: 'Corporate Memphis style illustration, flat vector art, vibrant purple and blue colors, exaggerated characters, teamwork, office life, clean and joyful'
  },
  
  // --- LUXURY & FASHION ---
  
  luxury: {
    id: 'luxury',
    name: 'Luxury Gold',
    description: 'Dark marble and gold photorealism.',
    fonts: {
      heading: '"Cinzel", serif',
      body: '"Raleway", sans-serif',
    },
    colors: {
      background: '#0a0a0a',
      surface: '#171717',
      text: '#fef3c7', // amber-100
      accent: '#d4af37', // Gold
      border: '#404040',
      secondary: '#a1a1aa',
      backgroundPattern: PATTERNS.NOISE
    },
    layout: {
      radius: '0px',
      borderWidth: '1px',
      shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
      headingTransform: 'uppercase',
      headingWeight: '400',
    },
    imageStyle: 'Luxury Product Photography, black marble texture, gold accents, dramatic rim lighting, macro details, elegant, expensive, perfume commercial aesthetic, 8k'
  },
  minimalist: {
    id: 'minimalist',
    name: 'Nordic Minimal',
    description: 'Beige, airy, sophisticated.',
    fonts: {
      heading: '"Montserrat", sans-serif',
      body: '"Lato", sans-serif',
    },
    colors: {
      background: '#fdfbf7', // warm white
      surface: '#ffffff',
      text: '#44403c', // stone-700
      accent: '#78716c', // stone-500
      border: '#e7e5e4',
      secondary: '#a8a29e',
    },
    layout: {
      radius: '2px',
      borderWidth: '0px',
      shadow: 'none',
      headingTransform: 'uppercase',
      headingWeight: '300',
    },
    imageStyle: 'Minimalist Scandinavian photography, neutral beige tones, soft shadows, organic shapes, ceramics, dried flowers, clean interior design, zen atmosphere'
  },
  noir: {
    id: 'noir',
    name: 'Film Noir',
    description: 'Cinematic black & white mystery.',
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Montserrat", sans-serif',
    },
    colors: {
      background: '#000000',
      surface: '#111111',
      text: '#e5e5e5',
      accent: '#dc2626', // red-600 (femme fatale red)
      border: '#333333',
      secondary: '#737373',
      backgroundPattern: PATTERNS.NOISE
    },
    layout: {
      radius: '0px',
      borderWidth: '1px',
      shadow: '0 0 50px rgba(0,0,0,1)',
      headingTransform: 'capitalize',
      headingWeight: '700',
    },
    imageStyle: 'Film Noir cinematography, black and white, high contrast chiaroscuro lighting, silhouettes, fog, rain, detective mystery vibe, dramatic shadows'
  },

  // --- NATURE & ORGANIC ---

  botanical: {
    id: 'botanical',
    name: 'Botanical Garden',
    description: 'Lush greens and elegant serifs.',
    fonts: {
      heading: '"Cormorant Garamond", serif',
      body: '"Nunito", sans-serif',
    },
    colors: {
      background: '#f0fdf4', // green-50
      surface: '#ffffff',
      text: '#14532d', // green-900
      accent: '#16a34a', // green-600
      border: '#bbf7d0',
      secondary: '#4ade80',
    },
    layout: {
      radius: '16px',
      borderWidth: '1px',
      shadow: '0 10px 15px -3px rgba(20, 83, 45, 0.1)',
      headingTransform: 'none',
      headingWeight: '600',
    },
    imageStyle: 'Botanical illustration, vintage scientific drawing, watercolor texture, lush green plants, flowers, nature close-ups, soft natural lighting, elegant'
  },
  solar: {
    id: 'solar',
    name: 'Solar Punk',
    description: 'Eco-futurism, green and gold.',
    fonts: {
      heading: '"Syne", sans-serif',
      body: '"Space Grotesk", sans-serif',
    },
    colors: {
      background: '#f7fee7', // lime-50
      surface: '#ffffff',
      text: '#365314', // lime-950
      accent: '#a3e635', // lime-400
      border: '#d9f99d',
      secondary: '#65a30d',
    },
    layout: {
      radius: '20px',
      borderWidth: '0px',
      shadow: '8px 8px 0px #ecfccb',
      headingTransform: 'lowercase',
      headingWeight: '800',
    },
    imageStyle: 'Solarpunk aesthetic, futuristic green city, nature and technology blending, art nouveau influence, bright sunlight, utopia, sustainable architecture, vibrant green and gold'
  },
  oceanic: {
    id: 'oceanic',
    name: 'Deep Ocean',
    description: 'Calm teals and fluid shapes.',
    fonts: {
      heading: '"Comfortaa", sans-serif',
      body: '"Quicksand", sans-serif',
    },
    colors: {
      background: '#ecfeff', // cyan-50
      surface: '#ffffff',
      text: '#164e63', // cyan-900
      accent: '#06b6d4', // cyan-500
      border: '#a5f3fc',
      secondary: '#0891b2',
    },
    layout: {
      radius: '30px',
      borderWidth: '0px',
      shadow: '0 4px 20px rgba(6, 182, 212, 0.15)',
      headingTransform: 'none',
      headingWeight: '700',
    },
    imageStyle: 'Underwater photography, bioluminescence, jellyfish, fluid shapes, deep blue and teal gradients, bubbles, ethereal, calm, high definition'
  },
  earth: {
    id: 'earth',
    name: 'Warm Earth',
    description: 'Terracotta, sand, organic textures.',
    fonts: {
      heading: '"Merriweather", serif',
      body: '"Open Sans", sans-serif',
    },
    colors: {
      background: '#fff7ed', // orange-50
      surface: '#ffffff',
      text: '#7c2d12', // orange-900
      accent: '#ea580c', // orange-600
      border: '#fed7aa',
      secondary: '#c2410c',
      backgroundPattern: PATTERNS.PAPER
    },
    layout: {
      radius: '2px',
      borderWidth: '1px',
      shadow: '4px 4px 0px #fdba74',
      headingTransform: 'none',
      headingWeight: '700',
    },
    imageStyle: 'Organic textures, terracotta clay, sand dunes, warm desert light, pottery, natural materials, linen fabric, bohemian aesthetic'
  },

  // --- RETRO & VINTAGE ---

  retro80s: {
    id: 'retro80s',
    name: 'Synthwave 80s',
    description: 'Neon grids and sunsets.',
    fonts: {
      heading: '"Righteous", sans-serif',
      body: '"Montserrat", sans-serif',
    },
    colors: {
      background: '#2e022d', // dark purple
      surface: '#4a044e', // fuchsia-950
      text: '#f0abfc', // fuchsia-200
      accent: '#22d3ee', // cyan-400
      border: '#d946ef', // fuchsia-500
      secondary: '#e879f9',
      backgroundPattern: PATTERNS.GRID
    },
    layout: {
      radius: '0px',
      borderWidth: '2px',
      shadow: '4px 4px 0px #22d3ee',
      headingTransform: 'uppercase',
      headingWeight: '400',
    },
    imageStyle: 'Synthwave, Retrowave, 1980s neon grid landscape, chrome mountains, purple sunset, vector graphics style, laser beams, retro futurism'
  },
  vintageTravel: {
    id: 'vintageTravel',
    name: 'Vintage Travel',
    description: 'Washed out posters and textures.',
    fonts: {
      heading: '"Bebas Neue", sans-serif',
      body: '"Crimson Text", serif',
    },
    colors: {
      background: '#fef3c7', // amber-100
      surface: '#fffbeb', // amber-50
      text: '#78350f', // amber-900
      accent: '#b45309', // amber-700
      border: '#d97706',
      secondary: '#92400e',
      backgroundPattern: PATTERNS.PAPER
    },
    layout: {
      radius: '2px',
      borderWidth: '4px',
      shadow: 'none',
      headingTransform: 'uppercase',
      headingWeight: '400',
    },
    imageStyle: 'Vintage travel poster, grainy texture, washed out colors, mid-century modern illustration, screen print effect, nostalgia, scenic landscape'
  },
  newspaper: {
    id: 'newspaper',
    name: 'The Daily Press',
    description: 'Classic print, monochrome.',
    fonts: {
      heading: '"Playfair Display", serif',
      body: '"Lora", serif',
    },
    colors: {
      background: '#f2e9e4', // paper white
      surface: '#ffffff',
      text: '#1c1917', // stone-900
      accent: '#000000',
      border: '#e7e5e4',
      secondary: '#57534e',
      backgroundPattern: PATTERNS.PAPER
    },
    layout: {
      radius: '0px',
      borderWidth: '1px',
      shadow: 'none',
      headingTransform: 'uppercase',
      headingWeight: '900',
    },
    imageStyle: 'Black and white engraving style illustration, vintage etching, detailed linework, cross-hatching, Wall Street Journal stipple portrait style, classic print media'
  },
  popArt: {
    id: 'popArt',
    name: 'Pop Art',
    description: 'Bold, comic book halftone.',
    fonts: {
      heading: '"Bangers", cursive',
      body: '"Open Sans", sans-serif',
    },
    colors: {
      background: '#ffffff',
      surface: '#fff100', // Yellow
      text: '#000000',
      accent: '#ed1c24', // Red
      border: '#000000',
      secondary: '#0054a6', // Blue
      backgroundPattern: PATTERNS.DOTS
    },
    layout: {
      radius: '0px',
      borderWidth: '4px',
      shadow: '8px 8px 0px #000000',
      headingTransform: 'uppercase',
      headingWeight: '800',
    },
    imageStyle: 'Pop Art, Roy Lichtenstein style, halftone dots, bold black outlines, primary colors (red, yellow, blue), comic book aesthetic, speech bubbles, dynamic'
  },
  pixel: {
    id: 'pixel',
    name: '8-Bit Arcade',
    description: 'Retro gaming pixel art.',
    fonts: {
      heading: '"Press Start 2P", cursive',
      body: '"Fira Code", monospace',
    },
    colors: {
      background: '#0f0f0f',
      surface: '#2a2a2a',
      text: '#00ff00', // terminal green
      accent: '#ff00ff', // magenta
      border: '#ffffff',
      secondary: '#cccccc',
      backgroundPattern: PATTERNS.GRID
    },
    layout: {
      radius: '0px',
      borderWidth: '2px',
      shadow: 'none',
      headingTransform: 'uppercase',
      headingWeight: '400',
    },
    imageStyle: 'Pixel art, 8-bit graphics, retro video game, isometric view, limited color palette, dithering, blocky shapes, nostalgia'
  },

  // --- ARTISTIC & EXPERIMENTAL ---

  blueprint: {
    id: 'blueprint',
    name: 'Technical Blueprint',
    description: 'Schematic technical illustration.',
    fonts: {
      heading: '"Space Mono", monospace',
      body: '"Space Mono", monospace',
    },
    colors: {
      background: '#1e3a8a', // blue-900
      surface: '#172554', // blue-950
      text: '#bfdbfe', // blue-200
      accent: '#60a5fa', // blue-400
      border: '#3b82f6', // blue-500
      secondary: '#93c5fd', // blue-300
      backgroundPattern: PATTERNS.GRID
    },
    layout: {
      radius: '0px',
      borderWidth: '2px',
      shadow: 'none',
      headingTransform: 'uppercase',
      headingWeight: '400',
    },
    imageStyle: 'Technical Blueprint Illustration, white isometric lines on dark blue background, schematic diagram, engineering drawing, grid background, precise details, no shading, CAD style'
  },
  clay: {
    id: 'clay',
    name: 'Claymorphism',
    description: 'Playful 3D plasticine render.',
    fonts: {
      heading: '"Outfit", sans-serif',
      body: '"Quicksand", sans-serif',
    },
    colors: {
      background: '#fff7ed', // orange-50
      surface: '#ffffff',
      text: '#431407', // orange-950
      accent: '#f97316', // orange-500
      border: '#fed7aa', // orange-200
      secondary: '#9a3412', // orange-800
    },
    layout: {
      radius: '24px',
      borderWidth: '0px',
      shadow: '12px 12px 24px rgba(249, 115, 22, 0.15), -12px -12px 24px rgba(255, 255, 255, 1)',
      headingTransform: 'capitalize',
      headingWeight: '800',
    },
    imageStyle: '3D Clay Render, cute rounded shapes, plasticine texture, soft studio lighting, pastel colors, minimal composition, toy-like, C4D, playful'
  },
  papercut: {
    id: 'papercut',
    name: 'Papercraft Art',
    description: 'Layered paper illustration.',
    fonts: {
      heading: '"DM Serif Display", serif',
      body: '"Montserrat", sans-serif',
    },
    colors: {
      background: '#f5f5f4', // stone-100
      surface: '#ffffff',
      text: '#1c1917', // stone-900
      accent: '#d97706', // amber-600
      border: '#e7e5e4', // stone-200
      secondary: '#57534e', // stone-600
      backgroundPattern: PATTERNS.PAPER
    },
    layout: {
      radius: '2px',
      borderWidth: '1px',
      shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      headingTransform: 'none',
      headingWeight: '400',
    },
    imageStyle: 'Digital Paper Cutout Art, layered paper craft, deep drop shadows, depth of field, earth tones, textured paper, diorama style, whimsical'
  },
  ukiyo: {
    id: 'ukiyo',
    name: 'Ukiyo-e Print',
    description: 'Japanese woodblock aesthetic.',
    fonts: {
      heading: '"Crimson Text", serif',
      body: '"Noto Sans", sans-serif',
    },
    colors: {
      background: '#fdf6e3', // antique white
      surface: '#ffffff',
      text: '#002b36', // dark ink
      accent: '#cb4b16', // rust red
      border: '#93a1a1',
      secondary: '#586e75',
      backgroundPattern: PATTERNS.PAPER
    },
    layout: {
      radius: '0px',
      borderWidth: '1px',
      shadow: '4px 4px 0px #b58900',
      headingTransform: 'none',
      headingWeight: '600',
    },
    imageStyle: 'Ukiyo-e Japanese woodblock print, Hokusai style, flat colors, textured paper, outlines, Great Wave aesthetic, Mount Fuji, traditional art'
  },
  watercolor: {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Soft, artistic painterly vibes.',
    fonts: {
      heading: '"Amatic SC", cursive',
      body: '"Lato", sans-serif',
    },
    colors: {
      background: '#ffffff',
      surface: '#fefaff',
      text: '#4a4e69',
      accent: '#c9ada7',
      border: '#f2e9e4',
      secondary: '#9a8c98',
      backgroundPattern: PATTERNS.PAPER
    },
    layout: {
      radius: '12px',
      borderWidth: '0px',
      shadow: '0 10px 20px rgba(0,0,0,0.05)',
      headingTransform: 'uppercase',
      headingWeight: '700',
    },
    imageStyle: 'Watercolor painting, soft pastel colors, bleeding ink, artistic strokes, white canvas texture, dreamy, ethereal, no outlines'
  },
  oilpaint: {
    id: 'oilpaint',
    name: 'Oil Painting',
    description: 'Classic impasto art.',
    fonts: {
      heading: '"Libre Baskerville", serif',
      body: '"Merriweather", serif',
    },
    colors: {
      background: '#2b2118', // dark brown
      surface: '#45382e',
      text: '#e6d5ac',
      accent: '#d4a373',
      border: '#6f5e53',
      secondary: '#a4988e',
      backgroundPattern: PATTERNS.NOISE
    },
    layout: {
      radius: '4px',
      borderWidth: '8px',
      shadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
      headingTransform: 'capitalize',
      headingWeight: '400',
    },
    imageStyle: 'Oil painting, impasto texture, visible brushstrokes, classical art style, rich colors, dramatic lighting, museum quality, framed art'
  },
  streetwear: {
    id: 'streetwear',
    name: 'Hypebeast',
    description: 'Bold, industrial, urban fashion.',
    fonts: {
      heading: '"Anton", sans-serif',
      body: '"Roboto", sans-serif',
    },
    colors: {
      background: '#facc15', // yellow-400
      surface: '#000000',
      text: '#ffffff',
      accent: '#ffffff',
      border: '#000000',
      secondary: '#d4d4d4',
      backgroundPattern: PATTERNS.NOISE
    },
    layout: {
      radius: '0px',
      borderWidth: '0px',
      shadow: '10px 10px 0px #000000',
      headingTransform: 'uppercase',
      headingWeight: '400',
    },
    imageStyle: 'Streetwear fashion photography, urban grunge, graffiti background, hypebeast style, wide angle lens, fish eye, brutalist architecture, bold attitude'
  },
  cyber: {
    id: 'cyber',
    name: 'Cyberpunk 2077',
    description: 'Neon, gritty, futuristic.',
    fonts: {
      heading: '"Unbounded", sans-serif',
      body: '"Rajdhani", sans-serif',
    },
    colors: {
      background: '#050505',
      surface: '#1a1a1a',
      text: '#fcee0a', // Cyber yellow
      accent: '#00f0ff', // Cyber blue
      border: '#ff003c', // Cyber red
      secondary: '#888888',
      backgroundPattern: `repeating-linear-gradient(0deg, transparent, transparent 2px, #00f0ff 2px, #00f0ff 4px)`
    },
    layout: {
      radius: '0px',
      borderWidth: '2px',
      shadow: '0 0 10px #fcee0a',
      headingTransform: 'uppercase',
      headingWeight: '800',
    },
    imageStyle: 'Cyberpunk city, night time, rain, neon signs, holographic ads, high tech low life, mechanical implants, gritty, cinematic lighting'
  },
  glass: {
    id: 'glass',
    name: 'Frosted Glass',
    description: 'Modern UI/UX, blurred backgrounds.',
    fonts: {
      heading: '"Inter", sans-serif',
      body: '"Inter", sans-serif',
    },
    colors: {
      background: '#d4d4d8', // zinc-300
      surface: 'rgba(255, 255, 255, 0.65)',
      text: '#18181b',
      accent: '#27272a',
      border: '#ffffff',
      secondary: '#52525b',
    },
    layout: {
      radius: '16px',
      borderWidth: '1px',
      shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      headingTransform: 'none',
      headingWeight: '600',
    },
    imageStyle: '3D Abstract glass shapes, frosted glass, depth of field, soft pastel gradients, iridescent materials, modern art, clean render'
  },
  marker: {
    id: 'marker',
    name: 'Whiteboard Strategy',
    description: 'Hand-drawn marker on whiteboard.',
    fonts: {
      heading: '"Permanent Marker", cursive',
      body: '"Kalam", cursive',
    },
    colors: {
      background: '#ffffff',
      surface: '#f8f9fa',
      text: '#000000', // Black marker
      accent: '#dc2626', // Red marker
      border: '#e5e7eb',
      secondary: '#2563eb', // Blue marker
      backgroundPattern: PATTERNS.GRID
    },
    layout: {
      radius: '255px 15px 225px 15px / 15px 225px 15px 255px', // Sketchy border
      borderWidth: '2px',
      shadow: 'none',
      headingTransform: 'uppercase',
      headingWeight: '400',
    },
    imageStyle: 'Hand drawn whiteboard sketch, marker pen illustration, strategy diagram, arrows, circles, rough sketch style, business planning concept'
  },
  bauhaus: {
    id: 'bauhaus',
    name: 'Bauhaus',
    description: 'Primary colors, geometry, function.',
    fonts: {
      heading: '"League Spartan", sans-serif',
      body: '"Arial", sans-serif',
    },
    colors: {
      background: '#f0f0f0',
      surface: '#ffffff',
      text: '#111111',
      accent: '#eab308', // Yellow
      border: '#dc2626', // Red
      secondary: '#2563eb', // Blue
      backgroundPattern: PATTERNS.DOTS
    },
    layout: {
      radius: '0px',
      borderWidth: '0px',
      shadow: '8px 8px 0px rgba(0,0,0,0.2)',
      headingTransform: 'uppercase',
      headingWeight: '900',
    },
    imageStyle: 'Bauhaus art style, geometric shapes, circles triangles squares, primary colors red blue yellow, abstract composition, minimalist, modernism'
  },
  neonTokyo: {
    id: 'neonTokyo',
    name: 'Neon Tokyo',
    description: 'Vibrant night life, street photography.',
    fonts: {
      heading: '"Noto Sans JP", sans-serif',
      body: '"Roboto", sans-serif',
    },
    colors: {
      background: '#09090b',
      surface: '#18181b',
      text: '#ffffff',
      accent: '#ec4899', // Pink neon
      border: '#8b5cf6', // Purple neon
      secondary: '#a1a1aa',
      backgroundPattern: PATTERNS.NOISE
    },
    layout: {
      radius: '8px',
      borderWidth: '1px',
      shadow: '0 0 15px #ec4899',
      headingTransform: 'uppercase',
      headingWeight: '700',
    },
    imageStyle: 'Tokyo street photography at night, rain, neon signs, reflections on wet pavement, cinematic bokeh, cyberpunk vibes, urban exploration'
  }
};
