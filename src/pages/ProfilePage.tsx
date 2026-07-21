import { motion } from 'framer-motion'
import { Container } from '@/components/ui'
import { PlayerProfileCard } from '@/components/profile'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function ProfilePage() {
  useDocumentTitle('Profile')
  return (
    <Container className="py-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex items-center justify-between"
      >
        <div>
          <span className="text-[9px] font-black tracking-[0.4em] text-[#22c55e] uppercase">👤 Identity</span>
          <h1 className="font-game text-xl font-black text-white mt-0.5">Agent Profile</h1>
        </div>
      </motion.div>
      <div className="mx-auto max-w-md">
        <PlayerProfileCard />
      </div>
    </Container>
  )
}
