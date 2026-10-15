/**
 * Build Component Prompt
 * Orchestrates component creation using Optics patterns
 * Combines: get_component_html, validate_color_pairing, detect_redundant_css
 */

import { z } from 'zod';
import { components } from '../../optics-data.js';
import { readPromptFile } from '../../_internal/resource-path.js';

type BuildComponentPromptArgs = {
  componentType: string;
  variant?: string;
};

export const inputSchema = {
  componentType: z.string().describe('Type of component to build (button, card, alert, modal, form, etc.)'),
  variant: z.string().optional().describe('Component variant (primary, secondary, danger, filled, etc.)'),
};

export const metadata = {
  name: 'build-component',
  title: 'Build Component',
  description: 'Build a component using Optics design system patterns. Enforces correct class usage and color pairing.',
  role: 'user',
};

/**
 * Find component by name (case-insensitive)
 */
const findComponent = (componentType: string) => {
  return components.find(
    (c) => c.name.toLowerCase() === componentType.toLowerCase()
  );
};

/**
 * Find similar components for suggestions
 */
const findSimilarComponents = (componentType: string) => {
  const searchTerm = componentType.toLowerCase();
  return components.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm) ||
      c.description.toLowerCase().includes(searchTerm)
  );
};

export async function handler(args: BuildComponentPromptArgs): Promise<string> {
  const componentType = args.componentType || 'button';
  const variant = args.variant || 'default';

  const component = findComponent(componentType);

  if (!component) {
    // Try to find similar components
    const similar = findSimilarComponents(componentType);
    const availableComponents = components.map((c) => c.name).join(', ');

    if (similar.length > 0) {
      return `# Component Not Found

The component "${componentType}" was not found in Optics.

## Did you mean?
${similar.map((c) => `- **${c.name}**: ${c.description}`).join('\n')}

## Available Components
${availableComponents}

## Tools to Use
- Use \`list_components\` to see all available components
- Use \`get_component_html\` with a valid component name to get the HTML structure`;
    }

    return `# Component Not Found

The component "${componentType}" was not found in Optics.

## Available Components
${availableComponents}

## Tools to Use
- Use \`list_components\` to see all available components with descriptions
- Use \`search_components\` to find components by description`;
  }

  // Load and populate the template
  let promptTemplate = await readPromptFile('build-component-prompt.md');

  // Format modifiers list
  const modifiersText = component.modifiers.length > 0
    ? component.modifiers.map((m) => `\`${m}\``).join(', ')
    : 'None';

  // Format tokens list
  const tokensText = component.tokens.length > 0
    ? component.tokens.map((t) => `- \`${t}\``).join('\n')
    : 'No specific tokens required';

  // Replace placeholders
  promptTemplate = promptTemplate
    .replace(/{{TYPE}}/g, component.name)
    .replace(/{{VARIANT}}/g, variant)
    .replace(/{{EXAMPLE_HTML}}/g, component.exampleHtml || '<div class="' + component.className + '">...</div>')
    .replace(/{{CLASS_NAME}}/g, component.className)
    .replace(/{{MODIFIERS}}/g, modifiersText)
    .replace(/{{DOCS_URL}}/g, component.docsUrl || 'No documentation URL available')
    .replace(/{{TOKENS}}/g, tokensText)
    .replace(/{{USAGE}}/g, component.usage || component.description);

  return promptTemplate;
}
