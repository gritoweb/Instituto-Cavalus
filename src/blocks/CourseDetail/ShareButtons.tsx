'use client'

import React, { useState } from 'react'

const net: Record<string, string> = {
  wa: 'hover:!bg-[#25D366] hover:!text-white hover:!border-[#25D366]',
  fb: 'hover:!bg-[#1877F2] hover:!text-white hover:!border-[#1877F2]',
  x: 'hover:!bg-black hover:!text-white hover:!border-black',
  tg: 'hover:!bg-[#26A5E4] hover:!text-white hover:!border-[#26A5E4]',
  li: 'hover:!bg-[#0A66C2] hover:!text-white hover:!border-[#0A66C2]',
  copy: 'hover:!bg-brand-green hover:!text-white hover:!border-brand-green',
}

const btn =
  'relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink-300/30 bg-white text-ink-700 transition-all duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-md'

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const text = encodeURIComponent(`${title} — Instituto Cavalus`)

  return (
    <div className="flex flex-wrap justify-center gap-2">
      <a className={`${btn} ${net.wa}`} href={`https://wa.me/?text=${text}`} target="_blank" rel="noopener" aria-label="WhatsApp">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2zm0 18.3a8.3 8.3 0 0 1-4.2-1.2l-.3-.2-3.1.8.8-3-.2-.3a8.3 8.3 0 1 1 7 3.9z" /></svg>
      </a>
      <a className={`${btn} ${net.fb}`} href="https://www.facebook.com/sharer/sharer.php?u=" target="_blank" rel="noopener" aria-label="Facebook">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.8 3.7-3.8 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12z" /></svg>
      </a>
      <a className={`${btn} ${net.x}`} href={`https://twitter.com/intent/tweet?text=${text}`} target="_blank" rel="noopener" aria-label="X (Twitter)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
      </a>
      <a className={`${btn} ${net.tg}`} href={`https://t.me/share/url?url=&text=${text}`} target="_blank" rel="noopener" aria-label="Telegram">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 4.2 18.8 19.7c-.2 1-.9 1.3-1.8.8L12 17l-2.4 2.3c-.3.3-.5.5-1 .5l.4-5 9-8.1c.4-.3-.1-.5-.6-.2L6.3 12.5l-4.8-1.5c-1-.3-1-1 .2-1.5L20.5 2.6c.9-.3 1.7.2 1.5 1.6z" /></svg>
      </a>
      <a className={`${btn} ${net.li}`} href="https://www.linkedin.com/sharing/share-offsite/?url=" target="_blank" rel="noopener" aria-label="LinkedIn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.04c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" /></svg>
      </a>
      <button
        type="button"
        aria-label={copied ? 'Copiado!' : 'Copiar link'}
        className={`${btn} ${net.copy} ${copied ? '!bg-brand-green !text-white !border-brand-green' : ''}`}
        onClick={() => {
          navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          })
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
      </button>
    </div>
  )
}
