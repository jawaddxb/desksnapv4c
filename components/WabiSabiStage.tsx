
import React from 'react';
import { Slide, Theme } from '../types';
import { PRNG } from '../lib/utils';
import { ArchetypeProps } from './WabiSabiComponents';
import { 
    EditorialArchetype, TypographicArchetype, ConstructivistArchetype, BauhausArchetype, 
    BrutalistArchetype, PostModernArchetype, SchematicArchetype, CinematicArchetype, 
    CollageArchetype, ZineArchetype, SwissArchetype, CyberDeckArchetype, ReceiptArchetype,
    Y2KArchetype, RisographArchetype, VaporwaveArchetype, SwissGridArchetype, NoirArchetype
} from './WabiSabiArchetypes';

interface WabiSabiStageProps {
  slide: Slide;
  theme: Theme;
  onUpdateSlide?: (updates: Partial<Slide>) => void;
  printMode?: boolean;
  layoutStyle?: string;
}

// Map of all renderers
const ARCHETYPE_RENDERERS: Record<string, React.FC<ArchetypeProps>> = {
    'Editorial': EditorialArchetype,
    'Constructivist': ConstructivistArchetype,
    'Brutalist': BrutalistArchetype,
    'CyberDeck': CyberDeckArchetype,
    'Zine': ZineArchetype,
    'Swiss': SwissArchetype,
    'Receipt': ReceiptArchetype,
    'Typographic': TypographicArchetype,
    'Collage': CollageArchetype,
    'Bauhaus': BauhausArchetype,
    'PostModern': PostModernArchetype,
    'Schematic': SchematicArchetype,
    'Cinematic': CinematicArchetype,
    'Y2K': Y2KArchetype,
    'Risograph': RisographArchetype,
    'Vaporwave': VaporwaveArchetype,
    'SwissGrid': SwissGridArchetype,
    'Noir': NoirArchetype
};

export const WABI_SABI_LAYOUT_NAMES = Object.keys(ARCHETYPE_RENDERERS);

// --- MAIN CONTROLLER COMPONENT ---

export const WabiSabiStage: React.FC<WabiSabiStageProps> = ({ slide, theme, onUpdateSlide, printMode, layoutStyle }) => {
    // Idempotent RNG: Fixed seed per slide ID guarantees same random layout on every render frame
    // This stops the "dancing layout" issue completely.
    const seed = slide.layoutVariant || slide.id.charCodeAt(0);
    const rng = new PRNG(seed.toString());

    const archetype = layoutStyle && ARCHETYPE_RENDERERS[layoutStyle] ? layoutStyle : 'Editorial';
    
    // Intelligent Contrast System
    const contrast = {
        bg: theme.colors.surface,
        text: theme.colors.text,
        accent: theme.colors.accent,
        secondary: theme.colors.secondary,
        border: theme.colors.border,
        mode: 'theme'
    };

    // Override contrast for dark-mode specific archetypes
    if (archetype === 'CyberDeck') Object.assign(contrast, { bg: '#050505', text: '#22d3ee', accent: '#22d3ee', border: '#164e63', mode: 'terminal' });
    if (archetype === 'Receipt') Object.assign(contrast, { bg: '#ffffff', text: '#18181b', accent: '#000000', border: '#e4e4e7', mode: 'paper' });
    if (archetype === 'Schematic' && theme.colors.background === '#ffffff') Object.assign(contrast, { bg: '#f0f9ff', text: '#0033cc', mode: 'blueprint' });
    if (archetype === 'Typographic' && rng.next() > 0.5) {
         // Randomly invert Typographic slides for visual variety
         const temp = contrast.bg;
         contrast.bg = contrast.text;
         contrast.text = temp;
    }

    const Renderer = ARCHETYPE_RENDERERS[archetype] || SwissArchetype;

    return <Renderer slide={slide} theme={theme} contrast={contrast} rng={rng} onUpdateSlide={onUpdateSlide} readOnly={printMode} />;
};
