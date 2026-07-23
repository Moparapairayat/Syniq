import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { TopTenTable } from '@/components/profile'

export default function LeaderboardPage() {
  useDocumentTitle('Leaderboard')
  const navigate = useNavigate()
  return (
    <div className="game-page-shell forest-leaderboard-page flex flex-col gap-4 pb-2 select-none">
      {/* ── Clean Header (No Box Card) ── */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-page-heading flex items-center justify-between px-1 py-1"
      >
        <button onClick={() => navigate('/')} type="button" className="game-page-home-button" aria-label="Return home">⌂</button>
        <div>
          <div className="flex items-center gap-2">
            <span>Hall of fame</span>
            <span className="game-live-pill"><i /> Live
            </span>
          </div>
          <h1>Leaderboard</h1>
          <p>Compete with top players and claim the crown.</p>
        </div>
      </motion.div>

      {/* ── Main Leaderboard Table ── */}
      <div className="game-page-content forest-leaderboard-content">
        <TopTenTable />
      </div>
    </div>
  )
}
