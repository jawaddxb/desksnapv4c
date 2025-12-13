/**
 * Ideation Migration Service
 *
 * Migrates existing ideation sessions from IndexedDB to the backend API.
 * This is a one-time migration that runs when the user first authenticates.
 *
 * The migration:
 * 1. Checks if migration has already been completed
 * 2. Reads all ideation sessions from IndexedDB
 * 3. Creates them in the backend API
 * 4. Marks migration as complete in localStorage
 *
 * KISS: Simple, one-way migration with clear error handling.
 */

import { getIdeationSessions as getLocalIdeations } from '../storageService';
import { createIdeationSession } from '../api/ideationService';
import { IdeationSession } from '@/types/ideation';

// Migration version key - increment if migration logic changes
const MIGRATION_KEY = 'ideation_migrated_v1';
const MIGRATION_IN_PROGRESS_KEY = 'ideation_migration_in_progress';

/**
 * Migration result for tracking what happened
 */
export interface MigrationResult {
  migrated: number;
  failed: number;
  skipped: number;
  errors: Array<{ sessionId: string; topic: string; error: string }>;
}

/**
 * Check if migration has already been completed
 */
export function isMigrationComplete(): boolean {
  return localStorage.getItem(MIGRATION_KEY) === 'true';
}

/**
 * Check if migration is currently in progress
 */
export function isMigrationInProgress(): boolean {
  return localStorage.getItem(MIGRATION_IN_PROGRESS_KEY) === 'true';
}

/**
 * Mark migration as complete
 */
function markMigrationComplete(): void {
  localStorage.setItem(MIGRATION_KEY, 'true');
  localStorage.removeItem(MIGRATION_IN_PROGRESS_KEY);
}

/**
 * Mark migration as in progress
 */
function markMigrationInProgress(): void {
  localStorage.setItem(MIGRATION_IN_PROGRESS_KEY, 'true');
}

/**
 * Clear migration in progress flag
 */
function clearMigrationInProgress(): void {
  localStorage.removeItem(MIGRATION_IN_PROGRESS_KEY);
}

/**
 * Migrate a single ideation session to the backend
 */
async function migrateSingleSession(session: IdeationSession): Promise<boolean> {
  try {
    // Create in backend (createIdeationSession handles conversion internally)
    await createIdeationSession(session);

    console.log(`[Migration] Successfully migrated ideation: ${session.topic} (${session.id})`);
    return true;
  } catch (error) {
    console.error(`[Migration] Failed to migrate ideation: ${session.topic} (${session.id})`, error);
    return false;
  }
}

/**
 * Main migration function
 *
 * Migrates all ideation sessions from IndexedDB to the backend API.
 * Safe to call multiple times - will skip if already migrated.
 *
 * @param onProgress - Optional callback for progress updates
 * @returns Migration result with counts and any errors
 */
export async function migrateIdeationSessions(
  onProgress?: (current: number, total: number) => void
): Promise<MigrationResult> {
  // Check if already migrated
  if (isMigrationComplete()) {
    console.log('[Migration] Ideation migration already complete, skipping');
    return { migrated: 0, failed: 0, skipped: 0, errors: [] };
  }

  // Check if migration is in progress (prevent concurrent migrations)
  if (isMigrationInProgress()) {
    console.log('[Migration] Ideation migration already in progress, skipping');
    return { migrated: 0, failed: 0, skipped: 0, errors: [] };
  }

  const result: MigrationResult = {
    migrated: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  };

  try {
    markMigrationInProgress();

    // Get all local ideation sessions
    const localSessions = await getLocalIdeations();

    if (localSessions.length === 0) {
      console.log('[Migration] No local ideation sessions to migrate');
      markMigrationComplete();
      return result;
    }

    console.log(`[Migration] Found ${localSessions.length} ideation sessions to migrate`);

    // Migrate each session
    for (let i = 0; i < localSessions.length; i++) {
      const session = localSessions[i];

      // Report progress
      if (onProgress) {
        onProgress(i + 1, localSessions.length);
      }

      // Skip empty or invalid sessions
      if (!session.id || !session.topic) {
        console.log(`[Migration] Skipping invalid session at index ${i}`);
        result.skipped++;
        continue;
      }

      // Attempt migration
      const success = await migrateSingleSession(session);

      if (success) {
        result.migrated++;
      } else {
        result.failed++;
        result.errors.push({
          sessionId: session.id,
          topic: session.topic,
          error: 'Failed to migrate to backend',
        });
      }

      // Small delay between migrations to avoid overwhelming the API
      if (i < localSessions.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Mark as complete even if some failed (user can manually address failures)
    markMigrationComplete();

    console.log(`[Migration] Complete. Migrated: ${result.migrated}, Failed: ${result.failed}, Skipped: ${result.skipped}`);

    return result;
  } catch (error) {
    console.error('[Migration] Critical error during migration:', error);
    clearMigrationInProgress();
    throw error;
  }
}

/**
 * Reset migration status (for debugging/testing)
 * WARNING: This will cause all sessions to be migrated again on next auth
 */
export function resetMigrationStatus(): void {
  localStorage.removeItem(MIGRATION_KEY);
  localStorage.removeItem(MIGRATION_IN_PROGRESS_KEY);
  console.log('[Migration] Migration status reset');
}

/**
 * Get migration status info (for debugging)
 */
export function getMigrationStatus(): {
  isComplete: boolean;
  isInProgress: boolean;
  migrationKey: string;
} {
  return {
    isComplete: isMigrationComplete(),
    isInProgress: isMigrationInProgress(),
    migrationKey: MIGRATION_KEY,
  };
}

export default {
  migrateIdeationSessions,
  isMigrationComplete,
  isMigrationInProgress,
  resetMigrationStatus,
  getMigrationStatus,
};
