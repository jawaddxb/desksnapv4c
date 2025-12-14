
import React, { useState } from 'react';
import { Presentation, Theme } from '@/types';
import { Sparkles, Play, Home, Loader2, Cloud, Copy, Palette } from 'lucide-react';
import { ExportMenu } from './export';
import { UserMenu } from './auth';
import { RemixDialog } from './RemixDialog';
import { StylePanel } from './shared/StylePanel';

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
    const [isStylePanelOpen, setIsStylePanelOpen] = useState(false);
    const [isRemixDialogOpen, setIsRemixDialogOpen] = useState(false);

    return (
        <header className="h-16 border-b border-white/8 flex items-center px-6 justify-between bg-[#0d0d0d] sticky top-0 z-[500]">
            {/* Left side - Logo/Navigation */}
            <div className="flex items-center gap-4 min-w-0">
                {currentPresentation ? (
                    <>
                        {/* Home button */}
                        <button
                            onClick={onClose}
                            className="p-2 rounded hover:bg-white/5 transition-colors duration-150 text-white/50 hover:text-white"
                            title="Back to Dashboard"
                        >
                            <Home className="w-5 h-5" />
                        </button>

                        {/* Divider */}
                        <div className="h-5 w-px bg-white/10" />

                        {/* Presentation title */}
                        <h2 className="text-base font-medium text-white truncate max-w-md">
                            {currentPresentation.topic}
                        </h2>

                        {/* Save status */}
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded text-xs">
                            {saveStatus === 'saving' ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin text-white/40" />
                                    <span className="text-white/40">Saving</span>
                                </>
                            ) : saveStatus === 'saved' ? (
                                <>
                                    <Cloud className="w-3 h-3 text-[#c5a47e]" />
                                    <span className="text-[#c5a47e]">Saved</span>
                                </>
                            ) : (
                                <span className="text-white/30">Ready</span>
                            )}
                        </div>
                    </>
                ) : (
                    /* Logo when no presentation */
                    <button
                        onClick={onClose}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-150"
                        title="Go to Dashboard"
                    >
                        <div className="w-8 h-8 bg-[#c5a47e] text-black flex items-center justify-center rounded">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h1 className="text-lg font-semibold text-white">DeckSnap</h1>
                    </button>
                )}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-2">
                {currentPresentation && (
                    <>
                        {/* Style button - opens consolidated panel */}
                        <button
                            onClick={() => setIsStylePanelOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#171717] border border-white/10 rounded text-sm text-white/70 hover:text-white hover:border-[#c5a47e]/30 transition-all duration-150"
                        >
                            <Palette className="w-4 h-4" />
                            <span className="hidden sm:inline">Style</span>
                            <span className="hidden md:inline text-white/40">·</span>
                            <span className="hidden md:inline text-white/50 text-xs">{activeTheme.name}</span>
                        </button>

                        {/* Divider */}
                        <div className="h-5 w-px bg-white/10 mx-1" />

                        {/* Action buttons */}
                        <div className="flex items-center gap-1">
                            {/* Present button */}
                            <button
                                onClick={() => setIsPresenting(true)}
                                className="p-2.5 rounded text-white/50 hover:text-[#c5a47e] hover:bg-white/5 transition-colors duration-150"
                                title="Start Presentation"
                            >
                                <Play className="w-5 h-5" />
                            </button>

                            {/* Clone button */}
                            {onClone && (
                                <button
                                    onClick={onClone}
                                    className="p-2.5 rounded text-white/50 hover:text-[#c5a47e] hover:bg-white/5 transition-colors duration-150"
                                    title="Clone Deck"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                            )}

                            {/* Export menu */}
                            <ExportMenu
                                presentation={currentPresentation}
                                theme={activeTheme}
                                viewMode={viewMode}
                                wabiSabiLayout={activeWabiSabiLayout}
                                onExportJSON={onExportDeck}
                            />
                        </div>

                        {/* Remix button - prominent action */}
                        <button
                            onClick={() => setIsRemixDialogOpen(true)}
                            className="ml-2 px-4 py-2 bg-[#c5a47e] text-black text-sm font-medium rounded hover:bg-[#d4b68e] transition-colors duration-150"
                        >
                            Remix All
                        </button>

                        {/* Style Panel */}
                        <StylePanel
                            isOpen={isStylePanelOpen}
                            onClose={() => setIsStylePanelOpen(false)}
                            activeTheme={activeTheme}
                            viewMode={viewMode}
                            activeWabiSabiLayout={activeWabiSabiLayout}
                            onApplyTheme={onApplyTheme}
                            onApplyTypography={onApplyTypography}
                            onSetViewMode={setViewMode}
                            onSetWabiSabiLayout={onSetWabiSabiLayout}
                            onRegenerateAllImages={onRegenerateAllImages}
                        />

                        {/* Remix Dialog */}
                        <RemixDialog
                            isOpen={isRemixDialogOpen}
                            onClose={() => setIsRemixDialogOpen(false)}
                            currentThemeId={activeTheme.id}
                            onConfirm={(newThemeId) => onRemixDeck(newThemeId)}
                        />
                    </>
                )}

                {/* Divider before user menu */}
                <div className="h-5 w-px bg-white/10 mx-2" />

                {/* User Menu - Always visible */}
                <UserMenu onLoginClick={onLoginClick || (() => {})} />
            </div>
        </header>
    );
};
