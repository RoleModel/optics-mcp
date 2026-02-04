import { components } from '../../optics-data'

export const metadata = {
  name: 'components-all',
  uri: 'optics://components/all',
  title: 'All Components',
  description: 'Complete list of all Optics components',
  mimeType: 'application/json',
}

export async function handler(uri: URL) {
  return JSON.stringify(components, null, 2)
}
