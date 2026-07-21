import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { GameContainer } from '@/components/game'

export default function GamePage() {
  useDocumentTitle('Memory Lab')

  return (
    <div className="py-2">
      <GameContainer />
    </div>
  )
}
