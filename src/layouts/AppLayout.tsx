import { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { mainNavigationItems } from '@/routes/navigation'
import { cn } from '@/utils/classNames'
import { playerService } from '@/services'
import { useTheme } from '@/context/themeStore'
import { NicknameAuthModal } from '@/components/auth/NicknameAuthModal'
import simonForestBackground from '@/assets/Gemini_Generated_Image_g2o2jfg2o2jfg2o2.png'

import { AvatarDisplay, AVATARS, AVATAR_SETS } from '@/components/avatar'
export { AvatarDisplay, AVATARS, AVATAR_SETS }

function CoinBadge({ amount }: { amount: number }) {
  return (
    <div className="coin-badge">
      <div className="coin-icon text-[8px]">⭐</div>
      <span>{amount.toLocaleString()}</span>
    </div>
  )
}

const NavIcons: Record<string, (active: boolean) => React.ReactNode> = {
  '/': (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={a ? '#0f172a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  '/game': (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={a ? '#0f172a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <line x1="6" y1="12" x2="10" y2="12" />
      <line x1="8" y1="10" x2="8" y2="14" />
      <circle cx="15" cy="13" r="1" fill={a ? '#0f172a' : 'currentColor'} />
      <circle cx="18" cy="11" r="1" fill={a ? '#0f172a' : 'currentColor'} />
      <rect x="2" y="6" width="20" height="12" rx="6" />
    </svg>
  ),
  '/profile': (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={a ? '#0f172a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  '/leaderboard': (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={a ? '#0f172a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
    </svg>
  ),
  '/settings': (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={a ? '#0f172a' : 'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
}

export function AppLayout() {
  const [showSplash, setShowSplash] = useState(true)
  const [splashProgress, setSplashProgress] = useState(0)
  const [playerName, setPlayerName] = useState('Agent')
  const [highScore, setHighScore] = useState(0)
  const [avatarId, setAvatarId] = useState(1)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { themeMode, toggleTheme } = useTheme()
  const location = useLocation()
  const isHomeRoute = location.pathname === '/'
  const showHeader = false
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    playerService.getOrCreateProfile().then((p) => {
      setPlayerName(p.name)
      setHighScore(p.highestScore)
      const stored = localStorage.getItem('syniq-avatar-id')
      if (stored) setAvatarId(parseInt(stored, 10))

      const isAuthSet = localStorage.getItem('syniq-nickname-set')
      if (!isAuthSet || p.name.startsWith('Player 1')) {
        setTimeout(() => setShowAuthModal(true), 1500)
      }
    }).catch(() => { })
  }, [location.pathname])

  useEffect(() => {
    progressRef.current = setInterval(() => setSplashProgress((p) => Math.min(p + 4, 100)), 40)
    const timer = setTimeout(() => setShowSplash(false), 1400)
    return () => {
      clearTimeout(timer)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [])

  const handleAuthSuccess = (newTitle: string, newAvatarId: number) => {
    setPlayerName(newTitle)
    setAvatarId(newAvatarId)
  }

  return (
    <div className={`nature-shell relative flex min-h-screen flex-col select-none ${isHomeRoute ? 'is-home-route' : ''}`}>
      <div className="nature-backdrop" style={{ backgroundImage: `url(${simonForestBackground})` }} aria-hidden="true" />
      {/* ── 3D Forest Game Cinematic Splash (Self-contained) ── */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#0d160b] select-none"
            role="status"
            aria-label="Loading Syniq Game"
          >
            {/* 1. Forest Background Image */}
            <img
              src={simonForestBackground}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center filter brightness-[0.7] contrast-[1.05]"
            />

            {/* 2. Soft Backdrop Blur & Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a1608]/85 via-[#0e200c]/50 to-[#060e05]/95 backdrop-blur-[6px]" />

            {/* 3. Central 3D Wood Plaque Container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="relative z-10 flex w-[88vw] max-w-[320px] flex-col items-center justify-center rounded-[24px] border-[3px] border-[#3e2211] bg-gradient-to-b from-[#945525] via-[#753f1a] to-[#54290c] px-5 py-6 text-center shadow-[inset_0_2px_0_rgba(255,226,162,0.6),inset_0_-4px_0_rgba(30,12,4,0.7),0_8px_0_#381c0d,0_20px_40px_rgba(5,15,5,0.75)]"
            >
              {/* Leaf Badges */}
              <div aria-hidden="true" className="absolute -top-3 -left-3 h-9 w-9 rounded-tr-[70%] rounded-bl-[70%] border-2 border-[#1c380d] bg-gradient-to-br from-[#85c24e] to-[#38661b] shadow-md" />
              <div aria-hidden="true" className="absolute -top-3 -right-3 h-9 w-9 rounded-tl-[70%] rounded-br-[70%] border-2 border-[#1c380d] bg-gradient-to-bl from-[#85c24e] to-[#38661b] shadow-md" />

              {/* Top Wooden Ribbon Badge */}
              <div className="absolute -top-4 rounded-full border-2 border-[#3d200e] bg-gradient-to-b from-[#d99043] to-[#8c4b18] px-4 py-0.5 text-[10px] font-black uppercase tracking-widest text-[#fff3cd] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_3px_0_#2b1408]">
                <span>SYNIQ MEMORY</span>
              </div>

              {/* Steady 3D Wood Title SYNIQ */}
              <h1 className="my-3 flex items-center justify-center gap-1 font-black text-3xl tracking-widest uppercase" aria-label="SYNIQ">
                {"SYNIQ".split("").map((char, index) => (
                  <span
                    key={index}
                    className="inline-block"
                    style={{
                      background: 'linear-gradient(180deg, #fff3cd 0%, #ffd075 35%, #e59336 65%, #b8621b 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      WebkitTextStroke: '1.2px #482006',
                      filter: 'drop-shadow(0 4px 6px rgba(15, 8, 2, 0.6))',
                    }}
                  >
                    {char}
                  </span>
                ))}
              </h1>

              {/* 3D Animated Gemstone Spinner */}
              <div className="relative my-2 flex h-9 w-9 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                  className="grid h-full w-full grid-cols-2 gap-1 rounded-full p-1 border-2 border-[#5a341a] bg-[#e8e0c5] shadow-[0_3px_0_#3d200e]"
                >
                  <span className="rounded-full bg-gradient-to-b from-[#64cf4a] to-[#2a8216] border border-[#1c590d] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
                  <span className="rounded-full bg-gradient-to-b from-[#f85b5b] to-[#b91c1c] border border-[#7f1d1d] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
                  <span className="rounded-full bg-gradient-to-b from-[#38bdf8] to-[#0369a1] border border-[#0c4a6e] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
                  <span className="rounded-full bg-gradient-to-b from-[#fbbf24] to-[#b45309] border border-[#78350f] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]" />
                </motion.div>
              </div>

              {/* Loading Bar & Status Text with real splashProgress */}
              <div className="mt-1.5 w-full px-2">
                <div className="mb-1.5 flex justify-between text-[10px] font-black uppercase tracking-widest text-[#ffe49e] drop-shadow-[0_1px_2px_rgba(40,18,6,0.9)]">
                  <span>Loading Game</span>
                  <span>{splashProgress}%</span>
                </div>

                {/* Animated 3D Wood & Gold Progress Bar */}
                <div className="h-3 w-full overflow-hidden rounded-full border border-[#4a2713] bg-[#3a1d0d] p-0.5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#e29741] via-[#fcd34d] to-[#c97020] shadow-[0_0_8px_rgba(252,211,77,0.8)] transition-all duration-150 ease-out"
                    style={{ width: `${splashProgress}%` }}
                  />
                </div>
              </div>

              {/* Rating Stars */}
              <div className="mt-3 flex gap-1 text-[13px] text-[#fbbf24] drop-shadow-[0_2px_3px_rgba(20,10,2,0.8)]">
                <span>★</span><span>★</span><span className="opacity-40">★</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Nickname Auth Modal ── */}
      <NicknameAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialName={playerName}
        initialAvatarId={avatarId}
        onAuthSuccess={handleAuthSuccess}
      />

      <a className="skip-link" href="#main-content">Skip to content</a>

      {/* ── Top Bar Header (Ultra-Clean & Natural) ── */}
      {showHeader && <header className="nature-header sticky top-0 z-30 w-full transition-all">
        <div className="mx-auto flex w-full max-w-[480px] items-center justify-between px-3.5 py-2">
          {/* Left: User Profile Pill */}
          <button
            type="button"
            onClick={() => setShowAuthModal(true)}
            className="nature-profile flex items-center gap-2 rounded-full px-2.5 py-1 outline-none cursor-pointer transition-colors group text-left"
          >
            <div className="relative">
              <AvatarDisplay avatarId={avatarId} size={28} ringClass="avatar-ring-neon group-hover:scale-105 transition-transform" />
              <span className="absolute -right-0.5 -bottom-0.5 h-2 w-2 rounded-full border border-white bg-emerald-400" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-extrabold text-[#3d4f2d] truncate max-w-[70px] sm:max-w-[100px]">
                {playerName}
              </span>
            </div>
          </button>

          {/* Center: SYNIQ Brand Logo */}
          <NavLink to="/" className="flex items-center gap-1.5 outline-none px-2 py-1 rounded-xl transition-colors">
            <span className="text-[#d68a19] text-sm">✦</span>
            <span className="text-base font-extrabold text-[#587338] tracking-widest uppercase">
              SYNIQ
            </span>
          </NavLink>

          {/* Right: Controls (Theme Toggle + High Score) */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              type="button"
              title={`Switch to ${themeMode === 'dark' ? 'Light' : 'Dark'} Mode`}
              className="nature-icon-button flex h-8 w-8 items-center justify-center rounded-xl text-sm cursor-pointer transition-colors outline-none"
            >
              {themeMode === 'dark' ? '☀️' : '🌙'}
            </button>

            <CoinBadge amount={highScore} />
          </div>
        </div>
      </header>}

      {/* ── Main View Container ── */}
      <main id="main-content" className="relative z-10 mx-auto w-full max-w-full sm:max-w-[480px] flex-1 p-0 sm:px-4 sm:py-4 outline-none">
        <Outlet />
      </main>

      {/* ── Floating Modern Navigation ── */}
      <nav className="hidden" style={{ width: 'calc(100% - 32px)', maxWidth: '420px' }}>
        <div className="nature-nav-shell flex items-center justify-around rounded-2xl px-2 py-2 shadow-2xl">
          {mainNavigationItems.map((item) => {
            const IconFn = NavIcons[item.path]
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-1 rounded-xl px-3 py-1.5 transition-all duration-150 outline-none',
                    isActive
                      ? 'bg-[#38bdf8] text-[#0f172a] font-bold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {IconFn ? IconFn(isActive) : <span>❓</span>}
                    <span className={cn('text-[10px] font-bold tracking-wide uppercase', isActive ? 'text-[#0f172a]' : 'text-slate-400')}>
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
