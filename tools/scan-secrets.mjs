import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const ignored = new Set(['.git', 'node_modules', 'dist', 'coverage'])
const allowedExtensions = new Set(['.ts', '.js', '.mjs', '.json', '.md', '.yml', '.yaml', '.ps1', '.html', '.css', '.wxml', '.wxss'])
const rules = [
  { name: 'private key block', expression: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'WeChat AppSecret assignment', expression: /(?:appsecret|app_secret)\s*[:=]\s*["'][A-Za-z0-9_-]{24,}["']/i },
  { name: 'API secret assignment', expression: /(?:api[_-]?key|client[_-]?secret)\s*[:=]\s*["'][A-Za-z0-9_\-/+=]{20,}["']/i },
  { name: 'real WeChat AppID', expression: /\bwx[a-f0-9]{16}\b/i },
]
const findings = []

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (ignored.has(entry.name)) continue
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) await walk(absolute)
    else if (allowedExtensions.has(path.extname(entry.name))) {
      const content = await readFile(absolute, 'utf8')
      for (const rule of rules) {
        if (rule.expression.test(content)) findings.push(`${path.relative(root, absolute)}: ${rule.name}`)
      }
    }
  }
}

await walk(root)
if (findings.length) {
  console.error(findings.join('\n'))
  process.exit(1)
}
console.log('Sensitive information scan passed.')
