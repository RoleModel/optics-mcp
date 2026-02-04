# Quick Start Guide

Get started with the Optics MCP Server in 5 minutes!

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

## Installation

```bash
# Clone the repository
git clone https://github.com/RoleModel/optics-mcp.git
cd optics-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## Verify Installation

Run the test suite to ensure everything is working:

```bash
npm test
```

You should see output like:
```
✅ All tests passed!
The Optics MCP server data is working correctly.
```

## Configuration

### For Claude Desktop

1. Locate your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add the Optics server configuration:

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

3. Replace `/absolute/path/to/optics-mcp` with the actual path where you cloned the repository

4. Restart Claude Desktop

### For Other MCP Clients

Use the server via stdio transport:

```javascript
import { spawn } from 'child_process';

const server = spawn('node', ['path/to/optics-mcp/dist/index.js']);

// Send JSON-RPC requests via stdin
server.stdin.write(JSON.stringify({
  jsonrpc: "2.0",
  id: 1,
  method: "tools/list",
  params: {}
}) + '\n');

// Receive responses via stdout
server.stdout.on('data', (data) => {
  console.log('Response:', data.toString());
});
```

## Usage Examples

Once configured, you can use the Optics MCP server with your LLM:

### Example 1: Get a Design Token

**User**: "What is the color-primary token in Optics?"

**Assistant** (using `get_token` tool):
```json
{
  "name": "color-primary",
  "value": "#0066CC",
  "category": "color",
  "description": "Primary brand color used for main actions and emphasis"
}
```

### Example 2: Find Spacing Tokens

**User**: "Show me all spacing tokens"

**Assistant** (using `search_tokens` tool with category="spacing"):
```json
[
  { "name": "spacing-xs", "value": "4px", ... },
  { "name": "spacing-sm", "value": "8px", ... },
  { "name": "spacing-md", "value": "16px", ... },
  ...
]
```

### Example 3: Component Information

**User**: "What design tokens does the Button component use?"

**Assistant** (using `get_component_tokens` tool):
```json
{
  "component": "Button",
  "description": "Interactive button component for user actions",
  "tokenCount": 8,
  "tokens": [
    { "name": "color-primary", "value": "#0066CC", ... },
    { "name": "spacing-md", "value": "16px", ... },
    ...
  ]
}
```

## Available Tools

The server provides these tools:

1. **get_token** - Get details about a specific token
2. **search_tokens** - Search tokens by category or name
3. **get_token_usage_stats** - Get token statistics
4. **get_component_info** - Get component details
5. **list_components** - List all components
6. **get_component_tokens** - Get tokens used by a component
7. **search_documentation** - Search documentation

## Available Resources

Access documentation and data via URIs:

- `optics://documentation/introduction` - Introduction
- `optics://documentation/design-tokens` - Token docs
- `optics://tokens/all` - All tokens
- `optics://tokens/color` - Color tokens
- `optics://components/all` - All components

## Testing the Server

### Manual Test

Start the server directly:

```bash
npm start
```

You should see: `Optics MCP Server running on stdio`

Press Ctrl+C to stop.

### Run Tests

```bash
npm test
```

### Watch Mode (Development)

Auto-rebuild on file changes:

```bash
npm run watch
```

## Common Issues

### "Module not found" Error

**Solution**: Run `npm install` and `npm run build`

### Server Not Responding

**Solution**: 
1. Check Node.js version: `node --version` (should be 18+)
2. Rebuild: `npm run build`
3. Check logs in your MCP client

### Path Issues in Claude Desktop

**Solution**: Use absolute paths, not relative paths like `~/` or `./`

Example:
- ✅ `/Users/yourname/projects/optics-mcp/dist/index.js`
- ❌ `~/projects/optics-mcp/dist/index.js`

## Next Steps

- Read [EXAMPLES.md](EXAMPLES.md) for detailed usage examples
- Check [ARCHITECTURE.md](ARCHITECTURE.md) to understand the implementation
- See [CONTRIBUTING.md](CONTRIBUTING.md) to contribute

## Getting Help

- Check [README.md](README.md) for full documentation
- Review [EXAMPLES.md](EXAMPLES.md) for usage patterns
- Open an issue on GitHub for bugs or questions

## What's Included

After installation, you'll have:

- ✅ 40+ design tokens (colors, spacing, typography, etc.)
- ✅ 5 core components (Button, Card, Input, Alert, Typography)
- ✅ 7 MCP tools for querying the design system
- ✅ 13+ documentation resources
- ✅ Token usage tracking and statistics
- ✅ Full TypeScript implementation with type safety

Happy coding with Optics! 🎨
