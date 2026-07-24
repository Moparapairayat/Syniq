import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CardSkeleton, useToast } from '@/components/ui'
import { playerService, achievementService, dailyStreakService } from '@/services'
import type { PlayerProfile } from '@/models/Player'
import type { Achievement } from '@/models/Achievement'
import type { DailyStreakData } from '@/services'
import { AvatarDisplay, AVATARS, AVATAR_SETS } from '@/components/avatar'
import { cn } from '@/utils/classNames'
import { FEATURES } from '@/config/features'

function getRankInfo(score: number): { label: string; cls: string; icon: string; next: number; color: string } {
  if (score < 50)  return { label: 'Novice',  cls: 'rank-novice',  icon: '🔰', next: 50,  color: '#9ca3af' }
  if (score < 150) return { label: 'Expert',  cls: 'rank-expert',  icon: '⚡', next: 150, color: '#38bdf8' }
  if (score < 400) return { label: 'Master',  cls: 'rank-master',  icon: '💎', next: 400, color: '#c084fc' }
  return              { label: 'Legend',  cls: 'rank-legend',  icon: '👑', next: Infinity, color: '#fbbf24' }
}

/* Animated circular stat ring */
function StatRing({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = Math.min(value / Math.max(max, 1), 1)
  const r = 24; const circ = 2 * Math.PI * r

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center">
        <svg width="60" height="60" className="-rotate-90">
          <circle cx="30" cy="30" r={r} fill="none" stroke="#2a1307" strokeWidth="5" />
          <motion.circle
            cx="30" cy="30" r={r} fill="none"
            stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - circ * pct }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.2 }}
          />
        </svg>
        <span className="absolute font-mono text-sm font-black text-[#fff3cd] leading-none">{value}</span>
      </div>
      <span className="text-[9.5px] font-black tracking-wider text-[#ffe49e] uppercase">{label}</span>
    </div>
  )
}

/* Avatar picker grid item */
function AvatarPickItem({ avatarId, isActive, onClick }: { avatarId: number; isActive: boolean; onClick: () => void }) {
  const avatar = AVATARS.find((a) => a.id === avatarId)!
  const src = AVATAR_SETS[avatar.set]
  return (
    <motion.button
      type="button" onClick={onClick}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border-2 transition-all p-1 cursor-pointer',
        isActive ? 'border-[#fcd34d] bg-[#fcd34d]/20' : 'border-[#78431e] bg-[#2a1307] hover:border-[#fcd34d]',
      )}
      title={avatar.label}
    >
      <div className="rounded-xl overflow-hidden" style={{ width: '100%', paddingBottom: '100%', backgroundImage: `url(${src})`, backgroundSize: '200% 200%', backgroundPosition: avatar.pos }} />
      {isActive && (
        <div className="absolute inset-0 flex items-end justify-center pb-1 bg-gradient-to-t from-[#d97706]/80 to-transparent">
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
      } catch (e) { console.error(e) }
      finally { if (active) setIsLoading(false) }
    }
    load()
    return () => { active = false }
  }, [])

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameInput.trim() || isSaving) return
    try {
      setIsSaving(true)
      const updated = await playerService.renamePlayer(nameInput)
      setProfile(updated)
      showToast('Name updated successfully! ✨')
    } catch { showToast('Failed to update name.') }
    finally { setIsSaving(false) }
  }

  const handleAvatarSelect = (id: number) => {
    setSelectedAvatarId(id)
    localStorage.setItem('syniq-avatar-id', String(id))
    setShowAvatarPicker(false)
    showToast('Avatar updated! 🎭')
  }

  if (isLoading) return <CardSkeleton />
  if (!profile) return <div className="text-xs text-rose-400">Failed to load profile.</div>

  const rank = getRankInfo(profile.highestScore)
  const xpPct = rank.next === Infinity ? 100 : Math.round((profile.highestScore / rank.next) * 100)

  return (
    <div className="flex flex-col gap-3.5 select-none">

      {/* ── Profile Hero Card ── */}
      <div className="rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-4 flex flex-col items-center gap-2.5 text-center shadow-inner">

        {/* Avatar + edit badge */}
        <div className="relative mt-0.5">
          <AvatarDisplay avatarId={selectedAvatarId} size={82} ringClass="avatar-ring-neon" />
          <button
            type="button"
            onClick={() => setShowAvatarPicker((s) => !s)}
            className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-[#3a1d0d] border border-[#78350f] text-xs shadow-md cursor-pointer hover:scale-105 transition-transform"
          >
            ✏️
          </button>
        </div>

        {/* Name + rank badge */}
        <div className="relative text-center">
          <h2 className="text-xl font-black text-[#fff3cd] leading-tight">{profile.name}</h2>
          <p className="text-[9.5px] font-bold text-[#ffe49e]/60 tracking-widest uppercase mt-0.5">
            MEMBER SINCE {new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
          </p>
          <div className="mx-auto mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-[#78431e] bg-[#2a1307] px-3.5 py-1 text-xs font-black text-[#ffe49e]">
            <span>{rank.icon}</span>
            <span>{rank.label}</span>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="relative w-full mt-1">
          <div className="mb-1 flex justify-between text-[10px] font-black uppercase tracking-wider">
            <span style={{ color: rank.color }}>{rank.icon} {rank.label}</span>
            <span className="text-[#fcd34d]">{xpPct}% TO NEXT RANK</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full border border-[#4a2713] bg-[#2a1307] p-0.5">
            <div className="h-full rounded-full bg-gradient-to-r from-[#e29741] via-[#fcd34d] to-[#c97020] transition-all duration-300" style={{ width: `${xpPct}%` }} />
          </div>
        </div>
      </div>

      {/* ── Avatar Picker Panel ── */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3.5 shadow-inner">
              <p className="mb-2 text-center text-[10px] font-black tracking-widest text-[#ffe49e] uppercase">
                Choose Avatar
              </p>
              <div className="grid grid-cols-4 gap-2.5">
                {AVATARS.map((av) => (
                  <AvatarPickItem key={av.id} avatarId={av.id} isActive={selectedAvatarId === av.id} onClick={() => handleAvatarSelect(av.id)} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Rename Form Card ── */}
      <div className="rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3.5 shadow-inner">
        <p className="mb-1.5 text-[10px] font-black tracking-widest text-[#ffe49e] uppercase">Player Nickname</p>
        <form className="flex gap-2" onSubmit={handleRename}>
          <input
            id="nickname-input"
            disabled={isSaving}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter player name"
            value={nameInput}
            type="text"
            className="flex-grow rounded-xl px-3.5 py-2 text-xs font-bold border border-[#78431e] bg-[#2a1307] text-[#fff3cd] outline-none focus:border-[#fcd34d]"
          />
          <button
            disabled={isSaving || nameInput.trim() === profile.name}
            type="submit"
            className="shrink-0 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wider bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-[#3a1d0d] shadow-sm disabled:opacity-50 cursor-pointer"
            style={{ width: 'auto' }}
          >
            {isSaving ? '...' : 'SAVE'}
          </button>
        </form>
      </div>

      {/* ── Daily Play Streak Mission Card ── */}
      {FEATURES.SHOW_DAILY_CHALLENGE && (
        <div className="rounded-2xl border border-[#fcd34d]/60 bg-gradient-to-r from-[#78350f]/80 via-[#3a1d0d]/90 to-[#78350f]/80 p-3 flex items-center justify-between shadow-[0_0_12px_rgba(252,211,77,0.2)]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-xl shadow-inner">
              🔥
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#fcd34d]">
                DAILY PLAY STREAK
              </span>
              <span className="text-sm font-black text-[#fff3cd]">
                {streakData?.currentStreak || 0} Day{streakData?.currentStreak === 1 ? '' : 's'} Active
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="text-[9px] font-bold text-[#ffe49e]/70 uppercase tracking-wider">HIGHEST</span>
            <span className="font-mono text-xs font-black text-[#38bdf8]">
              🔥 {streakData?.highestStreak || 0} DAYS
            </span>
          </div>
        </div>
      )}

      {/* ── Stat Rings ── */}
      <div className="rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3.5 shadow-inner">
        <p className="mb-2 text-center text-[10px] font-black tracking-widest text-[#ffe49e] uppercase">Game Statistics</p>
        <div className="flex justify-around">
          <StatRing value={profile.highestScore} max={Math.max(profile.highestScore, 100)} color="#f59e0b" label="BEST SCORE" />
          <StatRing value={profile.highestLevel > 0 ? profile.highestLevel : 0} max={Math.max(profile.highestLevel, 20)} color="#a855f7" label="LEVEL" />
          <StatRing value={profile.gamesPlayed} max={Math.max(profile.gamesPlayed, 50)} color="#38bdf8" label="MATCHES" />
        </div>
      </div>

      {/* ── Achievements Badges Section ── */}
      {FEATURES.SHOW_BADGE_SYSTEM && (
        <div className="rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-3.5 shadow-inner">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-black tracking-widest text-[#ffe49e] uppercase">
              🏆 Achievement Badges
            </p>
            <span className="font-mono text-[10px] font-black text-[#fcd34d]">
              {achievements.filter((a) => a.unlockedAt).length}/{achievements.length} UNLOCKED
            </span>
          </div>

          {/* Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {achievements.slice(0, 8).map((a) => {
              const isUnlocked = Boolean(a.unlockedAt)
              return (
                <div
                  key={a.id}
                  title={`${a.title}: ${a.description}`}
                  className="group relative flex flex-col items-center gap-0.5 rounded-xl p-2 border transition-all cursor-default text-center"
                  style={{
                    background: isUnlocked ? 'rgba(252,211,77,0.14)' : 'rgba(42,19,7,0.5)',
                    borderColor: isUnlocked ? '#fcd34d' : 'rgba(120,67,30,0.4)',
                    opacity: isUnlocked ? 1 : 0.55,
                  }}
                >
                  <span className="text-xl" style={{ filter: isUnlocked ? 'none' : 'grayscale(1)' }}>
                    {a.icon}
                  </span>
                  <span className="text-[9.5px] font-black text-[#fff3cd] leading-tight truncate w-full">
                    {a.title}
                  </span>
                  <span className="text-[8px] font-medium text-[#ffe49e]/70 leading-none line-clamp-1">
                    {a.description}
                  </span>
                  {isUnlocked ? (
                    <span className="mt-0.5 text-[7.5px] font-black text-[#fcd34d] uppercase tracking-wider">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="mt-0.5 text-[7.5px] font-bold text-[#ffe49e]/40 uppercase tracking-wider">
                      LOCKED 🔒
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
