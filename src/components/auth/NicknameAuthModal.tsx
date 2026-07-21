import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playerService } from '@/services'
import { AVATARS, AVATAR_SETS } from '@/layouts/AppLayout'

interface NicknameAuthModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly initialName?: string
  readonly initialAvatarId?: number
  readonly onAuthSuccess?: (name: string, avatarId: number) => void
}

export function NicknameAuthModal({
  isOpen,
  onClose,
  initialName = '',
  initialAvatarId = 1,
  onAuthSuccess,
}: NicknameAuthModalProps) {
  const [name, setName] = useState(initialName)
  const [selectedAvatarId, setSelectedAvatarId] = useState(initialAvatarId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter a valid player name.')
      return
    }
    if (trimmed.length < 2) {
      setError('Name must be at least 2 characters.')
      return
    }
    if (trimmed.length > 15) {
      setError('Name must be 15 characters or less.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      await playerService.renamePlayer(trimmed)
      localStorage.setItem('syniq-avatar-id', String(selectedAvatarId))
      localStorage.setItem('syniq-nickname-set', 'true')
      window.dispatchEvent(new CustomEvent('syniq-profile-updated'))
      onAuthSuccess?.(trimmed, selectedAvatarId)
      onClose()
    } catch (err) {
      console.error(err)
      setError('Failed to save profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeAvatar = AVATARS.find((a) => a.id === selectedAvatarId) ?? AVATARS[0]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="cyber-card relative z-10 w-full max-w-sm p-6 overflow-hidden select-none border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#1e293b] shadow-2xl"
        >
          {/* Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-2xl mb-2">
              🎮
            </div>
            <h2 className="text-xl font-bold tracking-tight">
              Player Profile
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Customize your display name and avatar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Avatar Selector Preview */}
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CHOOSE AVATAR</span>
              <div className="relative">
                <div
                  className="relative overflow-hidden rounded-full avatar-ring-neon"
                  style={{ width: 64, height: 64 }}
                >
                  <div
                    style={{
                      width: 128,
                      height: 128,
                      backgroundImage: `url(${AVATAR_SETS[activeAvatar.set]})`,
                      backgroundSize: '200% 200%',
                      backgroundPosition: activeAvatar.pos,
                    }}
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 rounded-full bg-[#38bdf8] px-2 py-0.5 text-[9px] font-bold text-[#0f172a]">
                  {activeAvatar.label}
                </span>
              </div>

              {/* Avatar Mini Grid */}
              <div className="grid grid-cols-6 gap-1.5 mt-2 w-full max-w-[260px]">
                {AVATARS.map((av) => {
                  const isSelected = selectedAvatarId === av.id
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(av.id)}
                      className={`relative overflow-hidden rounded-full aspect-square border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#38bdf8] scale-110 shadow-sm'
                          : 'border-slate-300 dark:border-slate-700 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div
                        style={{
                          width: '200%',
                          height: '200%',
                          backgroundImage: `url(${AVATAR_SETS[av.set]})`,
                          backgroundSize: '200% 200%',
                          backgroundPosition: av.pos,
                        }}
                      />
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Nickname Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="text-slate-400 uppercase tracking-wider">PLAYER NAME</span>
                <span className="text-slate-400">{name.length} / 15</span>
              </div>
              <input
                type="text"
                autoFocus
                maxLength={15}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="Enter player name"
                className="w-full rounded-xl px-4 py-2.5 text-sm font-bold border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 focus:border-[#38bdf8] focus:outline-none transition-colors"
              />
              {error && (
                <span className="text-xs font-bold text-rose-500">{error}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-cyber-primary text-xs font-bold py-3"
              >
                {isSubmitting ? 'SAVING...' : 'SAVE PROFILE'}
              </button>

              {initialName && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white py-1 transition text-center cursor-pointer"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
