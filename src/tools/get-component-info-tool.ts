import { z } from 'zod'

import Tool, { type ToolInputSchema } from './tool.js'
import { components } from '../optics-data.js'

class GetComponentInfoTool extends Tool {
  name = 'get_component_info'
  title = 'Get Component Info'
  description = 'Get detailed information about a component including its design token dependencies'

  inputSchema = {
    componentName: z
      .string()
      .describe('The name of the component (e.g., "Button", "Card", "Input")')
  }

  async handler(args: ToolInputSchema): Promise<string> {
    const component = components.find(
      (c) => c.name.toLowerCase() === args.componentName.toLowerCase()
    )

    let value = ''

    if (!component) {
      const availableComponents = components.map((c) => c.name).join(', ')
      value = `Component not found: ${args.componentName}\n\nAvailable components: ${availableComponents}`
    } else {
      value = JSON.stringify(component, null, 2)
    }

    return value
  }
}

export default GetComponentInfoTool
