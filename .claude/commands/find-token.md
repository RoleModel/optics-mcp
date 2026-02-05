# Find Optics Token

Search for an Optics design token by name or category.

## Instructions

1. Use the `search_tokens` tool from the optics-mcp server
2. If $ARGUMENTS contains a category (color, spacing, typography, border, shadow), filter by category
3. Otherwise, search by name pattern
4. Return the matching tokens with their values and descriptions

## Examples

- `/find-token primary` → finds all tokens with "primary" in the name
- `/find-token spacing` → lists all spacing tokens
- `/find-token plus-five` → finds scale tokens at +5 level
