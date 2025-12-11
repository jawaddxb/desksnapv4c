
import React from 'react';
import { Slide, Theme, Presentation } from '../types';
import { PRNG } from '../lib/utils';
import { ArchetypeProps } from './WabiSabiComponents';
import { ensureContrast } from '../lib/contrast';
import { getArchetypeContrast, applyTypographicInversion } from '../lib/archetypeContrast';
import { LayoutToolbar } from './LayoutToolbar';
import { TextSelectionProvider, useTextSelection } from '../contexts/TextSelectionContext';
// Import archetypes from modular structure
// Fully extracted categories import from archetypes/
// Remaining categories are re-exported through archetypes/index.ts from legacy file
import {
    // Editorial (fully extracted)
    EditorialArchetype, TypographicArchetype, ZineArchetype, CollageArchetype, RisographArchetype, ReceiptArchetype,
    // Design Movements (partially extracted)
    ConstructivistArchetype, BauhausArchetype, PostModernArchetype, SwissArchetype, SwissGridArchetype,
    MemphisArchetype, DecoArchetype, RetroArchetype, NeueArchetype, PopArchetype, ModArchetype,
    GothicArchetype, RococoArchetype, StarkArchetype,
    // Tech
    BentoArchetype, GlassArchetype, LiquidArchetype, TerminalArchetype, NeonArchetype,
    AuroraArchetype, MeshArchetype, PulseArchetype, CircuitArchetype, HologramArchetype,
    CyberDeckArchetype, Y2KArchetype, VaporwaveArchetype,
    // Corporate
    VentureArchetype, KeynoteArchetype, GradientArchetype, SignalArchetype, MetricArchetype,
    NarrativeArchetype, BeaconArchetype, SlideArchetype, CanvasArchetype, DeckArchetype,
    // Wabi-Sabi
    KintsugiArchetype, HyggeArchetype, TerrazzoArchetype, KinfolkArchetype, MediterraneanArchetype,
    SumieArchetype, MonolithArchetype, HerbariumArchetype, CoastalArchetype, AtelierArchetype,
    // Natural/Organic
    TerraArchetype, ForestArchetype, StoneArchetype, BloomArchetype, DesertArchetype,
    FrostArchetype, EmberArchetype, MistArchetype, GrainArchetype, MineralArchetype,
    // Cultural/Regional
    TokyoArchetype, SeoulArchetype, ParisArchetype, MilanoArchetype, BrooklynArchetype,
    NordicArchetype, HavanaArchetype, MarrakechArchetype, KyotoArchetype, ViennaArchetype,
    // Cinematic
    CinematicArchetype, NoirArchetype, SchematicArchetype, BrutalistArchetype, ClayArchetype,
    // Cultural Heritage
    MughalArchetype, AnkaraArchetype, TalaveraArchetype, PersianArchetype, BatikArchetype,
    CelticArchetype, AztecArchetype, AboriginalArchetype,
    // Historical Period
    VictorianArchetype, DiscoArchetype, GrungeArchetype, AtomicArchetype, NouveauArchetype, TudorArchetype,
    // Artisanal Craft
    IndigoArchetype, CopperArchetype, RakuArchetype, WeaveArchetype, CeramicArchetype, PatinaArchetype,
    // Atmospheric/Mood
    DuskArchetype, MonsoonArchetype, TundraArchetype, SavannaArchetype, VolcanoArchetype, ReefArchetype,
    // Typography & Print
    BlackletterArchetype, NewsprintArchetype, LetterpressArchetype, StencilArchetype, WoodtypeArchetype,
    // Contemporary Art
    InstallationArchetype, GlitchArchetype, MixedMediaArchetype, InkArchetype, OxidizeArchetype,
    // Future/Speculative
    QuantumArchetype, BiotechArchetype, SolarpunkArchetype, VoidArchetype
} from './archetypes';

interface WabiSabiStageProps {
  slide: Slide;
  theme: Theme;
  onUpdateSlide?: (updates: Partial<Slide>) => void;
  printMode?: boolean;
  layoutStyle?: string;
  onToggleNotes?: () => void;
  // Image prompt editing
  presentation?: Presentation | null;
  onRegenerateImage?: () => void;
  onGenerateSuggestions?: () => Promise<string[]>;
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
    'Vienna': ViennaArchetype,
    // Cultural Heritage
    'Mughal': MughalArchetype,
    'Ankara': AnkaraArchetype,
    'Talavera': TalaveraArchetype,
    'Persian': PersianArchetype,
    'Batik': BatikArchetype,
    'Celtic': CelticArchetype,
    'Aztec': AztecArchetype,
    'Aboriginal': AboriginalArchetype,
    // Historical Period
    'Victorian': VictorianArchetype,
    'Disco': DiscoArchetype,
    'Grunge': GrungeArchetype,
    'Atomic': AtomicArchetype,
    'Nouveau': NouveauArchetype,
    'Tudor': TudorArchetype,
    // Artisanal Craft
    'Indigo': IndigoArchetype,
    'Copper': CopperArchetype,
    'Raku': RakuArchetype,
    'Weave': WeaveArchetype,
    'Ceramic': CeramicArchetype,
    'Patina': PatinaArchetype,
    // Atmospheric/Mood
    'Dusk': DuskArchetype,
    'Monsoon': MonsoonArchetype,
    'Tundra': TundraArchetype,
    'Savanna': SavannaArchetype,
    'Volcano': VolcanoArchetype,
    'Reef': ReefArchetype,
    // Typography & Print
    'Blackletter': BlackletterArchetype,
    'Newsprint': NewsprintArchetype,
    'Letterpress': LetterpressArchetype,
    'Stencil': StencilArchetype,
    'Woodtype': WoodtypeArchetype,
    // Contemporary Art
    'Installation': InstallationArchetype,
    'Glitch': GlitchArchetype,
    'MixedMedia': MixedMediaArchetype,
    'Ink': InkArchetype,
    'Oxidize': OxidizeArchetype,
    // Future/Speculative
    'Quantum': QuantumArchetype,
    'Biotech': BiotechArchetype,
    'Solarpunk': SolarpunkArchetype,
    'Void': VoidArchetype
};

export const WABI_SABI_LAYOUT_NAMES = Object.keys(ARCHETYPE_RENDERERS);

// --- INNER STAGE COMPONENT (uses selection context) ---

const WabiSabiStageInner: React.FC<WabiSabiStageProps> = ({ slide, theme, onUpdateSlide, printMode, layoutStyle, onToggleNotes, presentation, onRegenerateImage, onGenerateSuggestions }) => {
    const { clearSelection } = useTextSelection();

    // Guard against undefined slide
    if (!slide) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black text-white/20">
                <span className="text-sm">No slide data</span>
            </div>
        );
    }

    // Idempotent RNG: Fixed seed per slide ID guarantees same random layout on every render frame
    // This stops the "dancing layout" issue completely.
    // Handle both numeric seeds and string variants
    const seed = typeof slide.layoutVariant === 'number' ? slide.layoutVariant : slide.id.charCodeAt(0);
    const rng = new PRNG(seed.toString());

    const archetype = layoutStyle && ARCHETYPE_RENDERERS[layoutStyle] ? layoutStyle : 'Editorial';

    // Get contrast from centralized registry (handles CyberDeck, Receipt, Schematic, etc.)
    const baseContrast = getArchetypeContrast(archetype, theme);

    // Apply typographic inversion if needed
    const invertedContrast = applyTypographicInversion(baseContrast, archetype, slide.layoutVariant);

    // Apply WCAG contrast safety - ensures text is always readable
    const safeContrast = ensureContrast(invertedContrast);

    const Renderer = ARCHETYPE_RENDERERS[archetype] || SwissArchetype;

    // Clear selection when clicking anywhere that isn't a SmartText element
    const handleBackgroundClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        // Check if click is inside a SmartText element
        const isSmartText = target.closest('[data-smarttext]');
        if (!isSmartText) {
            clearSelection();
        }
    };

    return (
        <div className="w-full h-full relative group/stage" onClick={handleBackgroundClick}>
            <Renderer slide={slide} theme={theme} contrast={safeContrast} rng={rng} onUpdateSlide={onUpdateSlide} readOnly={printMode} />
            {!printMode && onUpdateSlide && (
                <LayoutToolbar
                    slide={slide}
                    onUpdateSlide={onUpdateSlide}
                    mode="wabi-sabi"
                    onToggleNotes={onToggleNotes}
                    presentation={presentation}
                    onRegenerateImage={onRegenerateImage}
                    onGenerateSuggestions={onGenerateSuggestions}
                />
            )}
        </div>
    );
};

// --- MAIN CONTROLLER COMPONENT (provides selection context) ---

export const WabiSabiStage: React.FC<WabiSabiStageProps> = (props) => {
    return (
        <TextSelectionProvider>
            <WabiSabiStageInner {...props} />
        </TextSelectionProvider>
    );
};
