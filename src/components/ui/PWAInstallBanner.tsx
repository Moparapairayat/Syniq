import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePWA } from '@/hooks/usePWA'

export function PWAInstallBanner() {
  const {
    showBanner,
    hasNativePrompt,
    isOffline,
    isIOS,
    installPWA,
    dismissBanner,
  } = usePWA()

  const [showInstructionsModal, setShowInstructionsModal] = useState(false)

  const handleInstallClick = async () => {
    const res = await installPWA()
    if (res === 'ios_instructions' || res === 'browser_instructions') {
      setShowInstructionsModal(true)
    }
  }

  if (!showBanner && !isOffline) return null

  return (
    <>
      <AnimatePresence>
        <div key="pwa-banner-container" className="w-full flex flex-col items-center gap-2 z-30">
          {/* Offline Indicator Badge */}
          {isOffline && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mx-auto flex w-full max-w-[420px] items-center justify-center gap-2 rounded-xl border border-[#b91c1c]/50 bg-gradient-to-r from-[#991b1b]/90 to-[#7f1d1d]/90 px-3 py-1.5 text-center shadow-md backdrop-blur-md"
            >
              <span className="text-xs">⚡</span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#fca5a5]">
                YOU ARE OFFLINE — OFFLINE PLAY ACTIVE
              </span>
            </motion.div>
          )}

          {/* PWA Install Banner */}
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative mx-auto my-1 flex w-full max-w-[440px] items-center justify-between gap-2.5 rounded-2xl border-2 border-[#fcd34d]/70 bg-gradient-to-r from-[#78350f]/95 via-[#54290c]/95 to-[#3a1d0d]/95 p-3 text-[#fff3cd] shadow-[inset_0_1.5px_0_rgba(255,226,162,0.6),0_6px_16px_rgba(0,0,0,0.6)] backdrop-blur-md"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#fcd34d]/50 bg-[#2a1307] text-xl shadow-inner">
                  📲
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs font-black uppercase tracking-wider text-[#fcd34d]">
                    INSTALL SYNIQ APP
                  </span>
                  <span className="text-[10px] font-bold text-[#ffe49e]/80 truncate">
                    {hasNativePrompt ? 'Tap install for instant home screen access' : 'Play offline anytime on your home screen'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="shrink-0 rounded-xl border border-[#78350f] bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] px-3.5 py-2 text-xs font-black uppercase tracking-wider text-[#3a1d0d] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_3px_0_#78350f] transition-transform active:scale-95 cursor-pointer outline-none hover:brightness-110"
                >
                  INSTALL
                </button>
                <button
                  type="button"
                  onClick={dismissBanner}
                  aria-label="Close banner"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#78431e] bg-[#2a1307] text-[10px] font-bold text-[#ffe49e]/60 transition-colors hover:bg-[#3a1d0d] hover:text-[#fff3cd] cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      {/* Mobile Browser Instructions Modal */}
      <AnimatePresence>
        {showInstructionsModal && (
          <div key="instructions-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-[380px] rounded-3xl border-2 border-[#fcd34d] bg-gradient-to-b from-[#945525] via-[#753f1a] to-[#3a1d0d] p-5 text-center text-[#fff3cd] shadow-2xl"
            >
              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#78431e] bg-[#2a1307] text-xs font-bold text-[#ffe49e]"
              >
                ✕
              </button>

              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#fcd34d]/50 bg-[#2a1307] text-3xl shadow-inner">
                📲
              </div>

              <h3 className="text-base font-black uppercase tracking-wider text-[#fcd34d]">
                How to Install Syniq
              </h3>

              {isIOS ? (
                <div className="my-4 flex flex-col gap-2.5 rounded-2xl border border-[#78431e] bg-[#2a1307]/80 p-3.5 text-left text-xs font-bold text-[#ffe49e]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fcd34d] text-[11px] font-black text-[#3a1d0d]">1</span>
                    <span>Tap the <strong>Share button (⎋)</strong> in Safari</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fcd34d] text-[11px] font-black text-[#3a1d0d]">2</span>
                    <span>Scroll down and select <strong>Add to Home Screen (➕)</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fcd34d] text-[11px] font-black text-[#3a1d0d]">3</span>
                    <span>Tap <strong>Add</strong> at top right to launch as App</span>
                  </div>
                </div>
              ) : (
                <div className="my-4 flex flex-col gap-2.5 rounded-2xl border border-[#78431e] bg-[#2a1307]/80 p-3.5 text-left text-xs font-bold text-[#ffe49e]">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fcd34d] text-[11px] font-black text-[#3a1d0d]">1</span>
                    <span>Tap browser menu <strong>(⋮ or ⋯)</strong> top right</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fcd34d] text-[11px] font-black text-[#3a1d0d]">2</span>
                    <span>Select <strong>Install App</strong> or <strong>Add to Home screen</strong></span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="w-full rounded-xl border border-[#78350f] bg-gradient-to-b from-[#fcd34d] to-[#d97706] py-2.5 text-xs font-black uppercase tracking-wider text-[#3a1d0d] shadow-md cursor-pointer"
              >
                GOT IT!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
