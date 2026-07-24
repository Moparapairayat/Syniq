import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '@/hooks/useGame'
import { Modal, ConfirmationDialog } from '@/components/ui'
import { GameBoard } from './GameBoard'
import { StatusPanel } from './StatusPanel'
import { ControlPanel } from './ControlPanel'
import { GameStatus } from '@/core/game/GameStatus'
import { GameMode } from '@/core/game/GameMode'
import { playerService, leaderboardService, achievementService, dailyStreakService } from '@/services'
import type { ScoreEntry } from '@/models/ScoreEntry'
import type { Achievement } from '@/models/Achievement'

export function GameContainer() {
  const location = useLocation()
  const navigate = useNavigate()
  const routeMode = (location.state as { mode?: GameMode })?.mode || GameMode.Classic

  const { state, activeLitColor, timeLeft, startGame, submitInput, resetGame, nextRound, isPlaybackActive } = useGame()

  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [showQuitDialog, setShowQuitDialog] = useState(false)
  const [screenFlash, setScreenFlash] = useState(false)
  const [bestScore, setBestScore] = useState(0)
  const [topScores, setTopScores] = useState<ReadonlyArray<ScoreEntry>>([])
  const [newlyUnlocked, setNewlyUnlocked] = useState<ReadonlyArray<Achievement>>([])
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
      if (achievedNewBest) {
        bestScoreRef.current = state.score
        Promise.resolve().then(() => setBestScore(state.score))
      }
      Promise.resolve().then(() => setScreenFlash(true))
      const timer = setTimeout(() => setScreenFlash(false), 600)
      leaderboardService.getTopScores().then((scores) => {
        setTopScores(scores)
      }).catch(() => undefined)

      achievementService.evaluateGameRun({
        round: state.round,
        score: state.score,
        mode: routeMode,
      }).then((unlocked) => {
        setNewlyUnlocked(unlocked)
      }).catch(() => undefined)

      dailyStreakService.recordPlayToday(routeMode === GameMode.DailyChallenge).catch(() => undefined)

      Promise.resolve().then(() => setShowGameOverModal(true))
      return () => clearTimeout(timer)
    } else {
      Promise.resolve().then(() => setShowGameOverModal(false))
    }
  }, [state.score, state.status, state.round, routeMode])

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

      {/* Screen flash overlay */}
      {screenFlash && (
        <div
          className="screen-flash"
          style={{ background: state.status === GameStatus.GameOver ? 'rgba(244,63,94,0.15)' : 'rgba(255,255,255,0.08)' }}
        />
      )}

      {/* Game Metrics HUD & Status Panel */}
      <div className="relative z-10 flex w-full flex-col gap-2">
        <div className="flex w-full items-center gap-2">
          {/* 3D Wood Home Button */}
          <button
            onClick={handleReturnToDashboard}
            type="button"
            aria-label="Return home"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-[2px] border-[#3e2211] bg-gradient-to-b from-[#945525] via-[#753f1a] to-[#54290c] text-xl font-black text-[#fff3cd] shadow-[inset_0_1.5px_0_rgba(255,226,162,0.6),inset_0_-2px_0_rgba(30,12,4,0.6),0_4px_0_#381c0d,0_8px_16px_rgba(5,15,5,0.6)] transition-transform active:translate-y-0.5 cursor-pointer outline-none hover:scale-105"
          >
            ⌂
          </button>
          <div className="memory-hud flex-1" aria-label="Game metrics">
            <div className="memory-hud-metric"><span>Round</span><strong>{state.round || '—'}</strong></div>
            <div className="memory-hud-divider" aria-hidden="true" />
            <div className="memory-hud-metric memory-hud-score"><span>Score</span><strong>{state.score.toLocaleString()}</strong></div>
            <div className="memory-hud-divider" aria-hidden="true" />
            <div className="memory-hud-metric"><span>Best</span><strong>{bestScore.toLocaleString()}</strong></div>
          </div>
        </div>
        <StatusPanel playerInputLength={state.playerInput.length} status={state.status} targetSequenceLength={state.sequence.length} />
      </div>

      {/* ── Simon Wheel GameBoard ── */}
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

      {/* Control Panel */}
      <div className="relative z-10 w-full">
        <ControlPanel onNextRound={nextRound} onQuitRequest={() => setShowQuitDialog(true)} onReturnToDashboard={handleReturnToDashboard} status={state.status} />
      </div>

      {/* ── Game Over Modal ── */}
      <Modal
        isOpen={showGameOverModal}
        onClose={() => setShowGameOverModal(false)}
        title="GAME OVER"
      >
        <div className="flex flex-col items-center gap-4 py-1 text-center select-none">

          {/* Animated Skull / Emblem Mark */}
          <motion.div
            initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
            animate={showGameOverModal ? { scale: 1, rotate: 0, opacity: 1 } : {}}
            transition={{ type: 'spring', bounce: 0.5 }}
            aria-hidden="true"
            className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#78350f] bg-gradient-to-b from-[#b91c1c] via-[#991b1b] to-[#450a0a] text-3xl shadow-[inset_0_2px_0_rgba(255,255,255,0.4),0_6px_12px_rgba(0,0,0,0.6)]"
          >
            💀
          </motion.div>

          <div>
            <h2 className="text-xl font-black uppercase tracking-wider text-[#fca5a5]">
              PATTERN LOST!
            </h2>
            <p className="mt-1 text-xs font-bold text-[#ffe49e]/70 uppercase tracking-widest">
              REACHED ROUND {state.round}
            </p>
            {newlyUnlocked.length > 0 && (
              <div className="mx-auto mt-2 flex flex-col items-center gap-1 rounded-2xl border border-[#fcd34d] bg-gradient-to-r from-[#d97706]/40 via-[#fcd34d]/20 to-[#d97706]/40 p-2 text-center shadow-[0_0_15px_rgba(252,211,77,0.3)] animate-pulse">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#fcd34d]">
                  🎉 {newlyUnlocked.length} NEW ACHIEVEMENT{newlyUnlocked.length > 1 ? 'S' : ''} UNLOCKED!
                </span>
                <div className="flex flex-wrap items-center justify-center gap-1.5 mt-0.5">
                  {newlyUnlocked.map((ach) => (
                    <span key={ach.id} className="inline-flex items-center gap-1 rounded-lg bg-[#3a1d0d] px-2 py-0.5 text-xs font-bold text-[#fff3cd] border border-[#fcd34d]/50">
                      <span>{ach.icon}</span> {ach.title}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid w-full grid-cols-3 gap-2 mt-1">
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-2.5 shadow-inner">
              <p className="text-[9px] font-black tracking-widest uppercase text-[#ffe49e]">SCORE</p>
              <p className="mt-0.5 font-mono text-lg font-black text-[#fcd34d]">{state.score}</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-2.5 shadow-inner">
              <p className="text-[9px] font-black tracking-widest uppercase text-[#ffe49e]">ROUND</p>
              <p className="mt-0.5 font-mono text-lg font-black text-white">{state.round}</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl border border-[#8a4e22]/50 bg-[#3a1d0d]/85 p-2.5 shadow-inner">
              <p className="text-[9px] font-black tracking-widest uppercase text-[#ffe49e]">BEST</p>
              <p className="mt-0.5 font-mono text-lg font-black text-[#38bdf8]">{bestScore}</p>
            </div>
          </div>

          {/* Top 10 High Scores Section (Syllabus Requirement) */}
          <div className="w-full rounded-2xl border border-[#8a4e22]/60 bg-[#2a1307]/80 p-3 text-left shadow-inner mt-1">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#78350f]/50">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#fcd34d]">
                🏆 TOP 10 HIGH SCORES
              </span>
              <span className="text-[9px] font-bold text-[#ffe49e]/70">
                GLOBAL RANKINGS
              </span>
            </div>
            <div className="mt-2 max-h-32 overflow-y-auto pr-1 flex flex-col gap-1 custom-scrollbar">
              {topScores.length === 0 ? (
                <p className="py-2 text-center text-xs text-[#ffe49e]/60">No scores recorded yet</p>
              ) : (
                topScores.slice(0, 10).map((entry, idx) => (
                  <div
                    key={entry.id || idx}
                    className={`flex items-center justify-between rounded-lg px-2.5 py-1 text-xs ${
                      entry.score === state.score
                        ? 'bg-[#d97706]/40 border border-[#fcd34d] font-bold text-[#fcd34d]'
                        : 'bg-[#3e2211]/60 text-[#fff3cd]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 font-mono font-bold text-[10px] text-[#ffe49e]/70">
                        #{idx + 1}
                      </span>
                      <span className="font-bold truncate max-w-[120px]">
                        {entry.playerName}
                      </span>
                    </div>
                    <span className="font-mono font-black text-[#fcd34d]">
                      {entry.score} PTS
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full flex-col gap-2.5 mt-2">
            <button
              type="button"
              onClick={handlePlayAgain}
              className="w-full rounded-xl border border-[#78350f] bg-gradient-to-b from-[#fcd34d] via-[#f59e0b] to-[#d97706] py-3 text-xs font-black uppercase tracking-widest text-[#3a1d0d] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_3px_0_#78350f,0_6px_12px_rgba(0,0,0,0.4)] transition-transform active:translate-y-0.5 cursor-pointer outline-none"
            >
              🔄 PLAY AGAIN
            </button>
            <button
              type="button"
              onClick={() => { setShowGameOverModal(false); navigate('/leaderboard') }}
              className="w-full rounded-xl border border-[#5a341a] bg-gradient-to-b from-[#9e5d2b] to-[#5a2e12] py-2.5 text-xs font-black uppercase tracking-widest text-[#fff3cd] shadow-[inset_0_1px_0_rgba(255,226,162,0.4),0_2px_0_#2b1408] transition-transform active:translate-y-0.5 cursor-pointer outline-none"
            >
              🏆 VIEW LEADERBOARD
            </button>
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
