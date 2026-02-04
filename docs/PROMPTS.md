# Optics MCP Prompts

MCP prompts are pre-configured prompt templates that help you work efficiently with the Optics Design System. Each prompt is designed for a specific task and comes with built-in context about Optics tokens and components.

## Available Prompts

### 1. create-themed-component
Generate a component styled with Optics design tokens.

**Arguments:**
- `componentType` (required): Type of component (button, card, form, alert, modal, tooltip, badge, table, navbar, sidebar)
- `variant` (optional): Component variant (primary, secondary, danger, etc.)
- `framework` (optional): Framework to use (react, vue, svelte, html)

**Use case:** When you need to quickly scaffold a new component using proper Optics tokens.

**Example in Claude Desktop:**
```
Use the create-themed-component prompt with componentType="button", variant="primary", framework="react"
```

---

### 2. migrate-to-tokens
Convert hard-coded CSS values to Optics design tokens.

**Arguments:**
- `code` (required): CSS or component code with hard-coded values

**Use case:** When refactoring existing code to use the design system.

**Example:**
```
Use the migrate-to-tokens prompt with this code:
.my-button {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  color: #0066CC;
}
```

The prompt will guide the LLM to replace hard-coded values with tokens like:
- `8px` → `var(--op-space-x-small)`
- `12px` → `var(--op-space-small)`
- `4px` → `var(--op-radius-medium)`
- `14px` → `var(--op-font-small)`

---

### 3. accessible-color-combo
Suggest accessible foreground/background color token combinations.

**Arguments:**
- `colorFamily` (required): Color family (primary, neutral, danger, warning, info, notice)
- `wcagLevel` (optional): WCAG level (AA or AAA, defaults to AA)

**Use case:** When choosing color combinations that meet accessibility standards.

**Example:**
```
Use the accessible-color-combo prompt with colorFamily="primary", wcagLevel="AA"
```

This will suggest combinations like:
- Text: `var(--op-color-primary-on-base)` on background: `var(--op-color-primary-base)`
- Text: `var(--op-color-primary-on-plus-eight)` on background: `var(--op-color-primary-plus-eight)`

---

### 4. explain-token-system
Explain how a specific token category works in Optics.

**Arguments:**
- `category` (required): Token category (color, spacing, typography, border, shadow)

**Use case:** When learning how to use a specific type of token in the design system.

**Example:**
```
Use the explain-token-system prompt with category="spacing"
```

This provides a detailed explanation of:
- How the spacing scale works (base-10 rem units)
- When to use each spacing token
- Common patterns and best practices
- Calc-based token structure

---

### 5. design-review
Review a design or component for Optics token usage and best practices.

**Arguments:**
- `code` (required): Component code to review
- `componentType` (optional): Type of component being reviewed

**Use case:** When you want feedback on whether your component follows Optics patterns correctly.

**Example:**
```
Use the design-review prompt with:
componentType="card"
code="<div class=\"card\" style=\"padding: 16px; border-radius: 8px;\">Content</div>"
```

The prompt checks for:
1. Hard-coded values that should use tokens
2. Proper token usage and naming
3. Accessibility (color contrast, focus states)
4. Consistency with Optics patterns
5. Missing or incorrect tokens

---

## Using Prompts in Different Clients

### Claude Desktop
Prompts appear in the prompt library. You can select them from the UI and fill in the arguments.

### Claude Code CLI
```bash
# List available prompts
claude mcp prompt list optics

# Use a prompt
claude mcp prompt get optics create-themed-component --arg componentType=button --arg framework=react
```

### Cline (VS Code)
Prompts appear in the MCP prompt picker. Select the prompt and fill in the required arguments in the UI.

### Programmatic Usage
```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

const response = await client.getPrompt({
  name: 'create-themed-component',
  arguments: {
    componentType: 'button',
    variant: 'primary',
    framework: 'react'
  }
});
```

---

## Combining Prompts with Tools

Prompts work best when combined with the MCP tools. For example:

**Pattern: Migrate and Validate**
1. Use `migrate-to-tokens` prompt to get migration guidance
2. Use `validate_token_usage` tool to find hard-coded values
3. Use `replace_hard_coded_values` tool to auto-fix issues
4. Use `design-review` prompt for final validation

**Pattern: Accessible Design**
1. Use `accessible-color-combo` prompt to get color suggestions
2. Use `check_contrast` tool to validate specific combinations
3. Use `create-themed-component` prompt to build the component

**Pattern: Learning the System**
1. Use `explain-token-system` prompt to understand a category
2. Use `search_tokens` tool to explore available tokens
3. Use `get_component_info` tool to see real-world usage examples

---

## Tips

- **Prompts provide context**, tools provide data. Use them together.
- **Start with prompts** when you're learning or need guidance
- **Use tools directly** when you know exactly what data you need
- **Chain prompts** - output from one prompt can inform the next
- **Framework-agnostic** - most prompts work with any framework, just specify your preference

---

## Advanced: Custom Workflows

You can create your own workflows by combining prompts:

**Full Component Build:**
```
1. explain-token-system (category="color")
2. accessible-color-combo (colorFamily="primary")
3. create-themed-component (componentType="button")
4. design-review (code=<generated-code>)
```

**Legacy Code Migration:**
```
1. design-review (code=<old-code>)
2. migrate-to-tokens (code=<old-code>)
3. validate_token_usage (code=<new-code>)
4. check_contrast (foreground="...", background="...")
```

---

## See Also

- [TOOLS.md](./TOOLS.md) - Documentation for all 14 MCP tools
- [INSTALLATION.md](./INSTALLATION.md) - Setup instructions for different IDEs
- [Optics Design System](https://docs.optics.rolemodel.design) - Full design system documentation
