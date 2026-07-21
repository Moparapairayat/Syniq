import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { RoutePath } from '@/routes/routePaths'
import { playerService, leaderboardService } from '@/services'
import type { ScoreEntry } from '@/models/ScoreEntry'
import { AvatarDisplay } from '@/layouts/AppLayout'

export default function HomePage() {
  useDocumentTitle('Syniq - Memory Training')
  const navigate = useNavigate()

  const [playerName, setPlayerName] = useState('Player')
  const [avatarId, setAvatarId] = useState(1)
  const [highScore, setHighScore] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [highestLevel, setHighestLevel] = useState(1)
  const [topScore, setTopScore] = useState<ScoreEntry | null>(null)

  useEffect(() => {
    let active = true
    async function loadStats() {
      try {
        const [profile, topScores] = await Promise.all([
          playerService.getOrCreateProfile(),
          leaderboardService.getTopScores(),
        ])
        if (!active) return
        setPlayerName(profile.name)
        setHighScore(profile.highestScore)
        setGamesPlayed(profile.totalGamesPlayed)
        setHighestLevel(profile.highestLevel || 1)
        const storedAvatar = localStorage.getItem('syniq-avatar-id')
        if (storedAvatar) setAvatarId(parseInt(storedAvatar, 10))

        if (topScores.length > 0) {
          setTopScore(topScores[0])
        }
      } catch (e) {
        console.error(e)
      }
    }
    loadStats()
    return () => { active = false }
  }, [])

  return (
    <div className="flex flex-col gap-4 pb-4 select-none">

      {/* ── 1. WARM PERSONAL GREETING BANNER ── */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-800 dark:to-slate-900 border border-slate-700/60 p-4 text-white shadow-md"
      >
        <div className="flex items-center gap-3">
          <AvatarDisplay avatarId={avatarId} size={42} ringClass="avatar-ring-neon" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Welcome back</span>
            <h2 className="text-base font-bold text-white">{playerName} 👋</h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-300">
          <span>🔥</span>
          <span>3 Day Streak</span>
        </div>
      </motion.div>

      {/* ── 2. HERO GAME START CARD ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="cyber-card p-6 flex flex-col items-center text-center"
      >
        <div className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 px-3 py-1 text-[11px] font-bold text-[#38bdf8] mb-3">
          <span className="h-1.5 w-1.5 rounded-full bg-[#38bdf8] animate-pulse" />
          Classic Simon Game
        </div>

        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Memory Challenge
        </h1>
        <p className="text-xs text-slate-300 dark:text-slate-400 mt-1 max-w-[290px] leading-relaxed">
          Listen to the sound tones, remember the light pattern sequence, and test your memory limit!
        </p>

        {/* Large Play Button */}
        <div className="my-5">
          <button
            onClick={() => navigate(RoutePath.game)}
            type="button"
            className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-[#38bdf8] text-[#0f172a] shadow-lg cursor-pointer transition-all duration-200 hover:scale-105 hover:bg-[#7dd3fc] active:scale-95 outline-none"
          >
            <span className="text-2xl font-black ml-1">▶</span>
            <span className="text-[10px] font-extrabold tracking-wider uppercase mt-0.5">
              PLAY GAME
            </span>
          </button>
        </div>

        {/* High Score Footer */}
        <div className="flex items-center gap-2 rounded-xl bg-slate-800/50 dark:bg-slate-800/50 border border-slate-700/40 px-3.5 py-1.5 text-xs">
          <span className="text-slate-400">Best Score:</span>
          <span className="font-bold text-amber-300">⭐ {highScore.toLocaleString()} PTS</span>
        </div>
      </motion.div>

      {/* ── 3. CAREER STATS GRID ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-2.5"
      >
        <div className="cyber-card p-3.5 flex flex-col items-center text-center">
          <span className="text-xl mb-1">🎮</span>
          <span className="text-lg font-bold text-white">{gamesPlayed}</span>
          <span className="text-[10px] text-slate-400 font-semibold">Played</span>
        </div>

        <div className="cyber-card p-3.5 flex flex-col items-center text-center">
          <span className="text-xl mb-1">⭐</span>
          <span className="text-lg font-bold text-[#38bdf8]">{highScore.toLocaleString()}</span>
          <span className="text-[10px] text-slate-400 font-semibold">Best Score</span>
        </div>

        <div className="cyber-card p-3.5 flex flex-col items-center text-center">
          <span className="text-xl mb-1">⚡</span>
          <span className="text-lg font-bold text-purple-300">Level {highestLevel}</span>
          <span className="text-[10px] text-slate-400 font-semibold">Max Level</span>
        </div>
      </motion.div>

      {/* ── 4. LEADERBOARD TOP PLAYER PREVIEW ── */}
      {topScore && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          onClick={() => navigate(RoutePath.leaderboard)}
          className="cyber-card p-4 flex items-center justify-between cursor-pointer hover:border-slate-500 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-xl">
              👑
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Current Leader</span>
              <p className="text-sm font-bold text-white">{topScore.playerName}</p>
            </div>
          </div>
          <div className="coin-badge">
            <div className="coin-icon text-[8px]">⭐</div>
            <span>{topScore.score.toLocaleString()}</span>
          </div>
        </motion.div>
      )}
    </div>
  )
}
