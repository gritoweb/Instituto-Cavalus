# Spec — CPT Instrutor + relação com Cursos

Data: 2026-06-12

## Objetivo

Transformar os dados do instrutor, hoje um campo fixo (`group`) dentro de cada
Curso, em uma collection própria (CPT `Instrutor`), e ligar os cursos a essa
collection via relação `hasMany`. Visualmente, o front continua igual: o mesmo
card de instrutor é renderizado — agora um por instrutor relacionado.

## Decisões

- **Cardinalidade:** um curso pode ter **vários** instrutores (`hasMany: true`).
- **Iniciais do avatar:** geradas automaticamente a partir do nome (ex.: "João
  Carvalho" → "JC"). Não há campo de iniciais no admin.
- **Dados existentes:** recriados via `seed.ts` (sem migração de dados). O group
  `instructor` é removido do schema.

## Mudanças

### 1. Nova collection `Instructors` — `src/collections/Instructors.ts`
- `slug: 'instructors'`, labels Instrutor/Instrutores.
- `admin.useAsTitle: 'name'`, `admin.group: 'Cursos'`, `defaultColumns: ['name', 'role']`.
- `access.read: () => true`.
- Campos:
  - `name` — text, label "Nome", required.
  - `role` — text, label "Cargo".
  - `bio` — textarea, label "Bio".
- Registrada em `src/payload.config.ts` (array `collections`).

### 2. `src/collections/Courses.ts`
- Remover o group `instructor` (initials/name/role/bio).
- Na aba "Página do curso", adicionar:
  - `instructors` — relationship, `relationTo: 'instructors'`, `hasMany: true`,
    label "Instrutores".

### 3. Front — `src/blocks/CourseDetail/Component.tsx`
- Trocar o bloco único do instrutor por um `.map` sobre `c.instructors`
  (filtrando apenas objetos populados), renderizando o **mesmo markup do card**.
- Helper `initialsFrom(name)` para o avatar (primeira letra das duas primeiras
  palavras, em maiúsculas).
- Título da seção: "Sobre o instrutor" (1) / "Sobre os instrutores" (>1).
- A query da página já usa `depth: 1`, então a relação popula sem alteração.

### 4. Seed — `src/seed.ts`
- Criar o(s) doc(s) de instrutor antes dos cursos e referenciar os IDs no array
  `instructors` do curso. O "João Carvalho" atual vira um registro de Instrutor.

### 5. Migration / tipos
- `pnpm generate:types` para atualizar `payload-types.ts`.
- `pnpm payload migrate:create` para gerar a migration (tabela `instructors`,
  remoção das colunas do group, tabela de relação `hasMany`).
- `pnpm payload migrate` para aplicar local.

## Fora de escopo
- Foto/upload do instrutor, slug próprio, página pública de instrutor. Os campos
  iniciais são apenas nome/cargo/bio; novos campos podem vir depois.
