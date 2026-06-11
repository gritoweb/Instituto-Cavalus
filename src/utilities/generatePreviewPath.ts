// Mapeia uma collection + slug para o caminho público correspondente,
// e monta a URL de ativação do draft mode usada pelo Live Preview.

const collectionPrefix: Record<string, string> = {
  pages: '',
  courses: '/cursos',
}

/** Caminho público de um documento (ex.: pages/home -> "/", courses/abc -> "/cursos/abc"). */
export function pathForDoc(collection: string, slug?: string | null): string {
  const safeSlug = slug ?? ''
  if (collection === 'pages' && (safeSlug === 'home' || safeSlug === '')) return '/'
  const prefix = collectionPrefix[collection] ?? ''
  return `${prefix}/${safeSlug}`
}

/** URL absoluta de um documento, usando NEXT_PUBLIC_SERVER_URL como base. */
export function buildFrontendUrl(collection: string, slug?: string | null): string {
  const base = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
  return `${base}${pathForDoc(collection, slug)}`
}

type PreviewArgs = { slug?: string | null; collection: string }

/** Caminho relativo para a rota que ativa o draft mode e redireciona ao doc. */
export function generatePreviewPath({ slug, collection }: PreviewArgs): string {
  const params = new URLSearchParams({
    slug: slug ?? '',
    collection,
    path: pathForDoc(collection, slug),
    previewSecret: process.env.PREVIEW_SECRET ?? '',
  })
  return `/next/preview?${params.toString()}`
}
