/**
 * Image Prompt Agent
 *
 * An intelligent agent that validates and refines image prompts
 * to ensure they are contextually relevant to the presentation topic.
 *
 * The agent uses a loop:
 * 1. Validate the prompt against the topic
 * 2. If validation fails, rewrite the prompt
 * 3. Repeat until the prompt passes or max iterations reached
 */

import {
  AgentContext,
  AgentLog,
  AgentOptions,
  AgentResult,
  SlideAgentResult,
  ExtractKeywordsResult,
  PromptValidationResult,
} from './types';
import {
  validateImagePrompt,
  rewriteImagePrompt,
  extractTopicKeywords,
} from './tools';

// ============ Default Options ============

const DEFAULT_OPTIONS: Required<Omit<AgentOptions, 'onLog' | 'onSlideComplete'>> = {
  acceptanceThreshold: 70,
  maxIterations: 3,
  parallelValidation: true,
};

// ============ Agent Implementation ============

/**
 * Run the image prompt agent on a presentation context.
 *
 * For each slide:
 * 1. Validate the initial prompt
 * 2. If score < threshold, rewrite and re-validate
 * 3. Continue until accepted or max iterations
 *
 * @param context - The presentation context with topic, theme, and slides
 * @param options - Agent configuration options
 * @returns Refined prompts and logs
 */
export async function runImagePromptAgent(
  context: AgentContext,
  options: AgentOptions = {}
): Promise<AgentResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const startTime = Date.now();
  const allLogs: AgentLog[] = [];
  const refinedPrompts: string[] = [];
  let totalIterations = 0;
  let slidesRefined = 0;

  // Step 1: Extract topic keywords for context
  const keywordsStartTime = Date.now();
  let topicKeywords: ExtractKeywordsResult;

  try {
    topicKeywords = await extractTopicKeywords({ topic: context.topic });

    allLogs.push({
      slideIndex: -1, // -1 indicates global/setup operation
      iteration: 0,
      action: 'extract_keywords',
      input: context.topic,
      output: JSON.stringify(topicKeywords),
      reasoning: `Extracted ${topicKeywords.keywords.length} keywords, ${topicKeywords.visualSubjects.length} visual subjects`,
      timestamp: Date.now(),
      durationMs: Date.now() - keywordsStartTime,
    });

    opts.onLog?.(allLogs[allLogs.length - 1]);
  } catch (error) {
    console.warn('Failed to extract topic keywords:', error);
    topicKeywords = {
      keywords: context.topic.split(' ').filter(w => w.length > 3),
      visualSubjects: [],
      avoidTerms: [],
    };
  }

  // Step 2: Process each slide
  if (opts.parallelValidation) {
    // Run all slides in parallel for faster processing
    const results = await Promise.all(
      context.slides.map((slide) =>
        processSlide(slide, context, topicKeywords, opts)
      )
    );

    results.forEach((result) => {
      refinedPrompts.push(result.finalPrompt);
      allLogs.push(...result.logs);
      totalIterations += result.iterations;
      if (result.wasRefined) slidesRefined++;
      opts.onSlideComplete?.(result);
    });
  } else {
    // Process slides sequentially
    for (const slide of context.slides) {
      const result = await processSlide(slide, context, topicKeywords, opts);
      refinedPrompts.push(result.finalPrompt);
      allLogs.push(...result.logs);
      totalIterations += result.iterations;
      if (result.wasRefined) slidesRefined++;
      opts.onSlideComplete?.(result);
    }
  }

  // Sort logs by slide index and timestamp
  allLogs.sort((a, b) => {
    if (a.slideIndex !== b.slideIndex) return a.slideIndex - b.slideIndex;
    return a.timestamp - b.timestamp;
  });

  return {
    refinedPrompts,
    logs: allLogs,
    totalDurationMs: Date.now() - startTime,
    slidesRefined,
    totalIterations,
  };
}

/**
 * Process a single slide through the agent loop.
 */
async function processSlide(
  slide: AgentContext['slides'][0],
  context: AgentContext,
  topicKeywords: ExtractKeywordsResult,
  opts: Required<Omit<AgentOptions, 'onLog' | 'onSlideComplete'>> & AgentOptions
): Promise<SlideAgentResult> {
  const logs: AgentLog[] = [];
  let currentPrompt = slide.initialPrompt;
  let iteration = 0;
  let finalScore = 0;
  let wasRefined = false;

  while (iteration < opts.maxIterations) {
    const validateStartTime = Date.now();

    // Validate current prompt
    let validation: PromptValidationResult;
    try {
      validation = await validateImagePrompt({
        prompt: currentPrompt,
        topic: context.topic,
        slideTitle: slide.title,
        slideContent: slide.content,
      });
    } catch (error) {
      console.warn(`Validation failed for slide ${slide.index}:`, error);
      // If validation fails, assume prompt needs work
      validation = {
        isValid: false,
        score: 30,
        issues: ['Validation request failed'],
        suggestions: ['Try rewriting the prompt'],
      };
    }

    logs.push({
      slideIndex: slide.index,
      iteration,
      action: 'validate',
      input: currentPrompt,
      output: JSON.stringify(validation),
      reasoning: `Score: ${validation.score}/100`,
      timestamp: Date.now(),
      durationMs: Date.now() - validateStartTime,
    });

    opts.onLog?.(logs[logs.length - 1]);

    finalScore = validation.score;

    // Check if prompt passes
    if (validation.isValid && validation.score >= opts.acceptanceThreshold) {
      logs.push({
        slideIndex: slide.index,
        iteration,
        action: 'finalize',
        input: currentPrompt,
        output: currentPrompt,
        reasoning: `Accepted with score ${validation.score}/100`,
        timestamp: Date.now(),
        durationMs: 0,
      });

      opts.onLog?.(logs[logs.length - 1]);
      break;
    }

    // Prompt needs rewriting
    wasRefined = true;
    const rewriteStartTime = Date.now();

    try {
      const rewriteResult = await rewriteImagePrompt({
        originalPrompt: currentPrompt,
        topic: context.topic,
        issues: validation.issues,
        visualStyle: context.visualStyle,
        slideTitle: slide.title,
        slideContent: slide.content,
      });

      logs.push({
        slideIndex: slide.index,
        iteration,
        action: 'rewrite',
        input: currentPrompt,
        output: rewriteResult.newPrompt,
        reasoning: rewriteResult.reasoning,
        timestamp: Date.now(),
        durationMs: Date.now() - rewriteStartTime,
      });

      opts.onLog?.(logs[logs.length - 1]);

      currentPrompt = rewriteResult.newPrompt;
    } catch (error) {
      console.warn(`Rewrite failed for slide ${slide.index}:`, error);
      // If rewrite fails, keep current prompt and exit loop
      logs.push({
        slideIndex: slide.index,
        iteration,
        action: 'finalize',
        input: currentPrompt,
        output: currentPrompt,
        reasoning: `Rewrite failed, using current prompt`,
        timestamp: Date.now(),
        durationMs: Date.now() - rewriteStartTime,
      });

      opts.onLog?.(logs[logs.length - 1]);
      break;
    }

    iteration++;
  }

  // If we hit max iterations without finalizing, finalize now
  if (!logs.some(l => l.slideIndex === slide.index && l.action === 'finalize')) {
    logs.push({
      slideIndex: slide.index,
      iteration,
      action: 'finalize',
      input: currentPrompt,
      output: currentPrompt,
      reasoning: `Max iterations (${opts.maxIterations}) reached with score ${finalScore}/100`,
      timestamp: Date.now(),
      durationMs: 0,
    });

    opts.onLog?.(logs[logs.length - 1]);
  }

  return {
    slideIndex: slide.index,
    originalPrompt: slide.initialPrompt,
    finalPrompt: currentPrompt,
    iterations: iteration + 1,
    finalScore,
    wasRefined,
    logs,
  };
}

/**
 * Run agent on a single prompt (useful for regeneration).
 */
export async function refinePromptWithAgent(
  prompt: string,
  topic: string,
  visualStyle: string,
  slideTitle: string,
  slideContent: string[] = [],
  options: AgentOptions = {}
): Promise<{ finalPrompt: string; logs: AgentLog[] }> {
  const context: AgentContext = {
    topic,
    themeId: '',
    visualStyle,
    slides: [
      {
        index: 0,
        title: slideTitle,
        content: slideContent,
        initialPrompt: prompt,
      },
    ],
  };

  const result = await runImagePromptAgent(context, {
    ...options,
    parallelValidation: false,
  });

  return {
    finalPrompt: result.refinedPrompts[0],
    logs: result.logs,
  };
}
