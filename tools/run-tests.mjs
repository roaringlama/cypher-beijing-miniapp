import { readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const root = process.cwd()
const output = path.join(root, '.test-build')
await rm(output, { recursive: true, force: true })

const compiler = path.join(root, 'node_modules', 'typescript', 'bin', 'tsc')
const compile = spawnSync(process.execPath, [compiler, '-p', 'tsconfig.test.json'], { cwd: root, stdio: 'inherit' })
if (compile.status !== 0) process.exit(compile.status ?? 1)

const testRoot = path.join(output, 'tests')
const files = []
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) await collect(absolute)
    else if (entry.name.endsWith('.test.js')) files.push(absolute)
  }
}

try {
  await collect(testRoot)
} catch {
  console.log('No unit tests yet; Phase 0 runner is ready.')
  process.exit(0)
}

if (!files.length) {
  console.log('No unit tests yet; Phase 0 runner is ready.')
  process.exit(0)
}

const result = spawnSync(process.execPath, ['--test', ...files], { cwd: root, stdio: 'inherit' })
process.exit(result.status ?? 1)

