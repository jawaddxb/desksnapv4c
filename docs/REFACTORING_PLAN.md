# Comprehensive KISS, SOLID, DRY Refactoring Plan

**Created**: 2025-12-13
**Status**: Ready for Implementation
**Target Score Improvement**: 6.5/10 → 8.5/10

---

## Executive Summary

This document outlines a comprehensive refactoring plan to improve code quality by addressing KISS (Keep It Simple), SOLID principles, and DRY (Don't Repeat Yourself) violations identified through a multi-agent deep analysis of the codebase.

### Key Metrics

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| KISS Score | 5.5/10 | 8/10 | +2.5 |
| SOLID Score | 6.5/10 | 8.5/10 | +2.0 |
| DRY Score | 5/10 | 8/10 | +3.0 |
| **Overall** | **6.5/10** | **8.5/10** | **+2.0** |

### Impact Summary

| Metric | Before | After |
|--------|--------|-------|
| App.tsx lines | 835 | ~150 |
| useDeck.ts lines | 653 | ~250 |
| useIdeation.ts lines | 625 | ~200 |
| copilotAgent.ts lines | 914 | ~250 |
| Archetype files | 119 | ~25 |
| Dead code files | 3+ | 0 |
| Total lines reduced | — | ~5,000+ |

---

## Violations Summary Table

| # | File | Violation | Severity | Phase |
|---|------|-----------|----------|-------|
| 1 | `contexts/DeckContext.tsx` | Dead code | - | 1 |
| 2 | `hooks/presentation/useDeckCRUD.ts` | Dead code | - | 1 |
| 3 | `downloadBlob` (2 files) | Duplicate | HIGH | 5 |
| 4 | `services/copilotAgent.ts` (914 lines) | God service | HIGH | 6 |
| 5 | `hooks/useIdeation.ts` (625 lines) | God hook | HIGH | 6 |
| 6 | `lib/themes.ts` | Deprecated import | HIGH | 6 |
| 7 | `services/grokService.ts` (490 lines) | Mixed concerns | MEDIUM | 6 |
| 8 | `services/agents/roughDraftAgent.ts` (704 lines) | Large agent | MEDIUM | 6 |
| 9 | `WABI_SABI_LAYOUT_NAMES` | Architectural smell | MEDIUM | 6 |
| 10 | `hooks/useDeck.ts` (653 lines) | God hook | HIGH | 3 |
| 11 | `App.tsx` (835 lines) | God component | HIGH | 4 |
| 12 | Archetypes (119 files) | DRY | HIGH | 2 |

---

## Phase 1: Delete Dead Code (Quick Win)

**Goal**: Remove unused code immediately to reduce confusion.
**Effort**: ~30 minutes

### Files to Delete

| File | Reason | Lines Saved |
|------|--------|-------------|
| `contexts/DeckContext.tsx` | Never imported anywhere (grep confirms 0 usages) | 192 |
| `hooks/presentation/useDeckCRUD.ts` | Exported but never imported; duplicates useDeck logic | 235 |

### Files to Update After Deletion

- `contexts/index.ts` - Remove DeckContext exports (line 24)
- `hooks/presentation/index.ts` - Remove useDeckCRUD export (line 31-32)

### Verification Steps

```bash
# Confirm no imports before deletion
grep -r "DeckContext" --include="*.tsx" --include="*.ts" .
grep -r "useDeckCRUD" --include="*.tsx" --include="*.ts" .
```

---

## Phase 2: Data-Drive Archetypes (Major DRY Fix)

**Goal**: Convert 119 archetype component files into data-driven configurations.
**Effort**: 4-6 hours
**Risk**: HIGH (119 files)

### Current State

- **119 files** in `components/archetypes/*/`
- All follow identical pattern with `ArchetypeProps`
- Only differences: colors, positioning, SVG decorations
- Factory function `createArchetype()` already exists at `components/archetypes/createArchetype.tsx`
- Partial config implementation at `components/archetypes/configs/corporateConfigs.ts` (4 archetypes)

### Implementation Strategy

#### Step 1: Categorize archetypes by complexity

```
SIMPLE (80%): Direct config → createArchetype()
  - Fixed colors with rng.pick variations
  - Standard split/full layouts
  - Basic decorations (dots, lines)

COMPLEX (15%): Config with custom render escapes
  - SVG pattern generation (Kintsugi, Neon)
  - Custom overlays and blending

UNIQUE (5%): Keep as components, use registerCustomArchetype()
  - Animation-heavy
  - Complex data-driven (MetricArchetype)
```

#### Step 2: Create config files by category

```
components/archetypes/configs/
├── corporateConfigs.ts    (10 archetypes) - 3 done, 7 to add
├── techConfigs.ts         (13 archetypes)
├── naturalConfigs.ts      (10 archetypes)
├── wabiSabiConfigs.ts     (10 archetypes)
├── editorialConfigs.ts    (6 archetypes)
├── culturalConfigs.ts     (16 archetypes)
├── designMovementConfigs.ts (8 archetypes)
├── atmosphericConfigs.ts  (6 archetypes)
├── typographyConfigs.ts   (5 archetypes)
├── cinematicConfigs.ts    (4 archetypes)
├── futureConfigs.ts       (3 archetypes)
├── historicalConfigs.ts   (4 archetypes)
├── contemporaryConfigs.ts (5 archetypes)
├── artisanalConfigs.ts    (tbd)
└── index.ts              (exports all)
```

#### Step 3: Create generated components

```typescript
// components/archetypes/generated/corporate.ts
import { createArchetype } from '../createArchetype';
import { beaconConfig, keynoteConfig, ... } from '../configs/corporateConfigs';

export const BeaconArchetype = createArchetype(beaconConfig);
export const KeynoteArchetype = createArchetype(keynoteConfig);
// ...
```

#### Step 4: Keep 5-10 complex archetypes as custom components

```
components/archetypes/custom/
├── CyberpunkArchetype.tsx   (animation-heavy)
├── MetricArchetype.tsx      (data-driven)
├── GlitchArchetype.tsx      (complex effects)
└── index.ts
```

#### Step 5: Update master index

```typescript
// components/archetypes/index.ts
export * from './generated/corporate';
export * from './generated/tech';
// ...
export * from './custom';
```

### Files Modified

- `components/archetypes/configs/*.ts` - Add ~100 config objects
- `components/archetypes/generated/*.ts` - Create ~15 files
- `components/archetypes/custom/*.tsx` - Keep ~10 complex ones
- `components/archetypes/index.ts` - Update exports

### Files Deleted

- ~100 individual `*Archetype.tsx` files that become configs

**Lines saved**: ~2,500+

---

## Phase 3: Split useDeck.ts (KISS/SRP Fix)

**Goal**: Reduce 653-line god hook to focused ~250-line orchestrator.
**Effort**: 2-3 hours
**Risk**: MEDIUM (must maintain return shape)

### Current Responsibilities in useDeck.ts

1. Server state (queries)
2. Real-time sync (WebSocket)
3. Local UI state (theme, layout, viewMode)
4. CRUD operations
5. Auto-save debouncing
6. Slide operations (composed)
7. Image generation (composed)
8. Content refinement (composed)

### New Hook Structure

```
hooks/
├── useDeck.ts                      (~250 lines) - Orchestrator only
├── presentation/
│   ├── useDeckUIState.ts           (~150 lines) NEW
│   ├── useDeckSyncState.ts         (~100 lines) NEW
│   ├── useSlideUpdater.ts          (existing)
│   ├── useImageGeneration.ts       (existing)
│   ├── useContentRefinement.ts     (existing)
│   └── index.ts                    (update exports)
```

### useDeckUIState.ts (NEW)

```typescript
export function useDeckUIState(options: {
  presentation: Presentation | null;
  presentationId: string | null;
  updateMutation: UseMutationResult<...>;
}) {
  const [activeTheme, setActiveTheme] = useState<Theme>(THEMES.neoBrutalist);
  const [activeWabiSabiLayout, setActiveWabiSabiLayout] = useState('Editorial');
  const [viewMode, setViewMode] = useState<ViewMode>('standard');
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');

  // Auto-save effect (debounced)
  useEffect(() => { /* existing auto-save logic */ }, [...]);

  return {
    activeTheme, setActiveTheme,
    activeWabiSabiLayout, setActiveWabiSabiLayout,
    viewMode, setViewMode,
    saveStatus,
    actions: {
      applyTheme,
      applyTypography,
      setWabiSabiLayout,
      cycleWabiSabiLayout,
      updateVisualStyleAndRegenerateImages,
    }
  };
}
```

### useDeckSyncState.ts (NEW)

```typescript
export function useDeckSyncState(options: {
  fetchedPresentation: Presentation | null;
  uiState: ReturnType<typeof useDeckUIState>;
}) {
  const [localPresentation, setLocalPresentation] = useState<Presentation | null>(null);

  // Merge fetched → local with image preservation
  useEffect(() => { /* existing merge logic */ }, [fetchedPresentation]);

  // Hydrate UI state from fetched presentation
  useEffect(() => { /* existing hydration logic */ }, [fetchedPresentation]);

  return { localPresentation, setLocalPresentation };
}
```

### Simplified useDeck.ts

```typescript
export function useDeck() {
  // 1. Query state
  const { savedDecks } = useSavedDecks();
  const [currentPresentationId, setCurrentPresentationId] = useState<string | null>(null);
  const { data: fetchedPresentation } = usePresentation(currentPresentationId);

  // 2. Mutations
  const createMutation = useCreatePresentation();
  const updateMutation = useUpdatePresentation();
  // ...

  // 3. UI State (composed)
  const uiState = useDeckUIState({ ... });

  // 4. Sync State (composed)
  const { localPresentation, setLocalPresentation } = useDeckSyncState({ ... });

  // 5. Real-time
  const realtimeSync = usePresentationSubscription(currentPresentationId);

  // 6. Operations (composed)
  const slideUpdater = useSlideUpdater({ ... });
  const imageGen = useImageGeneration({ ... });
  const contentRefinement = useContentRefinement({ ... });

  // 7. CRUD handlers (inline, ~100 lines)
  const createDeck = async (...) => { ... };
  // ...

  return { /* existing return shape */ };
}
```

### Files Modified

- `hooks/useDeck.ts` - Refactor to orchestrator
- `hooks/presentation/index.ts` - Add new exports

### Files Created

- `hooks/presentation/useDeckUIState.ts`
- `hooks/presentation/useDeckSyncState.ts`

---

## Phase 4: Split App.tsx (KISS/SRP Fix)

**Goal**: Reduce 835-line god component to focused ~200-line orchestrator.
**Effort**: 2-3 hours
**Risk**: LOW (only default export used)

### Current State Analysis

- 22 useState hooks
- 10+ custom hooks
- 21 handler functions
- 45+ props to MainStage
- 30+ props to AppSidebar

### New Component Structure

```
src/
├── App.tsx                    (~150 lines) - Routes + Providers only
├── AppContent.tsx             (~200 lines) - Reduced orchestrator
├── coordinators/
│   ├── DeckViewCoordinator.tsx    (~300 lines) - Deck editing
│   ├── ChatCoordinator.tsx        (~150 lines) - Chat modal + state
│   ├── PresentationModeCoordinator.tsx (~100 lines) - Presenting overlay
│   └── index.ts
└── contexts/
    └── ChatUIContext.tsx          (~80 lines) NEW - Chat state
```

### ChatUIContext.tsx (NEW)

```typescript
interface ChatUIState {
  inputValue: string;
  setInputValue: (v: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (v: boolean) => void;
  selectedImageStyle: ImageStyle;
  setSelectedImageStyle: (s: ImageStyle) => void;
  generationMode: GenerationMode;
  setGenerationMode: (m: GenerationMode) => void;
  enableDraftPreview: boolean;
  setEnableDraftPreview: (v: boolean) => void;
}

export const ChatUIProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [inputValue, setInputValue] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  // ... rest of state

  return (
    <ChatUIContext.Provider value={{ ... }}>
      {children}
    </ChatUIContext.Provider>
  );
};

export const useChatUI = () => useContext(ChatUIContext);
```

### DeckViewCoordinator.tsx

```typescript
export function DeckViewCoordinator() {
  // Workspace mode
  const { isPresenting, startPresenting, stopPresenting } = useWorkspaceMode();

  // Deck state
  const {
    currentPresentation, savedDecks, activeSlideIndex, setActiveSlideIndex,
    isGenerating, isRefining, activeTheme, activeWabiSabiLayout,
    viewMode, setViewMode, saveStatus, actions
  } = useDeck();

  // Data fetching
  const { savedIdeations } = useSavedIdeations();
  const { savedRoughDrafts } = useSavedRoughDrafts();

  // Archetype dialog state
  const [archetypeDialog, setArchetypeDialog] = useState({ isOpen: false, ... });

  // Handlers for deck operations
  const handleSetWabiSabiLayout = useCallback(...);
  const handleArchetypeChangeConfirm = useCallback(...);

  return (
    <>
      <AppHeader ... />
      <AppSidebar ... />
      <MainStage ... />
      <ArchetypeChangeDialog ... />
    </>
  );
}
```

### Simplified AppContent.tsx

```typescript
export function AppContent() {
  const { isIdeation, isRoughDraft, isBeautify, isSources, isPresenting } = useWorkspaceMode();
  const { isFirstTimeUser, markWelcomeSeen } = useOnboarding();
  const { currentPresentation } = useDeck();

  // Overlay workspaces
  if (isIdeation || isRoughDraft || isBeautify || isSources) {
    return <WorkspaceRenderer ... />;
  }

  return (
    <ChatUIProvider>
      <div className="flex h-screen ...">
        {isPresenting ? (
          <PresentationModeCoordinator />
        ) : (
          <DeckViewCoordinator />
        )}
        <ChatCoordinator />
      </div>
      {isFirstTimeUser && <WelcomeModal ... />}
    </ChatUIProvider>
  );
}
```

### Files Modified

- `App.tsx` - Simplify to routes + providers
- `contexts/index.ts` - Add ChatUIContext export

### Files Created

- `AppContent.tsx` (split from App.tsx)
- `coordinators/DeckViewCoordinator.tsx`
- `coordinators/ChatCoordinator.tsx`
- `coordinators/PresentationModeCoordinator.tsx`
- `coordinators/index.ts`
- `contexts/ChatUIContext.tsx`

---

## Phase 5: Additional DRY Fixes

### 5.1 Consolidate Content Refinement Functions

**File**: `services/contentRefinementService.ts`

```typescript
// BEFORE: Two near-identical functions
export const refineSlideContent = async (title, content, tone) => { ... };
export const refineSlideContentByType = async (title, content, refinementType) => { ... };

// AFTER: Single generic function
export const refineContent = async (
  title: string,
  content: string[],
  instruction: string,
  role: string
): Promise<ContentRefinementResult> => { ... };

// Convenience wrappers
export const refineSlideContent = (title, content, tone) =>
  refineContent(title, content, TONE_INSTRUCTIONS[tone], 'copywriter');

export const refineSlideContentByType = (title, content, type) =>
  refineContent(title, content, CONTENT_REFINEMENT_INSTRUCTIONS[type], 'optimizer');
```

### 5.2 Create Layout Registry (OCP Fix)

**File**: `lib/layoutRegistry.ts`

```typescript
const layoutRegistry = new Map<LayoutType, React.FC<LayoutProps>>();

export function registerLayout(type: LayoutType, component: React.FC<LayoutProps>) {
  layoutRegistry.set(type, component);
}

export function getLayout(type: LayoutType): React.FC<LayoutProps> {
  return layoutRegistry.get(type) || layoutRegistry.get('split')!;
}

// Initialize
registerLayout('split', SplitLayout);
registerLayout('full-bleed', FullBleedLayout);
// ...
```

**Update MainStage.tsx**:

```typescript
// BEFORE
const LayoutComponent = {
  'split': SplitLayout,
  'full-bleed': FullBleedLayout,
}[slide.layoutType] || SplitLayout;

// AFTER
const LayoutComponent = getLayout(slide.layoutType);
```

---

## Phase 6: Additional Violations (Deep Analysis Findings)

**Goal**: Address violations discovered during comprehensive code audit.

### 6.1 Split copilotAgent.ts (914 lines) - God Service

**File**: `services/copilotAgent.ts`
**Violation**: SOLID-SRP, KISS
**Severity**: HIGH
**Effort**: 2 hours

Contains 4+ distinct responsibilities:

- Agent loop logic (`runAgentLoop`)
- Session-to-deck conversion (`convertSessionToDeckPlan`)
- Theme suggestion logic (`suggestThemeForSession`)
- Journal entry creation (`createJournalEntry`)
- Research execution (`performResearch`)

**Split into**:

```
services/
├── copilotAgent.ts           (~250 lines) - Core agent loop only
├── copilot/
│   ├── deckConversion.ts     (~150 lines) - Session to deck plan
│   ├── themeSuggestion.ts    (~100 lines) - Theme recommendations
│   ├── journalHelpers.ts     (~80 lines) - Journal entry utilities
│   └── index.ts
```

### 6.2 Split useIdeation.ts (625 lines) - God Hook

**File**: `hooks/useIdeation.ts`
**Violation**: SOLID-SRP, KISS
**Severity**: HIGH
**Effort**: 2 hours

Manages 8+ areas:

- Session CRUD
- Note operations
- Connection operations
- Message operations
- Stage operations
- Journal operations
- Presentation linking
- Tool execution (12+ case branches)

**Split into**:

```
hooks/
├── useIdeation.ts                  (~200 lines) - Orchestrator
├── ideation/
│   ├── useIdeationSession.ts       (~100 lines) - Session CRUD
│   ├── useIdeationNotes.ts         (~150 lines) - Note operations
│   ├── useIdeationConnections.ts   (~80 lines) - Connection operations
│   ├── useIdeationTools.ts         (~200 lines) - Tool executor
│   └── index.ts
```

### 6.3 Split grokService.ts (490 lines) - Mixed Concerns

**File**: `services/grokService.ts`
**Violation**: SOLID-SRP
**Severity**: MEDIUM
**Effort**: 1 hour

Contains:

- API communication
- URL/source extraction utilities
- Sentiment detection
- Mind map construction
- Response parsing

**Split into**:

```
services/
├── grokService.ts        (~150 lines) - API client only
├── grok/
│   ├── grokParser.ts     (~150 lines) - Response parsing
│   ├── textAnalysis.ts   (~100 lines) - Sentiment, metrics, URL extraction
│   └── index.ts
```

### 6.4 Split roughDraftAgent.ts (704 lines)

**File**: `services/agents/roughDraftAgent.ts`
**Violation**: SOLID-SRP
**Severity**: MEDIUM
**Effort**: 1 hour

Apply similar decomposition as copilotAgent.ts.

### 6.5 Migrate Deprecated lib/themes.ts Imports

**File**: `lib/themes.ts` (deprecated re-export)
**Violation**: KISS (technical debt)
**Severity**: HIGH
**Effort**: 1 hour

10 files still import from deprecated location:

- `components/Dashboard.tsx`
- `hooks/useDeck.ts`
- `components/AppHeader.tsx`
- `components/AppSidebar.tsx`
- `contexts/DeckContext.tsx`
- `contexts/ChatContext.tsx`
- `components/RemixDialog.tsx`
- `components/ChatInterface.tsx`
- `components/WabiSabiComponents.tsx`
- `components/SlideList.tsx`

**Fix**: Update all imports to use `config/` directly, then delete `lib/themes.ts`.

### 6.6 Deduplicate downloadBlob Function

**Files**:

- `services/pptExportStrategies.ts` (line 482)
- `services/thumbnailService.ts` (line 88)

**Violation**: DRY
**Severity**: HIGH
**Effort**: 15 minutes

Both files define identical `downloadBlob` function.

**Fix**: Extract to `lib/fileUtils.ts`:

```typescript
// lib/fileUtils.ts
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
```

### 6.7 Audit/Delete PresentationContext.tsx

**File**: `contexts/PresentationContext.tsx`
**Status**: Potentially dead code (legacy)

Grep for `usePresentationContext` imports. If none found, delete alongside DeckContext.tsx.

### 6.8 Extract WABI_SABI_LAYOUT_NAMES to Constants

**Current Location**: `components/WabiSabiStage.tsx` (line 203)
**Problem**: Creates hooks→components dependency (architectural smell)

Imported by:

- `hooks/useDeck.ts`
- `hooks/presentation/useThemeManager.ts`
- `components/ThumbnailGenerator.tsx`

**Fix**: Move to `config/layoutConstants.ts`:

```typescript
// config/layoutConstants.ts
export const WABI_SABI_LAYOUT_NAMES = [
  'Editorial', 'Constructivist', 'Beacon', /* ... */
] as const;
```

---

## Risk Assessment

| Item | Risk Level | Notes |
|------|------------|-------|
| Delete DeckContext.tsx | LOW | Truly dead code |
| Delete useDeckCRUD.ts | LOW | Dead code |
| Split useDeck.ts | MEDIUM | Must maintain return shape |
| Split App.tsx | LOW | Only default export used |
| Convert archetypes to configs | **HIGH** | 119 files, only 4 migrated |
| Split copilotAgent.ts | MEDIUM | Internal service refactor |
| Split useIdeation.ts | MEDIUM | Similar to useDeck split |
| Migrate lib/themes.ts imports | LOW | Mechanical find-replace |

---

## Critical: No Test Coverage

**Finding**: The codebase has **zero tests** (no .test.ts, .spec.ts, or __tests__ directories).

**Impact**:

- No safety net for refactoring
- Breaking changes won't be detected automatically
- Manual testing required for all changes

### Recommended Safeguards

#### Feature Flags for Gradual Rollout

Add to `config/featureFlags.ts`:

```typescript
export interface FeatureFlags {
  // ... existing flags

  /** Use new coordinator-based architecture for App.tsx */
  useNewAppArchitecture: boolean;

  /** Use refactored useDeck hook split */
  useRefactoredUseDeck: boolean;

  /** Use archetype factory for all archetypes */
  useArchetypeFactory: boolean;
}
```

This enables:

- Instant rollback without code deploy
- A/B testing for internal users
- Gradual migration: developers → beta → all users

---

## Edge Cases to Handle During Refactoring

### 1. Concurrent Image Generation + Slide Editing

**Risk**: Race condition on state updates
**Safeguard**: Use immutable update patterns with slide IDs as keys

### 2. WebSocket Disconnect Mid-Save

**Risk**: Client doesn't know if save succeeded
**Safeguard**: Queue failed operations for retry on reconnect

### 3. Auto-Save on Navigation Away

**Risk**: Timeout clears, changes lost
**Safeguard**: Use `navigator.sendBeacon` for guaranteed save on close

### 4. Workspace Mode + Modal Conflicts

**Risk**: Modal remains open when workspace changes
**Safeguard**: Auto-close modals on workspace mode change

### 5. Archetype RNG Consistency

**Risk**: Layout changes if slide.id format changes
**Safeguard**: Document seed stability requirements

---

## Execution Order

**Preferences**:

- Archetypes: Full migration (all 119 at once)
- Dead code: Delete immediately (no deprecation)
- Execution: All phases sequentially

### Recommended Order

1. **Phase 1**: Delete dead code (DeckContext.tsx, useDeckCRUD.ts) - 30 min
2. **Phase 6.5**: Migrate lib/themes.ts imports (10 files) - 1 hour
3. **Phase 6.6**: Deduplicate downloadBlob - 15 min
4. **Phase 6.8**: Extract WABI_SABI_LAYOUT_NAMES to constants - 30 min
5. **Phase 5.1-5.2**: Quick DRY fixes (content refinement, layout registry) - 1 hour
6. **Phase 3**: Split useDeck.ts - 2-3 hours
7. **Phase 6.2**: Split useIdeation.ts - 2 hours
8. **Phase 4**: Split App.tsx - 2-3 hours
9. **Phase 6.1**: Split copilotAgent.ts - 2 hours
10. **Phase 6.3-6.4**: Split grokService.ts, roughDraftAgent.ts - 2 hours
11. **Phase 2**: Data-drive all archetypes - 4-6 hours

**Enable feature flags** before Phases 3, 4, and 2 for safe rollback.

---

## Critical Files Reference

### Files to Delete

- `contexts/DeckContext.tsx`
- `hooks/presentation/useDeckCRUD.ts`
- `lib/themes.ts` (after migration)

### Files to Create

- `hooks/presentation/useDeckUIState.ts`
- `hooks/presentation/useDeckSyncState.ts`
- `hooks/ideation/useIdeationSession.ts`
- `hooks/ideation/useIdeationNotes.ts`
- `hooks/ideation/useIdeationConnections.ts`
- `hooks/ideation/useIdeationTools.ts`
- `coordinators/DeckViewCoordinator.tsx`
- `coordinators/ChatCoordinator.tsx`
- `coordinators/PresentationModeCoordinator.tsx`
- `contexts/ChatUIContext.tsx`
- `lib/layoutRegistry.ts`
- `lib/fileUtils.ts`
- `config/layoutConstants.ts`
- `services/copilot/deckConversion.ts`
- `services/copilot/themeSuggestion.ts`
- `services/copilot/journalHelpers.ts`
- `services/grok/grokParser.ts`
- `services/grok/textAnalysis.ts`
- `components/archetypes/configs/*.ts` (multiple)
- `components/archetypes/generated/*.ts` (multiple)

### Files to Significantly Modify

- `App.tsx` - Split into AppContent + coordinators
- `hooks/useDeck.ts` - Refactor to orchestrator
- `hooks/useIdeation.ts` - Refactor to orchestrator
- `services/copilotAgent.ts` - Refactor to orchestrator
- `services/grokService.ts` - Refactor to API client only
- `services/contentRefinementService.ts` - Consolidate functions
- `components/MainStage.tsx` - Use layout registry
- `components/WabiSabiStage.tsx` - Import layout names from config
- `components/archetypes/index.ts` - Update exports
- `config/featureFlags.ts` - Add rollout flags

---

## Appendix: Deep Analysis Agent Findings

### Gap Analysis Agent

Found 12 additional violations not in original plan:

- 4 HIGH severity (god services/hooks)
- 5 MEDIUM severity (mixed concerns)
- 3 LOW severity (magic strings, fat interfaces)

### Dependency Analysis Agent

Confirmed:

- DeckContext.tsx - SAFE TO DELETE
- useDeckCRUD.ts - SAFE TO DELETE
- Archetype migration - HIGH RISK
- WABI_SABI_LAYOUT_NAMES - architectural smell

### Testing Agent

Found:

- Zero test coverage in codebase
- 5 edge cases requiring safeguards
- Feature flags recommended for gradual rollout
