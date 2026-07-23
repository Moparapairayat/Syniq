/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { mainNavigationItems } from '@/routes/navigation'
import { cn } from '@/utils/classNames'
import { playerService } from '@/services'
import { useTheme } from '@/context/themeStore'
import { NicknameAuthModal } from '@/components/auth/NicknameAuthModal'
import simonForestBackground from '@/assets/Gemini_Generated_Image_g2o2jfg2o2jfg2o2.png'

export const AVATARS = [
  { id: 1, label: 'Cyberpunk', set: 1, pos: '0% 0%' },
  { id: 2, label: 'Android', set: 1, pos: '100% 0%' },
  { id: 3, label: 'Mage', set: 1, pos: '0% 100%' },
  { id: 4, label: 'Alien', set: 1, pos: '100% 100%' },
  { id: 5, label: 'Marine', set: 2, pos: '0% 0%' },
  { id: 6, label: 'AI Entity', set: 2, pos: '100% 0%' },
  { id: 7, label: 'Dragon', set: 2, pos: '0% 100%' },
  { id: 8, label: 'Space Elf', set: 2, pos: '100% 100%' },
  { id: 9, label: 'Samurai', set: 3, pos: '0% 0%' },
  { id: 10, label: 'Phantom', set: 3, pos: '100% 0%' },
  { id: 11, label: 'Cyber Wolf', set: 3, pos: '0% 100%' },
  { id: 12, label: 'Cosmic', set: 3, pos: '100% 100%' },
]

import avatarSet1 from '@/assets/avatars-set1.png'
import avatarSet2 from '@/assets/avatars-set2.png'
import avatarSet3 from '@/assets/avatars-set3.png'

export const AVATAR_SETS: Record<number, string> = {
  1: avatarSet1,
  2: avatarSet2,
  3: avatarSet3,
}

export function AvatarDisplay({
  avatarId,
  size = 34,
  className = '',
  ringClass = 'avatar-ring-neon',
}: {
  avatarId: number
  size?: number
  className?: string
  ringClass?: string
}) {
  const avatar = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0]
  const src = AVATAR_SETS[avatar.set]
  return (
    <div
      className={cn('relative overflow-hidden rounded-full', ringClass, className)}
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      <div
        style={{
          width: size * 2,
          height: size * 2,
          backgroundImage: `url(${src})`,
          backgroundSize: '200% 200%',
          backgroundPosition: avatar.pos,
        }}
      />
    </div>
  )
}

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
  const shouldReduceMotion = useReducedMotion()
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
      {/* ── Cinematic Splash ── */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="nature-splash fixed inset-0 z-[100] flex flex-col items-center justify-center"
          >
            <div className="relative z-10 flex flex-col items-center gap-6">
              <motion.div
                animate={shouldReduceMotion ? {} : { scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-2"
              >
                <span className="font-mono text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#f1ba50] via-[#fff8d8] to-[#779d4c] tracking-wider"
                  style={{ filter: 'drop-shadow(0 0 30px rgba(236,178,70,0.45))' }}
                >
                  SYNIQ
                </span>
                <span className="font-mono text-[10px] font-black tracking-[0.5em] text-[#6c8b48] uppercase">
                  MEMORY TRAILS
                </span>
              </motion.div>

              <div className="mt-2 w-44">
                <div className="xp-bar-track">
                  <div className="xp-bar-fill" style={{ width: `${splashProgress}%` }} />
                </div>
              </div>
            </div>
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
      <main id="main-content" className="relative z-10 mx-auto w-full max-w-[480px] flex-1 px-2.5 sm:px-4 py-2 sm:py-4 outline-none">
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
