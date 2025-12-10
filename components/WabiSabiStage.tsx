
import React from 'react';
import { Slide, Theme } from '../types';
import { PRNG } from '../lib/utils';
import { ArchetypeProps } from './WabiSabiComponents';
import { ensureContrast } from '../lib/contrast';
import { LayoutToolbar } from './LayoutToolbar';
import {
    EditorialArchetype, TypographicArchetype, ConstructivistArchetype, BauhausArchetype,
    BrutalistArchetype, PostModernArchetype, SchematicArchetype, CinematicArchetype,
    CollageArchetype, ZineArchetype, SwissArchetype, CyberDeckArchetype, ReceiptArchetype,
    Y2KArchetype, RisographArchetype, VaporwaveArchetype, SwissGridArchetype, NoirArchetype,
    // Wabi Sabi Archetypes
    KintsugiArchetype, HyggeArchetype, TerrazzoArchetype, KinfolkArchetype, MediterraneanArchetype,
    SumieArchetype, MonolithArchetype, HerbariumArchetype, CoastalArchetype, AtelierArchetype,
    // Corporate Pitch Deck Archetypes
    VentureArchetype, KeynoteArchetype, GradientArchetype, SignalArchetype, MetricArchetype,
    NarrativeArchetype, BeaconArchetype, SlideArchetype, CanvasArchetype, DeckArchetype,
    // Modern Tech Aesthetics
    BentoArchetype, GlassArchetype, LiquidArchetype, TerminalArchetype, NeonArchetype,
    AuroraArchetype, MeshArchetype, PulseArchetype, CircuitArchetype, HologramArchetype,
    // Design Movements
    MemphisArchetype, DecoArchetype, RetroArchetype, NeueArchetype, ClayArchetype,
    PopArchetype, ModArchetype, GothicArchetype, RococoArchetype, StarkArchetype,
    // Natural/Organic
    TerraArchetype, ForestArchetype, StoneArchetype, BloomArchetype, DesertArchetype,
    FrostArchetype, EmberArchetype, MistArchetype, GrainArchetype, MineralArchetype,
    // Cultural/Regional
    TokyoArchetype, SeoulArchetype, ParisArchetype, MilanoArchetype, BrooklynArchetype,
    NordicArchetype, HavanaArchetype, MarrakechArchetype, KyotoArchetype, ViennaArchetype
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
    'Noir': NoirArchetype,
    // Wabi Sabi Archetypes
    'Kintsugi': KintsugiArchetype,
    'Hygge': HyggeArchetype,
    'Terrazzo': TerrazzoArchetype,
    'Kinfolk': KinfolkArchetype,
    'Mediterranean': MediterraneanArchetype,
    'Sumi-e': SumieArchetype,
    'Monolith': MonolithArchetype,
    'Herbarium': HerbariumArchetype,
    'Coastal': CoastalArchetype,
    'Atelier': AtelierArchetype,
    // Corporate Pitch Deck Archetypes
    'Venture': VentureArchetype,
    'Keynote': KeynoteArchetype,
    'Gradient': GradientArchetype,
    'Signal': SignalArchetype,
    'Metric': MetricArchetype,
    'Narrative': NarrativeArchetype,
    'Beacon': BeaconArchetype,
    'Slide': SlideArchetype,
    'Canvas': CanvasArchetype,
    'Deck': DeckArchetype,
    // Modern Tech Aesthetics
    'Bento': BentoArchetype,
    'Glass': GlassArchetype,
    'Liquid': LiquidArchetype,
    'Terminal': TerminalArchetype,
    'Neon': NeonArchetype,
    'Aurora': AuroraArchetype,
    'Mesh': MeshArchetype,
    'Pulse': PulseArchetype,
    'Circuit': CircuitArchetype,
    'Hologram': HologramArchetype,
    // Design Movements
    'Memphis': MemphisArchetype,
    'Deco': DecoArchetype,
    'Retro': RetroArchetype,
    'Neue': NeueArchetype,
    'Clay': ClayArchetype,
    'Pop': PopArchetype,
    'Mod': ModArchetype,
    'Gothic': GothicArchetype,
    'Rococo': RococoArchetype,
    'Stark': StarkArchetype,
    // Natural/Organic
    'Terra': TerraArchetype,
    'Forest': ForestArchetype,
    'Stone': StoneArchetype,
    'Bloom': BloomArchetype,
    'Desert': DesertArchetype,
    'Frost': FrostArchetype,
    'Ember': EmberArchetype,
    'Mist': MistArchetype,
    'Grain': GrainArchetype,
    'Mineral': MineralArchetype,
    // Cultural/Regional
    'Tokyo': TokyoArchetype,
    'Seoul': SeoulArchetype,
    'Paris': ParisArchetype,
    'Milano': MilanoArchetype,
    'Brooklyn': BrooklynArchetype,
    'Nordic': NordicArchetype,
    'Havana': HavanaArchetype,
    'Marrakech': MarrakechArchetype,
    'Kyoto': KyotoArchetype,
    'Vienna': ViennaArchetype
};

export const WABI_SABI_LAYOUT_NAMES = Object.keys(ARCHETYPE_RENDERERS);

// --- MAIN CONTROLLER COMPONENT ---

export const WabiSabiStage: React.FC<WabiSabiStageProps> = ({ slide, theme, onUpdateSlide, printMode, layoutStyle }) => {
    // Idempotent RNG: Fixed seed per slide ID guarantees same random layout on every render frame
    // This stops the "dancing layout" issue completely.
    // Handle both numeric seeds and string variants
    const seed = typeof slide.layoutVariant === 'number' ? slide.layoutVariant : slide.id.charCodeAt(0);
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

    // Typographic inversion: controlled by slide setting instead of random
    if (archetype === 'Typographic' && slide.layoutVariant === 'inverted') {
         const temp = contrast.bg;
         contrast.bg = contrast.text;
         contrast.text = temp;
    }

    // Apply WCAG contrast safety - ensures text is always readable
    const safeContrast = ensureContrast(contrast);

    const Renderer = ARCHETYPE_RENDERERS[archetype] || SwissArchetype;

    return (
        <div className="w-full h-full relative group/stage">
            <Renderer slide={slide} theme={theme} contrast={safeContrast} rng={rng} onUpdateSlide={onUpdateSlide} readOnly={printMode} />
            {!printMode && onUpdateSlide && (
                <LayoutToolbar slide={slide} onUpdateSlide={onUpdateSlide} mode="wabi-sabi" />
            )}
        </div>
    );
};
