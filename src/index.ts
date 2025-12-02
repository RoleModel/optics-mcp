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
} from '@modelcontextprotocol/sdk/types.js';
import {
  designTokens,
  components,
  documentation,
  getTokenUsageStats,
  getComponentTokenDependencies,
} from './optics-data.js';

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
