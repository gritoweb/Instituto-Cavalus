# Title Max-Width Control — Design

**Data:** 2026-05-20
**Escopo:** Adicionar controle de largura máxima nos títulos dos 13 section blocks do site, aplicado apenas em desktop (≥ 1024px).

---

## 1. Motivação

Editores de conteúdo no Payload precisam restringir a largura visual dos títulos das seções para melhorar ritmo tipográfico e densidade em telas grandes — onde linhas muito longas prejudicam legibilidade. A solução deve ser:

- **Centralizada** (uma fonte da verdade para os presets)
- **Consistente** (mesmo conjunto de valores em todos os blocks)
- **Conservadora** (não afeta mobile/tablet)

---

## 2. Escopo

### Inclui

13 blocks com campo `title`:

- `BlogListing`
- `ChecklistGrid`
- `FaqBlock`
- `LatestPortfolios`
- `LatestPosts`
- `PortfolioListing`
- `SectionAbout`
- `SectionCta`
- `SectionLogoCloud`
- `SectionProcess`
- `SectionProjects`
- `SectionServices`
- `SectionTestimonials`

### Não inclui (YAGNI)

- Hero (`src/heros/config.ts`)
- Globais (Header/Footer)
- Coleções (Pages, Posts, Portfolios, Tags, PortfolioTags)
- Controles para tablet ou mobile
- Outros controles visuais (cor, alinhamento, peso)

---

## 3. Arquitetura

Três peças isoladas, cada uma com uma responsabilidade:

### 3.1 Field helper

**Arquivo:** `src/fields/titleMaxWidth.ts`

Exporta um `Field` config do Payload, do tipo `select`, com 5 opções:

| Valor   | Label                  | Significado            |
|---------|------------------------|------------------------|
| `none`  | Padrão (sem limite)    | Sem `max-width`        |
| `sm`    | Pequeno (~480px)       | `lg:max-w-[480px]`     |
| `md`    | Médio (~640px)         | `lg:max-w-[640px]`     |
| `lg`    | Grande (~800px)        | `lg:max-w-[800px]`     |
| `xl`    | Extra (~960px)         | `lg:max-w-[960px]`     |

- `required: true`
- `defaultValue: 'none'`
- `admin.description`: "Limita a largura do título apenas em telas ≥ 1024px (desktop)."

Não é `localized`: é uma propriedade visual, igual entre PT e EN.

### 3.2 Utility de classe

**Arquivo:** `src/utilities/titleMaxWidthClass.ts`

```ts
export type TitleMaxWidth = 'none' | 'sm' | 'md' | 'lg' | 'xl'

const map: Record<TitleMaxWidth, string> = {
  none: '',
  sm:   'lg:max-w-[480px]',
  md:   'lg:max-w-[640px]',
  lg:   'lg:max-w-[800px]',
  xl:   'lg:max-w-[960px]',
}

export const titleMaxWidthClass = (v?: TitleMaxWidth | null): string =>
  map[v ?? 'none']
```

Função pura, sem dependência. Aceita `undefined`/`null` para resiliência em dados antigos.

### 3.3 Integração nos blocks

#### Config (`src/blocks/*/config.ts`)

Cada um dos 13 configs importa o helper e o insere **imediatamente após** o campo `title`:

```ts
import { titleMaxWidth } from '../../fields/titleMaxWidth'

fields: [
  eyebrow,
  title,
  titleMaxWidth,  // inserido aqui
  description,
  // ...
]
```

#### Component (`src/blocks/*/Component.tsx`)

Cada componente de render lê `titleMaxWidth` das props e aplica a classe ao elemento que envolve o `<h2>` (ou ao próprio `<h2>`):

```tsx
import { titleMaxWidthClass } from '@/utilities/titleMaxWidthClass'

<h2 className={cn('text-4xl ...', titleMaxWidthClass(titleMaxWidth))}>
  {title}
</h2>
```

O alinhamento (esquerda/centro) permanece definido pelo container existente do bloco; a classe só impõe a largura limite.

---

## 4. Schema / Migration

Cada uma das 13 tabelas de bloco ganha uma coluna nova:

```sql
ALTER TABLE pages_blocks_<nome> ADD COLUMN title_max_width TEXT NOT NULL DEFAULT 'none';
```

Mesma adição replicada nas tabelas de versions (`_pages_v_blocks_<nome>`) que o Payload mantém para drafts/versions.

**Geração da migration:**

```bash
pnpm payload migrate:create
```

**Aplicação local:**

```bash
pnpm payload migrate
```

**Aplicação no D1 remoto:**

```bash
NODE_ENV=production PAYLOAD_SECRET=ignore pnpm payload migrate
```

Conteúdo existente recebe o default `'none'` automaticamente, ou seja, **nenhum block visual quebra** após a migration: o comportamento permanece igual ao atual (sem `max-width`).

---

## 5. Tipos

Após o ajuste de configs:

```bash
pnpm generate:types
```

`src/payload-types.ts` passa a expor `titleMaxWidth?: 'none' | 'sm' | 'md' | 'lg' | 'xl'` em cada uma das 13 interfaces de bloco. A utility usa o mesmo tipo, garantindo consistência estática.

---

## 6. Plano de teste

- Subir `pnpm dev` e abrir o admin
- Em **cada um dos 13 blocks**, verificar que:
  - O campo "Largura máxima do título (desktop)" aparece logo abaixo de "Título"
  - Default é "Padrão (sem limite)"
  - Mudando para `sm`/`md`/`lg`/`xl` e salvando, o front renderiza o título com a classe correta em desktop (≥ 1024px)
  - Em viewport mobile/tablet, o título permanece full-width
- Verificar que o `pnpm generate:types` roda sem erros
- Verificar que `pnpm payload migrate` aplica a coluna localmente sem afetar dados existentes

---

## 7. Riscos e mitigação

| Risco                                                | Mitigação                                                                                                                    |
|------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------|
| Algum block tem container que já limita a largura    | Verificar bloco por bloco no momento da integração; a classe extra é aditiva (não conflita com `max-w-*` base sem `lg:`)     |
| Tailwind purga `lg:max-w-[NNNpx]` arbitrárias        | As classes são **strings literais estáticas** no `map`, então o Tailwind detecta na varredura                                |
| Editor escolhe `xl` em block que já tem container mais estreito | `max-w-[960px]` em um container `max-w-3xl` (768px) simplesmente não tem efeito; é seguro                          |
| Migration cresce muito (26 colunas em 26 tabelas)    | Aceitável; é equivalente em magnitude às migrations recentes de i18n                                                         |

---

## 8. Não-objetivos explícitos

- **Não adicionar** mobile/tablet breakpoints
- **Não criar** group/tab "Aparência" — campo solto após `title` é o padrão atual
- **Não tornar** o campo `localized` — propriedade visual, não traduzida
- **Não estender** para hero/coleções neste ciclo
- **Não permitir** valor numérico custom — apenas os 5 presets, para manter consistência visual entre seções

---

## 9. Checklist de implementação (resumo)

1. Criar `src/fields/titleMaxWidth.ts`
2. Criar `src/utilities/titleMaxWidthClass.ts`
3. Importar e inserir o field nos 13 configs em `src/blocks/*/config.ts`
4. Aplicar a classe nos 13 `src/blocks/*/Component.tsx`
5. `pnpm payload migrate:create`
6. `pnpm payload migrate` (local)
7. `pnpm generate:types`
8. Teste manual no admin + front
9. Deploy: migrate remoto + `wrangler deploy`
