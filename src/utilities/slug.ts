import type { FieldHook } from 'payload'

/** Converte um texto em slug: minúsculas, sem acentos, hífens. */
export const slugify = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/**
 * Hook de campo `slug`: se o slug estiver vazio, gera a partir do campo `from`.
 * Sempre normaliza o valor existente.
 */
export const slugFrom =
  (from: string): FieldHook =>
  ({ value, data }) => {
    if (typeof value === 'string' && value.length > 0) return slugify(value)
    const source = data?.[from]
    if (typeof source === 'string' && source.length > 0) return slugify(source)
    return value
  }
