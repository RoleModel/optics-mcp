import { z } from 'zod'
import { designTokens } from '../optics-data.js'
import { readPromptFile } from "../_internal/resource-path.js"

type GetTokenReferencePromptArgs = {
  category?: string
}

export const inputSchema = {
  category: z
    .string()
    .optional()
    .describe('Optional: Filter by category (spacing, typography, border, shadow, or leave empty for all)')
}

export const metadata = {
  name: "get-token-reference",
  title: "Get Token Reference",
  description: "Get complete list of all available Optics design tokens - USE THIS to prevent token name hallucination",
  role: "user"
}

export async function handler(args: GetTokenReferencePromptArgs) {
  let tokens = designTokens;
  let category = args.category;

  if (category) {
    tokens = designTokens.filter((t) => t.category === category);
  }

  // Group non-color tokens for clarity
  const spacing = tokens.filter(t => t.category === 'spacing');
  const typography = tokens.filter(t => t.category === 'typography');
  const border = tokens.filter(t => t.category === 'border');
  const shadow = tokens.filter(t => t.category === 'shadow');

  let contentSections: string[] = [];

  // Build sections based on the category specified or all categories if none are specified
  if (!category || category === 'spacing') {
    const spacingTokens = spacing.map(t => `- \`${t.name}\` = ${t.value}`).join('\n');
    let spacingTemplate = await readPromptFile("get_token_reference_prompt_partials/get-token-reference-spacing.md");
    spacingTemplate = spacingTemplate.replace(/{{COUNT}}/g, spacing.length.toString());
    spacingTemplate = spacingTemplate.replace(/{{TOKENS}}/g, spacingTokens);
    contentSections.push(spacingTemplate);
  }

  if (!category || category === 'typography') {
    const fontSizes = typography.filter(t => t.name.includes('font-') && !t.name.includes('weight') && !t.name.includes('family'));
    const fontWeights = typography.filter(t => t.name.includes('weight'));
    const lineHeights = typography.filter(t => t.name.includes('line-height'));

    const fontSizesList = fontSizes.map(t => `- \`${t.name}\` = ${t.value}`).join('\n');
    const fontWeightsList = fontWeights.map(t => `- \`${t.name}\` = ${t.value}`).join('\n');
    const lineHeightsList = lineHeights.map(t => `- \`${t.name}\` = ${t.value}`).join('\n');

    let typoTemplate = await readPromptFile("get_token_reference_prompt_partials/get-token-reference-typography.md");
    typoTemplate = typoTemplate.replace(/{{COUNT}}/g, typography.length.toString());
    typoTemplate = typoTemplate.replace(/{{FONT_SIZE_COUNT}}/g, fontSizes.length.toString());
    typoTemplate = typoTemplate.replace(/{{FONT_SIZES}}/g, fontSizesList);
    typoTemplate = typoTemplate.replace(/{{FONT_WEIGHT_COUNT}}/g, fontWeights.length.toString());
    typoTemplate = typoTemplate.replace(/{{FONT_WEIGHTS}}/g, fontWeightsList);
    typoTemplate = typoTemplate.replace(/{{LINE_HEIGHT_COUNT}}/g, lineHeights.length.toString());
    typoTemplate = typoTemplate.replace(/{{LINE_HEIGHTS}}/g, lineHeightsList);
    contentSections.push(typoTemplate);
  }

  if (!category || category === 'border') {
    const borderTokens = border.map(t => `- \`${t.name}\` = ${t.value}`).join('\n');
    let borderTemplate = await readPromptFile("get_token_reference_prompt_partials/get-token-reference-border.md");
    borderTemplate = borderTemplate.replace(/{{COUNT}}/g, border.length.toString());
    borderTemplate = borderTemplate.replace(/{{TOKENS}}/g, borderTokens);
    contentSections.push(borderTemplate);
  }

  if (!category || category === 'shadow') {
    const shadowTokens = shadow.map(t => `- \`${t.name}\``).join('\n');
    let shadowTemplate = await readPromptFile("get_token_reference_prompt_partials/get-token-reference-shadow.md");
    shadowTemplate = shadowTemplate.replace(/{{COUNT}}/g, shadow.length.toString());
    shadowTemplate = shadowTemplate.replace(/{{TOKENS}}/g, shadowTokens);
    contentSections.push(shadowTemplate);
  }

  let mainTemplate = await readPromptFile("get-token-reference-prompt.md");
  mainTemplate = mainTemplate.replace(/{{CONTENT}}/g, contentSections.join('\n\n'));

  return mainTemplate;
}
