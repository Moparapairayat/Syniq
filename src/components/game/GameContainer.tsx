import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '@/hooks/useGame'
import { Modal, AnimatedButton } from '@/components/ui'
import { GameBoard } from './GameBoard'
import { StatusPanel } from './StatusPanel'
import { ControlPanel } from './ControlPanel'
import { GameStatus } from '@/core/game/GameStatus'
import { GameMode } from '@/core/game/GameMode'

export function GameContainer() {
  const location = useLocation()
  const navigate = useNavigate()
  const routeMode = (location.state as { mode?: GameMode })?.mode || GameMode.Classic

  const { state, activeLitColor, timeLeft, startGame, submitInput, resetGame, nextRound, isPlaybackActive } = useGame()

  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [screenFlash, setScreenFlash] = useState(false)
  const prevRound = useRef(state.round)

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

  const isBoardDisabled = isPlaybackActive

  return (
    <div className="relative mx-auto flex w-full max-w-[480px] flex-col items-center gap-5 py-3 select-none">
      {/* Screen flash overlay — soft */}
      {screenFlash && (
        <div
          className="screen-flash"
          style={{ background: state.status === GameStatus.GameOver ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.08)' }}
        />
      )}

      {/* ── Status Panel ── */}
      <StatusPanel
        playerInputLength={state.playerInput.length}
        status={state.status}
        targetSequenceLength={state.sequence.length}
      />

      {/* ── Simon Wheel ── */}
      <div className="relative w-full">
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

      {/* ── Control Panel ── */}
      <ControlPanel
        onNextRound={nextRound}
        onReset={resetGame}
        onStart={() => startGame(routeMode)}
        status={state.status}
      />

      {/* ── Game Over Modal ── */}
      <Modal
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        title="Game Over"
      >
        <div className="flex flex-col items-center gap-5 py-2 text-center select-none">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={showGameOverModal ? { scale: 1, opacity: 1 } : {}}
            className="text-5xl"
          >
            💀
          </motion.div>

          <div>
            <h2 className="font-mono text-xl font-bold uppercase tracking-wider text-rose-400">
              Sequence Failed
            </h2>
            <p className="mt-1.5 text-[10px] tracking-wider uppercase text-slate-400">
              Sequence ended at round {state.round}
            </p>
          </div>

          {/* Stats */}
          <div className="grid w-full grid-cols-2 gap-3">
            <div className="zen-hud-stat">
              <p className="text-[8px] font-bold tracking-widest uppercase leading-none text-slate-400">Final Score</p>
              <p className="mt-1 font-mono text-2xl font-bold text-amber-300">{state.score}</p>
            </div>
            <div className="zen-hud-stat">
              <p className="text-[8px] font-bold tracking-widest uppercase leading-none text-slate-400">Round</p>
              <p className="mt-1 font-mono text-2xl font-bold text-white">{state.round}</p>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2.5">
            <AnimatedButton onClick={handlePlayAgain} className="w-full font-bold tracking-wider">
              ▶ Begin Again
            </AnimatedButton>
            <AnimatedButton
              onClick={() => { setShowGameOverModal(false); navigate('/leaderboard') }}
              variant="secondary"
              className="w-full"
            >
              🏆 View Leaderboard
            </AnimatedButton>
          </div>
        </div>
      </Modal>
    </div>
  )
}
