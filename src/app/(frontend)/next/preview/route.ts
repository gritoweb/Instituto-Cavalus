import type { CollectionSlug } from 'payload'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'

export async function GET(req: Request): Promise<Response> {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  const collection = searchParams.get('collection') as CollectionSlug | null
  const slug = searchParams.get('slug')
  const previewSecret = searchParams.get('previewSecret')

  if (previewSecret !== process.env.PREVIEW_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  if (!path || !collection || !slug) {
    return new Response('Parâmetros insuficientes', { status: 404 })
  }

  if (!path.startsWith('/')) {
    return new Response('Path inválido', { status: 400 })
  }

  const payload = await getPayload({ config: await config })

  // Garante que quem aciona o preview está autenticado no admin.
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const draft = await draftMode()
  draft.enable()

  redirect(path)
}
