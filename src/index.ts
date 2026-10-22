#!/usr/bin/env node

// @ts-nocheck - Disable type checking due to MCP SDK deep type instantiation issues

/**
 * Optics MCP Server
 * Provides tools and resources for understanding the Optics Design System
 */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { ListPromptsRequestSchema, GetPromptRequestSchema } from "@modelcontextprotocol/sdk/types"
import { z } from 'zod';

import { designTokens } from './optics-data.js';

// Resources
import * as systemOverview from './resources/system-overview.js';
import * as documentationSection from './resources/documentation/section.js';
import * as allTokens from './resources/tokens/all.js';
import * as categoryTokens from './resources/tokens/category.js';
import * as allComponents from './resources/components/all.js';

// Prompts - Original
import * as createThemedComponentPrompt from './prompts/create-themed-component.js';
import * as migrateToTokensPrompt from './prompts/migrate-to-tokens.js';
import * as accessibleColorComboPrompt from './prompts/accessible-color-combo.js';
import * as designReviewPrompt from './prompts/design-review.js';
import * as explainTokenSystemPrompt from './prompts/explain-token-system.js';
import * as getTokenReferencePrompt from './prompts/get-token-reference.js';
import * as configureIconsPrompt from './prompts/configure-icons.js';
import * as useRecipePrompt from './prompts/use-recipe.js';

// Prompts - New (Phase 1)
import * as buildComponentPrompt from './prompts/building/build-component.js';
import * as createBrandThemePrompt from './prompts/theming/create-brand-theme.js';
import * as reviewCodePrompt from './prompts/review/review-code.js';

// Tools - New (Phase 1)
import ValidateColorPairingTool from './tools/validation/validate-color-pairing-tool.js';
import DetectRedundantCssTool from './tools/validation/detect-redundant-css-tool.js';
import GetComponentHtmlTool from './tools/data-retrieval/get-component-html-tool.js';
import GetLayoutUtilityTool from './tools/data-retrieval/get-layout-utility-tool.js';
import GetColorScaleTool from './tools/data-retrieval/get-color-scale-tool.js';
import CalculateContrastTool from './tools/calculation/calculate-contrast-tool.js';
import CalculateHslTokensTool from './tools/calculation/calculate-hsl-tokens-tool.js';


// Tools
import {
  GetTokenTool,
  GetTokenUsageStatsTool,
  SearchTokensTool,
  ListComponentsTool,
  GetComponentInfoTool,
  GetComponentTokensTool,
  SearchDocumentationTool,
  GenerateThemeTool,
  ValidateTokenUsageTool,
  ReplaceHardCodedValuesTool,
  CheckContrastTool,
  SuggestTokenMigrationTool,
  GenerateComponentScaffoldTool,
  GenerateStickerSheetTool
} from './tools/index.js';

// Fully validated, tested, and working tools.
import { ValidateColorPairTool } from './tools/index.js';

/**
 * Create and configure the MCP server
 */
const __dirname = dirname(fileURLToPath(import.meta.url));
const { version } = JSON.parse(
  readFileSync(resolve(__dirname, '../package.json'), 'utf8')
);

const server = new McpServer({
  name: 'optics-mcp',
  version: '0.1.0',
}, {
  capabilities: {
    tools: {},
    prompts: {},
    resources: {},
  }
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
            uri: uri.href,
            mimeType: resource.metadata.mimeType,
            text: await resource.handler(uri),
          }
        ]
      }
    }
  );
});

// Dynamically register specific instances so they can be accessed
const docSections = ['introduction', 'getting-started', 'design-tokens', 'color-system', 'spacing', 'typography', 'components', 'accessibility'];
docSections.forEach((section) => {
  server.registerResource(
    `documentation-${section}`,
    `optics://documentation/${section}`,
    {
      title: `Documentation: ${section}`,
      description: `${section} documentation`,
      mimeType: 'application/json',
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: await documentationSection.handler(uri),
          }
        ]
      }
    }
  );
});

const tokenCategories = ['color', 'spacing', 'typography', 'border', 'shadow'];
tokenCategories.forEach((category) => {
  server.registerResource(
    `tokens-${category}`,
    `optics://tokens/${category}`,
    {
      title: `${category} tokens`,
      description: `Design tokens for ${category}`,
      mimeType: 'application/json',
    },
    async (uri) => {
      return {
        contents: [
          {
            uri: uri.href,
            mimeType: 'application/json',
            text: await categoryTokens.handler(uri),
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
  // Original prompts
  createThemedComponentPrompt,
  migrateToTokensPrompt,
  accessibleColorComboPrompt,
  designReviewPrompt,
  explainTokenSystemPrompt,
  getTokenReferencePrompt,
  configureIconsPrompt,
  useRecipePrompt,
  // New prompts (Phase 1)
  buildComponentPrompt,
  createBrandThemePrompt,
  reviewCodePrompt,
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
      // Get the prompt content - MCP SDK handles argument validation
      const content = await prompt.handler(args || {} as never)

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
 * Tools
 */

const tools = [

  // Original tools

  new GetTokenTool(),
  new GetTokenUsageStatsTool(),
  new SearchTokensTool(),
  new ListComponentsTool(),
  new GetComponentInfoTool(),
  new GetComponentTokensTool(),
  new SearchDocumentationTool(),
  new GenerateThemeTool(),
  new ValidateTokenUsageTool(),
  new ReplaceHardCodedValuesTool(),
  new CheckContrastTool(),
  new SuggestTokenMigrationTool(),
  new GenerateComponentScaffoldTool(),
  new GenerateStickerSheetTool(),
  new ValidateColorPairTool(),
  new ValidateColorPairingTool(),
  new DetectRedundantCssTool(),
  new GetComponentHtmlTool(),
  new GetLayoutUtilityTool(),
  new GetColorScaleTool(),
  new CalculateContrastTool(),
  new CalculateHslTokensTool(),
]

tools.forEach((tool) => {
  server.registerTool(
    tool.metadata.name,
    {
      title: tool.metadata.title,
      description: tool.metadata.description,
      inputSchema: tool.inputSchema,
    },
    async (args: any) => {
      const content = await tool.handler(args)

      return {
        content: [
          {
            type: 'text',
            text: content,
          },
        ],
      }
    },
  )
})


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
