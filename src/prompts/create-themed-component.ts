import { z } from 'zod'
import { components } from '../optics-data.js'
import { readResourceFile } from "../_internal/resource-path.js"

/**
 * Prompt: Create Themed Component
 */
export const inputSchema = {
  componentType: z.string().describe('Type of component (button, card, form, alert, etc.)'),
  variant: z.string().optional().describe('Component variant (primary, secondary, danger, etc.)'),
  framework: z.string().optional().describe('Framework to use (react, vue, svelte, html)')
}

type CreateThemedComponentPromptArgs = {
  componentType: string
  variant?: string
  framework?: string
}

export const metadata = {
  name: "create-themed-component",
  title: "Create Themed Component",
  description: "Generate a component styled with Optics design tokens",
  role: "user",
}

function getComponent(compType: string) {
  const component = components.find(
    (c) => c.name.toLowerCase() === compType.toLowerCase()
  )

  return component
}

export async function handler(args: CreateThemedComponentPromptArgs) {
  const compType = args.componentType || 'button'
  const compVariant = args.variant || 'primary'
  const compFramework = args.framework || 'react'

  const component = getComponent(compType)

  if (!component) {
    const availableComponents = components.map((c) => c.name).join(', ')
    return `Create a ${compType} component using Optics design tokens. Available components: ${availableComponents}.`
  }

  let promptTemplate = await readResourceFile("prompts/create-themed-components-prompt.md")
  promptTemplate = promptTemplate.replace(/{{VARIANT}}/g, compVariant)
  promptTemplate = promptTemplate.replace(/{{TYPE}}/g, compType)
  promptTemplate = promptTemplate.replace(/{{FRAMEWORK}}/g, compFramework)
  promptTemplate = promptTemplate.replace(/{{TOKENS}}/g, component.tokens.join('\n'))
  promptTemplate = promptTemplate.replace(/{{USAGE}}/g, component.usage)

  const examples = (component.examples && component.examples.length > 0)
    ? `\n\nExample structure:\n${component.examples[0]}`
    : ''
  promptTemplate = promptTemplate.replace(/{{EXAMPLES}}/g, examples)

  return promptTemplate
}
