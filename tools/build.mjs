import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

const root = process.cwd()
const app = JSON.parse(await readFile(path.join(root, 'miniprogram/app.json'), 'utf8'))
const requiredPages = [
  'pages/home/index',
  'pages/activity-detail/index',
  'pages/create/index',
  'pages/profile/index',
  'pages/support/index',
]
const errors = []

for (const page of requiredPages) {
  if (!app.pages.includes(page)) errors.push(`app.json is missing ${page}`)
}
for (const page of app.pages) {
  for (const extension of ['.ts', '.json', '.wxml', '.wxss']) {
    const file = path.join(root, 'miniprogram', `${page}${extension}`)
    try {
      await access(file)
    } catch {
      errors.push(`Missing page file: miniprogram/${page}${extension}`)
    }
  }
  const wxmlPath = path.join(root, 'miniprogram', `${page}.wxml`)
  const wxssPath = path.join(root, 'miniprogram', `${page}.wxss`)
  try {
    const wxml = await readFile(wxmlPath, 'utf8')
    const stack = []
    const voidTags = new Set(['input', 'image', 'icon', 'progress', 'slider', 'switch'])
    for (const match of wxml.matchAll(/<(\/)?([a-z][\w-]*)([^>]*)>/gi)) {
      const [, closing, tag, attributes] = match
      if (closing) {
        const expected = stack.pop()
        if (expected !== tag) errors.push(`Unbalanced WXML in ${page}: expected </${expected ?? 'none'}>, received </${tag}>`)
      } else if (!attributes?.trimEnd().endsWith('/') && !voidTags.has(tag)) {
        stack.push(tag)
      }
    }
    if (stack.length) errors.push(`Unclosed WXML tag(s) in ${page}: ${stack.join(', ')}`)
    if (/\.(?:includes|join|map|filter)\s*\(/.test(wxml)) errors.push(`Unsupported method call inside WXML expression: ${page}`)
  } catch {
    // Missing files are already reported above.
  }
  try {
    const wxss = await readFile(wxssPath, 'utf8')
    if ((wxss.match(/{/g)?.length ?? 0) !== (wxss.match(/}/g)?.length ?? 0)) errors.push(`Unbalanced WXSS braces in ${page}`)
  } catch {
    // Missing files are already reported above.
  }
}

for (const asset of ['tap.wav', 'strong.wav', 'error.wav']) {
  try {
    await access(path.join(root, 'miniprogram/assets/audio', asset))
  } catch {
    errors.push(`Missing generated audio asset: ${asset}`)
  }
}
for (const previewFile of ['index.html', 'styles.css', 'app.js']) {
  try {
    await access(path.join(root, 'prototype', previewFile))
  } catch {
    errors.push(`Missing Checkpoint A preview file: prototype/${previewFile}`)
  }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}

const output = path.join(root, 'dist')
await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
await writeFile(path.join(output, 'build-manifest.json'), `${JSON.stringify({
  builtAt: new Date().toISOString(),
  appPages: app.pages,
  mode: 'wechat-typescript-compiler',
}, null, 2)}\n`)
console.log(`Build check passed (${app.pages.length} pages).`)
