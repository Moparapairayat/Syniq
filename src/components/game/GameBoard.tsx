import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { SimonColor } from '@/core/game/SimonColor'
import { GameStatus } from '@/core/game/GameStatus'

export interface GameBoardProps {
  readonly activeLitColor: SimonColor | null
  readonly isDisabled: boolean
  readonly onColorClick: (color: SimonColor) => void
  readonly timeLeft: number | null
  readonly status: GameStatus
  readonly round: number
  readonly onCenterHubClick?: () => void
}

/* ══════════════════════════════════════════
   ORIGINAL VIBRANT 3D SIMON COLOR PAD CONFIG
══════════════════════════════════════════ */
const padConfig = {
  [SimonColor.Green]: {
    label: 'GREEN',
    keyHint: '2',
    normalGrad: 'linear-gradient(145deg, #64cf4a 0%, #3ca822 55%, #2a8216 100%)',
    activeGrad: 'linear-gradient(145deg, #ffffff 0%, #a3f380 40%, #4ade80 100%)',
    borderColor: '#1c590d',
    glowColor: 'rgba(74, 222, 128, 0.95)',
    ariaLabel: 'Green Pad (Key 2)',
    corners: 'rounded-tl-[38px] rounded-tr-2xl rounded-bl-2xl rounded-br-md',
  },
  [SimonColor.Red]: {
    label: 'RED',
    keyHint: '1',
    normalGrad: 'linear-gradient(145deg, #f85b5b 0%, #dc2626 55%, #b91c1c 100%)',
    activeGrad: 'linear-gradient(145deg, #ffffff 0%, #fca5a5 40%, #f87171 100%)',
    borderColor: '#7f1d1d',
    glowColor: 'rgba(248, 113, 113, 0.95)',
    ariaLabel: 'Red Pad (Key 1)',
    corners: 'rounded-tr-[38px] rounded-tl-2xl rounded-br-2xl rounded-bl-md',
  },
  [SimonColor.Blue]: {
    label: 'BLUE',
    keyHint: '3',
    normalGrad: 'linear-gradient(145deg, #38bdf8 0%, #0284c7 55%, #0369a1 100%)',
    activeGrad: 'linear-gradient(145deg, #ffffff 0%, #7dd3fc 40%, #38bdf8 100%)',
    borderColor: '#0c4a6e',
    glowColor: 'rgba(56, 189, 248, 0.95)',
    ariaLabel: 'Blue Pad (Key 3)',
    corners: 'rounded-bl-[38px] rounded-tl-2xl rounded-br-2xl rounded-tr-md',
  },
  [SimonColor.Yellow]: {
    label: 'YELLOW',
    keyHint: '4',
    normalGrad: 'linear-gradient(145deg, #fbbf24 0%, #d97706 55%, #b45309 100%)',
    activeGrad: 'linear-gradient(145deg, #ffffff 0%, #fef08a 40%, #facc15 100%)',
    borderColor: '#78350f',
    glowColor: 'rgba(250, 204, 21, 0.95)',
    ariaLabel: 'Yellow Pad (Key 4)',
    corners: 'rounded-br-[38px] rounded-tr-2xl rounded-bl-2xl rounded-tl-md',
  },
} as const

/* ══════════════════════════════════════════
   STATIONARY ENHANCED SECTOR BUTTON
══════════════════════════════════════════ */
function SectorButton({
  color,
  isActive,
  isDisabled,
  onClick,
}: {
  color: SimonColor
  isActive: boolean
  isDisabled: boolean
  onClick: () => void
}) {
  const c = padConfig[color]

  const handleClick = () => {
    if (isDisabled) return
    onClick()
  }

  return (
    <button
      type="button"
      aria-label={c.ariaLabel}
      disabled={isDisabled}
      onClick={handleClick}
      className="relative select-none focus:outline-none w-full h-full cursor-pointer"
      style={{
        aspectRatio: '1',
        cursor: isDisabled ? 'not-allowed' : 'pointer',
      }}
    >
      {/* Pad Surface */}
      <div
        className={`relative z-10 h-full w-full overflow-hidden ${c.corners}`}
        style={{
          background: isActive ? c.activeGrad : c.normalGrad,
          border: `2.5px solid ${c.borderColor}`,
          boxShadow: isActive
            ? `inset 0 0 0 3px #ffffff, inset 0 2px 10px rgba(255,255,255,0.9), 0 0 35px ${c.glowColor}`
            : 'inset 0 2px 0 rgba(255,255,255,0.6), inset 0 -3px 0 rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.35)',
          transition: 'background 0.08s ease, box-shadow 0.08s ease',
        }}
      >
        {/* Top glossy glare line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
          style={{
            top: '6%',
            width: '64%',
            height: '22%',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.5) 0%, transparent 100%)',
          }}
        />

        {/* Keystroke Hint Badge */}
        <span className="absolute top-3 right-3 font-mono text-[9px] font-extrabold text-slate-100 bg-slate-950/70 border border-white/20 rounded-md px-1.5 py-0.5 backdrop-none">
          {c.keyHint}
        </span>

        {/* Center Pad Label */}
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          <span
            className="font-mono text-xs font-black tracking-widest text-white uppercase drop-shadow-md"
            style={{
              color: isActive ? '#0f172a' : '#ffffff',
            }}
          >
            {c.label}
          </span>
        </div>
      </div>
    </button>
  )
}

/* ══════════════════════════════════════════
   STATIONARY ENHANCED CENTER HUB
══════════════════════════════════════════ */
function CenterHub({
  status,
  round,
  timeLeft,
  onClick,
}: {
  status: GameStatus
  round: number
  timeLeft: number | null
  onClick?: () => void
}) {
  const content = () => {
    if (status === GameStatus.Idle)     return { main: 'START', sub: 'TAP HERE' }
    if (status === GameStatus.GameOver) return { main: 'AGAIN', sub: 'TAP HERE' }
    if (timeLeft !== null)              return { main: `${timeLeft}`, sub: 'SEC' }
    return                               { main: `${round}`, sub: 'ROUND' }
  }
  const c = content()
  const isClickable = status === GameStatus.Idle || status === GameStatus.GameOver

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center z-20">
      {/* Outer Metallic Ring */}
      <div
        className="flex items-center justify-center rounded-full p-1 shadow-xl"
        style={{ background: 'linear-gradient(145deg, #754820, #3d2b1e)', border: '2px solid #c9903b' }}
      >
        <button
          type="button"
          onClick={onClick}
          disabled={!isClickable}
          className="pointer-events-auto relative flex flex-col items-center justify-center rounded-full outline-none"
          style={{
            width: 82, height: 82,
            background: 'linear-gradient(180deg, #fef08a 0%, #fbbf24 50%, #d97706 100%)',
            border: '2px solid #fef08a',
            boxShadow: 'inset 0 2px 0 rgba(255,255,255,0.8), 0 4px 14px rgba(0,0,0,0.4)',
            cursor: isClickable ? 'pointer' : 'default',
          }}
        >
          <div
            className="absolute top-[8%] left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
            style={{
              width: '55%', height: '24%',
              background: 'linear-gradient(180deg, rgba(255,255,255,0.75) 0%, transparent 100%)',
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={c.main}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.15 }}
              className="relative z-10 flex flex-col items-center leading-none pointer-events-none"
            >
              <span
                className="font-mono font-black text-slate-950"
                style={{
                  fontSize: c.main.length > 2 ? '14px' : '26px',
                }}
              >
                {c.main}
              </span>
              {c.sub && (
                <span
                  className="text-[7.5px] font-black tracking-widest uppercase text-slate-950 mt-0.5"
                >
                  {c.sub}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </button>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   MAIN GAME BOARD
══════════════════════════════════════════ */
export function GameBoard({
  activeLitColor,
  isDisabled,
  onColorClick,
  timeLeft,
  status,
  round,
  onCenterHubClick,
}: GameBoardProps) {
  useEffect(() => {
    if (isDisabled || status !== GameStatus.PlayerTurn) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return
      let targetColor: SimonColor | null = null
      switch (e.key) {
        case '1': case 'ArrowUp':    targetColor = SimonColor.Red;    break
        case '2': case 'ArrowLeft':  targetColor = SimonColor.Green;  break
        case '3': case 'ArrowRight': targetColor = SimonColor.Blue;   break
        case '4': case 'ArrowDown':  targetColor = SimonColor.Yellow; break
        default: break
      }
      if (targetColor) {
        e.preventDefault()
        onColorClick(targetColor)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isDisabled, onColorClick, status])

  return (
    <div
      aria-label="Simon Game Board"
      role="region"
      className={`relative mx-auto w-full max-w-[min(350px,85vw,48vh)] select-none ${
        status === GameStatus.PlayerTurn ? 'memory-board-ready' : ''
      }`}
    >
      {/* Outer Bezel */}
      <div
        className="game-bezel relative overflow-hidden rounded-[42px] p-4"
        style={{
          background: 'linear-gradient(145deg, #6a4528, #372b20)',
          border: '2px solid #c39a55',
          boxShadow: 'inset 0 2px 0 rgba(255,228,164,0.25), 0 12px 32px -4px rgba(16,31,13,0.65)',
        }}
      >
        {/* 2x2 Sector Grid */}
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
          {/* TOP-LEFT: GREEN (Key 1) */}
          <SectorButton
            color={SimonColor.Green}
            isActive={activeLitColor === SimonColor.Green}
            isDisabled={isDisabled}
            onClick={() => onColorClick(SimonColor.Green)}
          />

          {/* TOP-RIGHT: RED (Key 2) */}
          <SectorButton
            color={SimonColor.Red}
            isActive={activeLitColor === SimonColor.Red}
            isDisabled={isDisabled}
            onClick={() => onColorClick(SimonColor.Red)}
          />

          {/* BOTTOM-LEFT: BLUE (Key 3) */}
          <SectorButton
            color={SimonColor.Blue}
            isActive={activeLitColor === SimonColor.Blue}
            isDisabled={isDisabled}
            onClick={() => onColorClick(SimonColor.Blue)}
          />

          {/* BOTTOM-RIGHT: YELLOW (Key 4) */}
          <SectorButton
            color={SimonColor.Yellow}
            isActive={activeLitColor === SimonColor.Yellow}
            isDisabled={isDisabled}
            onClick={() => onColorClick(SimonColor.Yellow)}
          />
        </div>

        {/* Center Orb Hub */}
        <CenterHub
          status={status}
          round={round}
          timeLeft={timeLeft}
          onClick={onCenterHubClick}
        />
      </div>
    </div>
  )
}
