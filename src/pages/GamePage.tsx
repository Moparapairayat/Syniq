import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { GameContainer } from '@/components/game'

export default function GamePage() {
  useDocumentTitle('Memory Lab')

  return (
    <div className="game-page-shell game-page-shell-game py-2 select-none">
      <div className="game-page-content game-game-content">
        <GameContainer />
      </div>
    </div>
  )
}
