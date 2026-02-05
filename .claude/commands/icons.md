# Configure Optics Icons

Select and configure an icon library for your project.

## Instructions

Invoke the `configure-icons` prompt from the optics-mcp server.

**Arguments from $ARGUMENTS:**
- Library name (material, phosphor, tabler, feather, lucide)
- Or requirements: "need fill", "need weight", "small bundle"

## Available Libraries

| Library | Fill | Weight | Emphasis | Size | Notes |
|---------|------|--------|----------|------|-------|
| Material Symbols | ✓ | ✓ | ✓ | ✓ | Default, full features |
| Phosphor | ✓ | ✓ | ✗ | ✓ | Has duotone option |
| Tabler | ✓ | ✗ | ✗ | ✓ | Clean, simple |
| Feather | ✗ | ✗ | ✗ | ✓ | Minimal, small |
| Lucide | ✗ | ✗ | ✗ | ✓ | Feather fork, more icons |

## Examples

```
/icons phosphor
/icons need fill and duotone
/icons smallest bundle
```
