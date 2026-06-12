'use client'

import React, { useId } from 'react'

import { Icon } from './Icon'

type SearchInputProps = {
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onClear: () => void
  label?: string
}

/** Campo de busca em pill com ícone e botão de limpar (filterbar__search). */
export function SearchInput({
  value,
  placeholder,
  onChange,
  onClear,
  label = 'Buscar artigos',
}: SearchInputProps) {
  const id = useId()
  return (
    <div
      role="search"
      className="relative mb-4 inline-flex w-full max-w-[480px] items-center rounded-[var(--radius-pill)] border border-ink-300/40 bg-surface-0 pl-3.5 pr-1.5 transition-all duration-200 ease-in-out focus-within:border-brand-green focus-within:shadow-[0_0_0_3px_rgba(98,155,4,.12)]"
    >
      <Icon name="search" size={16} strokeWidth={2} className="shrink-0 text-ink-500" />
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        type="search"
        autoComplete="off"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 border-0 bg-transparent px-2 py-[9px] text-[13px] font-medium text-ink-900 outline-none placeholder:font-medium placeholder:text-ink-500 [&::-webkit-search-cancel-button]:appearance-none"
      />
      <button
        type="button"
        aria-label="Limpar busca"
        hidden={value === ''}
        onClick={onClear}
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-0 bg-surface-100 text-ink-700 transition-all duration-200 ease-in-out hover:bg-brand-tint hover:text-brand-dark"
      >
        <Icon name="x" size={15} strokeWidth={2.2} />
      </button>
    </div>
  )
}
