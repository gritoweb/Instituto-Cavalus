import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { Button } from '../../components/ui/Button'
import { Container } from '../../components/ui/Container'
import { Icon } from '../../components/ui/Icon'
import { ShareButtons } from './ShareButtons'

export type CourseDetailProps = {
  course?: number | string | Record<string, any> | null
}

const initialsFrom = (name?: string) => {
  const words = (name ?? '').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return ''
  return (words[0][0] + (words.length > 1 ? words[words.length - 1][0] : '')).toUpperCase()
}

const checkCircle = (
  <span className="mt-0.5 grid h-[22px] w-[22px] flex-shrink-0 place-items-center rounded-full bg-brand-tint text-brand-dark">
    <Icon name="check" size={13} strokeWidth={3} />
  </span>
)

export async function CourseDetailBlock({ course }: CourseDetailProps) {
  let c: any = course
  if (!c || typeof c !== 'object') {
    if (c == null) return null
    const payload = await getPayload({ config: await config })
    c = await payload.findByID({ collection: 'courses', id: c as number, depth: 1 })
  }
  if (!c) return null

  const cats: any[] = Array.isArray(c.categories) ? c.categories.filter((x: any) => typeof x === 'object') : []
  const featured = c.featuredImage && typeof c.featuredImage === 'object' ? c.featuredImage : null
  const instructors: any[] = Array.isArray(c.instructors)
    ? c.instructors.filter((x: any) => x && typeof x === 'object')
    : []
  const bonus = c.bonus ?? {}
  const quote = c.quote ?? {}

  return (
    <>
      {/* Breadcrumb */}
      <nav className="border-b border-brand-green/[0.08] bg-brand-tint-soft py-3.5" aria-label="Você está em">
        <Container>
          <ol className="m-0 flex flex-wrap items-center gap-1.5 p-0 text-[13px] font-medium text-ink-500">
            <li><a href="/" className="font-medium text-ink-700 hover:text-brand-dark">Home</a></li>
            <li className="select-none text-ink-300" aria-hidden>/</li>
            <li><a href="/cursos" className="font-medium text-ink-700 hover:text-brand-dark">Cursos</a></li>
            <li className="select-none text-ink-300" aria-hidden>/</li>
            <li aria-current="page" className="font-semibold text-ink-900">{c.title}</li>
          </ol>
        </Container>
      </nav>

      <section className="bg-white pb-24 pt-12 lg:pb-[120px] lg:pt-16">
        <Container>
          <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_360px] lg:gap-14 xl:grid-cols-[1fr_380px] xl:gap-[72px]">
            {/* Main */}
            <main>
              <header>
                {cats.length ? (
                  <div className="mb-5 flex flex-wrap gap-1.5">
                    {cats.map((cat) => (
                      <span
                        key={cat.id}
                        className="inline-flex items-center rounded-[var(--radius-pill)] bg-brand-tint px-2.5 py-[3px] text-[10px] font-bold uppercase leading-[1.6] tracking-[0.08em] text-brand-dark"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                ) : null}
                <h1 className="mb-5 max-w-[24ch] text-[clamp(32px,4.4vw,48px)] font-bold leading-[1.1] tracking-[-0.025em]">
                  {c.title}
                </h1>
                {c.lede ? (
                  <p className="m-0 mb-9 max-w-[62ch] text-[clamp(16px,1.6vw,19px)] leading-[1.55] text-ink-700">
                    {c.lede}
                  </p>
                ) : null}
              </header>

              {featured?.url ? (
                <figure className="relative mb-10 aspect-[16/9] overflow-hidden rounded-[var(--radius-lg)] [background:linear-gradient(135deg,#314a2a,#1a2f1d)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={featured.url} alt={featured.alt || ''} className="h-full w-full object-cover" />
                  {c.featuredCaption ? (
                    <figcaption className="absolute bottom-4 left-4 rounded-[var(--radius-pill)] bg-ink-900/65 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-[6px]">
                      {c.featuredCaption}
                    </figcaption>
                  ) : null}
                </figure>
              ) : null}

              <article className="max-w-[68ch] text-[17px] leading-[1.75] text-ink-700 [&_a]:font-medium [&_a]:text-brand-green [&_h2]:mb-1 [&_h2]:mt-12 [&_h2]:text-ink-900 [&_h3]:mb-1 [&_h3]:mt-9 [&_h3]:text-ink-900 [&_p]:m-0 [&_strong]:font-semibold [&_strong]:text-ink-900 [&>*+*]:mt-6">
                {c.body ? <RichText data={c.body} /> : null}

                {c.whatYouLearn?.length ? (
                  <>
                    <h2>O que você vai aprender</h2>
                    <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
                      {c.whatYouLearn.map((item: any, i: number) => (
                        <li key={i} className="flex gap-3 text-base leading-[1.55] text-ink-700">
                          {checkCircle}
                          <span>
                            {item.strong ? <strong className="font-semibold text-ink-900">{item.strong} </strong> : null}
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {c.forWho?.length ? (
                  <>
                    <h2>Para quem é</h2>
                    <ol className="m-0 flex list-none flex-col gap-[18px] p-0">
                      {c.forWho.map((item: any, i: number) => (
                        <li key={i} className="flex items-start gap-3.5 text-base leading-[1.55] text-ink-700">
                          <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full bg-brand-tint font-display text-[13px] font-bold tabular-nums text-brand-dark">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span>
                            {item.strong ? <strong className="font-semibold text-ink-900">{item.strong} </strong> : null}
                            {item.text}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </>
                ) : null}

                {c.modules?.length ? (
                  <>
                    <h2>Conteúdo programático</h2>
                    <ul className="m-0 list-none border-t border-ink-300/25 p-0">
                      {c.modules.map((m: any, i: number) => (
                        <li key={i} className="flex items-start gap-4 border-b border-ink-300/25 py-[18px]">
                          <span className="w-8 flex-shrink-0 font-display text-sm font-bold tabular-nums text-brand-green">
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <div className="min-w-0 flex-1">
                            <h4 className="m-0 mb-1 font-display text-base font-semibold text-ink-900">{m.title}</h4>
                            {m.description ? <p className="m-0 text-sm leading-[1.5] text-ink-500">{m.description}</p> : null}
                          </div>
                          {m.duration ? (
                            <span className="flex-shrink-0 text-[13px] font-semibold tabular-nums text-ink-500">{m.duration}</span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}

                {bonus?.title || bonus?.text ? (
                  <div className="flex items-start gap-[18px] rounded-[var(--radius-md)] border-l-[3px] border-brand-green bg-brand-tint-soft py-6 pl-7 pr-6">
                    <div className="grid h-11 w-11 flex-shrink-0 place-items-center rounded-full bg-brand-green text-white">
                      <Icon name="zap" size={20} strokeWidth={2} />
                    </div>
                    <div>
                      {bonus.title ? (
                        <h3 className="m-0 mb-2 font-display text-base font-bold tracking-[-0.01em] text-ink-900">{bonus.title}</h3>
                      ) : null}
                      {bonus.text ? <p className="m-0 text-[15px] leading-[1.55] text-ink-700">{bonus.text}</p> : null}
                    </div>
                  </div>
                ) : null}

                {quote?.text ? (
                  <blockquote className="my-12 border-l-[3px] border-brand-green py-2 pl-7 font-display text-[22px] font-medium italic leading-[1.4] tracking-[-0.01em] text-ink-900">
                    <p className="m-0 mb-3">{quote.text}</p>
                    {quote.cite ? (
                      <cite className="mt-3.5 block font-body text-[13px] font-semibold uppercase not-italic tracking-[0.06em] text-ink-500 before:content-['—_']">
                        {quote.cite}
                      </cite>
                    ) : null}
                  </blockquote>
                ) : null}

                {instructors.length > 0 ? (
                  <>
                    <h2>{instructors.length > 1 ? 'Sobre os instrutores' : 'Sobre o instrutor'}</h2>
                    {instructors.map((instructor: any) => (
                      <div key={instructor.id ?? instructor.name} className="mt-12 flex items-start gap-5 rounded-[var(--radius-lg)] border border-ink-300/30 bg-surface-100 p-7">
                        <div className="grid h-16 w-16 flex-shrink-0 place-items-center rounded-full bg-brand-green font-display text-2xl font-bold tracking-[-0.02em] text-white">
                          {initialsFrom(instructor.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-dark">Instrutor</div>
                          <h3 className="!mt-0 mb-1 font-display text-[18px] font-bold tracking-[-0.01em] text-ink-900">{instructor.name}</h3>
                          {instructor.role ? <p className="m-0 mb-2.5 text-sm font-medium text-ink-500">{instructor.role}</p> : null}
                          {instructor.bio ? <p className="m-0 text-sm leading-[1.55] text-ink-700">{instructor.bio}</p> : null}
                        </div>
                      </div>
                    ))}
                  </>
                ) : null}
              </article>
            </main>

            {/* Sidebar */}
            <aside className="relative lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-[var(--radius-lg)] border border-ink-300/25 bg-white shadow-[0_24px_56px_rgba(33,37,41,.14),0_4px_12px_rgba(33,37,41,.04)]">
                <div className="border-b border-ink-300/20 px-7 pb-6 pt-7">
                  {c.priceOld ? (
                    <div className="mb-1 text-[13px] font-medium tabular-nums text-ink-500 line-through">De {c.priceOld}</div>
                  ) : null}
                  <div className="font-display text-[38px] font-bold leading-none tracking-[-0.025em] tabular-nums text-brand-green">
                    {c.priceNow}
                  </div>
                  {c.priceInstallment ? (
                    <div className="mt-2 text-[13px] font-medium tabular-nums text-ink-700">
                      ou <strong className="font-semibold text-ink-900">{c.priceInstallment}</strong> sem juros
                    </div>
                  ) : null}
                </div>

                {c.details?.length ? (
                  <div className="flex flex-col gap-3.5 px-7 py-5">
                    {c.details.map((d: any, i: number) => (
                      <div key={i} className="flex items-start gap-3 text-sm leading-[1.45] text-ink-700">
                        <span className="mt-px grid h-[22px] w-[22px] flex-shrink-0 place-items-center rounded-full bg-brand-tint text-brand-dark">
                          <Icon name="check" size={12} strokeWidth={3} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <strong className="mb-px block text-sm font-semibold text-ink-900">{d.title}</strong>
                          {d.sub ? <span className="text-[13px] text-ink-500">{d.sub}</span> : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="px-7 pb-6">
                  <Button href={c.ctaUrl || '#'} variant="primary" className="w-full !rounded-[var(--radius-md)] !px-6 !py-[18px] !text-base" target="_blank" rel="noopener">
                    {c.ctaLabel || 'Fazer matrícula'}
                    <Icon name="arrow-right" size={18} strokeWidth={2.5} />
                  </Button>
                  <div className="mt-3.5 flex items-center justify-center gap-1.5 text-xs font-medium text-ink-500">
                    <Icon name="lock" size={13} strokeWidth={2} className="text-brand-green" />
                    Pagamento 100% seguro
                  </div>
                </div>

                <div className="border-t border-ink-300/20 bg-surface-100 px-7 pb-7 pt-5">
                  <div className="mb-3.5 text-center text-[11px] font-bold uppercase tracking-[0.1em] text-ink-500">
                    Compartilhe este curso
                  </div>
                  <ShareButtons title={c.title} />
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>
    </>
  )
}
