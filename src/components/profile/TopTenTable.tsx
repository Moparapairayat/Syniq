import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TableSkeleton, EmptyState } from '@/components/ui'
import { leaderboardService, playerService } from '@/services'
import type { ScoreEntry } from '@/models/ScoreEntry'
import type { PlayerProfile } from '@/models/Player'
import { AvatarDisplay, AVATARS } from '@/layouts/AppLayout'

const getAvatarId = (name: string): number => {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return (Math.abs(hash) % AVATARS.length) + 1
}

/* Reference-style avatar ring colors per rank */
const RING_MAP: Record<number, string> = {
  1: 'avatar-ring-gold',
  2: 'avatar-ring-purple',
  3: 'avatar-ring-yellow',
}
const getRingClass = (rank: number) => RING_MAP[rank] ?? 'avatar-ring-silver'

/* Podium config — green 3D platforms like reference */
const PODIUM = [
  { rank: 2, dataIdx: 1, height: 'h-14', labelSize: 'text-3xl', avatarSize: 44, medal: '🥈' },
  { rank: 1, dataIdx: 0, height: 'h-20', labelSize: 'text-4xl', avatarSize: 58, medal: '🥇' },
  { rank: 3, dataIdx: 2, height: 'h-10', labelSize: 'text-2xl', avatarSize: 38, medal: '🥉' },
] as const

export function TopTenTable() {
  const [scores, setScores] = useState<ReadonlyArray<ScoreEntry>>([])
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function load() {
      try {
        const [scoreData, profileData] = await Promise.all([
          leaderboardService.getTopScores(),
          playerService.getOrCreateProfile(),
        ])
        if (!active) return
        setScores(scoreData)
        setPlayerProfile(profileData)
      } catch (e) {
        console.error(e)
      } finally {
        if (active) setIsLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [])

  if (isLoading) return <TableSkeleton />
  if (scores.length === 0) return <EmptyState description="No scores yet. Play a game first!" icon="🏆" title="Empty Leaderboard" />

  const top3 = [0, 1, 2].map((i) => scores[i] ?? { playerName: `Player ${i + 1}`, score: 0, id: `ph-${i}` })
  const rest = scores.slice(3)
  const userRank = scores.findIndex((s) => s.playerName === playerProfile?.name) + 1

  return (
    <div className="flex flex-col gap-3">

      {/* ── 3D Podium — exactly like reference ── */}
      <div className="game-card p-4 overflow-hidden">
        {/* Sunray background behind podium */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-8">
          <div className="h-64 w-64 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0deg, rgba(34,197,94,0.06) 20deg, transparent 40deg, rgba(34,197,94,0.06) 60deg, transparent 80deg, rgba(34,197,94,0.06) 100deg, transparent 120deg, rgba(34,197,94,0.06) 140deg, transparent 160deg, rgba(34,197,94,0.06) 180deg, transparent 200deg, rgba(34,197,94,0.06) 220deg, transparent 240deg, rgba(34,197,94,0.06) 260deg, transparent 280deg, rgba(34,197,94,0.06) 300deg, transparent 320deg, rgba(34,197,94,0.06) 340deg, transparent 360deg)',
            }}
          />
        </div>

        <div className="relative z-10 flex items-end justify-center gap-2 px-2 pb-1">
          {PODIUM.map((cfg, dIdx) => {
            const entry = top3[cfg.dataIdx]
            const avatarId = getAvatarId(entry.playerName)
            return (
              <motion.div
                key={cfg.rank}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: dIdx * 0.12, type: 'spring', stiffness: 280, damping: 22 }}
                className="flex flex-1 flex-col items-center"
              >
                {/* Medal */}
                <motion.span
                  animate={{ y: [0, -4, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5 + dIdx * 0.5, ease: 'easeInOut' }}
                  className="text-xl mb-1 select-none"
                  style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.40))' }}
                >
                  {cfg.medal}
                </motion.span>

                {/* Avatar */}
                <div className="relative">
                  <AvatarDisplay avatarId={avatarId} size={cfg.avatarSize} ringClass={getRingClass(cfg.rank)} />
                  {cfg.rank === 1 && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-lg select-none">👑</span>
                  )}
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-black"
                    style={{
                      background: cfg.rank === 1 ? '#fbbf24' : cfg.rank === 2 ? '#a855f7' : '#cd7f32',
                      border: '2px solid #080f0b',
                      color: '#080f0b',
                    }}
                  >
                    {cfg.rank}
                  </div>
                </div>

                {/* Name */}
                <p className="mt-2 max-w-[72px] truncate text-center text-[10px] font-black text-white">
                  {entry.playerName}
                </p>

                {/* Coin score */}
                <div className="coin-badge mt-1 text-[9px]">
                  <div className="coin-icon text-[8px]">⭐</div>
                  {entry.score.toLocaleString()}
                </div>

                {/* 3D Green platform */}
                <div className={`mt-2 w-full flex items-center justify-center rounded-t-xl ${cfg.height}`}
                  style={{
                    background: cfg.rank === 1
                      ? 'linear-gradient(180deg, #22c55e 0%, #16a34a 100%)'
                      : cfg.rank === 2
                        ? 'linear-gradient(180deg, #16a34a 0%, #15803d 100%)'
                        : 'linear-gradient(180deg, #15803d 0%, #166534 100%)',
                    border: '2px solid #14532d',
                    boxShadow: `0 5px 0 #14532d, 0 8px 16px rgba(0,0,0,0.40), inset 0 2px 0 rgba(255,255,255,0.15)`,
                  }}
                >
                  <span className={`font-game ${cfg.labelSize} font-black text-white/20 select-none`}>{cfg.rank}</span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Rank 4+ rows — exactly like reference ── */}
      {rest.length > 0 && (
        <div className="game-card overflow-hidden">
          <div className="max-h-[240px] overflow-y-auto scrollbar-none">
            {rest.map((entry, i) => {
              const rank = i + 4
              const avatarId = getAvatarId(entry.playerName)
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className="lb-row"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-black text-white/30">{rank}</span>
                    <AvatarDisplay avatarId={avatarId} size={36} ringClass="avatar-ring-silver" />
                    <div>
                      <p className="text-xs font-bold text-white">{entry.playerName}</p>
                      <p className="text-[9px] text-white/30">@{entry.playerName.toLowerCase().replace(' ', '_')}</p>
                    </div>
                  </div>
                  <div className="coin-badge">
                    <div className="coin-icon text-[8px]">⭐</div>
                    {entry.score.toLocaleString()}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── You row ── */}
      {playerProfile && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lb-row rounded-2xl"
          style={{
            background: 'rgba(34,197,94,0.10)',
            border: '1.5px solid rgba(34,197,94,0.25)',
            boxShadow: '0 0 20px rgba(34,197,94,0.10)',
          }}
        >
          <div className="flex items-center gap-3">
            <span className="w-6 text-center text-sm font-black text-[#22c55e]">{userRank || '—'}</span>
            <div className="relative">
              <AvatarDisplay
                avatarId={parseInt(localStorage.getItem('syniq-avatar-id') ?? '1', 10) || 1}
                size={38}
                ringClass="avatar-ring-neon"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#080f0b] bg-emerald-400 shadow-[0_0_6px_#4ade80]" />
            </div>
            <div>
              <p className="text-xs font-black text-white">{playerProfile.name}</p>
              <p className="text-[9px] font-bold text-[#22c55e]">You • Live</p>
            </div>
          </div>
          <div className="coin-badge">
            <div className="coin-icon text-[8px]">⭐</div>
            {playerProfile.highestScore.toLocaleString()}
          </div>
        </motion.div>
      )}
    </div>
  )
}
