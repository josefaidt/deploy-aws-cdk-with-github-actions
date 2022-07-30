import { access, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const relative = (path: string) => fileURLToPath(new URL(path, import.meta.url))
const path = relative('../package.json')
try {
  await access(path)
} catch (error) {
  throw new Error('package.json not found')
}

export const pkg = JSON.parse(await readFile(path, 'utf8'))
