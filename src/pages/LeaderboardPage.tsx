import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { TopTenTable } from '@/components/profile'
import simonForestBackground from '@/assets/Gemini_Generated_Image_g2o2jfg2o2jfg2o2.png'

export default function LeaderboardPage() {
  useDocumentTitle('Leaderboard')
  const navigate = useNavigate()
  return (
    <div className="simon-home-screen simon-leaderboard-screen select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="simon-landing-card relative flex flex-col items-center justify-center p-4 overflow-y-auto"
        style={{ backgroundImage: `url(${simonForestBackground})` }}
      >
        <div className="simon-landing-sky" aria-hidden="true" />
        <div className="simon-landing-hills" aria-hidden="true" />

        {/* ── 3D Wood Leaderboard Plaque Box ── */}
        <div className="relative z-10 my-auto flex w-full max-w-[440px] flex-col gap-3 rounded-[24px] sm:rounded-[26px] border-[3px] border-[#3e2211] bg-gradient-to-b from-[#945525]/95 via-[#753f1a]/95 to-[#54290c]/95 p-3.5 xs:p-4 sm:p-6 text-[#fff3cd] shadow-[inset_0_2px_0_rgba(255,226,162,0.6),inset_0_-4px_0_rgba(30,12,4,0.7),0_8px_0_#381c0d,0_20px_40px_rgba(5,15,5,0.75)] backdrop-blur-md overflow-hidden">
          
          {/* Header Bar inside Plaque */}
          <div className="flex items-center justify-between pb-1.5 border-b border-[#8a4e22]/50">
            <button
              onClick={() => navigate('/')}
              type="button"
              aria-label="Return home"
              className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border-2 border-[#5a341a] bg-gradient-to-b from-[#9e5d2b] to-[#5a2e12] text-base sm:text-lg font-bold text-[#fff3cd] shadow-[inset_0_1.5px_0_rgba(255,226,162,0.6),0_3px_6px_rgba(0,0,0,0.5)] transition-transform active:scale-95 cursor-pointer outline-none hover:scale-105"
            >
              ⌂
            </button>
            <div className="rounded-full border-2 border-[#3d200e] bg-gradient-to-b from-[#d99043] to-[#8c4b18] px-3 sm:px-4 py-0.5 text-[9.5px] sm:text-[11px] font-black uppercase tracking-wider sm:tracking-widest text-[#fff3cd] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_0_#2b1408]">
              RANKINGS & SCOREBOARD
            </div>
            <div className="w-9 sm:w-10" />
          </div>

          {/* Leaderboard Table Content */}
          <TopTenTable />
        </div>
      </motion.div>
    </div>
  )
}
