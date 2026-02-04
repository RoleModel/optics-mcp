import { designTokens } from '../../optics-data.js'

export const metadata = {
  name: 'tokens-category',
  uri: 'optics://tokens/{category}',
  title: 'Tokens by Category',
  description: 'Design tokens filtered by category (color, spacing, typography, border, shadow)',
  mimeType: 'application/json',
}

export async function handler(uri: URL) {
  const category = uri.pathname.replace('/tokens/', '').replace('/', '')

  if (category === 'all') {
    return JSON.stringify(designTokens, null, 2)
  }

  const filteredTokens = designTokens.filter((t) => t.category === category)
  if (filteredTokens.length === 0) {
    throw new Error(`No tokens found for category: ${category}`)
  }

  return JSON.stringify(filteredTokens, null, 2)
}
