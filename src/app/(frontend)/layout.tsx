import React from 'react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Header } from '@/globals/Header/Component'
import { Footer } from '@/globals/Footer/Component'
import './base.css'

export const metadata = {
  description: 'Instituto Cavalus — vitrine de cursos e artigos do universo equestre brasileiro.',
  title: 'Instituto Cavalus',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const payload = await getPayload({ config: await config })
  const [header, footer] = await Promise.all([
    payload.findGlobal({ slug: 'header' }),
    payload.findGlobal({ slug: 'footer' }),
  ])

  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,500;1,9..40,600&family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Header navItems={header?.navItems} cta={header?.cta} />
        <main>{children}</main>
        <Footer
          description={footer?.description}
          navTitle={footer?.navTitle}
          navLinks={footer?.navLinks}
          contact={footer?.contact}
          socials={footer?.socials as never}
          copyright={footer?.copyright}
          note={footer?.note}
        />
      </body>
    </html>
  )
}
