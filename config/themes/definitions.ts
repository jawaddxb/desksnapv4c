/**
 * Theme Definitions
 *
 * All theme definitions organized by category.
 * Import from './index' for the merged THEMES object.
 */

import { Theme } from '../../types';
import { PATTERNS } from '../patterns';
import { CONTENT_STYLE_PRESETS } from '../contentStyles';

// =============================================================================
// SYSTEM THEME (Default UI Theme)
// =============================================================================

export const SYSTEM_THEME: Theme = {
  id: 'system',
  name: 'System UI',
  description: 'Standard Interface Theme',
  fonts: { heading: '"Space Grotesk", sans-serif', body: '"DM Sans", sans-serif' },
  colors: { background: '#ffffff', surface: '#ffffff', text: '#18181b', accent: '#18181b', border: '#e4e4e7', secondary: '#71717a' },
  layout: { radius: '8px', borderWidth: '1px', shadow: 'none', headingTransform: 'none', headingWeight: '600' },
  imageStyle: '',
  contentStyle: { ...CONTENT_STYLE_PRESETS.minimal, bulletColor: 'text' },
};

// =============================================================================
// CORE COLLECTION
// =============================================================================

export const coreThemes: Record<string, Theme> = {
  neoBrutalist: {
    id: 'neoBrutalist',
    name: 'Neo-Brutalist',
    description: 'Raw, high-contrast, monochromatic photography.',
    fonts: { heading: '"Oswald", sans-serif', body: '"Space Mono", monospace' },
    colors: { background: '#ffffff', surface: '#f4f4f5', text: '#000000', accent: '#ccff00', border: '#000000', secondary: '#52525b', backgroundPattern: PATTERNS.NOISE },
    layout: { radius: '0px', borderWidth: '4px', shadow: '8px 8px 0px #000000', headingTransform: 'uppercase', headingWeight: '700' },
    imageStyle: 'Black and white analog photography, high contrast, flash photography, grunge texture, raw aesthetic, street style, 35mm film grain, harsh shadows',
    contentStyle: { ...CONTENT_STYLE_PRESETS.technical, bulletSize: 10, bulletColor: 'text' },
  },
  executive: {
    id: 'executive',
    name: 'Executive Suite',
    description: 'Clean, modern corporate photography.',
    fonts: { heading: '"Inter", sans-serif', body: '"Inter", sans-serif' },
    colors: { background: '#f8fafc', surface: '#ffffff', text: '#0f172a', accent: '#0369a1', border: '#cbd5e1', secondary: '#64748b' },
    layout: { radius: '6px', borderWidth: '1px', shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', headingTransform: 'none', headingWeight: '600' },
    imageStyle: 'High-end corporate stock photography, modern glass architecture, bright natural light, shallow depth of field, professional, clean lines, blue and white color palette',
    contentStyle: { ...CONTENT_STYLE_PRESETS.numbered },
  },
  vogue: {
    id: 'vogue',
    name: 'Vogue Editorial',
    description: 'Warm, cinematic fashion photography.',
    fonts: { heading: '"Abril Fatface", serif', body: '"Lato", sans-serif' },
    colors: { background: '#fff1f2', surface: '#ffffff', text: '#4a044e', accent: '#db2777', border: '#fbcfe8', secondary: '#9d174d', backgroundPattern: PATTERNS.NOISE },
    layout: { radius: '0px', borderWidth: '0px', shadow: 'none', headingTransform: 'none', headingWeight: '400' },
    imageStyle: 'Fashion editorial photography, warm golden hour lighting, analog film aesthetic, Kodak Portra 400, soft focus, elegance, luxury lifestyle, beige and pastel tones',
    contentStyle: { ...CONTENT_STYLE_PRESETS.modern, leftBorderWidth: 1 },
  },
  swiss: {
    id: 'swiss',
    name: 'Swiss International',
    description: 'Geometric, flat vector illustration.',
    fonts: { heading: '"Work Sans", sans-serif', body: '"DM Sans", sans-serif' },
    colors: { background: '#f5f5f5', surface: '#ffffff', text: '#111111', accent: '#ea580c', border: '#111111', secondary: '#444444', backgroundPattern: `radial-gradient(#ccc 1px, transparent 1px)` },
    layout: { radius: '0px', borderWidth: '2px', shadow: 'none', headingTransform: 'uppercase', headingWeight: '900' },
    imageStyle: 'Swiss Design Style, Bauhaus vector art, flat geometric shapes, minimalism, bold primary colors, abstract composition, clean lines, no gradients, graphic design poster',
    contentStyle: { bulletStyle: 'dot', bulletSize: 8, bulletColor: 'accent', itemSpacing: 14 },
  },
  futureTech: {
    id: 'futureTech',
    name: 'Future Tech',
    description: 'Dark mode, 3D abstract data.',
    fonts: { heading: '"Teko", sans-serif', body: '"Space Mono", monospace' },
    colors: { background: '#020617', surface: '#0f172a', text: '#e2e8f0', accent: '#06b6d4', border: '#1e293b', secondary: '#94a3b8', backgroundPattern: `radial-gradient(circle at 50% 0%, #1e293b 0%, transparent 70%)` },
    layout: { radius: '4px', borderWidth: '1px', shadow: '0 0 20px rgba(6, 182, 212, 0.2)', headingTransform: 'uppercase', headingWeight: '600' },
    imageStyle: 'Abstract 3D Technology, neon glowing particles, data visualization, dark cyberpunk atmosphere, volumetric lighting, Octane render, unreal engine 5, cyan and purple palette',
    contentStyle: { ...CONTENT_STYLE_PRESETS.checklist },
  },
};

// =============================================================================
// BUSINESS & TECH
// =============================================================================

export const businessThemes: Record<string, Theme> = {
  saas: {
    id: 'saas',
    name: 'Modern SaaS',
    description: 'Deep purples and gradients, software vibe.',
    fonts: { heading: '"Plus Jakarta Sans", sans-serif', body: '"Inter", sans-serif' },
    colors: { background: '#0f172a', surface: '#1e293b', text: '#f8fafc', accent: '#818cf8', border: '#334155', secondary: '#94a3b8', backgroundPattern: `linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)` },
    layout: { radius: '12px', borderWidth: '1px', shadow: '0 10px 30px -10px rgba(129, 140, 248, 0.3)', headingTransform: 'none', headingWeight: '700' },
    imageStyle: '3D Glassmorphism, abstract fluid gradients, software interface elements, translucent materials, deep blue and purple lighting, futuristic UI design',
    contentStyle: { ...CONTENT_STYLE_PRESETS.circle, bulletSize: 10 },
  },
  fintech: {
    id: 'fintech',
    name: 'Trust Fintech',
    description: 'Reliable navy and gold, clean layout.',
    fonts: { heading: '"Manrope", sans-serif', body: '"Manrope", sans-serif' },
    colors: { background: '#ffffff', surface: '#f0f9ff', text: '#0c4a6e', accent: '#d97706', border: '#bae6fd', secondary: '#0369a1' },
    layout: { radius: '4px', borderWidth: '1px', shadow: 'none', headingTransform: 'none', headingWeight: '800' },
    imageStyle: 'Minimalist financial illustration, thin lines, gold accents, isometric cityscapes, clean data visualization, white background, trustworthy aesthetic',
    contentStyle: { ...CONTENT_STYLE_PRESETS.numbered, numberedSuffix: ')' },
  },
  startup: {
    id: 'startup',
    name: 'Silicon Valley',
    description: 'Blurple, energetic, standard tech.',
    fonts: { heading: '"Poppins", sans-serif', body: '"Open Sans", sans-serif' },
    colors: { background: '#ffffff', surface: '#fafafa', text: '#27272a', accent: '#4f46e5', border: '#e4e4e7', secondary: '#71717a' },
    layout: { radius: '8px', borderWidth: '1px', shadow: '0 4px 6px -1px rgba(0,0,0,0.05)', headingTransform: 'capitalize', headingWeight: '700' },
    imageStyle: 'Corporate Memphis style illustration, flat vector art, vibrant purple and blue colors, exaggerated characters, teamwork, office life, clean and joyful',
    contentStyle: { ...CONTENT_STYLE_PRESETS.arrow },
  },
};

// =============================================================================
// LUXURY & FASHION
// =============================================================================

export const luxuryThemes: Record<string, Theme> = {
  luxury: {
    id: 'luxury',
    name: 'Luxury Gold',
    description: 'Dark marble and gold photorealism.',
    fonts: { heading: '"Cinzel", serif', body: '"Raleway", sans-serif' },
    colors: { background: '#0a0a0a', surface: '#171717', text: '#fef3c7', accent: '#d4af37', border: '#404040', secondary: '#a1a1aa', backgroundPattern: PATTERNS.NOISE },
    layout: { radius: '0px', borderWidth: '1px', shadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)', headingTransform: 'uppercase', headingWeight: '400' },
    imageStyle: 'Luxury Product Photography, black marble texture, gold accents, dramatic rim lighting, macro details, elegant, expensive, high-end editorial aesthetic, 8k',
    contentStyle: { ...CONTENT_STYLE_PRESETS.elegant, itemSpacing: 18 },
  },
  minimalist: {
    id: 'minimalist',
    name: 'Nordic Minimal',
    description: 'Beige, airy, sophisticated.',
    fonts: { heading: '"Montserrat", sans-serif', body: '"Lato", sans-serif' },
    colors: { background: '#fdfbf7', surface: '#ffffff', text: '#44403c', accent: '#78716c', border: '#e7e5e4', secondary: '#a8a29e' },
    layout: { radius: '2px', borderWidth: '0px', shadow: 'none', headingTransform: 'uppercase', headingWeight: '300' },
    imageStyle: 'Minimalist Scandinavian photography, neutral beige tones, soft shadows, organic shapes, ceramics, dried flowers, clean interior design, zen atmosphere',
    contentStyle: { ...CONTENT_STYLE_PRESETS.minimal, bulletSize: 5, bulletColor: 'secondary' },
  },
  noir: {
    id: 'noir',
    name: 'Film Noir',
    description: 'Cinematic black & white mystery.',
    fonts: { heading: '"Playfair Display", serif', body: '"Montserrat", sans-serif' },
    colors: { background: '#000000', surface: '#111111', text: '#e5e5e5', accent: '#dc2626', border: '#333333', secondary: '#737373', backgroundPattern: PATTERNS.NOISE },
    layout: { radius: '0px', borderWidth: '1px', shadow: '0 0 50px rgba(0,0,0,1)', headingTransform: 'capitalize', headingWeight: '700' },
    imageStyle: 'Film Noir cinematography, black and white, high contrast chiaroscuro lighting, silhouettes, fog, rain, detective mystery vibe, dramatic shadows',
    contentStyle: { ...CONTENT_STYLE_PRESETS.modern, bulletStyle: 'dash', leftBorderWidth: 2 },
  },
};

// =============================================================================
// NATURE & ORGANIC
// =============================================================================

export const natureThemes: Record<string, Theme> = {
  botanical: {
    id: 'botanical',
    name: 'Botanical Garden',
    description: 'Lush greens and elegant serifs.',
    fonts: { heading: '"Cormorant Garamond", serif', body: '"Nunito", sans-serif' },
    colors: { background: '#f0fdf4', surface: '#ffffff', text: '#14532d', accent: '#16a34a', border: '#bbf7d0', secondary: '#4ade80' },
    layout: { radius: '16px', borderWidth: '1px', shadow: '0 10px 15px -3px rgba(20, 83, 45, 0.1)', headingTransform: 'none', headingWeight: '600' },
    imageStyle: 'Botanical illustration, vintage scientific drawing, watercolor texture, lush green plants, flowers, nature close-ups, soft natural lighting, elegant',
    contentStyle: { bulletStyle: 'circle', bulletSize: 10, bulletColor: 'accent', itemSpacing: 16 },
  },
  solar: {
    id: 'solar',
    name: 'Solar Punk',
    description: 'Eco-futurism, green and gold.',
    fonts: { heading: '"Syne", sans-serif', body: '"Space Grotesk", sans-serif' },
    colors: { background: '#f7fee7', surface: '#ffffff', text: '#365314', accent: '#a3e635', border: '#d9f99d', secondary: '#65a30d' },
    layout: { radius: '20px', borderWidth: '0px', shadow: '8px 8px 0px #ecfccb', headingTransform: 'lowercase', headingWeight: '800' },
    imageStyle: 'Solarpunk aesthetic, futuristic green city, nature and technology blending, art nouveau influence, bright sunlight, utopia, sustainable architecture, vibrant green and gold',
    contentStyle: { ...CONTENT_STYLE_PRESETS.checklist, bulletSize: 12 },
  },
  oceanic: {
    id: 'oceanic',
    name: 'Deep Ocean',
    description: 'Calm teals and fluid shapes.',
    fonts: { heading: '"Comfortaa", sans-serif', body: '"Quicksand", sans-serif' },
    colors: { background: '#ecfeff', surface: '#ffffff', text: '#164e63', accent: '#06b6d4', border: '#a5f3fc', secondary: '#0891b2' },
    layout: { radius: '30px', borderWidth: '0px', shadow: '0 4px 20px rgba(6, 182, 212, 0.15)', headingTransform: 'none', headingWeight: '700' },
    imageStyle: 'Underwater photography, bioluminescence, jellyfish, fluid shapes, deep blue and teal gradients, bubbles, ethereal, calm, high definition',
    contentStyle: { bulletStyle: 'dot', bulletSize: 8, bulletColor: 'accent', itemSpacing: 16 },
  },
  earth: {
    id: 'earth',
    name: 'Warm Earth',
    description: 'Terracotta, sand, organic textures.',
    fonts: { heading: '"Merriweather", serif', body: '"Open Sans", sans-serif' },
    colors: { background: '#fff7ed', surface: '#ffffff', text: '#7c2d12', accent: '#ea580c', border: '#fed7aa', secondary: '#c2410c', backgroundPattern: PATTERNS.PAPER },
    layout: { radius: '2px', borderWidth: '1px', shadow: '4px 4px 0px #fdba74', headingTransform: 'none', headingWeight: '700' },
    imageStyle: 'Organic textures, terracotta clay, sand dunes, warm desert light, pottery, natural materials, linen fabric, bohemian aesthetic',
    contentStyle: { ...CONTENT_STYLE_PRESETS.modern, leftBorderWidth: 3 },
  },
};

// =============================================================================
// RETRO & VINTAGE
// =============================================================================

export const retroThemes: Record<string, Theme> = {
  retro80s: {
    id: 'retro80s',
    name: 'Synthwave 80s',
    description: 'Neon grids and sunsets.',
    fonts: { heading: '"Righteous", sans-serif', body: '"Montserrat", sans-serif' },
    colors: { background: '#2e022d', surface: '#4a044e', text: '#f0abfc', accent: '#22d3ee', border: '#d946ef', secondary: '#e879f9', backgroundPattern: PATTERNS.GRID },
    layout: { radius: '0px', borderWidth: '2px', shadow: '4px 4px 0px #22d3ee', headingTransform: 'uppercase', headingWeight: '400' },
    imageStyle: 'Synthwave, Retrowave, 1980s neon grid landscape, chrome mountains, purple sunset, vector graphics style, laser beams, retro futurism',
    contentStyle: { ...CONTENT_STYLE_PRESETS.arrow, bulletSize: 12 },
  },
  vintageTravel: {
    id: 'vintageTravel',
    name: 'Vintage Travel',
    description: 'Washed out posters and textures.',
    fonts: { heading: '"Bebas Neue", sans-serif', body: '"Crimson Text", serif' },
    colors: { background: '#fef3c7', surface: '#fffbeb', text: '#78350f', accent: '#b45309', border: '#d97706', secondary: '#92400e', backgroundPattern: PATTERNS.PAPER },
    layout: { radius: '2px', borderWidth: '4px', shadow: 'none', headingTransform: 'uppercase', headingWeight: '400' },
    imageStyle: 'Vintage travel poster, grainy texture, washed out colors, mid-century modern illustration, screen print effect, nostalgia, scenic landscape',
    contentStyle: { ...CONTENT_STYLE_PRESETS.numbered, numberedSuffix: ')' },
  },
  newspaper: {
    id: 'newspaper',
    name: 'The Daily Press',
    description: 'Classic print, monochrome.',
    fonts: { heading: '"Playfair Display", serif', body: '"Lora", serif' },
    colors: { background: '#f2e9e4', surface: '#ffffff', text: '#1c1917', accent: '#000000', border: '#e7e5e4', secondary: '#57534e', backgroundPattern: PATTERNS.PAPER },
    layout: { radius: '0px', borderWidth: '1px', shadow: 'none', headingTransform: 'uppercase', headingWeight: '900' },
    imageStyle: 'Black and white engraving style illustration, vintage etching, detailed linework, cross-hatching, Wall Street Journal stipple portrait style, classic print media',
    contentStyle: { bulletStyle: 'square', bulletSize: 6, bulletColor: 'text', itemSpacing: 14 },
  },
  popArt: {
    id: 'popArt',
    name: 'Pop Art',
    description: 'Bold, comic book halftone.',
    fonts: { heading: '"Bangers", cursive', body: '"Open Sans", sans-serif' },
    colors: { background: '#ffffff', surface: '#fff100', text: '#000000', accent: '#ed1c24', border: '#000000', secondary: '#0054a6', backgroundPattern: PATTERNS.DOTS },
    layout: { radius: '0px', borderWidth: '4px', shadow: '8px 8px 0px #000000', headingTransform: 'uppercase', headingWeight: '800' },
    imageStyle: 'Pop Art, Roy Lichtenstein style, halftone dots, bold black outlines, primary colors (red, yellow, blue), comic book aesthetic, speech bubbles, dynamic',
    contentStyle: { bulletStyle: 'dot', bulletSize: 12, bulletColor: 'accent', itemSpacing: 14 },
  },
  pixel: {
    id: 'pixel',
    name: '8-Bit Arcade',
    description: 'Retro gaming pixel art.',
    fonts: { heading: '"Press Start 2P", cursive', body: '"Fira Code", monospace' },
    colors: { background: '#0f0f0f', surface: '#2a2a2a', text: '#00ff00', accent: '#ff00ff', border: '#ffffff', secondary: '#cccccc', backgroundPattern: PATTERNS.GRID },
    layout: { radius: '0px', borderWidth: '2px', shadow: 'none', headingTransform: 'uppercase', headingWeight: '400' },
    imageStyle: 'Pixel art, 8-bit graphics, retro video game, isometric view, limited color palette, dithering, blocky shapes, nostalgia',
    contentStyle: { bulletStyle: 'square', bulletSize: 8, bulletColor: 'accent', itemSpacing: 12 },
  },
};

// =============================================================================
// ARTISTIC & EXPERIMENTAL
// =============================================================================

export const artisticThemes: Record<string, Theme> = {
  blueprint: {
    id: 'blueprint',
    name: 'Technical Blueprint',
    description: 'Schematic technical illustration.',
    fonts: { heading: '"Space Mono", monospace', body: '"Space Mono", monospace' },
    colors: { background: '#1e3a8a', surface: '#172554', text: '#bfdbfe', accent: '#60a5fa', border: '#3b82f6', secondary: '#93c5fd', backgroundPattern: PATTERNS.GRID },
    layout: { radius: '0px', borderWidth: '2px', shadow: 'none', headingTransform: 'uppercase', headingWeight: '400' },
    imageStyle: 'Technical Blueprint Illustration, white isometric lines on dark blue background, schematic diagram, engineering drawing, grid background, precise details, no shading, CAD style',
    contentStyle: { ...CONTENT_STYLE_PRESETS.numbered, numberedSuffix: '.' },
  },
  clay: {
    id: 'clay',
    name: 'Claymorphism',
    description: 'Playful 3D plasticine render.',
    fonts: { heading: '"Outfit", sans-serif', body: '"Quicksand", sans-serif' },
    colors: { background: '#fff7ed', surface: '#ffffff', text: '#431407', accent: '#f97316', border: '#fed7aa', secondary: '#9a3412' },
    layout: { radius: '24px', borderWidth: '0px', shadow: '12px 12px 24px rgba(249, 115, 22, 0.15), -12px -12px 24px rgba(255, 255, 255, 1)', headingTransform: 'capitalize', headingWeight: '800' },
    imageStyle: '3D Clay Render, cute rounded shapes, plasticine texture, soft studio lighting, pastel colors, minimal composition, toy-like, C4D, playful',
    contentStyle: { bulletStyle: 'circle', bulletSize: 12, bulletColor: 'accent', itemSpacing: 16 },
  },
  papercut: {
    id: 'papercut',
    name: 'Papercraft Art',
    description: 'Layered paper illustration.',
    fonts: { heading: '"DM Serif Display", serif', body: '"Montserrat", sans-serif' },
    colors: { background: '#f5f5f4', surface: '#ffffff', text: '#1c1917', accent: '#d97706', border: '#e7e5e4', secondary: '#57534e', backgroundPattern: PATTERNS.PAPER },
    layout: { radius: '2px', borderWidth: '1px', shadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', headingTransform: 'none', headingWeight: '400' },
    imageStyle: 'Digital Paper Cutout Art, layered paper craft, deep drop shadows, depth of field, earth tones, textured paper, diorama style, whimsical',
    contentStyle: { ...CONTENT_STYLE_PRESETS.modern, leftBorderWidth: 3 },
  },
  ukiyo: {
    id: 'ukiyo',
    name: 'Ukiyo-e Print',
    description: 'Japanese woodblock aesthetic.',
    fonts: { heading: '"Crimson Text", serif', body: '"Noto Sans", sans-serif' },
    colors: { background: '#fdf6e3', surface: '#ffffff', text: '#002b36', accent: '#cb4b16', border: '#93a1a1', secondary: '#586e75', backgroundPattern: PATTERNS.PAPER },
    layout: { radius: '0px', borderWidth: '1px', shadow: '4px 4px 0px #b58900', headingTransform: 'none', headingWeight: '600' },
    imageStyle: 'Ukiyo-e Japanese woodblock print, Hokusai style, flat colors, textured paper, outlines, Great Wave aesthetic, Mount Fuji, traditional art',
    contentStyle: { bulletStyle: 'dash', bulletSize: 10, bulletColor: 'accent', itemSpacing: 16 },
  },
  watercolor: {
    id: 'watercolor',
    name: 'Watercolor',
    description: 'Soft, artistic painterly vibes.',
    fonts: { heading: '"Amatic SC", cursive', body: '"Lato", sans-serif' },
    colors: { background: '#ffffff', surface: '#fefaff', text: '#4a4e69', accent: '#c9ada7', border: '#f2e9e4', secondary: '#9a8c98', backgroundPattern: PATTERNS.PAPER },
    layout: { radius: '12px', borderWidth: '0px', shadow: '0 10px 20px rgba(0,0,0,0.05)', headingTransform: 'uppercase', headingWeight: '700' },
    imageStyle: 'Watercolor painting, soft pastel colors, bleeding ink, artistic strokes, white canvas texture, dreamy, ethereal, no outlines',
    contentStyle: { ...CONTENT_STYLE_PRESETS.minimal, bulletSize: 6, bulletColor: 'accent' },
  },
  oilpaint: {
    id: 'oilpaint',
    name: 'Oil Painting',
    description: 'Classic impasto art.',
    fonts: { heading: '"Libre Baskerville", serif', body: '"Merriweather", serif' },
    colors: { background: '#2b2118', surface: '#45382e', text: '#e6d5ac', accent: '#d4a373', border: '#6f5e53', secondary: '#a4988e', backgroundPattern: PATTERNS.NOISE },
    layout: { radius: '4px', borderWidth: '8px', shadow: 'inset 0 0 20px rgba(0,0,0,0.5)', headingTransform: 'capitalize', headingWeight: '400' },
    imageStyle: 'Oil painting, impasto texture, visible brushstrokes, classical art style, rich colors, dramatic lighting, museum quality, framed art',
    contentStyle: { ...CONTENT_STYLE_PRESETS.elegant, bulletSize: 10 },
  },
  streetwear: {
    id: 'streetwear',
    name: 'Hypebeast',
    description: 'Bold, industrial, urban fashion.',
    fonts: { heading: '"Anton", sans-serif', body: '"Roboto", sans-serif' },
    colors: { background: '#facc15', surface: '#000000', text: '#ffffff', accent: '#ffffff', border: '#000000', secondary: '#d4d4d4', backgroundPattern: PATTERNS.NOISE },
    layout: { radius: '0px', borderWidth: '0px', shadow: '10px 10px 0px #000000', headingTransform: 'uppercase', headingWeight: '400' },
    imageStyle: 'Streetwear fashion photography, urban grunge, graffiti background, hypebeast style, wide angle lens, fish eye, brutalist architecture, bold attitude',
    contentStyle: { bulletStyle: 'square', bulletSize: 10, bulletColor: 'text', itemSpacing: 14 },
  },
  cyber: {
    id: 'cyber',
    name: 'Cyberpunk 2077',
    description: 'Neon, gritty, futuristic.',
    fonts: { heading: '"Unbounded", sans-serif', body: '"Rajdhani", sans-serif' },
    colors: { background: '#050505', surface: '#1a1a1a', text: '#fcee0a', accent: '#00f0ff', border: '#ff003c', secondary: '#888888', backgroundPattern: `repeating-linear-gradient(0deg, transparent, transparent 2px, #00f0ff 2px, #00f0ff 4px)` },
    layout: { radius: '0px', borderWidth: '2px', shadow: '0 0 10px #fcee0a', headingTransform: 'uppercase', headingWeight: '800' },
    imageStyle: 'Cyberpunk city, night time, rain, neon signs, holographic ads, high tech low life, mechanical implants, gritty, cinematic lighting',
    contentStyle: { ...CONTENT_STYLE_PRESETS.arrow, bulletSize: 12 },
  },
  glass: {
    id: 'glass',
    name: 'Frosted Glass',
    description: 'Modern UI/UX, blurred backgrounds.',
    fonts: { heading: '"Inter", sans-serif', body: '"Inter", sans-serif' },
    colors: { background: '#d4d4d8', surface: 'rgba(255, 255, 255, 0.65)', text: '#18181b', accent: '#27272a', border: '#ffffff', secondary: '#52525b' },
    layout: { radius: '16px', borderWidth: '1px', shadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', headingTransform: 'none', headingWeight: '600' },
    imageStyle: '3D Abstract glass shapes, frosted glass, depth of field, soft pastel gradients, iridescent materials, modern art, clean render',
    contentStyle: { ...CONTENT_STYLE_PRESETS.minimal, bulletColor: 'text' },
  },
  marker: {
    id: 'marker',
    name: 'Whiteboard Strategy',
    description: 'Hand-drawn marker on whiteboard.',
    fonts: { heading: '"Permanent Marker", cursive', body: '"Kalam", cursive' },
    colors: { background: '#ffffff', surface: '#f8f9fa', text: '#000000', accent: '#dc2626', border: '#e5e7eb', secondary: '#2563eb', backgroundPattern: PATTERNS.GRID },
    layout: { radius: '255px 15px 225px 15px / 15px 225px 15px 255px', borderWidth: '2px', shadow: 'none', headingTransform: 'uppercase', headingWeight: '400' },
    imageStyle: 'Hand drawn whiteboard sketch, marker pen illustration, strategy diagram, arrows, circles, rough sketch style, business planning concept',
    contentStyle: { ...CONTENT_STYLE_PRESETS.checklist, bulletSize: 12 },
  },
  bauhaus: {
    id: 'bauhaus',
    name: 'Bauhaus',
    description: 'Primary colors, geometry, function.',
    fonts: { heading: '"League Spartan", sans-serif', body: '"Arial", sans-serif' },
    colors: { background: '#f0f0f0', surface: '#ffffff', text: '#111111', accent: '#eab308', border: '#dc2626', secondary: '#2563eb', backgroundPattern: PATTERNS.DOTS },
    layout: { radius: '0px', borderWidth: '0px', shadow: '8px 8px 0px rgba(0,0,0,0.2)', headingTransform: 'uppercase', headingWeight: '900' },
    imageStyle: 'Bauhaus art style, geometric shapes, circles triangles squares, primary colors red blue yellow, abstract composition, minimalist, modernism',
    contentStyle: { bulletStyle: 'circle', bulletSize: 10, bulletColor: 'accent', itemSpacing: 14 },
  },
  neonTokyo: {
    id: 'neonTokyo',
    name: 'Neon Tokyo',
    description: 'Vibrant night life, street photography.',
    fonts: { heading: '"Noto Sans JP", sans-serif', body: '"Roboto", sans-serif' },
    colors: { background: '#09090b', surface: '#18181b', text: '#ffffff', accent: '#ec4899', border: '#8b5cf6', secondary: '#a1a1aa', backgroundPattern: PATTERNS.NOISE },
    layout: { radius: '8px', borderWidth: '1px', shadow: '0 0 15px #ec4899', headingTransform: 'uppercase', headingWeight: '700' },
    imageStyle: 'Tokyo street photography at night, rain, neon signs, reflections on wet pavement, cinematic bokeh, cyberpunk vibes, urban exploration',
    contentStyle: { ...CONTENT_STYLE_PRESETS.modern, leftBorderWidth: 2 },
  },
};
