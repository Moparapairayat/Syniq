import { motion } from 'framer-motion'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { TopTenTable } from '@/components/profile'

export default function LeaderboardPage() {
  useDocumentTitle('Leaderboard')
  return (
    <div className="flex flex-col gap-4 pb-2">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <span className="text-[9px] font-black tracking-[0.35em] text-[#22c55e] uppercase">🏆 Rankings</span>
          <h1 className="font-game text-xl font-black text-white mt-0.5">Leaderboard</h1>
        </div>
        <button className="text-[11px] font-black text-white/40 hover:text-white/70 transition">
          How it works?
        </button>
      </motion.div>

      <TopTenTable />
    </div>
  )
}
