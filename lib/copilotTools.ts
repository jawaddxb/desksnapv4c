/**
 * Copilot Tools
 *
 * Tool definitions for the agentic ideation copilot.
 * These are the actions the LLM can take during the ideation conversation.
 */

import type { FunctionDeclaration, SchemaType } from '@google/generative-ai';

/**
 * Tool definitions in Gemini function calling format
 */
export const COPILOT_TOOLS: FunctionDeclaration[] = [
  {
    name: 'create_note',
    description: 'Create a new sticky note on the ideation canvas. Use this to add ideas, research findings, or suggestions to the flowchart.',
    parameters: {
      type: 'object' as SchemaType,
      properties: {
        content: {
          type: 'string' as SchemaType,
          description: 'The text content of the note. Keep it concise - 1-3 sentences max.',
        },
        column: {
          type: 'string' as SchemaType,
          enum: ['hook', 'problem', 'solution', 'proof', 'cta'],
          description: 'Which swimlane column to place the note in. Hook=attention grabber, Problem=pain points, Solution=your answer, Proof=evidence/trust, CTA=call to action.',
        },
        parentId: {
          type: 'string' as SchemaType,
          description: 'Optional ID of a parent note to connect this note from. Creates a visual flow arrow.',
        },
        color: {
          type: 'string' as SchemaType,
          enum: ['yellow', 'blue', 'green', 'pink', 'purple'],
          description: 'Note color. yellow=user ideas, blue=AI suggestions, green=research, pink=questions, purple=key insights. Default: blue for AI notes.',
        },
      },
      required: ['content', 'column'],
    },
  },
  {
    name: 'update_note',
    description: 'Edit the content of an existing note on the canvas.',
    parameters: {
      type: 'object' as SchemaType,
      properties: {
        noteId: {
          type: 'string' as SchemaType,
          description: 'The ID of the note to update.',
        },
        content: {
          type: 'string' as SchemaType,
          description: 'The new content for the note.',
        },
      },
      required: ['noteId', 'content'],
    },
  },
  {
    name: 'delete_note',
    description: 'Remove a note from the canvas. Use sparingly - only for clearly wrong or duplicate ideas.',
    parameters: {
      type: 'object' as SchemaType,
      properties: {
        noteId: {
          type: 'string' as SchemaType,
          description: 'The ID of the note to delete.',
        },
      },
      required: ['noteId'],
    },
  },
  {
    name: 'connect_notes',
    description: 'Draw a connector arrow between two notes to show flow or relationship.',
    parameters: {
      type: 'object' as SchemaType,
      properties: {
        fromId: {
          type: 'string' as SchemaType,
          description: 'ID of the source note (arrow starts here).',
        },
        toId: {
          type: 'string' as SchemaType,
          description: 'ID of the target note (arrow points here).',
        },
      },
      required: ['fromId', 'toId'],
    },
  },
  {
    name: 'move_note',
    description: 'Move a note to a different swimlane column or position.',
    parameters: {
      type: 'object' as SchemaType,
      properties: {
        noteId: {
          type: 'string' as SchemaType,
          description: 'The ID of the note to move.',
        },
        column: {
          type: 'string' as SchemaType,
          enum: ['hook', 'problem', 'solution', 'proof', 'cta'],
          description: 'Target swimlane column.',
        },
        row: {
          type: 'number' as SchemaType,
          description: 'Target row position within the column (0 = top).',
        },
      },
      required: ['noteId', 'column', 'row'],
    },
  },
  {
    name: 'research',
    description: 'Search the web for information, statistics, or examples related to the topic. Results will be added as research notes.',
    parameters: {
      type: 'object' as SchemaType,
      properties: {
        query: {
          type: 'string' as SchemaType,
          description: 'The search query. Be specific - include year, industry, or metric type for better results.',
        },
        purpose: {
          type: 'string' as SchemaType,
          description: 'Brief explanation of why this research is needed and how it will help the presentation.',
        },
      },
      required: ['query', 'purpose'],
    },
  },
  {
    name: 'ask_user',
    description: 'Ask the user a clarifying question. Use this to gather important information about their goals, audience, or preferences.',
    parameters: {
      type: 'object' as SchemaType,
      properties: {
        question: {
          type: 'string' as SchemaType,
          description: 'The question to ask the user. Be conversational and specific.',
        },
        options: {
          type: 'array' as SchemaType,
          items: { type: 'string' as SchemaType },
          description: 'Optional array of suggested answer options. Include 2-4 options if the question has common answers.',
        },
      },
      required: ['question'],
    },
  },
  {
    name: 'suggest_structure',
    description: 'Propose a narrative structure for organizing the notes into a presentation flow.',
    parameters: {
      type: 'object' as SchemaType,
      properties: {
        structure: {
          type: 'array' as SchemaType,
          items: { type: 'string' as SchemaType },
          description: 'Array of section names in presentation order, e.g. ["Hook", "Problem", "Solution", "Demo", "Pricing", "CTA"]',
        },
        rationale: {
          type: 'string' as SchemaType,
          description: 'Brief explanation of why this structure fits the content and audience.',
        },
      },
      required: ['structure', 'rationale'],
    },
  },
  {
    name: 'mark_ready',
    description: 'Signal that the ideation is complete and the deck plan is ready to build. Only call this when the user approves the structure.',
    parameters: {
      type: 'object' as SchemaType,
      properties: {
        summary: {
          type: 'string' as SchemaType,
          description: 'A brief summary of the deck plan - topic, slide count, key sections.',
        },
      },
      required: ['summary'],
    },
  },
];

/**
 * Get tool by name
 */
export function getToolByName(name: string): FunctionDeclaration | undefined {
  return COPILOT_TOOLS.find(t => t.name === name);
}

/**
 * Tool names for type safety
 */
export type CopilotToolName =
  | 'create_note'
  | 'update_note'
  | 'delete_note'
  | 'connect_notes'
  | 'move_note'
  | 'research'
  | 'ask_user'
  | 'suggest_structure'
  | 'mark_ready';
