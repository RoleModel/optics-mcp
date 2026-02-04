# Optics MCP Server Examples

This document provides examples of how to use the Optics MCP server tools and resources.

## Tool Usage Examples

### 1. Get Token Information

Get details about a specific design token:

```typescript
// Tool: get_token
{
  "tokenName": "color-primary"
}

// Response:
{
  "name": "color-primary",
  "value": "#0066CC",
  "category": "color",
  "description": "Primary brand color used for main actions and emphasis"
}
```

### 2. Search Tokens by Category

Find all color tokens:

```typescript
// Tool: search_tokens
{
  "category": "color"
}

// Returns all color-related design tokens
```

Search for spacing tokens with "lg" in the name:

```typescript
// Tool: search_tokens
{
  "category": "spacing",
  "namePattern": "lg"
}

// Returns: spacing-lg, spacing-xl, etc.
```

### 3. Get Token Usage Statistics

Get an overview of all design tokens:

```typescript
// Tool: get_token_usage_stats
{}

// Response:
{
  "totalTokens": 45,
  "categories": {
    "color": 10,
    "spacing": 6,
    "typography": 17,
    "border": 4,
    "shadow": 3
  }
}
```

### 4. Get Component Information

Get details about the Button component:

```typescript
// Tool: get_component_info
{
  "componentName": "Button"
}

// Response:
{
  "name": "Button",
  "description": "Interactive button component for user actions",
  "tokens": [
    "color-primary",
    "color-text-primary",
    "spacing-sm",
    "spacing-md",
    "font-size-md",
    "font-weight-medium",
    "border-radius-md",
    "shadow-sm"
  ],
  "usage": "Use buttons for primary user actions...",
  "examples": [...]
}
```

### 5. List All Components

Get a list of all available components:

```typescript
// Tool: list_components
{}

// Response:
[
  {
    "name": "Button",
    "description": "Interactive button component for user actions",
    "tokenCount": 8
  },
  {
    "name": "Card",
    "description": "Container component for grouping related content",
    "tokenCount": 6
  },
  // ... more components
]
```

### 6. Get Component Token Dependencies

Find which design tokens a component uses:

```typescript
// Tool: get_component_tokens
{
  "componentName": "Card"
}

// Response:
{
  "component": "Card",
  "description": "Container component for grouping related content",
  "tokenCount": 6,
  "tokens": [
    {
      "name": "color-surface",
      "value": "#F8F9FA",
      "category": "color",
      "description": "Surface color for cards and panels"
    },
    // ... other tokens
  ]
}
```

### 7. Search Documentation

Search for accessibility information:

```typescript
// Tool: search_documentation
{
  "query": "accessibility"
}

// Returns all documentation sections mentioning accessibility
```

## Resource Access Examples

### Reading Documentation Resources

```typescript
// Resource URI: optics://documentation/color-system
// Returns: Complete color system documentation

// Resource URI: optics://documentation/typography
// Returns: Typography guidelines and best practices
```

### Accessing Token Data

```typescript
// Resource URI: optics://tokens/all
// Returns: JSON array of all design tokens

// Resource URI: optics://tokens/spacing
// Returns: JSON array of spacing tokens only
```

### Getting Component Data

```typescript
// Resource URI: optics://components/all
// Returns: JSON array of all components with their token dependencies
```

## Common Use Cases

### Use Case 1: Building a New Component

When building a new component, query which tokens to use:

1. Search for relevant color tokens:
   ```typescript
   { "category": "color" }
   ```

2. Find appropriate spacing:
   ```typescript
   { "category": "spacing" }
   ```

3. Look at similar component examples:
   ```typescript
   { "componentName": "Button" }
   ```

### Use Case 2: Understanding Token Impact

Find which components are affected by a token change:

1. Get token details:
   ```typescript
   { "tokenName": "color-primary" }
   ```

2. Search components using this token (manually check each component)

### Use Case 3: Learning the Design System

1. Read introduction:
   - Resource: `optics://documentation/introduction`

2. Explore design tokens:
   - Resource: `optics://tokens/all`

3. Review components:
   - Tool: `list_components`

4. Get specific component details:
   - Tool: `get_component_info` with componentName

## Integration Examples

### Claude Desktop Configuration

Add to your Claude Desktop config file:

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

### Command Line Testing

Test the server using stdio:

```bash
cd optics-mcp
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node dist/index.js
```

## Tips

1. **Token Names**: All token names follow a consistent pattern: `{category}-{name}[-{modifier}]`
   - Examples: `color-primary`, `spacing-lg`, `font-size-xl`

2. **Component Dependencies**: Each component lists exactly which tokens it depends on, making it easy to understand the impact of token changes.

3. **Categories**: Tokens are organized into categories:
   - `color`: Brand colors, semantic colors, text colors
   - `spacing`: Layout spacing values
   - `typography`: Font families, sizes, weights, line heights
   - `border`: Border radius values
   - `shadow`: Box shadow definitions

4. **Search Patterns**: Use namePattern with partial matches to find related tokens:
   - Pattern `"primary"` finds: `color-primary`, `color-text-primary`
   - Pattern `"xl"` finds: `spacing-xl`, `font-size-xl`, etc.
