import { useEffect } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { GlassCard } from './GlassCard'
import { Button } from './Button'

export interface ModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly title: string
  readonly children: React.ReactNode
}

/**
 * Premium overlay dialog modal with fluid scale animations and keyboard escape bindings.
 */
export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const shouldReduceMotion = useReducedMotion()

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal content */}
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-md"
            exit={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
            transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
          >
            <GlassCard
              aria-modal="true"
              className="flex flex-col gap-5 border border-white/[0.08]"
              role="dialog"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[var(--color-text-primary)]">
                  {title}
                </h3>
                <Button
                  aria-label="Close dialog"
                  className="animate-none"
                  onClick={onClose}
                  variant="ghost"
                >
                  ✕
                </Button>
              </div>
              <div>{children}</div>
            </GlassCard>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  )
}
