import { useState, useEffect } from 'react'
import { TableSkeleton, EmptyState } from '@/components/ui'
import { leaderboardService, playerService } from '@/services'
import type { ScoreEntry } from '@/models/ScoreEntry'
import type { PlayerProfile } from '@/models/Player'
import { AvatarDisplay, AVATARS } from '@/components/avatar'

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
  {
    rank: 2,
    dataIdx: 1,
    height: 'h-20 sm:h-24',
    avatarSize: 42,
    medal: '🥈',
    title: 'SILVER',
    color: 'from-[#475569] to-[#1e293b]',
    border: 'border-[#94a3b8]',
  },
  {
    rank: 1,
    dataIdx: 0,
    height: 'h-24 sm:h-32',
    avatarSize: 54,
    medal: '👑',
    title: 'CHAMPION',
    color: 'from-[#d97706] to-[#78350f]',
    border: 'border-[#fcd34d]',
  },
  {
    rank: 3,
    dataIdx: 2,
    height: 'h-16 sm:h-20',
    avatarSize: 38,
    medal: '🥉',
    title: 'BRONZE',
    color: 'from-[#78350f] to-[#3a1d0d]',
    border: 'border-[#b45309]',
  },
] as const

export function TopTenTable() {
  const [timeframe, setTimeframe] = useState<Timeframe>('all')
  const [scores, setScores] = useState<ReadonlyArray<ScoreEntry>>([])
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  // BUG-16 fix: read localStorage once in a state initializer, not on every render
  const [myAvatarId] = useState(
    () => parseInt(localStorage.getItem('syniq-avatar-id') ?? '1', 10) || 1,
  )

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
    return () => {
      active = false
    }
  }, [])

  if (isLoading) return <TableSkeleton />

  // Deduplicate entries by playerName (Strict unique player rule)
  const uniqueScoresMap = new Map<string, ScoreEntry>()
  for (const s of scores) {
    const key = (s.playerName || '').trim().toLowerCase()
    const existing = uniqueScoresMap.get(key)
    if (!existing || s.score > existing.score) {
      uniqueScoresMap.set(key, s)
    }
  }
  const uniqueScores = Array.from(uniqueScoresMap.values()).sort(
    (a, b) => b.score - a.score,
  )

  if (uniqueScores.length === 0)
    return (
      <EmptyState
        description="No scores recorded yet. Play a game to rank up!"
        icon="🏆"
        title="Leaderboard Ready"
      />
    )

  // BUG-15 fix: use real date-based filtering instead of a fake slice(0, N)
  const now = new Date()
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startOfWeek = new Date(startOfToday)
  startOfWeek.setDate(startOfToday.getDate() - 6) // last 7 days

  const displayScores =
    timeframe === 'today'
      ? uniqueScores.filter((s) => new Date(s.timestamp) >= startOfToday)
      : timeframe === 'week'
        ? uniqueScores.filter((s) => new Date(s.timestamp) >= startOfWeek)
        : uniqueScores

  const top3 = [0, 1, 2].map(
    (i) => displayScores[i] ?? { playerName: `Player ${i + 1}`, score: 0, id: `ph-${i}` },
  )
  const rest = displayScores.slice(3)
  const userRank =
    uniqueScores.findIndex(
      (s) =>
        (s.playerName || '').trim().toLowerCase() ===
        (playerProfile?.name || '').trim().toLowerCase(),
    ) + 1

  return (
    <div className="flex w-full flex-col gap-2.5 select-none sm:gap-3">
      {/* ── Filter Timeframe Tabs ── */}
      <div className="flex rounded-xl border border-[#5a341a] bg-[#2a1307] p-1">
        <button
          onClick={() => setTimeframe('all')}
          className={`flex-1 cursor-pointer py-1 text-center text-[9.5px] font-black tracking-wide uppercase transition-all outline-none sm:py-1.5 sm:text-[11px] ${
            timeframe === 'all'
              ? 'rounded-lg bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-[#3a1d0d] shadow-sm'
              : 'text-[#ffe49e]/70 hover:text-[#ffe49e]'
          }`}
        >
          ALL TIME
        </button>
        <button
          onClick={() => setTimeframe('week')}
          className={`flex-1 cursor-pointer py-1 text-center text-[9.5px] font-black tracking-wide uppercase transition-all outline-none sm:py-1.5 sm:text-[11px] ${
            timeframe === 'week'
              ? 'rounded-lg bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-[#3a1d0d] shadow-sm'
              : 'text-[#ffe49e]/70 hover:text-[#ffe49e]'
          }`}
        >
          THIS WEEK
        </button>
        <button
          onClick={() => setTimeframe('today')}
          className={`flex-1 cursor-pointer py-1 text-center text-[9.5px] font-black tracking-wide uppercase transition-all outline-none sm:py-1.5 sm:text-[11px] ${
            timeframe === 'today'
              ? 'rounded-lg bg-gradient-to-b from-[#fcd34d] to-[#d97706] text-[#3a1d0d] shadow-sm'
              : 'text-[#ffe49e]/70 hover:text-[#ffe49e]'
          }`}
        >
          TODAY
        </button>
      </div>

      {/* ── Top 3 Podium Platform ── */}
      <div className="rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-2.5 shadow-inner sm:p-3.5">
        <div className="flex items-end justify-center gap-1.5 px-0.5 pt-0.5 sm:gap-2">
          {PODIUM_CONFIG.map((cfg) => {
            const entry = top3[cfg.dataIdx]
            const avatarId = getAvatarId(entry.playerName)
            return (
              <div key={cfg.rank} className="flex min-w-0 flex-1 flex-col items-center">
                {/* Crown / Medal Badge */}
                <div className="mb-0.5 flex h-5 items-center justify-center sm:mb-1 sm:h-6">
                  <span className="text-base select-none sm:text-lg">{cfg.medal}</span>
                </div>

                {/* Avatar Display */}
                <div className="relative">
                  <AvatarDisplay
                    avatarId={avatarId}
                    size={cfg.avatarSize}
                    ringClass={getRingClass(cfg.rank)}
                  />
                  <div
                    className="absolute -right-1 -bottom-1 flex h-4.5 w-4.5 items-center justify-center rounded-full border border-[#3a1d0d] text-[9px] font-black sm:h-5 sm:w-5 sm:text-[10px]"
                    style={{
                      background:
                        cfg.rank === 1
                          ? '#fcd34d'
                          : cfg.rank === 2
                            ? '#cbd5e1'
                            : '#d97706',
                      color: '#2a1307',
                    }}
                  >
                    #{cfg.rank}
                  </div>
                </div>

                {/* Name */}
                <p className="mt-1 max-w-[68px] truncate text-center text-[10.5px] font-black text-[#fff3cd] sm:mt-1.5 sm:max-w-[80px] sm:text-xs">
                  {entry.playerName}
                </p>

                {/* Score */}
                <div className="mt-0.5 inline-flex items-center gap-0.5 rounded-full border border-[#78431e] bg-[#2a1307] px-1.5 py-0.5 text-[8.5px] font-black text-[#ffe49e] sm:mt-1 sm:gap-1 sm:px-2 sm:text-[9px]">
                  <span className="text-[9px] sm:text-[10px]">⭐</span>
                  {entry.score.toLocaleString()}
                </div>

                {/* Podium Platform Pillar */}
                <div
                  className={`mt-1.5 flex w-full flex-col items-center justify-center rounded-t-xl border sm:mt-2 sm:rounded-t-2xl ${cfg.border} bg-gradient-to-b ${cfg.color} ${cfg.height}`}
                >
                  <span className="text-base font-black text-white/80 sm:text-xl">
                    {cfg.rank}
                  </span>
                  <span className="text-[7.5px] font-black tracking-widest text-white/90 sm:text-[8px]">
                    {cfg.title}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Rank 4+ Rows (Unique Players) ── */}
      {rest.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 shadow-inner">
          <div className="custom-scrollbar max-h-[180px] divide-y divide-[#78431e]/40 overflow-y-auto sm:max-h-[220px]">
            {rest.map((entry, i) => {
              const rank = i + 4
              const avatarId = getAvatarId(entry.playerName)
              return (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-2 transition-colors hover:bg-[#4a2713]/40 sm:p-2.5"
                >
                  <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <span className="w-4 text-center text-[10px] font-black text-[#ffe49e]/60 sm:w-5 sm:text-xs">
                      #{rank}
                    </span>
                    <AvatarDisplay
                      avatarId={avatarId}
                      size={28}
                      ringClass="avatar-ring-silver"
                    />
                    <div className="flex min-w-0 flex-col">
                      <p className="max-w-[110px] truncate text-[11px] font-black text-[#fff3cd] sm:max-w-[160px] sm:text-xs">
                        {entry.playerName}
                      </p>
                      <span className="text-[8px] font-bold tracking-wider text-[#ffe49e]/60 uppercase sm:text-[8.5px]">
                        PLAYER
                      </span>
                    </div>
                  </div>
                  <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#78431e] bg-[#2a1307] px-2 py-0.5 text-[9px] font-black text-[#ffe49e] sm:text-[10px]">
                    <span>⭐</span>
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
        <div className="flex items-center justify-between rounded-2xl border-2 border-[#fcd34d] bg-[#2a1307] px-2.5 py-2 shadow-md sm:px-3.5 sm:py-2.5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <span className="w-4 text-center text-[10px] font-black text-[#fcd34d] sm:w-5 sm:text-xs">
              {userRank > 0 ? `#${userRank}` : '—'}
            </span>
            <div className="relative shrink-0">
              <AvatarDisplay
                avatarId={myAvatarId}
                size={30}
                ringClass="avatar-ring-neon"
              />
              <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border border-[#2a1307] bg-emerald-400 sm:h-2.5 sm:w-2.5" />
            </div>
            <div className="flex min-w-0 flex-col">
              <p className="max-w-[100px] truncate text-[11px] font-black text-[#fff3cd] sm:max-w-[140px] sm:text-xs">
                {playerProfile.name}
              </p>
              <p className="text-[7.5px] font-black tracking-wider text-[#fcd34d] uppercase sm:text-[8.5px]">
                YOUR RANK • LIVE
              </p>
            </div>
          </div>
          <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#78431e] bg-[#3a1d0d] px-2 py-0.5 text-[10px] font-black text-[#fcd34d] sm:px-2.5 sm:py-1 sm:text-xs">
            <span>⭐</span>
            {playerProfile.highestScore.toLocaleString()}
          </div>
        </div>
      )}
    </div>
  )
}
