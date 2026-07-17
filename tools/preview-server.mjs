import { createReadStream } from 'node:fs'
import { stat } from 'node:fs/promises'
import http from 'node:http'
import path from 'node:path'

const root = path.resolve('prototype')
const port = Number(process.env.PORT ?? 4173)
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml' }

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? '/', `http://${request.headers.host}`)
    const requested = url.pathname === '/' ? 'index.html' : url.pathname.slice(1)
    const file = path.resolve(root, requested)
    if (!file.startsWith(root)) throw new Error('Invalid path')
    const info = await stat(file)
    if (!info.isFile()) throw new Error('Not a file')
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' })
    createReadStream(file).pipe(response)
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
    response.end('Not found')
  }
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Checkpoint A preview: http://127.0.0.1:${port}`)
})

