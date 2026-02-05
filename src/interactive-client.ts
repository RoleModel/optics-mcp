#!/usr/bin/env node

/**
 * Interactive Test Client for Optics MCP Server
 * Allows testing resources, prompts, and tools interactively
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🚀 Optics MCP Server - Interactive Test Client\n');
  console.log('Connecting to server...\n');

  // Create client
  const client = new Client(
    {
      name: 'optics-interactive-client',
      version: '0.1.0',
    },
    {
      capabilities: {},
    }
  );

  // Create transport
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/index.js'],
  });

  try {
    await client.connect(transport);
    console.log('✅ Connected to Optics MCP Server\n');

    let running = true;
    while (running) {
      console.log('═'.repeat(80));
      console.log('What would you like to test?');
      console.log('═'.repeat(80));
      console.log('1. Resources');
      console.log('2. Prompts');
      console.log('3. Tools');
      console.log('4. Exit');
      console.log('');

      const choice = await question('Enter your choice (1-4): ');

      switch (choice.trim()) {
        case '1':
          await testResources(client);
          break;
        case '2':
          await testPrompts(client);
          break;
        case '3':
          await testTools(client);
          break;
        case '4':
          running = false;
          console.log('\n👋 Goodbye!');
          break;
        default:
          console.log('❌ Invalid choice. Please enter 1-4.\n');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    rl.close();
    await client.close();
    process.exit(0);
  }
}

async function testResources(client: Client) {
  console.log('\n📚 Available Resources:\n');

  const resourceList = await client.listResources();

  resourceList.resources.forEach((resource, index) => {
    console.log(`${index + 1}. ${resource.name}`);
    console.log(`   URI: ${resource.uri}`);
    console.log(`   Description: ${resource.description}`);
    console.log('');
  });

  const choice = await question('Enter resource number to test (or 0 to go back): ');
  const index = parseInt(choice.trim()) - 1;

  if (index === -1) return;

  if (index < 0 || index >= resourceList.resources.length) {
    console.log('❌ Invalid choice.\n');
    return;
  }

  const resource = resourceList.resources[index];
  let uri = resource.uri;

  // Check if URI has template variables
  if (uri.includes('{')) {
    console.log(`\n⚠️  This resource uses a URI template: ${uri}`);
    const varMatch = uri.match(/\{(\w+)\}/);
    if (varMatch) {
      const varName = varMatch[1];
      const value = await question(`Enter value for {${varName}}: `);
      uri = uri.replace(`{${varName}}`, value);
    }
  }

  console.log(`\n📖 Reading resource: ${uri}\n`);

  try {
    const result = await client.readResource({ uri });

    result.contents.forEach((content, idx) => {
      console.log(`Content ${idx + 1}:`);
      console.log(`  URI: ${content.uri}`);
      console.log(`  MIME Type: ${content.mimeType}`);

      if ('text' in content) {
        const text = content.text;
        const length = text.length;
        console.log(`  Length: ${length} characters`);

        if (length < 1000) {
          console.log(`\n${text}\n`);
        } else {
          console.log(`\n${text.substring(0, 500)}...`);
          console.log(`\n[Content truncated - ${length - 500} more characters]`);
        }
      }
    });

    console.log('\n✅ Resource read successfully!\n');
  } catch (error) {
    console.error('❌ Error reading resource:', error instanceof Error ? error.message : error);
    console.log('');
  }
}

async function testPrompts(client: Client) {
  console.log('\n💡 Available Prompts:\n');

  const promptList = await client.listPrompts();

  promptList.prompts.forEach((prompt, index) => {
    console.log(`${index + 1}. ${prompt.name}`);
    console.log(`   Description: ${prompt.description}`);
    if (prompt.arguments && prompt.arguments.length > 0) {
      console.log(`   Arguments: ${prompt.arguments.map((arg: any) => arg.name).join(', ')}`);
    }
    console.log('');
  });

  const choice = await question('Enter prompt number to test (or 0 to go back): ');
  const index = parseInt(choice.trim()) - 1;

  if (index === -1) return;

  if (index < 0 || index >= promptList.prompts.length) {
    console.log('❌ Invalid choice.\n');
    return;
  }

  const prompt = promptList.prompts[index];
  const args: Record<string, any> = {};

  // Collect arguments
  if (prompt.arguments && prompt.arguments.length > 0) {
    console.log('\n📝 Enter argument values:\n');
    for (const arg of prompt.arguments) {
      const value = await question(`${arg.name}${arg.required ? ' (required)' : ' (optional)'}: `);
      if (value.trim()) {
        args[arg.name] = value;
      }
    }
  }

  console.log(`\n💬 Getting prompt: ${prompt.name}\n`);

  try {
    const result = await client.getPrompt({ name: prompt.name, arguments: args });

    console.log('Prompt Response:');
    console.log('─'.repeat(80));
    result.messages.forEach((message: any) => {
      console.log(`Role: ${message.role}`);
      console.log(`Content: ${message.content.text}`);
      console.log('─'.repeat(80));
    });

    console.log('\n✅ Prompt retrieved successfully!\n');
  } catch (error) {
    console.error('❌ Error getting prompt:', error instanceof Error ? error.message : error);
    console.log('');
  }
}

async function testTools(client: Client) {
  console.log('\n🔧 Available Tools:\n');

  const toolList = await client.listTools();

  toolList.tools.forEach((tool, index) => {
    console.log(`${index + 1}. ${tool.name}`);
    console.log(`   Description: ${tool.description}`);
    console.log('');
  });

  const choice = await question('Enter tool number to test (or 0 to go back): ');
  const index = parseInt(choice.trim()) - 1;

  if (index === -1) return;

  if (index < 0 || index >= toolList.tools.length) {
    console.log('❌ Invalid choice.\n');
    return;
  }

  const tool = toolList.tools[index];
  const args: Record<string, any> = {};

  // Get input schema and collect arguments
  console.log(`\n📝 Tool: ${tool.name}`);
  console.log(`Description: ${tool.description}`);

  if (tool.inputSchema && typeof tool.inputSchema === 'object') {
    const schema = tool.inputSchema as any;
    if (schema.properties) {
      console.log('\nEnter argument values (press Enter to skip optional fields):\n');

      for (const [key, prop] of Object.entries(schema.properties)) {
        const propDef = prop as any;
        const isRequired = schema.required?.includes(key);
        const description = propDef.description || '';

        const value = await question(`${key}${isRequired ? ' (required)' : ' (optional)'} - ${description}: `);

        if (value.trim()) {
          // Try to parse as JSON for complex types
          if (propDef.type === 'array' || propDef.type === 'object') {
            try {
              args[key] = JSON.parse(value);
            } catch {
              args[key] = value;
            }
          } else if (propDef.type === 'boolean') {
            args[key] = value.toLowerCase() === 'true' || value === '1';
          } else if (propDef.type === 'number') {
            args[key] = parseFloat(value);
          } else {
            args[key] = value;
          }
        }
      }
    }
  }

  console.log(`\n⚙️  Calling tool: ${tool.name}\n`);

  try {
    const result = await client.callTool({ name: tool.name, arguments: args });

    console.log('Tool Response:');
    console.log('─'.repeat(80));

    if (result.content && Array.isArray(result.content)) {
      result.content.forEach((content: any) => {
        if (content.type === 'text') {
          console.log(content.text);
        } else {
          console.log(JSON.stringify(content, null, 2));
        }
      });
    } else {
      console.log(JSON.stringify(result, null, 2));
    }

    console.log('─'.repeat(80));

    console.log('\n✅ Tool executed successfully!\n');
  } catch (error) {
    console.error('❌ Error calling tool:', error instanceof Error ? error.message : error);
    console.log('');
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
