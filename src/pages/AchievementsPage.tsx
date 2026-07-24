import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import simonForestBackground from '@/assets/Gemini_Generated_Image_g2o2jfg2o2jfg2o2.png'
import { ForestParticles } from '@/components/effects/ForestParticles'
import { Modal } from '@/components/ui/Modal'
import { achievementService } from '@/services/AchievementService'
import type { Achievement } from '@/models/Achievement'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

type CategoryFilter = 'all' | 'beginner' | 'mastery' | 'speed' | 'score'

export default function AchievementsPage() {
  useDocumentTitle('Achievements Vault - Syniq Memory')
  const navigate = useNavigate()
  const [achievements, setAchievements] = useState<ReadonlyArray<Achievement>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all')
  const [selectedBadge, setSelectedBadge] = useState<Achievement | null>(null)

  useEffect(() => {
    let active = true
    async function fetchAchievements() {
      try {
        const data = await achievementService.getAchievements()
        if (active) setAchievements(data)
      } catch (err) {
        console.error('Failed to load achievements vault:', err)
      } finally {
        if (active) setIsLoading(false)
      }
    }
    fetchAchievements()
    return () => {
      active = false
    }
  }, [])

  const categories = [
    { id: 'all', label: 'All Badges', icon: '🏆' },
    { id: 'beginner', label: 'Beginner', icon: '🔰' },
    { id: 'mastery', label: 'Mastery', icon: '👑' },
    { id: 'speed', label: 'Speed', icon: '⚡' },
    { id: 'score', label: 'Score', icon: '🔥' },
  ] as const

  const filteredAchievements = achievements.filter((a) => {
    if (activeCategory === 'all') return true
    return a.category === activeCategory
  })

  const unlockedCount = achievements.filter((a) => Boolean(a.unlockedAt)).length
  const totalCount = achievements.length
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  return (
    <div className="simon-home-screen select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="simon-landing-card relative flex flex-col items-center justify-center p-3.5 sm:p-4 overflow-hidden overflow-y-auto"
        style={{ backgroundImage: `url(${simonForestBackground})` }}
      >
        {/* Ambient Forest Particles Overlay */}
        <ForestParticles />

        <div className="simon-landing-sky" aria-hidden="true" />
        <div className="simon-landing-hills" aria-hidden="true" />

        {/* ── 3D Wood Achievements Plaque Container ── */}
        <div className="relative z-10 my-auto flex w-full max-w-[480px] flex-col gap-3.5 rounded-[24px] sm:rounded-[26px] border-[3px] border-[#3e2211] bg-gradient-to-b from-[#945525]/95 via-[#753f1a]/95 to-[#54290c]/95 p-3.5 xs:p-4 sm:p-6 text-[#fff3cd] shadow-[inset_0_2px_0_rgba(255,226,162,0.6),inset_0_-4px_0_rgba(30,12,4,0.7),0_8px_0_#381c0d,0_20px_40px_rgba(5,15,5,0.75)] backdrop-blur-md overflow-y-auto custom-scrollbar max-h-[90vh]">

          {/* Header Bar inside Plaque */}
          <div className="flex items-center justify-between pb-2 border-b border-[#8a4e22]/50">
            <button
              onClick={() => navigate('/')}
              type="button"
              aria-label="Return home"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-[#5a341a] bg-gradient-to-b from-[#9e5d2b] to-[#5a2e12] text-base sm:text-lg font-bold text-[#fff3cd] shadow-[inset_0_1.5px_0_rgba(255,226,162,0.6),0_3px_6px_rgba(0,0,0,0.5)] transition-transform active:scale-95 cursor-pointer outline-none hover:scale-105"
            >
              ⌂
            </button>
            <div className="rounded-full border-2 border-[#3d200e] bg-gradient-to-b from-[#d99043] to-[#8c4b18] px-4 sm:px-6 py-1 text-xs sm:text-sm font-black uppercase tracking-widest text-[#fff3cd] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_0_#2b1408]">
              🏆 TROPHY VAULT
            </div>
            <div className="w-9 sm:w-10" />
          </div>

          {/* Overall Completion Progress Box */}
          <div className="rounded-2xl border border-[#fcd34d]/50 bg-gradient-to-r from-[#78350f]/90 via-[#3a1d0d]/95 to-[#78350f]/90 p-3 shadow-[0_0_15px_rgba(252,211,77,0.2)]">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-[#ffe49e]">
              <span>Vault Collection</span>
              <span className="font-mono text-[#fcd34d]">{unlockedCount} / {totalCount} ({progressPercent}%)</span>
            </div>
            <div className="mt-2 h-3 w-full overflow-hidden rounded-full border border-[#4a2713] bg-[#2a1307] p-0.5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#d97706] via-[#fcd34d] to-[#f59e0b] shadow-[0_0_8px_rgba(252,211,77,0.8)]"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-1 overflow-x-auto p-1 custom-scrollbar rounded-xl border border-[#5a341a] bg-[#2a1307]">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  type="button"
                  className={`flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-black uppercase tracking-wider transition-all cursor-pointer outline-none ${
                    isActive
                      ? 'bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-[#3a1d0d] shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                      : 'text-[#ffe49e]/70 hover:text-[#ffe49e]'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>

          {/* Badges Grid */}
          {isLoading ? (
            <div className="py-8 text-center text-xs font-bold text-[#ffe49e]">
              Opening Vault...
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div className="py-8 text-center text-xs font-bold text-[#ffe49e]/60">
              No badges found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 gap-2 py-1">
              {filteredAchievements.map((ach) => {
                const isUnlocked = Boolean(ach.unlockedAt)
                return (
                  <motion.button
                    key={ach.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setSelectedBadge(ach)}
                    type="button"
                    className={`relative flex flex-col items-center justify-between rounded-2xl border p-2.5 text-center transition-all cursor-pointer outline-none select-none ${
                      isUnlocked
                        ? 'border-[#fcd34d] bg-gradient-to-b from-[#fcd34d]/20 via-[#3a1d0d]/90 to-[#2a1307]/90 shadow-[0_0_12px_rgba(252,211,77,0.25)]'
                        : 'border-[#78431e]/40 bg-[#2a1307]/60 opacity-60 hover:opacity-85'
                    }`}
                  >
                    {/* Badge Icon */}
                    <div className="relative my-1 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-[#78350f] to-[#3a1d0d] text-2xl shadow-inner border border-[#fcd34d]/30">
                      <span style={{ filter: isUnlocked ? 'none' : 'grayscale(1)' }}>{ach.icon}</span>
                      {!isUnlocked && (
                        <span className="absolute -bottom-1 -right-1 text-[10px]">🔒</span>
                      )}
                    </div>

                    {/* Title */}
                    <span className="mt-1 text-xs font-black text-[#fff3cd] leading-tight line-clamp-1 w-full">
                      {ach.title}
                    </span>

                    {/* Short Status */}
                    <span className={`mt-1 rounded-full px-2 py-0.5 text-[8.5px] font-black uppercase tracking-wider ${
                      isUnlocked
                        ? 'bg-[#fcd34d]/20 text-[#fcd34d] border border-[#fcd34d]/50'
                        : 'bg-black/30 text-[#ffe49e]/50 border border-[#78431e]/30'
                    }`}>
                      {isUnlocked ? 'UNLOCKED ✨' : 'LOCKED'}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          )}

          {/* Footer Back Link */}
          <button
            onClick={() => navigate('/profile')}
            type="button"
            className="mt-1 w-full rounded-xl border border-[#78431e] bg-gradient-to-b from-[#5a2e12] to-[#2a1307] py-2 text-center text-xs font-black uppercase tracking-wider text-[#ffe49e] shadow-sm transition-transform active:scale-98 cursor-pointer hover:bg-white/5"
          >
            ← Back to Profile
          </button>
        </div>
      </motion.div>

      {/* ── Interactive 3D Badge Inspect Modal ── */}
      <AnimatePresence>
        {selectedBadge && (
          <Modal
            isOpen={Boolean(selectedBadge)}
            onClose={() => setSelectedBadge(null)}
            title="BADGE INSPECT"
          >
            <div className="flex flex-col items-center gap-3 text-center select-none py-1">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-[#fcd34d] bg-gradient-to-b from-[#fcd34d]/30 via-[#78350f] to-[#3a1d0d] text-4xl shadow-[0_0_25px_rgba(252,211,77,0.4)]">
                <span style={{ filter: selectedBadge.unlockedAt ? 'none' : 'grayscale(1)' }}>
                  {selectedBadge.icon}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-[#fcd34d] uppercase tracking-wide">
                  {selectedBadge.title}
                </h3>
                <span className="mt-1 inline-block rounded-full bg-[#fcd34d]/15 px-3 py-0.5 text-[9.5px] font-black uppercase tracking-widest text-[#ffe49e] border border-[#fcd34d]/30">
                  Category: {selectedBadge.category}
                </span>
                <p className="mt-2.5 text-xs font-bold text-[#fff3cd] px-2 leading-relaxed">
                  {selectedBadge.description}
                </p>
              </div>

              <div className="w-full rounded-xl border border-[#78431e]/60 bg-[#2a1307]/80 p-2.5 text-center mt-1">
                {selectedBadge.unlockedAt ? (
                  <span className="text-xs font-black text-[#4ade80]">
                    ✅ Unlocked on {new Date(selectedBadge.unlockedAt).toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-xs font-bold text-[#ffe49e]/60">
                    🔒 Status: Locked (Play to unlock this achievement!)
                  </span>
                )}
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
