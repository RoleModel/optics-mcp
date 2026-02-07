# Build {{TYPE}} Component

## Task
Create a {{VARIANT}} {{TYPE}} component using Optics design system.

## Optics Component Information

### HTML Structure
```html
{{EXAMPLE_HTML}}
```

### CSS Class
- **Base class**: `{{CLASS_NAME}}`
- **Modifiers**: {{MODIFIERS}}

### Documentation
{{DOCS_URL}}

## Design Token Requirements
{{TOKENS}}

## Usage Guidelines
{{USAGE}}

## Critical Rules (MUST FOLLOW)

### 1. Use Existing Optics Classes
- DO NOT write custom CSS for patterns that already exist in Optics
- Use the `{{CLASS_NAME}}` class as shown above
- Apply modifiers using BEM syntax: `{{CLASS_NAME}}--modifier`

### 2. Color Pairing Rule
- ALWAYS pair background and text colors correctly
- If using `--op-color-{family}-{scale}` for background, MUST use `--op-color-{family}-on-{scale}` for text
- Use `validate_color_pairing` tool to verify any custom color combinations

### 3. Validate Before Finalizing
- Run `detect_redundant_css` on any custom CSS to ensure you're not duplicating Optics patterns
- Check color contrast with `calculate_contrast` for accessibility

## Tools to Use
1. `get_component_html` - Get exact HTML structure for this component
2. `validate_color_pairing` - Verify color combinations meet requirements
3. `detect_redundant_css` - Check for unnecessary custom CSS

## Output Requirements
Provide the complete component implementation following the Optics patterns shown above.
