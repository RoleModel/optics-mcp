import { z } from 'zod'

import Tool, { type ToolInputSchema } from './tool.js'
import { components, designTokens, type DesignToken } from '../optics-data.js'

class GetComponentTokensTool extends Tool {
  name = 'get_component_tokens'
  title = 'Get Component Tokens'
  description = 'Get all design tokens used by a specific component'

  inputSchema = {
    componentName: z
      .string()
      .describe('The name of the component (e.g., "Button", "Card", "Input")')
  }

  async handler(args: ToolInputSchema): Promise<string> {
    const dependencies = this.getComponentTokenDependencies(args.componentName);

    let value = ''

    if (!dependencies) {
      const availableComponents = components.map((c) => c.name).join(', ')
      value = `Component not found: ${args.componentName}\n\nAvailable components: ${availableComponents}`
    } else {
      value = JSON.stringify(dependencies, null, 2)
    }

    return value
  }

  private getComponentTokenDependencies(componentName: string) {
    const component = components.find(c =>
      c.name.toLowerCase() === componentName.toLowerCase()
    );

    if (!component) return null

    const tokenDetails = component.tokens.map(tokenName =>
      designTokens.find(t => t.name.replace(/^--op/, 'op') === tokenName.replace(/^--op/, 'op'))
    ).filter((token): token is DesignToken => token !== undefined);

    return {
      component: component.name,
      description: component.description,
      tokenCount: component.tokens.length,
      tokens: tokenDetails
    };
  }
}

export default GetComponentTokensTool
