# Code Review: {{COMPONENT_TYPE}}

## Code to Review
```
{{CODE}}
```

## Review Checklist

### 1. Color Pairing Validation
Use `validate_color_pairing` to check all background/text color combinations:
- Every background color must have a matching "on" text color
- Verify contrast ratios meet WCAG AA (4.5:1 for normal text)

### 2. Redundant CSS Detection
Use `detect_redundant_css` to identify:
- Custom CSS that duplicates existing Optics components
- Patterns that could use Optics utility classes
- Unnecessary style overrides

### 3. Component Usage Validation
Check that Optics components are used correctly:
- Correct class names (e.g., `btn` not `button`)
- Proper BEM modifier syntax (e.g., `btn--primary`)
- Required sub-elements present

### 4. Token Usage
Verify design tokens are used instead of hard-coded values:
- Colors should use `var(--op-color-*)` not hex/rgb
- Spacing should use `var(--op-spacing-*)` not px values
- Typography should use `var(--op-font-*)` tokens

## Tools to Use
1. `validate_color_pairing` - Check all color combinations
2. `detect_redundant_css` - Find unnecessary custom CSS
3. `validate_token_usage` - Find hard-coded values
4. `calculate_contrast` - Verify specific color pairs

## Review Output Format

### Issues Found
List each issue with:
- **Severity**: Error / Warning / Info
- **Location**: Line number or selector
- **Issue**: Description of the problem
- **Fix**: How to resolve it

### Recommendations
- Optics components that could replace custom code
- Token suggestions for hard-coded values
- Accessibility improvements

### Summary
- Total issues: X
- Errors: X
- Warnings: X
- Overall assessment: Pass / Needs Work / Fail
