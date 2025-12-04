# Installation Guide

This guide explains how to configure the Optics MCP server with various MCP clients.

## Prerequisites

- Node.js 18 or later (for `npx`)
- An MCP-compatible client (see below for supported clients)

## Zero-Install Setup (Recommended)

**No installation required!** MCP clients can run the server directly using `npx`, which automatically downloads and caches the package.

### For Public npm Registry (Coming Soon)

Once published to npm, use:
```json
{
  "command": "npx",
  "args": ["-y", "optics-mcp"]
}
```

### For GitHub Packages (Current)

Authenticate once:
```bash
echo "//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN" >> ~/.npmrc
echo "@rolemodel:registry=https://npm.pkg.github.com" >> ~/.npmrc
```

Then use in config:
```json
{
  "command": "npx",
  "args": ["-y", "optics-mcp"]
}
```

## Alternative Installation Methods

### Option 1: Install Globally

```bash
npm install -g optics-mcp
```

Then use `optics-mcp` as the command.

### Option 2: Install from Source (Development)

```bash
git clone https://github.com/RoleModel/optics-mcp.git
cd optics-mcp
npm install
npm run build
```

Then point to `/absolute/path/to/optics-mcp/dist/index.js`.

## Client Configuration

### Claude Desktop

**Configuration File Location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Recommended (zero-install with npx):**

```json
{
  "mcpServers": {
    "optics": {
      "command": "npx",
      "args": ["-y", "optics-mcp"]
    }
  }
}
```

**Alternative configurations:**

<details>
<summary>If installed globally</summary>

```json
{
  "mcpServers": {
    "optics": {
      "command": "optics-mcp"
    }
  }
}
```
</details>

<details>
<summary>If installed from source</summary>

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
</details>

**Steps:**
1. Open/create the config file at the location above
2. Add the `optics` server configuration
3. Restart Claude Desktop
4. The Optics MCP tools will appear in the MCP panel

### Claude Code (CLI)

**Recommended (zero-install with npx):**
```bash
claude mcp add optics --command "npx" --args "-y" --args "optics-mcp"
```

**Alternative if installed globally:**
```bash
claude mcp add optics --command "optics-mcp"
```

**List installed servers:**
```bash
claude mcp list
```

**Remove the server:**
```bash
claude mcp remove optics
```

### VS Code with Continue Extension

**Configuration File:** `.continue/config.json` in your project or `~/.continue/config.json` globally

**Recommended (zero-install with npx):**

```json
{
  "mcpServers": {
    "optics": {
      "command": "npx",
      "args": ["-y", "optics-mcp"],
      "env": {}
    }
  }
}
```

**Steps:**
1. Install the [Continue extension](https://marketplace.visualstudio.com/items?itemName=Continue.continue)
2. Open Command Palette (Cmd+Shift+P / Ctrl+Shift+P)
3. Run "Continue: Open Config"
4. Add the `optics` server under `mcpServers`
5. Reload VS Code

### VS Code with Cline Extension

**Configuration:** Through the Cline extension settings UI

**Steps:**
1. Install the [Cline extension](https://marketplace.visualstudio.com/items?itemName=saoudrizwan.claude-dev)
2. Open Cline settings
3. Navigate to MCP Servers section
4. Add a new server:
   - Name: `optics`
   - Command: `npx`
   - Args: `-y optics-mcp`
5. Save and restart

### Zed Editor

**Configuration File:** `~/.config/zed/settings.json`

**Recommended (zero-install with npx):**

```json
{
  "context_servers": {
    "optics": {
      "command": {
        "path": "npx",
        "args": ["-y", "optics-mcp"]
      }
    }
  }
}
```

**Steps:**
1. Open Zed settings (Cmd+, / Ctrl+,)
2. Add the server configuration
3. Restart Zed
4. The Optics tools will be available in context

### Cursor

**Configuration File:** `~/.cursor/config.json` or project `.cursor/config.json`

**Recommended (zero-install with npx):**

```json
{
  "mcpServers": {
    "optics": {
      "command": "npx",
      "args": ["-y", "optics-mcp"]
    }
  }
}
```

### Cody (Sourcegraph)

**Configuration:** Through workspace settings

**Recommended (zero-install with npx):**

**Add to `.vscode/settings.json`:**

```json
{
  "cody.experimental.mcp.servers": {
    "optics": {
      "command": "npx",
      "args": ["-y", "optics-mcp"]
    }
  }
}
```

## Verifying Installation

After configuring your client, verify the Optics MCP server is working:

### Check Available Tools

Ask your AI assistant: "What MCP tools are available from Optics?"

You should see these tools listed:
- `get_token` - Get design token details
- `search_tokens` - Search for tokens
- `get_component_info` - Get component information
- `list_components` - List all components
- `get_component_tokens` - Get component token dependencies
- `search_documentation` - Search Optics docs
- `generate_theme` - Generate custom theme (NEW)
- `validate_token_usage` - Validate code for token usage (NEW)
- `replace_hard_coded_values` - Auto-replace with tokens (NEW)
- `check_contrast` - WCAG contrast validation (NEW)
- `suggest_token_migration` - Migration suggestions (NEW)
- `generate_component_scaffold` - Generate React component (NEW)

### Test a Tool

Try: "Get the details for the color-primary token"

## Troubleshooting

### Server Not Starting

**Check Node.js version:**
```bash
node --version  # Should be 18+
```

**Test the server manually:**
```bash
node /path/to/optics-mcp/dist/index.js
# Should output: "Optics MCP Server running on stdio"
```

### Tools Not Appearing

1. **Verify config file location** - Check your client's documentation for the correct path
2. **Use absolute paths** - Don't use `~` or relative paths in configuration
3. **Check JSON syntax** - Validate your config file with a JSON linter
4. **Restart the client** - Most clients require a full restart to load MCP servers

### Permission Errors

```bash
# Make the script executable (if installed from source)
chmod +x /path/to/optics-mcp/dist/index.js
```

### GitHub Packages Authentication

If installation from GitHub Packages fails with 401:

1. Create a GitHub Personal Access Token with `read:packages` scope
2. Add to `.npmrc`:
   ```
   //npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE
   ```

## Development Setup

For contributing or local development:

```bash
# Clone and build
git clone https://github.com/RoleModel/optics-mcp.git
cd optics-mcp
npm install
npm run build

# Run tests
npm test

# Watch mode for development
npm run watch
```

## Getting Help

- **Issues**: [GitHub Issues](https://github.com/RoleModel/optics-mcp/issues)
- **Documentation**: [Optics Design System](https://docs.optics.rolemodel.design)
- **MCP Protocol**: [Model Context Protocol](https://modelcontextprotocol.io)

## Next Steps

- Read [TOOLS.md](./TOOLS.md) for detailed tool usage examples
- Check [EXAMPLES.md](./EXAMPLES.md) for common workflows
- Review the [Optics documentation](https://docs.optics.rolemodel.design) for design system guidance
