import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { GameContainer } from '@/components/game'
import { useNavigate } from 'react-router-dom'

export default function GamePage() {
  useDocumentTitle('Memory Lab')
  const navigate = useNavigate()

  return (
    <div className="game-page-shell game-page-shell-game py-2 select-none">
      <button onClick={() => navigate('/')} type="button" className="game-page-home-button game-page-game-home" aria-label="Return home">⌂</button>
      <div className="game-page-content game-game-content">
        <GameContainer />
      </div>
    </div>
  )
}
