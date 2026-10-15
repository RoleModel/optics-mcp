/**
 * Create Brand Theme Prompt
 * Orchestrates theme creation with brand colors
 * Combines: calculate_hsl_tokens, get_color_scale, calculate_contrast
 */

import { z } from 'zod';
import { readPromptFile } from '../../_internal/resource-path.js';

type CreateBrandThemePromptArgs = {
  brandName: string;
  primaryColor: string;
  neutralColor?: string;
};

export const inputSchema = {
  brandName: z.string().describe('Name of the brand (e.g., "Acme Corp", "TechStartup")'),
  primaryColor: z.string().describe('Primary brand color in hex format (e.g., "#FF5733", "#2D6FDB")'),
  neutralColor: z.string().optional().describe('Optional neutral/gray color in hex format'),
};

export const metadata = {
  name: 'create-brand-theme',
  title: 'Create Brand Theme',
  description: 'Generate a complete Optics theme customized with brand colors. Includes HSL conversion and accessibility validation.',
  role: 'user',
};

/**
 * Validate hex color format
 */
const isValidHexColor = (color: string): boolean => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
};

/**
 * Normalize hex color (add # if missing)
 */
const normalizeHexColor = (color: string): string => {
  if (!color.startsWith('#')) {
    return '#' + color;
  }
  return color;
};

export async function handler(args: CreateBrandThemePromptArgs): Promise<string> {
  const brandName = args.brandName || 'My Brand';
  let primaryColor = args.primaryColor || '#2D6FDB';
  let neutralColor = args.neutralColor;

  // Normalize colors
  primaryColor = normalizeHexColor(primaryColor);
  if (neutralColor) {
    neutralColor = normalizeHexColor(neutralColor);
  }

  // Validate colors
  if (!isValidHexColor(primaryColor)) {
    return `# Invalid Color Format

The primary color "${primaryColor}" is not a valid hex color.

## Valid Formats
- 6-digit hex: \`#FF5733\`, \`#2D6FDB\`
- 3-digit hex: \`#F53\`, \`#26D\`

Please provide a valid hex color and try again.`;
  }

  if (neutralColor && !isValidHexColor(neutralColor)) {
    return `# Invalid Color Format

The neutral color "${neutralColor}" is not a valid hex color.

## Valid Formats
- 6-digit hex: \`#757882\`, \`#808080\`
- 3-digit hex: \`#888\`, \`#666\`

Please provide a valid hex color and try again.`;
  }

  // Load and populate the template
  let promptTemplate = await readPromptFile('create-brand-theme-prompt.md');

  // Build neutral color section
  const neutralColorSection = neutralColor
    ? `- **Neutral**: ${neutralColor}`
    : '- **Neutral**: Using default Optics neutral (will inherit primary hue)';

  // Replace placeholders
  promptTemplate = promptTemplate
    .replace(/{{BRAND_NAME}}/g, brandName)
    .replace(/{{PRIMARY_COLOR}}/g, primaryColor)
    .replace(/{{NEUTRAL_COLOR_SECTION}}/g, neutralColorSection);

  return promptTemplate;
}
