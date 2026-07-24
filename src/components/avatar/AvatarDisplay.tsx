import { cn } from '@/utils/classNames'
import { AVATARS, AVATAR_SETS } from './avatars'

export interface AvatarDisplayProps {
  readonly avatarId: number
  readonly size?: number
  readonly className?: string
  readonly ringClass?: string
}

export function AvatarDisplay({
  avatarId,
  size = 34,
  className = '',
  ringClass = 'avatar-ring-neon',
}: AvatarDisplayProps) {
  const avatar = AVATARS.find((a) => a.id === avatarId) ?? AVATARS[0]
  const src = AVATAR_SETS[avatar.set]
  return (
    <div
      className={cn('relative overflow-hidden rounded-full', ringClass, className)}
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        backgroundImage: `url(${src})`,
        backgroundSize: '200% 200%',
        backgroundPosition: avatar.pos,
      }}
    />
  )
}
