# Optics MCP Server

A Model Context Protocol (MCP) server for the Optics Design System, enabling LLMs to understand and work with design tokens, components, and documentation from https://docs.optics.rolemodel.design.

## Overview

This MCP server provides tools and resources for querying the Optics design system, including:
- **Design Tokens**: Colors, spacing, typography, borders, and shadows
- **Components**: Reusable UI components with their token dependencies
- **Documentation**: Design system guidelines and best practices
- **Token Usage Tracking**: Statistics and analysis of token usage across components

## Installation

### Quick Start (Zero-Install) ⚡

The easiest way to use Optics MCP - no installation required!

#### Claude Desktop

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "optics": {
      "command": "npx",
      "args": ["-y", "@rolemodel/optics-mcp"]
    }
  }
}
```

#### Claude Code CLI

Add with a single command:

```bash
claude mcp add optics -- npx -y @rolemodel/optics-mcp
```

**Other useful commands:**

```bash
# List all MCP servers
claude mcp list

# Remove the Optics server
claude mcp remove optics

# View server details
claude mcp get optics

# Test the connection
claude mcp test optics
```

**That's it!** The server runs automatically whenever your MCP client needs it.

### Local Installation (For Development)

If you want to modify the server or contribute:

```bash
git clone https://github.com/RoleModel/optics-mcp.git
cd optics-mcp
npm install
npm run build
```

Then configure with the local path:

```json
{
  "mcpServers": {
    "optics": {
      "command": "node",
      "args": ["/absolute/path/to/optics-mcp/dist/index.js"]
    }
  }
}
```

## Usage

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

1. **Colors** (25 tokens): HSL-based color system with primary, neutral, and alert colors
2. **Spacing** (11 tokens): calc-based rem units with base-10 scale (2px to 80px)
3. **Typography** (32 tokens): Noto Sans/Serif fonts with sizes, weights, and line heights
4. **Borders** (10 tokens): Border radius (small to pill) and widths
5. **Shadows** (5 tokens): Elevation system (x-small to x-large)

### Components (24 Total)

All components extracted from real Optics SCSS with accurate token dependencies:

- **Accordion**: Collapsible content panel
- **Alert**: Notification messages (warning, danger, info, notice)
- **Avatar**: User profile pictures
- **Badge**: Status indicators and labels
- **Breadcrumbs**: Navigation hierarchy
- **Button**: Interactive buttons with variants
- **ButtonGroup**: Grouped button container
- **Card**: Content containers with elevation
- **ConfirmDialog**: Action confirmation modals
- **Divider**: Content separators
- **Form**: Input fields, textareas, selects
- **Icon**: Material Symbols icons
- **Modal**: Overlay dialogs
- **Navbar**: Top navigation
- **Pagination**: Page navigation
- **SidePanel**: Sliding side panels
- **Sidebar**: Side navigation
- **Spinner**: Loading indicators
- **Switch**: Toggle switches
- **Tab**: Tabbed interfaces
- **Table**: Data tables
- **Tag**: Categorization labels
- **TextPair**: Label-value pairs
- **Tooltip**: Contextual information

Each component specifies which Optics design tokens it uses, making it easy to understand dependencies and maintain consistency.

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
