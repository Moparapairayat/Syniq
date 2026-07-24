import { motion, AnimatePresence } from 'framer-motion'
import { usePWA } from '@/hooks/usePWA'

export function PWAInstallBanner() {
  const { isInstallable, isOffline, installPWA } = usePWA()

  if (!isInstallable && !isOffline) return null

  return (
    <AnimatePresence>
      <div className="w-full flex flex-col items-center gap-2">
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
        {isInstallable && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative mx-auto my-1 flex w-full max-w-[440px] items-center justify-between gap-3 rounded-2xl border-2 border-[#fcd34d]/70 bg-gradient-to-r from-[#78350f]/95 via-[#54290c]/95 to-[#3a1d0d]/95 p-3 text-[#fff3cd] shadow-[inset_0_1.5px_0_rgba(255,226,162,0.6),0_6px_16px_rgba(0,0,0,0.6)] backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#fcd34d]/50 bg-[#2a1307] text-xl shadow-inner">
                📲
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-black uppercase tracking-wider text-[#fcd34d]">
                  INSTALL SYNIQ APP
                </span>
                <span className="text-[10px] font-bold text-[#ffe49e]/80">
                  Play offline anytime on your home screen
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={installPWA}
              className="shrink-0 rounded-xl border border-[#78350f] bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] px-3.5 py-2 text-xs font-black uppercase tracking-wider text-[#3a1d0d] shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_3px_0_#78350f] transition-transform active:scale-95 cursor-pointer outline-none hover:brightness-110"
            >
              INSTALL
            </button>
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  )
}
