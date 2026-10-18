import { createClient } from '@sanity/client'
import sharp from 'sharp'
import { NextRequest, NextResponse } from 'next/server'

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-upload-secret')
  if (secret !== process.env.AUTHOR_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get('image') as File | null
  if (!file) {
    return NextResponse.json({ error: 'No image provided' }, { status: 400 })
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  // Compress: resize to max 1200px wide, JPEG, target <100kb
  let quality = 85
  let compressed: Buffer
  do {
    compressed = await sharp(buffer)
      .resize({ width: 1200, withoutEnlargement: true })
      .jpeg({ quality })
      .toBuffer()
    quality -= 10
  } while (compressed.length > 100_000 && quality > 20)

  const asset = await writeClient.assets.upload('image', compressed, {
    filename: file.name.replace(/\.[^.]+$/, '.jpg'),
    contentType: 'image/jpeg',
  })

  return NextResponse.json({
    assetId: asset._id,
    url: asset.url,
    size: compressed.length,
    width: asset.metadata?.dimensions?.width,
    height: asset.metadata?.dimensions?.height,
  })
}
