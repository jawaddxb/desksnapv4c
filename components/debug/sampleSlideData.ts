/**
 * Sample Slide Data
 *
 * Generic slide content used for generating theme/archetype thumbnails.
 * Uses neutral content that works across all visual styles.
 */

import { Slide } from '../../types';

/**
 * Sample slide for thumbnail generation.
 * Contains generic content that looks good across all themes and archetypes.
 */
export const SAMPLE_SLIDE: Slide = {
  id: 'preview-sample',
  title: 'Presentation Title',
  content: [
    'Key insight or statement goes here',
    'Supporting detail with specific data',
    'Call to action or conclusion'
  ],
  speakerNotes: '',
  imagePrompt: '',
  imageUrl: '/placeholder-slide.svg',
  isImageLoading: false,
  layoutType: 'split',
  alignment: 'left',
  fontScale: 'auto',
  layoutVariant: 42, // Fixed seed for consistent random elements
};

/**
 * Alternative sample slides for variety in previews.
 */
export const SAMPLE_SLIDES = {
  /** Title slide style */
  title: {
    ...SAMPLE_SLIDE,
    id: 'preview-title',
    title: 'Vision for Tomorrow',
    content: [
      'Transforming ideas into reality',
      'Building the future, today'
    ],
    layoutType: 'statement' as const,
  },

  /** Content slide style */
  content: {
    ...SAMPLE_SLIDE,
    id: 'preview-content',
    title: 'Key Insights',
    content: [
      'First major point with supporting evidence',
      'Second important insight backed by data',
      'Third conclusion that drives action'
    ],
    layoutType: 'split' as const,
  },

  /** Data-focused slide style */
  data: {
    ...SAMPLE_SLIDE,
    id: 'preview-data',
    title: 'Growth Metrics',
    content: [
      '47% increase in engagement',
      '3.2x return on investment',
      '89% customer satisfaction'
    ],
    layoutType: 'gallery' as const,
  },
};

/**
 * Get sample slide for a specific purpose.
 */
export function getSampleSlide(variant: 'default' | 'title' | 'content' | 'data' = 'default'): Slide {
  if (variant === 'default') return SAMPLE_SLIDE;
  return SAMPLE_SLIDES[variant];
}
