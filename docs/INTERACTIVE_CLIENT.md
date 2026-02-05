# Interactive Test Client

An interactive CLI tool for testing the Optics MCP Server's resources, prompts, and tools.

## Usage

Run the interactive test client:

```bash
npm run test:interactive
```

## Features

### 1. Test Resources
- Lists all available resources
- Supports URI templates (e.g., `{section}`, `{category}`)
- Shows resource content with smart truncation for large responses

### 2. Test Prompts
- Lists all available prompts
- Prompts for required and optional arguments
- Displays the generated prompt messages

### 3. Test Tools
- Lists all available tools
- Interactive argument collection with type awareness
- Shows tool execution results

## Example Session

```
🚀 Optics MCP Server - Interactive Test Client

Connecting to server...

✅ Connected to Optics MCP Server

════════════════════════════════════════════════════════════════════════════════
What would you like to test?
════════════════════════════════════════════════════════════════════════════════
1. Resources
2. Prompts
3. Tools
4. Exit

Enter your choice (1-4): 1

📚 Available Resources:

1. system-overview
   URI: file:///docs/SYSTEM_OVERVIEW.md
   Description: CRITICAL: Comprehensive guide to understanding the Optics token architecture.

2. documentation
   URI: optics://documentation/{section}
   Description: Documentation sections for the Optics design system

...
```

## Tips

- **Resources with templates**: When you select a resource with `{variable}` in the URI, you'll be prompted to provide a value
- **Optional arguments**: Press Enter to skip optional arguments when testing prompts or tools
- **Array/Object arguments**: Enter JSON syntax for complex argument types
- **Boolean arguments**: Enter `true` or `false` (or `1` for true, anything else for false)

## Exit

Press `4` at any main menu to exit the client.
