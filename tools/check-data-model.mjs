import { readFile } from 'node:fs/promises'

const required = [
  'users', 'activities', 'registrations', 'attendance', 'pointLedger', 'levelConfigs',
  'privilegeConfigs', 'userPrivileges', 'platformSupportOrders', 'supporterWallEntries',
  'feedback', 'reports', 'featureFlags',
]
const schema = JSON.parse(await readFile('database/schema.json', 'utf8'))
const mock = JSON.parse(await readFile('database/mock.json', 'utf8'))
const names = new Set(schema.collections.map((collection) => collection.name))
const missing = required.filter((name) => !names.has(name))
const invalid = schema.collections.filter((collection) =>
  !collection.description || !collection.fields?.length || !collection.indexes?.length ||
  !collection.permissions || !collection.mockFile || !collection.migration,
)
const missingMockData = required.filter((name) => !Array.isArray(mock[name]) || mock[name].length === 0)

if (missing.length || invalid.length || missingMockData.length) {
  if (missing.length) console.error(`Missing collections: ${missing.join(', ')}`)
  if (invalid.length) console.error(`Incomplete collections: ${invalid.map((item) => item.name).join(', ')}`)
  if (missingMockData.length) console.error(`Missing representative mock data: ${missingMockData.join(', ')}`)
  process.exit(1)
}
console.log(`Data model passed (${schema.collections.length} collections).`)
