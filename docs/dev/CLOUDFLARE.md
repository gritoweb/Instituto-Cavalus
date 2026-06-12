# Ecossistema Cloudflare — grito-web

Guia completo de como este projeto funciona na infraestrutura Cloudflare. Leia antes de mexer em deploy, banco de dados ou storage.

---

## Visão geral

```
┌─────────────────────────────────────────────────────────────────┐
│                      Cloudflare Edge                            │
│                                                                 │
│  ┌─────────────────────────────────────────────────────┐        │
│  │  Worker: grito-web                                  │        │
│  │  (Next.js 15 + Payload CMS via @opennextjs/cloudflare)│      │
│  │                                                     │        │
│  │   ┌──────────┐   ┌──────────┐   ┌──────────────┐   │        │
│  │   │  Assets  │   │   D1     │   │     R2       │   │        │
│  │   │ (static) │   │(SQLite)  │   │  (arquivos)  │   │        │
│  │   └──────────┘   └──────────┘   └──────────────┘   │        │
│  └─────────────────────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────────────┘
```

**Stack:**
- **Runtime:** Cloudflare Workers (Node.js via `nodejs_compat`)
- **Framework:** Next.js 15 (App Router) compilado via `@opennextjs/cloudflare`
- **CMS:** Payload CMS 3
- **Banco:** D1 (SQLite gerenciado pela Cloudflare) via `@payloadcms/db-d1-sqlite`
- **Storage:** R2 (object storage) via `@payloadcms/storage-r2`

**Recursos provisionados:**

| Recurso | Nome na Cloudflare | Binding no código | ID |
|---|---|---|---|
| Worker | `grito-web` | — | — |
| Banco D1 | `cloudflare-payload-db` | `D1` | `2441aab2-5f9e-4240-ab99-e1d5bcde15e8` |
| Storage R2 | `cloudflare-payload-r2` | `R2` | — |

**URL de produção:** https://grito-web.suporte-fd8.workers.dev  
**Conta Cloudflare:** suporte@gritoweb.com.br

---

## Como o Worker funciona

O Cloudflare Worker não é um servidor Node.js tradicional. É uma função edge que:

1. **Recebe requisições HTTP** (páginas, API routes, admin do Payload)
2. **Executa Next.js** compilado em um único bundle (`worker.js`) via OpenNext
3. **Acessa D1 e R2** como bindings nativos — sem conexão TCP/IP, é uma chamada interna da plataforma
4. **Serve estáticos** diretamente do binding `ASSETS` (JS, CSS, imagens do build)

O arquivo `wrangler.jsonc` declara todos esses bindings:

```jsonc
{
  "name": "grito-web",
  "main": ".open-next/worker.js",        // bundle do Next.js compilado
  "assets": { "directory": ".open-next/assets" },  // arquivos estáticos
  "d1_databases": [{ "binding": "D1", "database_name": "cloudflare-payload-db" }],
  "r2_buckets": [{ "binding": "R2", "bucket_name": "cloudflare-payload-r2" }],
  "compatibility_flags": ["nodejs_compat"]
}
```

---

## D1 — Banco de dados SQLite

### O que é

D1 é o SQLite gerenciado da Cloudflare. O banco é um arquivo SQLite que vive nos servidores da Cloudflare e é acessado pelo Worker via binding, sem abrir porta de rede.

### Como o Payload usa o D1

O adaptador `@payloadcms/db-d1-sqlite` recebe o binding `D1` e usa a interface SQL do D1 via Drizzle ORM. Todas as collections e globals do Payload viram tabelas SQLite.

Em `src/payload.config.ts`:
```ts
db: sqliteD1Adapter({
  binding: cloudflare.env.D1,  // binding declarado no wrangler.jsonc
})
```

### Banco local vs remoto

| Contexto | Banco usado | Onde fica |
|---|---|---|
| `pnpm dev` | SQLite local | `.wrangler/state/v3/d1/` (na sua máquina) |
| `pnpm payload migrate` (sem NODE_ENV=production) | SQLite local | mesmo diretório |
| `NODE_ENV=production pnpm payload migrate` | D1 remoto | Cloudflare |
| Worker em produção | D1 remoto | Cloudflare |

O banco local é criado automaticamente pela primeira vez que você roda `pnpm payload migrate`. Se você apagar `.wrangler/`, o banco some e precisa ser recriado via `pnpm payload migrate`.

### Como funciona o contexto Cloudflare localmente

O Payload precisa de uma instância do banco para inicializar. Em desenvolvimento, o `wrangler` cria um **proxy local** que simula os bindings (D1, R2) usando arquivos locais:

```ts
// src/payload.config.ts
const cloudflare =
  isCLI || !isProduction || isBuild
    ? await getCloudflareContextFromWrangler()   // proxy local via wrangler
    : await getCloudflareContext({ async: true }) // bindings reais em produção
```

| Condição | O que usa |
|---|---|
| `pnpm dev` | `getCloudflareContextFromWrangler()` — proxy local, banco em `.wrangler/` |
| `pnpm payload migrate` | `getCloudflareContextFromWrangler()` com `remoteBindings: true` — conecta no D1 remoto via wrangler |
| `pnpm run deploy:app` (build) | `getCloudflareContextFromWrangler()` com `remoteBindings: false` — proxy local, sem network |
| Worker rodando em produção | `getCloudflareContext({ async: true })` — bindings nativos do runtime |

---

## R2 — Storage de arquivos

### O que é

R2 é o object storage da Cloudflare (equivalente ao S3 da AWS). Todo arquivo enviado pelo admin do Payload (imagens, PDFs, etc.) vai para o R2.

### Como o Payload usa o R2

O plugin `@payloadcms/storage-r2` intercepta uploads da collection `media` e os envia ao R2 em vez do sistema de arquivos local:

```ts
plugins: [
  r2Storage({
    bucket: cloudflare.env.R2,       // binding R2 do wrangler.jsonc
    collections: { media: true },    // aplica apenas na collection media
  }),
]
```

### R2 local vs remoto

| Contexto | Storage usado |
|---|---|
| `pnpm dev` | R2 local simulado via wrangler (pasta `.wrangler/state/v3/r2/`) |
| Worker em produção | R2 remoto na Cloudflare |

Em desenvolvimento, os uploads ficam em `.wrangler/` e não aparecem no R2 da Cloudflare. Quando você faz deploy e envia uma imagem em produção, ela vai para o bucket `cloudflare-payload-r2`.

---

## Migrations — Schema do banco

### Por que existe esse sistema

O Payload usa o sistema de migrations do Drizzle para versionar o schema do banco. Cada vez que você adiciona uma collection, campo ou global, o Payload detecta a diferença entre o schema atual e o banco e gera um arquivo SQL de migration.

### Fluxo de uma mudança de schema

```
1. Alterar o schema no código
   (nova collection, novo campo, etc.)
        ↓
2. Gerar a migration local
   pnpm payload migrate:create
   → cria src/migrations/YYYYMMDD_HHMMSS.ts
        ↓
3. Testar localmente
   pnpm payload migrate
   → aplica no SQLite local (.wrangler/)
        ↓
4. Aplicar no D1 remoto (antes do deploy)
   NODE_ENV=production PAYLOAD_SECRET=ignore pnpm payload migrate
   → aplica no banco de produção via wrangler + remoteBindings
        ↓
5. Fazer o deploy do Worker
   pnpm run deploy:app  (ou wrangler deploy)
```

### Onde ficam as migrations

```
src/migrations/
├── index.ts                  ← exporta todas as migrations (gerado automaticamente)
├── 20250929_111647.ts        ← schema inicial
├── 20260513_202507.ts
├── 20260514_120202.ts
├── ...
└── 20260514_204641.ts        ← hero fields (mais recente)
```

Cada arquivo tem duas funções: `up()` (aplicar) e `down()` (reverter).

### Armadilha: modo "push" vs migrations

Quando você roda `pnpm dev`, o Payload pode aplicar mudanças de schema diretamente no banco local **sem criar migration** (modo push). Isso é conveniente mas cria um problema: quando você gera a migration depois, ela inclui todas as mudanças do push — e se o banco já tem as tabelas, a migration falha com "table already exists".

**Solução quando isso acontece:**
```bash
rm -rf .wrangler
pnpm payload migrate
```
Isso limpa o banco local e reconstrói do zero via migrations. Os dados locais são perdidos (mas é apenas ambiente de dev).

---

## Build — Como o Next.js vira um Worker

O `@opennextjs/cloudflare` compila o Next.js para o formato do Cloudflare Workers:

```
pnpm run deploy:app
  └── opennextjs-cloudflare build   → gera .open-next/
  └── opennextjs-cloudflare deploy  → faz upload via wrangler
```

O que o build gera:
```
.open-next/
├── worker.js          ← bundle único com o Next.js inteiro
├── assets/            ← arquivos estáticos (JS, CSS, fontes, imagens do build)
└── ...
```

### Por que o build usa o banco local

Durante o `next build`, o Next.js tenta renderizar páginas estáticas e rotas de API. Isso inicializa o `payload.config.ts`, que precisa de um banco. Não podemos acessar o D1 remoto durante o build (o Worker ainda não está rodando).

Por isso usamos `remoteBindings: false` durante o build:
```ts
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'
// ...
remoteBindings: isProduction && !isBuild  // false durante o build
```

O banco local em `.wrangler/` serve apenas para o build inicializar — nenhum dado de desenvolvimento vai para produção.

### Por que usamos `force-dynamic`

Páginas com `export const dynamic = 'force-dynamic'` nunca são pré-renderizadas durante o build. Todas as páginas que consultam o banco (como `[slug]/page.tsx`) precisam disso para evitar que o Next.js tente gerar HTML estático em build time:

```ts
// src/app/(frontend)/[slug]/page.tsx
export const dynamic = 'force-dynamic'
```

---

## Deploy — Passo a passo

### Autenticação

```bash
wrangler login
wrangler whoami   # deve mostrar suporte@gritoweb.com.br
```

### Deploy completo (com mudança de schema)

```bash
# 1. Gerar a migration
pnpm payload migrate:create

# 2. Aplicar no D1 remoto
NODE_ENV=production PAYLOAD_SECRET=ignore pnpm payload migrate

# 3. Build + deploy do Worker
pnpm run deploy:app
```

Se `pnpm run deploy:app` travar com `ETIMEDOUT` na etapa de deploy (problema de conectividade com a API de preview da Cloudflare), o build já está gerado em `.open-next/`. Basta:
```bash
wrangler deploy
```

### Deploy rápido (só código, sem schema)

```bash
pnpm run deploy:app
# ou, se o build já existe:
wrangler deploy
```

### Ver logs em produção

```bash
# Logs em tempo real
wrangler tail --format pretty

# Só erros
wrangler tail --format json --status error
```

---

## Scripts disponíveis

| Script | O que faz |
|---|---|
| `pnpm dev` | Dev server local com banco SQLite local |
| `pnpm devsafe` | Limpa `.next` e `.open-next` antes de subir o dev |
| `pnpm payload migrate` | Aplica migrations no banco local |
| `pnpm payload migrate:create` | Gera nova migration baseada nas mudanças de schema |
| `NODE_ENV=production ... pnpm payload migrate` | Aplica migrations no D1 remoto |
| `pnpm generate:types` | Regenera tipos do Payload + tipos do Cloudflare |
| `pnpm run deploy:app` | Build + deploy completo do Worker |
| `pnpm preview` | Build local + preview no runtime do Worker (via `wrangler dev`) |
| `wrangler deploy` | Deploy do `.open-next/` já buildado |
| `wrangler tail` | Logs em tempo real do Worker em produção |

---

## Problemas comuns

### `no such table` — 500 após deploy

Migration não foi aplicada no D1 remoto. O banco de produção não tem a tabela que o código espera.

```bash
# Diagnosticar
wrangler tail --format json --status error

# Resolver
pnpm payload migrate:create  # se a migration ainda não existe
NODE_ENV=production PAYLOAD_SECRET=ignore pnpm payload migrate
```

### `table already exists` ao rodar migrations localmente

O banco local foi modificado em modo push (dev). Limpa e reconstrói:
```bash
rm -rf .wrangler
pnpm payload migrate
```

### `ETIMEDOUT` no deploy

A API de preview da Cloudflare não está acessível desta máquina (IPv6, firewall). O build já foi gerado. Use:
```bash
wrangler deploy
```

### Tipos do Cloudflare desatualizados

Após adicionar bindings novos no `wrangler.jsonc`:
```bash
pnpm generate:types
```
Isso atualiza `cloudflare-env.d.ts` com a interface `CloudflareEnv`.

### Admin abre mas dá 500 nas mutations

O `PAYLOAD_SECRET` não está configurado. Em produção, sete via `wrangler secret`:
```bash
wrangler secret put PAYLOAD_SECRET
```

---

## Variáveis de ambiente

| Variável | Onde configurar | Obrigatória | Descrição |
|---|---|---|---|
| `PAYLOAD_SECRET` | `.env` (local) / `wrangler secret` (prod) | Sim | Chave JWT do Payload |
| `PREVIEW_SECRET` | `.env` | Não | Senha para preview de rascunhos |
| `CLOUDFLARE_ENV` | shell | Não | Nome do environment do wrangler (staging, etc.) |
| `NODE_ENV` | automático | — | `production` ativa logs JSON e bindings remotos |
| `PAYLOAD_LOG_LEVEL` | `.env` | Não | `debug`, `info`, `warn`, `error` |

Secrets em produção são gerenciados pelo wrangler e não ficam no código:
```bash
wrangler secret put PAYLOAD_SECRET    # solicita o valor interativamente
wrangler secret list                  # lista os secrets configurados
```
