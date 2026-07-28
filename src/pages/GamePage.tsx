import { useMetaTags } from '@/hooks/useMetaTags'
import { GameContainer } from '@/components/game'

export default function GamePage() {
  useMetaTags({ title: 'Memory Lab', description: 'Play Syniq — the premium Simon-inspired memory challenge. Classic, Speed Rush, Reverse, Time Attack and Daily Challenge modes.' })

  return (
    <div className="game-page-shell game-page-shell-game py-2 select-none">
      <div className="game-page-content game-game-content">
        <GameContainer />
      </div>
    </div>
  )
}
