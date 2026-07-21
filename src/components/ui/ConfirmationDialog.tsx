import { Modal } from './Modal'
import { AnimatedButton } from './AnimatedButton'

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
 * Pre-configured warning popups wrapping standard Modal overlays for confirmation actions.
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
      <div className="flex flex-col gap-5">
        <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {message}
        </p>
        <div className="flex flex-wrap justify-end gap-3">
          <AnimatedButton onClick={onClose} variant="secondary">
            {cancelLabel}
          </AnimatedButton>
          <AnimatedButton
            className={isDanger ? 'text-[var(--color-danger)]' : undefined}
            onClick={handleConfirm}
            variant={isDanger ? 'ghost' : 'primary'}
          >
            {confirmLabel}
          </AnimatedButton>
        </div>
      </div>
    </Modal>
  )
}
