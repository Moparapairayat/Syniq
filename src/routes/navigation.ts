import type { NavigationItem } from '@/types/navigation'
import { RoutePath } from './routePaths'

export const mainNavigationItems = [
  {
    label: 'Home',
    path: RoutePath.home,
  },
  {
    label: 'Game',
    path: RoutePath.game,
  },
  {
    label: 'Profile',
    path: RoutePath.profile,
  },
  {
    label: 'Leaderboard',
    path: RoutePath.leaderboard,
  },
  {
    label: 'Settings',
    path: RoutePath.settings,
  },
] as const satisfies readonly NavigationItem[]
