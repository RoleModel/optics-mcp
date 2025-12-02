# Optics MCP Server

A Model Context Protocol (MCP) server for the Optics Design System, enabling LLMs to understand and work with design tokens, components, and documentation from https://docs.optics.rolemodel.design.

## Overview

This MCP server provides tools and resources for querying the Optics design system, including:
- **Design Tokens**: Colors, spacing, typography, borders, and shadows
- **Components**: Reusable UI components with their token dependencies
- **Documentation**: Design system guidelines and best practices
- **Token Usage Tracking**: Statistics and analysis of token usage across components

## Installation

```bash
npm install
npm run build
```

## Usage

### As an MCP Server

Add this server to your MCP client configuration (e.g., Claude Desktop):

```json
{
  "mcpServers": {
    "optics": {
      "command": "node",
      "args": ["/path/to/optics-mcp/dist/index.js"]
    }
  }
}
```

### Running Directly

```bash
npm start
```

## Available Tools

### `get_token`
Get detailed information about a specific design token.

**Parameters:**
- `tokenName` (required): The name of the token (e.g., "color-primary", "spacing-md")

**Example:**
```json
{
  "tokenName": "color-primary"
}
```

### `search_tokens`
Search for design tokens by category or name pattern.

**Parameters:**
- `category` (optional): Filter by category (color, spacing, typography, border, shadow)
- `namePattern` (optional): Search pattern for token names (case-insensitive)

**Example:**
```json
{
  "category": "color",
  "namePattern": "primary"
}
```

### `get_token_usage_stats`
Get statistics about design token usage across the system.

**Returns:** Total token count and breakdown by category.

### `get_component_info`
Get detailed information about a component including its design token dependencies.

**Parameters:**
- `componentName` (required): The name of the component (e.g., "Button", "Card")

**Example:**
```json
{
  "componentName": "Button"
}
```

### `list_components`
List all available components in the design system.

**Returns:** Array of components with names, descriptions, and token counts.

### `get_component_tokens`
Get all design tokens used by a specific component.

**Parameters:**
- `componentName` (required): The name of the component

### `search_documentation`
Search through Optics documentation.

**Parameters:**
- `query` (required): Search query for documentation content

## Available Resources

The server exposes the following resources via the `optics://` URI scheme:

### Documentation
- `optics://documentation/introduction` - Overview of Optics
- `optics://documentation/getting-started` - Getting started guide
- `optics://documentation/design-tokens` - Design token documentation
- `optics://documentation/color-system` - Color system guide
- `optics://documentation/spacing` - Spacing system guide
- `optics://documentation/typography` - Typography guide
- `optics://documentation/components` - Component library overview
- `optics://documentation/accessibility` - Accessibility guidelines

### Tokens
- `optics://tokens/all` - All design tokens
- `optics://tokens/color` - Color tokens only
- `optics://tokens/spacing` - Spacing tokens only
- `optics://tokens/typography` - Typography tokens only

### Components
- `optics://components/all` - All components

## Design System Overview

### Design Token Categories

1. **Colors**: Brand colors, semantic colors (success, danger, warning, info), text colors
2. **Spacing**: Base-8 spacing system (xs: 4px to 2xl: 48px)
3. **Typography**: Font families, sizes, weights, and line heights
4. **Borders**: Border radius tokens for consistent corner styling
5. **Shadows**: Elevation shadows for depth and hierarchy

### Components

The system includes the following components:
- **Button**: Interactive buttons with consistent styling
- **Card**: Content containers with elevation
- **Input**: Form input fields
- **Alert**: Notification messages
- **Typography**: Text hierarchy system

Each component specifies which design tokens it uses, making it easy to understand dependencies and maintain consistency.

## Development

### Build
```bash
npm run build
```

### Watch Mode
```bash
npm run watch
```

### Project Structure
```
optics-mcp/
├── src/
│   ├── index.ts          # MCP server implementation
│   └── optics-data.ts    # Design tokens and component data
├── dist/                 # Compiled JavaScript
├── package.json
├── tsconfig.json
└── README.md
```

## Token Usage Tracking

The server tracks which design tokens are used by each component, enabling:
- **Dependency Analysis**: Understand which tokens a component relies on
- **Impact Analysis**: See which components are affected by token changes
- **Usage Statistics**: Get insights into token usage patterns

## Contributing

To add new design tokens or components:

1. Edit `src/optics-data.ts`
2. Add tokens to the `designTokens` array
3. Add components to the `components` array, specifying their token dependencies
4. Rebuild the project: `npm run build`

## License

MIT

## Links

- [Optics Design System Documentation](https://docs.optics.rolemodel.design)
- [Model Context Protocol](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
