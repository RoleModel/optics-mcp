import { z } from 'zod'

import Tool, { type ToolInputSchema } from './tool.js'
import { components } from '../optics-data.js'

class ListComponentsTool extends Tool {
  name = 'list_components'
  title = 'List Components'
  description = 'List all available components in the design system'

  inputSchema = {}

  async handler(args: ToolInputSchema): Promise<string> {
    const componentList = components.map((c) => ({
      name: c.name,
      description: c.description,
      tokenCount: c.tokens.length,
    }));

    return JSON.stringify(componentList, null, 2)
  }
}

export default ListComponentsTool
