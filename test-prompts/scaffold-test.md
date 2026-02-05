# MCP Scaffolding Test Prompt

Use this prompt to test the optics-mcp server. Run it **with** and **without** the MCP enabled to compare results.

---

## Test Prompt

```
Create a metrics dashboard using the Optics design system.

## Context
- **Design System**: Optics by RoleModel Software
- **Docs**: https://docs.optics.rolemodel.design
- **Token Prefix**: `--op-` (e.g., `--op-color-primary-base`, `--op-space-medium`)
- **Tech Stack**: Vite + vanilla HTML/CSS/JS

## Requirements

### Layout
- Sidebar navigation with logo, nav items, and user avatar at bottom
- Main content area with header and grid of cards
- Use Optics layout utilities (stack, cluster, split, container)

### Components needed
- Sidebar with active state styling
- 4 metric cards showing: Users, Revenue, Orders, Conversion Rate
- Each card has: icon, label, value, and trend indicator (up/down arrow with percentage)
- Simple bar chart placeholder area
- Data table with 5 rows showing recent orders

### Theming
- Use a custom primary color: `#6366f1` (indigo)
- Configure the HSL base tokens to enable the full color scale
- Support automatic dark mode via `prefers-color-scheme`

### Icons
- Use the Phosphor icon library
- Icons needed: house, users, currency-dollar, shopping-cart, chart-line, arrow-up, arrow-down, gear, sign-out

## Deliverables
1. Complete Vite project structure
2. HTML using Optics component classes and layout utilities
3. CSS that properly overrides the primary color HSL tokens
4. Phosphor icons import configured correctly
5. Should run with `npm run dev`
```

---

## Success Criteria

### WITHOUT MCP (expect failures)

AI will likely:
- ❌ Invent layout classes like `.op-sidebar`, `.op-grid`, `.dashboard-container`
- ❌ Use wrong token names: `--op-primary`, `--op-color-indigo-500`, `--op-spacing-4`
- ❌ Hardcode the indigo color instead of setting HSL base tokens
- ❌ Miss the HSL theming system entirely (`--op-color-primary-h`, `-s`, `-l`)
- ❌ Wrong icon setup: use wrong prefix, wrong import path, or invent classes
- ❌ Not use `-on-` tokens for text on colored backgrounds
- ❌ Invent component classes that don't exist in Optics

### WITH MCP (expect success)

AI should:
- ✅ Use real layout utilities: `.stack`, `.cluster`, `.split`, `.container`
- ✅ Set HSL tokens correctly: `--op-color-primary-h: 239; --op-color-primary-s: 84%; --op-color-primary-l: 67%;`
- ✅ Use scale tokens: `--op-color-primary-base`, `--op-color-primary-plus-five`
- ✅ Use on-tokens: `--op-color-primary-on-base` for text on primary backgrounds
- ✅ Correct Phosphor setup: `@import '@rolemodel/optics/dist/css/addons/fonts/phosphor_icons';`
- ✅ Correct icon markup: `<i class="icon ph ph-house"></i>`
- ✅ Use real spacing: `--op-space-small`, `--op-space-medium`, `--op-space-large`
- ✅ Use real component patterns from Optics docs

---

## Scoring Rubric

| Category | Criterion | Points |
|----------|-----------|--------|
| **Theming** | Sets HSL base tokens (h, s, l) correctly | 15 |
| | Uses color scale tokens (base, plus-*, minus-*) | 10 |
| | Uses -on- tokens for text on backgrounds | 10 |
| | Dark mode works via color-scheme | 5 |
| **Layout** | Uses real Optics layout utilities | 10 |
| | Correct container/spacing usage | 5 |
| **Icons** | Correct Phosphor import path | 10 |
| | Correct icon markup (`icon ph ph-*`) | 10 |
| | Uses available modifiers correctly | 5 |
| **Components** | Card structure follows Optics patterns | 5 |
| | Table structure follows Optics patterns | 5 |
| | Sidebar follows Optics patterns | 5 |
| **Tokens** | No hallucinated token names | 5 |
| | Uses correct spacing tokens | 5 |
| | Uses correct typography tokens | 5 |
| **Total** | | **100** |

---

## Expected Token Usage

### Theming (converting #6366f1 to HSL)

```css
:root {
  --op-color-primary-h: 239;
  --op-color-primary-s: 84%;
  --op-color-primary-l: 67%;
}
```

### Icon Import

```css
@import '@rolemodel/optics';
@import '@rolemodel/optics/dist/css/addons/fonts/phosphor_icons';
```

### Icon Markup

```html
<i class="icon ph ph-house"></i>
<i class="icon ph ph-users"></i>
<i class="icon ph ph-currency-dollar"></i>
<i class="icon ph ph-arrow-up icon--small"></i>
```

### Layout Structure

```html
<div class="split">
  <aside class="sidebar stack">...</aside>
  <main class="container stack">
    <div class="cluster">...</div>
    <div class="grid">...</div>
  </main>
</div>
```
