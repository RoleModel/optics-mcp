# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## ⚠️ CRITICAL: Read This First

**Before using ANY tools or making ANY changes, you MUST read [SYSTEM_OVERVIEW.md](./SYSTEM_OVERVIEW.md).**

The Optics Design System uses a sophisticated HSL-based color system that is DIFFERENT from typical design systems. Common mistakes include:
- ❌ Looking for tokens like `color-primary` or `--color-primary`
- ❌ Expecting simple hex color values
- ❌ Not understanding the scale system (plus-max, base, minus-max)

Read SYSTEM_OVERVIEW.md to understand the actual token architecture before proceeding.

## Project Overview

This is an MCP (Model Context Protocol) server for the Optics Design System. It exposes design tokens, components, and documentation through the MCP protocol, enabling LLMs to understand and work with the design system from https://docs.optics.rolemodel.design.

**Technology Stack:**
- TypeScript with ES2022 modules
- MCP SDK (`@modelcontextprotocol/sdk`) for protocol implementation
- Node.js 18+ runtime
- stdio transport for client communication

## Development Commands

### Essential Commands
```bash
# Build the project (required after any code changes)
npm run build

# Run tests
npm test

# Start the MCP server
npm start

# Watch mode for development (auto-rebuild on changes)
npm run watch
```

### Development Workflow
1. Make changes to TypeScript files in `src/`
2. Run `npm run build` to compile
3. Run `npm test` to verify data integrity
4. Test with an MCP client (e.g., Claude Desktop)

**Important:** The `prepare` script runs `npm run build` automatically on `npm install`, so the project is ready to use after installation.

## Architecture

### Core Structure

**Two-layer architecture:**

1. **Server Layer** (`src/index.ts`):
   - MCP server setup with stdio transport
   - Request handlers for tools and resources
   - Protocol implementation (JSON-RPC over stdio)
   - Input validation and error handling

2. **Data Layer** (`src/optics-data.ts`):
   - Design token definitions (40+ tokens)
   - Component definitions with token dependencies
   - Documentation content
   - Utility functions (`getTokenUsageStats()`, `getComponentTokenDependencies()`)

### MCP Protocol Implementation

**Tools** (7 total):
- `get_token` - Retrieve specific token by name
- `search_tokens` - Filter tokens by category/pattern
- `get_token_usage_stats` - Aggregate statistics
- `get_component_info` - Component details
- `list_components` - All components overview
- `get_component_tokens` - Component token dependencies
- `search_documentation` - Search docs

**Resources** (13+ URIs):
- `optics://documentation/{section}` - Documentation sections
- `optics://tokens/{category}` - Token collections
- `optics://components/all` - All components

### Data Relationships

**Component-Token Dependencies:**
Each component explicitly declares which design tokens it uses. This enables:
- Impact analysis: Which components are affected by token changes?
- Dependency tracking: What tokens does a component require?
- Consistency validation: Are all referenced tokens defined?

Example:
```typescript
{
  name: 'Button',
  tokens: ['color-primary', 'spacing-md', 'border-radius-md', ...],
  // ...
}
```

## Key Design Patterns

### URI Scheme
All resources follow the pattern: `optics://{type}/{identifier}`
- Type: `documentation`, `tokens`, or `components`
- Identifier: Specific section, category, or `all`

### Token Categories
Design tokens are organized into 5 categories:
- `color` - Brand colors, semantic colors, text colors
- `spacing` - Base-8 spacing system (4px, 8px, 16px, etc.)
- `typography` - Font families, sizes, weights, line heights
- `border` - Border radius tokens
- `shadow` - Elevation shadows

### Error Handling Strategy
- Missing arguments: Check for undefined args before processing
- Invalid tokens: Return clear error with suggestions
- Unknown components: List available options in error message
- Invalid URIs: Provide descriptive error with valid patterns

## Making Changes

### Adding New Design Tokens
Edit `src/optics-data.ts` → `designTokens` array:
```typescript
{
  name: 'token-name',
  value: 'css-value',
  category: 'color' | 'spacing' | 'typography' | 'border' | 'shadow',
  description: 'Clear description'
}
```
Then: `npm run build` → `npm test`

### Adding New Components
Edit `src/optics-data.ts` → `components` array:
```typescript
{
  name: 'ComponentName',
  description: 'What the component does',
  tokens: ['token-1', 'token-2'], // Must reference existing tokens
  usage: 'Usage guidelines',
  examples: ['<code examples>']
}
```
Then: `npm run build` → `npm test`

### Adding New Tools
1. Add tool definition in `src/index.ts` → `ListToolsRequestSchema` handler
2. Implement tool logic in `CallToolRequestSchema` handler
3. Update documentation (README.md, EXAMPLES.md)
4. Build and test

### Adding New Documentation Sections
Edit `src/optics-data.ts` → `documentation` array, then update:
- Resource list in `ListResourcesRequestSchema` handler
- Resource reader in `ReadResourceRequestSchema` handler

## MCP Client Configuration

### Claude Desktop
Location:
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

Configuration:
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

**Important:** Use absolute paths, not `~` or relative paths.

### Testing Without a Client
```bash
npm start
# Server will output: "Optics MCP Server running on stdio"
# Press Ctrl+C to stop
```

## Code Style and Conventions

- **TypeScript**: Strict mode enabled, full type safety
- **Modules**: ES2022 modules with `.js` import extensions
- **Interfaces**: Exported for reusability (DesignToken, Component, Documentation)
- **Naming**: camelCase for functions, PascalCase for types/interfaces
- **Structure**: Clear separation between server logic and data

## Testing Strategy

The test suite (`src/test.ts`) validates:
- Design token structure and completeness
- Component-token relationship integrity
- Function correctness (stats, dependencies)
- Data consistency

**Before committing:** Always run `npm test` to ensure data integrity.

## Important Notes

- **Build Required:** TypeScript must be compiled to JavaScript in `dist/` before running
- **Token References:** All component token references must point to existing tokens
- **MCP Protocol:** Communicates via JSON-RPC over stdio (standard input/output)
- **Read-Only:** This server only provides read access to design system data
- **No External Dependencies:** All data is bundled (no API calls, no database)

## Project Files

- `src/index.ts` - MCP server implementation and request handlers
- `src/optics-data.ts` - All design tokens, components, and documentation
- `src/test.ts` - Data integrity and function tests
- `dist/` - Compiled JavaScript (generated by `npm run build`)
- `ARCHITECTURE.md` - Detailed architecture documentation
- `CONTRIBUTING.md` - Contribution guidelines
- `EXAMPLES.md` - Usage examples for each tool
- `QUICKSTART.md` - Quick start guide for users

## External References

- [Optics Design System](https://docs.optics.rolemodel.design) - Source documentation
- [Model Context Protocol](https://modelcontextprotocol.io) - Protocol specification
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk) - SDK documentation
