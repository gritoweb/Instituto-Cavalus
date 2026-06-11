# SEO + Live Preview — Design

**Data:** 2026-06-11
**Projeto:** instituto-cavalus (Next.js 15 + Payload CMS 3 em Cloudflare Workers / D1 / R2)
**Escopo:** Adicionar campos de SEO (plugin oficial) às collections de conteúdo e Live Preview completo (iframe em tempo real) no admin.

---

## 1. Objetivo

Dar aos editores, no admin do Payload:

- **SEO**: campos de metadados (title, description, imagem OG) em Páginas, Cursos e Artigos, com auto-geração e preview do snippet do Google.
- **Live Preview**: painel lateral no editor que renderiza a página real e atualiza em tempo real conforme se edita, com breakpoints (mobile/tablet/desktop). Apenas para Páginas e Cursos (que têm rota de frontend).

E, no frontend público, renderizar os metadados de SEO no `<head>` das páginas dinâmicas.

---

## 2. Decisões de escopo

| Item | Decisão |
|---|---|
| SEO em quais collections | Pages, Courses, Articles |
| Implementação do SEO | Plugin oficial `@payloadcms/plugin-seo` |
| Render de SEO no frontend | Sim, via `generateMetadata` em Pages e Courses |
| Live Preview em quais collections | Pages e Courses (têm rota); Articles ficam de fora por ora |
| Nível de Live Preview | Completo: iframe + atualização em tempo real + breakpoints |
| Artigos | Recebem só os campos de SEO; Live Preview de artigo fica para quando existir a rota `/artigos/[slug]` |

**Contexto que motivou a exclusão de Artigos do Live Preview:** a collection `Articles` não tem campo de corpo nem rota de detalhe (`/artigos/[slug]`). `mapArticle` já aponta `href` para `/artigos/${slug}`, mas a rota ainda não existe. Criar a página de artigo está fora deste escopo.

---

## 3. O que NÃO muda

- Lógica de negócio dos blocos e dos componentes de UI.
- Estrutura de blocos das Páginas.
- Estilos Tailwind.
- Collections além dos campos de SEO e do ajuste de access control `read`.

---

## 4. SEO (admin)

Instalar `@payloadcms/plugin-seo@3.85.1` e registrar em `payload.config.ts` no array `plugins`:

```ts
import { seoPlugin } from '@payloadcms/plugin-seo'

seoPlugin({
  collections: ['pages', 'courses', 'articles'],
  uploadsCollection: 'media',
  generateTitle: ({ doc }) =>
    [doc?.title, 'Instituto Cavalus'].filter(Boolean).join(' — '),
  generateDescription: ({ doc }) =>
    doc?.excerpt ?? doc?.description ?? doc?.lede ?? '',
  generateImage: ({ doc }) => doc?.cover ?? doc?.featuredImage,
  generateURL: ({ doc, collectionSlug }) => buildFrontendUrl(collectionSlug, doc?.slug),
})
```

`buildFrontendUrl` é um pequeno helper (em `src/utilities/`) que mapeia `collectionSlug` → caminho (`pages` → `/<slug>`, `courses` → `/cursos/<slug>`) e prefixa `NEXT_PUBLIC_SERVER_URL`. É a mesma lógica de mapeamento usada por `generatePreviewPath`, então as duas compartilham essa função.

- **Sem `tabbedUI`**: o plugin anexa um grupo recolhível **"SEO"** ao final de cada documento (`meta.title`, `meta.description`, `meta.image`). Preserva o layout atual — Pages/Articles não são tabbed e Courses já tem suas próprias tabs. Consistente nas três collections e não-invasivo.
- Botões de auto-geração e preview do snippet do Google são fornecidos pelo plugin.
- Os componentes de admin do plugin exigem regenerar o importMap (`pnpm generate:importmap`).

---

## 5. SEO (frontend)

Utilitário `src/utilities/generateMeta.ts`:

- Recebe um doc com `meta` (e fallback para `cover`/`featuredImage`) e devolve um objeto `Metadata` do Next: `title`, `description`, `openGraph.images`.
- Resolve a URL absoluta da imagem usando `NEXT_PUBLIC_SERVER_URL`.

Cada rota dinâmica ganha `generateMetadata`:

- `src/app/(frontend)/[slug]/page.tsx` (Páginas)
- `src/app/(frontend)/cursos/[slug]/page.tsx` (Cursos)

Para evitar duplicar a query entre `generateMetadata` e o render, extrair helpers de busca por slug reutilizados pelos dois (ex.: `queryPageBySlug`, `queryCourseBySlug`). Como as rotas já são `force-dynamic`, não há implicação de cache.

Artigos não recebem `generateMetadata` neste escopo.

---

## 6. Live Preview

### 6.1 Config

Em `payload.config.ts`, `admin.livePreview`, centralizado:

```ts
admin: {
  // ...
  livePreview: {
    collections: ['pages', 'courses'],
    breakpoints: [
      { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
      { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
      { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
    ],
    url: ({ data, collectionConfig }) =>
      generatePreviewPath({ slug: data?.slug, collection: collectionConfig?.slug }),
  },
}
```

### 6.2 Fluxo (padrão oficial Payload)

1. `generatePreviewPath()` (utilitário em `src/utilities/`) monta `/next/preview?slug=…&collection=…&secret=PREVIEW_SECRET`.
2. **`src/app/(frontend)/next/preview/route.ts`** — valida `PREVIEW_SECRET`, chama `draftMode().enable()`, redireciona para a página real (`/[slug]` ou `/cursos/[slug]`).
3. **`src/app/(frontend)/next/exit-preview/route.ts`** — `draftMode().disable()`.
4. As páginas reais leem `draftMode()`; quando ativo, consultam com `draft: true` (e `overrideAccess: true`) e renderizam o client component **`<RefreshRouteOnSave>`** (de `@payloadcms/live-preview-react`, a instalar), que escuta o `postMessage` do admin e chama `router.refresh()`.

### 6.3 Cloudflare / OpenNext

Admin e frontend rodam no mesmo worker (mesma origem), então o iframe do live preview embeda sem conflito de `X-Frame-Options`. As rotas de frontend já são `force-dynamic`, compatível com `draftMode`.

---

## 7. Drafts e access control

Hoje as três collections têm `read: () => true` com drafts ativos — isso expõe rascunhos pela API pública. Ajustar para:

```ts
read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
```

Aplicar em **Pages, Courses e Articles**. Resultado: anônimos só veem publicados; usuários autenticados (e o live preview, via `draft: true`) veem rascunhos.

---

## 8. Variáveis de ambiente

Adicionar a `.env` e `.env.example`:

| Variável | Dev | Produção |
|---|---|---|
| `NEXT_PUBLIC_SERVER_URL` | `http://localhost:3000` | URL do worker (via `wrangler.jsonc` vars) |
| `PREVIEW_SECRET` | `local-preview-secret` | string secreta |

Usadas por `generatePreviewPath`, pelo `generateURL` do SEO e pela resolução de imagem em `generateMeta`.

---

## 9. Migration e tipos

Os campos `meta.*` adicionam colunas nas tabelas das três collections **e nas tabelas de versões** (`_pages_v`, `_courses_v`, `_articles_v`, pois drafts estão ativos).

Passos:

1. `pnpm generate:types` — atualizar `payload-types.ts`.
2. `pnpm generate:importmap` — registrar componentes de admin do plugin SEO.
3. `pnpm payload migrate:create` — gerar a migration local.
4. Produção: `pnpm run deploy:database` aplica a migration no D1 remoto.

---

## 10. Pacotes a instalar

- `@payloadcms/plugin-seo@3.85.1`
- `@payloadcms/live-preview-react@3.85.1`

---

## 11. Verificação (manual, dev)

- **SEO admin:** abrir um Curso/Página/Artigo → grupo "SEO" presente; auto-gerar title/description e preview do Google funcionando.
- **SEO frontend:** `view-source` de `/[slug]` e `/cursos/[slug]` → `<title>`, `<meta name="description">` e tags Open Graph corretos.
- **Live Preview:** editar uma Página em rascunho → painel de preview renderiza e **atualiza ao digitar**; alternar breakpoints funciona; rascunho aparece no preview mas **não** na API pública anônima (`GET /api/pages`).
- **Build:** `pnpm lint` e `pnpm build` limpos.

Sem testes automatizados novos — não há suíte cobrindo admin/preview; a verificação é visual/manual.

---

## 12. Arquivos afetados (estimativa)

**Novos:**
- `src/utilities/generateMeta.ts`
- `src/utilities/generatePreviewPath.ts` (inclui `buildFrontendUrl` compartilhado com o SEO)
- `src/app/(frontend)/next/preview/route.ts`
- `src/app/(frontend)/next/exit-preview/route.ts`
- `src/components/RefreshRouteOnSave.tsx` (client)

**Modificados:**
- `src/payload.config.ts` (plugin SEO, `admin.livePreview`)
- `src/collections/Pages.ts`, `Courses.ts`, `Articles.ts` (access `read`)
- `src/app/(frontend)/[slug]/page.tsx` e `src/components/PageView.tsx` (draftMode, generateMetadata, RefreshRouteOnSave)
- `src/app/(frontend)/cursos/[slug]/page.tsx` (draftMode, generateMetadata, RefreshRouteOnSave)
- `.env`, `.env.example`, `wrangler.jsonc` (vars)
- `package.json` (dependências)
- `src/migrations/*` (nova migration + index)
- `payload-types.ts`, `src/app/(payload)/admin/importMap.js` (gerados)
