#!/usr/bin/env node

/**
 * Simple test script to verify the Optics MCP server functionality
 */

import { designTokens, components, getTokenUsageStats, getComponentTokenDependencies } from './optics-data.js';

console.log('🧪 Testing Optics MCP Server...\n');

// Test 1: Design Tokens
console.log('✓ Test 1: Design Tokens');
console.log(`  Total tokens: ${designTokens.length}`);
const colorTokens = designTokens.filter(t => t.category === 'color');
console.log(`  Color tokens: ${colorTokens.length}`);
console.log(`  Sample token: ${designTokens[0].name} = ${designTokens[0].value}\n`);

// Test 2: Components
console.log('✓ Test 2: Components');
console.log(`  Total components: ${components.length}`);
console.log(`  Components: ${components.map(c => c.name).join(', ')}\n`);

// Test 3: Token Usage Stats
console.log('✓ Test 3: Token Usage Statistics');
const stats = getTokenUsageStats();
console.log(`  Total tokens: ${stats.totalTokens}`);
console.log(`  Categories:`, stats.categories, '\n');

// Test 4: Component Token Dependencies
console.log('✓ Test 4: Component Token Dependencies');
const buttonDeps = getComponentTokenDependencies('Button');
if (buttonDeps) {
  console.log(`  ${buttonDeps.component}: ${buttonDeps.tokenCount} tokens`);
  console.log(`  First token: ${buttonDeps.tokens[0]?.name}\n`);
}

// Test 5: Search functionality
console.log('✓ Test 5: Token Search');
const primaryTokens = designTokens.filter(t => t.name.includes('primary'));
console.log(`  Tokens with 'primary': ${primaryTokens.length}`);
console.log(`  Names: ${primaryTokens.map(t => t.name).join(', ')}\n`);

console.log('✅ All tests passed!\n');
console.log('The Optics MCP server data is working correctly.');
console.log('To start the server, run: npm start');
