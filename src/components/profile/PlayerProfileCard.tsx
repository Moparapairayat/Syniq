import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AnimatedButton, CardSkeleton, useToast } from '@/components/ui'
import { playerService } from '@/services'
import type { PlayerProfile } from '@/models/Player'
import { AvatarDisplay, AVATARS, AVATAR_SETS } from '@/layouts/AppLayout'
import { cn } from '@/utils/classNames'

function getRankInfo(score: number): { label: string; cls: string; icon: string; next: number; color: string } {
  if (score < 50)  return { label: 'Novice',  cls: 'rank-novice',  icon: '🔰', next: 50,  color: '#9ca3af' }
  if (score < 150) return { label: 'Expert',  cls: 'rank-expert',  icon: '⚡', next: 150, color: '#4ade80' }
  if (score < 400) return { label: 'Master',  cls: 'rank-master',  icon: '💎', next: 400, color: '#c084fc' }
  return              { label: 'Legend',  cls: 'rank-legend',  icon: '👑', next: Infinity, color: '#fbbf24' }
}

/* Animated circular stat ring */
function StatRing({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = Math.min(value / Math.max(max, 1), 1)
  const r = 26; const circ = 2 * Math.PI * r

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative flex items-center justify-center">
        <svg width="64" height="64" className="-rotate-90">
          <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
          <motion.circle
            cx="32" cy="32" r={r} fill="none"
            stroke={color} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - circ * pct }}
            transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.4 }}
            style={{ filter: `drop-shadow(0 0 4px ${color})` }}
          />
        </svg>
        <span className="absolute font-game text-sm font-black text-white leading-none">{value}</span>
      </div>
      <span className="text-[9px] font-black tracking-widest text-white/30 uppercase">{label}</span>
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
      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}
      className={cn('avatar-pick-item', isActive && 'avatar-pick-item-active')}
      title={avatar.label}
    >
      <div style={{ width: '100%', paddingBottom: '100%', backgroundImage: `url(${src})`, backgroundSize: '200% 200%', backgroundPosition: avatar.pos }} />
      {isActive && (
        <div className="absolute inset-0 flex items-end justify-center pb-1 rounded-[14px]"
          style={{ background: 'linear-gradient(0deg, rgba(34,197,94,0.6) 0%, transparent 60%)' }}
        >
          <span className="text-[8px] font-black text-white">✓</span>
        </div>
      )}
    </motion.button>
  )
}

export function PlayerProfileCard() {
  const [profile, setProfile] = useState<PlayerProfile | null>(null)
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
        if (!active) return
        setProfile(data)
        setNameInput(data.name)
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
      showToast('Nickname updated! ✅')
    } catch { showToast('Failed to rename.') }
    finally { setIsSaving(false) }
  }

  const handleAvatarSelect = (id: number) => {
    setSelectedAvatarId(id)
    localStorage.setItem('syniq-avatar-id', String(id))
    setShowAvatarPicker(false)
    showToast('Avatar updated! 🎭')
  }

  if (isLoading) return <CardSkeleton />
  if (!profile) return <div className="text-sm text-red-400">Failed to load profile.</div>

  const rank = getRankInfo(profile.highestScore)
  const xpPct = rank.next === Infinity ? 100 : Math.round((profile.highestScore / rank.next) * 100)
  const avatar = AVATARS.find((a) => a.id === selectedAvatarId) ?? AVATARS[0]

  return (
    <div className="flex flex-col gap-3">

      {/* ── Profile Hero ── */}
      <div className="game-card p-5 flex flex-col items-center gap-3">
        {/* Background blur from avatar */}
        <div className="pointer-events-none absolute inset-0 rounded-[20px] overflow-hidden">
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${AVATAR_SETS[avatar.set]})`,
            backgroundSize: '200% 200%', backgroundPosition: avatar.pos,
            opacity: 0.08, filter: 'blur(12px)', transform: 'scale(1.1)',
          }} />
        </div>

        {/* Avatar + edit */}
        <div className="relative">
          <AvatarDisplay avatarId={selectedAvatarId} size={80} ringClass="avatar-ring-neon" />
          <motion.button
            whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
            onClick={() => setShowAvatarPicker((s) => !s)}
            className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full text-sm"
            style={{ background: '#22c55e', border: '2px solid #080f0b', boxShadow: '0 2px 0 #14532d' }}
          >
            ✏️
          </motion.button>
        </div>

        {/* Name + rank badge */}
        <div className="relative text-center">
          <h2 className="text-xl font-black text-white">{profile.name}</h2>
          <p className="text-[9px] text-white/30 mt-0.5">
            Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
          <div className={cn('mx-auto mt-2 inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-black', rank.cls)}>
            <span>{rank.icon}</span>
            <span>{rank.label}</span>
          </div>
        </div>

        {/* XP bar */}
        <div className="relative w-full">
          <div className="mb-1.5 flex justify-between text-[9px]">
            <span style={{ color: rank.color }}>{rank.icon} {rank.label}</span>
            <span className="text-white/30">{xpPct}% to next rank</span>
          </div>
          <div className="xp-bar-track">
            <div className="xp-bar-fill" style={{ '--xp-pct': `${xpPct}%` } as React.CSSProperties} />
          </div>
          <div className="mt-1 text-right text-[9px] text-white/20">{profile.highestScore} / {rank.next === Infinity ? '∞' : rank.next}</div>
        </div>
      </div>

      {/* ── Avatar Picker ── */}
      <AnimatePresence>
        {showAvatarPicker && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="game-card p-4">
              <p className="mb-3 text-center text-[10px] font-black tracking-widest text-[#22c55e] uppercase">
                Choose Avatar
              </p>
              <div className="grid grid-cols-4 gap-2">
                {AVATARS.map((av) => (
                  <AvatarPickItem key={av.id} avatarId={av.id} isActive={selectedAvatarId === av.id} onClick={() => handleAvatarSelect(av.id)} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Rename ── */}
      <div className="game-card p-4">
        <p className="mb-2 text-[10px] font-black tracking-widest text-[#22c55e] uppercase">Agent Nickname</p>
        <form className="flex gap-2" onSubmit={handleRename}>
          <input
            id="nickname-input"
            disabled={isSaving}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Enter nickname"
            value={nameInput}
            type="text"
            className="flex-grow rounded-xl px-4 py-2.5 text-sm font-bold text-white transition-all focus:outline-none"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '2px solid rgba(34,197,94,0.20)',
            }}
            onFocus={(e) => { e.target.style.borderColor = '#22c55e' }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(34,197,94,0.20)' }}
          />
          <button
            disabled={isSaving || nameInput.trim() === profile.name}
            type="submit"
            className="btn-game-primary shrink-0 rounded-xl px-5 py-2.5 text-xs"
            style={{ width: 'auto' }}
          >
            {isSaving ? '...' : 'Save'}
          </button>
        </form>
      </div>

      {/* ── Stat rings ── */}
      <div className="game-card p-4">
        <p className="mb-4 text-center text-[10px] font-black tracking-widest text-white/30 uppercase">Career Stats</p>
        <div className="flex justify-around">
          <StatRing value={profile.highestScore} max={Math.max(profile.highestScore, 100)} color="#fbbf24" label="Best" />
          <StatRing value={profile.highestLevel > 0 ? profile.highestLevel : 0} max={Math.max(profile.highestLevel, 20)} color="#a855f7" label="Level" />
          <StatRing value={profile.gamesPlayed} max={Math.max(profile.gamesPlayed, 50)} color="#22c55e" label="Games" />
        </div>
      </div>

      {/* ── Achievements row ── */}
      <div className="game-card p-4">
        <p className="mb-3 text-[10px] font-black tracking-widest text-white/30 uppercase">Achievements</p>
        <div className="flex gap-2">
          {[
            { icon: '🎯', label: 'Sharpshooter', done: profile.gamesPlayed >= 5 },
            { icon: '🔥', label: 'On Fire',       done: profile.highestScore >= 50 },
            { icon: '💎', label: 'Diamond',       done: profile.highestScore >= 200 },
            { icon: '👑', label: 'Legend',        done: profile.highestScore >= 400 },
          ].map((a) => (
            <div key={a.label} className="flex-1 flex flex-col items-center gap-1 rounded-xl p-2"
              style={{
                background: a.done ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1.5px solid ${a.done ? 'rgba(34,197,94,0.30)' : 'rgba(255,255,255,0.06)'}`,
                opacity: a.done ? 1 : 0.4,
              }}
            >
              <span className="text-xl" style={{ filter: a.done ? 'none' : 'grayscale(1)' }}>{a.icon}</span>
              <span className="text-[7px] font-black text-white/50 text-center leading-tight">{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
