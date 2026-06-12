# Componentização e Organização — GritoWeb

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Quebrar blocos grandes em sub-componentes com responsabilidade única, extrair ícones e lógica duplicada para lugares centrais, e adicionar barrel exports em todas as pastas de componente.

**Architecture:** Nenhuma lógica de negócio é reescrita — apenas reorganização de arquivos. Cada bloco grande (`ContactSection`, `BlogListing`, `PortfolioListing`, `SectionServices`, `SectionTestimonials`) ganha sub-componentes dentro de sua própria pasta. Ícones SVG duplicados em 3 blocos distintos vão para `src/icons/`. Lógica de filtro e paginação dos dois listings viram hooks em `src/hooks/ui/`.

**Tech Stack:** Next.js 15 App Router, React Server Components, TypeScript strict, Tailwind CSS, Payload CMS 3

---

## Mapa de arquivos

### Criados do zero
| Arquivo | Responsabilidade |
|---|---|
| `src/icons/EmailIcon.tsx` | SVG do ícone de email |
| `src/icons/PhoneIcon.tsx` | SVG do ícone de telefone |
| `src/icons/WhatsAppIcon.tsx` | SVG do ícone de WhatsApp |
| `src/icons/InstagramIcon.tsx` | SVG do ícone de Instagram |
| `src/icons/LinkedInIcon.tsx` | SVG do ícone de LinkedIn |
| `src/icons/LocationIcon.tsx` | SVG do ícone de localização |
| `src/icons/ArrowRightIcon.tsx` | SVG seta direita (usado em 2 blocos) |
| `src/icons/SearchIcon.tsx` | SVG lupa de busca |
| `src/icons/CheckIcon.tsx` | SVG check de sucesso |
| `src/icons/GridIcon.tsx` | SVG ícone de grade |
| `src/icons/ListIcon.tsx` | SVG ícone de lista |
| `src/icons/StarIcon.tsx` | SVG estrela de avaliação |
| `src/icons/index.ts` | Barrel: re-exporta todos os ícones + `ICON_MAP` |
| `src/constants/colors.ts` | `ColorVariant` type + `COLOR_VARIANTS` array |
| `src/constants/index.ts` | Barrel de constantes |
| `src/hooks/ui/useFilter.ts` | Hook: filtra array por tag ativa |
| `src/hooks/ui/usePagination.ts` | Hook: paginação com slice e total de páginas |
| `src/hooks/ui/useSearch.ts` | Hook: busca por texto com reset de página |
| `src/hooks/ui/index.ts` | Barrel de hooks de UI |
| `src/components/Logo/index.ts` | Barrel: exporta Logo e LogoWord |
| `src/components/ui/index.ts` | Barrel: exporta Avatar, TestimonialCard, ChatMark |
| `src/blocks/SectionServices/ServiceIcon.tsx` | Os 6 tipos de ícone de serviço |
| `src/blocks/SectionServices/index.ts` | Barrel do bloco |
| `src/blocks/SectionTestimonials/StarRating.tsx` | Linha de estrelas + nota + contagem |
| `src/blocks/SectionTestimonials/index.ts` | Barrel do bloco |
| `src/blocks/ContactSection/ContactForm.tsx` | Formulário completo com estado |
| `src/blocks/ContactSection/ContactChannels.tsx` | Sidebar de canais de contato |
| `src/blocks/ContactSection/index.ts` | Barrel do bloco |
| `src/blocks/BlogListing/PostCard.tsx` | Card de post individual + Tag |
| `src/blocks/BlogListing/FeaturedPost.tsx` | Banner de post em destaque |
| `src/blocks/BlogListing/SearchBar.tsx` | Input de busca com ícone |
| `src/blocks/BlogListing/TagFilter.tsx` | Pills de filtro por tag |
| `src/blocks/BlogListing/Pagination.tsx` | Navegação de páginas |
| `src/blocks/BlogListing/index.ts` | Barrel do bloco |
| `src/blocks/PortfolioListing/PortfolioCard.tsx` | Cards grid e lista de portfólio + Tag |
| `src/blocks/PortfolioListing/ViewToggle.tsx` | Botão grade/lista |
| `src/blocks/PortfolioListing/TagFilter.tsx` | Pills de filtro por tag |
| `src/blocks/PortfolioListing/index.ts` | Barrel do bloco |
| `src/blocks/ChecklistGrid/index.ts` | Barrel do bloco simples |
| `src/blocks/FaqBlock/index.ts` | Barrel do bloco simples |
| `src/blocks/PullQuote/index.ts` | Barrel do bloco simples |
| `src/blocks/SectionAbout/index.ts` | Barrel do bloco simples |
| `src/blocks/SectionContact/index.ts` | Barrel do bloco simples |
| `src/blocks/SectionCta/index.ts` | Barrel do bloco simples |
| `src/blocks/SectionLogoCloud/index.ts` | Barrel do bloco simples |
| `src/blocks/SectionProcess/index.ts` | Barrel do bloco simples |
| `src/blocks/SectionProjects/index.ts` | Barrel do bloco simples |
| `src/blocks/SectionStats/index.ts` | Barrel do bloco simples |

### Modificados
| Arquivo | O que muda |
|---|---|
| `src/blocks/SectionServices/Component.tsx` | Remove `ServiceIcon` inline, importa de `./ServiceIcon` |
| `src/blocks/SectionTestimonials/Component.tsx` | Remove estrelas inline, importa `StarRating` |
| `src/blocks/ContactSection/Component.tsx` | Vira orquestrador: importa `ContactForm` + `ContactChannels` |
| `src/blocks/BlogListing/BlogListingClient.tsx` | Vira orquestrador: importa sub-componentes |
| `src/blocks/PortfolioListing/PortfolioListingClient.tsx` | Vira orquestrador: importa sub-componentes |

---

## Task 1: Criar `src/icons/` com ícones SVG compartilhados

**Files:**
- Create: `src/icons/EmailIcon.tsx`
- Create: `src/icons/PhoneIcon.tsx`
- Create: `src/icons/WhatsAppIcon.tsx`
- Create: `src/icons/InstagramIcon.tsx`
- Create: `src/icons/LinkedInIcon.tsx`
- Create: `src/icons/LocationIcon.tsx`
- Create: `src/icons/ArrowRightIcon.tsx`
- Create: `src/icons/SearchIcon.tsx`
- Create: `src/icons/CheckIcon.tsx`
- Create: `src/icons/GridIcon.tsx`
- Create: `src/icons/ListIcon.tsx`
- Create: `src/icons/StarIcon.tsx`
- Create: `src/icons/index.ts`

- [ ] **Criar EmailIcon.tsx**

```tsx
// src/icons/EmailIcon.tsx
interface IconProps {
  className?: string
  size?: number
}

export function EmailIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 7l10 7 10-7" />
    </svg>
  )
}
```

- [ ] **Criar PhoneIcon.tsx**

```tsx
// src/icons/PhoneIcon.tsx
interface IconProps {
  className?: string
  size?: number
}

export function PhoneIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.79 19.79 0 0 1 11.39 19a19.5 19.5 0 0 1-5-5A19.79 19.79 0 0 1 3.09 4.18 2 2 0 0 1 5.08 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L9.09 9.91a16 16 0 0 0 5 5l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
```

- [ ] **Criar WhatsAppIcon.tsx**

```tsx
// src/icons/WhatsAppIcon.tsx
interface IconProps {
  className?: string
  size?: number
}

export function WhatsAppIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  )
}
```

- [ ] **Criar InstagramIcon.tsx**

```tsx
// src/icons/InstagramIcon.tsx
interface IconProps {
  className?: string
  size?: number
}

export function InstagramIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
```

- [ ] **Criar LinkedInIcon.tsx**

```tsx
// src/icons/LinkedInIcon.tsx
interface IconProps {
  className?: string
  size?: number
}

export function LinkedInIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}
```

- [ ] **Criar LocationIcon.tsx**

```tsx
// src/icons/LocationIcon.tsx
interface IconProps {
  className?: string
  size?: number
}

export function LocationIcon({ className, size = 18 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}
```

- [ ] **Criar ArrowRightIcon.tsx**

```tsx
// src/icons/ArrowRightIcon.tsx
interface IconProps {
  className?: string
  size?: number
  strokeWidth?: number
}

export function ArrowRightIcon({ className, size = 16, strokeWidth = 2.5 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} aria-hidden="true" className={className}>
      <path d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  )
}
```

- [ ] **Criar SearchIcon.tsx**

```tsx
// src/icons/SearchIcon.tsx
interface IconProps {
  className?: string
  size?: number
}

export function SearchIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  )
}
```

- [ ] **Criar CheckIcon.tsx**

```tsx
// src/icons/CheckIcon.tsx
interface IconProps {
  className?: string
  size?: number
}

export function CheckIcon({ className, size = 26 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true" className={className}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
```

- [ ] **Criar GridIcon.tsx**

```tsx
// src/icons/GridIcon.tsx
interface IconProps {
  className?: string
  size?: number
}

export function GridIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}
```

- [ ] **Criar ListIcon.tsx**

```tsx
// src/icons/ListIcon.tsx
interface IconProps {
  className?: string
  size?: number
}

export function ListIcon({ className, size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className={className}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}
```

- [ ] **Criar StarIcon.tsx**

```tsx
// src/icons/StarIcon.tsx
interface IconProps {
  className?: string
  size?: number
  fill?: string
}

export function StarIcon({ className, size = 22, fill = '#FE9D2B' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} aria-hidden="true" className={className}>
      <polygon points="12,2 15,9 22,9 16,14 18,21 12,17 6,21 8,14 2,9 9,9" />
    </svg>
  )
}
```

- [ ] **Criar src/icons/index.ts**

```ts
// src/icons/index.ts
export { EmailIcon } from './EmailIcon'
export { PhoneIcon } from './PhoneIcon'
export { WhatsAppIcon } from './WhatsAppIcon'
export { InstagramIcon } from './InstagramIcon'
export { LinkedInIcon } from './LinkedInIcon'
export { LocationIcon } from './LocationIcon'
export { ArrowRightIcon } from './ArrowRightIcon'
export { SearchIcon } from './SearchIcon'
export { CheckIcon } from './CheckIcon'
export { GridIcon } from './GridIcon'
export { ListIcon } from './ListIcon'
export { StarIcon } from './StarIcon'

import { EmailIcon } from './EmailIcon'
import { PhoneIcon } from './PhoneIcon'
import { WhatsAppIcon } from './WhatsAppIcon'
import { InstagramIcon } from './InstagramIcon'
import { LinkedInIcon } from './LinkedInIcon'
import { LocationIcon } from './LocationIcon'
import type React from 'react'

export const ICON_MAP: Record<string, React.FC<{ className?: string; size?: number }>> = {
  email: EmailIcon,
  phone: PhoneIcon,
  whatsapp: WhatsAppIcon,
  instagram: InstagramIcon,
  linkedin: LinkedInIcon,
  location: LocationIcon,
}
```

- [ ] **Verificar build**

```bash
cd /home/julio-jara/Projetos/novoGrito/grito-web && pnpm build 2>&1 | tail -20
```

Esperado: sem erros de TypeScript nos novos arquivos.

- [ ] **Commit**

```bash
git add src/icons/ && git commit -m "feat: add shared icon components to src/icons/"
```

---

## Task 2: Criar `src/constants/`

**Files:**
- Create: `src/constants/colors.ts`
- Create: `src/constants/index.ts`

- [ ] **Criar colors.ts**

```ts
// src/constants/colors.ts
export const COLOR_VARIANTS = ['blue', 'orange', 'white'] as const
export type ColorVariant = typeof COLOR_VARIANTS[number]

export const ACCENT_VARIANTS = ['blue', 'orange'] as const
export type AccentVariant = typeof ACCENT_VARIANTS[number]

export const accentBgClasses: Record<AccentVariant, string> = {
  blue: 'bg-blue/8',
  orange: 'bg-orange/10',
}

export const tagVariantClasses: Record<AccentVariant, string> = {
  blue: 'bg-blue/10 text-blue',
  orange: 'bg-orange/15 text-orange-700',
}
```

- [ ] **Criar index.ts**

```ts
// src/constants/index.ts
export { COLOR_VARIANTS, ACCENT_VARIANTS, accentBgClasses, tagVariantClasses } from './colors'
export type { ColorVariant, AccentVariant } from './colors'
```

- [ ] **Commit**

```bash
git add src/constants/ && git commit -m "feat: add shared constants to src/constants/"
```

---

## Task 3: Criar `src/hooks/ui/`

**Files:**
- Create: `src/hooks/ui/useFilter.ts`
- Create: `src/hooks/ui/usePagination.ts`
- Create: `src/hooks/ui/useSearch.ts`
- Create: `src/hooks/ui/index.ts`

- [ ] **Criar useFilter.ts**

```ts
// src/hooks/ui/useFilter.ts
import { useState, useMemo } from 'react'

export function useFilter<T>(items: T[], getTag: (item: T) => string | null | undefined) {
  const [activeTag, setActiveTag] = useState<string>('all')

  const filtered = useMemo(() => {
    if (activeTag === 'all') return items
    return items.filter((item) => getTag(item) === activeTag)
  }, [items, activeTag, getTag])

  const handleSetTag = (tag: string) => {
    setActiveTag(tag)
  }

  return { activeTag, setActiveTag: handleSetTag, filtered }
}
```

- [ ] **Criar usePagination.ts**

```ts
// src/hooks/ui/usePagination.ts
import { useState, useMemo } from 'react'

export function usePagination<T>(items: T[], perPage: number) {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / perPage))
  const safePage = Math.min(page, totalPages)

  const currentItems = useMemo(
    () => items.slice((safePage - 1) * perPage, safePage * perPage),
    [items, safePage, perPage],
  )

  const pageNumbers = useMemo((): (number | '…')[] => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | '…')[] = [1]
    if (safePage > 3) pages.push('…')
    for (let i = Math.max(2, safePage - 1); i <= Math.min(totalPages - 1, safePage + 1); i++) {
      pages.push(i)
    }
    if (safePage < totalPages - 2) pages.push('…')
    pages.push(totalPages)
    return pages
  }, [totalPages, safePage])

  return {
    page: safePage,
    setPage,
    currentItems,
    totalPages,
    pageNumbers,
  }
}
```

- [ ] **Criar useSearch.ts**

```ts
// src/hooks/ui/useSearch.ts
import { useState, useMemo } from 'react'

export function useSearch<T>(items: T[], getSearchText: (item: T) => string) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => getSearchText(item).toLowerCase().includes(q))
  }, [items, query, getSearchText])

  return { query, setQuery, results }
}
```

- [ ] **Criar index.ts**

```ts
// src/hooks/ui/index.ts
export { useFilter } from './useFilter'
export { usePagination } from './usePagination'
export { useSearch } from './useSearch'
```

- [ ] **Commit**

```bash
git add src/hooks/ui/ && git commit -m "feat: add shared UI hooks (useFilter, usePagination, useSearch)"
```

---

## Task 4: Barrel exports para pastas de componentes existentes

**Files:**
- Create: `src/components/Logo/index.ts`
- Create: `src/components/ui/index.ts`

> Nota: `src/components/sections/index.ts` já existe. `src/components/Button/index.tsx` já existe.

- [ ] **Criar src/components/Logo/index.ts**

```ts
// src/components/Logo/index.ts
export { Logo, LogoWord } from './Logo'
```

- [ ] **Verificar o que Logo.tsx exporta** — confirmar nomes antes de commitar:

```bash
grep "^export" /home/julio-jara/Projetos/novoGrito/grito-web/src/components/Logo/Logo.tsx
```

Ajustar os nomes no index.ts se necessário.

- [ ] **Criar src/components/ui/index.ts**

```ts
// src/components/ui/index.ts
export { Avatar } from './Avatar'
export { TestimonialCard } from './TestimonialCard'
export { ChatMark } from './ChatMark'
```

- [ ] **Verificar exports existentes nos arquivos ui/**

```bash
grep "^export" /home/julio-jara/Projetos/novoGrito/grito-web/src/components/ui/*.tsx
```

Ajustar nomes no index.ts se houver divergência.

- [ ] **Commit**

```bash
git add src/components/Logo/index.ts src/components/ui/index.ts && git commit -m "feat: add barrel exports to Logo and ui component folders"
```

---

## Task 5: Quebrar `SectionServices` — extrair `ServiceIcon`

**Files:**
- Create: `src/blocks/SectionServices/ServiceIcon.tsx`
- Create: `src/blocks/SectionServices/index.ts`
- Modify: `src/blocks/SectionServices/Component.tsx`

- [ ] **Criar ServiceIcon.tsx** — move o switch de SVGs do Component.tsx

```tsx
// src/blocks/SectionServices/ServiceIcon.tsx
export type ServiceIconType = 'globe' | 'cart' | 'landing' | 'screen' | 'brand' | 'code'

interface ServiceIconProps {
  type: ServiceIconType
}

export function ServiceIcon({ type }: ServiceIconProps) {
  switch (type) {
    case 'globe':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" />
        </svg>
      )
    case 'cart':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M3 4h2l3 12h11l2-8H6" />
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
        </svg>
      )
    case 'landing':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 2v20M5 9l7-7 7 7M9 14h6" />
        </svg>
      )
    case 'screen':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="3" y="3" width="18" height="14" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      )
    case 'brand':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      )
    case 'code':
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
        </svg>
      )
  }
}
```

- [ ] **Atualizar Component.tsx** — remover o `ServiceIcon` local e importar o novo

```tsx
// src/blocks/SectionServices/Component.tsx
import React from 'react'
import type { SectionServicesBlock } from '@/payload-types'
import { SectionTitle, ServiceGrid } from '@/components/sections'
import { parseTitle } from '@/utilities/parseTitle'
import { ServiceCard } from '@/home/cards'
import { ServiceIcon, type ServiceIconType } from './ServiceIcon'

export const SectionServicesComponent: React.FC<SectionServicesBlock> = ({
  eyebrow,
  title,
  description,
  services,
}) => {
  return (
    <section className="px-12 pt-24 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between flex-wrap gap-6 mb-10">
          <SectionTitle eyebrow={eyebrow ?? undefined} align="left">
            {parseTitle(title)}
          </SectionTitle>
          {description && (
            <p className="max-w-md text-mute body-text m-0">{description}</p>
          )}
        </div>
        <ServiceGrid>
          {(services ?? []).map((service) => (
            <ServiceCard
              key={service.id}
              variant={service.variant as 'blue' | 'orange'}
              icon={<ServiceIcon type={service.iconType as ServiceIconType} />}
              title={service.name}
              description={service.description}
              bullets={service.bullets?.map((b) => b.text) ?? undefined}
              ctaLabel={service.ctaLabel ?? undefined}
              href={service.ctaHref ?? '#'}
            />
          ))}
        </ServiceGrid>
      </div>
    </section>
  )
}
```

- [ ] **Criar index.ts**

```ts
// src/blocks/SectionServices/index.ts
export { SectionServicesComponent } from './Component'
export { ServiceIcon, type ServiceIconType } from './ServiceIcon'
```

- [ ] **Verificar build**

```bash
cd /home/julio-jara/Projetos/novoGrito/grito-web && pnpm build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/blocks/SectionServices/ && git commit -m "refactor(SectionServices): extract ServiceIcon into dedicated file"
```

---

## Task 6: Quebrar `SectionTestimonials` — extrair `StarRating`

**Files:**
- Create: `src/blocks/SectionTestimonials/StarRating.tsx`
- Create: `src/blocks/SectionTestimonials/index.ts`
- Modify: `src/blocks/SectionTestimonials/Component.tsx`

- [ ] **Criar StarRating.tsx**

```tsx
// src/blocks/SectionTestimonials/StarRating.tsx
import { StarIcon } from '@/icons'

interface StarRatingProps {
  ratingValue?: string | null
  reviewCount?: string | null
}

export function StarRating({ ratingValue, reviewCount }: StarRatingProps) {
  return (
    <div className="mt-6 flex items-center gap-2">
      <div className="flex gap-0.5" aria-label={`Avaliação: ${ratingValue} estrelas`}>
        {[0, 1, 2, 3, 4].map((index) => (
          <StarIcon key={index} size={22} />
        ))}
      </div>
      {ratingValue && (
        <span className="font-display font-bold text-blue ml-1">{ratingValue}</span>
      )}
      {reviewCount && (
        <span className="text-mute text-sm">· {reviewCount}</span>
      )}
    </div>
  )
}
```

- [ ] **Atualizar Component.tsx**

```tsx
// src/blocks/SectionTestimonials/Component.tsx
import React from 'react'
import type { SectionTestimonialsBlock } from '@/payload-types'
import { SectionTitle } from '@/components/sections/SectionTitle'
import { TestimonialsSection } from '@/components/sections/TestimonialsSection'
import { parseTitle } from '@/utilities/parseTitle'
import { TestimonialsCarousel } from './TestimonialsCarousel.client'
import { StarRating } from './StarRating'

export const SectionTestimonialsComponent: React.FC<SectionTestimonialsBlock> = ({
  eyebrow,
  title,
  description,
  ratingValue,
  reviewCount,
  testimonials,
}) => {
  return (
    <TestimonialsSection
      leading={
        <>
          <SectionTitle
            eyebrow={eyebrow}
            align="left"
            description={description ?? undefined}
          >
            {parseTitle(title)}
          </SectionTitle>
          <StarRating ratingValue={ratingValue} reviewCount={reviewCount} />
        </>
      }
    >
      <TestimonialsCarousel
        items={(testimonials ?? []).map((t) => ({
          id: t.id,
          quote: t.quote,
          author: t.author,
          role: t.role,
          avatarVariant: t.avatarVariant as 'blue' | 'orange',
          surface: t.surface as 'paper' | 'card',
        }))}
      />
    </TestimonialsSection>
  )
}
```

- [ ] **Criar index.ts**

```ts
// src/blocks/SectionTestimonials/index.ts
export { SectionTestimonialsComponent } from './Component'
export { StarRating } from './StarRating'
```

- [ ] **Verificar build**

```bash
cd /home/julio-jara/Projetos/novoGrito/grito-web && pnpm build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/blocks/SectionTestimonials/ && git commit -m "refactor(SectionTestimonials): extract StarRating component"
```

---

## Task 7: Quebrar `ContactSection` — extrair `ContactForm` e `ContactChannels`

**Files:**
- Create: `src/blocks/ContactSection/ContactForm.tsx`
- Create: `src/blocks/ContactSection/ContactChannels.tsx`
- Create: `src/blocks/ContactSection/index.ts`
- Modify: `src/blocks/ContactSection/Component.tsx`

- [ ] **Criar ContactForm.tsx** — contém primitivos de input, FormField, Button, e toda lógica de submit

```tsx
// src/blocks/ContactSection/ContactForm.tsx
'use client'

import React, { useState, useId, Children, cloneElement, isValidElement } from 'react'
import { ArrowRightIcon, CheckIcon } from '@/icons'

// ── Primitivos de input ────────────────────────────────────────────────────────

const inputBaseClasses = [
  'block w-full bg-transparent',
  'border-0 border-b-2 border-ink-soft',
  'pt-2 pb-2 px-0',
  'font-body text-base text-ink',
  'transition-colors duration-150 motion-reduce:transition-none',
  'placeholder:text-mute',
  'focus:outline-none focus:border-blue',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  'aria-[invalid=true]:border-orange',
].join(' ')

function Input({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={[inputBaseClasses, className].filter(Boolean).join(' ')} {...props} />
}

function Textarea({ className = '', rows = 4, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={rows} className={[inputBaseClasses, 'resize-y', className].filter(Boolean).join(' ')} {...props} />
}

function FormField({
  label,
  hint,
  error,
  children,
  className = '',
}: {
  label?: string
  hint?: string
  error?: string
  children: React.ReactNode
  className?: string
}) {
  const generatedId = useId()
  const child = Children.count(children) === 1 && isValidElement(children) ? children : null
  const inputId = (child?.props as { id?: string })?.id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined
  const hintId = hint ? `${inputId}-hint` : undefined
  const describedBy =
    [(child?.props as Record<string, string>)?.['aria-describedby'], hintId, errorId]
      .filter(Boolean)
      .join(' ') || undefined

  const enhancedChild = child
    ? cloneElement(child as React.ReactElement<Record<string, unknown>>, {
        id: inputId,
        'aria-invalid': error ? true : (child.props as Record<string, unknown>)['aria-invalid'],
        'aria-describedby': describedBy,
      })
    : children

  return (
    <div className={['flex flex-col', className].filter(Boolean).join(' ')}>
      {label && (
        <label htmlFor={inputId} className="font-body font-bold text-xs uppercase tracking-[0.14em] text-ink mb-2">
          {label}
        </label>
      )}
      {enhancedChild}
      {hint && !error && (
        <p id={hintId} className="mt-2 text-xs text-mute">{hint}</p>
      )}
      {error && (
        <p id={errorId} className="mt-2 text-xs text-orange" role="alert">{error}</p>
      )}
    </div>
  )
}

function SubmitButton({ loading }: { loading: boolean }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={[
        'inline-flex items-center justify-center gap-2',
        'rounded-full font-display font-medium px-6 py-3 text-base',
        'transition-opacity duration-150 cursor-pointer motion-reduce:transition-none',
        'hover:opacity-90',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        'bg-orange text-white',
      ].join(' ')}
    >
      {loading ? 'Enviando…' : 'Enviar mensagem'}
      <ArrowRightIcon />
    </button>
  )
}

// ── Estado de sucesso ──────────────────────────────────────────────────────────

function SuccessState({
  title,
  message,
  onReset,
}: {
  title: string
  message: string
  onReset: () => void
}) {
  return (
    <div className="py-10">
      <div
        aria-hidden="true"
        className="inline-flex h-14 w-14 rounded-full bg-success/15 text-success items-center justify-center mb-5"
      >
        <CheckIcon />
      </div>
      <h3 className="m-0 text-blue text-[26px] font-bold">{title}</h3>
      <p className="mt-2.5 text-ink-soft max-w-sm">{message}</p>
      <button
        type="button"
        onClick={onReset}
        className={[
          'mt-6 inline-flex items-center justify-center gap-2',
          'rounded-full font-display font-medium px-6 py-3 text-base',
          'transition-opacity duration-150 cursor-pointer motion-reduce:transition-none',
          'hover:opacity-90',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
          'bg-transparent text-ink-soft border-[1.5px] border-line hover:border-blue hover:text-blue',
        ].join(' ')}
      >
        Enviar outra
      </button>
    </div>
  )
}

// ── Componente principal ───────────────────────────────────────────────────────

const emptyForm = { name: '', email: '', message: '' }

interface ContactFormProps {
  successTitle: string
  successMessage: string
}

export function ContactForm({ successTitle, successMessage }: ContactFormProps) {
  const [form, setForm] = useState(emptyForm)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
    } finally {
      setLoading(false)
      setSent(true)
    }
  }

  const handleReset = () => {
    setSent(false)
    setForm(emptyForm)
  }

  if (sent) {
    return (
      <SuccessState
        title={successTitle}
        message={successMessage}
        onReset={handleReset}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-7" noValidate>
      <FormField label="Nome">
        <Input
          name="name"
          placeholder="Seu nome"
          value={form.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />
      </FormField>

      <FormField label="E-mail">
        <Input
          name="email"
          type="email"
          placeholder="seu@email.com"
          value={form.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />
      </FormField>

      <FormField label="Mensagem">
        <Textarea
          name="message"
          rows={4}
          placeholder="Conta um pouco do projeto, do prazo, do que precisa…"
          value={form.message}
          onChange={handleChange}
          required
        />
      </FormField>

      <div className="mt-2 flex flex-wrap items-center justify-between gap-3.5">
        <p className="m-0 text-[13px] text-ink-soft">
          Seus dados são usados apenas para retorno.
        </p>
        <SubmitButton loading={loading} />
      </div>
    </form>
  )
}
```

- [ ] **Criar ContactChannels.tsx**

```tsx
// src/blocks/ContactSection/ContactChannels.tsx
import React from 'react'
import { ICON_MAP, EmailIcon } from '@/icons'
import type { ContactSectionBlock } from '@/payload-types'

type Channel = NonNullable<ContactSectionBlock['channels']>[number]

const valueLinkClasses =
  'block font-display font-medium text-base text-ink no-underline leading-snug rounded-sm transition-colors duration-150 motion-reduce:transition-none hover:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper'

function IconBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center justify-center shrink-0 h-10 w-10 rounded-xl bg-blue/10 text-blue">
      {children}
    </span>
  )
}

function ChannelRow({ iconKey, label, value, hint, href }: {
  iconKey: string
  label: string
  value: string
  hint?: string | null
  href?: string | null
}) {
  const IconComponent = ICON_MAP[iconKey] ?? EmailIcon

  return (
    <div className="flex items-start gap-3.5">
      <IconBadge>
        <IconComponent size={18} />
      </IconBadge>
      <div className="min-w-0">
        <p className="m-0 mb-1 font-display font-bold text-[11px] uppercase tracking-[0.14em] text-ink">
          {label}
        </p>
        {href ? (
          <a href={href} className={valueLinkClasses}>{value}</a>
        ) : (
          <p className="m-0 font-display font-medium text-base text-ink leading-snug">{value}</p>
        )}
        {hint && <p className="m-0 mt-1 font-body text-[13px] text-mute">{hint}</p>}
      </div>
    </div>
  )
}

interface ContactChannelsProps {
  sidebarEyebrow: string
  channels: Channel[]
}

export function ContactChannels({ sidebarEyebrow, channels }: ContactChannelsProps) {
  return (
    <aside aria-label="Canais de contato">
      <p className="font-eyebrow m-0 mb-4">{sidebarEyebrow}</p>
      <div className="flex flex-col gap-6">
        {channels.map((channel) => (
          <ChannelRow
            key={channel.id ?? channel.label}
            iconKey={channel.icon}
            label={channel.label}
            value={channel.value}
            hint={channel.hint}
            href={channel.href}
          />
        ))}
      </div>
    </aside>
  )
}
```

- [ ] **Atualizar Component.tsx** — vira orquestrador simples

```tsx
// src/blocks/ContactSection/Component.tsx
'use client'

import React from 'react'
import type { ContactSectionBlock } from '@/payload-types'
import { ContactForm } from './ContactForm'
import { ContactChannels } from './ContactChannels'

export const ContactSectionComponent: React.FC<ContactSectionBlock> = ({
  eyebrow,
  heading,
  sidebarEyebrow = 'Fale direto',
  successTitle = 'Mensagem enviada',
  successMessage = 'Recebemos sua mensagem. Em até 3 dias úteis um de nós entra em contato.',
  channels = [],
}) => {
  return (
    <section className="px-6 md:px-12 py-24">
      {(eyebrow || heading) && (
        <div className="max-w-5xl mx-auto mb-14">
          {eyebrow && <p className="font-eyebrow m-0 mb-3">{eyebrow}</p>}
          {heading && <h2 className="m-0 text-h2 font-bold text-ink">{heading}</h2>}
        </div>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-20 items-start">
        <div>
          <ContactForm
            successTitle={successTitle}
            successMessage={successMessage}
          />
        </div>

        {channels.length > 0 && (
          <ContactChannels
            sidebarEyebrow={sidebarEyebrow}
            channels={channels}
          />
        )}
      </div>
    </section>
  )
}
```

- [ ] **Criar index.ts**

```ts
// src/blocks/ContactSection/index.ts
export { ContactSectionComponent } from './Component'
export { ContactForm } from './ContactForm'
export { ContactChannels } from './ContactChannels'
```

- [ ] **Verificar build**

```bash
cd /home/julio-jara/Projetos/novoGrito/grito-web && pnpm build 2>&1 | tail -20
```

- [ ] **Commit**

```bash
git add src/blocks/ContactSection/ && git commit -m "refactor(ContactSection): extract ContactForm and ContactChannels"
```

---

## Task 8: Quebrar `BlogListing` — extrair sub-componentes

**Files:**
- Create: `src/blocks/BlogListing/PostCard.tsx`
- Create: `src/blocks/BlogListing/FeaturedPost.tsx`
- Create: `src/blocks/BlogListing/SearchBar.tsx`
- Create: `src/blocks/BlogListing/TagFilter.tsx`
- Create: `src/blocks/BlogListing/Pagination.tsx`
- Create: `src/blocks/BlogListing/index.ts`
- Modify: `src/blocks/BlogListing/BlogListingClient.tsx`

- [ ] **Criar PostCard.tsx**

```tsx
// src/blocks/BlogListing/PostCard.tsx
import React from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'

export type PostItem = {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  date?: string | null
  categoryId?: string | null
  categoryLabel?: string | null
  image?: Media | null
}

const tagBase =
  'inline-flex items-center px-3 py-1.5 rounded-full font-body text-xs font-bold uppercase tracking-[0.04em]'

const accentBg = ['bg-blue/8', 'bg-orange/10']

function Tag({ children, index }: { children: React.ReactNode; index: number }) {
  const variant = index % 2 === 0 ? 'bg-blue/10 text-blue' : 'bg-orange/15 text-orange-700'
  return <span className={`${tagBase} ${variant}`}>{children}</span>
}

interface PostCardProps {
  post: PostItem
  index: number
}

export function PostCard({ post, index }: PostCardProps) {
  const image = post.image
  const imageUrl = image && typeof image === 'object' && image.url ? image.url : null

  return (
    <a
      href={`/posts/${post.slug}`}
      className="flex flex-col bg-white rounded-3xl border border-line overflow-hidden no-underline text-inherit transition-shadow duration-150 motion-reduce:transition-none hover:shadow-[0_8px_28px_rgba(8,7,23,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <div className={`h-[200px] flex items-center justify-center overflow-hidden ${accentBg[index % 2]}`}>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={image?.alt ?? post.title}
            width={600}
            height={200}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
            className="w-full h-full max-w-[120px] max-h-[120px] object-cover"
          />
        ) : (
          <span className="font-display font-black text-5xl opacity-10 select-none">
            {post.title.charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      <div className="px-6 pt-5 pb-6 flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          {post.categoryLabel && <Tag index={index}>{post.categoryLabel}</Tag>}
          {post.date && (
            <time dateTime={post.date} className="font-mono text-xs text-mute">
              {new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(post.date))}
            </time>
          )}
        </div>
        <h3 className="m-0 font-bold text-[22px] leading-tight">{post.title}</h3>
        {post.excerpt && <p className="m-0 text-sm text-mute line-clamp-3">{post.excerpt}</p>}
        <span className="mt-2 font-display font-medium text-sm text-blue inline-flex items-center gap-1.5">
          Ler o post <span className="text-base" aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  )
}
```

- [ ] **Criar FeaturedPost.tsx**

```tsx
// src/blocks/BlogListing/FeaturedPost.tsx
import React from 'react'
import Image from 'next/image'
import type { PostItem } from './PostCard'

interface FeaturedPostProps {
  post: PostItem
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const imageUrl =
    post.image && typeof post.image === 'object' && post.image.url ? post.image.url : null

  const formattedDate = post.date
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(post.date))
    : null

  return (
    <article className="max-w-7xl mx-auto mb-14">
      <a
        href={`/posts/${post.slug}`}
        className="grid grid-cols-1 md:grid-cols-[1.15fr_1fr] bg-white rounded-[28px] overflow-hidden border border-line no-underline text-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      >
        <div className="relative bg-blue text-white p-12 flex flex-col justify-center min-h-[380px]">
          <span className="font-body font-bold text-xs uppercase tracking-[0.12em] text-white/85">
            ⭐ Post em destaque
          </span>
          <h2 className="m-0 mt-4 font-display font-bold text-white text-[44px] leading-[1.1]">
            {post.title}
          </h2>
          {post.excerpt && <p className="mt-4 max-w-xl text-white/85">{post.excerpt}</p>}
          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-white/90">
            {post.categoryLabel && (
              <span className="inline-flex items-center px-3 py-1.5 rounded-full font-body text-xs font-bold uppercase tracking-[0.04em] bg-orange text-white">
                {post.categoryLabel}
              </span>
            )}
            {formattedDate && <time dateTime={post.date ?? undefined}>{formattedDate}</time>}
          </div>
          <div className="mt-7">
            <span className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-orange text-white font-display font-bold text-sm">
              Ler o post →
            </span>
          </div>
        </div>
        <div className="bg-paper-dim flex items-center justify-center p-10 relative">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.image?.alt ?? post.title}
              width={400}
              height={360}
              sizes="(max-width: 768px) 100vw, 40vw"
              className="w-full h-auto object-contain max-h-[320px]"
            />
          ) : (
            <span className="font-display font-black text-[8rem] text-blue/10 select-none">
              {post.title.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
      </a>
    </article>
  )
}
```

- [ ] **Criar SearchBar.tsx**

```tsx
// src/blocks/BlogListing/SearchBar.tsx
import React from 'react'
import { SearchIcon } from '@/icons'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative inline-flex">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-mute pointer-events-none">
        <SearchIcon />
      </span>
      <input
        type="search"
        aria-label="Buscar posts"
        placeholder="Buscar no blog…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-w-[280px] py-3 pl-11 pr-5 rounded-full border-[1.5px] border-line bg-white font-body text-sm text-ink placeholder:text-mute focus:outline-none focus:border-blue transition-colors duration-150 motion-reduce:transition-none"
      />
    </div>
  )
}
```

- [ ] **Criar TagFilter.tsx**

```tsx
// src/blocks/BlogListing/TagFilter.tsx
import React from 'react'

export type FilterOption = {
  label: string
  value: string
}

const pillBase = [
  'px-4 py-2 rounded-full font-display font-medium text-sm cursor-pointer',
  'border-[1.5px] transition-colors duration-150 motion-reduce:transition-none',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
].join(' ')

interface TagFilterProps {
  filters: FilterOption[]
  activeFilter: string
  onFilterChange: (value: string) => void
}

export function TagFilter({ filters, activeFilter, onFilterChange }: TagFilterProps) {
  return (
    <div
      className="pb-7 mb-7 border-b border-dashed border-line"
      role="group"
      aria-label="Filtrar por categoria"
    >
      <div className="flex flex-wrap gap-2.5 items-center">
        <span className="font-body font-bold text-xs uppercase tracking-[0.12em] text-mute mr-2">
          Filtrar por
        </span>
        {[{ label: 'Todos', value: 'all' }, ...filters].map((opt) => {
          const active = opt.value === activeFilter
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onFilterChange(opt.value)}
              aria-pressed={active}
              className={`${pillBase} ${
                active
                  ? 'bg-blue text-white border-transparent'
                  : 'bg-transparent text-blue border-blue hover:bg-blue/5'
              }`}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Criar Pagination.tsx**

```tsx
// src/blocks/BlogListing/Pagination.tsx
import React from 'react'

const btnBase = [
  'h-10 w-10 inline-flex items-center justify-center rounded-full',
  'font-display font-medium cursor-pointer',
  'transition-colors duration-150 motion-reduce:transition-none',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
].join(' ')

interface PaginationProps {
  page: number
  totalPages: number
  pageNumbers: (number | '…')[]
  onPageChange: (page: number) => void
}

export function Pagination({ page, totalPages, pageNumbers, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="Paginação" className="mt-12 flex justify-center items-center gap-2">
      <button
        type="button"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        aria-label="Página anterior"
        className={`${btnBase} bg-transparent text-blue border-[1.5px] border-line hover:border-blue disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        ←
      </button>

      {pageNumbers.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className={`${btnBase} text-mute`}>…</span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p as number)}
            aria-current={p === page ? 'page' : undefined}
            className={`${btnBase} ${
              p === page
                ? 'bg-blue text-white border-0'
                : 'bg-transparent text-blue border-[1.5px] border-line hover:border-blue'
            }`}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        aria-label="Próxima página"
        className={`${btnBase} bg-transparent text-blue border-[1.5px] border-line hover:border-blue disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        →
      </button>
    </nav>
  )
}
```

- [ ] **Atualizar BlogListingClient.tsx** — vira orquestrador usando hooks e sub-componentes

```tsx
// src/blocks/BlogListing/BlogListingClient.tsx
'use client'

import React, { useCallback } from 'react'
import { parseTitle } from '@/utilities/parseTitle'
import { useFilter } from '@/hooks/ui/useFilter'
import { usePagination } from '@/hooks/ui/usePagination'
import { useSearch } from '@/hooks/ui/useSearch'
import { PostCard, type PostItem } from './PostCard'
import { FeaturedPost } from './FeaturedPost'
import { SearchBar } from './SearchBar'
import { TagFilter, type FilterOption } from './TagFilter'
import { Pagination } from './Pagination'

export type { PostItem, FilterOption }
export type FeaturedPostItem = PostItem

export type BlogListingClientProps = {
  posts: PostItem[]
  filters: FilterOption[]
  featuredPost?: PostItem | null
  eyebrow?: string | null
  title?: string | null
  postsPerPage: number
  showSearch: boolean
  showFilters: boolean
}

export function BlogListingClient({
  posts,
  filters,
  featuredPost,
  eyebrow,
  title,
  postsPerPage,
  showSearch,
  showFilters,
}: BlogListingClientProps) {
  const getTag = useCallback((post: PostItem) => post.categoryId, [])
  const getSearchText = useCallback(
    (post: PostItem) => `${post.title} ${post.excerpt ?? ''}`,
    [],
  )

  const { query, setQuery, results: searchResults } = useSearch(posts, getSearchText)
  const { activeTag, setActiveTag, filtered } = useFilter(searchResults, getTag)
  const { page, setPage, currentItems, totalPages, pageNumbers } = usePagination(
    filtered,
    postsPerPage,
  )

  const handleFilterChange = (value: string) => {
    setActiveTag(value)
    setPage(1)
  }

  const handleSearch = (value: string) => {
    setQuery(value)
    setPage(1)
  }

  return (
    <section className="px-6 md:px-12 py-24">
      <div className="max-w-7xl mx-auto">
        {featuredPost && <FeaturedPost post={featuredPost} />}

        <div className="flex items-baseline justify-between gap-6 flex-wrap mb-6">
          <header className="flex flex-col gap-3 max-w-3xl">
            {eyebrow && <p className="font-eyebrow m-0">{eyebrow}</p>}
            <h2 className="m-0 text-blue">{parseTitle(title)}</h2>
          </header>
          {showSearch && (
            <SearchBar value={query} onChange={handleSearch} />
          )}
        </div>

        {showFilters && filters.length > 0 && (
          <TagFilter
            filters={filters}
            activeFilter={activeTag}
            onFilterChange={handleFilterChange}
          />
        )}

        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {currentItems.map((post, i) => (
              <PostCard key={post.id} post={post} index={(page - 1) * postsPerPage + i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-mute py-20">Nenhum post encontrado.</p>
        )}

        {totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            pageNumbers={pageNumbers}
            onPageChange={setPage}
          />
        )}
      </div>
    </section>
  )
}
```

- [ ] **Criar index.ts**

```ts
// src/blocks/BlogListing/index.ts
export { BlogListingComponent } from './Component'
export { BlogListingClient, type BlogListingClientProps, type PostItem, type FeaturedPostItem } from './BlogListingClient'
export { PostCard } from './PostCard'
export { FeaturedPost } from './FeaturedPost'
export { SearchBar } from './SearchBar'
export { TagFilter, type FilterOption } from './TagFilter'
export { Pagination } from './Pagination'
```

- [ ] **Verificar build**

```bash
cd /home/julio-jara/Projetos/novoGrito/grito-web && pnpm build 2>&1 | tail -30
```

- [ ] **Commit**

```bash
git add src/blocks/BlogListing/ && git commit -m "refactor(BlogListing): extract PostCard, FeaturedPost, SearchBar, TagFilter, Pagination"
```

---

## Task 9: Quebrar `PortfolioListing` — extrair sub-componentes

**Files:**
- Create: `src/blocks/PortfolioListing/PortfolioCard.tsx`
- Create: `src/blocks/PortfolioListing/ViewToggle.tsx`
- Create: `src/blocks/PortfolioListing/TagFilter.tsx`
- Create: `src/blocks/PortfolioListing/index.ts`
- Modify: `src/blocks/PortfolioListing/PortfolioListingClient.tsx`

- [ ] **Criar PortfolioCard.tsx** — contém Tag, PortfolioCardGrid e PortfolioCardList

```tsx
// src/blocks/PortfolioListing/PortfolioCard.tsx
import React from 'react'
import Image from 'next/image'
import type { Media } from '@/payload-types'
import { ArrowRightIcon } from '@/icons'
import { accentBgClasses, tagVariantClasses, type AccentVariant } from '@/constants'

export type PortfolioItem = {
  id: string
  title: string
  slug: string
  client?: string | null
  result?: string | null
  year?: string | null
  tagId?: string | null
  tagLabel?: string | null
  tagVariant?: AccentVariant
  accent?: AccentVariant
  image?: Media | null
}

function Tag({ children, variant = 'blue' }: { children: React.ReactNode; variant?: AccentVariant }) {
  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-full font-body text-xs font-bold uppercase tracking-[0.04em] ${tagVariantClasses[variant]}`}>
      {children}
    </span>
  )
}

export function PortfolioCardGrid({ item }: { item: PortfolioItem }) {
  const imageUrl = item.image?.url ?? null
  const bg = accentBgClasses[item.accent ?? 'blue']

  return (
    <a
      href={`/portfolio/${item.slug}`}
      className="flex flex-col rounded-3xl overflow-hidden bg-white border border-line no-underline text-inherit transition-shadow duration-150 motion-reduce:transition-none hover:shadow-[0_8px_28px_rgba(8,7,23,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <div className={`relative h-[200px] flex items-center justify-center overflow-hidden ${bg}`}>
        {item.year && (
          <span className="absolute top-4 right-4 font-body text-xs text-mute">{item.year}</span>
        )}
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.image?.alt ?? item.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <span className="font-display font-black text-5xl opacity-10 select-none">
            {item.title.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-6 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {item.tagLabel && <Tag variant={item.tagVariant ?? 'blue'}>{item.tagLabel}</Tag>}
        </div>
        {item.client && (
          <p className="m-0 font-display font-bold text-[11px] uppercase tracking-[0.14em] text-orange">
            {item.client}
          </p>
        )}
        <h3 className="m-0 font-display font-bold text-lg text-ink leading-snug">{item.title}</h3>
        {item.result && (
          <p className="m-0 font-body text-sm font-medium text-blue mt-auto">{item.result}</p>
        )}
      </div>
      <div className="px-6 pb-5 flex justify-end">
        <span className="inline-flex items-center gap-1.5 font-display text-sm font-medium text-mute">
          <ArrowRightIcon size={24} strokeWidth={2.5} />
        </span>
      </div>
    </a>
  )
}

export function PortfolioCardList({ item }: { item: PortfolioItem }) {
  const bg = accentBgClasses[item.accent ?? 'blue']

  return (
    <a
      href={`/portfolio/${item.slug}`}
      className="flex items-center gap-6 rounded-2xl bg-white border border-line p-5 no-underline text-inherit transition-shadow duration-150 motion-reduce:transition-none hover:shadow-[0_4px_16px_rgba(8,7,23,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
    >
      <div className={`shrink-0 w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden relative ${bg}`}>
        {item.image?.url ? (
          <Image
            src={item.image.url}
            alt={item.image.alt ?? item.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <span className="font-display font-black text-xl opacity-20 select-none">
            {item.title.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {item.tagLabel && <Tag variant={item.tagVariant ?? 'blue'}>{item.tagLabel}</Tag>}
          {item.year && <span className="font-body text-xs text-mute">{item.year}</span>}
        </div>
        {item.client && (
          <p className="m-0 font-display font-bold text-[11px] uppercase tracking-[0.14em] text-orange mb-0.5">
            {item.client}
          </p>
        )}
        <h3 className="m-0 font-display font-bold text-base text-ink leading-snug">{item.title}</h3>
        {item.result && (
          <p className="m-0 mt-1 font-body text-sm font-medium text-blue">{item.result}</p>
        )}
      </div>
      <ArrowRightIcon size={24} strokeWidth={2.5} />
    </a>
  )
}
```

- [ ] **Criar ViewToggle.tsx**

```tsx
// src/blocks/PortfolioListing/ViewToggle.tsx
import React from 'react'
import { GridIcon, ListIcon } from '@/icons'

type ViewMode = 'grid' | 'list'

interface ViewToggleProps {
  view: ViewMode
  onViewChange: (view: ViewMode) => void
}

const btnBase = [
  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full',
  'font-display font-medium text-sm cursor-pointer',
  'transition-colors duration-150 motion-reduce:transition-none',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-1',
].join(' ')

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div
      className="flex items-center gap-1 rounded-full border border-line p-1"
      role="group"
      aria-label="Modo de visualização"
    >
      <button
        type="button"
        onClick={() => onViewChange('grid')}
        aria-pressed={view === 'grid'}
        aria-label="Grade"
        className={`${btnBase} ${view === 'grid' ? 'bg-ink text-white' : 'text-mute hover:text-ink'}`}
      >
        <GridIcon /> Grade
      </button>
      <button
        type="button"
        onClick={() => onViewChange('list')}
        aria-pressed={view === 'list'}
        aria-label="Lista"
        className={`${btnBase} ${view === 'list' ? 'bg-ink text-white' : 'text-mute hover:text-ink'}`}
      >
        <ListIcon /> Lista
      </button>
    </div>
  )
}
```

- [ ] **Criar TagFilter.tsx**

```tsx
// src/blocks/PortfolioListing/TagFilter.tsx
import React from 'react'

export type FilterOption = {
  label: string
  value: string
}

const pillBase = [
  'px-4 py-2 rounded-full font-display font-medium text-sm cursor-pointer border-[1.5px]',
  'transition-colors duration-150 motion-reduce:transition-none',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
].join(' ')

interface TagFilterProps {
  filters: FilterOption[]
  activeFilter: string
  onFilterChange: (value: string) => void
}

export function TagFilter({ filters, activeFilter, onFilterChange }: TagFilterProps) {
  return (
    <div
      className="flex items-center gap-2 flex-wrap"
      role="group"
      aria-label="Filtrar por categoria"
    >
      {[{ label: 'Todos', value: 'all' }, ...filters].map((filter) => (
        <button
          key={filter.value}
          type="button"
          onClick={() => onFilterChange(filter.value)}
          aria-pressed={activeFilter === filter.value}
          className={`${pillBase} ${
            activeFilter === filter.value
              ? 'bg-orange text-white border-orange'
              : 'bg-transparent text-ink border-line hover:border-blue hover:text-blue'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Atualizar PortfolioListingClient.tsx** — vira orquestrador

```tsx
// src/blocks/PortfolioListing/PortfolioListingClient.tsx
'use client'

import React, { useCallback, useState } from 'react'
import { parseTitle } from '@/utilities/parseTitle'
import { useFilter } from '@/hooks/ui/useFilter'
import { PortfolioCardGrid, PortfolioCardList, type PortfolioItem } from './PortfolioCard'
import { ViewToggle } from './ViewToggle'
import { TagFilter, type FilterOption } from './TagFilter'

export type { PortfolioItem, FilterOption }

export type PortfolioListingClientProps = {
  portfolios: PortfolioItem[]
  filters: FilterOption[]
  eyebrow?: string | null
  title?: string | null
  showFilters: boolean
  showViewToggle: boolean
}

export const PortfolioListingClient: React.FC<PortfolioListingClientProps> = ({
  portfolios,
  filters,
  eyebrow,
  title,
  showFilters,
  showViewToggle,
}) => {
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const getTag = useCallback((item: PortfolioItem) => item.tagId, [])
  const { activeTag, setActiveTag, filtered } = useFilter(portfolios, getTag)

  return (
    <section className="px-6 md:px-12 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          {eyebrow && <p className="font-eyebrow m-0 mb-3">{eyebrow}</p>}
          {title && (
            <h2 className="m-0 font-display font-bold text-h2 text-ink leading-tight">
              {parseTitle(title)}
            </h2>
          )}
        </div>

        {(showFilters || showViewToggle) && (
          <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
            {showFilters && (
              <TagFilter
                filters={filters}
                activeFilter={activeTag}
                onFilterChange={setActiveTag}
              />
            )}
            {showViewToggle && (
              <ViewToggle view={view} onViewChange={setView} />
            )}
          </div>
        )}

        {view === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => (
              <PortfolioCardGrid key={item.id} item={item} />
            ))}
          </div>
        )}

        {view === 'list' && (
          <div className="flex flex-col gap-3">
            {filtered.map((item) => (
              <PortfolioCardList key={item.id} item={item} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-20 text-mute font-display">
            Nenhum projeto encontrado.
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Criar index.ts**

```ts
// src/blocks/PortfolioListing/index.ts
export { PortfolioListingComponent } from './Component'
export { PortfolioListingClient, type PortfolioListingClientProps, type PortfolioItem, type FilterOption } from './PortfolioListingClient'
export { PortfolioCardGrid, PortfolioCardList } from './PortfolioCard'
export { ViewToggle } from './ViewToggle'
export { TagFilter } from './TagFilter'
```

- [ ] **Verificar build**

```bash
cd /home/julio-jara/Projetos/novoGrito/grito-web && pnpm build 2>&1 | tail -30
```

- [ ] **Commit**

```bash
git add src/blocks/PortfolioListing/ && git commit -m "refactor(PortfolioListing): extract PortfolioCard, ViewToggle, TagFilter"
```

---

## Task 10: Adicionar `index.ts` nos blocos simples

**Files:**
- Create: `src/blocks/ChecklistGrid/index.ts`
- Create: `src/blocks/FaqBlock/index.ts`
- Create: `src/blocks/PullQuote/index.ts`
- Create: `src/blocks/SectionAbout/index.ts`
- Create: `src/blocks/SectionContact/index.ts`
- Create: `src/blocks/SectionCta/index.ts`
- Create: `src/blocks/SectionLogoCloud/index.ts`
- Create: `src/blocks/SectionProcess/index.ts`
- Create: `src/blocks/SectionProjects/index.ts`
- Create: `src/blocks/SectionStats/index.ts`

- [ ] **Verificar o nome do export de cada bloco simples** antes de criar os index.ts

```bash
grep "^export" \
  /home/julio-jara/Projetos/novoGrito/grito-web/src/blocks/ChecklistGrid/Component.tsx \
  /home/julio-jara/Projetos/novoGrito/grito-web/src/blocks/FaqBlock/Component.tsx \
  /home/julio-jara/Projetos/novoGrito/grito-web/src/blocks/PullQuote/Component.tsx \
  /home/julio-jara/Projetos/novoGrito/grito-web/src/blocks/SectionAbout/Component.tsx \
  /home/julio-jara/Projetos/novoGrito/grito-web/src/blocks/SectionContact/Component.tsx \
  /home/julio-jara/Projetos/novoGrito/grito-web/src/blocks/SectionCta/Component.tsx \
  /home/julio-jara/Projetos/novoGrito/grito-web/src/blocks/SectionLogoCloud/Component.tsx \
  /home/julio-jara/Projetos/novoGrito/grito-web/src/blocks/SectionProcess/Component.tsx \
  /home/julio-jara/Projetos/novoGrito/grito-web/src/blocks/SectionProjects/Component.tsx \
  /home/julio-jara/Projetos/novoGrito/grito-web/src/blocks/SectionStats/Component.tsx
```

- [ ] **Criar todos os index.ts baseado nos nomes confirmados acima**

Template para cada bloco (substituir `XxxComponent` pelo nome real):

```ts
// src/blocks/XxxBlock/index.ts
export { XxxComponent } from './Component'
```

FaqBlock tem dois arquivos — incluir ambos:

```ts
// src/blocks/FaqBlock/index.ts
export { FaqBlockComponent } from './Component'
export { FaqBlockClient } from './Component.client'
```

- [ ] **Verificar build final**

```bash
cd /home/julio-jara/Projetos/novoGrito/grito-web && pnpm build 2>&1 | tail -30
```

Esperado: build completo sem erros TypeScript.

- [ ] **Commit final**

```bash
git add src/blocks/ && git commit -m "feat: add barrel index.ts to all remaining block folders"
```

---

## Verificação final

- [ ] **Confirmar que todos os blocos têm index.ts**

```bash
find /home/julio-jara/Projetos/novoGrito/grito-web/src/blocks -maxdepth 2 -name "index.ts" | sort
```

Esperado: um `index.ts` para cada pasta de bloco (ChecklistGrid, FaqBlock, etc.) e um `index.ts` em BlogListing, PortfolioListing, ContactSection, SectionServices, SectionTestimonials.

- [ ] **Confirmar que nenhum arquivo de bloco ultrapassa 150 linhas**

```bash
find /home/julio-jara/Projetos/novoGrito/grito-web/src/blocks -name "*.tsx" | while read f; do
  lines=$(wc -l < "$f")
  [ "$lines" -gt 150 ] && echo "$lines $f"
done
```

Arquivos que ainda ultrapassarem 150 linhas merecem revisão manual.

- [ ] **Confirmar icons/ e constants/ acessíveis via alias @/**

```bash
grep -r "from '@/icons'" /home/julio-jara/Projetos/novoGrito/grito-web/src --include="*.tsx" --include="*.ts" | wc -l
```

Esperado: pelo menos 5 arquivos importando de `@/icons`.

- [ ] **Build limpo final**

```bash
cd /home/julio-jara/Projetos/novoGrito/grito-web && pnpm build
```

Esperado: sem erros. ✓
