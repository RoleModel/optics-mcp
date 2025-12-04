# Optics Design System - AI Comprehension Guide

**CRITICAL: Read this FIRST before using any Optics tools or data.**

This document explains the Optics Design System architecture in a way that AI agents can understand and use correctly.

## 🎯 The Core Problem

Most design systems use simple tokens like `--color-primary: #0066CC`. **Optics does NOT work this way.**

Optics uses a sophisticated HSL-based color system that generates colors dynamically from base values. This means:

❌ **WRONG**: Looking for `--color-primary` or `--op-color-primary`  
✅ **CORRECT**: Using `--op-color-primary-base` or the HSL components `--op-color-primary-h/s/l`

## 🏗️ Token Architecture

### Layer 1: HSL Base Values (Foundation)

These are the foundational tokens that define color hue, saturation, and lightness:

```css
/* Primary color base HSL values */
--op-color-primary-h: 216;      /* Hue */
--op-color-primary-s: 58%;      /* Saturation */
--op-color-primary-l: 48%;      /* Lightness */
```

**Color families available:**
- `primary` - Main brand color
- `neutral` - Grays and neutrals
- `alerts-warning` - Yellow/orange warnings
- `alerts-danger` - Red errors
- `alerts-info` - Blue information
- `alerts-notice` - Green success

### Layer 2: Scale Tokens (Light/Dark Adaptive)

From the base HSL values, Optics generates a scale of colors using the `light-dark()` CSS function:

**The Scale:**
```
plus-max    (lightest - light mode: 100%, dark mode: 12%)
plus-eight
plus-seven
plus-six
plus-five
plus-four
plus-three
plus-two
plus-one
base        (middle - the main color)
minus-one
minus-two
minus-three
minus-four
minus-five
minus-six
minus-seven
minus-eight
minus-max   (darkest - light mode: 0%, dark mode: 100%)
```

**Example tokens:**
```css
--op-color-primary-base
--op-color-primary-plus-five
--op-color-primary-minus-three
--op-color-neutral-plus-eight
--op-color-alerts-danger-base
```

### Layer 3: "On" Tokens (Text Colors)

For each scale token, there's a corresponding "on" token for text that appears ON that background:

```css
/* For backgrounds */
--op-color-primary-base
--op-color-primary-plus-five

/* For text ON those backgrounds */
--op-color-primary-on-base
--op-color-primary-on-plus-five
```

Each "on" token also has an `-alt` variant for secondary text:
```css
--op-color-primary-on-base
--op-color-primary-on-base-alt
```

## 📋 Complete Token Categories

### Color Tokens (500+ tokens)
**Structure:** `--op-color-{family}-{scale}[-on][-alt]`

**Base HSL** (18 tokens):
- `op-color-{family}-h/s/l` for each family

**Scale tokens** (17 per family × 6 families = 102):
- `op-color-{family}-plus-max` through `minus-max`

**On tokens** (34 per family × 6 families = 204):
- `op-color-{family}-on-{scale}` and `-alt` variants

**Semantic** (4 tokens):
- `op-color-white`
- `op-color-black`
- Plus opacity tokens

### Spacing Tokens (10 tokens)
**Structure:** `--op-space-{size}`

```css
--op-space-scale-unit (base: 1rem = 10px)
--op-space-3x-small   (2px)
--op-space-2x-small   (4px)
--op-space-x-small    (8px)
--op-space-small      (12px)
--op-space-medium     (16px)
--op-space-large      (20px)
--op-space-x-large    (24px)
--op-space-2x-large   (28px)
--op-space-3x-large   (40px)
--op-space-4x-large   (80px)
```

### Typography Tokens (40+ tokens)

**Font Family:**
```css
--op-font-family: 'Noto Sans', 'Noto Serif', sans-serif
```

**Font Sizes** (11 tokens):
```css
--op-font-scale-unit (base: 1rem = 10px)
--op-font-2x-small   (10px)
--op-font-x-small    (12px)
--op-font-small      (14px)
--op-font-medium     (16px)
--op-font-large      (18px)
--op-font-x-large    (20px)
--op-font-2x-large   (24px)
--op-font-3x-large   (28px)
--op-font-4x-large   (32px)
--op-font-5x-large   (36px)
--op-font-6x-large   (48px)
```

**Font Weights** (9 tokens):
```css
--op-font-weight-thin         (100)
--op-font-weight-extra-light  (200)
--op-font-weight-light        (300)
--op-font-weight-normal       (400)
--op-font-weight-medium       (500)
--op-font-weight-semi-bold    (600)
--op-font-weight-bold         (700)
--op-font-weight-extra-bold   (800)
--op-font-weight-black        (900)
```

**Line Heights** (8 tokens):
```css
--op-line-height-none      (0)
--op-line-height-densest   (1)
--op-line-height-denser    (1.15)
--op-line-height-dense     (1.3)
--op-line-height-base      (1.5)
--op-line-height-loose     (1.6)
--op-line-height-looser    (1.7)
--op-line-height-loosest   (1.8)
```

**Letter Spacing** (2 tokens):
```css
--op-letter-spacing-navigation
--op-letter-spacing-label
```

### Border Tokens (10 tokens)

**Border Radius:**
```css
--op-radius-small     (2px)
--op-radius-medium    (4px)
--op-radius-large     (8px)
--op-radius-x-large   (12px)
--op-radius-2x-large  (16px)
--op-radius-circle    (50%)
--op-radius-pill      (9999px)
```

**Border Width:**
```css
--op-border-width         (1px)
--op-border-width-large   (2px)
--op-border-width-x-large (4px)
```

### Shadow Tokens (5 tokens)
```css
--op-shadow-x-small
--op-shadow-small
--op-shadow-medium
--op-shadow-large
--op-shadow-x-large
```

## 🎨 How to Use Color Tokens

### ❌ WRONG - Don't Look For These:
```css
--color-primary
--op-color-primary
--color-text-primary
```

### ✅ CORRECT - Use These Instead:

**For backgrounds:**
```css
background: var(--op-color-primary-base);           /* Main primary color */
background: var(--op-color-primary-plus-five);      /* Lighter primary */
background: var(--op-color-neutral-plus-eight);     /* Light gray background */
```

**For text:**
```css
color: var(--op-color-primary-on-base);             /* Text on primary-base */
color: var(--op-color-neutral-on-plus-eight);       /* Text on light gray */
```

**For borders:**
```css
border-color: var(--op-color-neutral-plus-four);    /* Light border */
```

## 🔍 Tool Usage Guide

### Finding the Right Token

**Question: "What token should I use for a primary button background?"**

1. Use `search_tokens` with `namePattern: "primary-base"`
2. Result: `op-color-primary-base`
3. For the text on that button, use: `op-color-primary-on-base`

**Question: "What spacing should I use for padding?"**

1. Use `search_tokens` with `category: "spacing"`
2. Choose based on size: `op-space-medium` (16px) is common for padding

### Understanding Components

**All components use the REAL token names** (with `--op-` prefix).

When you call `get_component_info` for "Button", you'll see tokens like:
```json
{
  "tokens": [
    "--op-color-primary-base",
    "--op-color-primary-on-base",
    "--op-space-small",
    "--op-radius-medium"
  ]
}
```

## 🚨 Common Mistakes

### Mistake 1: Looking for Simple Color Names
❌ Searching for "color-primary"  
✅ Search for "primary-base" or "primary" and filter results

### Mistake 2: Ignoring the HSL System
❌ Treating colors as hex values  
✅ Understanding that colors are built from HSL components

### Mistake 3: Using Wrong Token Names
❌ `var(--color-primary)`  
✅ `var(--op-color-primary-base)`

### Mistake 4: Not Using "On" Tokens for Text
❌ Using arbitrary text colors on colored backgrounds  
✅ Using the matching `-on-` token: `--op-color-primary-on-base` on `--op-color-primary-base`

## 📚 Token Discovery Workflow

**Step 1: Identify what you need**
- Background color? Look for scale tokens (`-base`, `-plus-five`, etc.)
- Text color? Look for `-on-` tokens
- Spacing? Use `--op-space-{size}`
- Typography? Use `--op-font-{size}`, `--op-font-weight-{weight}`

**Step 2: Use search_tokens**
```javascript
// Find all primary color tokens
{ "namePattern": "primary" }

// Find all spacing tokens
{ "category": "spacing" }

// Find specific scale
{ "namePattern": "plus-five" }
```

**Step 3: Verify with get_token**
```javascript
{ "tokenName": "op-color-primary-base" }
```

**Step 4: Check component examples**
```javascript
{ "componentName": "Button" }
```

## 🎯 Quick Reference

### Most Common Tokens

**Backgrounds:**
- `--op-color-neutral-plus-eight` - Light background
- `--op-color-primary-base` - Primary button background
- `--op-color-alerts-danger-base` - Error state background

**Text:**
- `--op-color-neutral-on-plus-eight` - Text on light backgrounds
- `--op-color-primary-on-base` - Text on primary backgrounds

**Spacing:**
- `--op-space-x-small` (8px) - Tight spacing
- `--op-space-medium` (16px) - Standard spacing
- `--op-space-large` (20px) - Loose spacing

**Typography:**
- `--op-font-medium` (16px) - Body text
- `--op-font-weight-normal` (400) - Regular weight
- `--op-line-height-base` (1.5) - Body line height

**Borders:**
- `--op-radius-medium` (4px) - Standard border radius
- `--op-border-width` (1px) - Standard border

## 📖 Where to Learn More

1. **Token List**: Call `get_token_usage_stats` to see all categories
2. **Token Search**: Use `search_tokens` to explore
3. **Components**: Use `get_component_info` to see real-world usage
4. **Documentation**: Use `search_documentation` for guidelines

## 🎓 Mental Model Summary

Think of Optics tokens like this:

```
HSL Base Values (h/s/l)
    ↓
Scale Tokens (plus-max to minus-max)
    ↓
On Tokens (text colors for those scales)
```

The system is:
- **Predictable**: Every color family follows the same pattern
- **Adaptive**: Light/dark modes handled automatically
- **Accessible**: On tokens ensure proper contrast
- **Themeable**: Change base HSL values to create themes

**Always use the full token names with `--op-` prefix and the correct scale suffix.**
