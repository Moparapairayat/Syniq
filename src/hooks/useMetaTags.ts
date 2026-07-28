import { useEffect } from 'react'

const BASE_URL = 'https://syniq.vercel.app'
const OG_IMAGE = `${BASE_URL}/og-image.png`

export interface MetaTagOptions {
  title: string
  description: string
  /** Absolute URL for this page (optional, defaults to base URL) */
  url?: string
  /** OG image override (optional) */
  image?: string
}

function setMeta(property: string, content: string, isName = false) {
  const attr = isName ? 'name' : 'property'
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

/**
 * Dynamically updates OG / Twitter meta tags for better per-page social link previews.
 * Call this hook at the top of each page component.
 */
export function useMetaTags({ title, description, url, image }: MetaTagOptions) {
  useEffect(() => {
    const fullTitle = `${title} | Syniq`
    const pageUrl = url ?? BASE_URL
    const pageImage = image ?? OG_IMAGE

    // Document title
    document.title = fullTitle

    // Open Graph
    setMeta('og:title', fullTitle)
    setMeta('og:description', description)
    setMeta('og:url', pageUrl)
    setMeta('og:image', pageImage)
    setMeta('og:type', 'website')

    // Twitter Card
    setMeta('twitter:title', fullTitle, true)
    setMeta('twitter:description', description, true)
    setMeta('twitter:url', pageUrl, true)
    setMeta('twitter:image', pageImage, true)
    setMeta('twitter:card', 'summary_large_image', true)

    // Standard meta
    setMeta('description', description, true)
  }, [title, description, url, image])
}
