import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { RoutePath } from '@/routes/routePaths'
import { playerService } from '@/services'
import { GameMode } from '@/core/game/GameMode'
import simonForestBackground from '@/assets/Gemini_Generated_Image_g2o2jfg2o2jfg2o2.png'

const MODE_LABELS: Record<GameMode, string> = {
  [GameMode.Classic]: 'Classic memory',
  [GameMode.SpeedRush]: 'Speed rush',
  [GameMode.Reverse]: 'Reverse recall',
  [GameMode.TimeAttack]: 'Time attack',
}

export default function HomePage() {
  useDocumentTitle('Syniq - Memory Training')
  const navigate = useNavigate()

  const [highScore, setHighScore] = useState(0)
  const [lastMode, setLastMode] = useState<GameMode>(GameMode.Classic)

  useEffect(() => {
    let active = true
    async function loadStats() {
      try {
        const profile = await playerService.getOrCreateProfile()
        if (!active) return
        setHighScore(profile.highestScore)
        const storedMode = localStorage.getItem('syniq-last-mode') as GameMode | null
        if (storedMode && Object.values(GameMode).includes(storedMode)) setLastMode(storedMode)
      } catch (e) {
        console.error(e)
      }
    }
    loadStats()
    return () => { active = false }
  }, [])

  const startMode = (mode: GameMode) => {
    localStorage.setItem('syniq-last-mode', mode)
    setLastMode(mode)
    navigate(RoutePath.game, { state: { mode } })
  }

  return (
    <div className="simon-home-screen select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="simon-landing-card"
        style={{ backgroundImage: `url(${simonForestBackground})` }}
      >
        <div className="simon-landing-sky" aria-hidden="true" />
        <div className="simon-landing-hills" aria-hidden="true" />
        <div className="simon-landing-topbar">
          <button onClick={() => navigate(RoutePath.profile)} type="button" className="simon-home-profile-token" aria-label="Open profile" title="Profile">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.25" /><path d="M5.5 20c.6-3.4 3-5.25 6.5-5.25s5.9 1.85 6.5 5.25" /></svg>
          </button>
          <span className="simon-coin-counter">✦ {highScore.toLocaleString()}</span>
        </div>
        <button onClick={() => navigate(RoutePath.leaderboard)} type="button" className="simon-leaderboard-launch" aria-label="Open leaderboard">
          <span aria-hidden="true">♛</span>
          <span><small>Hall of fame</small><strong>Rankings</strong></span>
        </button>
        <div className="simon-landing-orbital" aria-hidden="true">
          <span className="is-green" />
          <span className="is-red" />
          <span className="is-blue" />
          <span className="is-yellow" />
          <div className="simon-orbital-core" />
        </div>
        <div className="simon-launch-plaque">
          <div className="simon-plaque-leaf-left" aria-hidden="true" />
          <div className="simon-plaque-leaf-right" aria-hidden="true" />
          <div className="simon-plaque-ribbon-top">
            <span>MEMORY CHALLENGE</span>
          </div>
          <h1 className="simon-plaque-title" aria-label="SYNIQ">
            {"SYNIQ".split("").map((char, index) => (
              <span key={index} style={{ animationDelay: `${index * 0.12}s` }}>
                {char}
              </span>
            ))}
          </h1>
          <div className="simon-plaque-stars" aria-label="Start a Simon memory run">
            <b>★</b><b>★</b><b className="is-muted">★</b>
          </div>
        </div>
        <div className="simon-home-shortcuts" aria-label="Quick navigation">
          <button onClick={() => navigate(RoutePath.settings)} type="button" className="simon-shortcut-card is-settings" aria-label="Open settings" title="Settings">
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M19 12a7.1 7.1 0 0 0-.08-1l2-1.55-2-3.46-2.35.94a7.7 7.7 0 0 0-1.72-1L14.5 3h-4.02l-.35 2.93a7.7 7.7 0 0 0-1.72 1L6.06 5.99l-2 3.46L6.08 11a7.1 7.1 0 0 0 0 2l-2.02 1.55 2 3.46 2.35-.94a7.7 7.7 0 0 0 1.72 1l.35 2.93h4.02l.35-2.93a7.7 7.7 0 0 0 1.72-1l2.35.94 2-3.46L18.92 13c.05-.33.08-.66.08-1z" /></svg>
          </button>
        </div>
        <div className="simon-launch-actions">
          <button onClick={() => startMode(GameMode.Classic)} type="button" className="simon-action-button is-start"><span className="simon-start-wood-icon" aria-hidden="true">▶</span>Start new game</button>
          <button onClick={() => startMode(lastMode)} type="button" className="simon-action-button is-continue">Continue <small>{MODE_LABELS[lastMode]}</small></button>
        </div>
      </motion.div>
    </div>
  )
}
