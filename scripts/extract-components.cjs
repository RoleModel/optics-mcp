#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const OPTICS_COMPONENTS_DIR = '/Users/dallas/Development/optics/src/components';
const OPTICS_STORIES_DIR = '/Users/dallas/Development/optics/src/stories/Components';

// Read all component SCSS files
const scssFiles = fs.readdirSync(OPTICS_COMPONENTS_DIR)
  .filter(f => f.endsWith('.scss') && f !== 'index.scss')
  .sort();

const components = [];

scssFiles.forEach(file => {
  const componentName = file.replace('.scss', '').replace(/_/g, '-').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  const content = fs.readFileSync(path.join(OPTICS_COMPONENTS_DIR, file), 'utf8');
  
  // Extract all --op- tokens from the SCSS
  const tokenMatches = content.match(/--op-[\w-]+/g) || [];
  const uniqueTokens = [...new Set(tokenMatches)].sort();
  
  // Get description from story file if it exists
  const storyDirs = fs.readdirSync(OPTICS_STORIES_DIR);
  let description = `${componentName} component from the Optics Design System`;
  
  // Try to find matching story directory
  const storyDir = storyDirs.find(d => 
    d.toLowerCase() === componentName.toLowerCase() || 
    d.toLowerCase().replace(/\s+/g, '') === componentName.toLowerCase()
  );
  
  if (storyDir) {
    const storyPath = path.join(OPTICS_STORIES_DIR, storyDir);
    const storyFiles = fs.readdirSync(storyPath);
    const jsFile = storyFiles.find(f => f.endsWith('.js') && !f.includes('.stories.'));
    
    if (jsFile) {
      description = `${componentName} component with real implementation from Optics`;
    }
  }
  
  components.push({
    name: componentName,
    description,
    tokens: uniqueTokens,
    scssFile: file
  });
});

console.log(JSON.stringify(components, null, 2));
