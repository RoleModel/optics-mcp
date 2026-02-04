#!/usr/bin/env node

// @ts-nocheck - Disable type checking due to MCP SDK deep type instantiation issues

/**
 * Optics MCP Server
 * Provides tools and resources for understanding the Optics Design System
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListPromptsRequestSchema, GetPromptRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { z } from 'zod';
import {
  designTokens,
  components,
  documentation,
  getTokenUsageStats,
  getComponentTokenDependencies,
} from './optics-data.js';
import { generateTheme } from './tools/theme-generator.js';
import { validateTokenUsage, formatValidationReport } from './tools/validate.js';
import { replaceHardCodedValues, formatReplacementSuggestions } from './tools/replace.js';
import { checkTokenContrast, formatContrastResult } from './tools/accessibility.js';
import { suggestTokenMigration, formatMigrationSuggestions } from './tools/migration.js';
import { generateComponentScaffold, formatScaffoldOutput } from './tools/scaffold.js';
import { generateStickerSheet, formatStickerSheet } from './tools/sticker-sheet.js';

// Resources
import * as systemOverview from './resources/system-overview'
import * as documentationSection from './resources/documentation/section'
import * as allTokens from './resources/tokens/all'
import * as categoryTokens from './resources/tokens/category'
import * as allComponents from './resources/components/all'

// Prompts
import * as createThemedComponentPrompt from './prompts/create-themed-component'
import * as migrateToTokensPrompt from './prompts/migrate-to-tokens'
import * as accessibleColorComboPrompt from './prompts/accessible-color-combo'
import * as designReviewPrompt from './prompts/design-review'

/**
 * Create and configure the MCP server
 */
const server = new McpServer({
  name: 'optics-mcp',
  version: '0.1.0',
});

/**
 * Resources
 */

const resources = [
  systemOverview,
  documentationSection,
  allTokens,
  categoryTokens,
  allComponents
]

resources.forEach((resource) => {
  server.registerResource(
    resource.metadata.name,
    resource.metadata.uri,
    {
      title: resource.metadata.title,
      description: resource.metadata.description,
      mimeType: resource.metadata.mimeType,
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: resource.metadata.uri,
            mimeType: resource.metadata.mimeType,
            text: await resource.handler(uri),
          }
        ]
      }
    }
  );
});

/**
 * Prompts
 */

const prompts = [
  createThemedComponentPrompt,
  migrateToTokensPrompt,
  accessibleColorComboPrompt,
  designReviewPrompt
]

prompts.forEach((prompt) => {
  server.registerPrompt(
    prompt.metadata.name,
    {
      title: prompt.metadata.title,
      description: prompt.metadata.description,
      argsSchema: prompt.inputSchema,
    },
    async ({ name, arguments: args }) => {
      // Validate arguments if schema exists
      let parsedArgs: Record<string, unknown> = args || {}
      if (prompt.inputSchema) {
        parsedArgs = parseToolArgs(prompt.inputSchema, args || {})
      }

      // Get the prompt content
      const content = await prompt.handler(parsedArgs)

      return {
        messages: [
          {
            role: prompt.metadata.role || 'user',
            content: {
              type: 'text',
              text: content,
            },
          },
        ],
      }
    },
  )
})

/**
 * Prompt: Explain Token System
 */
server.registerPrompt(
  'explain-token-system',
  {
    title: 'Explain Token System',
    description: 'Explain how a specific token category works in Optics',
    argsSchema: {
      category: z.string().describe('Token category (color, spacing, typography, border, shadow)'),
    },
  },
  async ({ category }) => {
    const cat = category || 'color';
    const tokens = designTokens.filter((t) => t.category === cat);

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Explain how the ${cat} token system works in Optics.\n\nAvailable ${cat} tokens (${tokens.length} total):\n${tokens.slice(0, 10).map((t) => `- ${t.name}: ${t.description}`).join('\n')}${tokens.length > 10 ? '\n... and ' + (tokens.length - 10) + ' more' : ''}\n\nInclude:\n1. How to use these tokens\n2. When to use each one\n3. Best practices\n4. Common patterns`,
          },
        },
      ],
    };
  }
);

/**
 * Prompt: Get Token Reference
 */
server.registerPrompt(
  'get-token-reference',
  {
    title: 'Get Token Reference',
    description: 'Get complete list of all available Optics design tokens - USE THIS to prevent token name hallucination',
    argsSchema: {
      category: z.string().optional().describe('Optional: Filter by category (spacing, typography, border, shadow, or leave empty for all)'),
    },
  },
  async ({ category }) => {
    let tokens = designTokens;

    if (category) {
      tokens = designTokens.filter((t) => t.category === category);
    }

    // Group non-color tokens for clarity
    const spacing = tokens.filter(t => t.category === 'spacing');
    const typography = tokens.filter(t => t.category === 'typography');
    const border = tokens.filter(t => t.category === 'border');
    const shadow = tokens.filter(t => t.category === 'shadow');

    let message = `# Complete Optics Design Token Reference\n\n**IMPORTANT: These are the ONLY valid token names. Do not invent token names like --op-space-600 or use hard-coded pixel values.**\n\n`;

    if (!category || category === 'spacing') {
      message += `## Spacing Tokens (${spacing.length} tokens)\n\n`;
      message += `**ONLY use these exact names:**\n\n`;
      spacing.forEach(t => {
        message += `- \`${t.name}\` = ${t.value}\n`;
      });
      message += `\n**Examples:**\n`;
      message += `- padding: var(--op-space-medium); /* 16px */\n`;
      message += `- margin: var(--op-space-large); /* 20px */\n`;
      message += `- gap: var(--op-space-x-small); /* 8px */\n\n`;
    }

    if (!category || category === 'typography') {
      message += `## Typography Tokens (${typography.length} tokens)\n\n`;
      const fontSizes = typography.filter(t => t.name.includes('font-') && !t.name.includes('weight') && !t.name.includes('family'));
      const fontWeights = typography.filter(t => t.name.includes('weight'));
      const lineHeights = typography.filter(t => t.name.includes('line-height'));

      message += `### Font Sizes (${fontSizes.length}):\n`;
      fontSizes.forEach(t => {
        message += `- \`${t.name}\` = ${t.value}\n`;
      });

      message += `\n### Font Weights (${fontWeights.length}):\n`;
      fontWeights.forEach(t => {
        message += `- \`${t.name}\` = ${t.value}\n`;
      });

      message += `\n### Line Heights (${lineHeights.length}):\n`;
      lineHeights.forEach(t => {
        message += `- \`${t.name}\` = ${t.value}\n`;
      });
      message += `\n`;
    }

    if (!category || category === 'border') {
      message += `## Border Tokens (${border.length} tokens)\n\n`;
      border.forEach(t => {
        message += `- \`${t.name}\` = ${t.value}\n`;
      });
      message += `\n`;
    }

    if (!category || category === 'shadow') {
      message += `## Shadow Tokens (${shadow.length} tokens)\n\n`;
      shadow.forEach(t => {
        message += `- \`${t.name}\`\n`;
      });
      message += `\n`;
    }

    message += `\n---\n\n**CRITICAL RULES:**\n`;
    message += `1. NEVER invent token names - only use names from this list\n`;
    message += `2. NEVER use hard-coded px values - always use tokens\n`;
    message += `3. For colors, use search_tokens tool to find available color tokens\n`;
    message += `4. Token names use words like 'small', 'medium', 'large', NOT numbers like '600'\n`;

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: message,
          },
        },
      ],
    };
  }
);


/**
 * Tool: Get Token
 */
server.registerTool(
  'get_token',
  {
    title: 'Get Token',
    description: 'Get detailed information about a specific design token by name',
    inputSchema: {
      tokenName: z.string().describe('The name of the design token (e.g., "color-primary", "spacing-md")'),
    },
  },
  async ({ tokenName }) => {
    const token = designTokens.find((t) => t.name === tokenName);

    if (!token) {
      return {
        content: [
          {
            type: 'text',
            text: `Token not found: ${tokenName}\n\nAvailable tokens: ${designTokens
              .map((t) => t.name)
              .join(', ')}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(token, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: Search Tokens
 */
server.registerTool(
  'search_tokens',
  {
    title: 'Search Tokens',
    description: 'Search for design tokens by category or name pattern',
    inputSchema: {
      category: z.string().optional().describe('Filter by category (color, spacing, typography, border, shadow)'),
      namePattern: z.string().optional().describe('Search pattern for token names (case-insensitive)'),
    },
  },
  async ({ category, namePattern }) => {
    let filtered = designTokens;

    if (category) {
      filtered = filtered.filter((t) => t.category === category);
    }

    if (namePattern) {
      const pattern = namePattern.toLowerCase();
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(pattern)
      );
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(filtered, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: Get Token Usage Stats
 */
server.registerTool(
  'get_token_usage_stats',
  {
    title: 'Get Token Usage Stats',
    description: 'Get statistics about design token usage across the system',
    inputSchema: {},
  },
  async () => {
    const stats = getTokenUsageStats();
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(stats, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: Get Component Info
 */
server.registerTool(
  'get_component_info',
  {
    title: 'Get Component Info',
    description: 'Get detailed information about a component including its design token dependencies',
    inputSchema: {
      componentName: z.string().describe('The name of the component (e.g., "Button", "Card", "Input")'),
    },
  },
  async ({ componentName }) => {
    const component = components.find(
      (c) => c.name.toLowerCase() === componentName.toLowerCase()
    );

    if (!component) {
      return {
        content: [
          {
            type: 'text',
            text: `Component not found: ${componentName}\n\nAvailable components: ${components
              .map((c) => c.name)
              .join(', ')}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(component, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: List Components
 */
server.registerTool(
  'list_components',
  {
    title: 'List Components',
    description: 'List all available components in the design system',
    inputSchema: {},
  },
  async () => {
    const componentList = components.map((c) => ({
      name: c.name,
      description: c.description,
      tokenCount: c.tokens.length,
    }));

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(componentList, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: Get Component Tokens
 */
server.registerTool(
  'get_component_tokens',
  {
    title: 'Get Component Tokens',
    description: 'Get all design tokens used by a specific component',
    inputSchema: {
      componentName: z.string().describe('The name of the component'),
    },
  },
  async ({ componentName }) => {
    const deps = getComponentTokenDependencies(componentName);

    if (!deps) {
      return {
        content: [
          {
            type: 'text',
            text: `Component not found: ${componentName}`,
          },
        ],
      };
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(deps, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: Search Documentation
 */
server.registerTool(
  'search_documentation',
  {
    title: 'Search Documentation',
    description: 'Search through Optics documentation',
    inputSchema: {
      query: z.string().describe('Search query for documentation content'),
    },
  },
  async ({ query }) => {
    const results = documentation.filter(
      (doc) =>
        doc.title.toLowerCase().includes(query.toLowerCase()) ||
        doc.content.toLowerCase().includes(query.toLowerCase()) ||
        doc.section.toLowerCase().includes(query.toLowerCase())
    );

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(results, null, 2),
        },
      ],
    };
  }
);

/**
 * Tool: Generate Theme
 */
server.registerTool(
  'generate_theme',
  {
    title: 'Generate Theme',
    description: 'Generate a custom Optics theme with CSS variable overrides',
    inputSchema: {
      brandName: z.string().describe('Name of the brand/theme (e.g., "Acme Corp")'),
      primary: z.string().describe('Primary brand color (hex, e.g., "#0066CC")'),
      secondary: z.string().optional().describe('Secondary color (hex, optional)'),
    },
  },
  async ({ brandName, primary, secondary }) => {
    const brandColors = {
      primary,
      secondary,
    };

    const theme = generateTheme(brandName, brandColors);

    return {
      content: [
        {
          type: 'text',
          text: `# ${brandName} Theme Generated\n\n## CSS Variables\n\n\`\`\`css\n${theme.cssVariables}\n\`\`\`\n\n## Figma Variables\n\nSave this as \`figma-variables.json\`:\n\n\`\`\`json\n${theme.figmaVariables}\n\`\`\`\n\n## Summary\n\n- **Total tokens**: ${theme.tokens.length}\n- **Colors**: ${theme.tokens.filter(t => t.category === 'color').length}\n- **Typography**: ${theme.tokens.filter(t => t.category === 'typography').length}\n- **Spacing**: ${theme.tokens.filter(t => t.category === 'spacing').length}\n\n${theme.documentation}`,
        },
      ],
    };
  }
);

/**
 * Tool: Validate Token Usage
 */
server.registerTool(
  'validate_token_usage',
  {
    title: 'Validate Token Usage',
    description: 'Validate code for hard-coded values that should use design tokens',
    inputSchema: {
      code: z.string().describe('CSS or component code to validate'),
    },
  },
  async ({ code }) => {
    const report = validateTokenUsage(code, designTokens);
    const formatted = formatValidationReport(report);

    return {
      content: [
        {
          type: 'text',
          text: formatted,
        },
      ],
    };
  }
);

/**
 * Tool: Replace Hard-Coded Values
 */
server.registerTool(
  'replace_hard_coded_values',
  {
    title: 'Replace Hard-Coded Values',
    description: 'Replace hard-coded values with design tokens',
    inputSchema: {
      code: z.string().describe('Code containing hard-coded values'),
      autofix: z.boolean().optional().describe('Whether to automatically fix the code (default: false)'),
    },
  },
  async ({ code, autofix }) => {
    const result = replaceHardCodedValues(code, designTokens, autofix ?? false);
    const formatted = formatReplacementSuggestions(result);

    return {
      content: [
        {
          type: 'text',
          text: formatted,
        },
      ],
    };
  }
);

/**
 * Tool: Check Contrast
 */
server.registerTool(
  'check_contrast',
  {
    title: 'Check Contrast',
    description: 'Check WCAG contrast ratio between two color tokens',
    inputSchema: {
      foregroundToken: z.string().describe('Foreground color token name'),
      backgroundToken: z.string().describe('Background color token name'),
    },
  },
  async ({ foregroundToken, backgroundToken }) => {
    const result = checkTokenContrast(foregroundToken, backgroundToken, designTokens);
    const formatted = formatContrastResult(result);

    return {
      content: [
        {
          type: 'text',
          text: formatted,
        },
      ],
    };
  }
);

/**
 * Tool: Suggest Token Migration
 */
server.registerTool(
  'suggest_token_migration',
  {
    title: 'Suggest Token Migration',
    description: 'Suggest design tokens for a hard-coded value',
    inputSchema: {
      value: z.string().describe('Hard-coded value to find tokens for (e.g., "#0066CC", "16px")'),
      category: z.string().optional().describe('Optional category filter (color, spacing, typography)'),
    },
  },
  async ({ value, category }) => {
    const suggestion = suggestTokenMigration(value, designTokens, category);
    const formatted = formatMigrationSuggestions(suggestion);

    return {
      content: [
        {
          type: 'text',
          text: formatted,
        },
      ],
    };
  }
);

/**
 * Tool: Generate Component Scaffold
 */
server.registerTool(
  'generate_component_scaffold',
  {
    title: 'Generate Component Scaffold',
    description: 'Generate a React component scaffold with proper token usage',
    inputSchema: {
      componentName: z.string().describe('Name of the component (e.g., "Alert", "Card")'),
      description: z.string().describe('Brief description of the component'),
      tokens: z.array(z.string()).describe('List of token names the component should use'),
    },
  },
  async ({ componentName, description, tokens }) => {
    const scaffold = generateComponentScaffold(
      componentName,
      description,
      tokens,
      designTokens
    );
    const formatted = formatScaffoldOutput(scaffold);

    return {
      content: [
        {
          type: 'text',
          text: formatted,
        },
      ],
    };
  }
);

/**
 * Tool: Generate Sticker Sheet
 */
server.registerTool(
  'generate_sticker_sheet',
  {
    title: 'Generate Sticker Sheet',
    description: 'Generate a visual style guide with color swatches and component examples',
    inputSchema: {
      framework: z.enum(['react', 'vue', 'svelte', 'html']).optional().describe('Target framework (default: react)'),
      includeColors: z.boolean().optional().describe('Include color swatches (default: true)'),
      includeTypography: z.boolean().optional().describe('Include typography specimens (default: true)'),
      includeComponents: z.boolean().optional().describe('Include component examples (default: true)'),
    },
  },
  async ({ framework, includeColors, includeTypography, includeComponents }) => {
    const options = {
      framework: framework ?? 'react',
      includeColors: includeColors ?? true,
      includeTypography: includeTypography ?? true,
      includeComponents: includeComponents ?? true,
    };
    const sheet = generateStickerSheet(designTokens, components, options);
    const formatted = formatStickerSheet(sheet);

    return {
      content: [
        {
          type: 'text',
          text: formatted,
        },
      ],
    };
  }
);


/**
 * Start the server
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Optics MCP Server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
