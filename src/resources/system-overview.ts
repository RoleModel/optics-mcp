import { readResourceFile } from '../_internal/resource-path.js'

export const metadata = {
  name: 'system-overview',
  uri: 'optics://system-overview',
  title: 'System Overview - READ THIS FIRST',
  description: 'Critical errors AI agents make, quick reference for Cache Components',
  mimeType: 'text/markdown'
}

export async function handler(uri: URL) {
  return readResourceFile('00-system-overview.md')
}
