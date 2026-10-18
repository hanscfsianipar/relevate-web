/**
 * Cek kesiapan environment lokal tanpa pernah mencetak nilai token.
 * Run: npm run check:env
 */

import { readFileSync, existsSync } from 'node:fs'
import { execSync } from 'node:child_process'

const REQUIRED = [
  'NEXT_PUBLIC_SITE_URL',
  'NEXT_PUBLIC_SANITY_PROJECT_ID',
  'NEXT_PUBLIC_SANITY_DATASET',
  'SANITY_API_TOKEN',
]

function fail(msg) {
  console.error(`GAGAL: ${msg}`)
  process.exit(1)
}

if (!existsSync('.env.local')) fail('.env.local tidak ada. Salin dari .env.example.')

let ignored = ''
try {
  ignored = execSync('git check-ignore .env.local', { encoding: 'utf8' }).trim()
} catch {
  ignored = ''
}
if (!ignored) fail('.env.local TIDAK masuk gitignore. Jangan lanjut sebelum ini diperbaiki.')

let tracked = ''
try {
  tracked = execSync('git ls-files --error-unmatch .env.local', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim()
} catch {
  tracked = ''
}
if (tracked) fail('.env.local terdeteksi sebagai file yang di-track git. Jalankan: git rm --cached .env.local')

const env = {}
for (const line of readFileSync('.env.local', 'utf8').split('\n')) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
  if (m) env[m[1]] = m[2]
}

const missing = REQUIRED.filter((k) => !env[k])
if (missing.length) fail(`kunci belum diisi: ${missing.join(', ')}`)

console.log('OK: .env.local ada, di-gitignore, tidak ter-track, dan 4 kunci wajib terisi.')

const { NEXT_PUBLIC_SANITY_PROJECT_ID: projectId, NEXT_PUBLIC_SANITY_DATASET: dataset, SANITY_API_TOKEN: token } = env
const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=count(*%5B%5D)`

try {
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  if (!res.ok) fail(`token ditolak Sanity (HTTP ${res.status}). Cek role token dan project ID.`)
  const json = await res.json()
  console.log(`OK: token valid, dataset bisa dibaca (respons Sanity: ${json.result}).`)
} catch (err) {
  fail(`tidak bisa menghubungi Sanity: ${err.message}`)
}

console.log('\nSiap kerja. Jalankan: npm run dev')
