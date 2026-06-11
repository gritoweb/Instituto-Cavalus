import type { Metadata } from 'next'

type MediaLike = { url?: string | null; alt?: string | null } | string | null | undefined

function imageUrl(image: MediaLike): string | undefined {
  if (!image || typeof image === 'string') return undefined
  if (!image.url) return undefined
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
  return image.url.startsWith('http') ? image.url : `${base}${image.url}`
}

type DocWithMeta = {
  title?: string | null
  meta?: {
    title?: string | null
    description?: string | null
    image?: MediaLike
  } | null
  cover?: MediaLike
  featuredImage?: MediaLike
} | null

/** Converte os campos de SEO de um doc em Metadata do Next. */
export function generateMeta(doc: DocWithMeta): Metadata {
  const ogImage = imageUrl(doc?.meta?.image ?? doc?.cover ?? doc?.featuredImage)
  const title = doc?.meta?.title || doc?.title || 'Instituto Cavalus'
  const description = doc?.meta?.description ?? ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  }
}
