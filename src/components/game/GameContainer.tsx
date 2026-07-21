import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/hooks/useGame'
import { Modal, AnimatedButton } from '@/components/ui'
import { GameBoard } from './GameBoard'
import { StatusPanel } from './StatusPanel'
import { ControlPanel } from './ControlPanel'
import { GameStatus } from '@/core/game/GameStatus'
import { GameMode } from '@/core/game/GameMode'
import { SimonColor } from '@/core/game/SimonColor'
import { AvatarDisplay } from '@/layouts/AppLayout'
import { playerService } from '@/services'

const ACCENT = { color: '#7a9e7e', glow: 'rgba(122,158,126,0.15)' } as const

const ambientMap = {
  [SimonColor.Red]:    { color: 'rgba(198,123,92,0.12)',  glow: '0 0 100px 40px rgba(198,123,92,0.08)' },
  [SimonColor.Green]:  { color: 'rgba(122,158,126,0.12)', glow: '0 0 100px 40px rgba(122,158,126,0.08)' },
  [SimonColor.Blue]:   { color: 'rgba(122,158,176,0.12)', glow: '0 0 100px 40px rgba(122,158,176,0.08)' },
  [SimonColor.Yellow]: { color: 'rgba(212,167,106,0.12)', glow: '0 0 100px 40px rgba(212,167,106,0.08)' },
}

/* Soft floating orb — zen drift */
function ZenOrb({ color, size, style }: { color: string; size: number; style?: React.CSSProperties }) {
  return (
    <div
      className="zen-orb"
      style={{
        width: size, height: size,
        background: color,
        ...style,
      }}
    />
  )
}

/**
 * Zen GameContainer — warm stone, soft ambient, calm HUD,
 * meditative game-over modal.
 */
export function GameContainer() {
  const location = useLocation()
  const navigate = useNavigate()
  const routeMode = (location.state as { mode?: GameMode })?.mode || GameMode.Classic

  const { state, activeLitColor, timeLeft, startGame, submitInput, resetGame, nextRound, isPlaybackActive } = useGame()

  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [screenFlash, setScreenFlash] = useState(false)
  const [avatarId, setAvatarId] = useState(1)
  const [playerName, setPlayerName] = useState('Player')
  const prevRound = useRef(state.round)

  useEffect(() => {
    playerService.getOrCreateProfile().then((p) => {
      setPlayerName(p.name)
      const stored = localStorage.getItem('syniq-avatar-id')
      if (stored) setAvatarId(parseInt(stored, 10))
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (state.status === GameStatus.GameOver) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setScreenFlash(true)
      setTimeout(() => setScreenFlash(false), 600)
      Promise.resolve().then(() => setShowGameOverModal(true))
    } else {
      Promise.resolve().then(() => setShowGameOverModal(false))
    }
  }, [state.status])

  /* Screen flash on round clear */
  useEffect(() => {
    if (state.round > prevRound.current && state.status === GameStatus.RoundCompleted) {
      setScreenFlash(true)
      setTimeout(() => setScreenFlash(false), 450)
    }
    prevRound.current = state.round
  }, [state.round, state.status])

  const handlePlayAgain = () => {
    setShowGameOverModal(false)
    resetGame()
    setTimeout(() => startGame(routeMode), 150)
  }

  const isBoardDisabled = isPlaybackActive || state.status !== GameStatus.PlayerTurn
  const ambient = activeLitColor ? ambientMap[activeLitColor] : null
  const accent = ACCENT

  return (
    <div className="relative mx-auto flex w-full max-w-[480px] flex-col items-center gap-5 py-3">

      {/* ── Soft game arena background ── */}
      <div className="pointer-events-none fixed inset-0 -z-15 overflow-hidden">
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, rgba(122,158,126,0.03) 0%, transparent 65%)',
          }}
        />
      </div>

      {/* ── Ambient color bloom — soft warm ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden">
        <div
          className="zen-orb"
          style={{
            width: 280, height: 280,
            background: ambient?.color ?? 'transparent',
            boxShadow: ambient?.glow,
            opacity: activeLitColor ? 0.6 : 0,
            transform: activeLitColor ? 'scale(1)' : 'scale(0.7)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      {/* Soft orbs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden -z-10">
        <ZenOrb color={`${accent.color}18`} size={100} style={{ top: '5%', right: '5%', animationDelay: '0s' }} />
        <ZenOrb color="rgba(122,158,176,0.10)" size={80} style={{ bottom: '20%', left: '3%', animationDelay: '4s' }} />
      </div>

      {/* Screen flash overlay — soft */}
      {screenFlash && (
        <div
          className="screen-flash"
          style={{ background: state.status === GameStatus.GameOver ? 'rgba(198,123,92,0.15)' : 'rgba(240,236,228,0.08)' }}
        />
      )}

      {/* ── Top HUD Bar ── */}
      <div className="flex w-full items-center justify-between gap-2">
        {/* Left: avatar + mode */}
        <div className="flex items-center gap-2">
          <AvatarDisplay avatarId={avatarId} size={34} ringClass="avatar-ring-zen" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[9px] font-semibold tracking-widest uppercase leading-none" style={{ color: 'var(--color-text-tertiary)', opacity: 0.7 }}>Agent</span>
            <span className="text-xs font-semibold leading-none truncate max-w-[70px]" style={{ color: 'var(--color-text-primary)' }}>{playerName}</span>
          </div>
        </div>

        {/* Center: game title */}
        <div
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5"
          style={{
            background: 'rgba(122,158,126,0.08)',
            border: '1px solid rgba(122,158,126,0.15)',
          }}
        >
          <span className="text-sm">🧘</span>
          <span className="text-[9px] font-semibold tracking-wider uppercase" style={{ color: 'var(--color-accent)' }}>
            Syniq
          </span>
        </div>

        {/* Right: score + round */}
        <div className="flex items-center gap-2">
          <div className="zen-hud-stat">
            <p className="text-[7px] font-semibold tracking-widest uppercase leading-none" style={{ color: 'var(--color-text-tertiary)', opacity: 0.6 }}>Rnd</p>
            <p className="font-game text-base leading-none font-semibold" style={{ color: 'var(--color-text-primary)' }}>{state.round}</p>
          </div>
          <div className="zen-hud-stat">
            <p className="text-[7px] font-semibold tracking-widest uppercase leading-none" style={{ color: 'var(--color-text-tertiary)', opacity: 0.6 }}>Score</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={state.score}
                initial={{ scale: 1.15, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 280, damping: 16 }}
                className="font-game text-base leading-none font-semibold"
                style={{ color: '#c4b498' }}
              >
                {state.score}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Status Panel ── */}
      <StatusPanel
        playerInputLength={state.playerInput.length}
        status={state.status}
        targetSequenceLength={state.sequence.length}
      />

      {/* ── Simon Wheel with soft arena ring ── */}
      <div className="relative w-full">
        {/* Soft outer ring */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full transition-all duration-700"
          style={{
            background: `radial-gradient(ellipse at 50% 50%, ${ambient?.color ?? 'transparent'} 0%, transparent 70%)`,
            transform: 'scale(1.15)',
            opacity: activeLitColor ? 0.5 : 0,
          }}
        />
        <GameBoard
          activeLitColor={activeLitColor}
          isDisabled={isBoardDisabled}
          onColorClick={submitInput}
          round={state.round}
          status={state.status}
          timeLeft={timeLeft}
        />
      </div>

      {/* ── Control Panel ── */}
      <ControlPanel
        onNextRound={nextRound}
        onReset={resetGame}
        onStart={() => startGame(routeMode)}
        status={state.status}
      />

      {/* ── Game Over Modal — Zen ── */}
      <Modal
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        title="Game Over"
      >
        <div className="flex flex-col items-center gap-5 py-2 text-center select-none">
          {/* Leaf icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotate: -6 }}
            animate={showGameOverModal ? { scale: 1, opacity: 1, rotate: 0 } : {}}
            transition={{ type: 'spring', stiffness: 220, damping: 16 }}
            className="text-5xl"
            style={{ filter: 'drop-shadow(0 0 16px rgba(198,123,92,0.35))' }}
          >
            🍂
          </motion.div>

          <div>
            <h2 className="font-game text-xl font-semibold uppercase tracking-wider"
              style={{
                background: 'linear-gradient(135deg, #d4957a, #a05c3f)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Stillness
            </h2>
            <p className="mt-1.5 text-[10px] tracking-wider uppercase" style={{ color: 'var(--color-text-tertiary)', opacity: 0.7 }}>
              Sequence faded at round {state.round}
            </p>
          </div>

          {/* Stats */}
          <div className="grid w-full grid-cols-2 gap-3">
            <div className="zen-hud-stat">
              <p className="text-[8px] font-semibold tracking-widest uppercase leading-none" style={{ color: 'var(--color-text-tertiary)', opacity: 0.6 }}>Final Score</p>
              <p className="mt-1 font-game text-2xl font-semibold" style={{ color: '#c4b498' }}>{state.score}</p>
            </div>
            <div className="zen-hud-stat">
              <p className="text-[8px] font-semibold tracking-widest uppercase leading-none" style={{ color: 'var(--color-text-tertiary)', opacity: 0.6 }}>Round</p>
              <p className="mt-1 font-game text-2xl font-semibold" style={{ color: 'var(--color-text-primary)' }}>{state.round}</p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2.5">
            <AnimatedButton onClick={handlePlayAgain} className="w-full font-semibold tracking-wider">
              🍃 Begin Again
            </AnimatedButton>
            <AnimatedButton
              onClick={() => { setShowGameOverModal(false); navigate('/leaderboard') }}
              variant="secondary"
              className="w-full"
            >
              🏔 View Journey
            </AnimatedButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
