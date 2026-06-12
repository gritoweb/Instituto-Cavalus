# Componentização e Organização — GritoWeb

**Data:** 2026-05-15  
**Projeto:** grito-web (Next.js 15 + Payload CMS 3)  
**Escopo:** Abordagem A (cirúrgica) + B (estrutural)

---

## Problema

O projeto está funcional, mas blocos de página grandes misturam múltiplas responsabilidades num único arquivo, ícones SVG estão duplicados em 3 lugares diferentes, lógica de filtro/paginação é repetida em dois blocos distintos, e nenhuma pasta de componente tem barrel export. Isso dificulta manutenção e crescimento.

---

## Objetivo

Reorganizar e componentizar sem reescrever lógica. Cada arquivo deve ter uma responsabilidade clara. Imports devem ser simples. Código duplicado deve existir em um único lugar.

---

## O que NÃO muda

- Lógica de negócio dos blocos
- Collections e configuração do Payload CMS
- Estrutura de rotas do Next.js (`src/app/`)
- Estilos Tailwind existentes
- `payload-types.ts` (arquivo gerado)
- `src/access/`, `src/migrations/`, `src/fields/`

---

## Mudanças por área

### 1. Novas pastas em `src/`

| Pasta | Propósito |
|---|---|
| `src/icons/` | SVG compartilhados como componentes React tipados |
| `src/constants/` | Variantes de cor, strings fixas, slugs |
| `src/hooks/ui/` | Hooks de UI reutilizáveis (filter, pagination, search) |

A pasta `src/hooks/` já existe com hooks do Payload. Os hooks de UI ficam em `src/hooks/ui/` para separar os dois contextos.

---

### 2. Ícones compartilhados (`src/icons/`)

**Problema:** `ContactSection/Component.tsx` e `SectionServices/Component.tsx` definem ícones SVG inline, com duplicação.

**Solução:** Extrair para componentes React individuais com props tipadas.

```
src/icons/
├── index.ts            ← barrel export de todos os ícones
├── EmailIcon.tsx
├── PhoneIcon.tsx
├── WhatsAppIcon.tsx
├── InstagramIcon.tsx
├── LinkedInIcon.tsx
├── FacebookIcon.tsx
└── ArrowIcon.tsx
```

**Interface padrão de cada ícone:**
```ts
interface IconProps {
  className?: string
  size?: number
}
```

---

### 3. Constantes (`src/constants/`)

**Problema:** Strings `'blue'`, `'orange'`, `'white'` como magic strings em 8+ arquivos.

**Solução:**

```
src/constants/
├── index.ts
└── colors.ts
```

`colors.ts`:
```ts
export const COLOR_VARIANTS = ['blue', 'orange', 'white'] as const
export type ColorVariant = typeof COLOR_VARIANTS[number]
```

---

### 4. Hooks de UI (`src/hooks/ui/`)

**Problema:** `BlogListingClient.tsx` e `PortfolioListing/Component.tsx` implementam filtro por tag e paginação separadamente com código quase idêntico.

**Solução:** Extrair 3 hooks reutilizáveis:

```
src/hooks/ui/
├── index.ts
├── useFilter.ts      ← filtra array por tag ativa (null = todos)
├── usePagination.ts  ← controla página atual, retorna slice + total de páginas
└── useSearch.ts      ← busca por texto com debounce de 300ms
```

**Assinaturas:**
```ts
// useFilter.ts
function useFilter<T>(items: T[], getTag: (item: T) => string | undefined): {
  activeTag: string | null
  setActiveTag: (tag: string | null) => void
  filtered: T[]
}

// usePagination.ts
function usePagination<T>(items: T[], perPage: number): {
  page: number
  setPage: (p: number) => void
  currentItems: T[]
  totalPages: number
}

// useSearch.ts
function useSearch<T>(items: T[], getSearchText: (item: T) => string): {
  query: string
  setQuery: (q: string) => void
  results: T[]
}
```

---

### 5. Barrel exports (`index.ts`)

Cada pasta de componente ganha um `index.ts` que re-exporta o componente público. Pastas afetadas:

- `src/components/Button/`
- `src/components/Logo/`
- `src/components/sections/`
- `src/components/ui/`
- `src/icons/`
- `src/constants/`
- `src/hooks/ui/`
- Cada pasta de bloco em `src/blocks/`

---

### 6. Quebra interna dos blocos

Blocos com mais de ~100 linhas ou com múltiplas funções de render internas são divididos em sub-componentes **dentro da própria pasta do bloco**.

#### `src/blocks/ContactSection/`

**Antes:** 1 arquivo com formulário + ícones + canais + layout (~14KB)

**Depois:**
```
blocks/ContactSection/
├── index.ts
├── Component.tsx        ← orquestra, monta o layout final
├── ContactForm.tsx      ← campos, submit, estado de sucesso/erro
└── ContactChannels.tsx  ← exibe email, telefone, WhatsApp, sociais (usa ícones de src/icons/)
```

#### `src/blocks/BlogListing/`

**Antes:** `Component.tsx` + `BlogListingClient.tsx` monolítico

**Depois:**
```
blocks/BlogListing/
├── index.ts
├── Component.tsx           ← server component, busca dados
├── BlogListingClient.tsx   ← orquestra estado geral (usa hooks de ui/)
├── PostCard.tsx            ← card individual de post
├── SearchBar.tsx           ← input de busca
├── TagFilter.tsx           ← botões de tag
└── Pagination.tsx          ← controles de página anterior/próxima
```

#### `src/blocks/PortfolioListing/`

**Antes:** 1 arquivo grande com tudo misturado (~12KB)

**Depois:**
```
blocks/PortfolioListing/
├── index.ts
├── Component.tsx           ← server component
├── PortfolioClient.tsx     ← orquestra estado (usa hooks de ui/)
├── PortfolioCard.tsx       ← card de projeto (grid e lista)
├── ViewToggle.tsx          ← botão grid/lista
└── TagFilter.tsx           ← botões de tag (arquivo próprio, mesma interface de props que o de BlogListing — comportamento compartilhado via hooks/ui/)
```

#### `src/blocks/SectionServices/`

**Antes:** Renderiza 6 tipos de serviço com ícones inline grandes

**Depois:**
```
blocks/SectionServices/
├── index.ts
├── Component.tsx     ← monta o grid de serviços
├── ServiceCard.tsx   ← card individual (título, descrição, bullets, CTA)
└── ServiceIcon.tsx   ← os 6 tipos de ícone via prop `type`
```

#### `src/blocks/SectionTestimonials/`

**Antes:** Carousel com slide inline

**Depois:**
```
blocks/SectionTestimonials/
├── index.ts
├── Component.tsx          ← monta o carousel
└── TestimonialSlide.tsx   ← slide individual (avatar, texto, nome, cargo)
```

#### Blocos que permanecem com 1 arquivo

Blocos simples sem render functions internas não precisam ser divididos:

- `ChecklistGrid` — simples o suficiente
- `FaqBlock` — accordion simples
- `PullQuote` — display simples
- `SectionAbout` — já bem separado
- `SectionContact` — simples
- `SectionCta` — 3 variantes de cor, mas 1 arquivo é adequado
- `SectionLogoCloud` — decorativo simples
- `SectionProcess` — lista linear simples
- `SectionProjects` — cards mas sem interatividade
- `SectionStats` — display simples

Todos ganham `index.ts`.

---

## Ordem de implementação

A ordem evita quebrar imports entre arquivos durante a execução:

1. **Criar `src/icons/`** — sem dependências, outros arquivos passam a importar daqui
2. **Criar `src/constants/`** — sem dependências
3. **Criar `src/hooks/ui/`** — sem dependências de componentes
4. **Adicionar barrel exports** nos components/ e ui/ existentes — sem mudança de lógica
5. **Quebrar `SectionServices`** — usa icons/ criados no passo 1
6. **Quebrar `ContactSection`** — usa icons/ criados no passo 1
7. **Quebrar `BlogListing`** — usa hooks/ui/ criados no passo 3
8. **Quebrar `PortfolioListing`** — usa hooks/ui/ e TagFilter de BlogListing como referência
9. **Quebrar `SectionTestimonials`** — independente
10. **Adicionar index.ts nos blocos simples** — sem mudança de lógica

---

## Critérios de sucesso

- `pnpm build` passa sem erros após cada passo
- Nenhuma lógica de negócio alterada — só reorganização de arquivos
- Nenhum arquivo de bloco ultrapassa ~150 linhas
- Ícones duplicados existem em 1 único lugar (`src/icons/`)
- Hooks de filtro/paginação existem em 1 único lugar (`src/hooks/ui/`)
- Toda pasta de componente tem `index.ts`
