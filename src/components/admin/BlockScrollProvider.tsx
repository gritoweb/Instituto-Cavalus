'use client'

import { useEffect, type ReactNode } from 'react'

/**
 * No admin: ao clicar no header de um bloco, envia ao iframe do Live Preview a
 * mensagem SCROLL_TO_BLOCK para rolar até o bloco correspondente no preview.
 */
export default function BlockScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Payload renders an absolutely-positioned transparent button (.collapsible__toggle)
      // that covers the entire row header, so clicks always land there — not on the inner
      // header elements. Walk up to the toggle-wrap, then find the block number within it.
      const toggleWrap = target.closest('.collapsible__toggle-wrap')
      if (!toggleWrap) return

      // Only act on block rows, not other collapsibles (e.g. header nav items)
      if (!toggleWrap.closest('.blocks-field')) return

      const numberEl = toggleWrap.querySelector('.blocks-field__block-number')
      if (!numberEl) return

      const blockIndex = parseInt(numberEl.textContent ?? '1', 10) - 1
      if (isNaN(blockIndex) || blockIndex < 0) return

      const iframe = document.querySelector('iframe') as HTMLIFrameElement | null
      iframe?.contentWindow?.postMessage({ type: 'SCROLL_TO_BLOCK', blockIndex }, '*')
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return <>{children}</>
}
