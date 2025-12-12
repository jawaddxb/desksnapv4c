/**
 * PromptBuilder
 *
 * Fluent builder for constructing AI prompts.
 * Single responsibility: Assemble prompts in a consistent, extensible way.
 */

/**
 * Section of a prompt with optional priority.
 */
export interface PromptSection {
  /** Section content */
  content: string;
  /** Section label for debugging/logging */
  label?: string;
  /** Priority (higher = earlier in prompt) */
  priority?: number;
}

/**
 * Fluent builder for constructing prompts.
 *
 * @example
 * ```typescript
 * const prompt = new PromptBuilder()
 *   .addSection({ content: 'You are an expert designer.', label: 'role', priority: 100 })
 *   .addSection({ content: 'Create a slide about AI.', label: 'task' })
 *   .addConditional(hasContext, { content: context, label: 'context' })
 *   .build();
 * ```
 */
export class PromptBuilder {
  private sections: PromptSection[] = [];
  private separator: string = '\n\n';

  /**
   * Add a section to the prompt.
   */
  addSection(section: PromptSection): this {
    this.sections.push(section);
    return this;
  }

  /**
   * Add a section only if condition is true.
   */
  addConditional(condition: boolean, section: PromptSection): this {
    if (condition) {
      this.sections.push(section);
    }
    return this;
  }

  /**
   * Add a section only if value is truthy.
   */
  addIfPresent<T>(value: T | null | undefined, sectionFn: (value: T) => PromptSection): this {
    if (value != null) {
      this.sections.push(sectionFn(value));
    }
    return this;
  }

  /**
   * Add multiple sections at once.
   */
  addSections(sections: PromptSection[]): this {
    this.sections.push(...sections);
    return this;
  }

  /**
   * Set the separator between sections.
   */
  setSeparator(separator: string): this {
    this.separator = separator;
    return this;
  }

  /**
   * Build the final prompt string.
   * Sections are sorted by priority (highest first) and joined.
   */
  build(): string {
    // Sort by priority (higher first), then by insertion order
    const sorted = [...this.sections].sort((a, b) => {
      const priorityA = a.priority ?? 0;
      const priorityB = b.priority ?? 0;
      return priorityB - priorityA;
    });

    return sorted
      .map(s => s.content.trim())
      .filter(content => content.length > 0)
      .join(this.separator);
  }

  /**
   * Get the sections for debugging.
   */
  getSections(): PromptSection[] {
    return [...this.sections];
  }

  /**
   * Create a copy of this builder.
   */
  clone(): PromptBuilder {
    const builder = new PromptBuilder();
    builder.sections = [...this.sections];
    builder.separator = this.separator;
    return builder;
  }
}

// ============================================
// Pre-built Prompt Sections
// ============================================

/**
 * Common prompt sections for reuse.
 */
export const PromptSections = {
  /**
   * JSON output instruction.
   */
  jsonOutput: (schemaHint?: string): PromptSection => ({
    content: schemaHint
      ? `Respond with valid JSON following this schema: ${schemaHint}`
      : 'Respond with valid JSON only. No markdown, no explanation.',
    label: 'format',
    priority: -10, // Low priority, goes at end
  }),

  /**
   * Image generation anti-text guard.
   */
  noTextInImage: (): PromptSection => ({
    content: 'CRITICAL: Do not include ANY text, words, letters, numbers, brand names, logos, watermarks, URLs, or typography of any kind in the image. The image must be completely free of readable text or branding.',
    label: 'anti-text',
    priority: 90,
  }),

  /**
   * Quality enhancement for images.
   */
  imageQuality: (): PromptSection => ({
    content: 'High quality, 8k, detailed, award winning, professional photography.',
    label: 'quality',
    priority: -5,
  }),

  /**
   * Topic context section.
   */
  topicContext: (topic: string): PromptSection => ({
    content: `TOPIC CONTEXT: ${topic}`,
    label: 'topic',
    priority: 80,
  }),

  /**
   * Visual style section.
   */
  visualStyle: (style: string): PromptSection => ({
    content: style,
    label: 'style',
    priority: 85,
  }),

  /**
   * Subject/content section.
   */
  subject: (subject: string): PromptSection => ({
    content: `SUBJECT: ${subject}`,
    label: 'subject',
    priority: 70,
  }),
};

// ============================================
// Utility Functions
// ============================================

/**
 * Build an image prompt using the standard structure.
 */
export function buildImagePrompt(options: {
  style: string;
  subject: string;
  topic?: string;
  noText?: boolean;
}): string {
  const builder = new PromptBuilder()
    .addSection(PromptSections.visualStyle(options.style))
    .addIfPresent(options.topic, (topic) => PromptSections.topicContext(topic))
    .addSection(PromptSections.subject(options.subject))
    .addConditional(options.noText ?? true, PromptSections.noTextInImage())
    .addSection(PromptSections.imageQuality())
    .setSeparator(' . ');

  return builder.build();
}

/**
 * Build a content refinement prompt.
 */
export function buildContentPrompt(options: {
  instructions: string;
  content: string;
  context?: string;
  outputFormat?: 'json' | 'text';
}): string {
  const builder = new PromptBuilder()
    .addSection({
      content: options.instructions,
      label: 'instructions',
      priority: 100,
    })
    .addIfPresent(options.context, (ctx) => ({
      content: `CONTEXT: ${ctx}`,
      label: 'context',
      priority: 80,
    }))
    .addSection({
      content: `CONTENT TO PROCESS:\n"""${options.content}"""`,
      label: 'content',
      priority: 50,
    })
    .addConditional(
      options.outputFormat === 'json',
      PromptSections.jsonOutput()
    );

  return builder.build();
}
