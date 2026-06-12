import React from 'react'

import { Facebook, Instagram, Youtube } from './BrandIcons'

export type SocialPlatform = 'instagram' | 'youtube' | 'facebook'
export type SocialLink = {
  platform: SocialPlatform
  href: string
  label?: string | null
}

const brand = {
  instagram: { Cmp: Instagram, label: 'Instagram do Instituto Cavalus' },
  youtube: { Cmp: Youtube, label: 'YouTube do Instituto Cavalus' },
  facebook: { Cmp: Facebook, label: 'Facebook do Instituto Cavalus' },
}

/** Lista de redes sociais do footer. */
export function SocialLinks({ links }: { links: SocialLink[] }) {
  if (!links?.length) return null
  return (
    <div className="mt-5 flex gap-2">
      {links.map((link) => {
        const { Cmp, label } = brand[link.platform]
        return (
          <a
            key={link.platform}
            href={link.href}
            aria-label={link.label || label}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/[0.06] transition-all duration-200 ease-in-out hover:bg-brand-green hover:text-white"
          >
            <Cmp size={18} />
          </a>
        )
      })}
    </div>
  )
}
