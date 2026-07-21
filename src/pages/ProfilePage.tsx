import { motion } from 'framer-motion'
import { Container } from '@/components/ui'
import { PlayerProfileCard } from '@/components/profile'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function ProfilePage() {
  useDocumentTitle('Profile')
  return (
    <Container className="py-2 select-none">
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4 flex items-center justify-between"
      >
        <div>
          <span className="text-[10px] font-bold tracking-widest text-[#38bdf8] uppercase">👤 PLAYER PROFILE</span>
          <h1 className="text-xl font-bold tracking-tight mt-0.5">Profile & Stats</h1>
        </div>
      </motion.div>
      <div className="mx-auto max-w-md">
        <PlayerProfileCard />
      </div>
    </Container>
  )
}
