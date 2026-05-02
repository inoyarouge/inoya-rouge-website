import sharp from 'sharp'
import { readdir, stat } from 'fs/promises'
import { join, extname, basename } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..', 'public', 'images')
const LOGO_PATH = join(ROOT, 'logo', 'inoya-rouge-logo.png')

const JPEG_QUALITY = 78
const PNG_QUALITY = 85

async function getFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await getFiles(full))
    } else {
      const ext = extname(entry.name).toLowerCase()
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        files.push(full)
      }
    }
  }
  return files
}

async function compressFile(filePath) {
  const ext = extname(filePath).toLowerCase()
  const isLogo = filePath === LOGO_PATH
  const before = (await stat(filePath)).size

  const img = sharp(filePath)
  const meta = await img.metadata()

  let pipeline
  if (ext === '.png') {
    if (isLogo) {
      // Logo: resize to max 88px wide (4x render size for retina), compress hard
      pipeline = img
        .resize({ width: 88, withoutEnlargement: true })
        .png({ quality: PNG_QUALITY, compressionLevel: 9, palette: true })
    } else {
      pipeline = img.png({ quality: PNG_QUALITY, compressionLevel: 9 })
    }
  } else {
    // JPEG
    const isMobile = filePath.toLowerCase().includes('mobile')
    const quality = isMobile ? 72 : JPEG_QUALITY
    pipeline = img.jpeg({ quality, mozjpeg: true, progressive: true })
  }

  const buf = await pipeline.toBuffer()
  const after = buf.length

  if (after < before) {
    const { writeFile, rename, unlink } = await import('fs/promises')
    const tmp = filePath + '.tmp'
    await writeFile(tmp, buf)
    try { await unlink(filePath) } catch {}
    await rename(tmp, filePath)
    const saved = ((before - after) / before * 100).toFixed(1)
    console.log(`  ✓ ${basename(filePath).padEnd(45)} ${(before/1024).toFixed(0).padStart(5)} KB → ${(after/1024).toFixed(0).padStart(4)} KB  (-${saved}%)`)
  } else {
    console.log(`  - ${basename(filePath).padEnd(45)} already optimal, skipped`)
  }
}

const files = await getFiles(ROOT)
console.log(`\nCompressing ${files.length} images...\n`)

let totalBefore = 0
let totalAfter = 0
for (const f of files) {
  const s = (await stat(f)).size
  totalBefore += s
  await compressFile(f)
  const s2 = (await stat(f)).size
  totalAfter += s2
}

console.log(`\nDone. Total: ${(totalBefore/1024).toFixed(0)} KB → ${(totalAfter/1024).toFixed(0)} KB  (saved ${((totalBefore-totalAfter)/1024).toFixed(0)} KB, ${((totalBefore-totalAfter)/totalBefore*100).toFixed(1)}%)`)
