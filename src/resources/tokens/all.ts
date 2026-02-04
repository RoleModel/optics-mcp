import { designTokens } from '../../optics-data'

export const metadata = {
  name: 'tokens-all',
  uri: 'optics://tokens/all',
  title: 'All Design Tokens',
  description: 'Complete list of all Optics design tokens',
  mimeType: 'application/json',
}

export async function handler(uri: URL) {
  return JSON.stringify(designTokens, null, 2)
}
