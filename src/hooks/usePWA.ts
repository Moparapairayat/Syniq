import { useState, useEffect, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isOffline, setIsOffline] = useState(
    typeof navigator !== 'undefined' ? !navigator.onLine : false,
  )
  const [isStandalone, setIsStandalone] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if app is running as a standalone PWA
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true
      setIsStandalone(Boolean(isStandaloneMode))
    }

    // Check operating system & device environment
    const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
    const iosDevice = /iphone|ipad|ipod/i.test(ua)
    const mobileDevice = /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua)

    setIsIOS(iosDevice)
    setIsMobile(mobileDevice)
    checkStandalone()

    // Check if user dismissed banner during current browser session
    const dismissedSession = sessionStorage.getItem('syniq-pwa-dismissed') === 'true'
    if (dismissedSession) {
      setIsDismissed(true)
    }

    // Listen for beforeinstallprompt event (Chrome, Edge, Android)
    const handleInstallPrompt = (e: Event) => {
      e.preventDefault()
      const promptEvent = e as BeforeInstallPromptEvent
      setDeferredPrompt(promptEvent)
    }

    // Listen for online / offline network status
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('beforeinstallprompt', handleInstallPrompt)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const installPWA = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt()
        const choice = await deferredPrompt.userChoice
        if (choice.outcome === 'accepted') {
          setDeferredPrompt(null)
          return 'installed'
        }
      } catch (error) {
        console.warn('PWA installation prompt error:', error)
      }
    }
    if (isIOS) return 'ios_instructions'
    return 'browser_instructions'
  }, [deferredPrompt, isIOS])

  const dismissBanner = useCallback(() => {
    setIsDismissed(true)
    sessionStorage.setItem('syniq-pwa-dismissed', 'true')
  }, [])

  // App is installable if it's NOT already running in standalone mode AND hasn't been dismissed
  const showBanner = !isStandalone && !isDismissed

  return {
    showBanner,
    hasNativePrompt: Boolean(deferredPrompt),
    isOffline,
    isStandalone,
    isIOS,
    isMobile,
    installPWA,
    dismissBanner,
  }
}
