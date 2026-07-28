import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CardSkeleton, useToast } from '@/components/ui'
import { playerService, achievementService, dailyStreakService } from '@/services'
import { getRandomGamingName } from '@/services/PlayerService'
import type { PlayerProfile } from '@/models/Player'
import type { Achievement } from '@/models/Achievement'
import type { DailyStreakData } from '@/services'
import { AvatarDisplay, AVATARS, AVATAR_SETS } from '@/components/avatar'
import { cn } from '@/utils/classNames'

function getRankInfo(score: number): {
  label: string
  cls: string
  icon: string
  next: number
  color: string
} {
  if (score < 50)
    return { label: 'Novice', cls: 'rank-novice', icon: '🔰', next: 50, color: '#9ca3af' }
  if (score < 150)
    return {
      label: 'Expert',
      cls: 'rank-expert',
      icon: '⚡',
      next: 150,
      color: '#38bdf8',
    }
  if (score < 400)
    return {
      label: 'Master',
      cls: 'rank-master',
      icon: '💎',
      next: 400,
      color: '#c084fc',
    }
  return {
    label: 'Legend',
    cls: 'rank-legend',
    icon: '👑',
    next: Infinity,
    color: '#fbbf24',
  }
}

/* Avatar picker grid item */
function AvatarPickItem({
  avatarId,
  isActive,
  onClick,
}: {
  avatarId: number
  isActive: boolean
  onClick: () => void
}) {
  const avatar = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0]
  const src = AVATAR_SETS[avatar.set]
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        'relative cursor-pointer overflow-hidden rounded-xl border-2 p-1 transition-all sm:rounded-2xl',
        isActive
          ? 'border-[#fcd34d] bg-[#fcd34d]/20'
          : 'border-[#78431e] bg-[#2a1307] hover:border-[#fcd34d]',
      )}
      title={avatar.label}
    >
      <div
        className="overflow-hidden rounded-lg sm:rounded-xl"
        style={{
          width: '100%',
          paddingBottom: '100%',
          backgroundImage: `url(${src})`,
          backgroundSize: '200% 200%',
          backgroundPosition: avatar.pos,
        }}
      />
      {isActive && (
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#d97706]/80 to-transparent pb-1">
          <span className="text-xs font-black text-slate-950">✓</span>
        </div>
      )}
    </motion.button>
  )
}

export function PlayerProfileCard() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
  const [achievements, setAchievements] = useState<ReadonlyArray<Achievement>>([])
  const [streakData, setStreakData] = useState<DailyStreakData | null>(null)
  const [nameInput, setNameInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [selectedAvatarId, setSelectedAvatarId] = useState(1)
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const data = await playerService.getOrCreateProfile()
        const achs = await achievementService.getAchievements()
        const streak = await dailyStreakService.getStreakData()
        if (!active) return
        setProfile(data)
        setNameInput(data.name)
        setAchievements(achs)
        setStreakData(streak)
        const stored = localStorage.getItem('syniq-avatar-id')
        if (stored) setSelectedAvatarId(parseInt(stored, 10))
      } catch (e) {
        console.error(e)
      } finally {
        if (active) setIsLoading(false)
      }
    }
    load()
    return () => {
      active = false
    }
  }, [])

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim() || isSaving) return
    try {
      setIsSaving(true)
      const updated = await playerService.renamePlayer(nameInput)
      setProfile(updated)
      showToast('Name updated successfully! ✨')
    } catch {
      showToast('Failed to update name.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAvatarSelect = (id: number) => {
    setSelectedAvatarId(id)
    localStorage.setItem('syniq-avatar-id', String(id))
    setShowAvatarPicker(false)
    showToast('Avatar updated! 🎭')
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('syniq-profile-updated'))
    }
  }

  if (isLoading) return <CardSkeleton />
  if (!profile)
    return <div className="text-xs text-rose-400">Failed to load profile.</div>

  const rank = getRankInfo(profile.highestScore)

  return (
    <div className="flex w-full flex-col gap-3 select-none sm:gap-3.5">
      {/* ── Profile Hero Card ── */}
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3 text-center shadow-inner sm:gap-2.5 sm:p-4">
        {/* Avatar + edit badge */}
        <div className="relative mt-0.5">
          <AvatarDisplay
            avatarId={selectedAvatarId}
            size={72}
            ringClass="avatar-ring-neon"
            className="sm:h-[82px] sm:w-[82px]"
          />
          <button
            type="button"
            onClick={() => setShowAvatarPicker((s) => !s)}
            className="absolute -right-1 -bottom-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-[#78350f] bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-[10px] text-[#3a1d0d] shadow-md transition-transform hover:scale-105 sm:h-7 sm:w-7 sm:text-xs"
          >
            ✏️
          </button>
        </div>

        {/* Name + 3D Wood Rank Plaque Badge */}
        <div className="relative text-center">
          <h2 className="text-lg leading-tight font-black text-[#fff3cd] sm:text-xl">
            {profile.name}
          </h2>
          <p className="mt-0.5 mb-1.5 text-[8.5px] font-bold tracking-widest text-[#ffe49e]/60 uppercase sm:text-[9.5px]">
            MEMBER SINCE{' '}
            {new Date(profile.createdAt)
              .toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
              .toUpperCase()}
          </p>
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border-2 border-[#78350f] bg-gradient-to-b from-[#d99043] to-[#8c4b18] px-4 py-1 text-[10px] font-black tracking-widest text-[#fff3cd] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2.5px_0_#2b1408] sm:text-xs">
            <span>{rank.icon}</span>
            <span>{rank.label} PLAYER</span>
          </div>
        </div>
      </div>

      {/* ── Avatar Picker Panel ── */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3 shadow-inner sm:p-3.5">
              <p className="mb-2 text-center text-[9.5px] font-black tracking-widest text-[#ffe49e] uppercase sm:text-[10px]">
                Choose Avatar
              </p>
              <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
                {AVATARS.map((av) => (
                  <AvatarPickItem
                    key={av.id}
                    avatarId={av.id}
                    isActive={selectedAvatarId === av.id}
                    onClick={() => handleAvatarSelect(av.id)}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Rename Form Card ── */}
      <div className="rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3 shadow-inner sm:p-3.5">
        <p className="mb-1.5 text-[9.5px] font-black tracking-widest text-[#ffe49e] uppercase sm:text-[10px]">
          ✏️ Player Nickname
        </p>
        <form className="flex gap-2" onSubmit={handleRename}>
          <div className="relative flex flex-grow items-center">
            <input
              id="nickname-input"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              disabled={isSaving}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="Enter player name"
              value={nameInput}
              type="text"
              style={{ backgroundColor: '#2a1307', color: '#fff3cd' }}
              className="w-full rounded-xl border border-[#78431e] bg-[#2a1307] px-3.5 py-1.5 text-xs font-bold text-[#fff3cd] placeholder-[#ffe49e]/40 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] outline-none focus:border-[#fcd34d] sm:py-2"
            />
          </div>
          <button
            type="button"
            onClick={() => setNameInput(getRandomGamingName())}
            aria-label="Roll random gaming name"
            title="Roll random gaming name"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-[#78350f] bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] text-xs text-[#3a1d0d] shadow-sm transition-transform hover:scale-105 active:scale-95 sm:h-9 sm:w-9 sm:text-sm"
          >
            🎲
          </button>
          <button
            disabled={isSaving || nameInput.trim() === profile.name}
            type="submit"
            className="shrink-0 cursor-pointer rounded-xl border border-[#78350f] bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] px-3.5 py-1.5 text-xs font-black tracking-wider text-[#3a1d0d] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_3px_0_#78350f] transition-transform hover:brightness-110 active:translate-y-0.5 disabled:opacity-50 sm:px-4 sm:py-2"
            style={{ width: 'auto' }}
          >
            {isSaving ? '...' : 'SAVE 💾'}
          </button>
        </form>
      </div>

      {/* ── Daily Play Streak Mission Card ── */}
      <div className="flex items-center justify-between rounded-2xl border border-[#fcd34d]/60 bg-gradient-to-r from-[#78350f]/80 via-[#3a1d0d]/90 to-[#78350f]/80 p-2.5 shadow-[0_0_12px_rgba(252,211,77,0.2)] sm:p-3">
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-lg shadow-inner sm:h-10 sm:w-10 sm:text-xl">
            🔥
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black tracking-widest text-[#fcd34d] uppercase sm:text-[10px]">
              DAILY PLAY STREAK
            </span>
            <span className="text-xs font-black text-[#fff3cd] sm:text-sm">
              {streakData?.currentStreak || 0} Day
              {streakData?.currentStreak === 1 ? '' : 's'} Active
            </span>
          </div>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="text-[8.5px] font-bold tracking-wider text-[#ffe49e]/70 uppercase sm:text-[9px]">
            HIGHEST
          </span>
          <span className="font-mono text-[11px] font-black text-[#38bdf8] sm:text-xs">
            🔥 {streakData?.highestStreak || 0} DAYS
          </span>
        </div>
      </div>

      {/* ── Game Statistics & Level XP ── */}
      <div className="flex flex-col gap-2 rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3 shadow-inner sm:p-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">{rank.icon}</span>
            <span className="text-[10px] font-black tracking-widest text-[#fcd34d] uppercase sm:text-[11px]">
              LEVEL{' '}
              {Math.floor((profile.highestScore * 3 + profile.gamesPlayed * 15) / 250) +
                1}{' '}
              • {rank.label}
            </span>
          </div>
          <span className="font-mono text-[9.5px] font-bold text-[#ffe49e]/80 sm:text-[10px]">
            {(profile.highestScore * 3 + profile.gamesPlayed * 15) % 250} / 250 XP
          </span>
        </div>

        {/* Level Progress Bar */}
        <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#4a2713] bg-[#2a1307] p-0.5 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(Math.round((((profile.highestScore * 3 + profile.gamesPlayed * 15) % 250) / 250) * 100), 100)}%`,
            }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-[#d97706] via-[#fcd34d] to-[#4ade80] shadow-[0_0_8px_rgba(252,211,77,0.7)]"
          />
        </div>

        {/* 3D Glossy Metric Cards Grid */}
        <div className="mt-0.5 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center justify-center rounded-xl border border-[#fcd34d]/40 bg-gradient-to-b from-[#fcd34d]/10 via-[#3a1d0d] to-[#2a1307] p-2 text-center shadow-sm">
            <span className="text-xs">🏆</span>
            <span className="font-mono text-xs leading-tight font-black text-[#fcd34d] sm:text-sm">
              {profile.highestScore.toLocaleString()}
            </span>
            <span className="text-[8px] font-black tracking-wider text-[#ffe49e]/70 uppercase sm:text-[8.5px]">
              BEST SCORE
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl border border-[#4ade80]/40 bg-gradient-to-b from-[#4ade80]/10 via-[#3a1d0d] to-[#2a1307] p-2 text-center shadow-sm">
            <span className="text-xs">⚡</span>
            <span className="font-mono text-xs leading-tight font-black text-[#4ade80] sm:text-sm">
              Round {profile.highestLevel > 0 ? profile.highestLevel : 1}
            </span>
            <span className="text-[8px] font-black tracking-wider text-[#ffe49e]/70 uppercase sm:text-[8.5px]">
              MAX ROUND
            </span>
          </div>

          <div className="flex flex-col items-center justify-center rounded-xl border border-[#38bdf8]/40 bg-gradient-to-b from-[#38bdf8]/10 via-[#3a1d0d] to-[#2a1307] p-2 text-center shadow-sm">
            <span className="text-xs">🎮</span>
            <span className="font-mono text-xs leading-tight font-black text-[#38bdf8] sm:text-sm">
              {profile.gamesPlayed} Runs
            </span>
            <span className="text-[8px] font-black tracking-wider text-[#ffe49e]/70 uppercase sm:text-[8.5px]">
              MATCHES
            </span>
          </div>
        </div>
      </div>

      {/* ── Ultra-Compact Trophy Vault Banner ── */}
      <Link
        to="/achievements"
        className="group flex items-center justify-between rounded-2xl border border-[#fcd34d]/60 bg-gradient-to-r from-[#78350f]/90 via-[#3a1d0d] to-[#78350f]/90 p-2.5 shadow-[0_0_12px_rgba(252,211,77,0.2)] transition-all hover:border-[#fcd34d] active:scale-98 sm:p-3"
      >
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-base shadow-inner sm:h-9 sm:w-9 sm:text-lg">
            🏆
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-black tracking-widest text-[#fcd34d] uppercase sm:text-[10px]">
              TROPHY VAULT
            </span>
            <span className="text-xs font-black text-[#fff3cd]">
              {achievements.filter((a) => a.unlockedAt).length} / {achievements.length}{' '}
              Badges Unlocked
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] font-black tracking-wider text-[#fcd34d] uppercase transition-transform group-hover:translate-x-0.5">
          <span>VIEW ALL</span>
          <span>→</span>
        </div>
      </Link>
    </div>
  )
}
