// Stub client-side para `resolveSignedURLKey` do @payloadcms/plugin-cloud-storage.
//
// O barrel `@payloadcms/plugin-cloud-storage/utilities` re-exporta tanto
// `getFileKey` (usado pelo R2ClientUploadHandler, client-safe) quanto
// `resolveSignedURLKey` (server-only, que importa `payload/exports/internal`
// e arrasta node:os, node:fs, undici, etc. para dentro do bundle do navegador).
//
// O webpack segue esse re-export ao montar o bundle client e quebra no scheme
// "node:". Como `resolveSignedURLKey` nunca é chamado no client, substituímos
// apenas esse módulo por este stub (via NormalModuleReplacementPlugin em
// next.config.ts), cortando toda a subárvore server-only.
export function resolveSignedURLKey(): never {
  throw new Error('resolveSignedURLKey is server-only and must not run in the browser')
}
