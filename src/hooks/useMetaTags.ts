import { useEffect } from 'react'

const BASE_URL = 'https://syniq.moparapairayat.dev'
const OG_IMAGE = `${BASE_URL}/og-image.png`

export interface MetaTagOptions {
  title: string
  description: string
  url?: string
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

export function useMetaTags({ title, description, url, image }: MetaTagOptions) {
  useEffect(() => {
    const fullTitle = `${title} | Syniq`
    const pageUrl = url ?? BASE_URL
    const pageImage = image ?? OG_IMAGE

    document.title = fullTitle

    setMeta('og:title', fullTitle)
    setMeta('og:description', description)
    setMeta('og:url', pageUrl)
    setMeta('og:image', pageImage)
    setMeta('og:image:secure_url', pageImage)
    setMeta('og:image:type', 'image/png')
    setMeta('og:type', 'website')

    setMeta('twitter:title', fullTitle, true)
    setMeta('twitter:description', description, true)
    setMeta('twitter:url', pageUrl, true)
    setMeta('twitter:image', pageImage, true)
    setMeta('twitter:image:src', pageImage, true)
    setMeta('twitter:card', 'summary_large_image', true)

    setMeta('description', description, true)
  }, [title, description, url, image])
}
