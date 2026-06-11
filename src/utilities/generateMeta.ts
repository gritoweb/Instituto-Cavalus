import type { Metadata } from 'next'

/** Resolve a URL de uma imagem (upload do Payload) quando populada; ignora ids não populados. */
function imageUrl(image: unknown): string | undefined {
  if (!image || typeof image !== 'object') return undefined
  const url = (image as { url?: string | null }).url
  if (!url) return undefined
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
  return url.startsWith('http') ? url : `${base}${url}`
}

type DocWithMeta = {
  title?: string | null
  meta?: {
    title?: string | null
    description?: string | null
    image?: unknown
  } | null
  cover?: unknown
  featuredImage?: unknown
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
