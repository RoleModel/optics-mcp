const fs = require('fs');
const path = require('path');

// Read the CSS file with light-dark() color scales
const cssPath = '/Users/dallas/Development/optics/src/core/tokens/scale_color_tokens.css';
const cssContent = fs.readFileSync(cssPath, 'utf-8');

// Extract primary color scale tokens (as example - pattern repeats for other colors)
const tokens = [];
// Match multiline light-dark() values
const regex = /--(op-color-primary-[^:]+):\s*light-dark\(\s*([\s\S]*?)\s*,\s*([\s\S]*?)\s*\);/g;

let match;
while ((match = regex.exec(cssContent)) !== null) {
  const [, name, lightValue, darkValue] = match;
  const cleanLight = lightValue.trim().replace(/\s+/g, ' ');
  const cleanDark = darkValue.trim().replace(/\s+/g, ' ');
  
  tokens.push({
    name: name.trim(),
    value: `light-dark(${cleanLight}, ${cleanDark})`,
    category: 'color',
    description: `Primary color scale - light mode: ${cleanLight}, dark mode: ${cleanDark}. Pattern repeats for neutral, alerts-warning, alerts-danger, alerts-info, alerts-notice.`
  });
}

// Output as JSON for easy copy-paste into optics-data.ts
console.log(JSON.stringify(tokens, null, 2));
console.log(`\n// Extracted ${tokens.length} primary color scale tokens`);
console.log('// Pattern repeats for: neutral, alerts-warning, alerts-danger, alerts-info, alerts-notice');
