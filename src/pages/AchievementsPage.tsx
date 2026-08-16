import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import simonForestBackground from '@/assets/simon-forest-background.png'
import { ForestParticles } from '@/components/effects/ForestParticles'
import { Modal } from '@/components/ui/Modal'
import { achievementService } from '@/services/AchievementService'
import type { Achievement, AchievementRarity } from '@/models/Achievement'
import { useMetaTags } from '@/hooks/useMetaTags'

type CategoryFilter = 'all' | 'beginner' | 'mastery' | 'speed' | 'score'

interface RarityStyle {
  borderCls: string
  bgCls: string
  badgeRim: string
  ribbonCls: string
  glowShadow: string
  label: string
}

const RARITY_MAP: Record<AchievementRarity, RarityStyle> = {
  legendary: {
    borderCls: 'border-[#fcd34d]',
    bgCls: 'bg-gradient-to-b from-[#ffd700]/30 via-[#78350f]/90 to-[#2a1307]/90',
    badgeRim: 'border-2 border-[#fcd34d] bg-gradient-to-b from-[#fbbf24] to-[#78350f]',
    ribbonCls:
      'bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] text-[#3a1d0d]',
    glowShadow: 'shadow-[0_0_18px_rgba(252,211,77,0.5)]',
    label: 'LEGENDARY 👑',
  },
  epic: {
    borderCls: 'border-[#c084fc]',
    bgCls: 'bg-gradient-to-b from-[#c084fc]/25 via-[#4c1d95]/90 to-[#2a1307]/90',
    badgeRim: 'border-2 border-[#c084fc] bg-gradient-to-b from-[#a855f7] to-[#581c87]',
    ribbonCls: 'bg-gradient-to-r from-[#c084fc] via-[#a855f7] to-[#7e22ce] text-white',
    glowShadow: 'shadow-[0_0_14px_rgba(192,132,252,0.4)]',
    label: 'EPIC 🔥',
  },
  rare: {
    borderCls: 'border-[#38bdf8]',
    bgCls: 'bg-gradient-to-b from-[#38bdf8]/25 via-[#0c4a6e]/90 to-[#2a1307]/90',
    badgeRim: 'border-2 border-[#38bdf8] bg-gradient-to-b from-[#0284c7] to-[#0c4a6e]',
    ribbonCls: 'bg-gradient-to-r from-[#38bdf8] via-[#0284c7] to-[#0369a1] text-white',
    glowShadow: 'shadow-[0_0_14px_rgba(56,189,248,0.4)]',
    label: 'RARE ⚡',
  },
  common: {
    borderCls: 'border-[#34d399]',
    bgCls: 'bg-gradient-to-b from-[#34d399]/20 via-[#064e3b]/90 to-[#2a1307]/90',
    badgeRim: 'border-2 border-[#34d399] bg-gradient-to-b from-[#059669] to-[#064e3b]',
    ribbonCls:
      'bg-gradient-to-r from-[#34d399] via-[#059669] to-[#047857] text-[#064e3b]',
    glowShadow: 'shadow-[0_0_10px_rgba(52,211,153,0.35)]',
    label: 'COMMON 🔰',
  },
}

export default function AchievementsPage() {
  useMetaTags({
    title: 'Trophy Vault — Achievements',
    description:
      'Unlock 8 epic Syniq memory badges. From Memory Apprentice to Cognitive Titan — prove your skills across all game modes and difficulties.',
    url: 'https://syniq.moparapairayat.dev/achievements',
  })
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
    { id: 'all', label: 'All', icon: '🏆' },
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
  const progressPercent =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  return (
    <div className="simon-home-screen min-h-screen w-full select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="simon-landing-card xs:p-3 relative flex min-h-[92vh] w-full flex-col items-center justify-center overflow-hidden overflow-y-auto p-2 sm:p-4"
        style={{ backgroundImage: `url(${simonForestBackground})` }}
      >
        {/* Ambient Forest Particles Overlay */}
        <ForestParticles />

        <div className="simon-landing-sky" aria-hidden="true" />
        <div className="simon-landing-hills" aria-hidden="true" />

        {/* ── 3D Wood Achievements Plaque Container ── */}
        <div className="xs:rounded-[24px] xs:p-3.5 custom-scrollbar relative z-10 my-auto flex max-h-[86vh] w-full max-w-full flex-col gap-2.5 overflow-y-auto rounded-[20px] border-[3px] border-[#3e2211] bg-gradient-to-b from-[#945525]/95 via-[#753f1a]/95 to-[#54290c]/95 p-2.5 text-[#fff3cd] shadow-[inset_0_2px_0_rgba(255,226,162,0.6),inset_0_-4px_0_rgba(30,12,4,0.7),0_8px_0_#381c0d,0_20px_40px_rgba(5,15,5,0.75)] backdrop-blur-md sm:max-h-[90vh] sm:max-w-[520px] sm:gap-3.5 sm:rounded-[26px] sm:p-5">
          {/* Header Bar inside Plaque */}
          <div className="flex items-center justify-between border-b border-[#8a4e22]/50 pb-1.5 sm:pb-2">
            <button
              onClick={() => navigate('/')}
              type="button"
              aria-label="Return home"
              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-[#5a341a] bg-gradient-to-b from-[#9e5d2b] to-[#5a2e12] text-sm font-bold text-[#fff3cd] shadow-[inset_0_1.5px_0_rgba(255,226,162,0.6),0_3px_6px_rgba(0,0,0,0.5)] transition-transform outline-none hover:scale-105 active:scale-95 sm:h-10 sm:w-10 sm:text-lg"
            >
              ⌂
            </button>
            <div className="xs:text-xs rounded-full border-2 border-[#3d200e] bg-gradient-to-b from-[#d99043] to-[#8c4b18] px-3 py-0.5 text-[10.5px] font-black tracking-wider whitespace-nowrap text-[#fff3cd] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_0_#2b1408] sm:px-6 sm:py-1 sm:text-sm sm:tracking-widest">
              🏆 TROPHY VAULT
            </div>
            <div className="w-8 shrink-0 sm:w-10" />
          </div>

          {/* Overall Completion Progress Box */}
          <div className="rounded-2xl border border-[#fcd34d]/50 bg-gradient-to-r from-[#78350f]/90 via-[#3a1d0d]/95 to-[#78350f]/90 p-2.5 shadow-[0_0_15px_rgba(252,211,77,0.2)] sm:p-3">
            <div className="xs:text-[11px] flex items-center justify-between text-[10px] font-black tracking-wider text-[#ffe49e] uppercase sm:text-xs">
              <span>Vault Collection</span>
              <span className="font-mono text-[#fcd34d]">
                {unlockedCount} / {totalCount} ({progressPercent}%)
              </span>
            </div>
            <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full border border-[#4a2713] bg-[#2a1307] p-0.5 shadow-inner sm:mt-2 sm:h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#d97706] via-[#fcd34d] to-[#f59e0b] shadow-[0_0_8px_rgba(252,211,77,0.8)]"
              />
            </div>
          </div>

          {/* Category Filter Tabs — 5-column grid, always fits on one row */}
          <div className="grid grid-cols-5 gap-1 rounded-xl border border-[#5a341a] bg-[#2a1307] p-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  type="button"
                  aria-pressed={isActive}
                  className={`xs:flex-row xs:gap-1 xs:py-1 xs:text-[9.5px] flex w-full cursor-pointer flex-col items-center justify-center gap-0.5 rounded-lg px-1 py-1.5 text-[8px] font-black tracking-wide uppercase transition-all outline-none sm:text-[11px] ${
                    isActive
                      ? 'bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-[#3a1d0d] shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                      : 'text-[#ffe49e]/70 hover:bg-white/5 hover:text-[#ffe49e]'
                  }`}
                >
                  <span className="xs:text-base text-sm leading-none">{cat.icon}</span>
                  <span className="truncate leading-tight">{cat.label}</span>
                </button>
              )
            })}
          </div>

          {/* Next-Gen 3D Badges Grid */}
          {isLoading ? (
            <div className="py-8 text-center text-xs font-bold text-[#ffe49e]">
              Opening Vault...
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div className="py-8 text-center text-xs font-bold text-[#ffe49e]/60">
              No badges found in this category.
            </div>
          ) : (
            <div className="xs:grid-cols-3 grid grid-cols-2 gap-1.5 py-0.5 sm:grid-cols-3 sm:gap-2.5">
              {filteredAchievements.map((ach) => {
                const isUnlocked = Boolean(ach.unlockedAt)
                const rarityStyle = RARITY_MAP[ach.rarity || 'common']
                return (
                  <motion.button
                    key={ach.id}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedBadge(ach)}
                    type="button"
                    className={`xs:min-h-[120px] relative flex min-h-[110px] cursor-pointer flex-col items-center justify-between overflow-hidden rounded-2xl border-2 p-2 text-center transition-all outline-none select-none sm:p-2.5 ${
                      isUnlocked
                        ? `${rarityStyle.borderCls} ${rarityStyle.bgCls} ${rarityStyle.glowShadow}`
                        : 'border-[#78431e]/40 bg-[#2a1307]/60 opacity-60 hover:opacity-85'
                    }`}
                  >
                    {/* Animated Hologram Gloss Sheen Beam for Unlocked Badges */}
                    {isUnlocked && (
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{
                          repeat: Infinity,
                          duration: 3.5,
                          ease: 'easeInOut',
                          repeatDelay: 2,
                        }}
                        className="pointer-events-none absolute inset-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      />
                    )}

                    {/* 3D Gemstone Shield Rim */}
                    <div
                      className={`xs:h-11 xs:w-11 xs:text-2xl relative my-0.5 flex h-10 w-10 items-center justify-center rounded-2xl text-xl shadow-lg transition-transform sm:my-1 sm:h-12 sm:w-12 sm:text-3xl ${
                        isUnlocked
                          ? rarityStyle.badgeRim
                          : 'border-2 border-[#78431e]/50 bg-[#3a1d0d] text-[#ffe49e]/40'
                      }`}
                    >
                      <span style={{ filter: isUnlocked ? 'none' : 'grayscale(1)' }}>
                        {ach.icon}
                      </span>
                      {!isUnlocked && (
                        <span className="absolute -right-1 -bottom-1 flex h-4 w-4 items-center justify-center rounded-full border border-[#78431e] bg-[#1a0c04] text-[9px]">
                          🔒
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <span className="xs:text-[10.5px] mt-0.5 line-clamp-1 w-full px-0.5 text-[10px] leading-tight font-black text-[#fff3cd] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:mt-1 sm:text-xs">
                      {ach.title}
                    </span>

                    {/* 3D Tier Ribbon / Status */}
                    <span
                      className={`xs:text-[8px] mt-1 w-full rounded-full py-0.5 text-[7.5px] font-black tracking-wider uppercase shadow-sm sm:text-[8.5px] ${
                        isUnlocked
                          ? rarityStyle.ribbonCls
                          : 'border border-[#78431e]/30 bg-black/40 text-[#ffe49e]/40'
                      }`}
                    >
                      {isUnlocked ? rarityStyle.label : 'LOCKED'}
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
            className="mt-0.5 w-full cursor-pointer rounded-xl border border-[#78431e] bg-gradient-to-b from-[#5a2e12] to-[#2a1307] py-2 text-center text-xs font-black tracking-wider text-[#ffe49e] uppercase shadow-sm transition-transform hover:bg-white/5 active:scale-98 sm:mt-1"
          >
            ← Back to Profile
          </button>
        </div>
      </motion.div>

      {/* ── Next-Gen 3D Badge Inspect Modal ── */}
      <AnimatePresence>
        {selectedBadge && (
          <Modal
            isOpen={Boolean(selectedBadge)}
            onClose={() => setSelectedBadge(null)}
            title="3D BADGE INSPECTOR"
          >
            {(() => {
              const rStyle = RARITY_MAP[selectedBadge.rarity || 'common']
              const unlocked = Boolean(selectedBadge.unlockedAt)
              return (
                <div className="flex flex-col items-center gap-3 py-1 text-center select-none">
                  {/* Rotating 3D Gemstone Shield Pedestal */}
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className={`relative flex h-20 w-20 items-center justify-center rounded-3xl sm:h-24 sm:w-24 ${
                      unlocked
                        ? rStyle.badgeRim + ' ' + rStyle.glowShadow
                        : 'border-2 border-[#78431e] bg-[#2a1307]'
                    } text-4xl shadow-2xl sm:text-5xl`}
                  >
                    <span style={{ filter: unlocked ? 'none' : 'grayscale(1)' }}>
                      {selectedBadge.icon}
                    </span>
                  </motion.div>

                  <div>
                    <h3 className="text-lg font-black tracking-wide text-[#fcd34d] uppercase drop-shadow-md sm:text-xl">
                      {selectedBadge.title}
                    </h3>

                    {/* Rarity Ribbon Tag */}
                    <div
                      className="mt-1 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-0.5 text-[10px] font-black tracking-widest uppercase shadow-inner"
                      style={{
                        background: unlocked
                          ? 'rgba(252,211,77,0.15)'
                          : 'rgba(0,0,0,0.3)',
                      }}
                    >
                      <span>{rStyle.label}</span>
                    </div>

                    <p className="mt-3 px-2 text-xs leading-relaxed font-bold text-[#fff3cd]">
                      {selectedBadge.description}
                    </p>
                  </div>

                  <div className="mt-1 w-full rounded-2xl border border-[#78431e] bg-[#2a1307]/90 p-3 text-center shadow-inner">
                    {selectedBadge.unlockedAt ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black text-[#4ade80]">
                          ✨ UNLOCKED & RECORDED
                        </span>
                        <span className="text-[10px] font-bold text-[#ffe49e]/70">
                          {new Date(selectedBadge.unlockedAt).toLocaleDateString(
                            undefined,
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            },
                          )}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-[#ffe49e]/60">
                        🔒 Status: Locked (Play to unlock this achievement!)
                      </span>
                    )}
                  </div>
                </div>
              )
            })()}
          </Modal>
        )}
      </AnimatePresence>
    </div>
  )
}
