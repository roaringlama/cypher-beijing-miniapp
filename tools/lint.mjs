import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const ignored = new Set(['.git', 'node_modules', 'dist', 'coverage', '.test-build'])
const textExtensions = new Set([
  '.ts', '.js', '.mjs', '.json', '.md', '.wxml', '.wxss', '.html', '.css', '.yml', '.yaml', '.ps1',
])
const issues = []

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) await walk(absolute)
    else if (textExtensions.has(path.extname(entry.name))) await check(absolute)
  }
}

async function check(file) {
  const relative = path.relative(root, file)
  const content = await readFile(file, 'utf8')
  if (!content.endsWith('\n')) issues.push(`${relative}: missing final newline`)
  content.split(/\r?\n/).forEach((line, index) => {
    if (/\s+$/.test(line)) issues.push(`${relative}:${index + 1}: trailing whitespace`)
    if (line.includes('\t') && path.extname(file) !== '.md') issues.push(`${relative}:${index + 1}: tab character`)
  })
  if (path.extname(file) === '.json') {
    try {
      JSON.parse(content)
    } catch (error) {
      issues.push(`${relative}: invalid JSON (${error.message})`)
    }
  }
}

await walk(root)
if (issues.length) {
  console.error(issues.join('\n'))
  process.exit(1)
}
console.log('Lint passed.')
