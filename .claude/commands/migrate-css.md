# Migrate to Optics Tokens

Convert hard-coded CSS values to Optics design tokens.

## Instructions

Invoke the `migrate-to-tokens` prompt from the optics-mcp server.

Pass the CSS code from $ARGUMENTS or current selection.

## Example

Input:
```css
.button {
  background: #2563eb;
  padding: 16px 24px;
  border-radius: 4px;
}
```

Output:
```css
.button {
  background: var(--op-color-primary-base);
  padding: var(--op-space-medium) var(--op-space-x-large);
  border-radius: var(--op-radius-medium);
}
```
