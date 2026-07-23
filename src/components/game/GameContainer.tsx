import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '@/hooks/useGame'
import { Modal, AnimatedButton, ConfirmationDialog } from '@/components/ui'
import { GameBoard } from './GameBoard'
import { StatusPanel } from './StatusPanel'
import { ControlPanel } from './ControlPanel'
import { GameStatus } from '@/core/game/GameStatus'
import { GameMode } from '@/core/game/GameMode'
import { playerService } from '@/services'

export function GameContainer() {
  const location = useLocation()
  const navigate = useNavigate()
  const routeMode = (location.state as { mode?: GameMode })?.mode || GameMode.Classic

  const { state, activeLitColor, timeLeft, startGame, submitInput, resetGame, nextRound, isPlaybackActive } = useGame()

  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [showQuitDialog, setShowQuitDialog] = useState(false)
  const [screenFlash, setScreenFlash] = useState(false)
  const [bestScore, setBestScore] = useState(0)
  const [isNewBest, setIsNewBest] = useState(false)
  const prevRound = useRef(state.round)
  const bestScoreRef = useRef(0)

  useEffect(() => {
    let isMounted = true
    playerService.getOrCreateProfile().then((profile) => {
      if (!isMounted) return
      bestScoreRef.current = profile.highestScore
      setBestScore(profile.highestScore)
    }).catch(() => undefined)
    return () => { isMounted = false }
  }, [])

  useEffect(() => {
    if (state.status === GameStatus.GameOver) {
      const achievedNewBest = state.score > 0 && state.score > bestScoreRef.current
      setIsNewBest(achievedNewBest)
      if (achievedNewBest) {
        bestScoreRef.current = state.score
        setBestScore(state.score)
      }
      setScreenFlash(true)
      setTimeout(() => setScreenFlash(false), 600)
      Promise.resolve().then(() => setShowGameOverModal(true))
    } else {
      Promise.resolve().then(() => setShowGameOverModal(false))
    }
  }, [state.score, state.status])

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

  const isBoardDisabled = state.status !== GameStatus.PlayerTurn || isPlaybackActive

  const handleQuit = () => {
    setShowQuitDialog(false)
    resetGame()
  }

  const handleReturnToDashboard = () => {
    resetGame()
    navigate('/')
  }

  return (
    <div className="memory-arena relative mx-auto flex w-full max-w-[480px] flex-col items-center gap-5 overflow-hidden py-3 select-none">
      <div className="memory-arena-orb memory-arena-orb-one" aria-hidden="true" />
      <div className="memory-arena-orb memory-arena-orb-two" aria-hidden="true" />
      {/* Screen flash overlay — soft */}
      {screenFlash && (
        <div
          className="screen-flash"
          style={{ background: state.status === GameStatus.GameOver ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.08)' }}
        />
      )}

      <div className="relative z-10 w-full">
        <div className="memory-hud" aria-label="Game metrics">
          <div className="memory-hud-metric"><span>Round</span><strong>{state.round || '—'}</strong></div>
          <div className="memory-hud-divider" aria-hidden="true" />
          <div className="memory-hud-metric memory-hud-score"><span>Score</span><strong>{state.score.toLocaleString()}</strong></div>
          <div className="memory-hud-divider" aria-hidden="true" />
          <div className="memory-hud-metric"><span>Best</span><strong>{bestScore.toLocaleString()}</strong></div>
        </div>
        <StatusPanel playerInputLength={state.playerInput.length} status={state.status} targetSequenceLength={state.sequence.length} />
      </div>

      {/* ── Simon Wheel ── */}
      <div className="relative z-10 w-full">
        <GameBoard
          activeLitColor={activeLitColor}
          isDisabled={isBoardDisabled}
          onColorClick={(color) => {
            if (state.status === GameStatus.Idle || state.status === GameStatus.GameOver) {
              startGame(routeMode)
            } else if (state.status === GameStatus.PlayerTurn) {
              submitInput(color)
            }
          }}
          round={state.round}
          status={state.status}
          timeLeft={timeLeft}
          onCenterHubClick={() => {
            if (state.status === GameStatus.Idle || state.status === GameStatus.GameOver) {
              startGame(routeMode)
            }
          }}
        />
      </div>

      <div className="relative z-10 w-full">
        <p className="memory-input-guide" aria-live="polite">
          {state.status === GameStatus.Idle || state.status === GameStatus.GameOver
            ? 'Tap the centre core to begin'
            : state.status === GameStatus.PlayerTurn
              ? 'Keyboard: 1 Red · 2 Green · 3 Blue · 4 Yellow'
              : 'Stay focused. The pattern is loading.'}
        </p>
        <ControlPanel onNextRound={nextRound} onQuitRequest={() => setShowQuitDialog(true)} onReturnToDashboard={handleReturnToDashboard} status={state.status} />
      </div>

      {/* ── Game Over Modal ── */}
      <Modal
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        title="Run complete"
      >
        <div className="flex flex-col items-center gap-5 py-2 text-center select-none">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={showGameOverModal ? { scale: 1, opacity: 1 } : {}}
            aria-hidden="true"
            className="memory-result-mark"
          >
            !
          </motion.div>

          <div>
            <h2 className="font-mono text-xl font-bold uppercase tracking-wider text-rose-400">
              Pattern lost
            </h2>
            <p className="mt-1.5 text-[10px] tracking-wider uppercase text-slate-400">
              You reached round {state.round}
            </p>
            {isNewBest && <p className="memory-new-best">New personal best</p>}
          </div>

          {/* Stats */}
          <div className="grid w-full grid-cols-3 gap-2">
            <div className="zen-hud-stat">
              <p className="text-[8px] font-bold tracking-widest uppercase leading-none text-slate-400">Score</p>
              <p className="mt-1 font-mono text-xl font-bold text-amber-300">{state.score}</p>
            </div>
            <div className="zen-hud-stat">
              <p className="text-[8px] font-bold tracking-widest uppercase leading-none text-slate-400">Round</p>
              <p className="mt-1 font-mono text-xl font-bold text-white">{state.round}</p>
            </div>
            <div className="zen-hud-stat">
              <p className="text-[8px] font-bold tracking-widest uppercase leading-none text-slate-400">Best</p>
              <p className="mt-1 font-mono text-xl font-bold text-cyan-300">{bestScore}</p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2.5">
            <AnimatedButton onClick={handlePlayAgain} className="w-full font-bold tracking-wider">
              Play again
            </AnimatedButton>
            <AnimatedButton
              onClick={() => { setShowGameOverModal(false); navigate('/leaderboard') }}
              variant="secondary"
              className="w-full"
            >
              View leaderboard
            </AnimatedButton>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        cancelLabel="Keep playing"
        confirmLabel="End run"
        isDanger
        isOpen={showQuitDialog}
        message="Your current round will be discarded. This cannot be resumed."
        onClose={() => setShowQuitDialog(false)}
        onConfirm={handleQuit}
        title="End this run?"
      />
    </div>
  )
}
