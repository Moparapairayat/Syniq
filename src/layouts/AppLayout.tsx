import { useState, useEffect, useRef } from 'react'
import { Outlet, useLocation, NavLink } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { mainNavigationItems } from '@/routes/navigation'
import { cn } from '@/utils/classNames'
import { playerService } from '@/services'
import bgHero from '@/assets/bg-hero.png'

/* ── Avatar data ── */
export const AVATARS = [
  { id: 1,  label: 'Cyberpunk', set: 1, pos: '0% 0%' },
  { id: 2,  label: 'Android',   set: 1, pos: '100% 0%' },
  { id: 3,  label: 'Mage',      set: 1, pos: '0% 100%' },
  { id: 4,  label: 'Alien',     set: 1, pos: '100% 100%' },
  { id: 5,  label: 'Marine',    set: 2, pos: '0% 0%' },
  { id: 6,  label: 'AI Entity', set: 2, pos: '100% 0%' },
  { id: 7,  label: 'Dragon',    set: 2, pos: '0% 100%' },
  { id: 8,  label: 'Space Elf', set: 2, pos: '100% 100%' },
  { id: 9,  label: 'Samurai',   set: 3, pos: '0% 0%' },
  { id: 10, label: 'Phantom',   set: 3, pos: '100% 0%' },
  { id: 11, label: 'Cyber Wolf',set: 3, pos: '0% 100%' },
  { id: 12, label: 'Cosmic',    set: 3, pos: '100% 100%' },
]

import avatarSet1 from '@/assets/avatars-set1.png'
import avatarSet2 from '@/assets/avatars-set2.png'
import avatarSet3 from '@/assets/avatars-set3.png'

export const AVATAR_SETS: Record<number, string> = {
  1: avatarSet1,
  2: avatarSet2,
  3: avatarSet3,
}

/* ── Avatar display helper ── */
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

/* ── Coin badge component ── */
function CoinBadge({ amount }: { amount: number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full px-3 py-1"
      style={{
        background: 'linear-gradient(180deg, #fef08a 0%, #fbbf24 50%, #d97706 100%)',
        border: '2px solid #92400e',
        boxShadow: '0 3px 0 #78350f, 0 5px 12px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.50)',
      }}
    >
      <div className="coin-icon">⭐</div>
      <span className="text-[11px] font-black text-[#78350f]">
        {amount.toLocaleString()}
      </span>
    </div>
  )
}

/* ── Nav icons ── */
const NavIcons: Record<string, (active: boolean) => React.ReactNode> = {
  '/': (a) => (
    <svg viewBox="0 0 24 24" fill={a ? '#22c55e' : 'none'} stroke={a ? 'none' : 'currentColor'} strokeWidth="1.8" className="h-5 w-5">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H5a1 1 0 01-1-1V9.5z" />
      <path d="M9 21V12h6v9" stroke={a ? '#fff' : 'currentColor'} strokeWidth="1.8" fill="none" />
    </svg>
  ),
  '/game': (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={a ? '#22c55e' : 'currentColor'} strokeWidth="1.8" className="h-5 w-5">
      <rect x="2" y="7" width="20" height="14" rx="4" />
      <path d="M8 14h2m2 0h2M12 12v4M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" />
    </svg>
  ),
  '/profile': (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={a ? '#22c55e' : 'currentColor'} strokeWidth="1.8" className="h-5 w-5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  '/leaderboard': (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={a ? '#22c55e' : 'currentColor'} strokeWidth="1.8" className="h-5 w-5">
      <path d="M8 18V10M12 18V6M16 18v-6" strokeLinecap="round" />
    </svg>
  ),
  '/settings': (a) => (
    <svg viewBox="0 0 24 24" fill="none" stroke={a ? '#22c55e' : 'currentColor'} strokeWidth="1.8" className="h-5 w-5">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
}

export function AppLayout() {
  const [showSplash, setShowSplash] = useState(true)
  const [splashProgress, setSplashProgress] = useState(0)
  const [playerName, setPlayerName] = useState('Player')
  const [highScore, setHighScore] = useState(0)
  const [avatarId, setAvatarId] = useState(1)
  const location = useLocation()
  const shouldReduceMotion = useReducedMotion()
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    playerService.getOrCreateProfile().then((p) => {
      setPlayerName(p.name)
      setHighScore(p.highestScore)
      const stored = localStorage.getItem('syniq-avatar-id')
      if (stored) setAvatarId(parseInt(stored, 10))
    }).catch(() => {})
  }, [location.pathname])

  useEffect(() => {
    progressRef.current = setInterval(() => setSplashProgress((p) => Math.min(p + 4, 100)), 40)
    const timer = setTimeout(() => setShowSplash(false), 1400)
    return () => {
      clearTimeout(timer)
      if (progressRef.current) clearInterval(progressRef.current)
    }
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col select-none" style={{ background: '#080f0b' }}>
      {/* Radial green ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-20"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.08) 0%, transparent 60%)' }}
      />
      {/* Grid overlay */}
      <div className="bg-grid-pattern pointer-events-none fixed inset-0 -z-10 opacity-100" />

      {/* ── Cinematic Splash ── */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash"
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
            style={{ background: '#080f0b', backgroundImage: `url(${bgHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          >
            <div className="absolute inset-0 bg-[#080f0b]/85 backdrop-blur-md" />
            <div className="relative z-10 flex flex-col items-center gap-6">
              <div className="absolute h-48 w-48 rounded-full bg-emerald-500/20 blur-[24px]" />

              <motion.div
                animate={shouldReduceMotion ? {} : { scale: [1, 1.04, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
                className="flex flex-col items-center gap-2"
              >
                <span className="font-game brand-gradient text-6xl font-black tracking-tight"
                  style={{ textShadow: '0 0 60px rgba(34,197,94,0.5)' }}
                >
                  SYNIQ
                </span>
                <span className="text-[10px] font-black tracking-[0.5em] text-white/40 uppercase">
                  Memory Challenge
                </span>
              </motion.div>

              {/* Progress bar */}
              <div className="mt-2 w-40">
                <div className="xp-bar-track">
                  <div className="xp-bar-fill" style={{ width: `${splashProgress}%`, animationName: 'none' }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <a className="skip-link" href="#main-content">Skip to content</a>

      {/* ── Header (Shared Across All Pages) ── */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-2.5"
        style={{
          background: 'rgba(8,15,11,0.92)',
          borderBottom: '1px solid rgba(34,197,94,0.10)',
          backdropFilter: 'blur(24px)',
        }}
      >
        {/* Avatar + name */}
        <NavLink to="/profile" className="flex items-center gap-2.5 outline-none">
          <div className="relative">
            <AvatarDisplay avatarId={avatarId} size={34} ringClass="avatar-ring-neon" />
            <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#080f0b] bg-emerald-400 shadow-[0_0_6px_#4ade80]" />
          </div>
          <div className="hidden flex-col sm:flex">
            <span className="text-[9px] font-black tracking-widest text-white/30 uppercase">Agent</span>
            <span className="text-xs font-bold text-white truncate max-w-[70px]">{playerName}</span>
          </div>
        </NavLink>

        {/* Brand */}
        <NavLink to="/" className="flex items-center gap-2 outline-none">
          <span className="font-game brand-gradient text-sm font-black tracking-[0.2em] uppercase">
            Syniq
          </span>
        </NavLink>

        {/* Coin counter */}
        <CoinBadge amount={highScore} />
      </header>

      {/* ── Main View Container ── */}
      <main id="main-content" className="mx-auto w-full max-w-[480px] flex-1 px-4 py-4 pb-28 outline-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Bottom Navigation (Shared Across All Pages) ── */}
      <nav className="fixed bottom-3 left-1/2 z-30 -translate-x-1/2" style={{ width: 'calc(100% - 32px)', maxWidth: '420px' }}>
        <div className="flex items-center justify-around rounded-[24px] px-2 py-2"
          style={{
            background: 'rgba(8,15,11,0.95)',
            border: '1.5px solid rgba(34,197,94,0.12)',
            backdropFilter: 'blur(28px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.60), 0 0 0 0.5px rgba(34,197,94,0.06)',
          }}
        >
          {mainNavigationItems.map((item) => {
            const IconFn = NavIcons[item.path]
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center gap-0.5 rounded-2xl px-3 py-2 transition-all duration-200 outline-none',
                    isActive ? 'nav-pill-active' : 'text-white/30 hover:text-white/60',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {IconFn ? IconFn(isActive) : <span>❓</span>}
                    <span
                      className="h-0.5 w-4 rounded-full transition-all duration-200"
                      style={{
                        background: isActive ? '#22c55e' : 'transparent',
                        boxShadow: isActive ? '0 0 6px #22c55e' : 'none',
                      }}
                    />
                    <span className={cn('text-[7px] font-black tracking-wider uppercase', isActive ? 'text-[#22c55e]' : 'text-white/30')}>
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
