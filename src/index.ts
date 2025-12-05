#!/usr/bin/env node

/**
 * Optics MCP Server
 * Provides tools and resources for understanding the Optics Design System
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
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

/**
 * Create and configure the MCP server
 */
const server = new Server(
  {
    name: 'optics-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

/**
 * Handler for listing available resources
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'optics://system-overview',
        name: '⚠️ System Overview - READ THIS FIRST',
        description: 'CRITICAL: Comprehensive guide to understanding the Optics token architecture. Explains the HSL-based color system, token naming patterns, and common mistakes. MUST READ before using any Optics tools.',
        mimeType: 'text/plain',
      },
      {
        uri: 'optics://documentation/introduction',
        name: 'Introduction to Optics',
        description: 'Overview of the Optics design system',
        mimeType: 'text/plain',
      },
      {
        uri: 'optics://documentation/getting-started',
        name: 'Getting Started',
        description: 'How to get started with Optics',
        mimeType: 'text/plain',
      },
      {
        uri: 'optics://documentation/design-tokens',
        name: 'Design Tokens',
        description: 'Complete list of design tokens',
        mimeType: 'application/json',
      },
      {
        uri: 'optics://documentation/color-system',
        name: 'Color System',
        description: 'Color palette and usage guidelines',
        mimeType: 'text/plain',
      },
      {
        uri: 'optics://documentation/spacing',
        name: 'Spacing System',
        description: 'Spacing tokens and grid system',
        mimeType: 'text/plain',
      },
      {
        uri: 'optics://documentation/typography',
        name: 'Typography',
        description: 'Typography tokens and guidelines',
        mimeType: 'text/plain',
      },
      {
        uri: 'optics://documentation/components',
        name: 'Components',
        description: 'Component library overview',
        mimeType: 'application/json',
      },
      {
        uri: 'optics://documentation/accessibility',
        name: 'Accessibility',
        description: 'Accessibility guidelines',
        mimeType: 'text/plain',
      },
      {
        uri: 'optics://tokens/all',
        name: 'All Design Tokens',
        description: 'Complete list of all design tokens',
        mimeType: 'application/json',
      },
      {
        uri: 'optics://tokens/color',
        name: 'Color Tokens',
        description: 'All color design tokens',
        mimeType: 'application/json',
      },
      {
        uri: 'optics://tokens/spacing',
        name: 'Spacing Tokens',
        description: 'All spacing design tokens',
        mimeType: 'application/json',
      },
      {
        uri: 'optics://tokens/typography',
        name: 'Typography Tokens',
        description: 'All typography design tokens',
        mimeType: 'application/json',
      },
      {
        uri: 'optics://components/all',
        name: 'All Components',
        description: 'Complete component library',
        mimeType: 'application/json',
      },
    ],
  };
});

/**
 * Handler for reading resource contents
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const uri = request.params.uri;

  // Handle system overview - MUST BE FIRST
  if (uri === 'optics://system-overview') {
    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: `# Optics Design System - AI Comprehension Guide

**CRITICAL: Read this FIRST before using any Optics tools or data.**

This document explains the Optics Design System architecture in a way that AI agents can understand and use correctly.

## 🎯 The Core Problem

Most design systems use simple tokens like \`--color-primary: #0066CC\`. **Optics does NOT work this way.**

Optics uses a sophisticated HSL-based color system that generates colors dynamically from base values. This means:

❌ **WRONG**: Looking for \`--color-primary\` or \`--op-color-primary\`  
✅ **CORRECT**: Using \`--op-color-primary-base\` or the HSL components \`--op-color-primary-h/s/l\`

## 🏗️ Token Architecture

### Layer 1: HSL Base Values (Foundation)

These are the foundational tokens that define color hue, saturation, and lightness:

\`\`\`css
/* Primary color base HSL values */
--op-color-primary-h: 216;      /* Hue */
--op-color-primary-s: 58%;      /* Saturation */
--op-color-primary-l: 48%;      /* Lightness */
\`\`\`

**Color families available:**
- \`primary\` - Main brand color
- \`neutral\` - Grays and neutrals
- \`alerts-warning\` - Yellow/orange warnings
- \`alerts-danger\` - Red errors
- \`alerts-info\` - Blue information
- \`alerts-notice\` - Green success

### Layer 2: Scale Tokens (Light/Dark Adaptive)

From the base HSL values, Optics generates a scale of colors using the \`light-dark()\` CSS function:

**The Scale:**
\`\`\`
plus-max    (lightest - light mode: 100%, dark mode: 12%)
plus-eight
plus-seven
plus-six
plus-five
plus-four
plus-three
plus-two
plus-one
base        (middle - the main color)
minus-one
minus-two
minus-three
minus-four
minus-five
minus-six
minus-seven
minus-eight
minus-max   (darkest - light mode: 0%, dark mode: 100%)
\`\`\`

**Example tokens:**
\`\`\`css
--op-color-primary-base
--op-color-primary-plus-five
--op-color-primary-minus-three
--op-color-neutral-plus-eight
--op-color-alerts-danger-base
\`\`\`

### Layer 3: "On" Tokens (Text Colors)

For each scale token, there's a corresponding "on" token for text that appears ON that background:

\`\`\`css
/* For backgrounds */
--op-color-primary-base
--op-color-primary-plus-five

/* For text ON those backgrounds */
--op-color-primary-on-base
--op-color-primary-on-plus-five
\`\`\`

Each "on" token also has an \`-alt\` variant for secondary text:
\`\`\`css
--op-color-primary-on-base
--op-color-primary-on-base-alt
\`\`\`

## 🎨 How to Use Color Tokens

### ❌ WRONG - Don't Look For These:
\`\`\`css
--color-primary
--op-color-primary
--color-text-primary
\`\`\`

### ✅ CORRECT - Use These Instead:

**For backgrounds:**
\`\`\`css
background: var(--op-color-primary-base);           /* Main primary color */
background: var(--op-color-primary-plus-five);      /* Lighter primary */
background: var(--op-color-neutral-plus-eight);     /* Light gray background */
\`\`\`

**For text:**
\`\`\`css
color: var(--op-color-primary-on-base);             /* Text on primary-base */
color: var(--op-color-neutral-on-plus-eight);       /* Text on light gray */
\`\`\`

**For borders:**
\`\`\`css
border-color: var(--op-color-neutral-plus-four);    /* Light border */
\`\`\`

## 🚨 Common Mistakes

### Mistake 1: Looking for Simple Color Names
❌ Searching for "color-primary"  
✅ Search for "primary-base" or "primary" and filter results

### Mistake 2: Ignoring the HSL System
❌ Treating colors as hex values  
✅ Understanding that colors are built from HSL components

### Mistake 3: Using Wrong Token Names
❌ \`var(--color-primary)\`  
✅ \`var(--op-color-primary-base)\`

### Mistake 4: Not Using "On" Tokens for Text
❌ Using arbitrary text colors on colored backgrounds  
✅ Using the matching \`-on-\` token: \`--op-color-primary-on-base\` on \`--op-color-primary-base\`

## 🎯 Quick Reference

### Most Common Tokens

**Backgrounds:**
- \`--op-color-neutral-plus-eight\` - Light background
- \`--op-color-primary-base\` - Primary button background
- \`--op-color-alerts-danger-base\` - Error state background

**Text:**
- \`--op-color-neutral-on-plus-eight\` - Text on light backgrounds
- \`--op-color-primary-on-base\` - Text on primary backgrounds

**Spacing:**
- \`--op-space-x-small\` (8px) - Tight spacing
- \`--op-space-medium\` (16px) - Standard spacing
- \`--op-space-large\` (20px) - Loose spacing

**Typography:**
- \`--op-font-medium\` (16px) - Body text
- \`--op-font-weight-normal\` (400) - Regular weight
- \`--op-line-height-base\` (1.5) - Body line height

**Borders:**
- \`--op-radius-medium\` (4px) - Standard border radius
- \`--op-border-width\` (1px) - Standard border

## 🎓 Mental Model Summary

Think of Optics tokens like this:

\`\`\`
HSL Base Values (h/s/l)
    ↓
Scale Tokens (plus-max to minus-max)
    ↓
On Tokens (text colors for those scales)
\`\`\`

The system is:
- **Predictable**: Every color family follows the same pattern
- **Adaptive**: Light/dark modes handled automatically
- **Accessible**: On tokens ensure proper contrast
- **Themeable**: Change base HSL values to create themes

**Always use the full token names with \`--op-\` prefix and the correct scale suffix.**`,
        },
      ],
    };
  }

  // Handle documentation resources
  if (uri.startsWith('optics://documentation/')) {
    const section = uri.replace('optics://documentation/', '');
    const doc = documentation.find((d) => d.section === section);

    if (!doc) {
      throw new Error(`Documentation section not found: ${section}`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: 'text/plain',
          text: `# ${doc.title}\n\n${doc.content}${
            doc.tokens && doc.tokens.length > 0
              ? `\n\nRelated tokens: ${doc.tokens.join(', ')}`
              : ''
          }`,
        },
      ],
    };
  }

  // Handle token resources
  if (uri.startsWith('optics://tokens/')) {
    const category = uri.replace('optics://tokens/', '');

    if (category === 'all') {
      return {
        contents: [
          {
            uri,
            mimeType: 'application/json',
            text: JSON.stringify(designTokens, null, 2),
          },
        ],
      };
    }

    const filteredTokens = designTokens.filter((t) => t.category === category);
    if (filteredTokens.length === 0) {
      throw new Error(`No tokens found for category: ${category}`);
    }

    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(filteredTokens, null, 2),
        },
      ],
    };
  }

  // Handle component resources
  if (uri === 'optics://components/all') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(components, null, 2),
        },
      ],
    };
  }

  throw new Error(`Unknown resource URI: ${uri}`);
});

/**
 * Handler for listing available prompts
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: 'create-themed-component',
        description: 'Generate a component styled with Optics design tokens',
        arguments: [
          {
            name: 'componentType',
            description: 'Type of component (button, card, form, alert, etc.)',
            required: true,
          },
          {
            name: 'variant',
            description: 'Component variant (primary, secondary, danger, etc.)',
            required: false,
          },
          {
            name: 'framework',
            description: 'Framework to use (react, vue, svelte, html)',
            required: false,
          },
        ],
      },
      {
        name: 'migrate-to-tokens',
        description: 'Convert hard-coded CSS values to Optics design tokens',
        arguments: [
          {
            name: 'code',
            description: 'CSS or component code with hard-coded values',
            required: true,
          },
        ],
      },
      {
        name: 'accessible-color-combo',
        description: 'Suggest accessible foreground/background color token combinations',
        arguments: [
          {
            name: 'colorFamily',
            description: 'Color family (primary, neutral, danger, warning, info, notice)',
            required: true,
          },
          {
            name: 'wcagLevel',
            description: 'WCAG level (AA or AAA)',
            required: false,
          },
        ],
      },
      {
        name: 'explain-token-system',
        description: 'Explain how a specific token category works in Optics',
        arguments: [
          {
            name: 'category',
            description: 'Token category (color, spacing, typography, border, shadow)',
            required: true,
          },
        ],
      },
      {
        name: 'design-review',
        description: 'Review a design or component for Optics token usage and best practices',
        arguments: [
          {
            name: 'code',
            description: 'Component code to review',
            required: true,
          },
          {
            name: 'componentType',
            description: 'Type of component being reviewed',
            required: false,
          },
        ],
      },
      {
        name: 'get-token-reference',
        description: 'Get complete list of all available Optics design tokens - USE THIS to prevent token name hallucination',
        arguments: [
          {
            name: 'category',
            description: 'Optional: Filter by category (spacing, typography, border, shadow, or leave empty for all)',
            required: false,
          },
        ],
      },
    ],
  };
});

/**
 * Handler for getting prompt content
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'create-themed-component') {
    const componentType = args?.componentType || 'button';
    const variant = args?.variant || 'primary';
    const framework = args?.framework || 'react';

    const component = components.find(
      (c) => c.name.toLowerCase() === componentType.toLowerCase()
    );

    if (!component) {
      return {
        messages: [
          {
            role: 'user',
            content: {
              type: 'text',
              text: `Create a ${componentType} component using Optics design tokens. Available components: ${components.map((c) => c.name).join(', ')}`,
            },
          },
        ],
      };
    }

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Create a ${variant} ${componentType} component in ${framework} using these Optics design tokens:\n\nRequired tokens:\n${component.tokens.join('\n')}\n\nUsage guidelines:\n${component.usage}${component.examples && component.examples.length > 0 ? '\n\nExample structure:\n' + component.examples[0] : ''}`,
          },
        },
      ],
    };
  }

  if (name === 'migrate-to-tokens') {
    const code = args?.code || '';

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Convert the following code to use Optics design tokens. Replace hard-coded colors, spacing, font sizes, and other values with appropriate tokens from the Optics system:\n\n\`\`\`\n${code}\n\`\`\`\n\nAvailable token categories:\n- Color (op-color-*): HSL-based color system\n- Spacing (op-space-*): rem-based spacing scale\n- Typography (op-font-*, op-line-height-*): Font sizes, weights, line heights\n- Border (op-radius-*, op-border-width-*): Border radius and widths\n- Shadow (op-shadow-*): Elevation shadows\n\nUse the validate_token_usage and replace_hard_coded_values tools to help with the conversion.`,
          },
        },
      ],
    };
  }

  if (name === 'accessible-color-combo') {
    const colorFamily = args?.colorFamily || 'primary';
    const wcagLevel = args?.wcagLevel || 'AA';

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Suggest accessible color token combinations for the ${colorFamily} color family that meet WCAG ${wcagLevel} standards.\n\nOptics uses a scale-based color system with:\n- Base HSL tokens: --op-color-${colorFamily}-h/s/l\n- Generated scale tokens: ${colorFamily}-base, ${colorFamily}-plus-one through plus-eight, ${colorFamily}-minus-one through minus-eight\n- On-color tokens for text: ${colorFamily}-on-base, ${colorFamily}-on-plus-five, etc.\n\nUse the check_contrast tool to validate combinations. Suggest foreground/background pairs that meet the contrast requirements.`,
          },
        },
      ],
    };
  }

  if (name === 'explain-token-system') {
    const category = args?.category || 'color';
    const tokens = designTokens.filter((t) => t.category === category);

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Explain how the ${category} token system works in Optics.\n\nAvailable ${category} tokens (${tokens.length} total):\n${tokens.slice(0, 10).map((t) => `- ${t.name}: ${t.description}`).join('\n')}${tokens.length > 10 ? '\n... and ' + (tokens.length - 10) + ' more' : ''}\n\nInclude:\n1. How to use these tokens\n2. When to use each one\n3. Best practices\n4. Common patterns`,
          },
        },
      ],
    };
  }

  if (name === 'design-review') {
    const code = args?.code || '';
    const componentType = args?.componentType || 'unknown';

    return {
      messages: [
        {
          role: 'user',
          content: {
            type: 'text',
            text: `Review this ${componentType} component for Optics design system compliance:\n\n\`\`\`\n${code}\n\`\`\`\n\nCheck for:\n1. Hard-coded values that should use tokens\n2. Proper token usage and naming\n3. Accessibility (color contrast, focus states)\n4. Consistency with Optics patterns\n5. Missing or incorrect tokens\n\nUse these tools to help:\n- validate_token_usage: Find hard-coded values\n- check_contrast: Verify color accessibility\n- get_component_info: See how Optics components use tokens`,
          },
        },
      ],
    };
  }

  if (name === 'get-token-reference') {
    const category = args?.category as string | undefined;
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

  throw new Error(`Unknown prompt: ${name}`);
});

/**
 * Handler for listing available tools
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'get_token',
        description:
          'Get detailed information about a specific design token by name',
        inputSchema: {
          type: 'object',
          properties: {
            tokenName: {
              type: 'string',
              description: 'The name of the design token (e.g., "color-primary", "spacing-md")',
            },
          },
          required: ['tokenName'],
        },
      },
      {
        name: 'search_tokens',
        description:
          'Search for design tokens by category or name pattern',
        inputSchema: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description: 'Filter by category (color, spacing, typography, border, shadow)',
            },
            namePattern: {
              type: 'string',
              description: 'Search pattern for token names (case-insensitive)',
            },
          },
        },
      },
      {
        name: 'get_token_usage_stats',
        description:
          'Get statistics about design token usage across the system',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_component_info',
        description:
          'Get detailed information about a component including its design token dependencies',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: {
              type: 'string',
              description: 'The name of the component (e.g., "Button", "Card", "Input")',
            },
          },
          required: ['componentName'],
        },
      },
      {
        name: 'list_components',
        description: 'List all available components in the design system',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'get_component_tokens',
        description:
          'Get all design tokens used by a specific component',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: {
              type: 'string',
              description: 'The name of the component',
            },
          },
          required: ['componentName'],
        },
      },
      {
        name: 'search_documentation',
        description: 'Search through Optics documentation',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query for documentation content',
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'generate_theme',
        description: 'Generate a custom theme with CSS variables and Figma Variables JSON',
        inputSchema: {
          type: 'object',
          properties: {
            brandName: {
              type: 'string',
              description: 'Name of the brand/theme (e.g., "Acme Corp")',
            },
            primary: {
              type: 'string',
              description: 'Primary brand color (hex, e.g., "#0066CC")',
            },
            secondary: {
              type: 'string',
              description: 'Secondary color (hex, optional)',
            },
          },
          required: ['brandName', 'primary'],
        },
      },
      {
        name: 'validate_token_usage',
        description: 'Validate code for hard-coded values that should use design tokens',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'CSS or component code to validate',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'replace_hard_coded_values',
        description: 'Replace hard-coded values with design tokens',
        inputSchema: {
          type: 'object',
          properties: {
            code: {
              type: 'string',
              description: 'Code containing hard-coded values',
            },
            autofix: {
              type: 'boolean',
              description: 'Whether to automatically fix the code (default: false)',
            },
          },
          required: ['code'],
        },
      },
      {
        name: 'check_contrast',
        description: 'Check WCAG contrast ratio between two color tokens',
        inputSchema: {
          type: 'object',
          properties: {
            foregroundToken: {
              type: 'string',
              description: 'Foreground color token name',
            },
            backgroundToken: {
              type: 'string',
              description: 'Background color token name',
            },
          },
          required: ['foregroundToken', 'backgroundToken'],
        },
      },
      {
        name: 'suggest_token_migration',
        description: 'Suggest design tokens for a hard-coded value',
        inputSchema: {
          type: 'object',
          properties: {
            value: {
              type: 'string',
              description: 'Hard-coded value to find tokens for (e.g., "#0066CC", "16px")',
            },
            category: {
              type: 'string',
              description: 'Optional category filter (color, spacing, typography)',
            },
          },
          required: ['value'],
        },
      },
      {
        name: 'generate_component_scaffold',
        description: 'Generate a React component scaffold with proper token usage',
        inputSchema: {
          type: 'object',
          properties: {
            componentName: {
              type: 'string',
              description: 'Name of the component (e.g., "Alert", "Card")',
            },
            description: {
              type: 'string',
              description: 'Brief description of the component',
            },
            tokens: {
              type: 'array',
              description: 'List of token names the component should use',
              items: {
                type: 'string',
              },
            },
          },
          required: ['componentName', 'description', 'tokens'],
        },
      },
      {
        name: 'generate_sticker_sheet',
        description: 'Generate a visual style guide with color swatches and component examples',
        inputSchema: {
          type: 'object',
          properties: {
            framework: {
              type: 'string',
              description: 'Target framework: react, vue, svelte, or html (default: react)',
              enum: ['react', 'vue', 'svelte', 'html'],
            },
            includeColors: {
              type: 'boolean',
              description: 'Include color swatches (default: true)',
            },
            includeTypography: {
              type: 'boolean',
              description: 'Include typography specimens (default: true)',
            },
            includeComponents: {
              type: 'boolean',
              description: 'Include component examples (default: true)',
            },
          },
        },
      },
    ],
  };
});

/**
 * Handler for tool execution
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!args) {
    throw new Error(`Missing arguments for tool: ${name}`);
  }

  switch (name) {
    case 'get_token': {
      const tokenName = args.tokenName as string;
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

    case 'search_tokens': {
      const category = args.category as string | undefined;
      const namePattern = args.namePattern as string | undefined;

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

    case 'get_token_usage_stats': {
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

    case 'get_component_info': {
      const componentName = args.componentName as string;
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

    case 'list_components': {
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

    case 'get_component_tokens': {
      const componentName = args.componentName as string;
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

    case 'search_documentation': {
      const query = (args.query as string).toLowerCase();
      const results = documentation.filter(
        (doc) =>
          doc.title.toLowerCase().includes(query) ||
          doc.content.toLowerCase().includes(query) ||
          doc.section.toLowerCase().includes(query)
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

    case 'generate_theme': {
      const brandName = args.brandName as string;
      const brandColors = {
        primary: args.primary as string,
        secondary: args.secondary as string | undefined,
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

    case 'validate_token_usage': {
      const code = args.code as string;
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

    case 'replace_hard_coded_values': {
      const code = args.code as string;
      const autofix = (args.autofix as boolean) ?? false;
      const result = replaceHardCodedValues(code, designTokens, autofix);
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

    case 'check_contrast': {
      const foregroundToken = args.foregroundToken as string;
      const backgroundToken = args.backgroundToken as string;
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

    case 'suggest_token_migration': {
      const value = args.value as string;
      const category = args.category as string | undefined;
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

    case 'generate_component_scaffold': {
      const componentName = args.componentName as string;
      const description = args.description as string;
      const tokens = args.tokens as string[];
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

    case 'generate_sticker_sheet': {
      const framework = (args.framework as 'react' | 'vue' | 'svelte' | 'html') ?? 'react';
      const options = {
        framework,
        includeColors: (args.includeColors as boolean) ?? true,
        includeTypography: (args.includeTypography as boolean) ?? true,
        includeComponents: (args.includeComponents as boolean) ?? true,
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

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

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
