import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
})

/**
 * Fetch yang tidak menjatuhkan build saat dataset belum ada.
 * Kondisi ini normal di instalasi baru: project Sanity belum dibuat,
 * atau dataset masih kosong. Halaman akan memakai copy fallback.
 */
export async function fetchList<T>(
  query: string,
  params: Record<string, unknown> = {},
  options?: { next?: { revalidate?: number } }
): Promise<T[]> {
  try {
    const data = await client.fetch<T[]>(query, params, options)
    return Array.isArray(data) ? data : []
  } catch (err) {
    console.warn('[sanity] list query failed:', (err as Error).message)
    return []
  }
}

export async function fetchOne<T>(
  query: string,
  params: Record<string, unknown> = {},
  options?: { next?: { revalidate?: number } }
): Promise<T | null> {
  try {
    return await client.fetch<T | null>(query, params, options)
  } catch (err) {
    console.warn('[sanity] query failed:', (err as Error).message)
    return null
  }
}

const builder = imageUrlBuilder(client)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}
