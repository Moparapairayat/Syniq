import avatarSet1 from '@/assets/avatars-set1.png'
import avatarSet2 from '@/assets/avatars-set2.png'
import avatarSet3 from '@/assets/avatars-set3.png'

export interface AvatarItem {
  readonly id: number
  readonly label: string
  readonly set: number
  readonly pos: string
}

export const AVATARS: ReadonlyArray<AvatarItem> = [
  { id: 1, label: 'Cyberpunk', set: 1, pos: '0% 0%' },
  { id: 2, label: 'Android', set: 1, pos: '100% 0%' },
  { id: 3, label: 'Mage', set: 1, pos: '0% 100%' },
  { id: 4, label: 'Alien', set: 1, pos: '100% 100%' },
  { id: 5, label: 'Marine', set: 2, pos: '0% 0%' },
  { id: 6, label: 'AI Entity', set: 2, pos: '100% 0%' },
  { id: 7, label: 'Dragon', set: 2, pos: '0% 100%' },
  { id: 8, label: 'Space Elf', set: 2, pos: '100% 100%' },
  { id: 9, label: 'Samurai', set: 3, pos: '0% 0%' },
  { id: 10, label: 'Phantom', set: 3, pos: '100% 0%' },
  { id: 11, label: 'Cyber Wolf', set: 3, pos: '0% 100%' },
  { id: 12, label: 'Cosmic', set: 3, pos: '100% 100%' },
]

export const AVATAR_SETS: Record<number, string> = {
  1: avatarSet1,
  2: avatarSet2,
  3: avatarSet3,
}
