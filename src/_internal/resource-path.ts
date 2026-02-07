import { join, dirname } from 'node:path'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const readResourceFile = async (filename: string): Promise<string> => {
  const currentDir = dirname(fileURLToPath(import.meta.url))
  const filePath = join(currentDir, '..', 'resources', filename)

  return readFileSync(filePath, 'utf-8')
}

const readPromptFile = async (filename: string): Promise<string> => {
  const currentDir = dirname(fileURLToPath(import.meta.url))
  const filePath = join(currentDir, '..', 'prompts', '_templates', filename)

  return readFileSync(filePath, 'utf-8')
}

const readToolFile = async (filename: string): Promise<string> => {
  const currentDir = dirname(fileURLToPath(import.meta.url))
  const filePath = join(currentDir, '..', 'tools', '_templates', filename)

  return readFileSync(filePath, 'utf-8')
}

export { readResourceFile, readPromptFile, readToolFile }
