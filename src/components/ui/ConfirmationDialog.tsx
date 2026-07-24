import { motion } from 'framer-motion'
import { Modal } from './Modal'

export interface ConfirmationDialogProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onConfirm: () => void
  readonly title: string
  readonly message: string
  readonly confirmLabel?: string
  readonly cancelLabel?: string
  readonly isDanger?: boolean
}

/**
 * Premium 3D Wood Plaque Confirmation Dialog for end run & critical actions.
 */
export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
}: ConfirmationDialogProps) {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center gap-4 py-1 text-center select-none">
        {/* Animated Badge Icon */}
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={isOpen ? { scale: 1, opacity: 1 } : {}}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          aria-hidden="true"
          className={`flex h-14 w-14 items-center justify-center rounded-full border-2 text-2xl shadow-[inset_0_2px_0_rgba(255,255,255,0.4),0_6px_12px_rgba(0,0,0,0.6)] ${
            isDanger
              ? 'border-[#7f1d1d] bg-gradient-to-b from-[#dc2626] via-[#b91c1c] to-[#450a0a] text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]'
              : 'border-[#78350f] bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] text-[#3a1d0d]'
          }`}
        >
          {isDanger ? '⚠️' : '❓'}
        </motion.div>

        {/* Message Container */}
        <div className="w-full rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3.5 shadow-inner">
          <p className="text-xs font-bold leading-relaxed text-[#ffe49e]">
            {message}
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid w-full grid-cols-2 gap-2.5 mt-1">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl border border-[#5a341a] bg-gradient-to-b from-[#9e5d2b] to-[#5a2e12] py-2.5 text-xs font-black uppercase tracking-widest text-[#fff3cd] shadow-[inset_0_1px_0_rgba(255,226,162,0.4),0_2px_0_#2b1408] transition-transform active:translate-y-0.5 cursor-pointer outline-none hover:border-[#fcd34d]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className={`w-full rounded-xl border py-2.5 text-xs font-black uppercase tracking-widest transition-transform active:translate-y-0.5 cursor-pointer outline-none ${
              isDanger
                ? 'border-[#78281a] bg-gradient-to-b from-[#c93b2b] via-[#a82416] to-[#6e140b] text-[#ffe49e] shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_3px_0_#4a0d06] hover:brightness-110'
                : 'border-[#78350f] bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] text-[#3a1d0d] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_3px_0_#78350f]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
