import { useState, useEffect } from 'react'
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

const RING_MAP: Record<number, string> = {
  1: 'avatar-ring-gold',
  2: 'avatar-ring-silver',
  3: 'avatar-ring-yellow',
}
const getRingClass = (rank: number) => RING_MAP[rank] ?? 'avatar-ring-silver'

type Timeframe = 'all' | 'week' | 'today'

const PODIUM_CONFIG = [
  { rank: 2, dataIdx: 1, height: 'h-24', avatarSize: 48, medal: '🥈', title: 'SILVER', color: 'from-slate-600 to-slate-800 dark:from-slate-700 dark:to-slate-900', border: 'border-slate-400 dark:border-slate-600' },
  { rank: 1, dataIdx: 0, height: 'h-32', avatarSize: 62, medal: '👑', title: 'CHAMPION', color: 'from-amber-400 to-amber-600 dark:from-amber-500 dark:to-amber-700', border: 'border-amber-400 dark:border-amber-500' },
  { rank: 3, dataIdx: 2, height: 'h-20', avatarSize: 44, medal: '🥉', title: 'BRONZE', color: 'from-amber-700 to-amber-900 dark:from-amber-800 dark:to-amber-950', border: 'border-amber-700 dark:border-amber-800' },
] as const

export function TopTenTable() {
  const [timeframe, setTimeframe] = useState<Timeframe>('all')
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

  // Deduplicate entries by playerName (Strict unique player rule)
  const uniqueScoresMap = new Map<string, ScoreEntry>()
  for (const s of scores) {
    const existing = uniqueScoresMap.get(s.playerName)
    if (!existing || s.score > existing.score) {
      uniqueScoresMap.set(s.playerName, s)
    }
  }
  const uniqueScores = Array.from(uniqueScoresMap.values()).sort((a, b) => b.score - a.score)

  if (uniqueScores.length === 0) return <EmptyState description="No scores recorded yet. Play a game to rank up!" icon="🏆" title="Leaderboard Ready" />

  // Filter for tabs UX
  const displayScores = timeframe === 'today'
    ? uniqueScores.slice(0, 5)
    : timeframe === 'week'
      ? uniqueScores.slice(0, 8)
      : uniqueScores

  const top3 = [0, 1, 2].map((i) => displayScores[i] ?? { playerName: `Player ${i + 1}`, score: 0, id: `ph-${i}` })
  const rest = displayScores.slice(3)
  const userRank = uniqueScores.findIndex((s) => s.playerName === playerProfile?.name) + 1

  return (
    <div className="forest-leaderboard-stack flex flex-col gap-3.5 select-none">

      {/* ── Filter Timeframe Tabs ── */}
      <div className="forest-score-tabs flex items-center justify-between rounded-xl bg-slate-100 dark:bg-[#1e293b] p-1 border border-slate-300 dark:border-[#334155]">
        <button
          onClick={() => setTimeframe('all')}
          className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            timeframe === 'all'
              ? 'bg-[#38bdf8] text-[#0f172a] shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          ALL TIME
        </button>
        <button
          onClick={() => setTimeframe('week')}
          className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            timeframe === 'week'
              ? 'bg-[#38bdf8] text-[#0f172a] shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          THIS WEEK
        </button>
        <button
          onClick={() => setTimeframe('today')}
          className={`flex-1 py-1.5 text-center text-xs font-bold rounded-lg transition-colors cursor-pointer ${
            timeframe === 'today'
              ? 'bg-[#38bdf8] text-[#0f172a] shadow-sm'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          TODAY
        </button>
      </div>

      {/* ── Top 3 Podium Platform ── */}
      <div className="cyber-card forest-podium-card p-4">
        <div className="flex items-end justify-center gap-2 px-1 pt-2">
          {PODIUM_CONFIG.map((cfg) => {
            const entry = top3[cfg.dataIdx]
            const avatarId = getAvatarId(entry.playerName)
            return (
              <div
                key={cfg.rank}
                className="flex flex-1 flex-col items-center"
              >
                {/* Crown / Medal Badge */}
                <div className="flex items-center justify-center h-7 mb-1">
                  <span className="text-xl select-none">{cfg.medal}</span>
                </div>

                {/* Avatar Display */}
                <div className="relative">
                  <AvatarDisplay avatarId={avatarId} size={cfg.avatarSize} ringClass={getRingClass(cfg.rank)} />
                  <div
                    className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold"
                    style={{
                      background: cfg.rank === 1 ? '#fbbf24' : cfg.rank === 2 ? '#94a3b8' : '#d97706',
                      color: '#0f172a',
                    }}
                  >
                    #{cfg.rank}
                  </div>
                </div>

                {/* Name */}
                <p className="mt-2 max-w-[80px] truncate text-center text-xs font-bold">
                  {entry.playerName}
                </p>

                {/* Score */}
                <div className="coin-badge mt-1 text-[9px]">
                  <div className="coin-icon text-[8px]">⭐</div>
                  {entry.score.toLocaleString()}
                </div>

                {/* Podium Platform Pillar */}
                <div className={`mt-2.5 w-full flex flex-col items-center justify-center rounded-t-2xl border ${cfg.border} bg-gradient-to-b ${cfg.color} ${cfg.height}`}
                >
                  <span className="text-2xl font-black text-white/50">{cfg.rank}</span>
                  <span className="text-[8px] font-bold text-white/70 tracking-widest">{cfg.title}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Rank 4+ Rows (Unique Players) ── */}
      {rest.length > 0 && (
        <div className="cyber-card forest-rank-list overflow-hidden">
          <div className="divide-y divide-slate-200 dark:divide-[#334155] max-h-[260px] overflow-y-auto scrollbar-none">
            {rest.map((entry, i) => {
              const rank = i + 4
              const avatarId = getAvatarId(entry.playerName)
              return (
                <div
                  key={entry.id}
                  className="lb-row"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 text-center text-xs font-bold text-slate-400">#{rank}</span>
                    <AvatarDisplay avatarId={avatarId} size={34} ringClass="avatar-ring-silver" />
                    <div className="flex flex-col">
                      <p className="text-xs font-bold">{entry.playerName}</p>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">PLAYER</span>
                    </div>
                  </div>
                  <div className="coin-badge">
                    <div className="coin-icon text-[8px]">⭐</div>
                    {entry.score.toLocaleString()}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Current Player Rank Row ── */}
      {playerProfile && (
        <div className="forest-player-rank flex items-center justify-between rounded-2xl border border-[#38bdf8] bg-[#38bdf8]/15 dark:bg-[#38bdf8]/15 px-4 py-3 shadow-md">
          <div className="flex items-center gap-3">
            <span className="w-6 text-center text-sm font-black text-[#38bdf8]">
              {userRank > 0 ? `#${userRank}` : '—'}
            </span>
            <div className="relative">
              <AvatarDisplay
                avatarId={parseInt(localStorage.getItem('syniq-avatar-id') ?? '1', 10) || 1}
                size={36}
                ringClass="avatar-ring-neon"
              />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#0f172a] bg-emerald-400" />
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-bold">{playerProfile.name}</p>
              <p className="text-[9px] font-bold text-[#38bdf8] uppercase tracking-wider">YOUR RANK • LIVE</p>
            </div>
          </div>
          <div className="coin-badge">
            <div className="coin-icon text-[8px]">⭐</div>
            {playerProfile.highestScore.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}
