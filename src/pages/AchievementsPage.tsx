import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import simonForestBackground from '@/assets/Gemini_Generated_Image_g2o2jfg2o2jfg2o2.png'
import { ForestParticles } from '@/components/effects/ForestParticles'
import { Modal } from '@/components/ui/Modal'
import { achievementService } from '@/services/AchievementService'
import type { Achievement, AchievementRarity } from '@/models/Achievement'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

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
    ribbonCls: 'bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#d97706] text-[#3a1d0d]',
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
    ribbonCls: 'bg-gradient-to-r from-[#34d399] via-[#059669] to-[#047857] text-[#064e3b]',
    glowShadow: 'shadow-[0_0_10px_rgba(52,211,153,0.35)]',
    label: 'COMMON 🔰',
  },
}

export default function AchievementsPage() {
  useDocumentTitle('Trophy Vault - Syniq Memory')
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
  const progressPercent = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0

  return (
    <div className="simon-home-screen select-none w-full min-h-screen">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="simon-landing-card relative flex w-full flex-col items-center justify-center p-2 xs:p-3 sm:p-4 overflow-hidden overflow-y-auto min-h-[92vh]"
        style={{ backgroundImage: `url(${simonForestBackground})` }}
      >
        {/* Ambient Forest Particles Overlay */}
        <ForestParticles />

        <div className="simon-landing-sky" aria-hidden="true" />
        <div className="simon-landing-hills" aria-hidden="true" />

        {/* ── 3D Wood Achievements Plaque Container ── */}
        <div className="relative z-10 my-auto flex w-full max-w-full sm:max-w-[520px] flex-col gap-2.5 sm:gap-3.5 rounded-[20px] xs:rounded-[24px] sm:rounded-[26px] border-[3px] border-[#3e2211] bg-gradient-to-b from-[#945525]/95 via-[#753f1a]/95 to-[#54290c]/95 p-2.5 xs:p-3.5 sm:p-5 text-[#fff3cd] shadow-[inset_0_2px_0_rgba(255,226,162,0.6),inset_0_-4px_0_rgba(30,12,4,0.7),0_8px_0_#381c0d,0_20px_40px_rgba(5,15,5,0.75)] backdrop-blur-md overflow-y-auto custom-scrollbar max-h-[86vh] sm:max-h-[90vh]">

          {/* Header Bar inside Plaque */}
          <div className="flex items-center justify-between pb-1.5 sm:pb-2 border-b border-[#8a4e22]/50">
            <button
              onClick={() => navigate('/')}
              type="button"
              aria-label="Return home"
              className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-[#5a341a] bg-gradient-to-b from-[#9e5d2b] to-[#5a2e12] text-sm sm:text-lg font-bold text-[#fff3cd] shadow-[inset_0_1.5px_0_rgba(255,226,162,0.6),0_3px_6px_rgba(0,0,0,0.5)] transition-transform active:scale-95 cursor-pointer outline-none hover:scale-105 shrink-0"
            >
              ⌂
            </button>
            <div className="rounded-full border-2 border-[#3d200e] bg-gradient-to-b from-[#d99043] to-[#8c4b18] px-3 sm:px-6 py-0.5 sm:py-1 text-[10.5px] xs:text-xs sm:text-sm font-black uppercase tracking-wider sm:tracking-widest text-[#fff3cd] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_0_#2b1408] whitespace-nowrap">
              🏆 TROPHY VAULT
            </div>
            <div className="w-8 sm:w-10 shrink-0" />
          </div>

          {/* Overall Completion Progress Box */}
          <div className="rounded-2xl border border-[#fcd34d]/50 bg-gradient-to-r from-[#78350f]/90 via-[#3a1d0d]/95 to-[#78350f]/90 p-2.5 sm:p-3 shadow-[0_0_15px_rgba(252,211,77,0.2)]">
            <div className="flex items-center justify-between text-[10px] xs:text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#ffe49e]">
              <span>Vault Collection</span>
              <span className="font-mono text-[#fcd34d]">{unlockedCount} / {totalCount} ({progressPercent}%)</span>
            </div>
            <div className="mt-1.5 sm:mt-2 h-2.5 sm:h-3 w-full overflow-hidden rounded-full border border-[#4a2713] bg-[#2a1307] p-0.5 shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-[#d97706] via-[#fcd34d] to-[#f59e0b] shadow-[0_0_8px_rgba(252,211,77,0.8)]"
              />
            </div>
          </div>

          {/* Category Filter Tabs — 5-column grid, always fits on one row */}
          <div className="grid grid-cols-5 gap-1 p-1 rounded-xl border border-[#5a341a] bg-[#2a1307]">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  type="button"
                  aria-pressed={isActive}
                  className={`flex flex-col xs:flex-row items-center justify-center gap-0.5 xs:gap-1 rounded-lg px-1 py-1.5 xs:py-1 text-[8px] xs:text-[9.5px] sm:text-[11px] font-black uppercase tracking-wide transition-all cursor-pointer outline-none w-full ${
                    isActive
                      ? 'bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-[#3a1d0d] shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
                      : 'text-[#ffe49e]/70 hover:text-[#ffe49e] hover:bg-white/5'
                  }`}
                >
                  <span className="text-sm xs:text-base leading-none">{cat.icon}</span>
                  <span className="leading-tight truncate">{cat.label}</span>
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
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-3 gap-1.5 sm:gap-2.5 py-0.5">
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
                    className={`relative flex flex-col items-center justify-between rounded-2xl border-2 p-2 sm:p-2.5 text-center transition-all cursor-pointer outline-none select-none min-h-[110px] xs:min-h-[120px] overflow-hidden ${isUnlocked
                        ? `${rarityStyle.borderCls} ${rarityStyle.bgCls} ${rarityStyle.glowShadow}`
                        : 'border-[#78431e]/40 bg-[#2a1307]/60 opacity-60 hover:opacity-85'
                      }`}
                  >
                    {/* Animated Hologram Gloss Sheen Beam for Unlocked Badges */}
                    {isUnlocked && (
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', repeatDelay: 2 }}
                        className="pointer-events-none absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                      />
                    )}

                    {/* 3D Gemstone Shield Rim */}
                    <div className={`relative my-0.5 sm:my-1 flex h-10 w-10 xs:h-11 xs:w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl text-xl xs:text-2xl sm:text-3xl shadow-lg transition-transform ${isUnlocked ? rarityStyle.badgeRim : 'border-2 border-[#78431e]/50 bg-[#3a1d0d] text-[#ffe49e]/40'
                      }`}>
                      <span style={{ filter: isUnlocked ? 'none' : 'grayscale(1)' }}>{ach.icon}</span>
                      {!isUnlocked && (
                        <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1a0c04] border border-[#78431e] text-[9px]">🔒</span>
                      )}
                    </div>

                    {/* Title */}
                    <span className="mt-0.5 sm:mt-1 text-[10px] xs:text-[10.5px] sm:text-xs font-black text-[#fff3cd] leading-tight line-clamp-1 w-full px-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                      {ach.title}
                    </span>

                    {/* 3D Tier Ribbon / Status */}
                    <span className={`mt-1 w-full rounded-full py-0.5 text-[7.5px] xs:text-[8px] sm:text-[8.5px] font-black uppercase tracking-wider shadow-sm ${isUnlocked
                        ? rarityStyle.ribbonCls
                        : 'bg-black/40 text-[#ffe49e]/40 border border-[#78431e]/30'
                      }`}>
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
            className="mt-0.5 sm:mt-1 w-full rounded-xl border border-[#78431e] bg-gradient-to-b from-[#5a2e12] to-[#2a1307] py-2 text-center text-xs font-black uppercase tracking-wider text-[#ffe49e] shadow-sm transition-transform active:scale-98 cursor-pointer hover:bg-white/5"
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
                <div className="flex flex-col items-center gap-3 text-center select-none py-1">
                  {/* Rotating 3D Gemstone Shield Pedestal */}
                  <motion.div
                    animate={{ rotateY: [0, 360] }}
                    transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                    className={`relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-3xl ${unlocked ? rStyle.badgeRim + ' ' + rStyle.glowShadow : 'border-2 border-[#78431e] bg-[#2a1307]'
                      } text-4xl sm:text-5xl shadow-2xl`}
                  >
                    <span style={{ filter: unlocked ? 'none' : 'grayscale(1)' }}>
                      {selectedBadge.icon}
                    </span>
                  </motion.div>

                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-[#fcd34d] uppercase tracking-wide drop-shadow-md">
                      {selectedBadge.title}
                    </h3>

                    {/* Rarity Ribbon Tag */}
                    <div className="mt-1 inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest border border-white/20 shadow-inner"
                      style={{
                        background: unlocked ? 'rgba(252,211,77,0.15)' : 'rgba(0,0,0,0.3)',
                      }}
                    >
                      <span>{rStyle.label}</span>
                    </div>

                    <p className="mt-3 text-xs font-bold text-[#fff3cd] px-2 leading-relaxed">
                      {selectedBadge.description}
                    </p>
                  </div>

                  <div className="w-full rounded-2xl border border-[#78431e] bg-[#2a1307]/90 p-3 text-center mt-1 shadow-inner">
                    {selectedBadge.unlockedAt ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-xs font-black text-[#4ade80]">
                          ✨ UNLOCKED & RECORDED
                        </span>
                        <span className="text-[10px] font-bold text-[#ffe49e]/70">
                          {new Date(selectedBadge.unlockedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
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
