import React from 'react'

import { Brand } from '../../components/ui/Brand'
import { Container } from '../../components/ui/Container'
import { Icon } from '../../components/ui/Icon'
import { SocialLinks, type SocialLink } from '../../components/ui/SocialLinks'

export type FooterData = {
  description?: string | null
  navTitle?: string | null
  navLinks?: { label: string; href: string; id?: string | null }[] | null
  contact?: { email?: string | null; phone?: string | null; location?: string | null } | null
  socials?: SocialLink[] | null
  copyright?: string | null
  note?: string | null
}

export function Footer({
  description,
  navTitle,
  navLinks,
  contact,
  socials,
  copyright,
  note,
}: FooterData) {
  return (
    <footer id="contato" role="contentinfo" className="bg-ink-900 pb-6 pt-16 text-white/70">
      <Container>
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr_1fr] md:gap-16">
          {/* Coluna marca */}
          <div>
            <Brand href="/" onDark />
            {description ? (
              <p className="mt-4 max-w-[36ch] text-sm leading-[1.6]">{description}</p>
            ) : null}
            {socials?.length ? <SocialLinks links={socials} /> : null}
          </div>

          {/* Navegação */}
          <div>
            <h5 className="m-0 mb-5 font-body text-[13px] font-semibold uppercase tracking-[0.08em] text-white">
              {navTitle ?? 'Navegação'}
            </h5>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {navLinks?.map((link, i) => (
                <li key={link.id ?? i}>
                  <a href={link.href} className="text-sm text-white/70 transition-colors duration-200 hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h5 className="m-0 mb-5 font-body text-[13px] font-semibold uppercase tracking-[0.08em] text-white">
              Contato
            </h5>
            <div className="flex flex-col gap-3 text-sm">
              {contact?.email ? (
                <a
                  href={`mailto:${contact.email}`}
                  className="inline-flex items-center gap-2.5 text-white/70 transition-colors duration-200 hover:text-white"
                >
                  <Icon name="mail" size={16} strokeWidth={1.8} />
                  {contact.email}
                </a>
              ) : null}
              {contact?.phone ? (
                <span className="inline-flex items-center gap-2.5">
                  <Icon name="phone" size={16} strokeWidth={1.8} />
                  {contact.phone}
                </span>
              ) : null}
              {contact?.location ? (
                <span className="inline-flex items-center gap-2.5">
                  <Icon name="map-pin" size={16} strokeWidth={1.8} />
                  {contact.location}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.08] pt-6 text-[13px] text-white/50">
          <span>{copyright ?? '© 2026 Instituto Cavalus. Todos os direitos reservados.'}</span>
          <span>{note ?? 'Parte do Portal Cavalus'}</span>
        </div>
      </Container>
    </footer>
  )
}
