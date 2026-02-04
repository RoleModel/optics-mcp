# Architecture Documentation

## Overview

The Optics MCP Server is built using the Model Context Protocol (MCP) SDK to provide LLMs with structured access to the Optics Design System. This document explains the architecture, design decisions, and implementation details.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│                   MCP Client (LLM)                  │
│              (e.g., Claude Desktop)                 │
└────────────────────┬────────────────────────────────┘
                     │ MCP Protocol (JSON-RPC over stdio)
                     │
┌────────────────────▼────────────────────────────────┐
│              Optics MCP Server                      │
│  ┌──────────────────────────────────────────────┐  │
│  │          Server Core (index.ts)              │  │
│  │  - Request handlers                          │  │
│  │  - Tool implementations                      │  │
│  │  - Resource providers                        │  │
│  └──────────────────┬───────────────────────────┘  │
│                     │                                │
│  ┌──────────────────▼───────────────────────────┐  │
│  │      Data Layer (optics-data.ts)            │  │
│  │  - Design Tokens                             │  │
│  │  - Components                                │  │
│  │  - Documentation                             │  │
│  │  - Utility Functions                         │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

## Components

### 1. Server Core (`src/index.ts`)

The main server implementation that:
- Sets up the MCP server with stdio transport
- Registers request handlers for tools and resources
- Implements the business logic for each tool
- Handles errors and edge cases

**Key Features:**
- Uses TypeScript for type safety
- Implements all MCP protocol requirements
- Provides comprehensive error messages
- Supports both synchronous and asynchronous operations

### 2. Data Layer (`src/optics-data.ts`)

Contains all design system data:

**Design Tokens:**
- Structured as typed objects with name, value, category, and description
- Categorized into: color, spacing, typography, border, shadow
- Total of 40+ tokens covering core design needs

**Components:**
- Linked to their dependent design tokens
- Include usage guidelines and examples
- Cover common UI patterns: Button, Card, Input, Alert, Typography

**Documentation:**
- Organized by section (introduction, getting-started, etc.)
- Links to relevant tokens for each topic
- Provides comprehensive design system guidance

**Utility Functions:**
- `getTokenUsageStats()`: Aggregate statistics
- `getComponentTokenDependencies()`: Component-token mapping

### 3. Test Suite (`src/test.ts`)

Simple verification tests to ensure:
- Data integrity
- Function correctness
- Basic server functionality

## MCP Protocol Implementation

### Tools

The server implements 7 tools:

1. **get_token** - Retrieve specific token details
2. **search_tokens** - Filter tokens by category/pattern
3. **get_token_usage_stats** - Aggregate statistics
4. **get_component_info** - Component details
5. **list_components** - All components overview
6. **get_component_tokens** - Component dependencies
7. **search_documentation** - Doc search

Each tool:
- Accepts structured JSON input
- Returns consistent JSON responses
- Includes validation and error handling

### Resources

The server exposes 13+ resources via URI scheme:

**URI Pattern:** `optics://{type}/{identifier}`

**Types:**
- `documentation/*` - Design system docs
- `tokens/*` - Token data
- `components/*` - Component data

Resources provide:
- Consistent URI-based access
- Structured data (JSON or text)
- Proper MIME types

## Design Decisions

### TypeScript Choice

**Rationale:**
- Type safety reduces runtime errors
- Better IDE support for development
- Aligns with MCP SDK ecosystem
- Strong typing for design system data

### Data Structure

**Token Structure:**
```typescript
{
  name: string;        // Unique identifier
  value: string;       // Actual CSS/design value
  category: string;    // Grouping (color, spacing, etc.)
  description: string; // Human-readable explanation
}
```

**Benefits:**
- Self-documenting
- Easy to query and filter
- Extensible for future needs

### Component-Token Relationship

Each component explicitly declares its token dependencies:
- Enables impact analysis
- Facilitates consistency checking
- Helps understand component requirements

### Resource vs Tool Pattern

**Resources** for:
- Static, well-known data
- Documentation sections
- Complete datasets

**Tools** for:
- Dynamic queries
- Filtered results
- Computed information

## Extensibility

### Adding New Design Tokens

1. Add token object to `designTokens` array
2. Ensure proper category assignment
3. Rebuild: `npm run build`

```typescript
{
  name: 'new-token-name',
  value: 'token-value',
  category: 'appropriate-category',
  description: 'Clear description'
}
```

### Adding New Components

1. Add component to `components` array
2. List all dependent tokens
3. Include usage guidelines
4. Rebuild

### Adding New Tools

1. Add tool definition to `ListToolsRequestSchema` handler
2. Implement tool logic in `CallToolRequestSchema` handler
3. Add documentation and examples

### Adding New Resources

1. Add resource metadata to `ListResourcesRequestSchema` handler
2. Implement resource reader in `ReadResourceRequestSchema` handler
3. Define appropriate URI pattern

## Token Usage Tracking

The server tracks token usage through:

1. **Direct References**: Components list their token dependencies
2. **Category Analysis**: Statistics by token category
3. **Search Patterns**: Find tokens by name/category

**Future Enhancements:**
- Usage frequency tracking
- Deprecated token warnings
- Token version management

## Performance Considerations

**Current Implementation:**
- All data loaded in memory (suitable for design systems)
- No external API calls
- Fast query responses
- Minimal dependencies

**Scalability:**
- Current approach handles hundreds of tokens efficiently
- For larger systems, consider:
  - Lazy loading of documentation
  - Database backend for tokens
  - Caching strategies

## Security

**Current Posture:**
- No authentication (local MCP server)
- No sensitive data stored
- Read-only operations only
- No file system access beyond bundled data

**Appropriate for:**
- Local development environments
- Trusted LLM clients
- Non-sensitive design system data

## Error Handling

The server implements comprehensive error handling:

1. **Missing Arguments**: Check for undefined args
2. **Invalid Tokens**: Clear error messages with suggestions
3. **Unknown Components**: List available options
4. **Invalid URIs**: Descriptive error messages

## Testing Strategy

**Current Tests:**
- Data integrity validation
- Function correctness
- Basic integration tests

**Future Testing:**
- Full MCP protocol compliance
- Tool input validation
- Resource URI coverage
- Performance benchmarks

## Development Workflow

1. **Setup**: `npm install`
2. **Build**: `npm run build`
3. **Test**: `npm test`
4. **Watch**: `npm run watch` (auto-rebuild)
5. **Start**: `npm start`

## Integration Points

### Claude Desktop

Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "optics": {
      "command": "node",
      "args": ["/path/to/dist/index.js"]
    }
  }
}
```

### Custom MCP Clients

Use stdio transport to communicate:
```typescript
const server = spawn('node', ['dist/index.js']);
// Send JSON-RPC requests via stdin
// Receive responses via stdout
```

## Future Enhancements

1. **Interactive Examples**: Code playground integration
2. **Version History**: Track token changes over time
3. **Theme Support**: Multiple color schemes
4. **Component Generator**: Generate component code
5. **Design Token Export**: Export to CSS, SCSS, JSON
6. **Validation Tools**: Check design token usage
7. **Analytics**: Track most-used tokens/components
8. **Visual Preview**: Generate token/component previews

## Maintenance

### Regular Updates

- Keep dependencies updated
- Add new Optics design tokens as they're created
- Update documentation to match live design system
- Sync with https://docs.optics.rolemodel.design

### Monitoring

- Watch for MCP SDK updates
- Monitor client feedback
- Track usage patterns

## References

- [Model Context Protocol Specification](https://modelcontextprotocol.io)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [Optics Design System](https://docs.optics.rolemodel.design)
