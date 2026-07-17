import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const sampleRate = 22050

function wav(notes) {
  const duration = Math.max(...notes.map((note) => note.start + note.duration))
  const sampleCount = Math.ceil(duration * sampleRate)
  const dataSize = sampleCount * 2
  const buffer = Buffer.alloc(44 + dataSize)
  buffer.write('RIFF', 0)
  buffer.writeUInt32LE(36 + dataSize, 4)
  buffer.write('WAVE', 8)
  buffer.write('fmt ', 12)
  buffer.writeUInt32LE(16, 16)
  buffer.writeUInt16LE(1, 20)
  buffer.writeUInt16LE(1, 22)
  buffer.writeUInt32LE(sampleRate, 24)
  buffer.writeUInt32LE(sampleRate * 2, 28)
  buffer.writeUInt16LE(2, 32)
  buffer.writeUInt16LE(16, 34)
  buffer.write('data', 36)
  buffer.writeUInt32LE(dataSize, 40)

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / sampleRate
    let sample = 0
    for (const note of notes) {
      const local = time - note.start
      if (local < 0 || local > note.duration) continue
      const attack = Math.min(1, local / 0.008)
      const release = Math.max(0, 1 - local / note.duration)
      sample += Math.sin(2 * Math.PI * note.frequency * local) * attack * release * note.gain
    }
    buffer.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(sample * 32767))), 44 + index * 2)
  }
  return buffer
}

const directory = path.join(process.cwd(), 'miniprogram', 'assets', 'audio')
await mkdir(directory, { recursive: true })
await writeFile(path.join(directory, 'tap.wav'), wav([{ start: 0, duration: 0.055, frequency: 620, gain: 0.22 }]))
await writeFile(path.join(directory, 'strong.wav'), wav([
  { start: 0, duration: 0.11, frequency: 330, gain: 0.2 },
  { start: 0.055, duration: 0.16, frequency: 660, gain: 0.2 },
]))
await writeFile(path.join(directory, 'error.wav'), wav([
  { start: 0, duration: 0.09, frequency: 260, gain: 0.18 },
  { start: 0.075, duration: 0.12, frequency: 180, gain: 0.2 },
]))
console.log('Generated three original placeholder feedback sounds.')
