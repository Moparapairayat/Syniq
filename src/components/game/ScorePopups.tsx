import { motion, AnimatePresence } from 'framer-motion'

export interface PopupItem {
  readonly id: string
  readonly text: string
  readonly color?: string
}

interface ScorePopupsProps {
  readonly popups: ReadonlyArray<PopupItem>
}

export function ScorePopups({ popups }: ScorePopupsProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center overflow-hidden select-none">
      <AnimatePresence>
        {popups.map((popup) => (
          <motion.div
            key={popup.id}
            initial={{ opacity: 0, y: 15, scale: 0.6, rotate: -5 }}
            animate={{ opacity: 1, y: -45, scale: 1.15, rotate: 0 }}
            exit={{ opacity: 0, y: -80, scale: 0.9 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="absolute rounded-full px-4 py-1 font-mono text-sm font-black tracking-wider uppercase text-[#3a1d0d] shadow-[0_4px_20px_rgba(0,0,0,0.6)] backdrop-blur-sm border-2 border-white"
            style={{
              background: popup.color || 'linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)',
              textShadow: '0 1px 2px rgba(255,255,255,0.6)',
            }}
          >
            {popup.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
