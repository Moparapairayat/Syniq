import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { RoutePath } from '@/routes/routePaths'
import { GameMode } from '@/core/game/GameMode'
import { playerService } from '@/services'
import { AvatarDisplay } from '@/layouts/AppLayout'

function getRankInfo(score: number): { label: string; icon: string; color: string } {
  if (score === 0) return { label: 'Novice', icon: '🔰', color: '#9ca3af' }
  if (score < 50)  return { label: 'Expert', icon: '⚡', color: '#4ade80' }
  if (score < 200) return { label: 'Master', icon: '💎', color: '#c084fc' }
  return              { label: 'Legend', icon: '👑', color: '#fbbf24' }
}

const AVATAR_RING_COLORS = ['avatar-ring-red', 'avatar-ring-purple', 'avatar-ring-yellow', 'avatar-ring-neon']

export default function HomePage() {
  useDocumentTitle('Syniq — Home')
  const navigate = useNavigate()
  const [playerName, setPlayerName] = useState('Player')
  const [highScore, setHighScore] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)
  const [avatarId, setAvatarId] = useState(1)

  useEffect(() => {
    playerService.getOrCreateProfile().then((p) => {
      setPlayerName(p.name)
      setHighScore(p.highestScore)
      setGamesPlayed(p.gamesPlayed)
      const stored = localStorage.getItem('syniq-avatar-id')
      if (stored) setAvatarId(parseInt(stored, 10))
    }).catch(() => {})
  }, [])

  const rank = getRankInfo(highScore)

  return (
    <div className="flex flex-col gap-3 pb-2">

      {/* ── Player Profile Card ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-card game-card-glow p-4"
      >
        {/* Avatar + name + edit */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <AvatarDisplay avatarId={avatarId} size={54} ringClass="avatar-ring-red" />
            <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#080f0b] bg-emerald-400 shadow-[0_0_8px_#4ade80]" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-black text-white truncate">{playerName}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[10px] font-bold" style={{ color: rank.color }}>
                {rank.icon} {rank.label}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-[10px] text-white/40">{gamesPlayed} games</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/profile')}
            className="rounded-xl px-3 py-1.5 text-[10px] font-black tracking-wider uppercase text-white/70 border border-white/10 hover:border-white/20 transition"
          >
            Edit Profile
          </button>
        </div>

        {/* Score row */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 rounded-xl p-3 flex items-center justify-between"
            style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}
          >
            <div>
              <p className="text-[9px] font-black tracking-widest text-white/30 uppercase">Best Score</p>
              <p className="font-game neon-gold text-xl font-black leading-tight">{highScore.toLocaleString()}</p>
            </div>
            <div className="coin-icon text-base">⭐</div>
          </div>
          <div className="flex-1 rounded-xl p-3 flex items-center justify-between"
            style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}
          >
            <div>
              <p className="text-[9px] font-black tracking-widest text-white/30 uppercase">Games</p>
              <p className="font-game text-xl font-black leading-tight text-white">{gamesPlayed}</p>
            </div>
            <span className="text-lg">🎮</span>
          </div>
        </div>
      </motion.div>

      {/* ── Play Button ── */}
      <motion.button
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        onClick={() => navigate(RoutePath.game, { state: { mode: GameMode.Classic } })}
        type="button"
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.97, y: 3 }}
        className="btn-game-primary py-5 text-base"
      >
        🎮 Play Now →
      </motion.button>

      {/* ── Quick Stats Summary ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="game-card p-4 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <div>
            <p className="text-xs font-black text-white">Memory Challenge</p>
            <p className="text-[10px] text-white/40">Standard Simon pattern sequence</p>
          </div>
        </div>
        <span className="rounded-full px-2.5 py-1 text-[9px] font-black text-[#22c55e] bg-emerald-500/10 border border-emerald-500/20">
          Ready
        </span>
      </motion.div>

      {/* ── Friends online ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="game-card p-4 flex items-center gap-3"
      >
        <div className="flex -space-x-2">
          {[1, 2, 3].map((id) => (
            <AvatarDisplay key={id} avatarId={id} size={32} ringClass={AVATAR_RING_COLORS[id % 4]} />
          ))}
        </div>
        <div className="flex-1">
          <p className="text-xs font-black text-white">3 Players Online</p>
          <p className="text-[10px] text-white/40">Challenge them now!</p>
        </div>
        <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" style={{ boxShadow: '0 0 8px #4ade80' }} />
      </motion.div>

    </div>
  )
}
