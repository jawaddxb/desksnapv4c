
import React, { useState } from 'react';
import { Presentation, Theme } from '@/types';
import { Sparkles, Play, Home, Loader2, Cloud, Copy, Palette, Smartphone, QrCode, ChevronDown } from 'lucide-react';
import { ExportMenu } from './export';
import { UserMenu } from './auth';
import { RemixDialog } from './RemixDialog';
import { StylePanel } from './shared/StylePanel';
import { QRCodeModal } from './mobile';

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
    setIsMobilePresenting?: () => void;
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
    setIsMobilePresenting,
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
    const [isQRModalOpen, setIsQRModalOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <header className="h-16 border-b border-[#D4E5D4] flex items-center px-6 justify-between bg-white sticky top-0 z-[500]">
            {/* Left side - Logo/Navigation */}
            <div className="flex items-center gap-4 min-w-0">
                {currentPresentation ? (
                    <>
                        {/* Home button */}
                        <button
                            onClick={onClose}
                            className="p-2 rounded-md hover:bg-[#EDF5F0] transition-colors duration-150 text-[#8FA58F] hover:text-[#1E2E1E]"
                            title="Back to Dashboard"
                        >
                            <Home className="w-5 h-5" />
                        </button>

                        {/* Divider */}
                        <div className="h-5 w-px bg-[#D4E5D4]" />

                        {/* Presentation title */}
                        <h2 className="text-base font-medium text-[#1E2E1E] truncate max-w-md">
                            {currentPresentation.topic}
                        </h2>

                        {/* Save status */}
                        <div className="flex items-center gap-2 px-2.5 py-1 bg-[#EDF5F0] rounded-md text-xs">
                            {saveStatus === 'saving' ? (
                                <>
                                    <Loader2 className="w-3 h-3 animate-spin text-[#8FA58F]" />
                                    <span className="text-[#8FA58F]">Saving</span>
                                </>
                            ) : saveStatus === 'saved' ? (
                                <>
                                    <Cloud className="w-3 h-3 text-[#6B8E6B]" />
                                    <span className="text-[#6B8E6B]">Saved</span>
                                </>
                            ) : (
                                <span className="text-[#8FA58F]">Ready</span>
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
                        <div className="w-8 h-8 bg-[#6B8E6B] text-white flex items-center justify-center rounded-md">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <h1 className="text-lg font-semibold text-[#1E2E1E]">DeckSnap</h1>
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
                            className="flex items-center gap-2 px-4 py-2 bg-[#EDF5F0] border border-[#D4E5D4] rounded-md text-sm text-[#4A5D4A] hover:text-[#1E2E1E] hover:border-[#6B8E6B]/30 transition-all duration-150"
                        >
                            <Palette className="w-4 h-4" />
                            <span className="hidden sm:inline">Style</span>
                            <span className="hidden md:inline text-[#8FA58F]">·</span>
                            <span className="hidden md:inline text-[#8FA58F] text-xs">{activeTheme.name}</span>
                        </button>

                        {/* Divider */}
                        <div className="h-5 w-px bg-[#D4E5D4] mx-1" />

                        {/* Action buttons */}
                        <div className="flex items-center gap-1">
                            {/* Present button */}
                            <button
                                onClick={() => setIsPresenting(true)}
                                className="p-2.5 rounded-md text-[#8FA58F] hover:text-[#6B8E6B] hover:bg-[#EDF5F0] transition-colors duration-150"
                                title="Start Presentation"
                            >
                                <Play className="w-5 h-5" />
                            </button>

                            {/* Mobile menu button */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="flex items-center gap-1 p-2.5 rounded-md text-[#8FA58F] hover:text-[#6B8E6B] hover:bg-[#EDF5F0] transition-colors duration-150"
                                    title="Mobile options"
                                >
                                    <Smartphone className="w-5 h-5" />
                                    <ChevronDown className="w-3 h-3" />
                                </button>

                                {/* Mobile dropdown menu */}
                                {isMobileMenuOpen && (
                                    <>
                                        {/* Backdrop to close menu */}
                                        <div
                                            className="fixed inset-0 z-[600]"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        />
                                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#D4E5D4] rounded-lg shadow-lg z-[700] py-1">
                                            {/* Mobile Preview option */}
                                            {setIsMobilePresenting && (
                                                <button
                                                    onClick={() => {
                                                        setIsMobileMenuOpen(false);
                                                        setIsMobilePresenting?.();
                                                    }}
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#4A5D4A] hover:bg-[#EDF5F0] transition-colors"
                                                >
                                                    <Smartphone className="w-4 h-4" />
                                                    <span>Mobile Preview</span>
                                                </button>
                                            )}
                                            {/* Share QR Code option */}
                                            <button
                                                onClick={() => {
                                                    setIsMobileMenuOpen(false);
                                                    setIsQRModalOpen(true);
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#4A5D4A] hover:bg-[#EDF5F0] transition-colors"
                                            >
                                                <QrCode className="w-4 h-4" />
                                                <span>Share QR Code</span>
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Clone button */}
                            {onClone && (
                                <button
                                    onClick={onClone}
                                    className="p-2.5 rounded-md text-[#8FA58F] hover:text-[#6B8E6B] hover:bg-[#EDF5F0] transition-colors duration-150"
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
                            className="ml-2 px-4 py-2 bg-[#6B8E6B] text-white text-sm font-medium rounded-md hover:bg-[#5A7A5A] transition-colors duration-150"
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

                        {/* QR Code Modal for mobile sharing */}
                        <QRCodeModal
                            isOpen={isQRModalOpen}
                            onClose={() => setIsQRModalOpen(false)}
                            presentationId={currentPresentation.id}
                            presentationTitle={currentPresentation.topic}
                            theme={activeTheme}
                        />
                    </>
                )}

                {/* Divider before user menu */}
                <div className="h-5 w-px bg-[#D4E5D4] mx-2" />

                {/* User Menu - Always visible */}
                <UserMenu onLoginClick={onLoginClick || (() => {})} />
            </div>
        </header>
    );
};
