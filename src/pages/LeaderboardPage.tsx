import { motion } from 'framer-motion'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { TopTenTable } from '@/components/profile'

export default function LeaderboardPage() {
  useDocumentTitle('Leaderboard')
  return (
    <div className="flex flex-col gap-4 pb-2 select-none">
      {/* ── Clean Header (No Box Card) ── */}
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between px-1 py-1"
      >
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#38bdf8] uppercase">🏆 GLOBAL HALL OF FAME</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> LIVE
            </span>
          </div>
          <h1 className="font-mono text-2xl font-black text-white tracking-wide mt-1">
            LEADERBOARD
          </h1>
          <p className="text-[11px] text-slate-400 mt-0.5">Compete with top players and claim the #1 spot</p>
        </div>
      </motion.div>

      {/* ── Main Leaderboard Table ── */}
      <TopTenTable />
    </div>
  )
}
