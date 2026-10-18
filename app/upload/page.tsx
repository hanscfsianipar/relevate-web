'use client'

import { useState, useRef } from 'react'

export default function UploadPage() {
  const [secret, setSecret] = useState('')
  const [authed, setAuthed] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<{ assetId: string; url: string; size: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setResult(null)
    setError(null)
    setPreview(URL.createObjectURL(f))
  }

  async function handleUpload() {
    if (!file) return
    setLoading(true)
    setError(null)
    try {
      const form = new FormData()
      form.append('image', file)
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: { 'x-upload-secret': secret },
        body: form,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Upload gagal')
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload gagal')
    } finally {
      setLoading(false)
    }
  }

  async function handleCopy() {
    if (!result) return
    await navigator.clipboard.writeText(result.assetId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <div style={{ background: '#1a1a1a', padding: 32, borderRadius: 12, width: 320 }}>
          <h1 style={{ color: '#fff', marginBottom: 24, fontSize: 18, fontWeight: 600 }}>Upload Image</h1>
          <input
            type="password"
            placeholder="Password"
            value={secret}
            onChange={e => setSecret(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && secret && setAuthed(true)}
            style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid #333', background: '#0a0a0a', color: '#fff', fontSize: 14, boxSizing: 'border-box' }}
            autoFocus
          />
          <button
            onClick={() => secret && setAuthed(true)}
            style={{ marginTop: 12, width: '100%', padding: '10px 12px', borderRadius: 8, background: '#ff6b2b', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Masuk
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#1a1a1a', padding: 32, borderRadius: 12, width: '100%', maxWidth: 480 }}>
        <h1 style={{ color: '#fff', marginBottom: 24, fontSize: 18, fontWeight: 600 }}>Upload Feature Image</h1>

        <div
          onClick={() => inputRef.current?.click()}
          style={{
            border: '2px dashed #333',
            borderRadius: 8,
            padding: 24,
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: 16,
            background: preview ? 'transparent' : '#111',
          }}
        >
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="preview" style={{ maxWidth: '100%', maxHeight: 240, borderRadius: 6, objectFit: 'cover' }} />
          ) : (
            <p style={{ color: '#666', margin: 0 }}>Tap untuk pilih foto</p>
          )}
        </div>

        <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />

        {file && !result && (
          <button
            onClick={handleUpload}
            disabled={loading}
            style={{ width: '100%', padding: '12px', borderRadius: 8, background: loading ? '#333' : '#ff6b2b', color: '#fff', border: 'none', cursor: loading ? 'default' : 'pointer', fontWeight: 600, fontSize: 15 }}
          >
            {loading ? 'Mengupload & mengkompresi...' : 'Upload'}
          </button>
        )}

        {error && (
          <p style={{ color: '#f87171', marginTop: 12, fontSize: 14 }}>{error}</p>
        )}

        {result && (
          <div style={{ marginTop: 16, background: '#111', borderRadius: 8, padding: 16 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={result.url} alt="uploaded" style={{ width: '100%', borderRadius: 6, marginBottom: 12, objectFit: 'cover', maxHeight: 200 }} />
            <p style={{ color: '#aaa', fontSize: 12, margin: '0 0 4px' }}>Asset ID:</p>
            <p style={{ color: '#fff', fontSize: 13, fontFamily: 'monospace', wordBreak: 'break-all', margin: '0 0 12px' }}>{result.assetId}</p>
            <p style={{ color: '#aaa', fontSize: 12, margin: '0 0 12px' }}>
              {Math.round(result.size / 1024)}kb · JPEG
            </p>
            <button
              onClick={handleCopy}
              style={{ width: '100%', padding: '10px', borderRadius: 8, background: copied ? '#22c55e' : '#ff6b2b', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              {copied ? 'Copied!' : 'Copy Asset ID'}
            </button>
            <button
              onClick={() => { setFile(null); setPreview(null); setResult(null); if (inputRef.current) inputRef.current.value = '' }}
              style={{ marginTop: 8, width: '100%', padding: '10px', borderRadius: 8, background: 'transparent', color: '#666', border: '1px solid #333', cursor: 'pointer' }}
            >
              Upload gambar lain
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
