import { useEffect } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { SimonColor } from '@/core/game/SimonColor'
import { GameStatus } from '@/core/game/GameStatus'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/utils/classNames'

export interface GameBoardProps {
  readonly activeLitColor: SimonColor | null
  readonly isDisabled: boolean
  readonly onColorClick: (color: SimonColor) => void
  readonly timeLeft: number | null
  readonly status: GameStatus
  readonly round: number
}

/* ══════════════════════════════════════════
   ZEN BUTTON THEME CONFIG
   Soft, muted earth tones — natural palette
══════════════════════════════════════════ */
const zenConfig = {
  [SimonColor.Red]: {
    fill: ['#d4957a', '#c67b5c'],
    shadow: '#a05c3f',
    border: 'rgba(160,92,63,0.25)',
    glow: 'rgba(198,123,92,0.20)',
    glowSoft: 'rgba(198,123,92,0.10)',
    ariaLabel: 'Terracotta',
    cls: 'zen-btn-terracotta',
  },
  [SimonColor.Green]: {
    fill: ['#8ab08e', '#7a9e7e'],
    shadow: '#5a7e5e',
    border: 'rgba(90,126,94,0.25)',
    glow: 'rgba(122,158,126,0.20)',
    glowSoft: 'rgba(122,158,126,0.10)',
    ariaLabel: 'Sage',
    cls: 'zen-btn-sage',
  },
  [SimonColor.Blue]: {
    fill: ['#8aafc2', '#7a9eb0'],
    shadow: '#5a7a94',
    border: 'rgba(90,122,148,0.25)',
    glow: 'rgba(122,158,176,0.20)',
    glowSoft: 'rgba(122,158,176,0.10)',
    ariaLabel: 'Mist',
    cls: 'zen-btn-mist',
  },
  [SimonColor.Yellow]: {
    fill: ['#e0b87a', '#d4a76a'],
    shadow: '#b48a4a',
    border: 'rgba(180,138,74,0.25)',
    glow: 'rgba(212,167,106,0.20)',
    glowSoft: 'rgba(212,167,106,0.10)',
    ariaLabel: 'Sand',
    cls: 'zen-btn-sand',
  },
} as const

/* ══════════════════════════════════════════
   ZEN BUTTON — Soft, minimal, natural
══════════════════════════════════════════ */
function ZenButton({
  color,
  isActive,
  isDisabled,
  onClick,
  shouldReduceMotion,
}: {
  color: SimonColor
  isActive: boolean
  isDisabled: boolean
  onClick: () => void
  shouldReduceMotion: boolean | null
}) {
  const c = zenConfig[color]
   return (
     <motion.button
       type="button"
       aria-label={c.ariaLabel}
       disabled={isDisabled}
       onClick={() => !isDisabled && onClick()}
       onKeyDown={(e) => {
         if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) onClick()
       }}
       className={cn(
         'zen-btn select-none focus:outline-none',
         c.cls,
         isActive && 'zen-btn-active'
       )}
       style={{
         width: '100%',
         aspectRatio: '1',
         cursor: isDisabled ? 'default' : 'pointer',
       }}
       whileHover={!shouldReduceMotion && !isDisabled && !isActive ? { scale: 1.04, y: -3 } : {}}
       whileTap={!shouldReduceMotion && !isDisabled ? { scale: 0.96, y: 2 } : {}}
     >
       {/* Soft active bloom */}
       {isActive && (
         <motion.div
           className="pointer-events-none absolute inset-0 rounded-[20px]"
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           transition={{ duration: 0.3 }}
           style={{
             background: `radial-gradient(ellipse at 50% 40%, ${c.glow} 0%, transparent 70%)`,
           }}
         />
       )}
     </motion.button>
   )
 
}

/* ══════════════════════════════════════════
   ZEN HUB — Soft stone center
══════════════════════════════════════════ */
function ZenHub({
  status,
  round,
  timeLeft,
  activeLitColor,
}: {
  status: GameStatus
  round: number
  timeLeft: number | null
  activeLitColor: SimonColor | null
}) {
  const activeGlow = activeLitColor ? zenConfig[activeLitColor].glow : null

  const content = () => {
    if (status === GameStatus.Idle)     return { main: '🧘', sub: 'Ready' }
    if (status === GameStatus.GameOver) return { main: '🍂', sub: 'End' }
    if (timeLeft !== null)              return { main: `${timeLeft}`, sub: 'Sec' }
    return                               { main: `${round}`, sub: 'Round' }
  }
  const c = content()

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
      {/* Soft outer glow */}
      {activeGlow && (
        <div
          className="absolute rounded-full"
          style={{
            width: 90, height: 90,
            background: `radial-gradient(circle, ${activeGlow} 0%, transparent 70%)`,
            filter: 'blur(8px)',
            transition: 'all 0.5s ease',
          }}
        />
      )}

      {/* Hub body — stone */}
      <div
        className="zen-hub"
        style={{
          width: 72, height: 72,
        }}
      >
        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={c.main}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="relative z-10 flex flex-col items-center leading-none"
          >
            <span
              className="text-2xl font-semibold"
              style={{
                color: '#5a4a38',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              {c.main}
            </span>
            <span
              className="text-[8px] font-semibold tracking-widest uppercase"
              style={{ color: '#8a7a68', marginTop: 2 }}
            >
              {c.sub}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN GAME BOARD — Zen / Natural Style
══════════════════════════════════════════ */
export function GameBoard({
  activeLitColor,
  isDisabled,
  onColorClick,
  timeLeft,
  status,
  round,
}: GameBoardProps) {
  const shouldReduceMotion = useReducedMotion()
  useSettings()

  /* Keyboard shortcuts */
  useEffect(() => {
    if (isDisabled) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      switch (e.key) {
        case '1': case 'ArrowUp':    e.preventDefault(); onColorClick(SimonColor.Red);    break
        case '2': case 'ArrowLeft':  e.preventDefault(); onColorClick(SimonColor.Green);  break
        case '3': case 'ArrowRight': e.preventDefault(); onColorClick(SimonColor.Blue);   break
        case '4': case 'ArrowDown':  e.preventDefault(); onColorClick(SimonColor.Yellow); break
        default: break
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDisabled, onColorClick])

  const activeConfig = activeLitColor ? zenConfig[activeLitColor] : null

  return (
    <div
      aria-label="Simon Game Board"
      role="region"
      className="relative mx-auto w-full max-w-[340px] select-none"
    >
      {/* ── Zen Board Panel ── */}
      <div className="zen-board">
        {/* ── 2x2 Zen Button Grid ── */}
        <div
          className="relative z-10"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '12px',
            aspectRatio: '1',
          }}
        >
          {/* TOP-LEFT: SAGE */}
          <ZenButton
            color={SimonColor.Green}
            isActive={activeLitColor === SimonColor.Green}
            isDisabled={isDisabled}
            onClick={() => onColorClick(SimonColor.Green)}
            shouldReduceMotion={shouldReduceMotion}
          />

          {/* TOP-RIGHT: TERRACOTTA */}
          <ZenButton
            color={SimonColor.Red}
            isActive={activeLitColor === SimonColor.Red}
            isDisabled={isDisabled}
            onClick={() => onColorClick(SimonColor.Red)}
            shouldReduceMotion={shouldReduceMotion}
          />

          {/* BOTTOM-LEFT: MIST */}
          <ZenButton
            color={SimonColor.Blue}
            isActive={activeLitColor === SimonColor.Blue}
            isDisabled={isDisabled}
            onClick={() => onColorClick(SimonColor.Blue)}
            shouldReduceMotion={shouldReduceMotion}
          />

          {/* BOTTOM-RIGHT: SAND */}
          <ZenButton
            color={SimonColor.Yellow}
            isActive={activeLitColor === SimonColor.Yellow}
            isDisabled={isDisabled}
            onClick={() => onColorClick(SimonColor.Yellow)}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>

        {/* ── Soft ambient bloom when active ── */}
        {activeLitColor && (
          <motion.div
            key={activeLitColor}
            className="pointer-events-none absolute inset-0 rounded-[28px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: `radial-gradient(ellipse at 50% 50%, ${activeConfig?.glowSoft} 0%, transparent 65%)`,
            }}
          />
        )}

        {/* ── Center Hub (Stone) ── */}
        <ZenHub
          status={status}
          round={round}
          timeLeft={timeLeft}
          activeLitColor={activeLitColor}
        />
      </div>
    </div>
  )
}
