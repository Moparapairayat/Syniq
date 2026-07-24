import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playerService } from '@/services'
import { AVATARS, AVATAR_SETS } from '@/components/avatar'

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
          className="fixed inset-0 bg-[#070b05]/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* 3D Wood Plaque Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', stiffness: 350, damping: 25 }}
          className="relative z-10 w-full max-w-[92vw] sm:max-w-sm max-h-[90vh] overflow-y-auto p-5 sm:p-6 select-none rounded-[26px] border-[3px] border-[#3e2211] bg-gradient-to-b from-[#945525] via-[#753f1a] to-[#54290c] text-[#fff3cd] shadow-[inset_0_2px_0_rgba(255,226,162,0.6),inset_0_-4px_0_rgba(30,12,4,0.7),0_12px_32px_rgba(0,0,0,0.85)]"
        >
          {/* Header Bar inside 3D Plaque */}
          <div className="flex flex-col items-center mb-5 text-center">
            <div className="rounded-full border-2 border-[#3d200e] bg-gradient-to-b from-[#d99043] to-[#8c4b18] px-6 py-1 text-xs font-black uppercase tracking-widest text-[#fff3cd] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_3px_6px_rgba(0,0,0,0.5)]">
              🎮 PLAYER PROFILE
            </div>
            <p className="text-[11px] font-bold text-[#ffe49e]/80 mt-2">
              Customize your display name and avatar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Avatar Selector Preview */}
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3.5 shadow-inner">
              <span className="text-[10.5px] font-black text-[#ffe49e] uppercase tracking-widest">
                CHOOSE AVATAR
              </span>
              <div className="relative">
                <div
                  className="relative overflow-hidden rounded-full border-2 border-[#fcd34d] shadow-[0_0_12px_rgba(252,211,77,0.5)]"
                  style={{ width: 68, height: 68 }}
                >
                  <div
                    style={{
                      width: 136,
                      height: 136,
                      backgroundImage: `url(${AVATAR_SETS[activeAvatar.set]})`,
                      backgroundSize: '200% 200%',
                      backgroundPosition: activeAvatar.pos,
                    }}
                  />
                </div>
                <span className="absolute -bottom-1 -right-1 rounded-full border border-[#78431e] bg-[#2a1307] px-2 py-0.5 text-[9px] font-black text-[#ffe49e] shadow-md">
                  {activeAvatar.label}
                </span>
              </div>

              {/* Avatar Mini Grid */}
              <div className="grid grid-cols-6 gap-1.5 mt-2 w-full max-w-[270px]">
                {AVATARS.map((av) => {
                  const isSelected = selectedAvatarId === av.id
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => setSelectedAvatarId(av.id)}
                      className={`relative overflow-hidden rounded-full aspect-square border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#fcd34d] scale-110 shadow-[0_0_10px_rgba(252,211,77,0.8)]'
                          : 'border-[#78431e] opacity-60 hover:opacity-100 bg-[#2a1307]'
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
            <div className="flex flex-col gap-1.5 rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3.5 shadow-inner">
              <div className="flex justify-between items-center text-[10.5px] font-black">
                <span className="text-[#ffe49e] uppercase tracking-widest">PLAYER NAME</span>
                <span className="text-[#ffe49e]/70">{name.length} / 15</span>
              </div>
              <input
                type="text"
                maxLength={15}
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="Enter player name"
                className="w-full rounded-xl border border-[#78431e] bg-[#2a1307] px-3.5 py-2.5 text-xs font-black text-[#fff3cd] placeholder-[#ffe49e]/40 outline-none focus:border-[#fcd34d] shadow-inner"
              />
              {error && (
                <span className="text-xs font-black text-rose-400 drop-shadow">{error}</span>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 mt-1">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.97, y: 2 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl border-[2px] border-[#78350f] bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] py-3 text-xs font-black uppercase tracking-wider text-[#3a1d0d] shadow-[inset_0_2px_0_rgba(255,255,255,0.7),inset_0_-2px_0_rgba(120,53,15,0.4),0_5px_0_#78350f,0_8px_16px_rgba(0,0,0,0.5)] transition-all cursor-pointer outline-none"
              >
                {isSubmitting ? 'SAVING...' : 'SAVE PROFILE'}
              </motion.button>

              {initialName && (
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-black text-[#ffe49e] hover:text-white py-1 transition text-center cursor-pointer"
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
