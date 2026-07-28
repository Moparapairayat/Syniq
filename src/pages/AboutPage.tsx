import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMetaTags } from '@/hooks/useMetaTags'
import simonForestBackground from '@/assets/Gemini_Generated_Image_g2o2jfg2o2jfg2o2.png'

export default function AboutPage() {
  useMetaTags({
    title: 'About Project & Academic Dossier',
    description:
      'Academic coursework details, course instructor information, developer profile, and technical specifications for Syniq Memory Challenge.',
    url: 'https://syniq.moparapairayat.dev/about',
  })
  const navigate = useNavigate()

  return (
    <div className="simon-about-screen select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="simon-landing-card relative flex flex-col items-center justify-center overflow-y-auto p-2 sm:p-4"
        style={{ backgroundImage: `url(${simonForestBackground})` }}
      >
        <div className="simon-landing-sky" aria-hidden="true" />
        <div className="simon-landing-hills" aria-hidden="true" />

        {/* ── 3D Wood About Plaque Box ── */}
        <div className="custom-scrollbar relative z-10 my-auto flex max-h-[88vh] w-full max-w-[440px] flex-col justify-between gap-3 overflow-y-auto rounded-[22px] border-[3px] border-[#3e2211] bg-gradient-to-b from-[#945525]/95 via-[#753f1a]/95 to-[#54290c]/95 p-3 text-[#fff3cd] shadow-[inset_0_2px_0_rgba(255,226,162,0.6),inset_0_-4px_0_rgba(30,12,4,0.7),0_8px_0_#381c0d,0_20px_40px_rgba(5,15,5,0.75)] backdrop-blur-md sm:max-h-[90vh] sm:rounded-[26px] sm:p-6">
          {/* Header Bar inside Plaque */}
          <div className="flex items-center justify-between border-b border-[#8a4e22]/50 pb-1.5">
            <button
              onClick={() => navigate('/')}
              type="button"
              aria-label="Return home"
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border-2 border-[#5a341a] bg-gradient-to-b from-[#9e5d2b] to-[#5a2e12] text-base font-bold text-[#fff3cd] shadow-[inset_0_1.5px_0_rgba(255,226,162,0.6),0_3px_6px_rgba(0,0,0,0.5)] transition-transform outline-none hover:scale-105 active:scale-95 sm:h-10 sm:w-10 sm:text-lg"
            >
              ⌂
            </button>
            <div className="rounded-full border-2 border-[#3d200e] bg-gradient-to-b from-[#d99043] to-[#8c4b18] px-3.5 py-0.5 text-[9.5px] font-black tracking-wider text-[#fff3cd] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_0_#2b1408] sm:px-4 sm:text-[11px] sm:tracking-widest">
              ACADEMIC DOSSIER
            </div>
            <div className="w-9 sm:w-10" />
          </div>

          {/* Card 1: Academic & Institution Details */}
          <div className="rounded-2xl border-2 border-[#78431e] bg-[#2a1307]/75 p-3 shadow-inner sm:p-4">
            <div className="mb-2 flex items-center gap-2 border-b border-[#8a4e22]/50 pb-1.5">
              <span className="text-sm sm:text-lg">🎓</span>
              <h2 className="text-[11px] font-black tracking-widest text-[#fcd34d] uppercase sm:text-xs">
                Course & Academic Details
              </h2>
            </div>

            <div className="flex flex-col gap-1.5 text-xs">
              {/* Student */}
              <div className="flex items-center justify-between gap-1.5 rounded-xl border border-[#78431e] bg-[#2a1307]/90 px-2.5 py-1.5">
                <div
                  className="flex shrink-0 items-center gap-1.5"
                  style={{ color: '#ffe49e' }}
                >
                  <span>👤</span>
                  <span
                    className="text-[9.5px] font-bold tracking-wider uppercase sm:text-[10px]"
                    style={{ color: '#ffe49e' }}
                  >
                    Student / Developer
                  </span>
                </div>
                <span
                  className="text-[10.5px] font-black sm:text-xs"
                  style={{ color: '#fcd34d', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                  Mopara Pair Ayat
                </span>
              </div>

              {/* Instructor */}
              <div className="flex items-center justify-between gap-1.5 rounded-xl border border-[#b8732a]/80 bg-gradient-to-r from-[#3a1d0d] via-[#2a1307] to-[#3a1d0d] px-2.5 py-1.5 shadow-md">
                <div
                  className="flex shrink-0 items-center gap-1.5"
                  style={{ color: '#ffe49e' }}
                >
                  <span>👩‍🏫</span>
                  <span
                    className="text-[9px] font-bold tracking-wider uppercase sm:text-[9.5px]"
                    style={{ color: '#ffe49e' }}
                  >
                    Course Instructor
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1 rounded-full border border-[#fcd34d]/70 bg-gradient-to-r from-[#945525] via-[#82461a] to-[#54290c] px-2 py-0.5 shadow-[inset_0_1px_0_rgba(255,226,162,0.6),0_2px_4px_rgba(0,0,0,0.6)]">
                  <span className="text-[9.5px]">👑</span>
                  <span
                    className="text-[10px] font-black tracking-wide sm:text-xs"
                    style={{ color: '#fff3cd', textShadow: '0 1px 3px rgba(0,0,0,0.9)' }}
                  >
                    Ziana Mehnaz Ruhee
                  </span>
                </div>
              </div>

              {/* Institute */}
              <div className="flex items-center justify-between gap-2 rounded-xl border border-[#78431e] bg-[#2a1307]/90 px-3 py-1.5">
                <div
                  className="flex shrink-0 items-center gap-1.5"
                  style={{ color: '#ffe49e' }}
                >
                  <span>🏛️</span>
                  <span
                    className="text-[10px] font-bold tracking-wider uppercase"
                    style={{ color: '#ffe49e' }}
                  >
                    Institute
                  </span>
                </div>
                <span
                  className="text-right text-[11px] font-black sm:text-xs"
                  style={{ color: '#fcd34d', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                  BITHM College Of Professionals
                </span>
              </div>

              {/* Qualification Level */}
              <div className="flex items-center justify-between gap-2 rounded-xl border border-[#78431e] bg-[#2a1307]/90 px-3 py-1.5">
                <div
                  className="flex shrink-0 items-center gap-1.5"
                  style={{ color: '#ffe49e' }}
                >
                  <span>📜</span>
                  <span
                    className="text-[10px] font-bold tracking-wider uppercase"
                    style={{ color: '#ffe49e' }}
                  >
                    Qualification
                  </span>
                </div>
                <span
                  className="text-right text-[11px] font-black sm:text-xs"
                  style={{ color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                  OTHM Level 5 in IT/CSE (UK)
                </span>
              </div>

              {/* Subject */}
              <div className="flex items-center justify-between gap-2 rounded-xl border border-[#78431e] bg-[#2a1307]/90 px-3 py-1.5">
                <div
                  className="flex shrink-0 items-center gap-1.5"
                  style={{ color: '#ffe49e' }}
                >
                  <span>📚</span>
                  <span
                    className="text-[10px] font-bold tracking-wider uppercase"
                    style={{ color: '#ffe49e' }}
                  >
                    Subject Unit
                  </span>
                </div>
                <span
                  className="text-[11px] font-black sm:text-xs"
                  style={{ color: '#fcd34d', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}
                >
                  Software Engineering
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Tech Stack & Architecture */}
          <div className="rounded-2xl border-2 border-[#78431e] bg-[#2a1307]/75 p-3.5 shadow-inner sm:p-4">
            <div className="mb-2.5 flex items-center gap-2 border-b border-[#8a4e22]/50 pb-1.5">
              <span className="text-base sm:text-lg">🛠️</span>
              <h2 className="text-xs font-black tracking-widest text-[#fcd34d] uppercase">
                Tech Stack & Architecture
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[8.5px] font-black tracking-wider uppercase sm:text-[9.5px]">
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#60a5fa]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#60a5fa', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>📘</span> TypeScript / JS
              </span>
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#f97316]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#f97316', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>🌐</span> HTML5 & CSS3
              </span>
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#38bdf8]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#38bdf8', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>⚛️</span> React.js
              </span>
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#22d3ee]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#22d3ee', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>🎨</span> Tailwind CSS
              </span>
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#f472b6]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#f472b6', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>✨</span> Framer Motion
              </span>
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#fcd34d]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#fcd34d', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>💾</span> IndexedDB (idb)
              </span>
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#4ade80]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#4ade80', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>🎵</span> Web Audio API
              </span>
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#eab308]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#eab308', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>🖌️</span> HTML5 Canvas API
              </span>
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#a855f7]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#a855f7', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>📳</span> Web Haptic API
              </span>
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#f43f5e]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#f43f5e', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>🧭</span> React Router DOM
              </span>
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#fb923c]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#fb923c', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>📱</span> Vite PWA & Workbox
              </span>
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#c084fc]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#c084fc', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>⚡</span> Vite
              </span>
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#a3e635]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#a3e635', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>🧪</span> Vitest & Testing
              </span>
              <span
                className="flex items-center gap-1 overflow-hidden rounded-xl border border-[#cbd5e1]/60 bg-[#120803] px-1.5 py-1 text-ellipsis whitespace-nowrap shadow-md"
                style={{ color: '#cbd5e1', textShadow: '0 1px 2px rgba(0,0,0,0.9)' }}
              >
                <span>🧹</span> ESLint & Prettier
              </span>
            </div>

            <p className="mt-2.5 rounded-xl border border-[#78431e] bg-[#2a1307]/90 p-2.5 text-[10.5px] leading-relaxed font-bold text-[#ffe49e]">
              🎮 <strong>Syniq</strong> is built with clean{' '}
              <strong>OOP Architecture</strong>.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-1 flex flex-row items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl border border-[#78350f] bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] px-1.5 py-2.5 text-[10px] font-black tracking-wider text-[#3a1d0d] uppercase shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_3px_0_#78350f,0_6px_12px_rgba(0,0,0,0.4)] transition-transform outline-none hover:brightness-110 active:translate-y-0.5 sm:gap-2 sm:px-3 sm:text-xs sm:tracking-widest"
            >
              <span className="flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full border border-[#613b22] bg-gradient-to-b from-[#b8753c] via-[#865027] to-[#693a22] text-[10px] text-[#fff1bc] shadow-[inset_0_1px_0_rgba(255,225,161,0.6),0_1px_2px_rgba(0,0,0,0.5)] sm:h-5 sm:w-5 sm:text-[11px]">
                🏠
              </span>
              <span className="whitespace-nowrap">RETURN HOME</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/game')}
              className="flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-xl border border-[#5a341a] bg-gradient-to-b from-[#9e5d2b] to-[#5a2e12] px-1.5 py-2.5 text-[10px] font-black tracking-wider text-[#fff3cd] uppercase shadow-[inset_0_1px_0_rgba(255,226,162,0.4),0_2px_0_#2b1408] transition-transform outline-none hover:border-[#fcd34d] active:translate-y-0.5 sm:gap-2 sm:px-3 sm:text-xs sm:tracking-widest"
            >
              <span className="flex h-4.5 w-4.5 flex-shrink-0 items-center justify-center rounded-full border border-[#613b22] bg-gradient-to-b from-[#b8753c] via-[#865027] to-[#693a22] text-[10px] text-[#fff1bc] shadow-[inset_0_1px_0_rgba(255,226,162,0.6),0_1px_2px_rgba(0,0,0,0.5)] sm:h-5 sm:w-5 sm:text-[11px]">
                🎮
              </span>
              <span className="whitespace-nowrap">PLAY SYNIQ</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
