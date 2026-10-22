/**
 * Review Code Prompt
 * Comprehensive code review for Optics compliance
 * Combines: validate_color_pairing, detect_redundant_css, validate_token_usage, calculate_contrast
 */

import { z } from 'zod';
import { readPromptFile } from '../../_internal/resource-path.js';

type ReviewCodePromptArgs = {
  code: string;
  componentType?: string;
};

export const inputSchema = {
  code: z.string().describe('CSS, HTML, or component code to review for Optics compliance'),
  componentType: z.string().optional().describe('Type of component being reviewed (e.g., "button", "card", "form")'),
};

export const metadata = {
  name: 'review-code',
  title: 'Review Code',
  description: 'Review code for Optics design system compliance. Checks color pairing, redundant CSS, token usage, and accessibility.',
  role: 'user',
};

export async function handler(args: ReviewCodePromptArgs): Promise<string> {
  const code = args.code || '';
  const componentType = args.componentType || 'component';

  if (!code.trim()) {
    return `# Code Review Error

No code provided for review.

## How to Use
Provide the CSS, HTML, or component code you want reviewed:

\`\`\`
review-code({
  code: "your code here",
  componentType: "button" // optional
})
\`\`\`

## What Gets Reviewed
- Color pairing compliance
- Redundant CSS patterns
- Hard-coded values that should use tokens
- Accessibility (contrast ratios)
- Correct Optics class usage`;
  }

  let promptTemplate = await readPromptFile('review-code-prompt.md');
  
  promptTemplate = promptTemplate
    .replace(/{{COMPONENT_TYPE}}/g, componentType)
    .replace(/{{CODE}}/g, code);

  return promptTemplate;
}
