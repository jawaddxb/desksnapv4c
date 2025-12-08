
import React, { useState } from 'react';
import { Presentation, Theme } from '../types';
import { THEMES } from '../lib/themes';
import { WABI_SABI_LAYOUT_NAMES } from './WabiSabiStage';
import { CURATED_FONT_PAIRINGS } from '../lib/fonts';
import { Component, Sparkles, Palette, ChevronDown, Check, Play, Download, Printer, Shuffle, LayoutTemplate, Type, Search, Home, Save, RefreshCw, Loader2, Cloud, Share2 } from 'lucide-react';
import { generatePPT } from '../services/pptService';

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
    onRemixDeck: () => void;
    setIsPresenting: (v: boolean) => void;
    onSave?: () => void;
    onClose?: () => void;
    onShuffleLayout?: () => void;
    onExportDeck?: () => void;
    saveStatus?: 'idle' | 'saving' | 'saved';
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
            <div className="absolute top-full right-0 mt-4 w-[400px] bg-white border border-zinc-200 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                <div className="flex border-b border-zinc-100">
                    <button onClick={() => setActiveTab('curated')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'curated' ? 'bg-white text-zinc-900 border-b-2 border-zinc-900' : 'bg-zinc-50 text-zinc-400'}`}>Recommended</button>
                    <button onClick={() => setActiveTab('custom')} className={`flex-1 py-3 text-xs font-bold uppercase tracking-widest transition-colors ${activeTab === 'custom' ? 'bg-white text-zinc-900 border-b-2 border-zinc-900' : 'bg-zinc-50 text-zinc-400'}`}>Custom</button>
                </div>

                <div className="p-4 max-h-[60vh] overflow-y-auto">
                    {activeTab === 'curated' ? (
                        <div className="space-y-2">
                            {CURATED_FONT_PAIRINGS.map(pair => (
                                <button key={pair.id} onClick={() => onApply(pair.heading, pair.body)} className="w-full text-left p-3 hover:bg-zinc-50 rounded-lg border border-transparent hover:border-zinc-200 group transition-all">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-bold text-zinc-900">{pair.name}</span>
                                        {activeTheme.fonts.heading.includes(pair.heading) && <Check className="w-3 h-3 text-zinc-900" />}
                                    </div>
                                    <div className="text-2xl mb-1" style={{ fontFamily: pair.heading }}>{pair.heading}</div>
                                    <div className="text-sm text-zinc-500 mb-2" style={{ fontFamily: pair.body }}>The quick brown fox jumps over the lazy dog.</div>
                                    <div className="text-[10px] text-zinc-400 uppercase tracking-wide">{pair.heading} + {pair.body}</div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6 p-2">
                             <div className="p-4 bg-zinc-50 rounded-lg border border-zinc-200 text-xs text-zinc-500 leading-relaxed">
                                Enter the exact name of any Google Font (e.g., "Lobster", "Open Sans"). We will dynamically load it for you.
                             </div>
                             <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Heading Font</label>
                                <div className="relative">
                                    <input type="text" value={cHead} onChange={e => setCHead(e.target.value)} placeholder="e.g. Playfair Display" className="w-full p-3 bg-white border border-zinc-200 rounded-md text-sm font-bold outline-none focus:border-zinc-900" />
                                    <Search className="absolute right-3 top-3 w-4 h-4 text-zinc-300" />
                                </div>
                             </div>
                             <div>
                                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2 block">Body Font</label>
                                <div className="relative">
                                    <input type="text" value={cBody} onChange={e => setCBody(e.target.value)} placeholder="e.g. Lato" className="w-full p-3 bg-white border border-zinc-200 rounded-md text-sm font-bold outline-none focus:border-zinc-900" />
                                    <Search className="absolute right-3 top-3 w-4 h-4 text-zinc-300" />
                                </div>
                             </div>
                             <button disabled={!cHead || !cBody} onClick={() => onApply(cHead, cBody)} className="w-full py-3 bg-zinc-900 text-white font-bold uppercase tracking-widest text-xs rounded-md disabled:opacity-50 hover:bg-zinc-800 transition-all">
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
    onShuffleLayout,
    onExportDeck,
    saveStatus = 'idle'
}) => {
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const [isLayoutMenuOpen, setIsLayoutMenuOpen] = useState(false);
    const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);

    const handleExportPPT = async () => {
        if (!currentPresentation) return;
        try { await generatePPT(currentPresentation, activeTheme); } 
        catch (e) { alert("Could not export PPT. Please ensure the library is loaded."); }
    };

    return (
        <header className="h-20 min-h-[80px] border-b border-zinc-200 flex items-center px-8 justify-between bg-white sticky top-0 z-[500]">
            <div className="flex items-center gap-4 min-w-0">
                {currentPresentation ? (
                    <>
                        <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-md transition-colors text-zinc-500 hover:text-zinc-900" title="Back to Library">
                            <Home className="w-5 h-5" />
                        </button>
                        <h2 className="text-xl text-zinc-900 font-bold truncate max-w-xl">{currentPresentation.topic}</h2>
                        
                        {/* Auto-Save Status Indicator */}
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-50 border border-zinc-100">
                             {saveStatus === 'saving' ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Saving...</span>
                                </>
                             ) : saveStatus === 'saved' ? (
                                <>
                                    <Cloud className="w-3 h-3 text-green-500" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-500">Saved</span>
                                </>
                             ) : (
                                <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-300">Ready</span>
                             )}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                         <div className="w-8 h-8 bg-zinc-900 text-white flex items-center justify-center rounded-lg"><Sparkles className="w-4 h-4" /></div>
                         <h1 className="text-xl font-bold text-zinc-900">DeckSnap</h1>
                    </div>
                )}
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
                {currentPresentation && (
                    <>
                         <div className="h-6 w-px bg-zinc-200 mx-2" />

                        {/* View Mode Switcher */}
                        <div className="flex items-center bg-zinc-100 p-1 rounded-lg border border-zinc-200 mr-2">
                            <button onClick={() => setViewMode('standard')} className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${viewMode === 'standard' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}><Component className="w-3.5 h-3.5" /> Structure</button>
                            <button onClick={() => setViewMode('wabi-sabi')} className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all ${viewMode === 'wabi-sabi' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-900'}`}><Sparkles className="w-3.5 h-3.5" /> Wabi-Sabi</button>
                        </div>
                        
                        {/* Wabi-Sabi Layout Selector */}
                        {viewMode === 'wabi-sabi' && (
                             <div className="flex items-center gap-1">
                                <div className="relative">
                                    <button onClick={() => setIsLayoutMenuOpen(!isLayoutMenuOpen)} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white text-xs font-bold uppercase tracking-widest border border-zinc-900 hover:bg-zinc-800 transition-all rounded-md shadow-sm">
                                        <LayoutTemplate className="w-4 h-4" strokeWidth={2.5} />
                                        <span className="hidden md:inline">{activeWabiSabiLayout}</span>
                                        <ChevronDown className="w-3 h-3 ml-1" />
                                    </button>
                                    {isLayoutMenuOpen && (
                                        <>
                                        <div className="fixed inset-0 z-40" onClick={() => setIsLayoutMenuOpen(false)} />
                                        <div className="absolute top-full right-0 mt-4 w-56 bg-white border border-zinc-200 shadow-xl rounded-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                            <div className="p-2 flex flex-col gap-1 max-h-[60vh] overflow-y-auto">
                                                {WABI_SABI_LAYOUT_NAMES.map(layout => (
                                                    <button key={layout} onClick={() => { onSetWabiSabiLayout(layout); setIsLayoutMenuOpen(false); }} className={`px-3 py-2 text-left text-xs font-bold uppercase tracking-widest rounded-md transition-colors ${activeWabiSabiLayout === layout ? 'bg-zinc-100 text-zinc-900' : 'hover:bg-zinc-50 text-zinc-500'}`}>
                                                        {layout}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        </>
                                    )}
                                </div>
                                <button onClick={onShuffleLayout} className="p-2 hover:bg-zinc-100 text-zinc-600 rounded-md transition-colors border border-transparent hover:border-zinc-200" title="Re-roll Layouts">
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                             </div>
                        )}

                         {/* Typography Selector (Visible in Wabi-Sabi) */}
                         {viewMode === 'wabi-sabi' && onApplyTypography && (
                             <div className="relative">
                                <button onClick={() => setIsFontMenuOpen(!isFontMenuOpen)} className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 text-xs font-bold uppercase tracking-widest border border-zinc-200 hover:border-zinc-400 transition-all rounded-md">
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
                            <button onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)} className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-900 text-xs font-bold uppercase tracking-widest border border-zinc-200 hover:border-zinc-400 transition-all rounded-md">
                                <Palette className="w-4 h-4" strokeWidth={2.5} /><span className="hidden md:inline">{activeTheme.name}</span><ChevronDown className="w-3 h-3 ml-1" />
                            </button>
                            {isThemeMenuOpen && (
                                <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsThemeMenuOpen(false)} />
                                <div className="absolute top-full right-0 mt-4 w-[600px] bg-white border border-zinc-200 shadow-2xl rounded-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                    <div className="p-4 grid grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
                                        {Object.values(THEMES).map(theme => (
                                            <button key={theme.id} onClick={() => onApplyTheme(theme.id)} className={`group relative flex flex-col items-start text-left rounded-xl transition-all duration-200 p-1 ${activeTheme.id === theme.id ? 'bg-zinc-100 ring-1 ring-zinc-200' : 'hover:bg-zinc-50'}`}>
                                                <div className="w-full h-32 rounded-lg mb-3 relative overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-[1.01] flex flex-col p-4" style={{ background: theme.colors.background, border: `${theme.layout.borderWidth} solid ${theme.colors.border}`, borderRadius: theme.layout.radius }}>
                                                    <div className="relative z-10 mt-auto"><div className="text-2xl leading-none mb-2" style={{ fontFamily: theme.fonts.heading, color: theme.colors.text }}>Aa</div></div>
                                                    {activeTheme.id === theme.id && <div className="absolute top-3 right-3 w-6 h-6 bg-zinc-900 text-white rounded-full flex items-center justify-center shadow-md z-20"><Check className="w-3.5 h-3.5" strokeWidth={3} /></div>}
                                                </div>
                                                <div className="px-2 pb-2 w-full"><span className="text-sm font-bold text-zinc-900">{theme.name}</span></div>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex gap-2">
                                        <button onClick={() => { onRegenerateAllImages(); setIsThemeMenuOpen(false); }} className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-white border border-zinc-200 shadow-sm rounded-lg hover:bg-zinc-50 font-bold uppercase text-xs tracking-widest transition-all text-zinc-900"><Sparkles className="w-3.5 h-3.5 text-purple-600" />Apply Style to Visuals</button>
                                    </div>
                                </div>
                                </>
                            )}
                        </div>
                        
                        <div className="h-6 w-px bg-zinc-200 mx-2" />
                        
                        <div className="flex items-center gap-1">
                            <button onClick={() => setIsPresenting(true)} className="p-2 hover:bg-zinc-200 text-zinc-600 rounded-md transition-colors" title="Start Presentation (Rehearsal Mode)"><Play className="w-5 h-5" /></button>
                            <button onClick={handleExportPPT} className="p-2 hover:bg-zinc-200 text-zinc-600 rounded-md transition-colors" title="Export PPTX"><Download className="w-5 h-5" /></button>
                            <button onClick={onExportDeck} className="p-2 hover:bg-zinc-200 text-zinc-600 rounded-md transition-colors" title="Share Deck (JSON)"><Share2 className="w-5 h-5" /></button>
                        </div>

                        {/* Remix Button - Context Aware */}
                        <button onClick={onRemixDeck} className="ml-2 flex items-center gap-2 px-5 py-2 bg-white text-zinc-900 text-xs font-bold uppercase tracking-widest border border-zinc-200 hover:border-zinc-400 hover:text-indigo-600 transition-all rounded-md">
                            <Shuffle className="w-4 h-4" strokeWidth={2.5} />
                            {'Remix All'}
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};
