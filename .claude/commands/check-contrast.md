# Check Color Contrast

Verify WCAG contrast ratio between two Optics color tokens.

## Instructions

1. Use the `check_contrast` tool from the optics-mcp server
2. Parse $ARGUMENTS for foreground and background token names
3. Report the contrast ratio and WCAG compliance (AA/AAA)

## Usage

```
/check-contrast primary-on-base primary-base
/check-contrast neutral-on-plus-eight neutral-plus-eight
```

If tokens aren't found, suggest similar token names using `search_tokens`.
