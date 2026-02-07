# Create Brand Theme: {{BRAND_NAME}}

## Task
Generate a complete Optics theme customized for {{BRAND_NAME}} using the provided brand colors.

## Brand Colors
- **Primary**: {{PRIMARY_COLOR}}
{{NEUTRAL_COLOR_SECTION}}

## Theme Generation Process

### Step 1: Convert Colors to HSL Tokens
Use `calculate_hsl_tokens` to convert the hex colors to Optics HSL format:
- Primary color → `--op-color-primary-h`, `--op-color-primary-s`, `--op-color-primary-l`
- Neutral color → `--op-color-neutral-h`, `--op-color-neutral-s`, `--op-color-neutral-l`

### Step 2: View Generated Color Scale
Use `get_color_scale` with "primary" to see the full palette that will be generated from your primary color.

### Step 3: Validate Accessibility
Use `calculate_contrast` to verify key color combinations meet WCAG requirements:
- Primary background with white text
- Primary text on white background
- Neutral variations for UI elements

## Critical Rules

### Color Pairing
All background colors MUST be paired with their matching "on" text colors:
- `--op-color-primary-plus-two` background → `--op-color-primary-on-plus-two` text
- `--op-color-neutral-plus-five` background → `--op-color-neutral-on-plus-five` text

### HSL System
Optics uses HSL (Hue, Saturation, Lightness) for colors:
- Only the H, S, L base values need to be customized
- The scale system (plus-1, plus-2, minus-1, etc.) is calculated automatically
- This ensures consistent color relationships across the palette

## Tools to Use
1. `calculate_hsl_tokens` - Convert hex to HSL and generate theme
2. `get_color_scale` - View the full color palette
3. `calculate_contrast` - Verify accessibility
4. `validate_color_pairing` - Check color pair validity

## Expected Output
A complete CSS file with:
1. HSL base token overrides for brand colors
2. Any additional customizations needed
3. Documentation of the color system
