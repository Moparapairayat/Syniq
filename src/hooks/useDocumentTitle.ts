import { useEffect } from 'react'

const applicationName = 'Syniq'

export function useDocumentTitle(pageTitle: string) {
  useEffect(() => {
    document.title = `${pageTitle} | ${applicationName}`
  }, [pageTitle])
}
