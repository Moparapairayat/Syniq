import { createContext, useContext, useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface ToastMessage {
  readonly id: string
  readonly message: string
}

export interface ToastContextType {
  readonly showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

/* eslint-disable-next-line react-refresh/only-export-components */
export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export function ToastProvider({ children }: { readonly children: ReactNode }) {
  const [toasts, setToasts] = useState<ReadonlyArray<ToastMessage>>([])

  const showToast = (message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    setToasts((prev) => [...prev, { id, message }])

    // Auto remove after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="rounded-xl border border-white/[0.06] bg-black/80 px-4 py-3 text-sm text-[var(--color-text-primary)] shadow-2xl backdrop-blur-md"
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              key={toast.id}
              transition={{ duration: 0.22 }}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
