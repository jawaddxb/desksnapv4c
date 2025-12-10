/**
 * Image Style Presets
 *
 * Predefined image generation styles for AI-generated slide images.
 * Each style includes a prompt and subject guidance for consistent results.
 */

export interface ImageStyle {
  id: string;
  label: string;
  prompt: string;
  subjectGuidance: string;
}

export const IMAGE_STYLES: ImageStyle[] = [
  {
    id: 'auto',
    label: 'Auto (Match Theme)',
    prompt: 'auto',
    subjectGuidance: 'Match the subject matter to the theme aesthetic. If corporate, use people. If tech, use futuristic interfaces.',
  },
  {
    id: 'photo-studio',
    label: 'Studio Photo',
    prompt: 'High-end studio photography, clean background, soft controlled lighting, 8k resolution, photorealistic, sharp focus, commercial look, shot on Hasselblad',
    subjectGuidance: 'STRICTLY REALISM. Describe real people, professional models, hands working on devices, modern office architecture, or clean physical objects. DO NOT describe abstract data, floating nodes, or digital waves. Translate concepts into human scenarios.',
  },
  {
    id: 'photo-cinematic',
    label: 'Cinematic',
    prompt: 'Cinematic film still, dramatic lighting, anamorphic lens flares, color graded, depth of field, movie scene aesthetic, high contrast, IMAX quality',
    subjectGuidance: 'STRICTLY REALISM. Describe narrative scenes, characters in dramatic environments, emotional moments, or epic landscapes. Use cinematic camera angles. Avoid generic icons or abstract graphics.',
  },
  {
    id: 'photo-analog',
    label: 'Analog Film',
    prompt: '35mm film photography, grain, light leaks, warm tones, vintage aesthetic, candid feel, Kodak Portra 400, Leica M6',
    subjectGuidance: 'STRICTLY REALISM. Describe candid moments, lifestyle photography, authentic human interactions, or street photography. The vibe should be "captured in the moment", not staged.',
  },
  {
    id: '3d-abstract',
    label: 'Abstract 3D',
    prompt: 'Abstract 3D geometric shapes, glass and metal materials, octane render, unreal engine 5, futuristic, clean, architectural, raytracing',
    subjectGuidance: 'STRICTLY ABSTRACT. Describe geometric shapes, floating spheres, glass prisms, data streams, light beams, and complex textures. Do not include human faces or realistic environments.',
  },
  {
    id: '3d-iso',
    label: 'Isometric 3D',
    prompt: 'Isometric 3D render, orthographic view, clean studio lighting, pastel background, highly detailed, c4d, behance style, minimal',
    subjectGuidance: 'ISOMETRIC 3D. Describe small, self-contained floating islands or scenes viewed from a distance. Office desks, city blocks, or server rooms in a cute, clean, orthographic style.',
  },
  {
    id: '3d-clay',
    label: 'Clay Render',
    prompt: '3D claymorphism, soft rounded shapes, matte plastic texture, pastel colors, toy-like, studio lighting, cute, C4D render',
    subjectGuidance: 'STYLIZED 3D. Describe cute, simplified objects, icons, or characters made of soft clay. Use rounded edges. Metaphors should be playful (e.g., a clay rocket for growth).',
  },
  {
    id: '3d-surreal',
    label: 'Surreal 3D',
    prompt: 'Surreal digital art, dreamlike atmosphere, floating objects, defy gravity, soft gradients, ethereal lighting, dali-esque',
    subjectGuidance: 'SURREALISM. Describe dreamlike scenes that defy physics. Floating islands, clouds inside rooms, impossible geometry. Blend nature with technology.',
  },
  {
    id: 'illustration-minimal',
    label: 'Minimal Vector',
    prompt: 'Minimalist flat vector illustration, clean lines, solid colors, no gradients, corporate memphis style, simple shapes, adobe illustrator',
    subjectGuidance: 'FLAT ILLUSTRATION. Describe simple 2D scenes with flat characters or icons. Use metaphors. Keep composition simple and clean.',
  },
  {
    id: 'illustration-hand',
    label: 'Hand Drawn',
    prompt: 'Hand drawn sketch style, pencil or ink lines, white paper texture, rough edges, artistic, architectural sketch, detailed, graphite',
    subjectGuidance: 'SKETCH ART. Describe architectural drafts, rough conceptual sketches, or hand-drawn diagrams. Use lines and hatching.',
  },
  {
    id: 'illustration-tech',
    label: 'Blueprint',
    prompt: 'Technical blueprint aesthetic, white isometric lines on blue background, schematic, engineering, grid, CAD style',
    subjectGuidance: 'TECHNICAL DIAGRAMS. Describe schematics, wireframes, engine parts, or isometric city grids. Everything must look like a technical drawing.',
  },
  {
    id: 'illustration-lofi',
    label: 'Lo-Fi',
    prompt: 'Lo-fi aesthetic, grainy, muted colors, retro anime vibe, chill atmosphere, soft lighting',
    subjectGuidance: 'ANIME/LO-FI. Describe cozy rooms, desks with computers, city skylines at night, or characters studying. Relaxed vibe.',
  },
  {
    id: 'art-riso',
    label: 'Risograph',
    prompt: 'Risograph print, grainy texture, vibrant neon colors, misaligned layers, halftone, zine aesthetic, rough ink',
    subjectGuidance: 'PRINT ART. Describe simple compositions with limited color palettes (pink, blue, yellow). Overlapping shapes and rough textures.',
  },
  {
    id: 'art-watercolor',
    label: 'Watercolor',
    prompt: 'Watercolor painting, soft bleed effects, paper texture, artistic, dreamy, pastel tones, wet on wet technique',
    subjectGuidance: 'PAINTING. Describe soft, flowing scenes. Nature, flowers, or abstract color washes. No sharp lines or tech UI.',
  },
  {
    id: 'art-oil',
    label: 'Oil Painting',
    prompt: 'Oil painting, impasto texture, visible brushstrokes, classical art style, rich colors, dramatic lighting',
    subjectGuidance: 'CLASSICAL ART. Describe portraits, dramatic landscapes, or still life arrangements. Use classical composition techniques.',
  },
  {
    id: 'art-pop',
    label: 'Pop Art',
    prompt: 'Pop Art style, halftone dots, bold black outlines, vibrant primary colors, comic book aesthetic, Roy Lichtenstein style',
    subjectGuidance: 'COMIC BOOK. Describe explosive action, speech bubbles, bold character close-ups, or commercial products in a retro comic style.',
  },
  {
    id: 'art-double',
    label: 'Double Exposure',
    prompt: 'Double exposure photography, silhouette of subject filled with nature scene, dreamy, surreal, artistic, high contrast, black and white',
    subjectGuidance: 'SURREAL PORTRAIT. Describe a silhouette of a person or object that contains a landscape (forest, city, ocean) inside it.',
  },
  {
    id: 'collage',
    label: 'Retro Collage',
    prompt: 'Mixed media collage, cut-out vintage paper, grain, texture, surreal composition, dadaism style, ripped edges',
    subjectGuidance: 'MIXED MEDIA. Describe a composition of disparate elements: vintage photos of people mixed with astronomical elements or flowers. Ripped paper edges.',
  },
  {
    id: 'pixel',
    label: 'Pixel Art',
    prompt: 'Pixel art, 8-bit graphics, retro video game style, isometric view, limited color palette, dithering',
    subjectGuidance: 'RETRO GAME. Describe isometric game environments, 8-bit items, or arcade interfaces.',
  },
];

/**
 * Get an image style by ID.
 */
export function getImageStyleById(id: string): ImageStyle | undefined {
  return IMAGE_STYLES.find(style => style.id === id);
}

/**
 * Get the auto/default image style.
 */
export function getAutoImageStyle(): ImageStyle {
  return IMAGE_STYLES[0];
}
