/**
 * API Services
 *
 * Central export for all API-related functionality.
 */

export * from './apiClient';
export * from './authService';
export * from './presentationService';
export * from './ideationService';
export * from './versionService';

export { default as authService } from './authService';
export { default as presentationService } from './presentationService';
export { default as ideationService } from './ideationService';
export { default as versionService } from './versionService';

// Re-export migration service for convenience
export * from '../migration/ideationMigration';
