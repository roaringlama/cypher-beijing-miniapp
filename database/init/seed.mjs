import { readFile } from 'node:fs/promises'

const dryRun = process.argv.includes('--dry-run')
const schema = JSON.parse(await readFile(new URL('../schema.json', import.meta.url), 'utf8'))
const mock = JSON.parse(await readFile(new URL('../mock.json', import.meta.url), 'utf8'))
const plan = schema.collections.map((collection) => ({
  collection: collection.name,
  documents: mock[collection.name]?.length ?? 0,
  indexes: collection.indexes.length,
  strategy: 'upsert missing mock IDs only',
}))

if (!dryRun) {
  console.error('Cloud writes are disabled in Phase 1. Use --dry-run; Phase 2 will provide an authenticated cloud adapter.')
  process.exit(1)
}

console.log('Cypher Beijing database seed plan (no writes):')
for (const item of plan) console.log(`- ${item.collection}: ${item.documents} mock document(s), ${item.indexes} index definition(s)`)
