import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface TooltipProps {
  readonly content: string
  readonly children: React.ReactNode
}

/**
 * Highly interactive tooltip. Supports hover and keyboard focus triggers for accessibility.
 */
export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div
      className="relative inline-block"
      onBlur={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible ? (
          <motion.div
            animate={{ opacity: 1, scale: 1, y: -4 }}
            className="absolute bottom-full left-1/2 z-30 mb-2 w-max max-w-[200px] -translate-x-1/2 rounded-md border border-white/10 bg-black/90 px-2.5 py-1 text-center text-[10px] leading-relaxed text-[var(--color-text-primary)] shadow-lg backdrop-blur-md"
            exit={{ opacity: 0, scale: 0.95, y: 0 }}
            initial={{ opacity: 0, scale: 0.95, y: 0 }}
            role="tooltip"
            transition={{ duration: 0.15 }}
          >
            {content}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
