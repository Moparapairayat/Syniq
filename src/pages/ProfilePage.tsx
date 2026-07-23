import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Container } from '@/components/ui'
import { PlayerProfileCard } from '@/components/profile'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function ProfilePage() {
  useDocumentTitle('Profile')
  const navigate = useNavigate()
  return (
    <Container className="game-page-shell forest-profile-page py-2 select-none">
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="game-page-heading mb-4 flex items-center justify-between"
      >
        <button onClick={() => navigate('/')} type="button" className="game-page-home-button" aria-label="Return home">⌂</button>
        <div>
          <span>Player profile</span>
          <h1>Profile & stats</h1>
        </div>
      </motion.div>
      <div className="game-page-content forest-profile-content mx-auto max-w-md">
        <PlayerProfileCard />
      </div>
    </Container>
  )
}
