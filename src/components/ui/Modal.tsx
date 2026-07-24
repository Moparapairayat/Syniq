import { useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

export interface ModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly title: string
  readonly children: React.ReactNode
}

/**
 * 3D Wood Plaque Modal with smooth scale animations and escape key listener.
 */
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal content - 3D Wood Plaque Card */}
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-sm sm:max-w-md select-none"
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
          >
            <div
              aria-modal="true"
              className="relative flex flex-col gap-4 rounded-[26px] border-[3px] border-[#3e2211] bg-gradient-to-b from-[#945525] via-[#753f1a] to-[#54290c] p-5 sm:p-6 text-[#fff3cd] shadow-[inset_0_2px_0_rgba(255,226,162,0.6),inset_0_-4px_0_rgba(30,12,4,0.7),0_8px_0_#381c0d,0_20px_40px_rgba(5,15,5,0.85)]"
              role="dialog"
            >
              {/* Header Ribbon Bar */}
              <div className="flex items-center justify-between pb-1.5 border-b border-[#8a4e22]/50">
                <div className="rounded-full border-2 border-[#3d200e] bg-gradient-to-b from-[#d99043] to-[#8c4b18] px-4 py-0.5 text-xs font-black uppercase tracking-widest text-[#fff3cd] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_0_#2b1408]">
                  {title}
                </div>
                <button
                  aria-label="Close dialog"
                  onClick={onClose}
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#5a341a] bg-gradient-to-b from-[#9e5d2b] to-[#5a2e12] text-sm font-bold text-[#fff3cd] shadow-[inset_0_1.5px_0_rgba(255,226,162,0.6),0_3px_6px_rgba(0,0,0,0.5)] transition-transform active:scale-95 cursor-pointer outline-none"
                >
                  ✕
                </button>
              </div>

              {/* Children Content */}
              <div>{children}</div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
