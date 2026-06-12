import React from 'react'

import { cn } from '../../utilities/cn'

type ContainerProps = {
  as?: React.ElementType
  className?: string
  children: React.ReactNode
}

/** Container central: max-width 1200px com padding lateral responsivo (16/24/32px). */
export function Container({ as: Tag = 'div', className, children }: ContainerProps) {
  return (
    <Tag className={cn('mx-auto w-full max-w-[var(--container-site)] px-4 md:px-6 lg:px-8', className)}>
      {children}
    </Tag>
  )
}
