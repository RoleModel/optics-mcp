import { z } from 'zod'
import { readResourceFile } from "../_internal/resource-path.js"

type DesignReviewPromptArgs = {
  code: string
  componentType?: string
}

export const inputSchema = {
  code: z.string().describe('Component code to review'),
  componentType: z.string().optional().describe('Type of component being reviewed'),
}

export const metadata = {
  name: "design-review",
  title: "Design Review",
  description: "Review a design or component for Optics token usage and best practices",
  role: "user",
}

export async function handler(args: DesignReviewPromptArgs) {
  const code = args.code || ''
  const componentType = args.componentType || 'unknown'

  let promptTemplate = await readResourceFile("prompts/design-review-prompt.md")
  promptTemplate = promptTemplate.replace(/{{COMPONENT_TYPE}}/g, componentType)
  promptTemplate = promptTemplate.replace(/{{CODE}}/g, code)
  return promptTemplate
}
