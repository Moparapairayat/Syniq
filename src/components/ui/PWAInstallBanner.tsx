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
      {/* ── Floating Bottom PWA Popup Card ── */}
      <AnimatePresence>
        <div key="pwa-floating-popup" className="fixed bottom-4 left-4 right-4 z-50 max-w-[420px] mx-auto pointer-events-auto">
          {/* Offline Status Badge */}
          {isOffline && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-2 flex w-full items-center justify-center gap-2 rounded-xl border border-[#b91c1c]/60 bg-gradient-to-r from-[#991b1b]/95 to-[#7f1d1d]/95 px-3 py-1.5 text-center shadow-lg backdrop-blur-md"
            >
              <span className="text-xs">⚡</span>
              <span className="text-[11px] font-black uppercase tracking-wider text-[#fca5a5]">
                YOU ARE OFFLINE — OFFLINE PLAY ACTIVE
              </span>
            </motion.div>
          )}

          {/* Floating 3D Wood PWA Install Popup */}
          {showBanner && (
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 60, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="relative flex items-center justify-between gap-3 rounded-2xl border-2 border-[#fcd34d] bg-gradient-to-r from-[#945525]/95 via-[#753f1a]/95 to-[#54290c]/95 p-3.5 text-[#fff3cd] shadow-[inset_0_2px_0_rgba(255,226,162,0.6),inset_0_-3px_0_rgba(30,12,4,0.7),0_12px_32px_rgba(0,0,0,0.85)] backdrop-blur-md"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#fcd34d]/50 bg-[#2a1307] text-xl shadow-inner">
                  📲
                </div>
                <div className="flex flex-col text-left min-w-0">
                  <span className="text-xs font-black uppercase tracking-wider text-[#fcd34d]">
                    INSTALL SYNIQ APP
                  </span>
                  <span className="text-[10px] font-bold text-[#ffe49e]/80 truncate">
                    {hasNativePrompt ? 'Tap install for home screen access' : 'Play offline anytime on your home screen'}
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
                  aria-label="Close install popup"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[#78431e] bg-[#2a1307] text-[10px] font-bold text-[#ffe49e]/70 transition-colors hover:bg-[#3a1d0d] hover:text-[#fff3cd] cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </AnimatePresence>

      {/* ── Mobile Browser Step-By-Step Instructions Modal Popup ── */}
      <AnimatePresence>
        {showInstructionsModal && (
          <div key="instructions-modal" className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[380px] rounded-3xl border-2 border-[#fcd34d] bg-gradient-to-b from-[#945525] via-[#753f1a] to-[#3a1d0d] p-5 text-center text-[#fff3cd] shadow-[0_20px_50px_rgba(0,0,0,0.9)]"
            >
              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-[#78431e] bg-[#2a1307] text-xs font-bold text-[#ffe49e] hover:bg-[#4a2713]"
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
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fcd34d] text-[11px] font-black text-[#3a1d0d]">1</span>
                    <span>Tap the <strong>Share button (⎋)</strong> in Safari</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fcd34d] text-[11px] font-black text-[#3a1d0d]">2</span>
                    <span>Scroll down and select <strong>Add to Home Screen (➕)</strong></span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fcd34d] text-[11px] font-black text-[#3a1d0d]">3</span>
                    <span>Tap <strong>Add</strong> at top right to launch as App</span>
                  </div>
                </div>
              ) : (
                <div className="my-4 flex flex-col gap-2.5 rounded-2xl border border-[#78431e] bg-[#2a1307]/80 p-3.5 text-left text-xs font-bold text-[#ffe49e]">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fcd34d] text-[11px] font-black text-[#3a1d0d]">1</span>
                    <span>Tap browser menu <strong>(⋮ or ⋯)</strong> top right</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#fcd34d] text-[11px] font-black text-[#3a1d0d]">2</span>
                    <span>Select <strong>Install App</strong> or <strong>Add to Home screen</strong></span>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => setShowInstructionsModal(false)}
                className="w-full rounded-xl border border-[#78350f] bg-gradient-to-b from-[#fcd34d] to-[#d97706] py-2.5 text-xs font-black uppercase tracking-wider text-[#3a1d0d] shadow-md cursor-pointer hover:brightness-110"
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
