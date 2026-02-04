import { documentation } from '../../optics-data'

export const metadata = {
  name: 'documentation-section',
  uri: 'optics://documentation/{section}',
  title: 'Optics Documentation',
  description: 'Documentation sections for the Optics design system',
  mimeType: 'application/json',
}

export async function handler(uri: URL) {
  const section = uri.pathname.replace('/documentation/', '').replace('/', '')

  if (section === 'all') {
    return JSON.stringify(documentation, null, 2)
  }

  const filteredDocumentation = documentation.filter((d) => d.section === section)
  if (filteredDocumentation.length === 0) {
    throw new Error(`No documentation found for section: ${section}`)
  }

  return JSON.stringify(filteredDocumentation, null, 2)
}
