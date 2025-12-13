
import React, { useState } from 'react';
import { Presentation, Theme } from '@/types';
import { THEMES } from '@/config/themes';
import { CURATED_FONT_PAIRINGS } from '@/lib/fonts';
import { isPptxSafe, getThemeCompatibility } from '@/lib/fontCompatibility';
import { Sparkles, Palette, ChevronDown, Check, Play, Shuffle, LayoutTemplate, Type, Search, Home, Loader2, Cloud, FileSpreadsheet, Copy } from 'lucide-react';
import { ExportMenu } from './export';
import { ModeSwitcher } from './ModeSwitcher';
import { ArchetypePicker } from './ArchetypePicker';
import { UserMenu } from './auth';
import { RemixDialog } from './RemixDialog';
import { ThemePicker } from './shared/ThemePicker';

interface AppHeaderProps {
    currentPresentation: Presentation | null;
    activeTheme: Theme;
    activeWabiSabiLayout: string;
    viewMode: 'standard' | 'wabi-sabi';
    setViewMode: (mode: 'standard' | 'wabi-sabi') => void;
    onApplyTheme: (themeId: string) => void;
    onApplyTypography?: (headingFont: string, bodyFont: string) => void;
    onSetWabiSabiLayout: (layout: string) => void;
    onCycleWabiSabiLayout: () => void;
    onRegenerateAllImages: () => void;
    onRemixDeck: (newThemeId?: string) => void;
    setIsPresenting: (v: boolean) => void;
    onSave?: () => void;
    onClose?: () => void;
    onClone?: () => void;
    onShuffleLayout?: () => void;
    onExportDeck?: () => void;
    saveStatus?: 'idle' | 'saving' | 'saved';
    onLoginClick?: () => void;
}

// Helper component for Font Menu
const FontMenu = ({
    isOpen,
    onClose,
    activeTheme,
    onApply
}: {
    isOpen: boolean;
    onClose: () => void;
    activeTheme: Theme;
    onApply: (h: string, b: string) => void;
}) => {
    const [activeTab, setActiveTab] = useState<'curated' | 'custom'>('curated');
    const [cHead, setCHead] = useState('');
    const [cBody, setCBody] = useState('');

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="absolute top-full right-0 mt-4 w-[400px] bg-[#111111] border border-white/20 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                <div className="flex border-b border-white/10">
                    <button onClick={() => setActiveTab('curated')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'curated' ? 'bg-[#111111] text-white border-b-2 border-[#c5a47e]' : 'bg-black text-white/40'}`}>Recommended</button>
                    <button onClick={() => setActiveTab('custom')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'custom' ? 'bg-[#111111] text-white border-b-2 border-[#c5a47e]' : 'bg-black text-white/40'}`}>Custom</button>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {activeTab === 'curated' ? (
                        <div className="space-y-2">
                            {CURATED_FONT_PAIRINGS.map(pair => (
                                <button key={pair.id} onClick={() => onApply(pair.heading, pair.body)} className="w-full text-left p-3 hover:bg-white/5 border border-transparent hover:border-white/20 group transition-all duration-150">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold text-white">{pair.name}</span>
                                        {activeTheme.fonts.heading.includes(pair.heading) && <Check className="w-3 h-3 text-[#c5a47e]" />}
                                    </div>
                                    <div className="text-2xl mb-1 text-white" style={{ fontFamily: pair.heading }}>{pair.heading}</div>
                                    <div className="text-sm text-white/60 mb-2" style={{ fontFamily: pair.body }}>The quick brown fox jumps over the lazy dog.</div>
                                    <div className="text-[10px] text-white/40 uppercase tracking-wide">{pair.heading} + {pair.body}</div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6 p-2">
                             <div className="p-4 bg-black border border-white/10 text-xs text-white/60 leading-relaxed">
                                Enter the exact name of any Google Font (e.g., "Lobster", "Open Sans"). We will dynamically load it for you.
                             </div>
                             <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">Heading Font</label>
                                <div className="relative">
                                    <input type="text" value={cHead} onChange={e => setCHead(e.target.value)} placeholder="e.g. Playfair Display" className="w-full p-3 bg-black border border-white/20 text-sm font-bold text-white outline-none focus:border-[#c5a47e] placeholder:text-white/30" />
                                    <Search className="absolute right-3 top-3 w-4 h-4 text-white/30" />
                                </div>
                             </div>
                             <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2 block">Body Font</label>
                                <div className="relative">
                                    <input type="text" value={cBody} onChange={e => setCBody(e.target.value)} placeholder="e.g. Lato" className="w-full p-3 bg-black border border-white/20 text-sm font-bold text-white outline-none focus:border-[#c5a47e] placeholder:text-white/30" />
                                    <Search className="absolute right-3 top-3 w-4 h-4 text-white/30" />
                                </div>
                             </div>
                             <button disabled={!cHead || !cBody} onClick={() => onApply(cHead, cBody)} className="w-full py-3 bg-[#c5a47e] text-black font-bold uppercase tracking-widest text-xs disabled:opacity-50 hover:bg-white transition-all duration-150">
                                Apply Custom Fonts
                             </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export const AppHeader: React.FC<AppHeaderProps> = ({
    currentPresentation,
    activeTheme,
    activeWabiSabiLayout,
    viewMode,
    setViewMode,
    onApplyTheme,
    onApplyTypography,
    onSetWabiSabiLayout,
    onCycleWabiSabiLayout,
    onRegenerateAllImages,
    onRemixDeck,
    setIsPresenting,
    onSave,
    onClose,
    onClone,
    onShuffleLayout,
    onExportDeck,
    saveStatus = 'idle',
    onLoginClick
}) => {
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
    const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);
    const [isRemixDialogOpen, setIsRemixDialogOpen] = useState(false);

    return (
        <header className="h-20 min-h-[80px] border-b border-white/10 flex items-center px-8 justify-between bg-black sticky top-0 z-[500]">
            <div className="flex items-center gap-4 min-w-0">
                {currentPresentation ? (
                    <>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 transition-colors duration-150 text-white/60 hover:text-white" title="Back to Library">
                            <Home className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl text-white font-bold truncate max-w-xl">{currentPresentation.topic}</h2>

                        {/* Auto-Save Status Indicator */}
                        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10">
                             {saveStatus === 'saving' ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin text-white/40" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Saving...</span>
                                </>
                             ) : saveStatus === 'saved' ? (
                                <>
                                    <Cloud className="w-3 h-3 text-[#c5a47e]" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#c5a47e]">Saved</span>
                                </>
                             ) : (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Ready</span>
                             )}
                        </div>
                    </>
                ) : (
                    <button onClick={onClose} className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-150" title="Go to Dashboard">
                         <div className="w-8 h-8 bg-white text-black flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
                         <h1 className="text-xl font-bold text-white">DeckSnap</h1>
                    </button>
                )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
                {currentPresentation && (
                    <>
                         <div className="h-6 w-px bg-white/10 mx-2" />

                        {/* View Mode Switcher */}
                        <ModeSwitcher viewMode={viewMode} setViewMode={setViewMode} />

                        {/* Organic Mode Archetype Selector */}
                        {viewMode === 'wabi-sabi' && (
                             <div className="flex items-center gap-1 ml-2">
                                <div className="relative">
                                    <button onClick={() => setIsLayoutMenuOpen(!isLayoutMenuOpen)} className="flex items-center gap-2 px-4 py-2 bg-[#c5a47e] text-black text-xs font-bold uppercase tracking-widest hover:bg-white transition-all duration-150">
                                        <LayoutTemplate className="w-4 h-4" strokeWidth={2.5} />
                                        <span className="hidden md:inline">{activeWabiSabiLayout}</span>
                                        <ChevronDown className="w-3 h-3 ml-1" />
                                    </button>
                                    <ArchetypePicker
                                        isOpen={isLayoutMenuOpen}
                                        onClose={() => setIsLayoutMenuOpen(false)}
                                        activeArchetype={activeWabiSabiLayout}
                                        onSelect={onSetWabiSabiLayout}
                                        onShuffle={onShuffleLayout || (() => {})}
                                    />
                                </div>
                             </div>
                        )}

                         {/* Typography Selector (Visible in both modes) */}
                         {onApplyTypography && (
                             <div className="relative">
                                <button onClick={() => setIsFontMenuOpen(!isFontMenuOpen)} className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest border border-white/20 hover:border-[#c5a47e] hover:text-[#c5a47e] transition-all duration-150">
                                    <Type className="w-4 h-4" strokeWidth={2.5} />
                                    <span className="hidden md:inline">Type</span>
                                    <ChevronDown className="w-3 h-3 ml-1" />
                                </button>
                                <FontMenu
                                    isOpen={isFontMenuOpen}
                                    onClose={() => setIsFontMenuOpen(false)}
                                    activeTheme={activeTheme}
                                    onApply={(h, b) => { onApplyTypography(h, b); setIsFontMenuOpen(false); }}
                                />
                             </div>
                         )}

                        {/* Standard Theme Selector */}
                        <div className="relative">
                            <button onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)} className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest border border-white/20 hover:border-[#c5a47e] hover:text-[#c5a47e] transition-all duration-150">
                                <Palette className="w-4 h-4" strokeWidth={2.5} />
                                <span className="hidden md:inline">{activeTheme.name}</span>
                                {isPptxSafe(activeTheme) && (
                                    <span className="hidden md:inline px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-bold uppercase tracking-wider">PPT</span>
                                )}
                                <ChevronDown className="w-3 h-3 ml-1" />
                            </button>
                            {isThemeMenuOpen && (
                                <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsThemeMenuOpen(false)} />
                                <div className="absolute top-full right-0 mt-4 w-[600px] bg-[#111111] border border-white/20 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                                    <div className="p-4">
                                        <ThemePicker
                                            selectedThemeId={activeTheme.id}
                                            onSelect={onApplyTheme}
                                            size="default"
                                            gap="default"
                                            maxHeight="60vh"
                                        />
                                    </div>
                                    <div className="p-4 border-t border-white/10 bg-black/50 flex gap-2">
                                        <button onClick={() => { onRegenerateAllImages(); setIsThemeMenuOpen(false); }} className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-[#c5a47e] text-black hover:bg-white font-bold uppercase text-xs tracking-widest transition-all duration-150"><Sparkles className="w-3.5 h-3.5" />Apply Style to Visuals</button>
                                    </div>
                                </div>
                                </>
                            )}
                        </div>

                        <div className="h-6 w-px bg-white/10 mx-2" />

                        <div className="flex items-center gap-2">
                            <button onClick={() => setIsPresenting(true)} className="p-2 hover:bg-white/10 text-white/60 hover:text-[#c5a47e] transition-colors duration-150" title="Start Presentation (Rehearsal Mode)"><Play className="w-5 h-5" /></button>
                            {onClone && (
                                <button onClick={onClone} className="p-2 hover:bg-white/10 text-white/60 hover:text-[#c5a47e] transition-colors duration-150" title="Clone Deck"><Copy className="w-5 h-5" /></button>
                            )}
                            <ExportMenu
                                presentation={currentPresentation}
                                theme={activeTheme}
                                viewMode={viewMode}
                                wabiSabiLayout={activeWabiSabiLayout}
                                onExportJSON={onExportDeck}
                            />
                        </div>

                        {/* Remix Button - Opens Dialog */}
                        <button onClick={() => setIsRemixDialogOpen(true)} className="ml-2 flex items-center gap-2 px-5 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-[#c5a47e] transition-all duration-150">
                            <Shuffle className="w-4 h-4" strokeWidth={2.5} />
                            {'Remix All'}
                        </button>

                        {/* Remix Dialog */}
                        <RemixDialog
                            isOpen={isRemixDialogOpen}
                            onClose={() => setIsRemixDialogOpen(false)}
                            currentThemeId={activeTheme.id}
                            onConfirm={(newThemeId) => onRemixDeck(newThemeId)}
                        />
                    </>
                )}

                {/* User Menu - Always visible */}
                <div className="h-6 w-px bg-white/10 mx-2" />
                <UserMenu onLoginClick={onLoginClick || (() => {})} />
            </div>
        </header>
    );
};
