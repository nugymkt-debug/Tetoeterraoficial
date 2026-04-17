import { useEffect, useState, useCallback } from 'react'
import type { SiteContent } from '../types/content'
import { defaultContent } from '../data/defaultContent'

/**
 * Fonte de dados do site:
 *
 *   1. /content.json (servido em public/content.json) — FONTE PRINCIPAL.
 *      Este é o arquivo que você edita direto no GitHub. Qualquer alteração
 *      aqui aparece no ar no próximo deploy (Vercel/Netlify/Figma Make
 *      redeployam automático em push na branch main).
 *
 *   2. localStorage — PREVIEW local (só o painel /admin usa).
 *      Enquanto você está editando no /admin, as alterações ficam no seu
 *      browser e não afetam ninguém mais. Quando estiver satisfeita, exporta
 *      o JSON e cola no GitHub.
 *
 *   3. defaultContent — FALLBACK se tudo der errado (ex.: offline em dev).
 */

const STORAGE_KEY = 'tt_site_preview_v1'
const CONTENT_URL = '/content.json'

function merge(saved: Partial<SiteContent>): SiteContent {
  return {
    ...defaultContent,
    ...saved,
    brand:      { ...defaultContent.brand,      ...(saved.brand      || {}) },
    hero:       { ...defaultContent.hero,       ...(saved.hero       || {}) },
    about:      { ...defaultContent.about,      ...(saved.about      || {}) },
    investment: { ...defaultContent.investment, ...(saved.investment || {}) },
    contact:    { ...defaultContent.contact,    ...(saved.contact    || {}) },
    projects: saved.projects?.length ? saved.projects : defaultContent.projects,
    rentals:  saved.rentals?.length  ? saved.rentals  : defaultContent.rentals,
    sales:    saved.sales?.length    ? saved.sales    : defaultContent.sales,
  }
}

async function fetchPublicContent(): Promise<SiteContent | null> {
  try {
    const r = await fetch(CONTENT_URL, { cache: 'no-cache' })
    if (!r.ok) return null
    const json = (await r.json()) as Partial<SiteContent>
    return merge(json)
  } catch (err) {
    console.warn('[content] falha ao baixar /content.json', err)
    return null
  }
}

export function loadPreview(): SiteContent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? merge(JSON.parse(raw)) : null
  } catch {
    return null
  }
}

export function savePreview(content: SiteContent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content))
  window.dispatchEvent(new CustomEvent('tt:preview-updated'))
}

export function clearPreview() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('tt:preview-updated'))
}

export function hasPreview(): boolean {
  return !!loadPreview()
}

/**
 * Hook reativo. Prioridade:
 *   1) preview do admin (localStorage) se existir
 *   2) /content.json do repositório
 *   3) defaultContent (fallback)
 */
export function useSiteContent(): [SiteContent, (c: SiteContent) => void] {
  // começa com o preview local ou default pra evitar flash
  const [content, setContent] = useState<SiteContent>(() => loadPreview() || defaultContent)

  useEffect(() => {
    // se tem preview local, não sobrescreve com o JSON público
    if (loadPreview()) return
    let cancelled = false
    fetchPublicContent().then(fresh => {
      if (!cancelled && fresh) setContent(fresh)
    })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    const refresh = () => {
      const preview = loadPreview()
      if (preview) setContent(preview)
      else fetchPublicContent().then(c => c && setContent(c))
    }
    window.addEventListener('tt:preview-updated', refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener('tt:preview-updated', refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [])

  const update = useCallback((c: SiteContent) => {
    savePreview(c)
    setContent(c)
  }, [])

  return [content, update]
}
