# SEO + Live Preview Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar campos de SEO (plugin oficial) em Pages/Courses/Articles, renderizar os metadados no `<head>` do frontend, e habilitar Live Preview em tempo real (iframe) para Pages e Courses no admin do Payload.

**Architecture:** Plugin `@payloadcms/plugin-seo` anexa um grupo "SEO" a cada collection. O frontend (rotas já `force-dynamic`) ganha `generateMetadata` que lê esses campos. Live Preview segue o padrão oficial do Payload: `admin.livePreview` aponta para `/next/preview` (rota que ativa `draftMode` e redireciona), as páginas leem `draftMode()` para consultar rascunhos com `draft: true`, e um client component `RefreshRouteOnSave` atualiza o iframe a cada save.

**Tech Stack:** Next.js 15 (App Router), Payload CMS 3.85.1, Cloudflare Workers / D1 (SQLite) / R2, `@payloadcms/plugin-seo`, `@payloadcms/live-preview-react`.

**Nota sobre TDD:** Esta é uma feature de integração/config (plugin, rotas, draft mode no Cloudflare Workers) sem suíte automatizada cobrindo admin/preview. A verificação de cada tarefa é por `pnpm lint` + `pnpm build` (typecheck) e checagem manual no dev server, conforme o spec.

---

## File Structure

**Novos:**
- `src/utilities/generatePreviewPath.ts` — `pathForDoc`, `buildFrontendUrl`, `generatePreviewPath` (mapeamento collection→caminho, compartilhado entre SEO e preview).
- `src/utilities/generateMeta.ts` — converte um doc com `meta` em `Metadata` do Next.
- `src/components/RefreshRouteOnSave.tsx` — client component que liga o live preview do admin ao `router.refresh()`.
- `src/app/(frontend)/next/preview/route.ts` — ativa `draftMode`, valida secret + auth, redireciona.
- `src/app/(frontend)/next/exit-preview/route.ts` — desativa `draftMode`.

**Modificados:**
- `src/payload.config.ts` — registrar `seoPlugin`, configurar `admin.livePreview`.
- `src/collections/Pages.ts`, `Courses.ts`, `Articles.ts` — access control `read` restringindo drafts a anônimos.
- `src/components/PageView.tsx` — exportar `queryPageBySlug`, suportar draft + `RefreshRouteOnSave`.
- `src/app/(frontend)/[slug]/page.tsx` — `generateMetadata`.
- `src/app/(frontend)/page.tsx` (home) — `generateMetadata` para slug `home`.
- `src/app/(frontend)/cursos/[slug]/page.tsx` — `queryCourseBySlug`, draft, `generateMetadata`, `RefreshRouteOnSave`.
- `.env`, `.env.example` — `NEXT_PUBLIC_SERVER_URL`, `PREVIEW_SECRET`.
- `wrangler.jsonc` — `vars.NEXT_PUBLIC_SERVER_URL` (produção).
- Gerados: `payload-types.ts`, `src/app/(payload)/admin/importMap.js`, `src/migrations/*`.

---

## Task 1: Instalar dependências

**Files:** `package.json`, `pnpm-lock.yaml`

- [ ] **Step 1: Instalar os pacotes (versões alinhadas ao core 3.85.1)**

```bash
pnpm add @payloadcms/plugin-seo@3.85.1 @payloadcms/live-preview-react@3.85.1
```

- [ ] **Step 2: Verificar que entraram em dependencies**

Run: `grep -E "plugin-seo|live-preview-react" package.json`
Expected: duas linhas, ambas `3.85.1`.

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: adiciona plugin-seo e live-preview-react"
```

---

## Task 2: Utilitário de caminhos e preview path

**Files:** Create `src/utilities/generatePreviewPath.ts`

- [ ] **Step 1: Criar o arquivo**

```ts
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
```

- [ ] **Step 2: Typecheck do arquivo (via build incremental do tsc do projeto)**

Run: `pnpm exec tsc --noEmit -p tsconfig.json 2>&1 | grep generatePreviewPath || echo "sem erros nesse arquivo"`
Expected: `sem erros nesse arquivo`.

- [ ] **Step 3: Commit**

```bash
git add src/utilities/generatePreviewPath.ts
git commit -m "feat: utilitário de caminhos e preview path"
```

---

## Task 3: Utilitário generateMeta

**Files:** Create `src/utilities/generateMeta.ts`

- [ ] **Step 1: Criar o arquivo**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add src/utilities/generateMeta.ts
git commit -m "feat: utilitário generateMeta para SEO no frontend"
```

---

## Task 4: Registrar plugin SEO e configurar Live Preview

**Files:** Modify `src/payload.config.ts`

- [ ] **Step 1: Adicionar imports (topo do arquivo, junto aos demais imports de plugin)**

```ts
import { seoPlugin } from '@payloadcms/plugin-seo'
import { buildFrontendUrl, generatePreviewPath } from './utilities/generatePreviewPath'
```

- [ ] **Step 2: Configurar `admin.livePreview` dentro do bloco `admin`**

Substituir o objeto `admin: { ... }` por:

```ts
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      collections: ['pages', 'courses'],
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
      url: ({ data, collectionConfig }) =>
        generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: collectionConfig?.slug ?? 'pages',
        }),
    },
  },
```

- [ ] **Step 3: Adicionar o `seoPlugin` ao array `plugins` (após o `r2Storage`)**

```ts
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
    seoPlugin({
      collections: ['pages', 'courses', 'articles'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }: { doc: any }) =>
        [doc?.title, 'Instituto Cavalus'].filter(Boolean).join(' — '),
      generateDescription: ({ doc }: { doc: any }) =>
        doc?.excerpt ?? doc?.description ?? doc?.lede ?? '',
      generateImage: ({ doc }: { doc: any }) => doc?.cover ?? doc?.featuredImage,
      generateURL: ({ doc, collectionSlug }: { doc: any; collectionSlug: string }) =>
        buildFrontendUrl(collectionSlug, doc?.slug),
    }),
  ],
```

- [ ] **Step 4: Regenerar tipos e importMap**

Run: `pnpm generate:types:payload && pnpm generate:importmap`
Expected: termina sem erro; `src/app/(payload)/admin/importMap.js` passa a referenciar componentes do `plugin-seo`.

- [ ] **Step 5: Verificar que o importMap inclui o plugin SEO**

Run: `grep -c "plugin-seo" src/app/(payload)/admin/importMap.js`
Expected: número ≥ 1.

- [ ] **Step 6: Commit**

```bash
git add src/payload.config.ts payload-types.ts "src/app/(payload)/admin/importMap.js"
git commit -m "feat: registra plugin SEO e configura live preview"
```

---

## Task 5: Restringir drafts no access control

**Files:** Modify `src/collections/Pages.ts`, `src/collections/Courses.ts`, `src/collections/Articles.ts`

- [ ] **Step 1: Em cada uma das três collections, substituir o bloco `access`**

De:

```ts
  access: {
    read: () => true,
  },
```

Para:

```ts
  access: {
    read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
  },
```

- [ ] **Step 2: Verificar a substituição nas três**

Run: `grep -l "_status: { equals: 'published' }" src/collections/Pages.ts src/collections/Courses.ts src/collections/Articles.ts`
Expected: os três caminhos listados.

- [ ] **Step 3: Commit**

```bash
git add src/collections/Pages.ts src/collections/Courses.ts src/collections/Articles.ts
git commit -m "fix: oculta rascunhos da API pública para anônimos"
```

---

## Task 6: Componente RefreshRouteOnSave

**Files:** Create `src/components/RefreshRouteOnSave.tsx`

- [ ] **Step 1: Criar o arquivo**

```tsx
'use client'

import { RefreshRouteOnSave as PayloadRefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'
import React from 'react'

/** Liga o Live Preview do admin ao refresh da rota no frontend. */
export function RefreshRouteOnSave() {
  const router = useRouter()

  return (
    <PayloadRefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL ?? ''}
    />
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/RefreshRouteOnSave.tsx
git commit -m "feat: componente RefreshRouteOnSave"
```

---

## Task 7: Rotas de draft mode

**Files:** Create `src/app/(frontend)/next/preview/route.ts`, `src/app/(frontend)/next/exit-preview/route.ts`

- [ ] **Step 1: Criar `next/preview/route.ts`**

```ts
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
```

- [ ] **Step 2: Criar `next/exit-preview/route.ts`**

```ts
import { draftMode } from 'next/headers'

export async function GET(): Promise<Response> {
  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode desativado')
}
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/(frontend)/next"
git commit -m "feat: rotas de draft mode (preview / exit-preview)"
```

---

## Task 8: PageView com draft + metadata nas páginas

**Files:** Modify `src/components/PageView.tsx`, `src/app/(frontend)/[slug]/page.tsx`, `src/app/(frontend)/page.tsx`

- [ ] **Step 1: Reescrever `src/components/PageView.tsx`**

```tsx
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { RefreshRouteOnSave } from './RefreshRouteOnSave'
import { RenderBlocks } from './RenderBlocks'

/** Busca uma página pelo slug, respeitando draft mode. */
export async function queryPageBySlug(slug: string) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'pages',
    limit: 1,
    draft,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return docs[0] ?? null
}

/** Busca uma página pelo slug e renderiza seus blocos. */
export async function PageView({ slug }: { slug: string }) {
  const { isEnabled: draft } = await draftMode()
  const page = await queryPageBySlug(slug)
  if (!page) notFound()

  return (
    <>
      {draft && <RefreshRouteOnSave />}
      <RenderBlocks blocks={page.layout} />
    </>
  )
}
```

- [ ] **Step 2: Reescrever `src/app/(frontend)/[slug]/page.tsx`**

```tsx
import type { Metadata } from 'next'
import React from 'react'

import { PageView, queryPageBySlug } from '@/components/PageView'
import { generateMeta } from '@/utilities/generateMeta'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = await queryPageBySlug(slug)
  return generateMeta(page)
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <PageView slug={slug} />
}
```

- [ ] **Step 3: Reescrever `src/app/(frontend)/page.tsx` (home)**

```tsx
import type { Metadata } from 'next'
import React from 'react'

import { PageView, queryPageBySlug } from '@/components/PageView'
import { generateMeta } from '@/utilities/generateMeta'

export const dynamic = 'force-dynamic'

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryPageBySlug('home')
  return generateMeta(page)
}

export default async function HomePage() {
  return <PageView slug="home" />
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/PageView.tsx "src/app/(frontend)/[slug]/page.tsx" "src/app/(frontend)/page.tsx"
git commit -m "feat: draft mode e metadata SEO nas páginas"
```

---

## Task 9: Cursos com draft + metadata + live preview

**Files:** Modify `src/app/(frontend)/cursos/[slug]/page.tsx`

- [ ] **Step 1: Reescrever o arquivo**

```tsx
import type { Metadata } from 'next'
import React from 'react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { CourseDetailBlock } from '@/blocks/CourseDetail/Component'
import { RefreshRouteOnSave } from '@/components/RefreshRouteOnSave'
import { generateMeta } from '@/utilities/generateMeta'

export const dynamic = 'force-dynamic'

async function queryCourseBySlug(slug: string) {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'courses',
    limit: 1,
    depth: 1,
    draft,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })

  return docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const course = await queryCourseBySlug(slug)
  return generateMeta(course)
}

export default async function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { isEnabled: draft } = await draftMode()
  const course = await queryCourseBySlug(slug)
  if (!course) notFound()

  return (
    <>
      {draft && <RefreshRouteOnSave />}
      <CourseDetailBlock course={course} />
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add "src/app/(frontend)/cursos/[slug]/page.tsx"
git commit -m "feat: draft mode, metadata e live preview em cursos"
```

---

## Task 10: Variáveis de ambiente

**Files:** Modify `.env`, `.env.example`, `wrangler.jsonc`

- [ ] **Step 1: Acrescentar ao `.env` (dev)**

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
PREVIEW_SECRET=local-preview-secret
```

- [ ] **Step 2: Acrescentar ao `.env.example` as mesmas chaves sem valores sensíveis**

```env
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
PREVIEW_SECRET=local-preview-secret
```

- [ ] **Step 3: Adicionar `vars` ao `wrangler.jsonc` (produção) logo após `"compatibility_flags": [...]`**

```jsonc
	"vars": {
		"NEXT_PUBLIC_SERVER_URL": "https://instituto-cavalus.suporte-fd8.workers.dev"
	},
```

> `PREVIEW_SECRET` em produção deve ser definido como secret do Worker (`wrangler secret put PREVIEW_SECRET`), não commitado. `NEXT_PUBLIC_SERVER_URL` é inlined no build — confirmar que está presente no ambiente de build do deploy. Ajustar a URL ao domínio real de produção.

- [ ] **Step 4: Commit**

```bash
git add .env.example wrangler.jsonc
git commit -m "chore: variáveis de ambiente para SEO e preview"
```

> `.env` não é commitado (gitignore). Confirmar com `git status` que só `.env.example` e `wrangler.jsonc` entraram.

---

## Task 11: Migration do schema (campos meta)

**Files:** Create `src/migrations/*`, Modify `src/migrations/index.ts`

- [ ] **Step 1: Gerar a migration**

Run: `pnpm payload migrate:create seo_fields`
Expected: cria `src/migrations/<timestamp>_seo_fields.ts` (+ `.json`) e atualiza `src/migrations/index.ts`. Deve incluir colunas `meta_title`, `meta_description`, `meta_image_id` nas tabelas `pages`, `courses`, `articles` e nas tabelas de versão `_pages_v`, `_courses_v`, `_articles_v`.

- [ ] **Step 2: Aplicar a migration no banco local**

Run: `pnpm payload migrate`
Expected: termina com `Done.`

- [ ] **Step 3: Conferir as colunas no D1 local**

Run: `pnpm exec wrangler d1 execute D1 --local --command "PRAGMA table_info(pages);" | grep -i meta_ || echo "checar manualmente"`
Expected: aparecem colunas `meta_title` / `meta_description` / `meta_image_id` (ou checar manualmente se o comando local divergir).

- [ ] **Step 4: Commit**

```bash
git add src/migrations
git commit -m "feat: migration dos campos de SEO"
```

---

## Task 12: Verificação final (build + manual)

**Files:** nenhum (verificação)

- [ ] **Step 1: Lint**

Run: `pnpm lint`
Expected: sem erros.

- [ ] **Step 2: Build de produção (typecheck completo)**

Run: `pnpm build`
Expected: build conclui sem erros de tipo nem de compilação.

- [ ] **Step 3: Checagem manual no dev server**

Run: `pnpm dev` e validar:
- Admin → abrir um Curso/Página/Artigo: grupo "SEO" presente; "Auto-gerar" preenche title/description; preview do Google aparece.
- Editar uma Página em rascunho → abrir o painel de Live Preview: renderiza e **atualiza ao digitar**; alternar breakpoints (mobile/tablet/desktop) funciona.
- `view-source` de `/` , `/<slug>` e `/cursos/<slug>`: `<title>`, `<meta name="description">` e tags `og:` refletindo os campos de SEO.
- `GET http://localhost:3000/api/pages` (sem login): rascunhos **não** aparecem; só `_status: published`.

- [ ] **Step 4: Commit final (se algum ajuste de verificação foi necessário)**

```bash
git add -A
git commit -m "chore: ajustes pós-verificação SEO + live preview"
```

---

## Self-Review (cobertura do spec)

- §4 SEO admin → Task 1, 4. ✅
- §5 SEO frontend (generateMeta + generateMetadata em pages/home/cursos) → Task 3, 8, 9. ✅
- §6 Live Preview (config, generatePreviewPath, rotas, RefreshRouteOnSave, draft nas páginas) → Task 2, 4, 6, 7, 8, 9. ✅
- §7 Access control drafts → Task 5. ✅
- §8 Env vars → Task 10. ✅
- §9 Migration/tipos/importMap → Task 4, 11. ✅
- §11 Verificação → Task 12. ✅
- §10 Pacotes → Task 1. ✅

Artigos: recebem campos de SEO (Task 4) e fix de access (Task 5); sem rota/preview, conforme decidido. ✅
