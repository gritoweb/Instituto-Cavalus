import React from 'react'

import { cn } from '../../utilities/cn'

type ButtonVariant = 'primary' | 'outline-white' | 'white' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-semibold leading-none border-0 whitespace-nowrap no-underline transition-all duration-200 ease-in-out focus-visible:outline-2 focus-visible:outline-brand-dark focus-visible:outline-offset-2'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-green text-white hover:bg-brand-dark hover:text-white hover:-translate-y-px',
  'outline-white':
    'bg-transparent text-white border-[1.5px] border-white/85 hover:bg-white hover:text-brand-green',
  white: 'bg-white text-brand-green hover:bg-brand-tint hover:text-brand-dark',
  ghost:
    'bg-transparent text-ink-900 border-[1.5px] border-ink-300/40 hover:bg-ink-900 hover:text-white hover:border-ink-900 hover:-translate-y-px',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'px-4 py-2.5 text-sm rounded-[var(--radius-md)]',
  md: 'px-6 py-3 text-sm rounded-[var(--radius-md)]',
  lg: 'px-8 py-4 text-base rounded-[var(--radius-pill)]',
}

type CommonProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  children: React.ReactNode
}

type ButtonAsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: undefined }

type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & { href: string }

export function Button(props: ButtonAsButton | ButtonAsLink) {
  const { variant = 'primary', size = 'md', className, children, ...rest } = props
  const classes = cn(base, variants[variant], sizes[size], className)

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a className={classes} {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {children}
      </a>
    )
  }

  return (
    <button className={classes} {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  )
}
